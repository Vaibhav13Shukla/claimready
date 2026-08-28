import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { GOLDEN_CASES } from "../../src/app/intake/page";
import { diagnose } from "../../src/core/classifier";

// The 7 demo cases are necessarily duplicated across three places: the
// "Try a demo case" buttons in intake/page.tsx (GOLDEN_CASES, exported for
// exactly this reason), tests/fixtures/golden-cases.json (the documented
// expected classification per case), and classifier.test.ts's own
// goldenCases array (the actual gate). This test is the tripwire for the
// first two drifting apart; classifier.test.ts already guards the third by
// re-declaring its own expectations directly against diagnose().
interface FixtureCase {
  id: string;
  scheme: string;
  input_text: string;
  expected_root_cause: string;
  expected_owner: string;
  expected_remedy_type: string;
}

const fixture: Record<string, FixtureCase> = JSON.parse(
  readFileSync(join(__dirname, "../fixtures/golden-cases.json"), "utf-8"),
);

describe("GOLDEN_CASES (intake page demo buttons) stay in sync with tests/fixtures/golden-cases.json", () => {
  it("has exactly the same set of case ids as the fixture", () => {
    const uiIds = GOLDEN_CASES.map((c) => c.id).sort();
    const fixtureIds = Object.keys(fixture).sort();
    expect(uiIds).toEqual(fixtureIds);
  });

  it.each(GOLDEN_CASES)("$id: UI button text/scheme matches the documented fixture", (uiCase) => {
    const expected = fixture[uiCase.id];
    expect(expected, `${uiCase.id} exists in the fixture`).toBeDefined();
    expect(uiCase.scheme).toBe(expected.scheme);
    expect(uiCase.text).toBe(expected.input_text);
  });

  it.each(GOLDEN_CASES)(
    "$id: the UI button's actual text classifies to the fixture's documented expectation",
    (uiCase) => {
      const expected = fixture[uiCase.id];
      const result = diagnose({
        rawErrorText: uiCase.text,
        scheme: uiCase.scheme,
      });
      expect(result.root_cause_code).toBe(expected.expected_root_cause);
      expect(result.owner).toBe(expected.expected_owner);
      expect(result.remedy_type).toBe(expected.expected_remedy_type);
    },
  );
});
