# Frontend test descriptions

- login page renders: Verify the login page loads and shows the Login heading.
- Auth › login success and failure: Wrong password shows an error; correct credentials log in and reveal the users section.
- Auth › protected /me page requires auth: /me shows a not-logged-in message when unauthenticated; after API login, /me shows the profile.
- Users listing › shows users and supports search: Users list is visible; unmatched search shows empty state; known query restores results.
- Users listing › filters by single tag: Selecting a tag (Music) shows only cards containing that tag (skips if tag not present).
