import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for VienKhongNi Next.js project
 * --------------------------------------------------------
 * This config is optimized for:
 * - Next.js App Router
 * - Local development testing
 * - CI integration
 * - Cross-browser testing
 */

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /**
   * Directory that contains all test files
   *
   * Example:
   * tests/
   *   smoke/homepage.spec.ts
   *   navigation/navigation.spec.ts
   *   activity/activity.spec.ts
   */
  testDir: './tests',

  /* Run tests in files in parallel, Improves test execution speed */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. Prevents disabling other tests unintentionally*/
  forbidOnly: !!process.env.CI,

  /**
   * Retry failed tests on CI to reduce flaky failures.
   * Local: no retry
   * CI: retry up to 2 times
   */
  retries: process.env.CI ? 2 : 0,

  /**
   * Number of workers running tests in parallel
   * Local: automatic (based on CPU cores)
   * CI: use 1 worker to avoid resource issues
   */
  workers: process.env.CI ? 1 : undefined,

  /**
   * Test reporter
   * HTML reporter generates a web-based test report.
   * View it with:
   * npx playwright show-report
   * https://playwright.dev/docs/test-reporters
   */
  reporter: 'html',

  /* Shared settings applied to all tests. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:3000',

    /** Collect Playwright trace on the first retry of a failed test.
     * Trace helps debugging by recording:
     * - user actions
     * - navigation
     * - network requests
     * Open trace viewer with: npx playwright show-trace trace.zip
     */
    trace: 'on-first-retry',

    /**
     * Capture screenshot only when a test fails
     */
    //screenshot: 'only-on-failure',

    /**
     * Record video when a test fails
     */
    //video: 'retain-on-failure',

    /**
     * Timeout for page navigation
     * Next.js App Router may require additional time
     * for server components and data fetching.
     */
    //navigationTimeout: 30000,

    /**
     * Timeout for user actions (click, fill, etc.)
     */
    //actionTimeout: 10000,
  },

  /**
   * Run tests across multiple browsers
   * Ensures cross-browser compatibility.
   */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /**
     * Mobile testing can be enabled if responsive testing is required
     */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /**
   * Start the Next.js server before running tests
   *
   * Playwright will:
   * 1. Start the development server
   * 2. Wait until it is available
   * 3. Run the tests
   */
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    /**
     * Maximum wait time for the server to start
     */
    //timeout: 120000
  },
});
