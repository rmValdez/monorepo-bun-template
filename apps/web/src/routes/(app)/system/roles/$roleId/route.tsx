import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { rolePermissionQueries } from "@/server/roles-permission/role-permission.queries";

export const Route = createFileRoute("/(app)/system/roles/$roleId")({
  beforeLoad: async ({ params, context }) => {
    const role = await context.queryClient.fetchQuery(rolePermissionQueries.getRole(params.roleId));
    if (!role) throw redirect({ to: "/error", search: { reason: "not_found" } });

    return { role };
  },
  component: RoleLayout,
});

function RoleLayout() {
  return <Outlet />;
}
