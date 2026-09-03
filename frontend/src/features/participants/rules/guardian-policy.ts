/**
 * Centralized Guardian Requirement Rules & Policy for Frontend
 */

/**
 * Calculates age in years from a date of birth string (YYYY-MM-DD)
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
 * Determines whether parent/guardian details are strictly required.
 */
export function isGuardianRequired(context: {
  dateOfBirth?: string | Date | null;
  educationStage?: string | null;
  gradeLevel?: string | null;
}): boolean {
  const age = calculateAge(context.dateOfBirth);

  // Minors (under 18) always require guardian info
  if (age !== null && age < 18) {
    return true;
  }

  const stage = (context.educationStage || "").toUpperCase();

  // If school is selected: grades 5 through 10 require guardian info
  if (stage.startsWith("GRADE_") || stage === "SCHOOL") {
    let gradeStr = context.gradeLevel;
    if (!gradeStr && stage.startsWith("GRADE_")) {
      gradeStr = stage.replace("GRADE_", "");
    }

    if (gradeStr) {
      const gradeNum = parseInt(gradeStr, 10);
      if (!isNaN(gradeNum) && gradeNum <= 10) {
        return true;
      }
    } else {
      if (age === null || age < 18) {
        return true;
      }
    }
  }

  return false;
}
