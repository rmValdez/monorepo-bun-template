import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { userQueries } from "@/server/users/users.query";

export const Route = createFileRoute("/(app)/system/users/$userId")({
  beforeLoad: async ({ params: { userId }, context }) => {
    const user = await context.queryClient.fetchQuery(userQueries.getUser(userId));
    if (!user) throw redirect({ to: "/error", search: { reason: "not_found" } });

    return { user };
  },
  component: UserLayout,
});

function UserLayout() {
  return <Outlet />;
}
