import { z } from "zod";

// Step 1: Education Selection Schema
export const educationStepSchema = z.object({
  educationStage: z
    .string()
    .min(1, "Please select your current class or academic stage"),
});

// Step 2: Guardian Details Schema (Conditional on younger learners or optional for older)
export const guardianStepSchema = z.object({
  guardianName: z
    .string()
    .min(2, "Parent / Guardian name is required")
    .max(60, "Name too long")
    .trim(),
  guardianPhone: z
    .string()
    .min(7, "Please enter a valid mobile number")
    .max(20, "Mobile number too long")
    .trim(),
  guardianEmail: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
});

export const studentOnboardingSchema = z.object({
  educationStage: z
    .string()
    .min(1, "Please select your current class or academic stage"),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianEmail: z.string().optional(),
});

export type EducationStepSchemaType = z.infer<typeof educationStepSchema>;
export type GuardianStepSchemaType = z.infer<typeof guardianStepSchema>;
export type StudentOnboardingSchemaType = z.infer<typeof studentOnboardingSchema>;
