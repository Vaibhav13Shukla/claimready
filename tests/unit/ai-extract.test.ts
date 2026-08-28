import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { heuristicExtract, aiExtract } from "../../src/ai/extract";

// Mocked so the "genuinely OpenAI-powered" branch (success, invalid-schema,
// and thrown-error) can be exercised deterministically, without a real
// network call or API key.
const generateObjectMock = vi.fn();
vi.mock("ai", () => ({
  generateObject: (...args: unknown[]) => generateObjectMock(...args),
}));
vi.mock("@ai-sdk/openai", () => ({
  openai: (model: string) => ({ modelId: model }),
}));

describe("heuristicExtract (deterministic fallback, no API key needed)", () => {
  it("detects a known error phrase verbatim with high confidence", () => {
    const r = heuristicExtract({ text: "Claim rejected: Name mismatch as per Aadhaar" });
    expect(r.raw_error_text).toBe("Claim rejected: Name mismatch as per Aadhaar");
    expect(r.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it("infers FINAL_SETTLEMENT from 'Form 19' / 'full withdrawal' language", () => {
    expect(heuristicExtract({ text: "Form 19 rejected" }).scheme).toBe("FINAL_SETTLEMENT");
    expect(heuristicExtract({ text: "full withdrawal claim failed" }).scheme).toBe("FINAL_SETTLEMENT");
  });

  it("infers PF_ADVANCE from 'Form 31' / 'medical' / 'housing' language", () => {
    expect(heuristicExtract({ text: "Form 31 advance rejected" }).scheme).toBe("PF_ADVANCE");
    expect(heuristicExtract({ text: "medical advance claim" }).scheme).toBe("PF_ADVANCE");
  });

  it("infers PENSION_EPS from 'pension' / 'EPS' / 'Form 10C' language", () => {
    expect(heuristicExtract({ text: "pension claim rejected" }).scheme).toBe("PENSION_EPS");
    expect(heuristicExtract({ text: "Form 10C rejected" }).scheme).toBe("PENSION_EPS");
  });

  it("schemeHint overrides the inferred scheme", () => {
    const r = heuristicExtract({ text: "pension claim rejected", schemeHint: "PF_ADVANCE" });
    expect(r.scheme).toBe("PF_ADVANCE");
  });

  it("passes through any non-trivial text at lower confidence when no known phrase matches", () => {
    const r = heuristicExtract({ text: "some unrelated but non-empty text" });
    expect(r.raw_error_text).toBe("some unrelated but non-empty text");
    expect(r.confidence).toBeLessThan(0.9);
    expect(r.confidence).toBeGreaterThan(0);
  });

  it("returns low confidence and no text for empty/whitespace-only input", () => {
    const r = heuristicExtract({ text: "   " });
    expect(r.raw_error_text).toBeNull();
    expect(r.confidence).toBe(0.1);
  });

  it("returns low confidence and no text when text is entirely absent", () => {
    const r = heuristicExtract({});
    expect(r.raw_error_text).toBeNull();
    expect(r.scheme).toBeNull();
  });
});

describe("aiExtract (falls back to heuristic without an OPENAI_API_KEY)", () => {
  it("falls back to fixture_rules source when no API key is configured", async () => {
    // The test environment never sets OPENAI_API_KEY, so this exercises the
    // real no-key branch rather than a mock.
    expect(process.env.OPENAI_API_KEY).toBeUndefined();
    const { result, source } = await aiExtract({
      text: "Claim rejected: Name mismatch as per Aadhaar",
    });
    expect(source).toBe("fixture_rules");
    expect(result.raw_error_text).toBe("Claim rejected: Name mismatch as per Aadhaar");
  });

  it("also falls back cleanly for very short / near-empty text", async () => {
    const { source, result } = await aiExtract({ text: "ab" });
    expect(source).toBe("fixture_rules");
    expect(result.confidence).toBeLessThanOrEqual(1);
  });
});

describe("aiExtract (mocked OpenAI call, WITH an API key)", () => {
  const ORIGINAL_KEY = process.env.OPENAI_API_KEY;

  beforeEach(() => {
    process.env.OPENAI_API_KEY = "test-key-not-real";
    generateObjectMock.mockReset();
  });

  afterEach(() => {
    process.env.OPENAI_API_KEY = ORIGINAL_KEY;
  });

  it("returns ai_assisted and the model's structured object on a valid response", async () => {
    generateObjectMock.mockResolvedValue({
      object: {
        scheme: "PF_ADVANCE",
        raw_error_text: "Bank KYC not verified",
        visible_date: "2026-01-01",
        confidence: 0.93,
      },
    });

    const { result, source } = await aiExtract({ text: "some rejection screenshot text" });
    expect(source).toBe("ai_assisted");
    expect(result.scheme).toBe("PF_ADVANCE");
    expect(result.raw_error_text).toBe("Bank KYC not verified");
    expect(result.confidence).toBe(0.93);
  });

  it("prefers the member's schemeHint when the model returns scheme: null", async () => {
    generateObjectMock.mockResolvedValue({
      object: { scheme: null, raw_error_text: "some remark", visible_date: null, confidence: 0.7 },
    });

    const { result } = await aiExtract({
      text: "some rejection text",
      schemeHint: "PENSION_EPS",
    });
    expect(result.scheme).toBe("PENSION_EPS");
  });

  it("falls back to fixture_rules when the model's response fails schema validation", async () => {
    generateObjectMock.mockResolvedValue({
      object: { scheme: "NOT_A_REAL_SCHEME", raw_error_text: 12345, confidence: "high" },
    });

    const { source } = await aiExtract({ text: "Claim rejected: Name mismatch as per Aadhaar" });
    expect(source).toBe("fixture_rules");
  });

  it("falls back to fixture_rules when the OpenAI call throws", async () => {
    generateObjectMock.mockRejectedValue(new Error("network error"));

    const { source, result } = await aiExtract({ text: "Claim rejected: Name mismatch as per Aadhaar" });
    expect(source).toBe("fixture_rules");
    expect(result.raw_error_text).toBe("Claim rejected: Name mismatch as per Aadhaar");
  });
});
