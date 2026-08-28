import { describe, it, expect } from "vitest";
import { diagnose } from "../../src/core/classifier";
import type { DiagnosisResult, Scheme } from "../../src/core/taxonomy/taxonomy.schema";

interface GoldenCase {
  id: string;
  scheme: Scheme;
  input: string;
  expected: { root_cause: string; owner: string; remedy_type: string; min_confidence: number };
}

const goldenCases: GoldenCase[] = [
  {
    id: "GC-01",
    scheme: "FINAL_SETTLEMENT",
    input: "Claim rejected: Name mismatch as per Aadhaar",
    expected: { root_cause: "RC01", owner: "MEMBER_SELF", remedy_type: "member_correction", min_confidence: 0.5 },
  },
  {
    id: "GC-02",
    scheme: "PF_ADVANCE",
    input: "Rejected: Name mismatch between UAN and bank KYC",
    expected: { root_cause: "RC01", owner: "MEMBER_SELF", remedy_type: "member_correction", min_confidence: 0.5 },
  },
  {
    id: "GC-03",
    scheme: "FINAL_SETTLEMENT",
    input: "Claim rejected: Date of Birth not matching Aadhaar",
    expected: { root_cause: "RC02", owner: "MEMBER_SELF", remedy_type: "member_correction", min_confidence: 0.5 },
  },
  {
    id: "GC-04",
    scheme: "PF_ADVANCE",
    input: "Rejected: Bank KYC not verified / account inactive",
    expected: { root_cause: "RC03", owner: "BANK", remedy_type: "bank_fix", min_confidence: 0.5 },
  },
  {
    id: "GC-05",
    scheme: "FINAL_SETTLEMENT",
    input: "Rejected: Date of Exit not updated by employer",
    expected: { root_cause: "RC04", owner: "EMPLOYER", remedy_type: "employer_request", min_confidence: 0.5 },
  },
  {
    id: "GC-06",
    scheme: "PENSION_EPS",
    input: "Claim rejected: IFSC mismatch, payment returned by bank",
    expected: { root_cause: "RC03", owner: "BANK", remedy_type: "bank_fix", min_confidence: 0.5 },
  },
];

describe("Golden Case Gate — classifier must pass all 6/6 EPFO cases deterministically", () => {
  goldenCases.forEach((gc) => {
    it(`${gc.id}: ${gc.input} → ${gc.expected.root_cause}`, () => {
      const result: DiagnosisResult = diagnose({ rawErrorText: gc.input, scheme: gc.scheme });
      expect(result.root_cause_code).toBe(gc.expected.root_cause);
      expect(result.owner).toBe(gc.expected.owner);
      expect(result.remedy_type).toBe(gc.expected.remedy_type);
      expect(result.confidence).toBeGreaterThanOrEqual(gc.expected.min_confidence);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(result.label_en).toBeTruthy();
      expect(result.label_hi).toBeTruthy();
      expect(result.explanation_en).toBeTruthy();
      expect(result.explanation_hi).toBeTruthy();
      expect(result.estimated_timeline_days).toBeTruthy();
    });
  });
});

describe("Adversarial & Edge Cases", () => {
  it("ADV-01: emoji + special char noise around a name mismatch", () => {
    const r = diagnose({
      rawErrorText: "🚨 [ALERT] Claim Failed! ⚠️ Name mismatch as per Aadhaar 🚫 #ERR",
      scheme: "FINAL_SETTLEMENT",
    });
    expect(r.root_cause_code).toBe("RC01");
    expect(r.confidence).toBeGreaterThan(0.4);
  });

  it("ADV-02: pure punctuation / whitespace → UNKNOWN", () => {
    const r = diagnose({ rawErrorText: "..... ??? ----  \n\n\t   ", scheme: "FINAL_SETTLEMENT" });
    expect(r.root_cause_code).toBe("UNKNOWN");
    expect(r.confidence).toBe(0);
  });

  it("ADV-03: success text → UNKNOWN", () => {
    const r = diagnose({
      rawErrorText: "Claim settled and amount credited to your bank account",
      scheme: "FINAL_SETTLEMENT",
    });
    expect(r.root_cause_code).toBe("UNKNOWN");
    expect(r.confidence).toBe(0);
  });

  it("ADV-04: Hinglish + English Date of Exit → RC04", () => {
    const r = diagnose({
      rawErrorText: "employer ne exit date nahi dali - date of exit not updated",
      scheme: "FINAL_SETTLEMENT",
    });
    expect(r.root_cause_code).toBe("RC04");
    expect(r.owner).toBe("EMPLOYER");
  });

  it("ADV-05: dormant bank account → RC03", () => {
    const r = diagnose({ rawErrorText: "Transaction failed: bank account dormant", scheme: "PENSION_EPS" });
    expect(r.root_cause_code).toBe("RC03");
    expect(r.owner).toBe("BANK");
  });

  it("ADV-06: IFSC invalid / payment returned → RC03", () => {
    const r = diagnose({ rawErrorText: "IFSC invalid - bank returned payment", scheme: "FINAL_SETTLEMENT" });
    expect(r.root_cause_code).toBe("RC03");
  });

  it("ADV-07: DOB mismatch → RC02", () => {
    const r = diagnose({ rawErrorText: "dob mismatch with aadhaar records", scheme: "FINAL_SETTLEMENT" });
    expect(r.root_cause_code).toBe("RC02");
    expect(r.owner).toBe("MEMBER_SELF");
  });

  it("ADV-08: long noisy log with Date of Exit → RC04", () => {
    const log = `[INFO] req 8891. Claim check. 2026-08-24. Result: Date of Exit not updated by employer. code 0x88.`;
    const r = diagnose({ rawErrorText: log, scheme: "FINAL_SETTLEMENT" });
    expect(r.root_cause_code).toBe("RC04");
  });

  it("ADV-09: empty string → UNKNOWN", () => {
    const r = diagnose({ rawErrorText: "", scheme: "FINAL_SETTLEMENT" });
    expect(r.root_cause_code).toBe("UNKNOWN");
    expect(r.confidence).toBe(0);
  });

  it("ADV-10: spam tokens + name mismatch → RC01", () => {
    const spam = "error ".repeat(80) + "name mismatch as per aadhaar";
    const r = diagnose({ rawErrorText: spam, scheme: "FINAL_SETTLEMENT" });
    expect(r.root_cause_code).toBe("RC01");
  });

  it("ADV-11: weird casing → RC01", () => {
    const r = diagnose({ rawErrorText: "NaMe MiSmAtCh As PeR aAdHaAr", scheme: "FINAL_SETTLEMENT" });
    expect(r.root_cause_code).toBe("RC01");
  });

  it("ADV-12: determinism over 100 iterations", () => {
    const input = "Rejected: Date of Exit not updated by employer";
    const first = diagnose({ rawErrorText: input, scheme: "FINAL_SETTLEMENT" });
    for (let i = 0; i < 100; i++) {
      const r = diagnose({ rawErrorText: input, scheme: "FINAL_SETTLEMENT" });
      expect(r.root_cause_code).toBe(first.root_cause_code);
      expect(r.confidence).toBe(first.confidence);
    }
  });
});
