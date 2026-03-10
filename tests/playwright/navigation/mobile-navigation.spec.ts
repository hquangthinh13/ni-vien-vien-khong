import { test, expect } from '@playwright/test'

test.describe('Mobile Navigation', () => {

  test.use({
    viewport: { width: 375, height: 812 }
  })

  test('Open mobile menu and navigate to Activity', async ({ page }) => {

    await page.goto('/')

    await page.getByRole('button', { name: 'Menu' }).click()

    await page
        .getByRole('link', { name: 'Tin tức' })
        .click()

    await expect(page).toHaveURL(/.*activity/)
  })

})