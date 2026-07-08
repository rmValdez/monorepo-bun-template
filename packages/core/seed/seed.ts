import prisma from "@workspace/db";
import { seedPermissions, seedRolePermissions, seedRoles } from "./roles-and-permissions.seeder";
import { seedTodos } from "./todo.seeder";
import { seedUsers } from "./user.seeder";

async function main() {
  console.log("🌱 Seeding database");
  console.log("");

  await seedRoles(prisma);
  console.log();

  await seedPermissions(prisma);
  console.log();

  await seedRolePermissions(prisma);
  console.log();

  await seedUsers(prisma);
  console.log();

  await seedTodos();

  console.log(`\n\n✅ Database seeded successfully`);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  });
