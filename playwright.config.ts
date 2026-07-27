import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/legacy",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: "line",
  use: {
    headless: true,
    trace: "retain-on-failure",
  },
});
