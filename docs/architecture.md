# Monorepo Architecture

This project is structured as a **Turborepo** monorepo using **Bun** as the primary package manager and runtime.

## Workspace Layout

The repository is divided into two main boundaries: `apps` and `packages`.

```
.
├── apps/
│   ├── web/            # Main application (Port 3000)
│   └── marketplace/    # Secondary application (Port 3001)
└── packages/
    ├── database/       # @workspace/db (Prisma)
    ├── core/           # @workspace/core (Business logic, RBAC)
    └── ui/             # @workspace/ui (Shadcn UI components)
```

### 1. `apps/*` (Applications)
These are your runnable projects. They consume the packages.
- **`apps/web`**: Built with **TanStack Start** and **Vite**. This is your primary Admin/User portal. It implements Server-Side Rendering (SSR) and hosts its own server functions (`createServerFn`).

### 2. `packages/*` (Shared Libraries)
These are internal libraries meant to be imported by the applications. They contain pure logic, database clients, or UI components.
- **`@workspace/db`**: Contains the `schema.prisma` file, migrations, and exports the generated Prisma Client. By isolating this, any app or package can safely interact with the database using a single source of truth.
- **`@workspace/core`**: Contains domain-agnostic logic such as the Role-Based Access Control (RBAC) strings, authentication helpers, and database seeders.
- **`@workspace/ui`**: Contains generic UI components built with **Tailwind CSS** and **Shadcn UI**. Since components live here, both `web` and `marketplace` look visually identical without duplicating code.

## Technology Stack

| Layer | Technology |
|---|---|
| **Runtime & PM** | [Bun](https://bun.sh/) |
| **Monorepo** | [Turborepo](https://turbo.build/) |
| **Framework** | [TanStack Start](https://tanstack.com/start) (React + SSR) |
| **Routing** | [TanStack Router](https://tanstack.com/router) |
| **Database ORM** | [Prisma v7](https://www.prisma.io/) |
| **Database SQL** | PostgreSQL |
| **Authentication** | [better-auth](https://better-auth.com/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Validation** | [Zod](https://zod.dev/) |

## Why this Architecture?

1. **Scalability**: By separating the Database and UI into packages, you can spin up 5 different frontend applications tomorrow and they will all seamlessly share the same database and design system.
2. **Type Safety**: Using TanStack Router combined with Zod validation across the Server/Client boundary ensures 100% end-to-end type safety.
3. **Speed**: Bun installs dependencies instantly, and Vite compiles the frontend in milliseconds.
