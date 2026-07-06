import { test, expect } from '@playwright/test'
import { smartFill, smartClick, smartLocator } from './ai/healer.js'
import { loadTestData } from './ai/generate.js'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('L01 - valid credentials redirect to dashboard', async ({ page }) => {
    const { valid } = loadTestData()
    const c = valid[0]
    await smartFill(page, '[data-testid="email-input"]', c.email)
    await smartFill(page, '[data-testid="password-input"]', c.pass)
    await smartClick(page, '[data-testid="login-btn"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('L02 - AI-generated bad email formats all show error', async ({ page }) => {
    const { badEmail } = loadTestData()
    for (const c of badEmail) {
      await page.goto('/login')
      await smartFill(page, '[data-testid="email-input"]', c.email)
      await smartFill(page, '[data-testid="password-input"]', c.pass)
      await smartClick(page, '[data-testid="login-btn"]')
      const err = await smartLocator(page, '[data-testid="email-error"]')
      await expect(err).toBeVisible()
    }
  })

  test('L03 - AI-generated wrong passwords show invalid error', async ({ page }) => {
    const { badPass } = loadTestData()
    const c = badPass[0]
    await smartFill(page, '[data-testid="email-input"]', c.email)
    await smartFill(page, '[data-testid="password-input"]', c.pass)
    await smartClick(page, '[data-testid="login-btn"]')
    const err = await smartLocator(page, '[data-testid="api-error"]')
    await expect(err).toContainText('Invalid')
  })

  test('L04 - AI-generated security attacks are all rejected', async ({ page }) => {
    const { security } = loadTestData()
    for (const c of security) {
      await page.goto('/login')
      await smartFill(page, '[data-testid="email-input"]', c.email)
      await smartFill(page, '[data-testid="password-input"]', c.pass)
      await smartClick(page, '[data-testid="login-btn"]')
      await expect(page).not.toHaveURL('/dashboard')
    }
  })

  test('L05 - AI-generated edge cases do not crash the app', async ({ page }) => {
    const { edge } = loadTestData()
    for (const c of edge) {
      await page.goto('/login')
      await smartFill(page, '[data-testid="email-input"]', c.email)
      await smartFill(page, '[data-testid="password-input"]', c.pass)
      await smartClick(page, '[data-testid="login-btn"]')
      await expect(page).not.toHaveURL('/dashboard')
    }
  })

  test('L06 - show password toggle reveals and hides password', async ({ page }) => {
    await smartFill(page, '[data-testid="password-input"]', 'testpass')
    const inp = await smartLocator(page, '[data-testid="password-input"]')
    await expect(inp).toHaveAttribute('type', 'password')
    await smartClick(page, '[data-testid="pw-toggle"]')
    await expect(inp).toHaveAttribute('type', 'text')
    await smartClick(page, '[data-testid="pw-toggle"]')
    await expect(inp).toHaveAttribute('type', 'password')
  })
})
