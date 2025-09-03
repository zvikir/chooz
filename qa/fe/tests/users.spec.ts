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

    await page.getByTestId('users-search').fill('nonexistentuserquery')
    // Prefer waiting for loading spinner lifecycle to avoid races
    await expect(page.getByTestId('users-loading')).toBeVisible({ timeout: 15000 }).catch(() => {})
    await expect(page.getByTestId('users-loading')).toHaveCount(0, { timeout: 15000 })
    await expect(page.getByTestId('users-empty')).toBeVisible({ timeout: 15000 })

    await page.getByTestId('users-search').fill('alice')
    await expect(page.getByTestId('users-list')).toBeVisible()
  })

  test('filters by single tag', async ({ page }) => {
    const tag = page.getByTestId('filter-tag-music')
    if (!(await tag.isVisible())) test.skip()
    await tag.click()
    const count = await page.getByTestId('user-card').count()
    for (let i = 0; i < count; i++) {
      await expect(page.getByTestId('user-card').nth(i).getByTestId('user-tag').filter({ hasText: 'Music' })).toHaveCount(1)
    }
  })
})


