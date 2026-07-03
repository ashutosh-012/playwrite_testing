import { test, expect } from '@playwright/test'

const VALID = { email: 'admin@corp.com', pass: 'Admin@123' }

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('L01 - valid credentials redirect to dashboard', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', VALID.email)
    await page.fill('[data-testid="password-input"]', VALID.pass)
    await page.click('[data-testid="login-btn"]')
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('[data-testid="dashboard-heading"]')).toBeVisible()
  })

  test('L02 - empty email shows required error', async ({ page }) => {
    await page.fill('[data-testid="password-input"]', VALID.pass)
    await page.evaluate(() => {
      document.querySelector('[data-testid="login-btn"]').removeAttribute('disabled')
    })
    await page.click('[data-testid="login-btn"]')
    await expect(page.locator('[data-testid="email-error"]')).toContainText('required')
  })

  test('L03 - wrong password shows invalid credentials', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', VALID.email)
    await page.fill('[data-testid="password-input"]', 'wrongpass')
    await page.click('[data-testid="login-btn"]')
    await expect(page.locator('[data-testid="api-error"]')).toContainText('Invalid')
  })

  test('L04 - invalid email format shows format error', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', 'notanemail')
    await page.fill('[data-testid="password-input"]', VALID.pass)
    await page.click('[data-testid="login-btn"]')
    await expect(page.locator('[data-testid="email-error"]')).toContainText('valid email')
  })

  test('L05 - SQL injection in email is rejected safely', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', "' OR 1=1 --")
    await page.fill('[data-testid="password-input"]', VALID.pass)
    await page.click('[data-testid="login-btn"]')
    await expect(page).not.toHaveURL('/dashboard')
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
  })

  test('L06 - show password toggle reveals and hides password', async ({ page }) => {
    await page.fill('[data-testid="password-input"]', 'testpass')
    await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute('type', 'password')
    await page.click('[data-testid="pw-toggle"]')
    await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute('type', 'text')
    await page.click('[data-testid="pw-toggle"]')
    await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute('type', 'password')
  })
})
