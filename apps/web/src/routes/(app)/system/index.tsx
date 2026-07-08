import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Shield, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";

export const Route = createFileRoute("/(app)/system/")({
  component: SystemDashboardPage,
});

const STAT_CARDS = [
  {
    title: "Total Users",
    value: "—",
    description: "Registered accounts",
    icon: <Users className="size-4 text-muted-foreground" />,
  },
  {
    title: "Roles",
    value: "—",
    description: "Defined access roles",
    icon: <Shield className="size-4 text-muted-foreground" />,
  },
  {
    title: "Permissions",
    value: "—",
    description: "Granular permission strings",
    icon: <CheckCircle2 className="size-4 text-muted-foreground" />,
  },
];

function SystemDashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">System Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          System-level administration. Manage users, roles, and permissions across all workspaces.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STAT_CARDS.map((stat) => (
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
    </div>
  );
}
