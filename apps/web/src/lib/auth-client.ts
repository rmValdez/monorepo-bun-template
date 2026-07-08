import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.VITE_BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
});
