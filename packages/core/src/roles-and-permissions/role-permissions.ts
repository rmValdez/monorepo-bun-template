import type { Permission } from "./permissions";
import type { Role } from "./roles";

/**
 * Default permissions assigned to each role during seeding.
 *
 * - `super-admin` — all permissions
 * - `admin`       — manage users/members, read roles/permissions
 * - `member`      — read users/members
 *
 * Extend this map when you add new permissions.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  "super-admin": [
    "manage:users",
    "read:users",
    "manage:roles",
    "read:roles",
    "manage:permissions",
    "read:permissions",
    "manage:members",
    "read:members",
  ],

  admin: [
    "manage:users",
    "read:users",
    "read:roles",
    "read:permissions",
    "manage:members",
    "read:members",
  ],

  member: [
    "read:users",
    "read:members",
  ],
};
