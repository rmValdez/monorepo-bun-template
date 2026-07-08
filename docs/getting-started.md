# Getting Started

This guide explains how to set up, run, and develop the application locally.

## Prerequisites

- **Bun** (v1.3.11 or higher)
- **Docker** (For local PostgreSQL and Redis)
- **Git**

## 1. Installation

First, clone the repository and install all dependencies. Because we use Bun, this will be extremely fast and install dependencies for all apps and packages simultaneously.

```bash
bun install
```

## 2. Environment Variables

Copy the `.env.example` file to create your local `.env`.

```bash
cp .env.example .env
```

The defaults in `.env.example` are pre-configured to work with the provided Docker Compose setup.

## 3. Start Local Services (Database & Redis)

We have provided a `docker-compose.yml` file to instantly spin up PostgreSQL (port 5433) and Redis (port 6379).

```bash
docker compose up -d
```

## 4. Setup Database & Seed

Now that your database container is running, use the built-in setup script to format the schema, run migrations, and inject the seed data (Roles, Permissions, and default Users).

```bash
bun run setup-local-db
```

This command runs three things under the hood:
1. `bun --cwd packages/database db:generate` (Generates Prisma Client)
2. `bun --cwd packages/database prisma migrate reset --force` (Applies migrations)
3. `bun x turbo run db:seed` (Executes `packages/core/seed/seed.ts`)

## 5. Run the Application

Start the development server:

```bash
bun run dev
```

Turborepo will start both the `web` and `marketplace` applications.
- **Web App**: `http://localhost:3000`
- **Marketplace**: `http://localhost:3001`

### Filtering (Running only one app)
If you only want to work on the `web` app to save system resources, run:
```bash
bun run dev --filter web
```

## How was this boilerplate created?

This boilerplate originated from a much larger, complex, domain-specific application. It was refactored by systematically:
1. Stripping out all domain-specific models from the Prisma schema.
2. Wiping the old database migrations to provide a clean slate.
3. Rewriting the seed scripts to only include generic authentication requirements (Super Admin, Workspace Admin, Member).
4. Restructuring the folder layout to decouple the UI and Database into `@workspace` packages, allowing true monorepo scalability.
