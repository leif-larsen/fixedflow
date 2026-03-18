# FixedFlow

Track your recurring costs — subscriptions, insurances, utilities — so you never have to manually re-enter them into your budget month after month.

## What it does

- Define **categories** (e.g. Streaming, Insurance, Utilities)
- Add **services** within each category (e.g. Netflix, car insurance)
- Set **payment frequency**: monthly, quarterly, or yearly
- See a normalized **monthly view** of all costs
- Know exactly what hits your bank account each month

## Running locally

```bash
docker-compose up -d
```

App is available at `http://localhost:3000`.

## Development

```bash
npm install
npm run dev
```

Requires Node.js 20+. SQLite database is created automatically on first run at `./data/fixedflow.db`.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `./data/fixedflow.db` | Path to SQLite database file |
| `PORT` | `3000` | HTTP port |

## Agent workflow

This project is built and maintained using an autonomous Claude Code agent workflow.

To request a feature or report a bug, [open an issue](../../issues/new/choose). To trigger implementation, add the `agent:implement` label. See [CLAUDE.md](./CLAUDE.md) for full agent instructions.

## Tech stack

- [SvelteKit](https://kit.svelte.dev) — web framework
- [Drizzle ORM](https://orm.drizzle.team) + SQLite — database
- [Tailwind CSS](https://tailwindcss.com) — styling
- [Docker](https://docker.com) — deployment
