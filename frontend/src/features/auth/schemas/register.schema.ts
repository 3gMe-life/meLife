import { z } from "zod";

// 1. Student Registration Schema
export const studentRegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name cannot exceed 50 characters")
      .trim(),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name cannot exceed 50 characters")
      .trim(),
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address")
      .trim(),
    password: z
      .string()
      .min(10, "Password must be at least 10 characters long"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// 2. Parent / Guardian Registration Schema
export const parentRegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name cannot exceed 50 characters")
      .trim(),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name cannot exceed 50 characters")
      .trim(),
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address")
      .trim(),
    password: z
      .string()
      .min(10, "Password must be at least 10 characters long"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// 3. Counsellor Registration / Application Schema
export const counsellorRegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name cannot exceed 50 characters")
      .trim(),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name cannot exceed 50 characters")
      .trim(),
    professionalEmail: z
      .string()
      .min(1, "Professional email is required")
      .email("Please enter a valid professional email address")
      .trim(),
    password: z
      .string()
      .min(10, "Password must be at least 10 characters long"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
    qualification: z.string().optional(),
    organization: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// 4. Institution Application Schema
export const institutionApplicationSchema = z.object({
  institutionName: z
    .string()
    .min(2, "Institution name is required")
    .max(100, "Institution name too long")
    .trim(),
  institutionType: z
    .string()
    .min(1, "Please select an institution type"),
  officialEmail: z
    .string()
    .min(1, "Official email is required")
    .email("Please enter a valid official email address")
    .trim(),
  contactName: z
    .string()
    .min(2, "Primary contact name is required")
    .max(60, "Contact name too long")
    .trim(),
  phoneNumber: z
    .string()
    .min(7, "Please enter a valid contact phone number")
    .max(20, "Phone number too long")
    .trim(),
});

export type StudentRegisterSchemaType = z.infer<typeof studentRegisterSchema>;
export type ParentRegisterSchemaType = z.infer<typeof parentRegisterSchema>;
export type CounsellorRegisterSchemaType = z.infer<typeof counsellorRegisterSchema>;
export type InstitutionApplicationSchemaType = z.infer<typeof institutionApplicationSchema>;
