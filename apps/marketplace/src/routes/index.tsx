import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-chart-2/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-svh max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-8 inline-flex animate-pulse items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" />
          <span>Marketplace — Ready to build</span>
        </div>

        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Your next
          <span className="bg-linear-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
            {" Marketplace "}
          </span>
          starts here
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          A modern Marketplace starter built with TanStack Start, Tailwind CSS, and a component library ready for
          production.
        </p>
      </div>
    </div>
  );
}
