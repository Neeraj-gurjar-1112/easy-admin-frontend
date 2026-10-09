import { test, expect, type Page } from "@playwright/test";

// Step 5 (responsive) — the "repeatable" way from the training page.
// For every WM width and every screen: open it, wait until its content is on screen, save a
// full-page screenshot into ./screenshots, and fail if the document is wider than the viewport
// (= sideways scrolling).  Run: npm run shots

// WM list + 1440 (the QA team checks 1440 / 768 / 375 explicitly)
const WM_WIDTHS = [1920, 1600, 1440, 1366, 1280, 1024, 991, 768, 640, 480, 375];
const VIEWPORT_HEIGHT = 900;

/** Click "View" on the first row and wait for the details page. Retries once if the click landed before hydration. */
// The list renders a table from 768px up and one card per agent below it; use whichever is visible.
const firstItem = (page: Page) => page.locator(".p-datatable-tbody tr, .agent-card").filter({ visible: true }).first();

const openFirstRowDetails = async (page: Page) => {
  await expect(async () => {
    await firstItem(page).getByRole("button", { name: /^View/ }).click();
    await expect(page).toHaveURL(/\/delivery-agents\/details\//, { timeout: 8_000 });
  }).toPass({ timeout: 60_000 });
};

interface Screen {
  name: string;
  open: (page: Page) => Promise<void>;
}

const SCREENS: Screen[] = [
  {
    name: "delivery-agents-list",
    open: async (page) => {
      await page.goto("/delivery-agents/list");
      await firstItem(page).waitFor({ state: "visible" });
    },
  },
  {
    name: "delivery-agents-details",
    open: async (page) => {
      await page.goto("/delivery-agents/list");
      await firstItem(page).waitFor({ state: "visible" });
      await openFirstRowDetails(page);
      await page.locator(".agent-hero").waitFor({ state: "visible" });
    },
  },
  {
    name: "delivery-agents-create",
    open: async (page) => {
      await page.goto("/delivery-agents/create");
      await page.locator(".form-card").waitFor({ state: "visible" });
    },
  },
  {
    name: "delivery-agents-edit",
    open: async (page) => {
      await page.goto("/delivery-agents/list");
      await firstItem(page).waitFor({ state: "visible" });
      await openFirstRowDetails(page);
      await expect(async () => {
        await page.locator(".agent-hero").getByRole("button", { name: "Edit" }).click();
        await expect(page).toHaveURL(/\/delivery-agents\/edit\//, { timeout: 8_000 });
      }).toPass({ timeout: 60_000 });
      await page.locator(".form-card").waitFor({ state: "visible" });
    },
  },
  {
    name: "login",
    open: async (page) => {
      await page.goto("/login");
      await page.locator(".login-card").waitFor({ state: "visible" });
    },
  },
];

async function assertNoHorizontalScroll(page: Page, width: number) {
  const size = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(size.scrollWidth, `page is ${size.scrollWidth}px wide in a ${width}px viewport`).toBeLessThanOrEqual(size.clientWidth);
}

for (const screen of SCREENS) {
  for (const width of WM_WIDTHS) {
    test(`${screen.name} @ ${width}px — no horizontal scroll`, async ({ page }) => {
      await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
      await screen.open(page);
      await page.screenshot({ path: `screenshots/${screen.name}-${width}.png`, fullPage: true });
      await assertNoHorizontalScroll(page, width);
    });
  }
}
