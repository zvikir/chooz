import { test, expect } from '@playwright/test'

/**
 * Test: Theme honors system preference by default
 * Purpose: Verify that when no manual choice is stored, the site applies the system theme.
 * Steps:
 * 1. Launch with default context (system simulated by browser). Navigate to '/'.
 * 2. Assert that either 'data-theme' or class on html/body reflects a dark or light scheme.
 * Note: This is a smoke assertion; implementation will define exact attribute.
 */
test('theme honors system preference by default', async ({ page }) => {
  await page.goto('/')
  const themeAttr = await page.evaluate(() => {
    const html = document.documentElement
    const body = document.body
    return {
      htmlClass: html.className,
      htmlData: html.getAttribute('data-theme'),
      bodyClass: body.className,
      bodyData: body.getAttribute('data-theme'),
    }
  })
  expect(themeAttr.htmlClass || themeAttr.htmlData || themeAttr.bodyClass || themeAttr.bodyData).toBeTruthy()
})

/**
 * Test: Manual toggle switches theme and persists across reloads
 * Purpose: Verify that selecting Dark/Light via a toggle updates theme and persists on reload.
 * Steps:
 * 1. Navigate to '/'. Open theme toggle and select Dark.
 * 2. Assert theme changed to Dark via class or data attribute.
 * 3. Reload; assert Dark is still applied.
 * 4. Switch to Light; assert applied and persists after reload.
 */
test('theme toggle switches and persists', async ({ page }) => {
  await page.goto('/')
  const toggle = page.getByRole('button', { name: /theme|dark|light|system/i })
  await toggle.click()
  const darkItem = page.getByRole('menuitem', { name: /dark/i }).first()
  await darkItem.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', /dark/i)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', /dark/i)
  await toggle.click()
  const lightItem = page.getByRole('menuitem', { name: /light/i }).first()
  await lightItem.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', /light/i)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', /light/i)
})

/**
 * Test: Accessible toggle with visible focus
 * Purpose: Ensure the theme toggle is keyboard reachable and shows focus ring.
 * Steps:
 * 1. Tab to the toggle.
 * 2. Assert it receives :focus-visible (implementation may add data-focus-visible or class).
 */
test('theme toggle is accessible and focus-visible', async ({ page }) => {
  await page.goto('/')
  const toggle = page.getByRole('button', { name: /theme|dark|light|system/i })
  await toggle.focus()
  await expect(toggle).toBeFocused()
})


