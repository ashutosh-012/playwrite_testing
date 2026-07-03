import { defineConfig, devices } from '@playwright/test'

const isHeaded = process.env.HEADED === 'true'

export default defineConfig({
  testDir: './tests',
  timeout: 45000,
  retries: 0,
  workers: isHeaded ? 1 : 3,
  reporter: [['html', { open: 'never', outputFolder: 'playwright-report' }], ['list']],
  use: {
    baseURL: 'http://localhost:5173',
    headless: !isHeaded,
    slowMo: isHeaded ? 700 : 0,
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 15000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    cwd: './app',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 30000,
  },
})
