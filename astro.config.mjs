import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://wangbinyq.github.io",
  base: "/pain-zh/",
  trailingSlash: "always",
  build: { format: "directory" },
});
