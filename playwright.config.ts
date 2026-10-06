import { defineConfig, devices } from "@playwright/test";

// Same conventions as the Talking Club admin repo:
//  - PLAYWRIGHT_BASE_URL overrides the target (default: local dev server, auto-started)
//  - login happens once in e2e/auth.setup.ts; every spec starts with the saved session
//  - *.mutation.spec.ts (create / edit / delete) only run with E2E_ALLOW_MUTATIONS=1
// The backend must be running (Easy-Backend-v2 `npm run dev`, seeded) — see README.
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const ALLOW_MUTATIONS = process.env.E2E_ALLOW_MUTATIONS === "1";
export const ADMIN_STORAGE_STATE = "e2e/.auth/admin.json";

export default defineConfig({
  testDir: "./e2e",
  testIgnore: ALLOW_MUTATIONS ? [] : ["**/*.mutation.spec.ts"],
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  // Start `npm run dev` automatically when testing locally
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/, use: { ...devices["Desktop Chrome"] } },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState: ADMIN_STORAGE_STATE },
      dependencies: ["setup"],
    },
  ],
});
