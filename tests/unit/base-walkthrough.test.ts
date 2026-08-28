import { describe, it, expect } from "vitest";
import { BASE_WALKTHROUGH_FLOWS } from "../../src/documents/base-walkthrough";

describe("Base Walkthrough Flows (RC01/RC02 simulated portal steps)", () => {
  it("defines exactly RC01 and RC02 flows", () => {
    expect(Object.keys(BASE_WALKTHROUGH_FLOWS).sort()).toEqual(["RC01", "RC02"]);
  });

  it.each(["RC01", "RC02"] as const)("%s flow has bilingual, sequential, non-empty steps", (code) => {
    const flow = BASE_WALKTHROUGH_FLOWS[code];
    expect(flow.code).toBe(code);
    expect(flow.title_en.length).toBeGreaterThan(0);
    expect(flow.title_hi.length).toBeGreaterThan(0);
    expect(flow.steps.length).toBeGreaterThan(0);

    flow.steps.forEach((step, i) => {
      expect(step.stepNumber).toBe(i + 1);
      expect(step.title_en.length).toBeGreaterThan(0);
      expect(step.title_hi.length).toBeGreaterThan(0);
      expect(step.screenName.length).toBeGreaterThan(0);
      expect(step.description_en.length).toBeGreaterThan(0);
      expect(step.description_hi.length).toBeGreaterThan(0);
      expect(step.simulatedAction_en.length).toBeGreaterThan(0);
      expect(step.simulatedAction_hi.length).toBeGreaterThan(0);
      expect(step.tip_en.length).toBeGreaterThan(0);
      expect(step.tip_hi.length).toBeGreaterThan(0);
    });
  });

  it("RC01 walks through correcting the name, RC02 the date of birth", () => {
    expect(BASE_WALKTHROUGH_FLOWS.RC01.title_en.toLowerCase()).toContain("name");
    expect(BASE_WALKTHROUGH_FLOWS.RC02.title_en.toLowerCase()).toContain("date of birth");
  });
});
