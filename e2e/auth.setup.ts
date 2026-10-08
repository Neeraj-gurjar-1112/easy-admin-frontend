import { test as setup, expect } from "@playwright/test";
import { ADMIN_STORAGE_STATE } from "../playwright.config";

// Logs in once through the real login page and saves the session (localStorage token) so every
// spec starts already signed in. Credentials come from env; defaults are the local seed account
// created by `node scripts/seed-delivery-agents.js` in Easy-Backend-v2.
const EMAIL = process.env.E2E_ADMIN_EMAIL || "admin@example.com";
const PASSWORD = process.env.E2E_ADMIN_PASSWORD || "Admin@123";

setup("admin login", async ({ page }) => {
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
