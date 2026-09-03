/**
 * Centralized business logic and policy rules for Participants
 */

/**
 * Calculates accurate age from a date of birth string or Date object.
 */
export function calculateAge(dob: string | Date | null | undefined): number | null {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 0 ? age : null;
}

/**
 * Normalizes user-entered stage or legacy stage id to standard enum.
 */
export function normalizeEducationStage(stage: string | null | undefined): string {
  if (!stage) return "OTHER";
  const upper = stage.toUpperCase().trim();

  if (upper.startsWith("GRADE_") || upper === "SCHOOL" || /^\d+$/.test(stage)) {
    return "SCHOOL";
  }
  if (upper === "COLLEGE" || upper === "COLLEGE_UNIVERSITY" || upper === "UNIVERSITY") {
    return "COLLEGE_UNIVERSITY";
  }
  if (upper === "WORKING_PROFESSIONAL" || upper === "PROFESSIONAL") {
    return "WORKING_PROFESSIONAL";
  }
  return "OTHER";
}

/**
 * Normalizes grade level from stage or direct grade input.
 */
export function extractGradeLevel(
  stage: string | null | undefined,
  gradeLevel: string | null | undefined
): string | null {
  if (gradeLevel && gradeLevel.trim()) {
    const cleaned = gradeLevel.replace(/\D/g, "");
    if (cleaned) return cleaned;
  }
  if (stage && stage.toLowerCase().startsWith("grade_")) {
    return stage.toLowerCase().replace("grade_", "");
  }
  return null;
}

/**
 * Evaluates whether parent/guardian information is strictly required for this participant.
 *
 * POLICY:
 * 1. Minors (derived age < 18) strictly require guardian information.
 * 2. School participants in Grades 5 through 10 strictly require guardian information.
 * 3. School participants in Grades 11-12 with age >= 18, College students, and Working Professionals
 *    do NOT strictly require guardian info (guardian info is optional/skimmable).
 */
export function isGuardianRequired(context: {
  dateOfBirth?: string | Date | null;
  educationStage?: string | null;
  gradeLevel?: string | null;
}): boolean {
  const age = calculateAge(context.dateOfBirth);

  // If age is known and minor (< 18), guardian is strictly required
  if (age !== null && age < 18) {
    return true;
  }

  const normalizedStage = normalizeEducationStage(context.educationStage);
  const grade = extractGradeLevel(context.educationStage, context.gradeLevel);

  // School stage with grades 5 through 10 requires guardian
  if (normalizedStage === "SCHOOL") {
    if (grade) {
      const gradeNum = parseInt(grade, 10);
      if (!isNaN(gradeNum) && gradeNum <= 10) {
        return true;
      }
    } else {
      // Default to requiring guardian if general school stage is selected and age is unknown or under 18
      if (age === null || age < 18) {
        return true;
      }
    }
  }

  return false;
}
