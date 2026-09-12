import { pool } from "../../config/database";
import { assessmentRepository } from "./assessment.repository";
import { participantRepository } from "../participants/participant.repository";
import { userRepository } from "../users/user.repository";
import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";
import {
  calculateExactAge,
  evaluateAssessmentEligibility,
  normalizeStage,
  normalizeGrade,
} from "./assessment-eligibility.rules";
import {
  ParticipantAssessmentsResponseDTO,
  ParticipantAssessmentItemDTO,
  ParticipantAssessmentStatus,
  AssessmentCatalogEntity,
  AssessmentCode,
} from "./assessment.types";

export class AssessmentEligibilityService {
  /**
   * Evaluates and returns all catalog assessments for the authenticated participant
   * tailored to their Age & Class demographic, with sequential journey unlock states,
   * single highlighted recommendation (⭐ Recommended for You), and capability flags.
   */
  async getAvailableAssessmentsForParticipant(
    userId: string
  ): Promise<ParticipantAssessmentsResponseDTO> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound("Participant user not found.", "AUTH_USER_NOT_FOUND");
    }

    const profile = await participantRepository.findByUserId(userId);

    // If participant hasn't completed onboarding or has no profile data, return structured PROFILE_INCOMPLETE
    if (!profile || !profile.isOnboarded || !profile.educationStage) {
      logger.info({ userId }, "Participant profile is incomplete for assessment calibration");
      return {
        state: "PROFILE_INCOMPLETE",
        derivedAge: calculateExactAge(profile?.dateOfBirth),
        educationStage: profile?.educationStage || null,
        gradeLevel: profile?.gradeLevel || null,
        primaryAssessmentCode: null,
        totalAvailable: 0,
        completedCount: 0,
        overallProgressPercentage: 0,
        assessments: [],
      };
    }

    const derivedAge = calculateExactAge(profile.dateOfBirth);
    const activeCatalog = await assessmentRepository.findActiveAssessments();
    const allPrerequisites = await assessmentRepository.findAllPrerequisites();

    // Determine the student's primary / starting assessment for their demographic
    const primaryRecommendation = this.determinePrimaryAssessment(
      profile.educationStage,
      profile.gradeLevel,
      derivedAge
    );
    const primaryCode = primaryRecommendation.primaryCode;

    // Query participant's latest attempt per assessment
    const attemptsRes = await pool.query(
      `SELECT DISTINCT ON (assessment_id)
              id, assessment_id, status, total_questions, answered_count, completed_at
       FROM assessment_attempts
       WHERE participant_id = $1
       ORDER BY assessment_id, updated_at DESC`,
      [userId]
    );

    const attemptMap: Record<string, any> = {};
    for (const row of attemptsRes.rows) {
      attemptMap[row.assessment_id] = row;
    }

    // Query set of completed assessment IDs for this participant
    const completedRes = await pool.query(
      `SELECT DISTINCT assessment_id
       FROM assessment_attempts
       WHERE participant_id = $1 AND status = 'COMPLETED'`,
      [userId]
    );
    const completedAssessmentIds = new Set<string>(
      completedRes.rows.map((r) => r.assessment_id)
    );

    // Find if primary assessment is completed
    const primaryAssessmentEntity = activeCatalog.find((a) => a.code === primaryCode);
    const hasCompletedPrimary = primaryAssessmentEntity
      ? completedAssessmentIds.has(primaryAssessmentEntity.id)
      : false;

    // Map prerequisites by target assessmentId
    const prereqsByAssessmentId: Record<
      string,
      Array<{
        prerequisiteAssessmentId: string;
        prerequisiteCode: AssessmentCode;
        prerequisiteName: string;
        requiredStatus: string;
      }>
    > = {};

    for (const p of allPrerequisites) {
      if (!prereqsByAssessmentId[p.assessmentId]) {
        prereqsByAssessmentId[p.assessmentId] = [];
      }
      prereqsByAssessmentId[p.assessmentId].push({
        prerequisiteAssessmentId: p.prerequisiteAssessmentId,
        prerequisiteCode: p.prerequisiteCode,
        prerequisiteName: p.prerequisiteName,
        requiredStatus: p.requiredStatus,
      });
    }

    const assessmentItems: ParticipantAssessmentItemDTO[] = [];
    let hasAssignedRecommendation = false;

    // Check if any assessment is currently IN_PROGRESS (takes top recommendation priority)
    const inProgressAssessment = activeCatalog.find((a) => {
      const att = attemptMap[a.id];
      return att && att.status === "IN_PROGRESS" && !completedAssessmentIds.has(a.id);
    });

    for (let i = 0; i < activeCatalog.length; i++) {
      const assessment = activeCatalog[i];
      const userAttempt = attemptMap[assessment.id];
      const isCompleted = completedAssessmentIds.has(assessment.id) || userAttempt?.status === "COMPLETED";
      const isInProgress = !isCompleted && userAttempt?.status === "IN_PROGRESS";

      // Evaluate prerequisites
      const prereqs = prereqsByAssessmentId[assessment.id] || [];
      const prerequisiteStatuses = prereqs.map((prereq) => ({
        code: prereq.prerequisiteCode,
        name: prereq.prerequisiteName,
        isSatisfied: completedAssessmentIds.has(prereq.prerequisiteAssessmentId),
      }));

      // Demographic check
      const demographicEligibility = evaluateAssessmentEligibility({
        assessment,
        age: derivedAge,
        educationStage: profile.educationStage,
        gradeLevel: profile.gradeLevel,
      });

      let status: "AVAILABLE" | "IN_PROGRESS" | "COMPLETED" | "LOCKED" = "AVAILABLE";
      let isEligible = demographicEligibility.isEligible;
      let eligibilityReason = demographicEligibility.reason;
      let progressPercentage = 0;
      let activeAttemptId: string | null = null;
      let canStart = false;
      let canContinue = false;
      let canRetake = false;
      let canViewResult = false;
      let lockReason: string | null = null;
      let isRecommended = false;
      let recommendationReason: string | null = null;
      let completedAt: string | null = null;

      if (isCompleted) {
        // Step A: Completed attempts preserve completed state and historical results
        status = "COMPLETED";
        progressPercentage = 100;
        canStart = false;
        canContinue = false;
        canRetake = true;
        canViewResult = true;
        activeAttemptId = userAttempt?.id || null;
        completedAt = userAttempt?.completed_at
          ? new Date(userAttempt.completed_at).toISOString()
          : null;
      } else if (isInProgress) {
        // Step B: Active in-progress attempts resume without duplicates
        status = "IN_PROGRESS";
        activeAttemptId = userAttempt.id;
        const total =
          parseInt(userAttempt.total_questions, 10) ||
          assessment.questionCount ||
          1;
        const answered = parseInt(userAttempt.answered_count, 10) || 0;
        progressPercentage = Math.min(99, Math.round((answered / total) * 100));
        canStart = false;
        canContinue = true;
        canRetake = false;
        canViewResult = false;
        isRecommended = true;
        recommendationReason = "In progress: Resume where you left off.";
        hasAssignedRecommendation = true;
      } else {
        // Step C: Open Access - All active assessments are AVAILABLE for all participants
        status = "AVAILABLE";
        isEligible = true;
        canStart = true;
        canContinue = false;
        canRetake = false;
        canViewResult = false;
        lockReason = null;

        const isPrimary = assessment.code === primaryCode;
        if (isPrimary && !hasAssignedRecommendation && !inProgressAssessment) {
          isRecommended = true;
          recommendationReason = primaryRecommendation.reason;
          hasAssignedRecommendation = true;
        }
      }

      assessmentItems.push({
        id: assessment.id,
        code: assessment.code,
        name: assessment.name,
        category: assessment.category,
        description: assessment.description,
        estimatedMinutes: assessment.estimatedMinutes,
        questionCount: assessment.questionCount,
        status,
        progressPercentage,
        isEligible,
        eligibilityReason,
        canStart,
        canContinue,
        canRetake,
        canViewResult,
        lockReason,
        prerequisites: prerequisiteStatuses,
        isRecommended,
        recommendationReason,
        journeyOrder: i + 1,
        activeAttemptId,
        completedAt,
      });
    }

    const completedCount = assessmentItems.filter((a) => a.status === "COMPLETED").length;
    const availableCount = assessmentItems.filter((a) => a.status === "AVAILABLE" || a.status === "IN_PROGRESS").length;
    const totalAvailable = assessmentItems.length;
    const overallProgress =
      totalAvailable > 0
        ? Math.round((completedCount / totalAvailable) * 100)
        : 0;

    logger.info(
      {
        userId,
        derivedAge,
        educationStage: profile.educationStage,
        gradeLevel: profile.gradeLevel,
        primaryCode,
        hasCompletedPrimary,
        catalogCount: totalAvailable,
        completedCount,
        availableCount,
      },
      "Evaluated participant personalized assessment journey"
    );

    return {
      state: totalAvailable > 0 ? "ELIGIBLE" : "NO_ELIGIBLE_ASSESSMENTS",
      derivedAge,
      educationStage: profile.educationStage,
      gradeLevel: profile.gradeLevel,
      primaryAssessmentCode: primaryCode,
      totalAvailable,
      completedCount,
      overallProgressPercentage: overallProgress,
      assessments: assessmentItems,
    };
  }

  /**
   * Evaluates the student's primary recommended assessment code based on age and class.
   */
  determinePrimaryAssessment(
    educationStage: string | null,
    gradeLevel: string | null,
    age: number | null
  ): { primaryCode: AssessmentCode; reason: string } {
    const stage = normalizeStage(educationStage);
    const grade = normalizeGrade(educationStage, gradeLevel);

    // 1. Secondary School (Class 9-10 / Age 14-15) -> Stream Finder
    if (grade && ["9", "10"].includes(grade)) {
      return {
        primaryCode: "STREAM_FINDER",
        reason: `Calibrated primary assessment for Class ${grade} stream selection and subject affinity.`,
      };
    }
    if (age !== null && age >= 14 && age < 16) {
      return {
        primaryCode: "STREAM_FINDER",
        reason: `Calibrated primary assessment for secondary stream selection (Age ${age}).`,
      };
    }

    // 2. Middle School (Class 5-8 / Age 10-13) -> Skill Finder
    if (grade && ["5", "6", "7", "8"].includes(grade)) {
      return {
        primaryCode: "SKILL_FINDER",
        reason: `Calibrated primary assessment for Middle School (Class ${grade}) cognitive aptitude.`,
      };
    }
    if (age !== null && age >= 10 && age < 14) {
      return {
        primaryCode: "SKILL_FINDER",
        reason: `Calibrated primary assessment for exploratory cognitive skills (Age ${age}).`,
      };
    }

    // 3. Higher Secondary (Class 11-12 / Age 16-17) -> Stream Finder / Foundational Specialization
    if (grade && ["11", "12"].includes(grade)) {
      return {
        primaryCode: "STREAM_FINDER",
        reason: `Calibrated foundational battery for Higher Secondary (Class ${grade}) specialization.`,
      };
    }
    if (age !== null && age >= 16 && age < 18) {
      return {
        primaryCode: "STREAM_FINDER",
        reason: `Calibrated foundational assessment for Senior Secondary learners (Age ${age}).`,
      };
    }

    // 4. College / University / Working Professional / Adult (Age >= 18) -> Right Career Finder
    if (
      stage === "COLLEGE_UNIVERSITY" ||
      stage === "WORKING_PROFESSIONAL" ||
      stage === "OTHER" ||
      (age !== null && age >= 18)
    ) {
      return {
        primaryCode: "RIGHT_CAREER_FINDER",
        reason: "Calibrated primary assessment for vocational alignment, RIASEC interests & career fit.",
      };
    }

    // Default fallback
    return {
      primaryCode: "SKILL_FINDER",
      reason: "Foundational cognitive and aptitude exploration battery.",
    };
  }

  /**
   * Authoritatively evaluates whether a participant has access to start or retake an assessment.
   * Prevents unauthorized attempt creation via direct URL manipulation.
   */
  async checkAssessmentAccess(
    userId: string,
    assessmentCode: string
  ): Promise<{
    canAccess: boolean;
    status: ParticipantAssessmentStatus;
    lockReason?: string | null;
    assessment?: AssessmentCatalogEntity;
  }> {
    const assessment = await assessmentRepository.findByIdOrCode(assessmentCode);
    if (!assessment) {
      throw AppError.notFound(`Assessment '${assessmentCode}' not found.`, "ASSESSMENT_NOT_FOUND");
    }

    if (assessment.status !== "ACTIVE") {
      return {
        canAccess: false,
        status: "LOCKED",
        lockReason: `Assessment is currently ${assessment.status.toLowerCase()}.`,
        assessment,
      };
    }

    const userAssessments = await this.getAvailableAssessmentsForParticipant(userId);
    const item = userAssessments.assessments.find((a) => a.code === assessment.code || a.id === assessment.id);

    return {
      canAccess: true,
      status: item?.status || "AVAILABLE",
      lockReason: null,
      assessment,
    };
  }
}

export const assessmentEligibilityService = new AssessmentEligibilityService();
