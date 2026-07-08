import { z } from "zod";

export {
  paginationSchema,
  type TPaginationSchema,
  type TPaginationSchemaInput,
} from "@workspace/core/common/pagination.schema";

export const createRoleSchema = z.object({
  name: z.string().trim().min(1, "Role name is required"),
  description: z.string().trim().optional().nullish(),
});
export type TCreateRoleSchemaInput = z.infer<typeof createRoleSchema>;

export const createRoleWithPermissionsSchema = z.object({
  name: z.string().trim().min(1, "Role name is required"),
  description: z.string().trim().optional().nullish(),
  permissionIds: z.array(z.string()).min(1, "At least one permission is required"),
});
export type TCreateRoleWithPermissionsSchemaInput = z.infer<typeof createRoleWithPermissionsSchema>;

export const deleteRoleSchema = z.object({
  id: z.string().min(1),
});

export const updateRoleSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Role name is required"),
  description: z.string().trim().optional().nullish(),
});
export type TUpdateRoleSchemaInput = z.infer<typeof updateRoleSchema>;

export const updateRolePermissionsSchema = z.object({
  roleId: z.string().min(1),
  permissionIds: z.array(z.string()),
});
export type TUpdateRolePermissionsSchemaInput = z.infer<typeof updateRolePermissionsSchema>;

export const updateRoleWithPermissionsSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Role name is required"),
  description: z.string().trim().optional().nullish(),
  permissionIds: z.array(z.string()),
});
export type TUpdateRoleWithPermissionsSchemaInput = z.infer<typeof updateRoleWithPermissionsSchema>;
