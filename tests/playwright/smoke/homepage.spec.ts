import { test, expect } from '@playwright/test'

test.describe('Smoke Test - Homepage', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Homepage loads successfully', async ({ page }) => {
    await expect(page).toHaveURL('/')
    await expect(page.locator('body')).toBeVisible()
  })

  test('Navbar should be visible', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible()
  })

  test('Footer should be visible', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible()
  })

  test('No error page should appear', async ({ page }) => {
    await expect(page.getByText('Application error')).toHaveCount(0)
    await expect(page.getByText('404')).toHaveCount(0)
  })

})