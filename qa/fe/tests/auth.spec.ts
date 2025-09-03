import { test, expect } from '@playwright/test'

async function loginViaApiAndSetCookie(page: import('@playwright/test').Page, email: string, password: string) {
  const base = process.env.E2E_BASE_URL || 'http://localhost:3000'
  const host = new URL(base).hostname
  const resp = await page.request.post('/api/auth/login', {
    data: { email, password },
  })
  expect(resp.ok()).toBeTruthy()
  const setCookie = resp.headers()['set-cookie'] || resp.headers()['Set-Cookie']
  expect(setCookie, 'login should return Set-Cookie').toBeTruthy()
  const match = /auth=([^;]+)/.exec(Array.isArray(setCookie) ? setCookie.join(';') : setCookie as string)
  expect(match).toBeTruthy()
  const token = match![1]
  await page.context().addCookies([
    {
      name: 'auth',
      value: token,
      domain: host,
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ])
}

test.describe('Auth', () => {
  test('login success and failure', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('alice@example.com')
    await page.getByLabel('Password').fill('wrong')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByText('Invalid credentials')).toBeVisible()

    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForURL('**/')
    await expect(page.getByTestId('users-toolbar')).toBeVisible({ timeout: 15000 })
  })

  test('protected /me page requires auth', async ({ page }) => {
    await page.goto('/logout').catch(() => {})
    await page.goto('/me')
    await expect(page.getByText('You are not logged in.')).toBeVisible()

    await loginViaApiAndSetCookie(page, 'alice@example.com', 'password')
    await page.goto('/me')
    await expect(page.getByRole('heading', { name: 'My profile' })).toBeVisible()
    await expect(page.getByText('You are not logged in.')).toHaveCount(0)
  })
})


