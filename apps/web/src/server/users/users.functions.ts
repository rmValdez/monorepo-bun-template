import { createServerFn } from "@tanstack/react-start";
import { actionError, actionSuccess } from "@workspace/core/utils/server-response";
import { z } from "zod";
import { getAbility } from "@/lib/roles-and-permissions/check-permissions";
import { UnauthorizedError } from "@/utils/errors.util";
import { invalidateAuthContext } from "../auth/auth.cache";
import { requireAuthMiddleware } from "../auth/auth.middleware";
import {
  createUserSchema,
  deleteUserSchema,
  paginationSchema,
  type TCreateUserSchemaInput,
  type TUpdateUserSchemaInput,
  updateUserSchema,
} from "./users.schema";
import { UserService } from "./users.service";

export const listUsersFn = createServerFn({ method: "GET" })
  .middleware([requireAuthMiddleware])
  .validator(paginationSchema)
  .handler(async ({ data, context }) => {
    const ability = getAbility(context.auth);

    if (!ability.can("read:members") && !ability.isSystemAdministrator) {
      throw new UnauthorizedError("You do not have permission to view users.");
    }

    return UserService.listUsers(data);
  });
export type TListUsersResponse = Awaited<ReturnType<typeof listUsersFn>>;

export const getUserFn = createServerFn({ method: "GET" })
  .middleware([requireAuthMiddleware])
  .validator(z.string())
  .handler(async ({ data: userId, context }) => {
    const ability = getAbility(context.auth);

    if (!ability.can("read:members") && !ability.isSystemAdministrator) {
      throw new UnauthorizedError("You do not have permission to view users.");
    }

    return UserService.getUser(userId);
  });

export const createUserFn = createServerFn({ method: "POST" })
  .middleware([requireAuthMiddleware])
  .validator(createUserSchema)
  .handler(async ({ data, context }) => {
    const ability = getAbility(context.auth);

    if (!ability.isSystemAdministrator) {
      throw new UnauthorizedError("You do not have permission to create users.");
    }

    const isEmailTaken = await UserService.isEmailTaken(data.email);
    if (isEmailTaken) {
      return actionError<TCreateUserSchemaInput>({
        email: "A user with this email already exists",
      });
    }

    const newUser = await UserService.createUser(data, data.organizationId);

    return actionSuccess(newUser, "User created successfully");
  });

export const updateUserFn = createServerFn({ method: "POST" })
  .middleware([requireAuthMiddleware])
  .validator(updateUserSchema)
  .handler(async ({ data, context }) => {
    const ability = getAbility(context.auth);

    if (!ability.isSystemAdministrator) {
      throw new UnauthorizedError("You do not have permission to update users.");
    }

    const isEmailTaken = await UserService.isEmailTaken(data.email, data.id);
    if (isEmailTaken) {
      return actionError<TUpdateUserSchemaInput>({
        email: "A user with this email already exists",
      });
    }

    const { id, ...updateData } = data;
    const updatedUser = await UserService.updateUser(id, updateData);

    // Invalidate auth cache in Redis for the updated user
    await invalidateAuthContext(id);

    return actionSuccess(updatedUser, "User updated successfully");
  });

export const deleteUserFn = createServerFn({ method: "POST" })
  .middleware([requireAuthMiddleware])
  .validator(deleteUserSchema)
  .handler(async ({ data, context }) => {
    const ability = getAbility(context.auth);

    if (!ability.isSystemAdministrator) {
      throw new UnauthorizedError("You do not have permission to delete users.");
    }

    await UserService.deleteUser(data.id);

    // Invalidate auth cache in Redis for the deleted user
    await invalidateAuthContext(data.id);

    return actionSuccess({ success: true }, "User deleted successfully");
  });
