# Frontend test descriptions

- login page renders: Verify the login page loads and shows the Login heading.
- Auth › login success and failure: Wrong password shows an error; correct credentials log in and reveal the users section.
- Auth › protected /me page requires auth: /me shows a not-logged-in message when unauthenticated; after API login, /me shows the profile.
- Users listing › shows users and supports search: Users list is visible; unmatched search shows empty state; known query restores results.

Theme (planned, test-first)
- Theme toggle honors system by default, supports Light/Dark/System override, and persists choice.
- Toggle is accessible (keyboard focus, ARIA labels) and updates theme class without page flash.
