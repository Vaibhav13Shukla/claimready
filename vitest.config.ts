import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    // jsdom's localStorage is origin-scoped and throws/no-ops without a
    // concrete http(s) origin configured — without this, Node 22's own
    // experimental global `localStorage` shadows it instead and silently
    // does nothing (surfaced as "Cannot read properties of undefined").
    environmentOptions: {
      jsdom: { url: "http://localhost:3000" },
    },
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      // Vitest 4's v8 provider reports every file matched by `include`
      // whether or not a test actually imported it (the old `all: true`
      // flag from v2/v3 was removed as a separate option).
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: [
        "node_modules/",
        "tests/",
        "src/app/**", // page components — covered by the Playwright e2e suite instead
        "src/**/*.d.ts",
      ],
    },
  },
});
