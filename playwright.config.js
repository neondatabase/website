const { defineConfig, devices } = require('@playwright/test');

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const isLocalBaseURL = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(baseURL);
const shouldStartWebServer = isLocalBaseURL && process.env.PLAYWRIGHT_SKIP_WEB_SERVER !== '1';

module.exports = defineConfig({
  testDir: './tests/critical-flows',
  outputDir: 'test-results/critical-flows',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL,
    testIdAttribute: 'data-test',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'desktop-webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-webkit',
      use: { ...devices['iPhone 15'] },
    },
  ],
  webServer: shouldStartWebServer
    ? {
        command:
          process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ||
          (process.env.CI
            ? 'npm run start -- --hostname 127.0.0.1'
            : 'npm run dev -- --hostname 127.0.0.1'),
        env: {
          ...process.env,
          NEXT_PUBLIC_DEFAULT_SITE_URL: baseURL,
          NEXT_PUBLIC_GITHUB_PATH:
            process.env.NEXT_PUBLIC_GITHUB_PATH ||
            'https://github.com/neondatabase/website/tree/main/',
        },
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180000,
      }
    : undefined,
});
