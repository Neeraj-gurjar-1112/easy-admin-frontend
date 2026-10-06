// Copies the two PrimeReact themes we switch between (light / dark) into public/themes,
// so <link id="theme-link"> in src/app/layout.tsx can swap the href at runtime.
// Runs on `npm install` (postinstall). public/themes is git-ignored.
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "node_modules", "primereact", "resources", "themes");
const target = join(root, "public", "themes");
const THEMES = ["lara-light-blue", "lara-dark-blue"];

if (!existsSync(source)) {
  console.warn("[themes] primereact is not installed yet — skipping theme copy");
  process.exit(0);
}

mkdirSync(target, { recursive: true });
for (const theme of THEMES) {
  cpSync(join(source, theme), join(target, theme), { recursive: true });
}
console.log(`[themes] copied ${THEMES.join(", ")} to public/themes`);
