# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### A&M Studios (`artifacts/am-studios`)
- **Kind**: react-vite web app
- **Preview path**: `/`
- **Purpose**: One-page agency website for A&M Studios web design agency
- **Stack**: React + Vite, CSS Modules, Framer Motion — NO Tailwind in component JSX
- **Sections**: Navbar, Hero, Services, About, Portfolio, Process, Contact, Footer
- **No backend**: Frontend only, contact form is UI-only
- **Portfolio cards**: Clickable with placeholder `href="#"` links (open in new tab)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
