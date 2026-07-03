import { test, expect } from '@playwright/test'

const EMP = {
  name: 'Jane Doe',
  email: 'jane@company.com',
  phone: '9876543210',
  dept: 'Engineering',
  role: 'Developer',
}

async function login(page) {
  await page.goto('/login')
  await page.fill('[data-testid="email-input"]', 'admin@corp.com')
  await page.fill('[data-testid="password-input"]', 'Admin@123')
  await page.click('[data-testid="login-btn"]')
  await page.waitForURL('/dashboard')
  await page.click('[data-testid="emp-form-link"]')
  await page.waitForURL('/employee')
}

async function fillAll(page) {
  await page.fill('[data-testid="emp-name-input"]', EMP.name)
  await page.fill('[data-testid="emp-email-input"]', EMP.email)
  await page.fill('[data-testid="emp-phone-input"]', EMP.phone)
  await page.selectOption('[data-testid="emp-dept-select"]', EMP.dept)
  await page.fill('[data-testid="emp-role-input"]', EMP.role)
}

test.describe('Employee Form', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('E01 - all valid data shows success message', async ({ page }) => {
    await fillAll(page)
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="form-success"]')).toContainText('successfully')
  })

  test('E02 - all empty fields shows all five errors', async ({ page }) => {
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="emp-name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="emp-email-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="emp-phone-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="emp-dept-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="emp-role-error"]')).toBeVisible()
  })

  test('E03 - numbers in name field are rejected', async ({ page }) => {
    await page.fill('[data-testid="emp-name-input"]', 'John123')
    await page.fill('[data-testid="emp-email-input"]', EMP.email)
    await page.fill('[data-testid="emp-phone-input"]', EMP.phone)
    await page.selectOption('[data-testid="emp-dept-select"]', EMP.dept)
    await page.fill('[data-testid="emp-role-input"]', EMP.role)
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="emp-name-error"]')).toContainText('numbers')
  })

  test('E04 - phone with letters is rejected', async ({ page }) => {
    await page.fill('[data-testid="emp-name-input"]', EMP.name)
    await page.fill('[data-testid="emp-email-input"]', EMP.email)
    await page.fill('[data-testid="emp-phone-input"]', 'abc123')
    await page.selectOption('[data-testid="emp-dept-select"]', EMP.dept)
    await page.fill('[data-testid="emp-role-input"]', EMP.role)
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="emp-phone-error"]')).toBeVisible()
  })

  test('E05 - reset button clears all fields', async ({ page }) => {
    await fillAll(page)
    await page.click('[data-testid="emp-reset-btn"]')
    await expect(page.locator('[data-testid="emp-name-input"]')).toHaveValue('')
    await expect(page.locator('[data-testid="emp-phone-input"]')).toHaveValue('')
  })
})
