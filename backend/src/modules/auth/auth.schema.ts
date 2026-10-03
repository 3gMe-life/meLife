import { z } from "zod";

export const registrationPathEnum = z.enum([
  "STUDENT",
  "PARENT",
  "COUNSELLOR",
  "INSTITUTION",
]);

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(60, "First name cannot exceed 60 characters"),
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(60, "Last name cannot exceed 60 characters"),
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .max(255, "Email cannot exceed 255 characters")
      .optional(),
    professionalEmail: z
      .string()
      .trim()
      .email("Please provide a valid professional email address")
      .max(255)
      .optional(),
    officialEmail: z
      .string()
      .trim()
      .email("Please provide a valid official email address")
      .max(255)
      .optional(),
    password: z
      .string()
      .min(10, "Password must be at least 10 characters long")
      .max(128, "Password cannot exceed 128 characters")
      .optional(),
    registrationPath: registrationPathEnum,

    // Counsellor Application Fields
    qualification: z.string().trim().max(150).optional(),
    organization: z.string().trim().max(150).optional(),

    // Institution Application Fields
    institutionName: z.string().trim().max(150).optional(),
    institutionType: z.string().trim().max(100).optional(),
    contactName: z.string().trim().max(100).optional(),
    phoneNumber: z.string().trim().max(30).optional(),
  })
  .refine(
    (data) => {
      const email = data.email || data.professionalEmail || data.officialEmail;
      return Boolean(email);
    },
    {
      message: "Please provide a valid email address",
      path: ["email"],
    }
  )
  .refine(
    (data) => {
      // Password is required for non-institution direct account signups
      if (data.registrationPath !== "INSTITUTION" && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required for user account creation",
      path: ["password"],
    }
  );

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export const googleAuthSchema = z.object({
  credential: z
    .string()
    .min(1, "Google ID token credential is required"),
  registrationPath: registrationPathEnum.optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long")
    .max(128, "Password cannot exceed 128 characters"),
});

export type RegisterSchemaInput = z.infer<typeof registerSchema>;
export type LoginSchemaInput = z.infer<typeof loginSchema>;
export type GoogleAuthSchemaInput = z.infer<typeof googleAuthSchema>;
export type ChangePasswordSchemaInput = z.infer<typeof changePasswordSchema>;
