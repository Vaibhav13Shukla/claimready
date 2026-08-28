import { describe, it, expect } from "vitest";
import { buildXray, confidenceTier } from "../../src/core/xray";
import type { RootCauseCode } from "../../src/core/taxonomy/taxonomy.schema";

const KNOWN: RootCauseCode[] = ["RC01", "RC02", "RC03", "RC04", "RC05"];

describe("Claim X-Ray — case reconstruction", () => {
  it.each(KNOWN)("%s reconstructs a non-empty case with a real blocker", (rc) => {
    const x = buildXray(rc, 0.98);
    expect(x.employments.length).toBeGreaterThanOrEqual(2);
    expect(x.evidence.length).toBeGreaterThanOrEqual(1);
    expect(x.blocker_en.length).toBeGreaterThan(10);
    expect(x.blocker_hi.length).toBeGreaterThan(5);

    // Each known cause must surface a concrete blocker: either a blocked
    // employment or a mismatched/missing evidence record.
    const hasBlockerEmployment = x.employments.some((e) => e.status === "blocker");
    const hasBlockerRecord = x.evidence.some(
      (r) => r.status === "mismatch" || r.status === "missing",
    );
    expect(hasBlockerEmployment || hasBlockerRecord).toBe(true);
  });

  it("UNKNOWN reconstructs but flags NEEDS_VERIFICATION", () => {
    const x = buildXray("UNKNOWN", 0);
    expect(x.tier).toBe("NEEDS_VERIFICATION");
    expect(x.employments.length).toBeGreaterThanOrEqual(1);
  });

  it("does not mutate the shared employment fixtures across calls", () => {
    const a = buildXray("RC04", 0.98);
    a.employments[0].employer = "MUTATED";
    const b = buildXray("RC04", 0.98);
    expect(b.employments[0].employer).not.toBe("MUTATED");
  });
});

describe("Confidence tier mapping", () => {
  it("high confidence known cause is CONFIRMED", () => {
    expect(confidenceTier("RC01", 0.98)).toBe("CONFIRMED");
    expect(confidenceTier("RC01", 0.9)).toBe("CONFIRMED");
  });
  it("medium confidence is LIKELY", () => {
    expect(confidenceTier("RC02", 0.7)).toBe("LIKELY");
  });
  it("low confidence is NEEDS_VERIFICATION", () => {
    expect(confidenceTier("RC03", 0.4)).toBe("NEEDS_VERIFICATION");
  });
  it("UNKNOWN is always NEEDS_VERIFICATION regardless of confidence", () => {
    expect(confidenceTier("UNKNOWN", 0.99)).toBe("NEEDS_VERIFICATION");
  });
});
