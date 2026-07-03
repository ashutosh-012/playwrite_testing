import { test, expect } from '@playwright/test'

const VALID = {
  username: 'ashutosh',
  email: 'ash@company.com',
  mobile: '9876543210',
  pass: 'Password1',
}

test.describe('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('R01 - valid registration shows success message', async ({ page }) => {
    await page.fill('[data-testid="username-input"]', VALID.username)
    await page.fill('[data-testid="reg-email-input"]', VALID.email)
    await page.fill('[data-testid="mobile-input"]', VALID.mobile)
    await page.fill('[data-testid="reg-pass-input"]', VALID.pass)
    await page.click('[data-testid="register-btn"]')
    await expect(page.locator('[data-testid="register-success"]')).toBeVisible()
  })

  test('R02 - all empty fields shows all four errors', async ({ page }) => {
    await page.click('[data-testid="register-btn"]')
    await expect(page.locator('[data-testid="username-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="reg-email-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="mobile-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="reg-pass-error"]')).toBeVisible()
  })

  test('R03 - username less than 3 characters is rejected', async ({ page }) => {
    await page.fill('[data-testid="username-input"]', 'ab')
    await page.fill('[data-testid="reg-email-input"]', VALID.email)
    await page.fill('[data-testid="mobile-input"]', VALID.mobile)
    await page.fill('[data-testid="reg-pass-input"]', VALID.pass)
    await page.click('[data-testid="register-btn"]')
    await expect(page.locator('[data-testid="username-error"]')).toContainText('3 characters')
  })

  test('R04 - mobile number with letters is rejected', async ({ page }) => {
    await page.fill('[data-testid="username-input"]', VALID.username)
    await page.fill('[data-testid="reg-email-input"]', VALID.email)
    await page.fill('[data-testid="mobile-input"]', 'abcdefghij')
    await page.fill('[data-testid="reg-pass-input"]', VALID.pass)
    await page.click('[data-testid="register-btn"]')
    await expect(page.locator('[data-testid="mobile-error"]')).toBeVisible()
  })

  test('R05 - password less than 8 characters is rejected', async ({ page }) => {
    await page.fill('[data-testid="username-input"]', VALID.username)
    await page.fill('[data-testid="reg-email-input"]', VALID.email)
    await page.fill('[data-testid="mobile-input"]', VALID.mobile)
    await page.fill('[data-testid="reg-pass-input"]', 'abc')
    await page.click('[data-testid="register-btn"]')
    await expect(page.locator('[data-testid="reg-pass-error"]')).toContainText('8 characters')
  })
})
