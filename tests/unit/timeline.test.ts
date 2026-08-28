import { describe, it, expect } from "vitest";
import { calculateTimeline } from "../../src/core/timeline";

describe("Timeline Calculator Unit Tests", () => {
  it("RC01 → 7–20", () => {
    const t = calculateTimeline("RC01");
    expect(t.min_days).toBe(7);
    expect(t.max_days).toBe(20);
    expect(t.display_en).toBe("7–20 Working Days");
    expect(t.display_hi).toContain("7–20");
  });

  it("RC02 → 7–20", () => {
    const t = calculateTimeline("RC02");
    expect(t.min_days).toBe(7);
    expect(t.max_days).toBe(20);
  });

  it("RC03 → 3–10", () => {
    const t = calculateTimeline("RC03");
    expect(t.min_days).toBe(3);
    expect(t.max_days).toBe(10);
  });

  it("RC04 → 7–30", () => {
    const t = calculateTimeline("RC04");
    expect(t.min_days).toBe(7);
    expect(t.max_days).toBe(30);
  });

  it("UNKNOWN → 7–15", () => {
    const t = calculateTimeline("UNKNOWN");
    expect(t.min_days).toBe(7);
    expect(t.max_days).toBe(15);
  });
});
