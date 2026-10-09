// Measures the list page at a given width: table vs card width, per-column widths,
// wrapped cells, and computed colours / sizes of the controls Bhagyashree flagged.
//   BASE=https://easy-admin-frontend.vercel.app PW=... node scripts/measure-list.mjs 1440
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:3000";
const W = Number(process.argv[2] || 1440);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: 1000 } });
await page.goto(`${BASE}/login`);
await page.getByLabel("Email").fill("admin@example.com");
await page.getByLabel("Password").fill(process.env.PW || "Admin@123");
await page.getByRole("button", { name: "Sign in" }).click();
await page.waitForURL(/delivery-agents\/list/, { timeout: 120_000 });
await page.locator(".p-datatable-tbody tr, .agent-card").filter({ visible: true }).first().waitFor();
await page.waitForTimeout(800);
const out = await page.evaluate(() => {
  const r = (el) => el && Math.round(el.getBoundingClientRect().width);
  const card = document.querySelector(".table-card");
  const table = document.querySelector(".p-datatable-table");
  const ths = [...document.querySelectorAll(".p-datatable-thead th")].map((th) => `${th.innerText.trim() || "(actions)"}=${r(th)}`);
  const firstRow = document.querySelector(".p-datatable-tbody tr");
  const joinedCell = firstRow?.children[8];
  const cs = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const s = getComputedStyle(el);
    return { h: Math.round(el.getBoundingClientRect().height), bg: s.backgroundColor, color: s.color, fs: s.fontSize };
  };
  const clipped = [...document.querySelectorAll(".p-datatable-thead th, .p-datatable-tbody td")]
    .filter((c) => !c.classList.contains("col-agent") && !c.classList.contains("col-contact"))
    .filter((c) => c.scrollWidth > c.clientWidth + 1)
    .map((c) => `${c.className.match(/col-\w+/)?.[0]}:${c.scrollWidth}>${c.clientWidth}`);
  const ab = document.querySelector(".table-scroll-box");
  return {
    boxScrolls: ab ? ab.scrollWidth > ab.clientWidth : null,
    clipped: [...new Set(clipped)].join(" "),
    cardW: r(card),
    tableW: r(table),
    columns: ths.join("  "),
    joinedHeight: joinedCell && Math.round(joinedCell.getBoundingClientRect().height),
    addAgent: cs(".page-header-actions .p-button"),
    approveIcon: cs(".cell-actions .p-button-success"),
    search: cs(".filter-bar .p-inputtext"),
    dropdown: cs(".filter-bar .p-dropdown"),
    dropdownLabel: cs(".filter-bar .p-dropdown-label"),
  };
});
console.log(JSON.stringify(out, null, 2));
await page.screenshot({ path: `scratch-list-${W}.png`, fullPage: W < 768 });
await browser.close();
