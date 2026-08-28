import { test, expect } from "@playwright/test";

// The blue-ocean hero: the Job-Switch X-Ray predicts the rejections a job
// change will cause LATER, and deep-links each into the existing Claim X-Ray.
// Uses accessible roles/names so it doubles as a labelling regression check.

test.describe("Job-Switch X-Ray (prevention simulator)", () => {
  test("classic trap: two time-bombs, deep-linking into the RC04 diagnosis", async ({ page }) => {
    await page.goto("/job-switch");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Job-Switch X-Ray/i);

    // Default scenario arms exactly the two classic job-switch failures.
    await expect(page.getByRole("heading", { name: /silent time-bombs \(2\)/i })).toBeVisible();
    await expect(page.getByText("RC04").first()).toBeVisible();
    await expect(page.getByText("RC05").first()).toBeVisible();

    // The most-severe card (RC04) links straight into the real diagnosis flow.
    await page
      .getByRole("link", { name: /see the full claim x-ray/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/diagnosis/);
    await expect(page.getByText("RC04")).toBeVisible();
  });

  test("a clean switch scores clear with no time-bombs", async ({ page }) => {
    await page.goto("/job-switch");
    await page.getByRole("button", { name: /Vikram Rao/i }).click();

    await expect(page.getByText(/your PF is continuous/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /silent time-bombs/i })).toHaveCount(0);
  });
});
