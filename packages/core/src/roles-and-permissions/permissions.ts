/**
 * Permission registry.
 *
 * Format: `{action}:{resource}`
 *
 * Actions:
 *   - `manage` — full CRUD access
 *   - `read`   — read-only access
 *
 * Add your own permissions here and run `bun x turbo run db:seed`
 * to sync them to the database.
 */
export const PERMISSION_DESCRIPTIONS = {
  // Users
  "manage:users": "Full create / read / update / delete access to users.",
  "read:users": "Read-only access to users.",

  // Roles
  "manage:roles": "Full create / read / update / delete access to roles.",
  "read:roles": "Read-only access to roles.",

  // Permissions
  "manage:permissions": "Full create / read / update / delete access to permissions.",
  "read:permissions": "Read-only access to permissions.",

  // Members (org membership)
  "manage:members": "Full create / read / update / delete access to organization members.",
  "read:members": "Read-only access to organization members.",
} as const;

export type Permission = keyof typeof PERMISSION_DESCRIPTIONS;

export const PERMISSIONS = Object.keys(PERMISSION_DESCRIPTIONS) as Permission[];
