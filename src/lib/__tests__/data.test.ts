import { describe, it, expect } from "vitest";
import { totalBalance, member, rupees, buildPassbook, initialClaims } from "../data";

describe("data model", () => {
  it("total balance is the member's own + employer share (pension is separate)", () => {
    expect(totalBalance).toBe(member.balance.employee + member.balance.employer);
  });

  it("formats rupees with the Indian digit grouping and a ₹ sign", () => {
    expect(rupees(486350)).toBe("₹4,86,350");
    expect(rupees(1000)).toBe("₹1,000");
    expect(rupees(0)).toBe("₹0");
  });

  it("rounds fractional paise to whole rupees", () => {
    expect(rupees(99.6)).toBe("₹100");
    expect(rupees(100.4)).toBe("₹100");
  });

  it("builds a passbook with newest month first and yearly interest rows", () => {
    const rows = buildPassbook();
    expect(rows.length).toBeGreaterThan(12);
    expect(rows.some((r) => r.type === "interest")).toBe(true);
    expect(rows[0].year).toBeGreaterThanOrEqual(rows[rows.length - 1].year);
  });

  it("seeds at least one claim, each step of its history has a done flag", () => {
    expect(initialClaims.length).toBeGreaterThan(0);
    expect(initialClaims[0].history.every((h) => typeof h.done === "boolean")).toBe(true);
  });
});
