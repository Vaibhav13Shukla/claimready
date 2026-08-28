import { describe, it, expect } from "vitest";
import {
  analyzeJobSwitch,
  getScenario,
  JOB_SWITCH_CHECKS,
  JOB_SWITCH_SCENARIOS,
  type JobSwitchInputs,
} from "../../src/core/jobswitch";
import { routeRemedy } from "../../src/core/remedy-router";

const ALL_CLEAR: JobSwitchInputs = {
  filedExit: true,
  transferredOldPf: true,
  bankKycVerified: true,
  nameConsistent: true,
  dobConsistent: true,
};

describe("Job-Switch X-Ray — continuity simulator", () => {
  it("a clean switch scores 100 and arms nothing", () => {
    const r = analyzeJobSwitch(ALL_CLEAR);
    expect(r.score).toBe(100);
    expect(r.status).toBe("clear");
    expect(r.armed).toHaveLength(0);
    expect(r.clear).toHaveLength(JOB_SWITCH_CHECKS.length);
  });

  it("the classic trap arms exactly RC04 + RC05 as critical time-bombs", () => {
    const r = analyzeJobSwitch({ ...ALL_CLEAR, filedExit: false, transferredOldPf: false });
    expect(r.status).toBe("at_risk");
    expect(r.armed.map((a) => a.rc)).toEqual(["RC04", "RC05"]);
    expect(r.criticalCount).toBe(2);
    // Both criticals lead, and the score reflects the two heaviest penalties.
    expect(r.armed.every((a) => a.severity === "critical")).toBe(true);
    expect(r.score).toBe(34);
  });

  it("sorts armed risks critical-first, then by weight", () => {
    // Arm one warning (RC02, lightest) and one critical (RC05): critical leads.
    const r = analyzeJobSwitch({ ...ALL_CLEAR, dobConsistent: false, transferredOldPf: false });
    expect(r.armed[0].severity).toBe("critical");
    expect(r.armed[0].rc).toBe("RC05");
    expect(r.armed[1].rc).toBe("RC02");
  });

  it("every armed risk carries a deep-linkable rejection (golden id + remark + scheme)", () => {
    const everything: JobSwitchInputs = {
      filedExit: false,
      transferredOldPf: false,
      bankKycVerified: false,
      nameConsistent: false,
      dobConsistent: false,
    };
    const r = analyzeJobSwitch(everything);
    expect(r.armed).toHaveLength(5);
    expect(r.score).toBe(0);
    for (const risk of r.armed) {
      expect(risk.golden_id).toMatch(/^GC-\d+$/);
      expect(risk.raw_error_text.length).toBeGreaterThan(10);
      expect(risk.bomb_hi.length).toBeGreaterThan(5);
      // owner/timeline must come from the shared routers, not be re-invented.
      expect(risk.owner).toBe(routeRemedy(risk.rc).owner);
      expect(risk.owner_label_en.length).toBeGreaterThan(0);
      expect(risk.timeline_en.length).toBeGreaterThan(0);
    }
  });

  it("each check maps ON=in-order (a false fact is what arms the risk)", () => {
    for (const check of JOB_SWITCH_CHECKS) {
      const armedInputs = { ...ALL_CLEAR, [check.key]: false };
      const r = analyzeJobSwitch(armedInputs);
      expect(r.armed.map((a) => a.rc)).toContain(check.rc);
    }
  });

  it("preset scenarios resolve and behave as designed", () => {
    expect(getScenario("classic-trap")).toBeDefined();
    expect(getScenario("nope")).toBeUndefined();

    const clean = JOB_SWITCH_SCENARIOS.find((s) => s.id === "clean-switch")!;
    expect(analyzeJobSwitch(clean.inputs).status).toBe("clear");

    const trap = JOB_SWITCH_SCENARIOS.find((s) => s.id === "classic-trap")!;
    expect(analyzeJobSwitch(trap.inputs).criticalCount).toBe(2);
  });
});
