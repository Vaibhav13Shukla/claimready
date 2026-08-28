import { describe, it, expect } from "vitest";
import { COMMON_ERROR_OPTIONS, getErrorOptionsForScheme } from "../../src/ai/fallback";

describe("Common Error Options (low-confidence picker / quick-fill chips)", () => {
  it("every option has bilingual, non-empty phrases and a valid scheme", () => {
    const validSchemes = ["FINAL_SETTLEMENT", "PF_ADVANCE", "PENSION_EPS"];
    expect(COMMON_ERROR_OPTIONS.length).toBeGreaterThan(0);
    COMMON_ERROR_OPTIONS.forEach((opt) => {
      expect(opt.id.length).toBeGreaterThan(0);
      expect(validSchemes).toContain(opt.scheme);
      expect(opt.phrase_en.length).toBeGreaterThan(0);
      expect(opt.phrase_hi.length).toBeGreaterThan(0);
      expect(opt.badge.length).toBeGreaterThan(0);
    });
  });

  it("has unique ids", () => {
    const ids = COMMON_ERROR_OPTIONS.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("getErrorOptionsForScheme filters to only the requested scheme", () => {
    const results = getErrorOptionsForScheme("FINAL_SETTLEMENT");
    expect(results.length).toBeGreaterThan(0);
    results.forEach((r) => expect(r.scheme).toBe("FINAL_SETTLEMENT"));
  });

  it("getErrorOptionsForScheme returns everything when no scheme is given", () => {
    expect(getErrorOptionsForScheme(null)).toEqual(COMMON_ERROR_OPTIONS);
    expect(getErrorOptionsForScheme(undefined)).toEqual(COMMON_ERROR_OPTIONS);
  });
});
