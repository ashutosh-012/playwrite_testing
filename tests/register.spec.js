import { test, expect } from '@playwright/test'
import { smartFill, smartClick, smartLocator } from './ai/healer.js'

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
    await smartFill(page, '[data-testid="username-input"]', VALID.username)
    await smartFill(page, '[data-testid="reg-email-input"]', VALID.email)
    await smartFill(page, '[data-testid="mobile-input"]', VALID.mobile)
    await smartFill(page, '[data-testid="reg-pass-input"]', VALID.pass)
    await smartClick(page, '[data-testid="register-btn"]')
    const msg = await smartLocator(page, '[data-testid="register-success"]')
    await expect(msg).toBeVisible()
  })

  test('R02 - all empty fields shows all four errors', async ({ page }) => {
    await smartClick(page, '[data-testid="register-btn"]')
    await expect(await smartLocator(page, '[data-testid="username-error"]')).toBeVisible()
    await expect(await smartLocator(page, '[data-testid="reg-email-error"]')).toBeVisible()
    await expect(await smartLocator(page, '[data-testid="mobile-error"]')).toBeVisible()
    await expect(await smartLocator(page, '[data-testid="reg-pass-error"]')).toBeVisible()
  })

  test('R03 - username less than 3 characters is rejected', async ({ page }) => {
    await smartFill(page, '[data-testid="username-input"]', 'ab')
    await smartFill(page, '[data-testid="reg-email-input"]', VALID.email)
    await smartFill(page, '[data-testid="mobile-input"]', VALID.mobile)
    await smartFill(page, '[data-testid="reg-pass-input"]', VALID.pass)
    await smartClick(page, '[data-testid="register-btn"]')
    const err = await smartLocator(page, '[data-testid="username-error"]')
    await expect(err).toContainText('3 characters')
  })

  test('R04 - mobile number with letters is rejected', async ({ page }) => {
    await smartFill(page, '[data-testid="username-input"]', VALID.username)
    await smartFill(page, '[data-testid="reg-email-input"]', VALID.email)
    await smartFill(page, '[data-testid="mobile-input"]', 'abcdefghij')
    await smartFill(page, '[data-testid="reg-pass-input"]', VALID.pass)
    await smartClick(page, '[data-testid="register-btn"]')
    const err = await smartLocator(page, '[data-testid="mobile-error"]')
    await expect(err).toBeVisible()
  })

  test('R05 - password less than 8 characters is rejected', async ({ page }) => {
    await smartFill(page, '[data-testid="username-input"]', VALID.username)
    await smartFill(page, '[data-testid="reg-email-input"]', VALID.email)
    await smartFill(page, '[data-testid="mobile-input"]', VALID.mobile)
    await smartFill(page, '[data-testid="reg-pass-input"]', 'abc')
    await smartClick(page, '[data-testid="register-btn"]')
    const err = await smartLocator(page, '[data-testid="reg-pass-error"]')
    await expect(err).toContainText('8 characters')
  })
})
