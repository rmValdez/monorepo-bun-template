import prisma, { type Prisma } from "@workspace/db";
import { redis } from "@/lib/redis";

const CACHE_TTL_SECONDS = 60 * 5; // 5 minutes

function cacheKey(userId: string) {
  return `auth-context:${userId}`;
}

const AUTH_CONTEXT_SELECT = {
  id: true,
  organization: {
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
    },
  },
  memberRoles: {
    select: {
      role: {
        select: {
          id: true,
          name: true,
          permissions: {
            select: {
              permission: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
  },
} satisfies Prisma.MemberSelect;

type _MemberFindFirst = typeof prisma.member.findFirst<{
  select: typeof AUTH_CONTEXT_SELECT;
}>;

export type CachedAuthContext = NonNullable<Awaited<ReturnType<_MemberFindFirst>>>;

export async function getCachedAuthContext(userId: string): Promise<CachedAuthContext | null> {
  const cached = await redis.get(cacheKey(userId));

  if (cached) {
    return JSON.parse(cached) as CachedAuthContext;
  }

  const authContext = await prisma.member.findFirst({
    where: { userId },
    select: AUTH_CONTEXT_SELECT,
  });

  if (authContext) {
    await redis.set(cacheKey(userId), JSON.stringify(authContext), "EX", CACHE_TTL_SECONDS);
  }

  return authContext;
}

export async function invalidateAuthContext(userId: string): Promise<void> {
  await redis.del(cacheKey(userId));
}

export async function invalidateAuthContextByRole(roleId: string): Promise<void> {
  const affectedMembers = await prisma.memberRole.findMany({
    where: { roleId },
    select: { member: { select: { userId: true } } },
  });

  await Promise.all(affectedMembers.map(({ member }) => invalidateAuthContext(member.userId)));
}
