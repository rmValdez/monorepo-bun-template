import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { formatDate } from "@workspace/ui/lib/format";
import { ArrowLeft, Edit } from "lucide-react";

export const Route = createFileRoute("/(app)/system/users/$userId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  const formatUserDate = (date: Date | string | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    const formattedDate = formatDate(d, { month: "long", day: "numeric", year: "numeric" });
    const formattedTime = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${formattedDate} at ${formattedTime}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/system/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{user.name}</h1>
            <p className="text-muted-foreground mt-1 text-sm">View user administration profile.</p>
          </div>
        </div>
        <Link to="/system/users/$userId/update" params={{ userId: user.id }}>
          <Button className="gap-2">
            <Edit className="size-4" />
            Edit User
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>General and contact details of the user profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Email Address</div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-950">{user.email}</span>
                    {user.emailVerified ? (
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                        variant="outline"
                      >
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Mobile Number</div>
                  <div className="mt-1.5 text-sm text-muted-foreground">No mobile number provided</div>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Account Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Status</div>
                  <div className="mt-1">
                    <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"}>{user.status}</Badge>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Account Created</div>
                  <div className="mt-1 text-sm text-slate-950">{formatUserDate(user.createdAt)}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Last Updated</div>
                  <div className="mt-1 text-sm text-slate-950">{formatUserDate(user.updatedAt)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Membership Card */}
        <Card>
          <CardHeader>
            <CardTitle>Organization & Team Memberships</CardTitle>
            <CardDescription>User's organizational associations and team roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.members && user.members.length > 0 ? (
              user.members.map((member) => (
                <div key={member.id} className="border-t border-border pt-4 first:border-t-0 first:pt-0 space-y-2">
                  <div className="font-semibold text-slate-950">{member.organization?.name}</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{member.organization?.type}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {member.memberRoles?.map((mr) => mr.role.name).join(", ") || "Member"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No organizational memberships found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
