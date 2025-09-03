# QA acceptance criteria

This document defines the current, testable functionality of the app and the acceptance criteria covered by automated e2e tests.

## Scope (current features)
- Authentication
  - Login with email and password using JWT cookie
  - Logout clears session
  - Signup requires: email, username, password, gender (male|female), and at least 2 tags
- Users listing
  - Authenticated users see the users list
  - Search by text queries username/display_name/bio (Postgres FTS)
  - Filter by one or more tags; results contain users that have all selected tags
  - Each user card shows primary photo, display name or username, gender, bio (if any), and tags
- Protected page
  - `/me` shows profile details for authenticated users
  - Unauthenticated users visiting `/me` see a not-logged-in message

## Acceptance criteria

### Login
- Given a seeded user `alice@example.com` / `password`
- When I visit `/login`, fill email+password and submit
- Then I am redirected to `/` and I see the users section
- When I enter a wrong password and submit
- Then I see an error message "Invalid credentials"

### Signup
- Given tags exist (seeded: hiking, music, tech, gaming, vegan)
- When I visit `/signup` and fill unique email and username, choose gender, pick at least two tags, set a password and submit
- Then I am redirected to `/login`
- And attempting to re-use the same email/username returns a 409 with an error message

### Users list, search, and filters
- Given I am logged in as a valid user
- When I visit `/`
- Then I see the users toolbar and a non-empty users list
- When I type a query into the search input
- Then the list updates to reflect results; if no match, an empty state appears
- When I toggle a tag filter (e.g., music)
- Then every displayed user card contains that tag
- When I toggle multiple tags
- Then every displayed user card contains all selected tags

### Protected `/me`
- When unauthenticated and visiting `/me`
- Then I see a "You are not logged in." message
- When authenticated and visiting `/me`
- Then I see my id and email

## Test selectors
Stable attributes used by tests:
- Login: `[data-testid="login-email"]`, `[data-testid="login-password"]`, `[data-testid="login-submit"]`
- Signup: `[data-testid="signup-form"]`, `[data-testid="signup-email"]`, `[data-testid="signup-username"]`, `[data-testid="signup-display-name"]`, `[data-testid="signup-password"]`, `[data-testid="signup-gender-male"]`, `[data-testid="signup-gender-female"]`, `[data-testid="signup-tag-<slug>"]`, `[data-testid="signup-submit"]`
- Users: `[data-testid="users-toolbar"]`, `[data-testid="users-search"]`, `[data-testid="users-loading"]`, `[data-testid="users-empty"]`, `[data-testid="users-list"]`, `[data-testid="user-card"]`, `[data-testid="user-tag"]`, `[data-testid="filter-tag-<slug>"]`

## How to run tests locally
1. Ensure the stack is up and reachable at `http://localhost:3000`:
   - `docker compose up -d` from `infra/docker/`
2. From `apps/web/`:
   - Install test deps: `npm install -D @playwright/test`
   - Install browsers once: `npx playwright install chromium`
   - Run tests: `npm run test:e2e`

Notes:
- Tests assume the default seed data is present.
- The signup test creates a random user to avoid collisions.
