import { createServerFn } from "@tanstack/react-start";
import { actionError, actionSuccess } from "@workspace/core/utils/server-response";
import { z } from "zod";
import { getAbility } from "@/lib/roles-and-permissions/check-permissions";
import { UnauthorizedError } from "@/utils/errors.util";
import { invalidateAuthContextByRole } from "../auth/auth.cache";
import { requireAuthMiddleware } from "../auth/auth.middleware";
import type {
  TCreateRoleSchemaInput,
  TCreateRoleWithPermissionsSchemaInput,
  TUpdateRoleSchemaInput,
  TUpdateRoleWithPermissionsSchemaInput,
} from "./role-permission.schema";
import {
  createRoleSchema,
  createRoleWithPermissionsSchema,
  deleteRoleSchema,
  paginationSchema,
  updateRolePermissionsSchema,
  updateRoleSchema,
  updateRoleWithPermissionsSchema,
} from "./role-permission.schema";
import { RolePermissionService } from "./role-permission.service";

export const listRolesFn = createServerFn({ method: "GET" })
  .middleware([requireAuthMiddleware])
  .validator(paginationSchema)
  .handler(async ({ data, context }) => {
    const ability = getAbility(context.auth);

    if (!ability.can("read:roles")) {
      throw new UnauthorizedError("You do not have permission to view roles.");
    }

    return RolePermissionService.listRoles(data);
  });
export type TListRolesResponse = Awaited<ReturnType<typeof listRolesFn>>;

export const listPermissionsFn = createServerFn({ method: "GET" })
  .middleware([requireAuthMiddleware])
  .handler(async ({ context }) => {
    const ability = getAbility(context.auth);

    if (!ability.can("read:roles")) {
      throw new UnauthorizedError("You do not have permission to view permissions.");
    }

    return RolePermissionService.listPermissions();
  });

export const createRoleFn = createServerFn({ method: "POST" })
  .middleware([requireAuthMiddleware])
  .validator(createRoleSchema)
  .handler(async ({ data, context }) => {
    const ability = getAbility(context.auth);

    if (!ability.can("manage:roles")) {
      throw new UnauthorizedError("You do not have permission to create roles.");
    }

    const isRoleNameTaken = await RolePermissionService.isRoleNameTaken(data.name);

    if (isRoleNameTaken) {
      return actionError<TCreateRoleSchemaInput>({
        name: "A role with this name already exists",
      });
    }

    const newRole = await RolePermissionService.createRole(data);

    return actionSuccess(newRole, "Role created successfully");
  });

export const createRoleWithPermissionsFn = createServerFn({ method: "POST" })
  .middleware([requireAuthMiddleware])
  .validator(createRoleWithPermissionsSchema)
  .handler(async ({ data, context }) => {
    const ability = getAbility(context.auth);

    if (!ability.can("manage:roles")) {
      throw new UnauthorizedError("You do not have permission to create roles.");
    }

    const isRoleNameTaken = await RolePermissionService.isRoleNameTaken(data.name);

    if (isRoleNameTaken) {
      return actionError<TCreateRoleWithPermissionsSchemaInput>({
        name: "A role with this name already exists",
      });
    }

    const newRole = await RolePermissionService.createRole({
      name: data.name,
      description: data.description,
    });

    if (data.permissionIds && data.permissionIds.length > 0) {
      await RolePermissionService.updateRolePermissions({
        roleId: newRole.id,
        permissionIds: data.permissionIds,
      });
    }

    return actionSuccess(newRole, "Role created successfully");
  });

export const updateRoleFn = createServerFn({ method: "POST" })
  .middleware([requireAuthMiddleware])
  .validator(updateRoleSchema)
  .handler(async ({ data, context }) => {
    const ability = getAbility(context.auth);

    if (!ability.can("manage:roles")) {
      throw new UnauthorizedError("You do not have permission to update roles.");
    }

    const isRoleNameTaken = await RolePermissionService.isRoleNameTaken(data.name, data.id);

    if (isRoleNameTaken) {
      return actionError<TUpdateRoleSchemaInput>({
        name: "A role with this name already exists",
      });
    }

    const updatedRole = await RolePermissionService.updateRole(data);

    await invalidateAuthContextByRole(data.id);

    return actionSuccess(updatedRole, "Role updated successfully");
  });

export const updateRoleWithPermissionsFn = createServerFn({ method: "POST" })
  .middleware([requireAuthMiddleware])
  .validator(updateRoleWithPermissionsSchema)
  .handler(async ({ data, context }) => {
    const ability = getAbility(context.auth);

    if (!ability.can("manage:roles")) {
      throw new UnauthorizedError("You do not have permission to update roles.");
    }

    const isRoleNameTaken = await RolePermissionService.isRoleNameTaken(data.name, data.id);

    if (isRoleNameTaken) {
      return actionError<TUpdateRoleWithPermissionsSchemaInput>({
        name: "A role with this name already exists",
      });
    }

    await RolePermissionService.updateRole({
      id: data.id,
      name: data.name,
      description: data.description,
    });

    await RolePermissionService.updateRolePermissions({
      roleId: data.id,
      permissionIds: data.permissionIds,
    });

    await invalidateAuthContextByRole(data.id);

    return actionSuccess({ success: true }, "Role and permissions updated successfully");
  });

export const getRoleFn = createServerFn({ method: "GET" })
  .middleware([requireAuthMiddleware])
  .validator(z.string())
  .handler(async ({ data: roleId, context }) => {
    const ability = getAbility(context.auth);

    if (!ability.can("read:roles")) {
      throw new UnauthorizedError("You do not have permission to view roles.");
    }

    return RolePermissionService.getRole(roleId);
  });

export const updateRolePermissionsFn = createServerFn({ method: "POST" })
  .middleware([requireAuthMiddleware])
  .validator(updateRolePermissionsSchema)
  .handler(async ({ data, context }) => {
    const ability = getAbility(context.auth);

    if (!ability.can("manage:roles")) {
      throw new UnauthorizedError("You do not have permission to update role permissions.");
    }

    await RolePermissionService.updateRolePermissions(data);
    await invalidateAuthContextByRole(data.roleId);

    return actionSuccess({ success: true }, "Role permissions updated successfully");
  });

export const deleteRole = createServerFn({ method: "POST" })
  .middleware([requireAuthMiddleware])
  .validator(deleteRoleSchema)
  .handler(async ({ data, context }) => {
    const ability = getAbility(context.auth);

    if (!ability.can("manage:roles")) {
      throw new UnauthorizedError("You do not have permission to delete roles.");
    }

    await invalidateAuthContextByRole(data.id);

    await RolePermissionService.deleteRole(data.id);

    return actionSuccess({ success: true }, "Role deleted successfully");
  });
