import { test, expect } from '@playwright/test'
import { validRegister, badRegister } from './data/users.js'

test.describe('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('R01 - valid registration shows success message', async ({ page }) => {
    await page.fill('[data-testid="username-input"]', validRegister.username)
    await page.fill('[data-testid="reg-email-input"]', validRegister.email)
    await page.fill('[data-testid="mobile-input"]', validRegister.mobile)
    await page.fill('[data-testid="reg-pass-input"]', validRegister.pass)
    await page.click('[data-testid="register-btn"]')
    await expect(page.locator('[data-testid="register-success"]')).toBeVisible()
  })

  test('R02 - login link navigates back to login page', async ({ page }) => {
    await page.click('[data-testid="login-link"]')
    await expect(page).toHaveURL('/login')
  })

  test('R03 - empty username shows required error', async ({ page }) => {
    await page.fill('[data-testid="reg-email-input"]', validRegister.email)
    await page.fill('[data-testid="mobile-input"]', validRegister.mobile)
    await page.fill('[data-testid="reg-pass-input"]', validRegister.pass)
    await page.click('[data-testid="register-btn"]')
    await expect(page.locator('[data-testid="username-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="username-error"]')).toContainText('required')
  })

  test('R04 - username less than 3 characters is rejected', async ({ page }) => {
    await page.fill('[data-testid="username-input"]', badRegister.shortUser.username)
    await page.fill('[data-testid="reg-email-input"]', badRegister.shortUser.email)
    await page.fill('[data-testid="mobile-input"]', badRegister.shortUser.mobile)
    await page.fill('[data-testid="reg-pass-input"]', badRegister.shortUser.pass)
    await page.click('[data-testid="register-btn"]')
    await expect(page.locator('[data-testid="username-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="username-error"]')).toContainText('3 characters')
  })

  test('R05 - invalid email format shows email error', async ({ page }) => {
    await page.fill('[data-testid="username-input"]', badRegister.badEmail.username)
    await page.fill('[data-testid="reg-email-input"]', badRegister.badEmail.email)
    await page.fill('[data-testid="mobile-input"]', badRegister.badEmail.mobile)
    await page.fill('[data-testid="reg-pass-input"]', badRegister.badEmail.pass)
    await page.click('[data-testid="register-btn"]')
    await expect(page.locator('[data-testid="reg-email-error"]')).toBeVisible()
  })

  test('R06 - mobile less than 10 digits is rejected', async ({ page }) => {
    await page.fill('[data-testid="username-input"]', badRegister.shortMobile.username)
    await page.fill('[data-testid="reg-email-input"]', badRegister.shortMobile.email)
    await page.fill('[data-testid="mobile-input"]', badRegister.shortMobile.mobile)
    await page.fill('[data-testid="reg-pass-input"]', badRegister.shortMobile.pass)
    await page.click('[data-testid="register-btn"]')
    await expect(page.locator('[data-testid="mobile-error"]')).toBeVisible()
  })

  test('R07 - mobile number with letters is rejected', async ({ page }) => {
    await page.fill('[data-testid="username-input"]', badRegister.letterMobile.username)
    await page.fill('[data-testid="reg-email-input"]', badRegister.letterMobile.email)
    await page.fill('[data-testid="mobile-input"]', badRegister.letterMobile.mobile)
    await page.fill('[data-testid="reg-pass-input"]', badRegister.letterMobile.pass)
    await page.click('[data-testid="register-btn"]')
    await expect(page.locator('[data-testid="mobile-error"]')).toBeVisible()
  })

  test('R08 - password less than 8 characters is rejected', async ({ page }) => {
    await page.fill('[data-testid="username-input"]', badRegister.shortPass.username)
    await page.fill('[data-testid="reg-email-input"]', badRegister.shortPass.email)
    await page.fill('[data-testid="mobile-input"]', badRegister.shortPass.mobile)
    await page.fill('[data-testid="reg-pass-input"]', badRegister.shortPass.pass)
    await page.click('[data-testid="register-btn"]')
    await expect(page.locator('[data-testid="reg-pass-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="reg-pass-error"]')).toContainText('8 characters')
  })

  test('R09 - all fields empty shows all four error messages', async ({ page }) => {
    await page.click('[data-testid="register-btn"]')
    await expect(page.locator('[data-testid="username-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="reg-email-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="mobile-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="reg-pass-error"]')).toBeVisible()
  })

  test('R10 - show/hide password toggle on register page works', async ({ page }) => {
    await page.fill('[data-testid="reg-pass-input"]', 'testpass1')
    const inp = page.locator('[data-testid="reg-pass-input"]')
    await expect(inp).toHaveAttribute('type', 'password')
    await page.click('[data-testid="reg-pw-toggle"]')
    await expect(inp).toHaveAttribute('type', 'text')
  })
})
