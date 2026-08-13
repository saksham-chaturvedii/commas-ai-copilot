import { test, expect, type Page } from "@playwright/test";

/**
 * Web fonts (Inter, Geist) load from Google Fonts over the network. Playwright's
 * screenshot assertion already waits on document.fonts, but text-heavy screens
 * were observed to flake intermittently — an extra explicit wait plus a short
 * settle delay makes the swap deterministic.
 */
async function stableScreenshot(page: Page, name: string) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(100);
  await expect(page).toHaveScreenshot(name, { fullPage: true });
}

async function scrollToHeading(page: Page, text: string) {
  await page.getByRole("heading", { name: text, exact: true }).scrollIntoViewIfNeeded();
}

/**
 * End-to-end walk through the AI Evidence Copilot, covering the full happy path:
 * Resolution Center → dispute → AI investigation → evidence results → view source →
 * verify → add evidence → view/verify new evidence → submit → confirmation → reset.
 * Each stage asserts on real UI state before capturing a visual snapshot.
 */
test.describe("AI Evidence Copilot — full flow", () => {
  test("walks through every major state, including source inspection and reset", async ({
    page,
  }) => {
    // 1. Resolution Center — populated list, entry point
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Resolution Center" })).toBeVisible();
    await expect(page.getByText("Sarah Johnson")).toBeVisible();
    await stableScreenshot(page, "01-resolution-center.png");

    // 2. Open the dispute
    await page.getByText("Sarah Johnson").click();
    await expect(page.getByRole("heading", { name: "Dispute #2481" })).toBeVisible();
    const collectBtn = page.getByRole("button", { name: "Collect evidence with AI" });
    await expect(collectBtn).toBeVisible();
    await stableScreenshot(page, "02-dispute-detail.png");

    // 3-4. Start AI evidence collection, wait for investigation to complete
    await collectBtn.click();
    await expect(page.getByText("AI INVESTIGATION")).toBeVisible();
    await stableScreenshot(page, "03-ai-investigation.png");
    await expect(page.getByText("8 pieces of evidence collected")).toBeVisible({
      timeout: 10_000,
    });
    await stableScreenshot(page, "04-evidence-collected.png");
    await expect(page.getByText("Case summary")).toBeVisible({ timeout: 10_000 });
    await stableScreenshot(page, "05-case-summary.png");

    // Submit must be gated shut before any evidence is verified.
    const submitBtn = page.getByRole("button", { name: "Submit response" });
    await expect(submitBtn).toBeDisabled();
    await expect(page.getByText(/evidence items? still need review/)).toBeVisible();

    await scrollToHeading(page, "Evidence");
    await expect(page.getByText("0 of 8 verified")).toBeVisible();
    await expect(page.getByText("Why it matters")).toBeVisible(); // first row auto-expanded
    await stableScreenshot(page, "06-evidence-review.png");

    // 5-7. Open an evidence item, inspect its source, return to the review
    const firstViewEvidence = page.getByRole("button", { name: "View evidence" }).first();
    await firstViewEvidence.click();
    await expect(page.getByRole("heading", { name: "Transaction record" })).toBeVisible();
    await expect(page.getByText("Verifying")).toBeVisible();
    await expect(page.getByText("txn_8b3f2a1c9d").first()).toBeVisible();
    await stableScreenshot(page, "07-source-transaction.png");

    await page.getByText("Back to dispute #2481").click();
    await expect(page.getByRole("heading", { name: "Dispute #2481" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Evidence", exact: true })).toBeVisible();

    // 8-9. Verify evidence, confirm the count updates
    await scrollToHeading(page, "Evidence");
    const firstVerify = page.getByRole("button", { name: "Verify", exact: true }).first();
    await firstVerify.click();
    await expect(page.getByText("1 of 8 verified")).toBeVisible();
    await expect(page.getByText("Human verified").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Unverify" }).first()).toBeVisible();
    await stableScreenshot(page, "08-evidence-verified.png");

    // 10-11. Add an evidence item, confirm it appears
    await page.getByRole("button", { name: "Add evidence" }).click();
    await expect(page.getByText("Add evidence").nth(1)).toBeVisible();
    await stableScreenshot(page, "09-add-evidence-modal.png");

    await page.getByPlaceholder("Support email thread").fill("Follow-up email confirming access");
    const modal = page.locator(".fixed.inset-0");
    await modal.getByRole("button", { name: "Add evidence" }).click();
    await expect(page.getByText("Follow-up email confirming access")).toBeVisible();
    await expect(page.getByText("1 of 9 verified")).toBeVisible();

    // 12-13. View and verify the new evidence
    const newRow = page.getByText("Follow-up email confirming access").locator("../..");
    await newRow.getByRole("button", { name: "View evidence" }).click();
    // "Manually added evidence" appears as both the page h1 and the card's h2 —
    // just confirm at least one is visible.
    await expect(page.getByRole("heading", { name: "Manually added evidence" }).first()).toBeVisible();
    await expect(page.getByText("Entered by seller")).toBeVisible();
    await stableScreenshot(page, "10-source-manual.png");

    await page.getByText("Back to dispute #2481").click();
    await scrollToHeading(page, "Evidence");
    await page.getByRole("button", { name: "Verify all" }).click();
    await expect(page.getByText("9 of 9 verified")).toBeVisible();

    // 14. Confirm submission becomes available
    await expect(page.getByText("All evidence reviewed")).toBeVisible();
    await expect(submitBtn).toBeEnabled();
    await submitBtn.scrollIntoViewIfNeeded();
    await stableScreenshot(page, "11-submit-state.png");

    // 15-16. Submit and confirm the success state
    await submitBtn.click();
    await expect(page.getByText("Response submitted")).toBeVisible();
    await expect(page.getByText("In review").first()).toBeVisible();
    await expect(page.getByText(/AI found 9 items · You verified 9/)).toBeVisible();
    await stableScreenshot(page, "12-success-state.png");

    // 17-18. Reset the demo, confirm the prototype returns to its initial state
    await page.getByText("Reset demo").click();
    await expect(page.getByRole("heading", { name: "Resolution Center" })).toBeVisible();
    await expect(page.getByText("Sarah Johnson")).toBeVisible();

    await page.getByText("Sarah Johnson").click();
    await expect(page.getByRole("button", { name: "Collect evidence with AI" })).toBeVisible();
    await expect(page.getByText("0 of 6 items added")).toBeVisible();
    await expect(page.getByText("Needs response").first()).toBeVisible();
    await stableScreenshot(page, "13-reset-fresh-dispute.png");
  });
});
