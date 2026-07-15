import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters"),

  email: z.email("Invalid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;