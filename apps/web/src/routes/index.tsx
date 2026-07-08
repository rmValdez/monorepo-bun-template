import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Blocks, Database, Lock, Sparkles, Zap } from "lucide-react";

export const Route = createFileRoute("/")({ component: HomePage });

const FEATURES = [
  {
    icon: <Zap className="size-5 text-primary" />,
    title: "TanStack Start",
    description: "SSR React with file-based routing, server functions, and streaming.",
  },
  {
    icon: <Database className="size-5 text-primary" />,
    title: "Prisma + PostgreSQL",
    description: "Type-safe database access with migrations and a built-in seed.",
  },
  {
    icon: <Lock className="size-5 text-primary" />,
    title: "Auth + RBAC",
    description: "better-auth with Redis-cached roles and granular permissions.",
  },
  {
    icon: <Blocks className="size-5 text-primary" />,
    title: "Shared Packages",
    description: "@workspace/ui, @workspace/core, and @workspace/db — ready to extend.",
  },
];

function HomePage() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-chart-2/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-svh max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex animate-pulse items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" />
          <span>bun-monorepo-template — ready to build</span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Your next app{" "}
          <span className="bg-linear-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
            starts here.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          A production-ready monorepo with Bun, TanStack Start, Prisma, better-auth, and a full
          RBAC system — all wired up and ready to ship.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/todos" preload="intent">
            <Button variant="outline" size="lg" className="gap-2 px-6">
              View Todo Demo
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" className="gap-2 px-6">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Feature grid */}
        <div className="mt-20 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-left">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm"
            >
              <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/10">
                {f.icon}
              </div>
              <h3 className="mb-1 text-sm font-semibold">{f.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
