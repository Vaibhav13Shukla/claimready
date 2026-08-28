import { test, expect } from "@playwright/test";

// Covers the exact path a judge takes per docs/DEMO_RUNBOOK.md: landing ->
// pre-flight -> demo case -> confirm -> diagnosis -> resolution plan ->
// tracker, plus the language toggle and the transparency disclosure page.
// Uses accessible roles/names throughout (not CSS selectors) so this also
// acts as a regression check on the WCAG labeling fixed on Day 2 — if a
// label regresses, this test breaks too.

test.describe("Judge critical path (pre-flight -> resolution)", () => {
  test("GC-01 name mismatch: landing through to the resolution plan", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("PF claims");

    await page.getByRole("link", { name: /run a pre-flight check/i }).click();
    await expect(page).toHaveURL(/\/intake/);

    // The pre-flight profile finds two concrete blockers; inspect the first.
    await expect(page.getByText(/2 things to fix/i)).toBeVisible();
    await page.getByRole("button", { name: /understand the first blocker/i }).click();
    await expect(page).toHaveURL(/\/confirm/);

    // Confirm step shows what was "read" and lets the judge proceed.
    await expect(page.getByText(/name mismatch as per aadhaar/i)).toBeVisible();
    await page.getByRole("button", { name: /yes,?\s*run.*diagnosis/i }).click();
    await expect(page).toHaveURL(/\/diagnosis/);

    // Diagnosis: RC01 root cause is visible, with a plain-language explanation.
    await expect(page.getByText("RC01")).toBeVisible();
    await expect(page.getByRole("status")).not.toBeEmpty();

    await page.getByRole("link", { name: /build.*resolution plan/i }).click();
    await expect(page).toHaveURL(/\/action/);

    // Action page: resolution steps render, and the tracker is reachable.
    await expect(page.getByRole("heading", { name: /action steps/i })).toBeVisible();
    await page
      .getByRole("link", { name: /resolution timeline/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/tracker/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("GC-07 multiple UAN (RC05, added Day 2) classifies correctly end-to-end", async ({
    page,
  }) => {
    await page.goto("/intake");
    await page.getByRole("tab", { name: /demo case/i }).click();
    await page.getByRole("button", { name: /multiple uan found/i }).click();
    await expect(page).toHaveURL(/\/confirm/);

    await page.getByRole("button", { name: /yes,?\s*run.*diagnosis/i }).click();
    await expect(page).toHaveURL(/\/diagnosis/);
    await expect(page.getByText("RC05")).toBeVisible();
  });

  test("Hindi/English toggle switches the visible language across a page", async ({ page }) => {
    await page.goto("/");
    const heroHeading = page.getByRole("heading", { level: 1 });
    await expect(heroHeading).toContainText("PF claims");

    // The toggle's visible label is the *target* language name (starts as
    // "हिंदी" — tap it to switch into Hindi, where it then reads "English").
    await page.getByRole("button", { name: "हिंदी" }).click();
    await expect(heroHeading).toContainText("पीएफ दावा");
    await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  });

  test("Transparency page is reachable and discloses real vs. mocked", async ({ page }) => {
    await page.goto("/transparency");
    await expect(page.getByText(/real/i).first()).toBeVisible();
    await expect(page.getByText(/simulated|mocked/i).first()).toBeVisible();
  });

  test("Decode-a-rejection path accepts pasted text and reaches a diagnosis", async ({ page }) => {
    await page.goto("/?"); // fresh landing
    await page.getByRole("link", { name: /decode a rejection/i }).click();
    await expect(page).toHaveURL(/\/intake/);

    await page.getByRole("tab", { name: /paste/i }).click();
    await page.getByRole("textbox").fill("Rejected: Date of Exit not updated by employer");
    await page.getByRole("button", { name: /diagnose/i }).click();

    await expect(page).toHaveURL(/\/confirm/);
    await page.getByRole("button", { name: /yes,?\s*run.*diagnosis/i }).click();
    await expect(page).toHaveURL(/\/diagnosis/);
    await expect(page.getByText("RC04")).toBeVisible();
  });

  test("Unrecognized rejection text (UNKNOWN path) renders the diagnosis page without crashing", async ({
    page,
  }) => {
    // Regression test: getUnknownResult() used to return owner: "CSC" /
    // remedy_type: "csc_referral" — neither a real Owner/RemedyType enum
    // member — which crashed this exact page (OWNER_LABEL[diagnosis.owner].hi
    // threw on the undefined lookup). A unit test on diagnose()'s return
    // value alone couldn't catch this; it takes an actual render.
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/intake");
    await page.getByRole("tab", { name: /paste/i }).click();
    await page
      .getByRole("textbox")
      .fill("My claim is stuck for reasons I don't understand, please help");
    await page.getByRole("button", { name: /diagnose/i }).click();

    await expect(page).toHaveURL(/\/confirm/);
    await page.getByRole("button", { name: /yes,?\s*run.*diagnosis/i }).click();
    await expect(page).toHaveURL(/\/diagnosis/);

    // The page must actually render its content, not a crashed blank screen.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/EPFO field office|ईपीएफओ फील्ड ऑफिस/i)).toBeVisible();
    expect(errors).toEqual([]);
  });
});
