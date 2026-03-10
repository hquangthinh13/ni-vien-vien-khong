import { test, expect } from '@playwright/test'



test.describe('Navigation Tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    const introductionPages = [
        {
            name: 'Ni Viện Viên Không Xưa Và Nay',
            path: '/introduction/past-and-present',
        },
        {
            name: 'Tịnh Cảnh Viên Không',
            path: '/introduction/scenery-of-vien-khong',
        },
        {
            name: 'Thời khóa tu tập',
            path: '/introduction/schedule',
        },
        {
            name: 'Các tu viện khác',
            path: '/introduction/others',
        },
    ]

    for (const pageData of introductionPages) {
    test(`Navigate to ${pageData.name}`, async ({ page }) => {

        await page.getByRole('button', { name: 'Giới thiệu' }).click()

        await page.locator(`a[href="${pageData.path}"]`).click()

        await expect(page).toHaveURL(new RegExp(pageData.path))
    })
    }

    test('Navigate to Activity page from navbar', async ({ page }) => {
        await page.locator('a[href="/activity"]').first().click()

        await expect(page).toHaveURL(/.*activity/)
        await expect(page.locator('body')).toBeVisible()
    })

    test('Navigate to Course page from navbar', async ({ page }) => {
        await page.locator('a[href="/course"]').first().click()

        await expect(page).toHaveURL(/.*course/)
        await expect(page.locator('body')).toBeVisible()
    })

    test('Navigate to Library Question page from homepage link', async ({ page }) => {
        await page.locator('a[href="/library/question"]').click()

        await expect(page).toHaveURL(/.*library\/question/)
    })

    test('Navigate to Activity from homepage section', async ({ page }) => {
        await page.locator('a[href="/activity"]').last().click()

        await expect(page).toHaveURL(/.*activity/)
    })

    test('Navigate to Course from homepage section', async ({ page }) => {
        await page.locator('a[href="/course"]').last().click()

        await expect(page).toHaveURL(/.*course/)
    })

})