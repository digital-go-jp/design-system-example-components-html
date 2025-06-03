import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src",
  use: {
    launchOptions: {
      args: ["--disable-web-security"],
    },
  },
});
