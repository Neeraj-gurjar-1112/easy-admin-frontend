// Exports the SVG artboards to PNG (docs/design/*.png) and builds the "design vs build"
// side-by-side images (docs/design/compare-*.png) from the Playwright screenshots in docs/screenshots.
//   node scripts/design-kit/export.mjs            (needs the dev server on :3000 for the SVG files, or pass a base URL)
import { chromium } from "playwright";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SRC = join(ROOT, "public", "design");
const OUT = join(ROOT, "docs", "design");
const SHOTS = join(ROOT, "docs", "screenshots");
mkdirSync(OUT, { recursive: true });

const manifest = JSON.parse(readFileSync(join(SRC, "manifest.json"), "utf8"));
const browser = await chromium.launch();

// 1. artboards → PNG (open the SVG file directly, viewport = artboard size)
for (const { name, w, h } of manifest) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(join(SRC, `${name}.svg`)).href);
  await page.waitForTimeout(150);
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: false });
  await page.close();
  console.log("png", name);
}

// 2. side by side: design (left) vs build (right) at the same width
const PAIRS = [
  ["list", 1440, "01-list-1440-filled", "delivery-agents-list-1440"],
  ["list", 768, "05-list-768-filled", "delivery-agents-list-768"],
  ["list", 375, "06-list-375-filled", "delivery-agents-list-375"],
  ["create", 1440, "07-create-1440", "delivery-agents-create-1440"],
  ["create", 375, "08-create-375", "delivery-agents-create-375"],
  ["details", 1440, "10-details-1440", "delivery-agents-details-1440"],
  ["details", 375, "11-details-375", "delivery-agents-details-375"],
  ["login", 1440, "12-login-1440", "login-1440"],
  ["login", 375, "13-login-375", "login-375"],
];
const colW = 640;
for (const [screen, width, design, build] of PAIRS) {
  const buildPng = join(SHOTS, `${build}.png`);
  if (!existsSync(buildPng)) {
    console.log("skip (no build screenshot)", build);
    continue;
  }
  const designUrl = pathToFileURL(join(OUT, `${design}.png`)).href;
  const buildUrl = pathToFileURL(buildPng).href;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;background:#f3f5f9;font-family:Inter,Arial,sans-serif;color:#0f172a}
    .wrap{display:grid;grid-template-columns:${colW}px ${colW}px;gap:24px;padding:24px;align-items:start}
    h1{grid-column:1/-1;margin:0;font-size:18px}
    figure{margin:0}figcaption{font-size:13px;font-weight:600;margin-bottom:8px;color:#475569}
    img{width:${colW}px;display:block;border:1px solid #e3e8ef;border-radius:8px;background:#fff}
  </style></head><body><div class="wrap">
    <h1>Delivery agents · ${screen} · ${width}px — design (left) vs build (right)</h1>
    <figure><figcaption>Design — ${design}.svg</figcaption><img src="${designUrl}"></figure>
    <figure><figcaption>Build — ${build}.png (Playwright)</figcaption><img src="${buildUrl}"></figure>
  </div></body></html>`;
  const tmp = join(OUT, `_compare-${screen}-${width}.html`);
  writeFileSync(tmp, html);
  const page = await browser.newPage({ viewport: { width: colW * 2 + 72, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(tmp).href);
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, `compare-${screen}-${width}.png`), fullPage: true });
  await page.close();
  console.log("compare", screen, width);
}
await browser.close();
