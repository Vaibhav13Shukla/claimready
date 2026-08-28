import { describe, it, expect } from "vitest";
import { isRateLimited, clientKeyFromRequest } from "../../src/lib/rate-limit";

describe("Rate Limiter", () => {
  it("allows the first request for a fresh key", () => {
    const key = `test-key-${Math.random()}`;
    expect(isRateLimited(key)).toBe(false);
  });

  it("allows up to the configured burst (20/min) then blocks", () => {
    const key = `test-burst-${Math.random()}`;
    const results: boolean[] = [];
    for (let i = 0; i < 25; i++) {
      results.push(isRateLimited(key));
    }
    // First 20 calls (count reaching 1..20) must pass; the 21st onward blocks.
    expect(results.slice(0, 20).every((limited) => limited === false)).toBe(true);
    expect(results.slice(20).every((limited) => limited === true)).toBe(true);
  });

  it("tracks distinct keys independently", () => {
    const keyA = `test-a-${Math.random()}`;
    const keyB = `test-b-${Math.random()}`;
    for (let i = 0; i < 20; i++) isRateLimited(keyA);
    // keyA is now exhausted; keyB should still be fresh.
    expect(isRateLimited(keyA)).toBe(true);
    expect(isRateLimited(keyB)).toBe(false);
  });
});

describe("clientKeyFromRequest", () => {
  it("reads the first IP from a comma-separated x-forwarded-for header", () => {
    const req = new Request("http://localhost/api/test", {
      headers: { "x-forwarded-for": "203.0.113.5, 70.41.3.18, 150.172.238.178" },
    });
    expect(clientKeyFromRequest(req)).toBe("203.0.113.5");
  });

  it("trims whitespace around the first IP", () => {
    const req = new Request("http://localhost/api/test", {
      headers: { "x-forwarded-for": "  203.0.113.5  ,70.41.3.18" },
    });
    expect(clientKeyFromRequest(req)).toBe("203.0.113.5");
  });

  it("falls back to a constant bucket when the header is absent", () => {
    const req = new Request("http://localhost/api/test");
    expect(clientKeyFromRequest(req)).toBe("unknown");
  });
});
