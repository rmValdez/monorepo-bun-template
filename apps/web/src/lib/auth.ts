import prisma from "@workspace/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      status: {
        type: "string",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    passwordReset: {
      tokenExpiresIn: 30 * 60, // 30 minutes
    },
    // TODO: Implement email sending for password reset.
    // Uncomment and wire up your email provider (e.g. Resend, Nodemailer).
    // sendResetPassword: async ({ user, url }) => {
    //   await sendEmail({
    //     to: user.email,
    //     subject: "Reset your password",
    //     body: `Click here to reset your password: ${url}`,
    //   });
    // },
  },
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [tanstackStartCookies()],
});
