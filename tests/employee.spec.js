import { test, expect } from '@playwright/test'
import { validEmployee, badEmployee } from './data/users.js'

test.describe('Employee Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'admin@corp.com')
    await page.fill('[data-testid="password-input"]', 'Admin@123')
    await page.click('[data-testid="login-btn"]')
    await expect(page).toHaveURL('/dashboard')
    await page.click('[data-testid="emp-form-link"]')
    await expect(page).toHaveURL('/employee')
  })

  async function fillValid(page) {
    await page.fill('[data-testid="emp-name-input"]', validEmployee.name)
    await page.fill('[data-testid="emp-email-input"]', validEmployee.email)
    await page.fill('[data-testid="emp-phone-input"]', validEmployee.phone)
    await page.selectOption('[data-testid="emp-dept-select"]', validEmployee.dept)
    await page.fill('[data-testid="emp-role-input"]', validEmployee.role)
  }

  test('E01 - all valid data shows success message', async ({ page }) => {
    await fillValid(page)
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="form-success"]')).toBeVisible()
    await expect(page.locator('[data-testid="form-success"]')).toContainText('successfully')
  })

  test('E02 - form fields are cleared after successful submit', async ({ page }) => {
    await fillValid(page)
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="emp-name-input"]')).toHaveValue('')
    await expect(page.locator('[data-testid="emp-email-input"]')).toHaveValue('')
  })

  test('E03 - department dropdown has correct options', async ({ page }) => {
    const opts = page.locator('[data-testid="emp-dept-select"] option')
    await expect(opts).toHaveCount(7)
  })

  test('E04 - each department option is selectable', async ({ page }) => {
    const depts = ['Engineering', 'Marketing', 'Finance', 'HR', 'Operations', 'Design']
    for (const d of depts) {
      await page.selectOption('[data-testid="emp-dept-select"]', d)
      await expect(page.locator('[data-testid="emp-dept-select"]')).toHaveValue(d)
    }
  })

  test('E05 - empty name shows required error', async ({ page }) => {
    await page.fill('[data-testid="emp-email-input"]', validEmployee.email)
    await page.fill('[data-testid="emp-phone-input"]', validEmployee.phone)
    await page.selectOption('[data-testid="emp-dept-select"]', validEmployee.dept)
    await page.fill('[data-testid="emp-role-input"]', validEmployee.role)
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="emp-name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="emp-name-error"]')).toContainText('required')
  })

  test('E06 - name less than 2 characters is rejected', async ({ page }) => {
    await page.fill('[data-testid="emp-name-input"]', badEmployee.shortName)
    await page.fill('[data-testid="emp-email-input"]', validEmployee.email)
    await page.fill('[data-testid="emp-phone-input"]', validEmployee.phone)
    await page.selectOption('[data-testid="emp-dept-select"]', validEmployee.dept)
    await page.fill('[data-testid="emp-role-input"]', validEmployee.role)
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="emp-name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="emp-name-error"]')).toContainText('2 characters')
  })

  test('E07 - numbers in name field are rejected', async ({ page }) => {
    await page.fill('[data-testid="emp-name-input"]', badEmployee.numInName)
    await page.fill('[data-testid="emp-email-input"]', validEmployee.email)
    await page.fill('[data-testid="emp-phone-input"]', validEmployee.phone)
    await page.selectOption('[data-testid="emp-dept-select"]', validEmployee.dept)
    await page.fill('[data-testid="emp-role-input"]', validEmployee.role)
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="emp-name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="emp-name-error"]')).toContainText('numbers')
  })

  test('E08 - invalid email format shows error', async ({ page }) => {
    await page.fill('[data-testid="emp-name-input"]', validEmployee.name)
    await page.fill('[data-testid="emp-email-input"]', badEmployee.invalidEmail)
    await page.fill('[data-testid="emp-phone-input"]', validEmployee.phone)
    await page.selectOption('[data-testid="emp-dept-select"]', validEmployee.dept)
    await page.fill('[data-testid="emp-role-input"]', validEmployee.role)
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="emp-email-error"]')).toBeVisible()
  })

  test('E09 - phone with letters is rejected', async ({ page }) => {
    await page.fill('[data-testid="emp-name-input"]', validEmployee.name)
    await page.fill('[data-testid="emp-email-input"]', validEmployee.email)
    await page.fill('[data-testid="emp-phone-input"]', badEmployee.letterPhone)
    await page.selectOption('[data-testid="emp-dept-select"]', validEmployee.dept)
    await page.fill('[data-testid="emp-role-input"]', validEmployee.role)
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="emp-phone-error"]')).toBeVisible()
  })

  test('E10 - phone less than 10 digits is rejected', async ({ page }) => {
    await page.fill('[data-testid="emp-name-input"]', validEmployee.name)
    await page.fill('[data-testid="emp-email-input"]', validEmployee.email)
    await page.fill('[data-testid="emp-phone-input"]', badEmployee.shortPhone)
    await page.selectOption('[data-testid="emp-dept-select"]', validEmployee.dept)
    await page.fill('[data-testid="emp-role-input"]', validEmployee.role)
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="emp-phone-error"]')).toBeVisible()
  })

  test('E11 - no department selected shows error', async ({ page }) => {
    await page.fill('[data-testid="emp-name-input"]', validEmployee.name)
    await page.fill('[data-testid="emp-email-input"]', validEmployee.email)
    await page.fill('[data-testid="emp-phone-input"]', validEmployee.phone)
    await page.fill('[data-testid="emp-role-input"]', validEmployee.role)
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="emp-dept-error"]')).toBeVisible()
  })

  test('E12 - all empty fields shows all five errors at once', async ({ page }) => {
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="emp-name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="emp-email-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="emp-phone-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="emp-dept-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="emp-role-error"]')).toBeVisible()
  })

  test('E13 - name with hyphens and apostrophes is accepted', async ({ page }) => {
    await page.fill('[data-testid="emp-name-input"]', badEmployee.hyphenName)
    await page.fill('[data-testid="emp-email-input"]', validEmployee.email)
    await page.fill('[data-testid="emp-phone-input"]', validEmployee.phone)
    await page.selectOption('[data-testid="emp-dept-select"]', validEmployee.dept)
    await page.fill('[data-testid="emp-role-input"]', validEmployee.role)
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="form-success"]')).toBeVisible()
  })

  test('E14 - name longer than 80 characters is rejected', async ({ page }) => {
    await page.fill('[data-testid="emp-name-input"]', badEmployee.longName)
    await page.fill('[data-testid="emp-email-input"]', validEmployee.email)
    await page.fill('[data-testid="emp-phone-input"]', validEmployee.phone)
    await page.selectOption('[data-testid="emp-dept-select"]', validEmployee.dept)
    await page.fill('[data-testid="emp-role-input"]', validEmployee.role)
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="emp-name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="emp-name-error"]')).toContainText('80')
  })

  test('E15 - email in all caps is accepted (case insensitive)', async ({ page }) => {
    await page.fill('[data-testid="emp-name-input"]', validEmployee.name)
    await page.fill('[data-testid="emp-email-input"]', badEmployee.capsEmail)
    await page.fill('[data-testid="emp-phone-input"]', validEmployee.phone)
    await page.selectOption('[data-testid="emp-dept-select"]', validEmployee.dept)
    await page.fill('[data-testid="emp-role-input"]', validEmployee.role)
    await page.click('[data-testid="emp-submit-btn"]')
    await expect(page.locator('[data-testid="form-success"]')).toBeVisible()
  })

  test('E16 - reset button clears all fields', async ({ page }) => {
    await fillValid(page)
    await page.click('[data-testid="emp-reset-btn"]')
    await expect(page.locator('[data-testid="emp-name-input"]')).toHaveValue('')
    await expect(page.locator('[data-testid="emp-email-input"]')).toHaveValue('')
    await expect(page.locator('[data-testid="emp-phone-input"]')).toHaveValue('')
    await expect(page.locator('[data-testid="emp-role-input"]')).toHaveValue('')
  })
})
