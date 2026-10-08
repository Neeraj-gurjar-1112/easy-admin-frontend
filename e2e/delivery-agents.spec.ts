import { test, expect, type Page } from "@playwright/test";

// Read-only checks for the delivery agents feature: page opens, list behaviour, states,
// validation messages (nothing is saved), details page, auth redirect.
// Create / edit / delete live in delivery-agents.mutation.spec.ts.

const LIST = "/delivery-agents/list";
const rows = (page: Page) => page.locator(".p-datatable-tbody tr");
const totalLabel = (page: Page) => page.locator(".list-pagination-total");
/** Click "View" on the first row and wait for the details page. Retries once if the click landed before hydration. */
const openFirstRowDetails = async (page: Page) => {
  await expect(async () => {
    await page.locator(".p-datatable-tbody tr").first().getByRole("button", { name: /^View/ }).click();
    await expect(page).toHaveURL(/\/delivery-agents\/details\//, { timeout: 8_000 });
  }).toPass({ timeout: 60_000 });
};
/** PrimeReact Dropdown: open it by its visible placeholder, pick an option by text. */
const pickDropdown = async (page: Page, placeholder: string, option: string) => {
  await page.locator(".p-dropdown").filter({ hasText: placeholder }).click();
  await page.getByRole("option", { name: option }).click();
};

test.describe("Delivery agents — list", () => {
  test("page opens with title, KPI tiles and rows", async ({ page }) => {
    await page.goto(LIST);
    await expect(page).toHaveTitle(/Easy Admin/);
    await expect(page.getByRole("heading", { name: "Delivery agents" })).toBeVisible();
    await expect(page.getByText("Total agents")).toBeVisible();
    await expect(page.getByText("Pending approval")).toBeVisible();
    await expect(rows(page).first()).toBeVisible();
    await expect(totalLabel(page)).toContainText(/\d/);
  });

  test("search narrows the list and the empty state offers to clear", async ({ page }) => {
    await page.goto(LIST);
    await expect(rows(page).first()).toBeVisible();

    await page.getByLabel("Search delivery agents").fill("priya");
    await expect(rows(page)).toHaveCount(1);
    await expect(rows(page).first()).toContainText("Priya Sharma");

    await page.getByLabel("Search delivery agents").fill("zzzqqq-nobody");
    await expect(page.getByText("No agents match these filters")).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(rows(page).first()).toBeVisible();
    await expect(page.getByLabel("Search delivery agents")).toHaveValue("");
  });

  test("approval filter shows only pending agents", async ({ page }) => {
    await page.goto(LIST);
    await expect(rows(page).first()).toBeVisible();

    await pickDropdown(page, "Any approval", "Pending approval");

    await expect(rows(page).first()).toBeVisible();
    const count = await rows(page).count();
    for (let i = 0; i < count; i += 1) {
      await expect(rows(page).nth(i)).toContainText("Pending");
    }
  });

  test("sorting by rating puts the best-rated agent first", async ({ page }) => {
    await page.goto(LIST);
    await expect(rows(page).first()).toBeVisible();

    const ratingHeader = page.getByRole("columnheader", { name: /Rating/ });
    await ratingHeader.click(); // asc
    await ratingHeader.click(); // desc
    await expect(rows(page).first()).toContainText(/4\.9/);
  });

  test("next page changes the rows and the total stays the same", async ({ page }) => {
    await page.goto(LIST);
    await expect(rows(page).first()).toBeVisible();
    const firstBefore = await rows(page).first().innerText();
    const total = await totalLabel(page).innerText();

    await page.getByRole("button", { name: "Next Page" }).click();
    await expect(rows(page).first()).not.toHaveText(firstBefore);
    await expect(totalLabel(page)).toHaveText(total);
  });

  test("View opens the details page of that agent", async ({ page }) => {
    await page.goto(LIST);
    await expect(rows(page).first()).toBeVisible();
    const name = await rows(page).first().locator(".cell-primary").first().innerText();

    await openFirstRowDetails(page);
    await expect(page.getByRole("heading", { name })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Performance" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Recent orders" })).toBeVisible();
  });
});

test.describe("Delivery agents — create form validation (nothing is saved)", () => {
  test("empty submit shows the required messages", async ({ page }) => {
    await page.goto("/delivery-agents/create");
    await page.getByRole("button", { name: "Create agent" }).click();

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Phone is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("wrong formats show the backend's rules", async ({ page }) => {
    await page.goto("/delivery-agents/create");
    await page.getByLabel("Full name").fill("A");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Phone").fill("12345");
    await page.getByLabel("Password").fill("short");
    await page.getByRole("button", { name: "Create agent" }).click();

    await expect(page.getByText("Name must be at least 2 characters long")).toBeVisible();
    await expect(page.getByText("Please provide a valid email address")).toBeVisible();
    await expect(page.getByText("Phone must contain at least 10 digits")).toBeVisible();
    await expect(page.getByText("Password must be at least 8 characters long")).toBeVisible();
  });
});

test.describe("Delivery agents — negative paths (nothing is saved)", () => {
  test("cancelling the delete dialog keeps the row", async ({ page }) => {
    await page.goto(LIST);
    await expect(rows(page).first()).toBeVisible();
    const name = await rows(page).first().locator(".cell-primary").first().innerText();
    const total = await totalLabel(page).innerText();

    await rows(page).first().getByRole("button", { name: /^Delete/ }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Cancel" }).click();

    await expect(dialog).toBeHidden();
    await expect(rows(page).first()).toContainText(name);
    await expect(totalLabel(page)).toHaveText(total);
  });

  test("edit rejects an empty name and a wrong phone without saving", async ({ page }) => {
    await page.goto(LIST);
    await expect(rows(page).first()).toBeVisible();
    await openFirstRowDetails(page);
    await expect(async () => {
      await page.locator(".agent-hero").getByRole("button", { name: "Edit" }).click();
      await expect(page).toHaveURL(/\/delivery-agents\/edit\//, { timeout: 8_000 });
    }).toPass({ timeout: 60_000 });
    await expect(page.getByLabel("Full name")).not.toHaveValue("");

    await page.getByLabel("Full name").fill("");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Name is required")).toBeVisible();

    await page.getByLabel("Full name").fill("Still Here");
    await page.getByLabel("Phone").fill("12345");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Phone must contain at least 10 digits")).toBeVisible();
    await expect(page).toHaveURL(/\/delivery-agents\/edit\//); // nothing was saved, still on the form
  });

  test("an edit URL with an unknown id shows the not-found state", async ({ page }) => {
    await page.goto("/delivery-agents/edit/64b000000000000000000000");
    await expect(page.getByText("Could not load data")).toBeVisible();
    await expect(page.getByText("Delivery agent not found")).toBeVisible();
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  });
});

test.describe("Access", () => {
  // Fresh browser context without the saved session
  test.use({ storageState: { cookies: [], origins: [] } });

  test("a visitor without a session is sent to the login page", async ({ page }) => {
    await page.goto(LIST);
    await expect(page).toHaveURL(/\/login\?next=/);
    await expect(page.getByRole("heading", { name: "Easy Admin" })).toBeVisible();
  });

  test("wrong credentials show the API message", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("admin@example.com");
    await page.getByLabel("Password").fill("definitely-wrong");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });
});
