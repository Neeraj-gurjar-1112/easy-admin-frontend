import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Lets every SCSS file write `@use 'variables' as *;` / `@use 'mixins' as *;`
  // instead of relative ../../ paths.
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src/styles")],
  },
};

export default nextConfig;
