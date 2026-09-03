import { z } from "zod";
import { isGuardianRequired, calculateAge } from "../rules/guardian-policy";

export const participantOnboardingFormSchema = z
  .object({
    dateOfBirth: z
      .string()
      .trim()
      .refine(
        (val) => {
          if (!val) return true;
          const date = new Date(val);
          if (isNaN(date.getTime())) return false;
          if (date > new Date()) return false;
          const age = calculateAge(date);
          return age !== null && age >= 5 && age <= 120;
        },
        {
          message: "Please enter a valid date of birth (Age must be between 5 and 120).",
        }
      )
      .optional()
      .nullable(),
    educationStage: z.string().min(1, "Please select an education stage."),
    gradeLevel: z.string().trim().max(50).optional().nullable(),
    schoolName: z.string().trim().max(255).optional().nullable(),
    curriculumOrBoard: z.string().trim().max(100).optional().nullable(),
    guardianName: z.string().trim().max(255).optional().nullable(),
    guardianPhone: z
      .string()
      .trim()
      .max(50)
      .refine((val) => !val || val.replace(/\D/g, "").length >= 7, {
        message: "Please enter a valid phone number (at least 7 digits).",
      })
      .optional()
      .nullable(),
    guardianEmail: z
      .string()
      .trim()
      .email("Please provide a valid email address.")
      .optional()
      .nullable()
      .or(z.literal("")),
    guardianRelationship: z.string().trim().max(50).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    const required = isGuardianRequired({
      dateOfBirth: data.dateOfBirth,
      educationStage: data.educationStage,
      gradeLevel: data.gradeLevel,
    });

    if (required) {
      if (!data.guardianName || data.guardianName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Guardian name is required for minors and school students.",
          path: ["guardianName"],
        });
      }
      if (!data.guardianPhone || data.guardianPhone.trim().length < 7) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Guardian mobile phone number is required.",
          path: ["guardianPhone"],
        });
      }
    }
  });

export type ParticipantOnboardingFormData = z.infer<typeof participantOnboardingFormSchema>;
