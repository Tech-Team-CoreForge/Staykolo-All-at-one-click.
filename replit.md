# Staykolo

Staykolo is a property-tech product for discovering and operating well-managed PG accommodation in Bengaluru.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/staykolo/src/` — Staykolo's React frontend and shared UI foundation
- `artifacts/staykolo/src/index.css` — Staykolo design tokens, type scale, responsive primitives, and interaction states
- `artifacts/staykolo/src/components/staykolo-ui.tsx` — shared logo, navigation, footer, search, card, and state components
- `artifacts/staykolo/src/pages/home.tsx` — current public home shell with local mock interactions
- `artifacts/api-server/` — shared Express API service, reserved for future backend phases
- `lib/api-spec/openapi.yaml` — shared API contract, currently health-check only

## Architecture decisions

- Phase 1 is frontend-only and uses local mock data; Supabase, real authentication, payments, and database wiring are intentionally deferred.
- Staykolo uses the scaffold's React + Vite artifact with Wouter route handling so future public, tenant, owner, and Super Admin surfaces can share one frontend shell without using the marketing navbar inside app areas.
- The visual system follows the supplied brand brief: white-first surfaces, restrained blue/cyan palette, Plus Jakarta Sans headings, Inter UI copy, low-motion transitions, and accessible focus states.

## Product

- Phase 1 establishes the reusable design system and public home shell for Staykolo.
- Planned product areas include PG discovery and detail pages, Chronicles, role-based auth UI, tenant self-service, owner operations, and Super Admin platform management.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
