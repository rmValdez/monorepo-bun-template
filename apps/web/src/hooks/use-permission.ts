import type { Permission } from "@workspace/core/roles-and-permissions/permissions";
import { SYSTEM_ADMINISTRATOR_ROLE } from "@/lib/roles-and-permissions/check-permissions";
import { Route } from "@/routes/(app)/route";
import type { AuthDetails } from "@/server/auth/auth.functions";

export const hasPermission = (authDetails: AuthDetails, permission: Permission | Permission[], matchAny = false) => {
  const isAdmin = authDetails.roles.some((role) => role.name === SYSTEM_ADMINISTRATOR_ROLE);
  if (isAdmin) return true;

  const permissions = Array.isArray(permission) ? permission : [permission];
  const check = (p: Permission) =>
    authDetails.roles.some((role) => role.permissions.some((r) => r.permission.name === p));

  return matchAny ? permissions.some(check) : permissions.every(check);
};

export const usePermissions = () => {
  const { authDetails } = Route.useRouteContext();

  return {
    can: (permission: Permission | Permission[], matchAny = false) => hasPermission(authDetails, permission, matchAny),
    isAuthenticated: !!authDetails,
    roles: authDetails.roles,
    user: authDetails.user,
    organization: authDetails.organization,
  };
};
