import type { Permission } from "@workspace/core/roles-and-permissions/permissions";
import type { AuthDetails } from "@/server/auth/auth.functions";

export type Ability = {
  can: (...permissions: Permission[]) => boolean;
  canAll: (...permissions: Permission[]) => boolean;
  isSystemAdministrator: boolean;
};

export const SYSTEM_ADMINISTRATOR_ROLE = "system-admin";

export function getAbility(authDetails: AuthDetails): Ability {
  const { roles } = authDetails;

  const isAdmin = roles.some((role) => role.name === SYSTEM_ADMINISTRATOR_ROLE);

  const permissionSet = new Set(roles.flatMap((role) => role.permissions.map((p) => p.permission.name)));

  return {
    isSystemAdministrator: isAdmin,

    /** Admins always return true. Others need at least one of the passed permissions */
    can: (...permissions: Permission[]) => isAdmin || permissions.some((p) => permissionSet.has(p)),

    /** Admins always return true. Others need all of the passed permissions */
    canAll: (...permissions: Permission[]) => isAdmin || permissions.every((p) => permissionSet.has(p)),
  };
}
