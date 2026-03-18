# FixedFlow — Agent Instructions

FixedFlow is a personal web app for tracking recurring/static costs (subscriptions, insurances, utilities, etc.) so they can be compared against a monthly budget without manual re-entry each month.

## Project Goals

- Users define **categories** (e.g. Streaming, Insurance) and **services** within each (e.g. Netflix, car insurance)
- Each service has a **payment frequency**: monthly, quarterly, or yearly
- The app **normalizes** all costs to a monthly view, distributing quarterly/yearly payments to the correct months
- A clean web UI for managing these, hostable via Docker on a VPS

## Tech Stack

- **Framework**: SvelteKit (Node adapter)
- **Database**: SQLite via Drizzle ORM (`better-sqlite3`)
- **Styling**: Tailwind CSS
- **Containerization**: Docker + docker-compose
- **Runtime**: Node.js 20

## Project Structure (target)

```
fixedflow/
├── src/
│   ├── lib/
│   │   ├── db/           # Drizzle schema and client
│   │   └── components/   # Reusable Svelte components
│   └── routes/           # SvelteKit file-based routing
├── static/
├── drizzle/              # Migrations
├── Dockerfile
├── docker-compose.yml
├── drizzle.config.ts
├── svelte.config.js
├── tailwind.config.js
└── package.json
```

## Data Model

```
Category
  id, name, color, icon, created_at

Service
  id, category_id, name, amount, currency, frequency (monthly|quarterly|yearly),
  billing_month (1-12, for quarterly/yearly: which month it first hits),
  active_from (date), active_until (date nullable), notes, created_at, updated_at
```

## Agent Workflow

This project uses an autonomous agent workflow via GitHub Actions and Claude Code.

### How issues are processed

1. User creates an issue describing a feature or bug
2. User can ask `@claude` to plan the implementation by commenting on the issue
3. User adds label `agent:implement` → Claude Code implements the feature in a new branch and opens a PR
4. PR is opened → Claude Code automatically reviews the PR and posts a review comment
5. CI runs tests and build checks
6. User reviews and merges

### Labels

- `agent:implement` — triggers Claude Code to implement the issue
- `agent:review` — triggers Claude Code to review a PR (auto-applied on PR open)
- `bug` — bug report
- `feature` — new feature request
- `chore` — maintenance task

### When implementing

- Always create a new branch named `feat/<issue-number>-<short-slug>` or `fix/<issue-number>-<short-slug>`
- Write a meaningful PR description referencing the issue (`Closes #<n>`)
- Keep changes focused — one issue, one PR
- Run `npm run check` and `npm run lint` before committing
- Write or update tests for any non-trivial logic
- Do not modify `CLAUDE.md` unless explicitly asked

### When reviewing

- Check for correctness, security, and simplicity
- Flag any hardcoded secrets, SQL injection risks, or XSS vectors
- Suggest improvements as non-blocking comments unless they are actual bugs
- Approve if the implementation is correct and follows conventions

## Coding Conventions

- TypeScript throughout (strict mode)
- Prefer server-side data loading in SvelteKit `+page.server.ts` files
- No client-side fetching unless necessary for interactivity
- Tailwind utility classes only — no custom CSS files unless unavoidable
- Drizzle for all DB access — no raw SQL strings
- Keep components small and single-purpose
- Dates stored as ISO strings in SQLite

## Environment Variables

```
DATABASE_URL=./data/fixedflow.db   # path to SQLite file
PORT=3000
```

## Docker

The app runs as a single container. SQLite data is persisted via a named volume at `/app/data`.

```bash
docker-compose up -d
```
