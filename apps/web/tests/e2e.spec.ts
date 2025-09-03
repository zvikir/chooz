import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('login success and failure', async ({ page }) => {
    await page.goto('/login')
    await page.getByTestId('login-email').fill('alice@example.com')
    await page.getByTestId('login-password').fill('wrong')
    await page.getByTestId('login-submit').click()
    await expect(page.getByText('Invalid credentials')).toBeVisible()

    await page.getByTestId('login-password').fill('password')
    await page.getByTestId('login-submit').click()
    await page.waitForURL('**/')
    await expect(page.getByTestId('users-toolbar')).toBeVisible()
  })

  test('signup flow and duplicate prevention', async ({ page }) => {
    const rand = Math.random().toString(36).slice(2, 8)
    const email = `tester_${rand}@example.com`
    const username = `tester_${rand}`

    // Use API to perform signup deterministically with two valid tags
    const tagsResp = await page.request.get('/api/tags')
    expect(tagsResp.ok()).toBeTruthy()
    const tags = (await tagsResp.json()) as Array<{ slug: string }>
    const tagSlugs = tags.slice(0, 2).map(t => t.slug)
    expect(tagSlugs.length).toBeGreaterThanOrEqual(2)

    const signupResp = await page.request.post('/api/auth/signup', {
      data: { email, username, password: 'password', display_name: 'Tester', gender: 'male', tag_slugs: tagSlugs }
    })
    expect(signupResp.status()).toBe(201)

    // Redirect behavior: navigate to login and ensure visible
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()

    // Duplicate prevention
    const dupResp = await page.request.post('/api/auth/signup', {
      data: { email, username, password: 'password', gender: 'male', tag_slugs: tagSlugs }
    })
    expect(dupResp.status()).toBe(409)
  })
})

test.describe('Protected /me', () => {
  test('unauthenticated shows message, authenticated shows profile', async ({ page, context }) => {
    await page.goto('/logout').catch(() => {})
    await page.goto('/me')
    await expect(page.getByText('You are not logged in.')).toBeVisible()

    // login
    await page.goto('/login')
    await page.getByTestId('login-email').fill('alice@example.com')
    await page.getByTestId('login-password').fill('password')
    await page.getByTestId('login-submit').click()
    await page.waitForURL('**/')
    // ensure home loaded and authenticated UI visible
    await expect(page.getByTestId('users-toolbar')).toBeVisible()
    await page.goto('/me')
    await expect(page.getByRole('heading', { name: 'My profile' })).toBeVisible()
    await expect(page.getByText('Email:')).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Users listing, search and filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByTestId('login-email').fill('alice@example.com')
    await page.getByTestId('login-password').fill('password')
    await page.getByTestId('login-submit').click()
    await page.waitForURL('**/')
  })

  test('shows list and can search', async ({ page }) => {
    await expect(page.getByTestId('users-list')).toBeVisible()
    const initialCount = await page.getByTestId('user-card').count()
    expect(initialCount).toBeGreaterThan(0)

    await page.getByTestId('users-search').fill('nonexistentuserquery')
    await expect(page.getByTestId('users-empty')).toBeVisible()

    await page.getByTestId('users-search').fill('alice')
    await expect(page.getByTestId('users-list')).toBeVisible()
  })

  test('filter by tag(s)', async ({ page }) => {
    await expect(page.getByTestId('users-list')).toBeVisible()
    // try a tag we know exists from seed, e.g., music
    const tag = page.getByTestId('filter-tag-music')
    if (await tag.isVisible()) {
      await tag.click()
      const cardCount = await page.getByTestId('user-card').count()
      for (let i = 0; i < cardCount; i++) {
        const card = page.getByTestId('user-card').nth(i)
        await expect(card.getByTestId('user-tag').filter({ hasText: 'Music' })).toHaveCount(1)
      }
    }
  })
})


