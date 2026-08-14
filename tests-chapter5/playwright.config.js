const { defineConfig, devices } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000, // Increased timeout to prevent timeouts during database seeding
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'node setup/start-test-backend.js',
      port: 4000, // Listens on TCP port 4000 directly instead of HTTP GET /
      timeout: 30000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev',
      cwd: '../library-frontend',
      url: 'http://localhost:5173',
      timeout: 30000,
      reuseExistingServer: !process.env.CI,
    },
  ],
})