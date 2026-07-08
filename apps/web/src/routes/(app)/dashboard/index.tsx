import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ListTodo, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";

export const Route = createFileRoute("/(app)/dashboard/")({
  component: DashboardPage,
});

const STATS = [
  {
    title: "Total Members",
    value: "—",
    description: "Active workspace members",
    icon: <Users className="size-4 text-muted-foreground" />,
  },
  {
    title: "Open Todos",
    value: "—",
    description: "Items still in progress",
    icon: <ListTodo className="size-4 text-muted-foreground" />,
  },
  {
    title: "Completed Todos",
    value: "—",
    description: "Items finished",
    icon: <CheckCircle2 className="size-4 text-muted-foreground" />,
  },
];

function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome to your workspace. Replace this page with your own content.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              <CardDescription className="text-xs mt-1">{stat.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Getting started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            This is a scaffold workspace dashboard. Here's the pattern to follow for every new
            feature:
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-muted-foreground">
          <ol className="space-y-2 list-decimal list-inside text-sm">
            <li>
              <strong>Schema</strong> — Add a Prisma model in{" "}
              <code>packages/database/prisma/schema.prisma</code>
            </li>
            <li>
              <strong>Server module</strong> — Create{" "}
              <code>src/server/my-feature/</code> with schema, service, functions, and queries files
            </li>
            <li>
              <strong>Route</strong> — Add <code>src/routes/(app)/dashboard/my-feature/index.tsx</code>
            </li>
            <li>
              <strong>Permissions</strong> — Define strings in{" "}
              <code>packages/core/src/roles-and-permissions/permissions.ts</code>
            </li>
          </ol>
          <p className="mt-4">
            See the <strong>Todo</strong> feature at <code>/todos</code> for a working end-to-end
            example.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
