import { test, expect } from '@playwright/test'

/**
 * FE Smoke: verifies the app is reachable and login page renders.
 */
test('login page renders', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
})


