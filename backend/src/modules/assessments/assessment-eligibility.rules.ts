import {
  AssessmentCatalogEntity,
} from "./assessment.types";

/**
 * Calculates calendar-accurate age from a date of birth.
 * Avoids simple year subtraction to prevent off-by-one errors before birthdays.
 */
export function calculateExactAge(dob: string | Date | null | undefined): number | null {
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
 * Normalizes educational stage string to standard uppercase token.
 */
export function normalizeStage(stage?: string | null): string | null {
  if (!stage) return null;
  const s = stage.trim().toUpperCase();
  if (s.startsWith("GRADE_") || s === "SCHOOL" || s === "STUDENT") return "SCHOOL";
  if (s === "COLLEGE" || s === "COLLEGE_UNIVERSITY" || s === "UNIVERSITY") return "COLLEGE_UNIVERSITY";
  if (s === "WORKING" || s === "WORKING_PROFESSIONAL" || s === "PROFESSIONAL") return "WORKING_PROFESSIONAL";
  if (s === "OTHER" || s === "LIFELONG_LEARNER") return "OTHER";
  return s;
}

/**
 * Extracts normalized grade level string (e.g. "10").
 */
export function normalizeGrade(stage?: string | null, grade?: string | null): string | null {
  if (grade && grade.trim()) {
    return grade.replace(/[^0-9]/g, "").trim() || null;
  }
  if (stage && stage.toUpperCase().startsWith("GRADE_")) {
    return stage.replace(/[^0-9]/g, "").trim() || null;
  }
  return null;
}

export interface EligibilityEvaluationContext {
  assessment: AssessmentCatalogEntity;
  age: number | null;
  educationStage: string | null;
  gradeLevel: string | null;
}

export interface EligibilityResult {
  isEligible: boolean;
  reason: string;
}

/**
 * Evaluates whether a participant is eligible for a specific catalog assessment.
 * Applies grade-level matching for school students and age/stage matching for higher education & adults.
 */
export function evaluateAssessmentEligibility(
  context: EligibilityEvaluationContext
): EligibilityResult {
  const { assessment, age, educationStage, gradeLevel } = context;
  const stage = normalizeStage(educationStage);
  const grade = normalizeGrade(educationStage, gradeLevel);

  // Inactive or Draft assessments are never eligible for participants
  if (assessment.status !== "ACTIVE") {
    return {
      isEligible: false,
      reason: `Assessment is currently ${assessment.status.toLowerCase()}.`,
    };
  }

  switch (assessment.code) {
    case "SKILL_FINDER": {
      // Target: Middle School (Grades 5-8) or approx age 10 to <14
      if (grade && ["5", "6", "7", "8"].includes(grade)) {
        return {
          isEligible: true,
          reason: `Calibrated for Middle School (Class ${grade}).`,
        };
      }
      if (age !== null && age >= 10 && age < 14) {
        return {
          isEligible: true,
          reason: `Calibrated for developmental age group 10–13 years (Age ${age}).`,
        };
      }
      if (stage === "SCHOOL" && grade === null && age === null) {
        return {
          isEligible: true,
          reason: "Recommended for school students exploring cognitive foundations.",
        };
      }
      return {
        isEligible: false,
        reason: "Designed for Middle School learners (Classes 5–8 / Ages 10–13).",
      };
    }

    case "STREAM_FINDER": {
      // Target: Secondary School (Grades 9-10) or approx age 14 to <16
      if (grade && ["9", "10"].includes(grade)) {
        return {
          isEligible: true,
          reason: `Calibrated for Secondary School (Class ${grade}) subject stream selection.`,
        };
      }
      if (age !== null && age >= 14 && age < 16) {
        return {
          isEligible: true,
          reason: `Calibrated for subject stream selection (Age ${age} / Secondary).`,
        };
      }
      return {
        isEligible: false,
        reason: "Designed for Secondary School learners (Classes 9–10 / Ages 14–15).",
      };
    }

    case "ENGINEERING_BRANCH_FINDER":
    case "COMMERCE_CAREER_FINDER":
    case "HUMANITIES_CAREER_FINDER": {
      // Target: Higher Secondary (Grades 11-12) or approx age 16 to <18
      if (grade && ["11", "12"].includes(grade)) {
        return {
          isEligible: true,
          reason: `Calibrated for Higher Secondary (Class ${grade}) career specialization.`,
        };
      }
      if (age !== null && age >= 16 && age < 18) {
        return {
          isEligible: true,
          reason: `Calibrated for Higher Secondary specialization (Age ${age}).`,
        };
      }
      return {
        isEligible: false,
        reason: "Designed for Higher Secondary students (Classes 11–12 / Ages 16–17).",
      };
    }

    case "RIGHT_CAREER_FINDER": {
      // Target: College, University, Working Professionals, or Adults (Age >= 18)
      if (stage === "COLLEGE_UNIVERSITY" || stage === "WORKING_PROFESSIONAL" || stage === "OTHER") {
        return {
          isEligible: true,
          reason: `Calibrated for ${stage === "COLLEGE_UNIVERSITY" ? "College & University" : "Career Alignment & Vocational Discovery"}.`,
        };
      }
      if (age !== null && age >= 18) {
        return {
          isEligible: true,
          reason: `Calibrated for adult career planning & specialization (Age ${age}).`,
        };
      }
      return {
        isEligible: false,
        reason: "Designed for College & University students and working professionals (Age 18+).",
      };
    }

    case "AI_JOB_RISK_FINDER": {
      // Target: College, University, Working Professionals, or Adults (Age >= 18)
      if (stage === "COLLEGE_UNIVERSITY" || stage === "WORKING_PROFESSIONAL" || stage === "OTHER") {
        return {
          isEligible: true,
          reason: "Calibrated for future workforce disruption and career resilience analysis.",
        };
      }
      if (age !== null && age >= 18) {
        return {
          isEligible: true,
          reason: `Calibrated for professional workforce impact (Age ${age}).`,
        };
      }
      return {
        isEligible: false,
        reason: "Designed for College students and professionals analyzing industry automation (Age 18+).",
      };
    }

    default:
      return {
        isEligible: false,
        reason: "Assessment eligibility criteria not met.",
      };
  }
}
