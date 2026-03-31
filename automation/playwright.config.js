// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './playwright',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  retries: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://demo.baasic.com/angular/starterkit-photo-gallery/',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
});
