import { describe, it, expect } from "vitest";
import { createInitialCase, canTransition, transitionCase } from "../../src/core/case";

describe("Case State Machine Unit Tests", () => {
  it("creates a valid initial case with 'diagnosed' status", () => {
    const caseObj = createInitialCase({
      scheme: "FINAL_SETTLEMENT",
      raw_input_type: "text",
      raw_error_text: "Claim rejected: Name mismatch as per Aadhaar",
      extraction_confidence: 0.95,
      root_cause_code: "RC01",
      owner: "MEMBER_SELF",
      diagnosis_confidence: 0.92,
      remedy_type: "member_correction",
      language: "en",
      steps: ["Log in", "Modify basic details"],
      estimated_timeline_days: "7-20",
    });

    expect(caseObj.case_id).toMatch(/^CASE-/);
    expect(caseObj.status).toBe("diagnosed");
    expect(caseObj.scheme).toBe("FINAL_SETTLEMENT");
  });

  it("transitions sequentially through the lifecycle", () => {
    let caseObj = createInitialCase({
      scheme: "PF_ADVANCE",
      raw_input_type: "text",
      raw_error_text: "Bank KYC not verified",
      extraction_confidence: 0.88,
      root_cause_code: "RC03",
      owner: "BANK",
      diagnosis_confidence: 0.9,
      remedy_type: "bank_fix",
      language: "hi",
      steps: ["Visit bank", "Re-KYC"],
      estimated_timeline_days: "3-10",
    });

    expect(caseObj.status).toBe("diagnosed");
    expect(canTransition(caseObj.status, "action_taken")).toBe(true);
    caseObj = transitionCase(caseObj, "action_taken");
    expect(caseObj.status).toBe("action_taken");
    caseObj = transitionCase(caseObj, "awaiting_cycle");
    expect(caseObj.status).toBe("awaiting_cycle");
    caseObj = transitionCase(caseObj, "resolved");
    expect(caseObj.status).toBe("resolved");
    expect(canTransition(caseObj.status, "diagnosed")).toBe(false);
    expect(() => transitionCase(caseObj, "diagnosed")).toThrow();
  });

  it("blocks illegal status skips (diagnosed -> resolved)", () => {
    const caseObj = createInitialCase({
      scheme: "PENSION_EPS",
      raw_input_type: "text",
      raw_error_text: "IFSC mismatch",
      extraction_confidence: 0.9,
      root_cause_code: "RC03",
      owner: "BANK",
      diagnosis_confidence: 0.85,
      remedy_type: "bank_fix",
      language: "en",
      steps: ["Visit bank"],
      estimated_timeline_days: "3-10",
    });
    expect(canTransition(caseObj.status, "resolved")).toBe(false);
    expect(() => transitionCase(caseObj, "resolved")).toThrow();
  });
});
