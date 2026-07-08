import prisma from "@workspace/db";
import { type OrganizationType, type RoleModel, UserStatus } from "@workspace/db/types";
import { auth } from "@/lib/auth";
import { ConflictError, InternalServerError } from "@/utils/errors.util";
import { slugify } from "@/utils/string.util";
import { getCachedAuthContext } from "./auth.cache";

interface RegisterInput {
  name: string;
  email: string;
  password: string;

  organizationName: string;
  organizationType: OrganizationType;

  role: RoleModel;
}

export const AuthService = {
  async register(data: RegisterInput) {
    const slug = slugify(data.organizationName);

    // Guard: prevent two different organizations from sharing the same slug.
    const existing = await prisma.organization.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictError(
        `An organization named "${data.organizationName}" already exists. Please choose a different name.`,
      );
    }

    const { user } = await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
        status: UserStatus.ACTIVE,
      },
    });

    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: data.organizationName,
          slug,
          type: data.organizationType,
        },
      });

      const member = await tx.member.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
        },
      });

      await tx.memberRole.create({
        data: {
          memberId: member.id,
          roleId: data.role.id,
        },
      });

      return { organization, member };
    });

    const authContext = await getCachedAuthContext(result.member.userId);

    if (!authContext) {
      throw new InternalServerError("Failed to get user data after registration.");
    }

    return { authContext };
  },
};
