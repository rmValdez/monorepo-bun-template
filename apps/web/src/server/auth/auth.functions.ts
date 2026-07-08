import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { actionError, actionSuccess } from "@workspace/core/utils/server-response";
import prisma from "@workspace/db";
import { UserStatus } from "@workspace/db/types";
import { auth } from "@/lib/auth";
import { getOrganizationByUserId } from "../organization/organization.service";
import { authMiddleware, requireAuthMiddleware } from "./auth.middleware";
import { loginSchema, registerSchema, type TLoginSchemaInput } from "./auth.schema";

// TODO: not implemented
export const signupFn = createServerFn({ method: "POST" })
  .validator(registerSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();
    const session = await auth.api.signUpEmail({
      headers,
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
        status: UserStatus.ACTIVE,
      },
    });

    if (!session) {
      return { fieldErrors: { email: "Registration failed." } };
    }

    return { success: true, to: "/login" };
  });

export const signInFn = createServerFn({ method: "POST" })
  .validator(loginSchema)
  .handler(async ({ data }) => {
    const session = await auth.api
      .signInEmail({
        body: { email: data.email, password: data.password },
      })
      .catch((e: unknown) => (e instanceof Error ? e : new Error("An unknown error occurred")));

    if (!session || session instanceof Error) {
      return actionError<TLoginSchemaInput>({
        email: [session instanceof Error ? session.message : "Invalid email or password."],
      });
    }

    const organization = await getOrganizationByUserId(session.user.id);
    if (!organization) {
      return actionError<TLoginSchemaInput>({
        email: ["Your account is not associated with an active organization. Contact your administrator."],
      });
    }

    const redirectTo = organization.type.toLowerCase();
    return actionSuccess({ to: `/${redirectTo}` }, "Login successful");
  });

export const getAuthSessionFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.auth.user) return null;

    const member = await prisma.member.findFirst({
      where: { userId: context.auth.user.id },
      select: {
        id: true,
        organization: {
          select: { id: true, name: true, slug: true, type: true },
        },
      },
    });

    return {
      session: context.auth.session,
      user: context.auth.user,
      organization: member?.organization ?? null,
    };
  });
export type AuthSession = Awaited<ReturnType<typeof getAuthSessionFn>>;

export const getAuthDetailsFn = createServerFn({ method: "GET" })
  .middleware([requireAuthMiddleware])
  .handler(async ({ context }) => {
    return context.auth;
  });
export type AuthDetails = Awaited<ReturnType<typeof getAuthDetailsFn>>;

export const signOutFn = createServerFn({ method: "POST" })
  .middleware([requireAuthMiddleware])
  .handler(async () => {
    const headers = getRequestHeaders();
    await auth.api.signOut({ headers });

    throw redirect({ to: "/login" });
  });
