import { test, expect } from '@playwright/test'

test.describe('Smoke Test - Contact Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('Contact page should load', async ({ page }) => {
    await expect(page).toHaveURL(/contact/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('No error page should appear', async ({ page }) => {
    await expect(page.getByText('Application error')).toHaveCount(0)
    await expect(page.getByText('404')).toHaveCount(0)
  })

})