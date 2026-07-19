import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Add an uppercase letter")
    .regex(/[0-9]/, "Add a number"),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const equipmentDetailsSchema = z.object({
  title: z.string().min(3, "Give your listing a clear title"),
  category: z.string().min(1, "Select a category"),
  brand: z.string().optional(),
  condition: z.string().min(1, "Select a condition"),
  description: z.string().min(20, "Describe the item in at least 20 characters"),
});

export type EquipmentDetailsSchema = z.infer<typeof equipmentDetailsSchema>;

export const equipmentPricingSchema = z.object({
  pricePerDay: z.number().min(1, "Enter a daily rate"),
  securityDeposit: z.number().min(0, "Enter a deposit amount (0 if none)"),
  location: z.string().min(2, "Enter a pickup location"),
});

export type EquipmentPricingSchema = z.infer<typeof equipmentPricingSchema>;

export const profileSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(250, "Keep your bio under 250 characters").optional(),
});

export type ProfileSchema = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Add an uppercase letter")
      .regex(/[0-9]/, "Add a number"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
