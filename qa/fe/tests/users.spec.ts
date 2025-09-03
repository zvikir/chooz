import { test, expect } from '@playwright/test'

test.describe('Users listing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('alice@example.com')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForURL('**/')
  })

  test('shows users and supports search', async ({ page }) => {
    await expect(page.getByTestId('users-list')).toBeVisible()
    const initial = await page.getByTestId('user-card').count()
    expect(initial).toBeGreaterThan(0)

    await page.getByTestId('users-search').fill('this-should-not-match-9b2e2b3f-12ab-4e13-b9b0-1b2c3d4e5f60')
    // Prefer waiting for loading spinner lifecycle to avoid races
    await expect(page.getByTestId('users-loading')).toBeVisible({ timeout: 15000 }).catch(() => {})
    await expect(page.getByTestId('users-loading')).toHaveCount(0, { timeout: 15000 })
    await expect(page.getByTestId('user-card')).toHaveCount(0, { timeout: 15000 })
    await expect(page.getByTestId('users-empty')).toBeVisible({ timeout: 15000 })

    await page.getByTestId('users-search').fill('alice')
    await expect(page.getByTestId('users-list')).toBeVisible()
  })
})


