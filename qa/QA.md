# QA - How to run tests

## Frontend (Playwright)
- Base URL: set `E2E_BASE_URL` (default: http://localhost:3000)
- Run: `docker compose -f infra/tests/docker-compose.qa.yml run --rm fe-tests`
- Reports (every run):
  - Text: `qa/fe/reports/report.txt`
  - JUnit: `qa/fe/reports/junit.xml`
  - JSON: `qa/fe/reports/results.json`

## Database (Vitest + pg)
- DB URL: set `DATABASE_URL`
- Run: `docker compose -f infra/tests/docker-compose.qa.yml run --rm db-tests`
- Reports:
  - Text: `qa/db/reports/summary.txt`
  - JUnit: `qa/db/reports/junit.xml`
  - JSON: `qa/db/reports/results.json`

Notes:
- Tests live under `qa/` and can target local/remote envs via env vars.
- Test containers install deps on startup and write reports even on failures.
