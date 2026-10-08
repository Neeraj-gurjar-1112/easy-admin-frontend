import { test, expect, type Page } from "@playwright/test";

// @mutation — creates, edits and deletes a delivery agent on the connected backend.
// Only runs with E2E_ALLOW_MUTATIONS=1 (npm run test:e2e:mutations). Never point it at a shared
// server without telling the team. The agent it creates has a unique email and is deleted at the end.

const stamp = Date.now().toString(36);
const agent = {
  name: `E2E Agent ${stamp}`,
  renamed: `E2E Agent ${stamp} Edited`,
  email: `e2e.${stamp}@example.com`,
  phone: "+91 90000 12345",
  password: "E2eAgent@123",
};

/** Click "View" on the first row and wait for the details page. Retries once if the click landed before hydration. */
const openFirstRowDetails = async (page: Page) => {
  await expect(async () => {
    await page.locator(".p-datatable-tbody tr").first().getByRole("button", { name: /^View/ }).click();
    await expect(page).toHaveURL(/\/delivery-agents\/details\//, { timeout: 8_000 });
  }).toPass({ timeout: 60_000 });
};

test.describe.serial("Delivery agents — create → list → edit → delete @mutation", () => {
  test("create shows the new agent on its details page", async ({ page }) => {
    await page.goto("/delivery-agents/create");
    await page.getByLabel("Full name").fill(agent.name);
    await page.getByLabel("Email").fill(agent.email);
    await page.getByLabel("Phone").fill(agent.phone);
    await page.getByLabel("Password").fill(agent.password);
    await page.getByRole("button", { name: "Create agent" }).click();

    await expect(page).toHaveURL(/\/delivery-agents\/details\//);
    await expect(page.getByRole("heading", { name: agent.name })).toBeVisible();
    await expect(page.getByText("Agent created")).toBeVisible();
    await expect(page.getByText(agent.email)).toBeVisible();
  });

  test("the same email is rejected by the backend and shown under the field", async ({ page }) => {
    await page.goto("/delivery-agents/create");
    await page.getByLabel("Full name").fill("Duplicate Test");
    await page.getByLabel("Email").fill(agent.email);
    await page.getByLabel("Phone").fill(agent.phone);
    await page.getByLabel("Password").fill(agent.password);
    await page.getByRole("button", { name: "Create agent" }).click();

    // The API answers with details[{ field: "email" }], so the message must sit under the Email input
    const emailField = page.locator(".form-field", { has: page.locator("#agent-email") });
    await expect(emailField.locator(".form-error")).toHaveText("Email is already registered");
    await expect(page.locator(".form-message")).toHaveCount(0); // not a banner
    await expect(page).toHaveURL(/\/delivery-agents\/create$/); // typed values are kept
    await expect(page.getByLabel("Full name")).toHaveValue("Duplicate Test");
  });

  test("the new agent appears in the list via search", async ({ page }) => {
    await page.goto("/delivery-agents/list");
    await page.getByLabel("Search delivery agents").fill(agent.email);
    const row = page.locator(".p-datatable-tbody tr").first();
    await expect(row).toContainText(agent.name);
    await expect(row).toContainText("Pending"); // default: not approved
  });

  test("edit renames the agent and the change shows on details", async ({ page }) => {
    await page.goto("/delivery-agents/list");
    await page.getByLabel("Search delivery agents").fill(agent.email);
    await expect(page.locator(".p-datatable-tbody tr").first()).toContainText(agent.name);
    await openFirstRowDetails(page);
    // Same hydration guard as View: retry the click until the edit page is open
    await expect(async () => {
      await page.locator(".agent-hero").getByRole("button", { name: "Edit" }).click();
      await expect(page).toHaveURL(/\/delivery-agents\/edit\//, { timeout: 8_000 });
    }).toPass({ timeout: 60_000 });

    await expect(page.getByLabel("Full name")).toHaveValue(agent.name);
    await page.getByLabel("Full name").fill(agent.renamed);
    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(page).toHaveURL(/\/delivery-agents\/details\//);
    await expect(page.getByRole("heading", { name: agent.renamed })).toBeVisible();
    await expect(page.getByText("Changes saved")).toBeVisible();
  });

  test("approve from details flips the badge", async ({ page }) => {
    await page.goto("/delivery-agents/list");
    await page.getByLabel("Search delivery agents").fill(agent.email);
    await expect(page.locator(".p-datatable-tbody tr").first()).toContainText(agent.renamed);
    await openFirstRowDetails(page);
    await page.locator(".agent-hero").getByRole("button", { name: "Approve" }).click();

    await expect(page.getByText("Agent approved")).toBeVisible();
    await expect(page.locator(".agent-hero").getByText("Approved")).toBeVisible();
  });

  test("delete removes the agent and the list no longer finds it", async ({ page }) => {
    await page.goto("/delivery-agents/list");
    await page.getByLabel("Search delivery agents").fill(agent.email);
    await page.locator(".p-datatable-tbody tr").first().getByRole("button", { name: /^Delete/ }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click(); // confirm dialog

    await expect(page.getByText("Agent deleted")).toBeVisible();
    await expect(page.getByText("No agents match these filters")).toBeVisible();
  });
});
