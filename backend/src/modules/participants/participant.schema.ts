import { z } from "zod";
import { isGuardianRequired, calculateAge } from "./participant.rules";

/**
 * Validates date of birth string (YYYY-MM-DD)
 */
const dateOfBirthSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (!val) return true;
      const date = new Date(val);
      if (isNaN(date.getTime())) return false;
      const now = new Date();
      if (date > now) return false;
      const age = calculateAge(date);
      return age !== null && age >= 5 && age <= 120;
    },
    {
      message: "Please enter a valid date of birth. Age must be between 5 and 120 years.",
    }
  )
  .optional()
  .nullable();

export const participantOnboardingSchema = z
  .object({
    dateOfBirth: dateOfBirthSchema,
    educationStage: z
      .string({
        required_error: "Education stage is required.",
      })
      .min(1, "Please select an education stage."),
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
      .email("Please provide a valid guardian email address.")
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
          message: "Parent or guardian name is required for school students / minors.",
          path: ["guardianName"],
        });
      }
      if (!data.guardianPhone || data.guardianPhone.trim().length < 7) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Guardian contact number is required.",
          path: ["guardianPhone"],
        });
      }
    }
  });

export const updateParticipantProfileSchema = z.object({
  firstName: z.string().trim().min(1, "First name cannot be empty.").max(100).optional(),
  lastName: z.string().trim().min(1, "Last name cannot be empty.").max(100).optional(),
  dateOfBirth: dateOfBirthSchema,
  educationStage: z.string().trim().min(1).optional().nullable(),
  gradeLevel: z.string().trim().max(50).optional().nullable(),
  schoolName: z.string().trim().max(255).optional().nullable(),
  curriculumOrBoard: z.string().trim().max(100).optional().nullable(),
  guardianName: z.string().trim().max(255).optional().nullable(),
  guardianPhone: z
    .string()
    .trim()
    .max(50)
    .refine((val) => !val || val.replace(/\D/g, "").length >= 7, {
      message: "Please enter a valid phone number.",
    })
    .optional()
    .nullable(),
  guardianEmail: z
    .string()
    .trim()
    .email("Please provide a valid guardian email address.")
    .optional()
    .nullable()
    .or(z.literal("")),
  guardianRelationship: z.string().trim().max(50).optional().nullable(),
});

export type ParticipantOnboardingInput = z.infer<typeof participantOnboardingSchema>;
export type UpdateParticipantProfileInput = z.infer<typeof updateParticipantProfileSchema>;
