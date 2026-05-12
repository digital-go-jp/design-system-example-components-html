import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src",
  testMatch: "**/*.vrt.js",
  use: {
    launchOptions: {
      args: ["--disable-web-security"],
    },
  },
});
