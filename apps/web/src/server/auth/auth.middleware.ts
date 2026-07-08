import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import type { Permission } from "@workspace/core/roles-and-permissions/permissions";
import { auth } from "@/lib/auth";
import { REDIRECT_REASON } from "@/routes/error";
import { getCachedAuthContext } from "./auth.cache";

export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  return next({
    context: {
      auth: { session: session?.session ?? null, user: session?.user ?? null },
      request,
    },
  });
});

export const requireAuthMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    const { session, user } = context.auth;

    if (!user || !session) {
      throw redirect({ to: "/login", search: { reason: REDIRECT_REASON.AUTH_REQUIRED } });
    }

    if (user.status !== "ACTIVE") {
      throw redirect({ to: "/error", search: { reason: REDIRECT_REASON.NOT_ACTIVE } });
    }

    const authContext = await getCachedAuthContext(user.id);

    if (!authContext) {
      throw redirect({ to: "/error", search: { reason: REDIRECT_REASON.NO_ORGANIZATION } });
    }

    return next({
      context: {
        auth: {
          session,
          user,
          organization: authContext.organization,
          roles: authContext.memberRoles.map((memberRole) => memberRole.role),
        },
      },
    });
  });

export const requirePermissionsMiddleware = (requiredPermissions: Permission[]) =>
  createMiddleware()
    .middleware([requireAuthMiddleware])
    .server(async ({ next, context }) => {
      const { roles } = context.auth;

      const userPermissions = new Set(roles.flatMap((role) => role.permissions.map((p) => p.permission.name)));

      if (!requiredPermissions.every((p) => userPermissions.has(p))) {
        throw redirect({ to: "/error", search: { reason: "permission_denied" } });
      }

      return next({ context });
    });

export const requireAnyPermissionMiddleware = (requiredPermissions: Permission[]) =>
  createMiddleware()
    .middleware([requireAuthMiddleware])
    .server(async ({ next, context }) => {
      const { roles } = context.auth;

      const userPermissions = new Set(roles.flatMap((role) => role.permissions.map((p) => p.permission.name)));

      if (!requiredPermissions.some((p) => userPermissions.has(p))) {
        throw redirect({ to: "/error", search: { reason: "permission_denied" } });
      }

      return next({ context });
    });
