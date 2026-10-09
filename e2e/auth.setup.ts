import { test as setup, expect } from "@playwright/test";
import { ADMIN_STORAGE_STATE } from "../playwright.config";

// Logs in once through the real login page and saves the session (localStorage token) so every
// spec starts already signed in. Credentials come from the environment only (never committed):
//   E2E_ADMIN_EMAIL (default admin@example.com, the seed account) and E2E_ADMIN_PASSWORD (required).
const EMAIL = process.env.E2E_ADMIN_EMAIL || "admin@example.com";
const PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "";
if (!PASSWORD) {
  throw new Error("Set E2E_ADMIN_PASSWORD (the seed admin password) before running Playwright. See README → Checks.");
}

// A hosted free API (Render) sleeps when idle and needs up to a minute to wake up.
// Wake it before logging in so the first request does not fail with "Cannot reach the server".
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.E2E_API_BASE_URL || "";

setup("admin login", async ({ page, request }) => {
  setup.setTimeout(240_000);
  if (API_BASE) {
    const health = new URL("/api/health", API_BASE).toString();
    await expect(async () => {
      const res = await request.get(health, { timeout: 30_000 });
      expect(res.ok()).toBeTruthy();
    }).toPass({ timeout: 180_000 });
  }

  await page.goto("/login");
  // Generous waits: on a freshly started dev server the first compile of a route can take a while
  await expect(page.getByRole("heading", { name: "Easy Admin" })).toBeVisible({ timeout: 60_000 });

  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/delivery-agents\/list$/, { timeout: 60_000 });
  await expect(page.getByRole("heading", { name: "Delivery agents" })).toBeVisible({ timeout: 60_000 });

  await page.context().storageState({ path: ADMIN_STORAGE_STATE });
});
