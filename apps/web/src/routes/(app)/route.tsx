import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AppTopbar from "@/components/topbar/app-topbar";
import { authQueries } from "@/server/auth/auth.queries";

export const Route = createFileRoute("/(app)")({
  beforeLoad: async ({ context, location }) => {
    if (!context.authSession) throw redirect({ to: "/login", search: { redirectTo: location.href } });

    const authDetails = await context.queryClient.fetchQuery(authQueries.getAuthDetails());

    return { authDetails };
  },
  loader: ({ context }) => {
    const { organization } = context.authDetails;

    return {
      breadcrumb: {
        title: organization.name,
        path: "/dashboard",
        type: "link",
      },
    };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { authDetails } = Route.useRouteContext();

  return (
    <div className="flex h-svh flex-col overflow-hidden">
      <AppTopbar authDetails={authDetails} />
      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  );
}
