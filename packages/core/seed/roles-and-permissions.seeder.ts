import type { PrismaClient } from "@workspace/db";
import { PERMISSION_DESCRIPTIONS, PERMISSIONS } from "../src/roles-and-permissions/permissions";
import { DEFAULT_ROLE_PERMISSIONS } from "../src/roles-and-permissions/role-permissions";
import { ROLE_DESCRIPTIONS, ROLES } from "../src/roles-and-permissions/roles";

export async function seedRoles(prisma: PrismaClient) {
  console.log("🌱 seeding roles");

  const existingRoles = await prisma.role.findMany({
    select: { name: true },
  });

  const existingNames = new Set(existingRoles.map((r) => r.name));

  await prisma.role.createMany({
    data: ROLES.filter((role) => !existingNames.has(role)).map((role) => ({
      name: role,
      description: ROLE_DESCRIPTIONS[role],
    })),
  });

  await prisma.$transaction(
    ROLES.map((role) =>
      prisma.role.update({
        where: { name: role },
        data: {
          description: ROLE_DESCRIPTIONS[role],
        },
      }),
    ),
  );

  console.log("✅ successfully seeded roles");
}

export async function seedPermissions(prisma: PrismaClient) {
  console.log("🌱 seeding permissions");

  const existingPermissions = await prisma.permission.findMany({
    select: { name: true },
  });

  const existingNames = new Set(existingPermissions.map((r) => r.name));

  await prisma.permission.createMany({
    data: PERMISSIONS.filter((permission) => !existingNames.has(permission)).map((permission) => ({
      name: permission,
      description: PERMISSION_DESCRIPTIONS[permission],
    })),
  });

  await prisma.$transaction(
    PERMISSIONS.map((permission) =>
      prisma.permission.update({
        where: { name: permission },
        data: {
          description: PERMISSION_DESCRIPTIONS[permission],
        },
      }),
    ),
  );

  console.log("✅ successfully seeded permissions");
}

export async function seedRolePermissions(prisma: PrismaClient) {
  console.log("🌱 seeding role permissions");
  for (const [roleName, permissions] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
    const role = await prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      console.warn(`Role ${roleName} not found, skipping permissions mapping`);
      continue;
    }
    const permissionRecords = await prisma.permission.findMany({
      where: { name: { in: permissions as string[] } },
    });
    for (const permission of permissionRecords) {
      await prisma.rolePermissions.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }
  console.log("✅ successfully seeded role permissions");
}
