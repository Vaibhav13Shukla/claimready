import { expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Recent jsdom versions no longer polyfill window.localStorage themselves
// (deferring to Node's own native Storage API, which needs an explicit
// `--localstorage-file` CLI flag to actually function) — so on newer Node
// versions `localStorage` is silently undefined in tests, even though it
// works fine in every real browser. Provide a minimal, deterministic
// in-memory implementation instead of depending on environment/flag quirks.
if (typeof globalThis.localStorage === "undefined" || !globalThis.localStorage) {
  const store = new Map<string, string>();
  const memoryStorage: Storage = {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  };
  vi.stubGlobal("localStorage", memoryStorage);
  if (typeof window !== "undefined") {
    Object.defineProperty(window, "localStorage", {
      value: memoryStorage,
      configurable: true,
      writable: true,
    });
  }
}

// Global test matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range [${floor}, ${ceiling}]`,
        pass: true,
      };
    }
    return {
      message: () => `expected ${received} to be within range [${floor}, ${ceiling}]`,
      pass: false,
    };
  },
});
