import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Lets every SCSS file write `@use 'variables' as *;` / `@use 'mixins' as *;`
  // instead of relative ../../ paths.
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src/styles")],
  },
  // Dev server only: keep compiled routes alive longer. By default Next disposes a page after 60s
  // without traffic, so the first navigation to /details or /edit recompiles it (10–25s) and
  // Playwright's first "View" click looked like it did nothing.
  onDemandEntries: { maxInactiveAge: 30 * 60 * 1000, pagesBufferLength: 10 },
};

export default nextConfig;
