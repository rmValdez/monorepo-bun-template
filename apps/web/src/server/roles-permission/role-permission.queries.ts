import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getRoleFn, listPermissionsFn, listRolesFn } from "./role-permission.functions";
import type { TPaginationSchemaInput } from "./role-permission.schema";

export const rolePermissionQueries = {
  all: ["roles"] as const,

  listRoles: (params?: TPaginationSchemaInput) => {
    const pageIndex = params?.pageIndex ?? 0;
    const pageSize = params?.pageSize ?? 10;
    const search = params?.search;
    const sorts = params?.sorts;
    const filters = params?.filters;
    return queryOptions({
      queryKey: [...rolePermissionQueries.all, "list", pageIndex, pageSize, search, sorts, filters],
      queryFn: () => listRolesFn({ data: { pageIndex, pageSize, search, sorts, filters } }),
      placeholderData: keepPreviousData,
    });
  },

  listPermissions: () =>
    queryOptions({
      queryKey: [...rolePermissionQueries.all, "permissions", "list"],
      queryFn: () => listPermissionsFn(),
    }),

  getRole: (roleId: string) =>
    queryOptions({
      queryKey: [...rolePermissionQueries.all, "role", roleId],
      queryFn: () => getRoleFn({ data: roleId }),
    }),
};
