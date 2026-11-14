# NutriTrack — Nutrition & Food Tracking App

A Next.js nutrition dashboard: daily dashboard, food diary, AI food scanner,
smart shopping list, meal planner, and analytics.

## Tech stack
Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Prisma (SQLite) ·
framer-motion · Zustand

## Setup

```bash
# 1. Install dependencies (Bun or npm both work)
bun install          # or: npm install

# 2. Configure environment
cp .env.example .env

# 3. (Optional) regenerate the Prisma client
bunx prisma generate

# 4. Start the dev server
bun run dev          # or: npm run dev
```

Then open **http://localhost:3000**.

## Notes
- The SQLite database ships with seed data at `db/custom.db`.
- To recreate the schema from scratch: `bunx prisma db push --accept-data-loss`.
- Default dev port: **3000**.
- Scripts: `dev`, `build`, `start`, `lint`, `db:push`, `db:generate`, `db:migrate`, `db:reset` (see `package.json`).
