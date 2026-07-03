import { test, expect } from '@playwright/test'
import { validUser, badUsers } from './data/users.js'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('L01 - valid credentials redirect to dashboard', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', validUser.email)
    await page.fill('[data-testid="password-input"]', validUser.pass)
    await page.click('[data-testid="login-btn"]')
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('[data-testid="dashboard-heading"]')).toBeVisible()
  })

  test('L02 - login button disabled when both fields are empty', async ({ page }) => {
    const btn = page.locator('[data-testid="login-btn"]')
    await expect(btn).toBeDisabled()
  })

  test('L03 - password field type is password by default', async ({ page }) => {
    const pw = page.locator('[data-testid="password-input"]')
    await expect(pw).toHaveAttribute('type', 'password')
  })

  test('L04 - show password toggle reveals password text', async ({ page }) => {
    await page.fill('[data-testid="password-input"]', 'testpass')
    await page.click('[data-testid="pw-toggle"]')
    await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute('type', 'text')
    await page.click('[data-testid="pw-toggle"]')
    await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute('type', 'password')
  })

  test('L05 - pressing Enter key submits the login form', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', validUser.email)
    await page.fill('[data-testid="password-input"]', validUser.pass)
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL('/dashboard')
  })

  test('L06 - forgot password link is present and clickable', async ({ page }) => {
    const link = page.locator('[data-testid="forgot-link"]')
    await expect(link).toBeVisible()
    await expect(link).toHaveText('Forgot Password?')
  })

  test('L07 - register link navigates to register page', async ({ page }) => {
    await page.click('[data-testid="register-link"]')
    await expect(page).toHaveURL('/register')
  })

  test('L08 - empty email shows required error', async ({ page }) => {
    await page.fill('[data-testid="password-input"]', validUser.pass)
    await page.evaluate(() => {
      document.querySelector('[data-testid="login-btn"]').removeAttribute('disabled')
    })
    await page.click('[data-testid="login-btn"]')
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="email-error"]')).toContainText('required')
  })

  test('L09 - empty password shows required error', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', validUser.email)
    await page.evaluate(() => {
      document.querySelector('[data-testid="login-btn"]').removeAttribute('disabled')
    })
    await page.click('[data-testid="login-btn"]')
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="password-error"]')).toContainText('required')
  })

  test('L10 - both empty shows both error messages', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelector('[data-testid="login-btn"]').removeAttribute('disabled')
    })
    await page.click('[data-testid="login-btn"]')
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible()
  })

  test('L11 - invalid email format (no @) shows format error', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', badUsers.noAt.email)
    await page.fill('[data-testid="password-input"]', badUsers.noAt.pass)
    await page.click('[data-testid="login-btn"]')
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="email-error"]')).toContainText('valid email')
  })

  test('L12 - invalid email format (no domain) shows format error', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', badUsers.noDomain.email)
    await page.fill('[data-testid="password-input"]', badUsers.noDomain.pass)
    await page.click('[data-testid="login-btn"]')
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
  })

  test('L13 - wrong password shows invalid credentials error', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', badUsers.wrongPass.email)
    await page.fill('[data-testid="password-input"]', badUsers.wrongPass.pass)
    await page.click('[data-testid="login-btn"]')
    await expect(page.locator('[data-testid="api-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="api-error"]')).toContainText('Invalid')
  })

  test('L14 - wrong email shows invalid credentials error', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', badUsers.wrongEmail.email)
    await page.fill('[data-testid="password-input"]', badUsers.wrongEmail.pass)
    await page.click('[data-testid="login-btn"]')
    await expect(page.locator('[data-testid="api-error"]')).toBeVisible()
  })

  test('L15 - both wrong shows invalid credentials error', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', badUsers.bothWrong.email)
    await page.fill('[data-testid="password-input"]', badUsers.bothWrong.pass)
    await page.click('[data-testid="login-btn"]')
    await expect(page.locator('[data-testid="api-error"]')).toBeVisible()
  })

  test('L16 - only spaces in email treated as empty', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', badUsers.spaceEmail.email)
    await page.fill('[data-testid="password-input"]', badUsers.spaceEmail.pass)
    await page.click('[data-testid="login-btn"]')
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
  })

  test('L17 - only spaces in password treated as empty', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', validUser.email)
    await page.fill('[data-testid="password-input"]', badUsers.spacePass.pass)
    await page.click('[data-testid="login-btn"]')
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible()
  })

  test('L18 - very long email (180+ chars) is rejected', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', badUsers.longEmail.email)
    await page.fill('[data-testid="password-input"]', validUser.pass)
    await page.click('[data-testid="login-btn"]')
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
  })

  test('L19 - SQL injection string in email is handled safely', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', badUsers.sqlInject.email)
    await page.fill('[data-testid="password-input"]', badUsers.sqlInject.pass)
    await page.click('[data-testid="login-btn"]')
    await expect(page).not.toHaveURL('/dashboard')
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
  })

  test('L20 - XSS script tag in email is handled safely', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', badUsers.xssEmail.email)
    await page.fill('[data-testid="password-input"]', validUser.pass)
    await page.click('[data-testid="login-btn"]')
    await expect(page).not.toHaveURL('/dashboard')
  })

  test('L21 - valid password with special characters works', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', validUser.email)
    await page.fill('[data-testid="password-input"]', validUser.pass)
    await page.click('[data-testid="login-btn"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('L22 - email with multiple @ signs is rejected', async ({ page }) => {
    await page.fill('[data-testid="email-input"]', badUsers.multiAt.email)
    await page.fill('[data-testid="password-input"]', validUser.pass)
    await page.click('[data-testid="login-btn"]')
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
  })
})
