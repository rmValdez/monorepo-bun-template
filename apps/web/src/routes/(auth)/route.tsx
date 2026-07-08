import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useEffect, useState } from "react";
import { getDashboardPath } from "@/utils/auth.utils";

export const Route = createFileRoute("/(auth)")({
  beforeLoad: ({ context }) => {
    if (context.authSession) {
      const { organization } = context.authSession;
      if (!organization) throw redirect({ to: "/error", search: { reason: "no_organization" } });

      throw redirect({ to: getDashboardPath(organization.type) });
    }

    return { authSession: context.authSession };
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row font-sans antialiased bg-white">
      <DateTimeOverlay />

      {/* Left panel */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-[55%] lg:sticky lg:top-0 lg:h-screen flex-col bg-[#0d1117] p-10 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.2) 0%, transparent 50%),
              radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, transparent 80%),
              linear-gradient(rgba(255, 255, 255, 0.06) 1.5px, transparent 1.5px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1.5px, transparent 1.5px)
            `,
            backgroundSize: "100% 100%, 100% 100%, 64px 64px, 64px 64px",
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          <Link to="/" className="flex items-center gap-3 mb-24">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/20 border border-primary/30">
              <span className="text-primary font-bold text-sm">B</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold leading-none tracking-tight">bun-monorepo-template</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 mt-0.5">
                starter kit
              </p>
            </div>
          </Link>

          <div className="mt-auto mb-24 max-w-lg">
            <span className="inline-block rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-1 text-xs font-medium text-indigo-400 mb-6">
              Production Ready
            </span>
            <h2 className="text-6xl font-bold leading-tight mb-8">
              Build fast.{" "}
              <span className="text-indigo-400">Ship faster.</span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-300 max-w-md">
              TanStack Start · Bun · Prisma · better-auth · Tailwind CSS v4
              <br />— everything wired up and ready for your domain.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — auth forms */}
      <div className="flex flex-1 flex-col bg-white">
        <Outlet />
      </div>
    </div>
  );
}

const DateTimeOverlay = () => {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    setMounted(true);
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted || !now) {
    return (
      <div className="absolute right-6 top-6 z-50 flex items-center justify-end">
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  const formattedDate = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="absolute right-6 top-6 z-50 text-right font-medium text-muted-foreground sm:text-sm text-xs">
      <p>
        {formattedDate} — {formattedTime}
      </p>
    </div>
  );
};
