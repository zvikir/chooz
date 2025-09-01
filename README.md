## Chooz - Local Development

### Prerequisites
- Docker Engine + Docker Compose V2
- Ports available: 3000 (web), 5432 (Postgres)

### Quick Start
```bash
cd infra/docker
docker compose up -d --build
docker compose logs -f web
```

- App: `http://localhost:3000`
- API: `http://localhost:3000/api/*`

Seeded users (example):
- Email: `alice@example.com`, password: `password`
- Email: `bob@example.com`, password: `password`

### Common Commands
- View logs
```bash
cd infra/docker
docker compose logs -f web
```

- Restart the web app
```bash
cd infra/docker
docker compose restart web
```

- Rebuild the web image (clean) and start
```bash
cd infra/docker
docker compose build --no-cache web
docker compose up -d web
```

### Stop & Remove
- Stop and remove containers (keep DB volume)
```bash
cd infra/docker
docker compose down
```

- Full reset (remove containers, network, and volumes)
```bash
cd infra/docker
docker compose down -v
```

After a full reset, bring the stack back up with the Quick Start. The database schema and seed data are automatically applied via the `infra/docker/init/*.sql` scripts.

### Troubleshooting
- Port 3000 already in use (EADDRINUSE): ensure no other dev server runs on the host.
```bash
lsof -i :3000 || ss -ltnp | grep 3000
```
- Web shows 500/blank after code changes: restart the web container
```bash
cd infra/docker
docker compose restart web
```
- Verify health quickly
```bash
curl -I http://localhost:3000
curl -I http://localhost:3000/login
curl -I http://localhost:3000/signup
```

### Notes
- Auth uses HttpOnly JWT cookies; no local env changes needed for basic dev.
- Postgres data persists in the `chooz-postgres` volume until you run `docker compose down -v`.


