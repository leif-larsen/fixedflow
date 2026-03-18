# Architecture

## Overview

FixedFlow is a single-container SvelteKit app backed by SQLite. It runs on a VPS (or local server) via Docker.

```
Browser → SvelteKit (Node) → Drizzle ORM → SQLite file
```

## Data Flow

- All data loading happens server-side in `+page.server.ts` load functions
- Form actions handle mutations (create, update, delete)
- No REST API needed for the initial version — SvelteKit form actions are sufficient
- If a public API is needed later (e.g. for Excel integration), it can be added as `+server.ts` endpoints

## Monthly Cost Normalization

Each service stores its raw amount and frequency. The monthly cost is computed on read:

| Frequency | Monthly cost formula |
|-----------|---------------------|
| monthly   | `amount` |
| quarterly | `amount / 3` |
| yearly    | `amount / 12` |

For display purposes (e.g. "what hits in March"), quarterly and yearly services are shown in full in their billing month(s), not spread across months. This mirrors how the user's bank account is actually affected.

## Billing month logic

- **Monthly**: hits every month
- **Quarterly**: hits in `billing_month`, `billing_month + 3`, `billing_month + 6`, `billing_month + 9` (mod 12)
- **Yearly**: hits only in `billing_month`

## Docker

```
fixedflow/
├── Dockerfile          # Multi-stage build
├── docker-compose.yml  # Single service + named volume for SQLite
└── data/               # Mounted volume (SQLite lives here)
```

The SQLite database file is stored at `/app/data/fixedflow.db` inside the container, persisted via a Docker volume.

## Future considerations

- Export endpoint: generate CSV/JSON of monthly costs for import into Excel
- Multi-user support (currently single-user, no auth)
- Currency conversion (currently single currency)
