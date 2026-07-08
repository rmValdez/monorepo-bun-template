import prisma from "@workspace/db";

export async function getOrganization(orgId: string) {
  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  return organization;
}

export async function getOrganizationByUserId(userId: string) {
  const organization = await prisma.organization.findFirst({
    where: { members: { some: { userId: userId } } },
  });

  return organization;
}

export async function listOrganizations() {
  return prisma.organization.findMany({
    orderBy: { name: "asc" },
  });
}
