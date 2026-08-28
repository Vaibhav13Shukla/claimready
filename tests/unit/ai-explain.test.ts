import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { generatePlainExplanation } from "../../src/ai/explain";

const generateTextMock = vi.fn();
vi.mock("ai", () => ({
  generateText: (...args: unknown[]) => generateTextMock(...args),
}));
vi.mock("@ai-sdk/openai", () => ({
  openai: (model: string) => ({ modelId: model }),
}));

describe("generatePlainExplanation (falls back to curated text without an OPENAI_API_KEY)", () => {
  it("returns the deterministic English explanation for each known root cause", async () => {
    expect(process.env.OPENAI_API_KEY).toBeUndefined();
    const codes = ["RC01", "RC02", "RC03", "RC04", "RC05"] as const;
    for (const code of codes) {
      const { explanation, source } = await generatePlainExplanation({
        root_cause_code: code,
        owner: "MEMBER_SELF",
        language: "en",
      });
      expect(source).toBe("deterministic");
      expect(explanation.length).toBeGreaterThan(20);
    }
  });

  it("returns the deterministic Hindi explanation when language is hi", async () => {
    const { explanation, source } = await generatePlainExplanation({
      root_cause_code: "RC03",
      owner: "BANK",
      language: "hi",
    });
    expect(source).toBe("deterministic");
    expect(explanation).toMatch(/[ऀ-ॿ]/); // contains Devanagari
  });

  it("falls back to the UNKNOWN explanation for an unrecognized root cause", async () => {
    const { explanation } = await generatePlainExplanation({
      // Deliberately outside the known-code map to exercise the fallback-of-fallback.
      root_cause_code: "UNKNOWN",
      owner: "EPFO_OFFICE",
      language: "en",
    });
    expect(explanation.toLowerCase()).toContain("couldn't safely");
  });
});

describe("generatePlainExplanation (mocked OpenAI call, WITH an API key)", () => {
  const ORIGINAL_KEY = process.env.OPENAI_API_KEY;

  beforeEach(() => {
    process.env.OPENAI_API_KEY = "test-key-not-real";
    generateTextMock.mockReset();
  });

  afterEach(() => {
    process.env.OPENAI_API_KEY = ORIGINAL_KEY;
  });

  it("returns ai_assisted with the model's text on a valid response", async () => {
    generateTextMock.mockResolvedValue({
      text: "Your bank account needs to be re-verified before EPFO can pay out.",
    });

    const { explanation, source } = await generatePlainExplanation({
      root_cause_code: "RC03",
      owner: "BANK",
      language: "en",
    });
    expect(source).toBe("ai_assisted");
    expect(explanation).toBe("Your bank account needs to be re-verified before EPFO can pay out.");
  });

  it("falls back to deterministic when the model returns near-empty text", async () => {
    generateTextMock.mockResolvedValue({ text: "ok" }); // < 10 chars

    const { source } = await generatePlainExplanation({
      root_cause_code: "RC01",
      owner: "MEMBER_SELF",
      language: "en",
    });
    expect(source).toBe("deterministic");
  });

  it("falls back to deterministic when the OpenAI call throws", async () => {
    generateTextMock.mockRejectedValue(new Error("network error"));

    const { source, explanation } = await generatePlainExplanation({
      root_cause_code: "RC04",
      owner: "EMPLOYER",
      language: "en",
    });
    expect(source).toBe("deterministic");
    expect(explanation.length).toBeGreaterThan(20);
  });
});
