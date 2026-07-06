import { test, expect } from '@playwright/test'
import { smartFill, smartClick, smartLocator } from './ai/healer.js'

const EMP = {
  name: 'Jane Doe',
  email: 'jane@company.com',
  phone: '9876543210',
  dept: 'Engineering',
  role: 'Developer',
}

async function login(page) {
  await page.goto('/login')
  await smartFill(page, '[data-testid="email-input"]', 'admin@corp.com')
  await smartFill(page, '[data-testid="password-input"]', 'Admin@123')
  await smartClick(page, '[data-testid="login-btn"]')
  await page.waitForURL('/dashboard')
  await smartClick(page, '[data-testid="emp-form-link"]')
  await page.waitForURL('/employee')
}

async function fillAll(page) {
  await smartFill(page, '[data-testid="emp-name-input"]', EMP.name)
  await smartFill(page, '[data-testid="emp-email-input"]', EMP.email)
  await smartFill(page, '[data-testid="emp-phone-input"]', EMP.phone)
  await page.selectOption('[data-testid="emp-dept-select"]', EMP.dept)
  await smartFill(page, '[data-testid="emp-role-input"]', EMP.role)
}

test.describe('Employee Form', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('E01 - all valid data shows success message', async ({ page }) => {
    await fillAll(page)
    await smartClick(page, '[data-testid="emp-submit-btn"]')
    const msg = await smartLocator(page, '[data-testid="form-success"]')
    await expect(msg).toContainText('successfully')
  })

  test('E02 - all empty fields shows all five errors', async ({ page }) => {
    await smartClick(page, '[data-testid="emp-submit-btn"]')
    await expect(await smartLocator(page, '[data-testid="emp-name-error"]')).toBeVisible()
    await expect(await smartLocator(page, '[data-testid="emp-email-error"]')).toBeVisible()
    await expect(await smartLocator(page, '[data-testid="emp-phone-error"]')).toBeVisible()
    await expect(await smartLocator(page, '[data-testid="emp-dept-error"]')).toBeVisible()
    await expect(await smartLocator(page, '[data-testid="emp-role-error"]')).toBeVisible()
  })

  test('E03 - numbers in name field are rejected', async ({ page }) => {
    await smartFill(page, '[data-testid="emp-name-input"]', 'John123')
    await smartFill(page, '[data-testid="emp-email-input"]', EMP.email)
    await smartFill(page, '[data-testid="emp-phone-input"]', EMP.phone)
    await page.selectOption('[data-testid="emp-dept-select"]', EMP.dept)
    await smartFill(page, '[data-testid="emp-role-input"]', EMP.role)
    await smartClick(page, '[data-testid="emp-submit-btn"]')
    const err = await smartLocator(page, '[data-testid="emp-name-error"]')
    await expect(err).toContainText('numbers')
  })

  test('E04 - phone with letters is rejected', async ({ page }) => {
    await smartFill(page, '[data-testid="emp-name-input"]', EMP.name)
    await smartFill(page, '[data-testid="emp-email-input"]', EMP.email)
    await smartFill(page, '[data-testid="emp-phone-input"]', 'abc123')
    await page.selectOption('[data-testid="emp-dept-select"]', EMP.dept)
    await smartFill(page, '[data-testid="emp-role-input"]', EMP.role)
    await smartClick(page, '[data-testid="emp-submit-btn"]')
    const err = await smartLocator(page, '[data-testid="emp-phone-error"]')
    await expect(err).toBeVisible()
  })

  test('E05 - reset button clears all fields', async ({ page }) => {
    await fillAll(page)
    await smartClick(page, '[data-testid="emp-reset-btn"]')
    await expect(await smartLocator(page, '[data-testid="emp-name-input"]')).toHaveValue('')
    await expect(await smartLocator(page, '[data-testid="emp-phone-input"]')).toHaveValue('')
  })
})
