/**
 * Role registry.
 *
 * Add or rename roles here and run `bun x turbo run db:seed`
 * to sync them to the database.
 */
export const ROLE_DESCRIPTIONS = {
  "super-admin": "Full access to all resources and settings.",
  admin: "Can manage users and members. Read-only access to roles and permissions.",
  member: "Basic access — can read users and members.",
} as const;

/** Union type of valid role names. */
export type Role = keyof typeof ROLE_DESCRIPTIONS;

/** Array of all role name strings. */
export const ROLES = Object.keys(ROLE_DESCRIPTIONS) as Role[];
