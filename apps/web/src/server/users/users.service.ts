import type { TPaginationSchema } from "@workspace/core/common/pagination.schema";
import prisma from "@workspace/db";
import { auth } from "@/lib/auth";
import type { TCreateUserSchemaInput, TUpdateUserSchemaInput } from "./users.schema";

export const UserService = {
  async listUsers({ pageIndex = 0, pageSize = 10, search, sorts, filters }: Partial<TPaginationSchema> = {}) {
    const filterWhere: Record<string, unknown> = {};
    if (filters?.length) {
      for (const filter of filters) {
        if (filter.id === "status" && filter.value.length > 0) {
          filterWhere.status = filter.value.length === 1 ? filter.value[0] : { in: filter.value };
        }
      }
    }

    const searchWhere = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const where = { ...searchWhere, ...filterWhere };

    const userFields = ["name", "email", "status", "createdAt", "updatedAt"];
    const orderBy = sorts?.length
      ? sorts.filter((sort) => userFields.includes(sort.id)).map((sort) => ({ [sort.id]: sort.desc ? "desc" : "asc" }))
      : { createdAt: "desc" as const };

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          members: {
            include: {
              organization: true,
              memberRoles: {
                include: {
                  role: true,
                },
              },
            },
          },
        },
        skip: pageIndex * pageSize,
        take: pageSize,
        orderBy,
      }),
      prisma.user.count({ where: searchWhere }),
    ]);

    return {
      data,
      total,
      pageCount: Math.ceil(total / pageSize),
    };
  },

  async getUser(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            organization: true,
            memberRoles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });
  },

  async isEmailTaken(email: string, excludeId?: string) {
    const user = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    return !!user;
  },

  async createUser(data: TCreateUserSchemaInput, organizationId: string) {
    // 1. Create the user with Better Auth (which creates User and hashes password in Account)
    const { user } = await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password || "Password123!",
        status: data.status,
      },
    });

    // 2. Add to Organization
    const member = await prisma.member.create({
      data: {
        userId: user.id,
        organizationId,
      },
    });

    // 3. Assign roles
    if (data.roleIds?.length) {
      await prisma.memberRole.createMany({
        data: data.roleIds.map((roleId) => ({
          memberId: member.id,
          roleId,
        })),
      });
    }

    return user;
  },

  async updateUser(id: string, data: Omit<TUpdateUserSchemaInput, "id">) {
    // 1. Update user info
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        status: data.status,
      },
    });

    // 2. Sync roles for user
    const member = await prisma.member.findFirst({
      where: { userId: id },
    });

    if (member) {
      await prisma.$transaction([
        prisma.member.update({
          where: { id: member.id },
          data: { organizationId: data.organizationId },
        }),
        prisma.memberRole.deleteMany({ where: { memberId: member.id } }),
        prisma.memberRole.createMany({
          data: data.roleIds.map((roleId) => ({
            memberId: member.id,
            roleId,
          })),
        }),
      ]);
    }

    return user;
  },

  async deleteUser(id: string) {
    await prisma.user.delete({
      where: { id },
    });
    return { success: true };
  },
};
