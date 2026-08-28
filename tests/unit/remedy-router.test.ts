import { describe, it, expect } from "vitest";
import { routeRemedy } from "../../src/core/remedy-router";

describe("Remedy Router Unit Tests", () => {
  it("routes RC01 to MEMBER_SELF with member_correction (self-service)", () => {
    const r = routeRemedy("RC01");
    expect(r.owner).toBe("MEMBER_SELF");
    expect(r.remedy_type).toBe("member_correction");
    expect(r.can_self_service).toBe(true);
  });

  it("routes RC02 to MEMBER_SELF with member_correction", () => {
    const r = routeRemedy("RC02");
    expect(r.owner).toBe("MEMBER_SELF");
    expect(r.remedy_type).toBe("member_correction");
  });

  it("routes RC03 to BANK with bank_fix (in-person)", () => {
    const r = routeRemedy("RC03");
    expect(r.owner).toBe("BANK");
    expect(r.remedy_type).toBe("bank_fix");
    expect(r.requires_in_person).toBe(true);
  });

  it("routes RC04 to EMPLOYER with employer_request", () => {
    const r = routeRemedy("RC04");
    expect(r.owner).toBe("EMPLOYER");
    expect(r.remedy_type).toBe("employer_request");
    expect(r.can_self_service).toBe(false);
  });

  it("routes RC05 to MEMBER_SELF with uan_transfer_merge (self-service)", () => {
    const r = routeRemedy("RC05");
    expect(r.owner).toBe("MEMBER_SELF");
    expect(r.remedy_type).toBe("uan_transfer_merge");
    expect(r.can_self_service).toBe(true);
  });

  it("routes UNKNOWN to EPFO_OFFICE with epfigms_grievance", () => {
    const r = routeRemedy("UNKNOWN");
    expect(r.owner).toBe("EPFO_OFFICE");
    expect(r.remedy_type).toBe("epfigms_grievance");
  });
});
