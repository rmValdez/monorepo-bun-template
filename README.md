# bun-monorepo-template

A production-ready monorepo template built with **Bun**, **TanStack Start**, **Prisma**, and **better-auth**. Everything you need to ship a multi-tenant, role-based web application — without the boilerplate headaches.

## Stack

| Layer | Technology |
|---|---|
| Runtime & Package Manager | [Bun](https://bun.sh/) |
| Monorepo Orchestration | [Turborepo](https://turbo.build/) |
| Frontend Framework | [TanStack Start](https://tanstack.com/start) (SSR React) |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based, type-safe) |
| Data Fetching | [TanStack Query](https://tanstack.com/query) (SSR-integrated) |
| Forms | [TanStack Form](https://tanstack.com/form) |
| Server | [Nitro](https://nitro.build/) (Bun preset) |
| Database | PostgreSQL + [Prisma v7](https://www.prisma.io/) |
| Auth | [better-auth](https://better-auth.com/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Caching | Bun built-in Redis |
| File Storage | S3-compatible (optional) |
| Linting & Formatting | [Biome](https://biomejs.dev/) |

## Workspace Structure

```
.
├── apps/
│   ├── web/            # Main app (port 3000) — TanStack Start
│   └── marketplace/    # Second app stub (port 3001)
└── packages/
    ├── database/       # @workspace/db — Prisma client + schema
    ├── core/           # @workspace/core — RBAC, utilities, schemas
    └── ui/             # @workspace/ui — Shared component library
```

## Features

- ✅ **Authentication** — Email/password sign-in, registration, password reset (better-auth)
- ✅ **Multi-tenant RBAC** — Organizations, Members, Roles, Permissions with Redis-cached auth context
- ✅ **SSR + Server Functions** — TanStack Start `createServerFn` with CSRF protection
- ✅ **Type-safe routing** — File-based routes with full TypeScript inference
- ✅ **Data tables** — Sortable, filterable, paginated tables via TanStack Table
- ✅ **Form validation** — TanStack Form + Zod schemas
- ✅ **Error handling** — Typed error hierarchy (400/401/403/404/409/422/429/500/503)
- ✅ **File uploads** — S3-compatible storage (optional)
- ✅ **Demo feature** — Full Todo CRUD showcasing the complete data flow

## Sample Flow: Todo CRUD

The `Todo` feature is the built-in reference implementation. It demonstrates the complete pattern for any new feature:

```
Route (TanStack Router)
  └── beforeLoad / loader  →  TanStack Query (queryOptions)
        └── createServerFn  →  Zod validator  →  Service  →  Prisma
```

**Files to study:**
- `apps/web/src/routes/todos/` — Route + UI
- `apps/web/src/server/todo/todo.functions.ts` — Server functions
- `apps/web/src/server/todo/todo.query.ts` — Query options
- `apps/web/src/server/todo/todo.schema.ts` — Zod schema

## Documentation

For an in-depth understanding of how to build and expand this boilerplate, please refer to the `docs/` folder:
- 👶 [Beginner's Guide & Concepts](./docs/beginners-notes.md)
- 📖 [Getting Started & Setup Guide](./docs/getting-started.md)
- 🏗️ [Monorepo Architecture](./docs/architecture.md)
- 🔄 [Data Flow & Validation Rules](./docs/flow-and-validation.md)

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Set up environment

```bash
cp .env.example .env
# Fill in DATABASE_URL, BETTER_AUTH_SECRET, REDIS_URL
```

### 3. Set up the database

```bash
bun run setup-local-db
# Generates client → resets DB → runs migrations → seeds roles & permissions
```

### 4. Start development

```bash
bun run dev
# web app:         http://localhost:3000
# marketplace:     http://localhost:3001
```

## Available Commands

### Development

| Command | Description |
|---|---|
| `bun run dev` | Start all apps in dev mode |
| `bun run build` | Build all apps for production |
| `bun run start` | Run production build |

### Database

| Command | Description |
|---|---|
| `bun run setup-local-db` | Full local DB reset + seed |
| `bun --cwd packages/database prisma studio` | Open Prisma Studio |
| `bun --cwd packages/database prisma migrate dev` | Create + apply a migration |
| `bun --cwd packages/database prisma db push` | Push schema without migration |
| `bun --cwd packages/database prisma format` | Format schema file |
| `bun x turbo run db:generate` | Regenerate Prisma client |
| `bun x turbo run db:seed` | Re-seed roles & permissions |

### Code Quality

| Command | Description |
|---|---|
| `bun run lint` | Biome lint across all packages |
| `bun run check` | Biome format + lint + fix |
| `bun run format` | Biome format |
| `bun run typecheck` | TypeScript type check |

## RBAC System

Three built-in roles with generic permissions:

| Role | Permissions |
|---|---|
| `super-admin` | All permissions |
| `admin` | Manage users & members, read roles & permissions |
| `member` | Read users & members |

Add your own permissions in `packages/core/src/roles-and-permissions/permissions.ts`.

## Adding a New Feature

1. **Define the schema** — Add a model to `packages/database/prisma/schema.prisma`
2. **Run migration** — `bun --cwd packages/database prisma migrate dev`
3. **Create server module** — Add `src/server/my-feature/` with:
   - `my-feature.schema.ts` — Zod input validation
   - `my-feature.service.ts` — Business logic
   - `my-feature.functions.ts` — `createServerFn` handlers
   - `my-feature.query.ts` — `queryOptions` wrappers
4. **Create route** — Add `src/routes/(app)/my-feature/index.tsx`
5. **Add permissions** — Define in `packages/core/src/roles-and-permissions/permissions.ts`

## Troubleshooting

**Type errors after schema change:** Run `bun x turbo run db:generate`, then restart TS server (`F1 → TypeScript: Restart TS Server`).

**Biome language server crash:** `F1 → Developer: Reload Window`.
