import type { PrismaClient } from "@workspace/db";
import { OrganizationType } from "@workspace/db/types";
import { AuthService } from "../../../apps/web/src/server/auth/auth.service";
import type { ROLES } from "../src/roles-and-permissions/roles";

export async function seedUsers(prisma: PrismaClient) {
  console.log("🌱 Seeding users");

  // Fetch all existing roles from DB
  const dbRoles = await prisma.role.findMany();
  const roleMap = new Map(dbRoles.map((r) => [r.name, r]));

  type UsersData = {
    name: string;
    email: string;
    password: string;
    organizationName: string;
    organizationType: OrganizationType;
    roleName: ROLES;
  };

  const usersData: UsersData[] = [
    {
      name: "Super Admin",
      email: "superadmin@example.com",
      password: "Password123!",
      organizationName: "System Administrator",
      organizationType: OrganizationType.SYSTEM,
      roleName: "super-admin",
    },
    {
      name: "Workspace Admin",
      email: "admin@example.com",
      password: "Password123!",
      organizationName: "Acme Corp",
      organizationType: OrganizationType.WORKSPACE,
      roleName: "admin",
    },
    {
      name: "Workspace Member",
      email: "member@example.com",
      password: "Password123!",
      organizationName: "Acme Subsidiary",
      organizationType: OrganizationType.WORKSPACE,
      roleName: "member",
    },
  ];

  let count = 0;

  const existingUsers = await prisma.user.findMany({
    select: { email: true },
  });
  const existingEmails = new Set(existingUsers.map((u) => u.email));

  for (const data of usersData) {
    const roleRecord = roleMap.get(data.roleName);
    if (!roleRecord) {
      throw new Error(`❌ Role ${data.roleName} not found in DB. Please ensure roles are seeded first.`);
    }

    if (!existingEmails.has(data.email)) {
      const { roleName, ...rest } = data;

      const userData = {
        ...rest,
        role: roleRecord,
      };

      try {
        await AuthService.register(userData);
        count++;
      } catch (error) {
        console.error(`Failed to seed user ${userData.email}:`, error);
      }
    }
  }

  console.log(`✅ Seeded ${count} new users`);
}
