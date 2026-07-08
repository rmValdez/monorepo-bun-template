import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Email is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export type TRegisterSchemaInput = z.input<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Email is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export type TLoginSchemaInput = z.input<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email("Email is invalid"),
});
export type TForgotPasswordSchemaInput = z.input<typeof forgotPasswordSchema>;
