import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ErrorTaxonomy, TaxonomyEntry } from "../../src/core/taxonomy/taxonomy.schema";

describe("Taxonomy Validation — error-taxonomy.json must pass Zod schema", () => {
  const taxonomyPath = join(__dirname, "../../src/core/taxonomy/error-taxonomy.json");
  const raw = readFileSync(taxonomyPath, "utf-8");
  const data = JSON.parse(raw);

  it("validates against ErrorTaxonomy schema", () => {
    expect(() => ErrorTaxonomy.parse(data)).not.toThrow();
  });

  it("has exactly 5 root cause entries (RC01-RC05)", () => {
    const keys = Object.keys(data);
    expect(keys).toHaveLength(5);
    ["RC01", "RC02", "RC03", "RC04", "RC05"].forEach((k) => expect(keys).toContain(k));
  });

  it.each(Object.entries(data))("entry %s has all required fields", (code, entry) => {
    const parsed = TaxonomyEntry.parse(entry);
    expect(parsed.code).toBe(code);
    expect(parsed.label_en.length).toBeGreaterThan(5);
    expect(parsed.label_hi.length).toBeGreaterThan(5);
    expect(parsed.error_phrases.length).toBeGreaterThan(3);
    expect(parsed.scheme_applicable.length).toBeGreaterThan(0);
    expect(parsed.explanation_en.length).toBeGreaterThan(20);
    expect(parsed.explanation_hi.length).toBeGreaterThan(20);
    expect(parsed.estimated_timeline_days.length).toBeGreaterThan(0);
  });

  it("error_phrases are unique within each entry", () => {
    for (const [, entry] of Object.entries(data)) {
      const parsed = TaxonomyEntry.parse(entry);
      const unique = new Set(parsed.error_phrases.map((p) => p.toLowerCase()));
      expect(unique.size).toBe(parsed.error_phrases.length);
    }
  });

  it("all claim types referenced are valid", () => {
    const valid = ["FINAL_SETTLEMENT", "PF_ADVANCE", "PENSION_EPS"];
    for (const [, entry] of Object.entries(data)) {
      const parsed = TaxonomyEntry.parse(entry);
      parsed.scheme_applicable.forEach((s) => expect(valid).toContain(s));
    }
  });
});
