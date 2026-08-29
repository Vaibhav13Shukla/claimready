import { describe, it, expect } from "vitest";
import { searchServices, services } from "../search";

describe("service search", () => {
  it("returns nothing for an empty or whitespace query", () => {
    expect(searchServices("", "en")).toEqual([]);
    expect(searchServices("   ", "en")).toEqual([]);
  });

  it("finds 'withdraw' for English and romanised Hindi terms", () => {
    expect(searchServices("withdraw", "en")[0].to).toBe("/withdraw");
    expect(searchServices("paisa nikalna", "en")[0].to).toBe("/withdraw");
  });

  it("finds pension and balance by keyword", () => {
    expect(searchServices("pension", "en")[0].to).toBe("/pension");
    expect(searchServices("balance", "en")[0].to).toBe("/balance");
  });

  it("returns Hindi titles when the language is Hindi", () => {
    const top = searchServices("balance", "hi")[0];
    expect(top.to).toBe("/balance");
    expect(top.title).toBe(services.find((s) => s.to === "/balance")!.hi);
  });

  it("ranks the clearest match to the top", () => {
    expect(searchServices("track my claim", "en")[0].to).toBe("/track");
  });
});
