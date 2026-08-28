import { describe, it, expect } from "vitest";
import {
  PERSONAS,
  getPersona,
  personaTotal,
  formatINR,
} from "../../src/core/personas";

describe("Demo personas", () => {
  it("every persona is internally consistent", () => {
    for (const p of PERSONAS) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.uan).toMatch(/\d/);
      expect(p.employments.length).toBeGreaterThanOrEqual(2);
      const m = p.money;
      for (const v of [m.employee, m.employer, m.pension, m.interest]) {
        expect(v).toBeGreaterThan(0);
      }
      expect(personaTotal(p)).toBe(m.employee + m.employer + m.pension + m.interest);
    }
  });

  it("claim personas carry a valid, deep-linkable claim", () => {
    const withClaims = PERSONAS.filter((p) => p.claim);
    expect(withClaims.length).toBeGreaterThanOrEqual(4);
    for (const p of withClaims) {
      const c = p.claim!;
      expect(c.golden_id).toMatch(/^GC-\d+$/);
      expect(c.amount).toBeGreaterThan(0);
      expect(c.raw_error_text.length).toBeGreaterThan(10);
      expect(["FINAL_SETTLEMENT", "PF_ADVANCE", "PENSION_EPS"]).toContain(c.scheme);
    }
  });

  it("exactly one healthy persona with no claim and no blocker", () => {
    const healthy = PERSONAS.filter((p) => !p.claim);
    expect(healthy.length).toBe(1);
    expect(healthy[0].employments.some((e) => e.status === "blocker")).toBe(false);
  });

  it("getPersona resolves by id and defaults safely", () => {
    expect(getPersona("priya")?.name).toBe("Priya Sharma");
    expect(getPersona("does-not-exist")).toBeUndefined();
    expect(getPersona(null)).toBeUndefined();
  });

  it("formatINR uses Indian grouping and a rupee sign", () => {
    expect(formatINR(284600)).toContain("₹");
    expect(formatINR(284600)).toContain("2,84,600");
  });
});
