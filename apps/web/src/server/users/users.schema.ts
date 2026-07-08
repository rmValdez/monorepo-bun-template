import { UserStatus } from "@workspace/db/types";
import { z } from "zod";

export {
  paginationSchema,
  type TPaginationSchema,
  type TPaginationSchemaInput,
} from "@workspace/core/common/pagination.schema";

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  status: z.enum(UserStatus),
  roleIds: z.array(z.string()).min(1, "At least one role is required"),
  organizationId: z.string().min(1, "Organization is required"),
});
export type TCreateUserSchemaInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  status: z.enum(UserStatus),
  roleIds: z.array(z.string()).min(1, "At least one role is required"),
  organizationId: z.string().min(1, "Organization is required"),
});
export type TUpdateUserSchemaInput = z.infer<typeof updateUserSchema>;

export const deleteUserSchema = z.object({
  id: z.string().min(1),
});
export type TDeleteUserSchemaInput = z.infer<typeof deleteUserSchema>;
