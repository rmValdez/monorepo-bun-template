import prisma from "@workspace/db";
import type {
  TCreateRoleSchemaInput,
  TPaginationSchema,
  TUpdateRolePermissionsSchemaInput,
  TUpdateRoleSchemaInput,
} from "./role-permission.schema";

export const RolePermissionService = {
  async listRoles({ pageIndex = 0, pageSize = 10, search, sorts }: Partial<TPaginationSchema> = {}) {
    const searchWhere = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const orderBy = sorts?.length
      ? sorts.map((sort) => ({ [sort.id]: sort.desc ? "desc" : "asc" }))
      : { name: "asc" as const };

    const [data, total] = await Promise.all([
      prisma.role.findMany({
        where: searchWhere,
        include: {
          permissions: {
            include: {
              permission: { select: { id: true, name: true, description: true } },
            },
          },
          _count: { select: { memberRoles: true } },
        },
        skip: pageIndex * pageSize,
        take: pageSize,
        orderBy,
      }),
      prisma.role.count({ where: searchWhere }),
    ]);

    return {
      data,
      total,
      pageCount: Math.ceil(total / pageSize),
    };
  },

  async listPermissions() {
    const permissions = await prisma.permission.findMany({
      select: { id: true, name: true, description: true },
      orderBy: { name: "asc" },
    });

    return permissions;
  },

  async getRole(id: string) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: { select: { id: true, name: true, description: true } },
          },
        },
        _count: { select: { memberRoles: true } },
      },
    });
    return role;
  },

  async isRoleNameTaken(name: string, excludeId?: string) {
    const role = await prisma.role.findFirst({
      where: {
        name,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    return !!role;
  },

  async createRole(data: TCreateRoleSchemaInput) {
    const role = await prisma.role.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    });
    return role;
  },

  async updateRole(data: TUpdateRoleSchemaInput) {
    const role = await prisma.role.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    });
    return role;
  },

  async updateRolePermissions(data: TUpdateRolePermissionsSchemaInput) {
    const { roleId, permissionIds } = data;

    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new Error("Role not found.");
    }

    await prisma.$transaction([
      prisma.rolePermissions.deleteMany({ where: { roleId } }),
      prisma.rolePermissions.createMany({
        data: permissionIds.map((permissionId: string) => ({
          roleId,
          permissionId,
        })),
      }),
    ]);

    return { success: true };
  },

  async deleteRole(id: string) {
    await prisma.role.delete({
      where: { id },
    });
    return { success: true };
  },
};
