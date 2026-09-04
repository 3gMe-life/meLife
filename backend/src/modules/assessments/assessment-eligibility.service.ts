import { pool } from "../../config/database";
import { assessmentRepository } from "./assessment.repository";
import { participantRepository } from "../participants/participant.repository";
import { userRepository } from "../users/user.repository";
import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";
import {
  calculateExactAge,
  evaluateAssessmentEligibility,
} from "./assessment-eligibility.rules";
import {
  ParticipantAssessmentsResponseDTO,
  ParticipantAssessmentItemDTO,
} from "./assessment.types";

export class AssessmentEligibilityService {
  /**
   * Evaluates and returns all eligible active assessments for the authenticated participant.
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
        totalAvailable: 0,
        completedCount: 0,
        overallProgressPercentage: 0,
        assessments: [],
      };
    }

    const derivedAge = calculateExactAge(profile.dateOfBirth);
    const activeCatalog = await assessmentRepository.findActiveAssessments();

    // Query participant's latest attempt per assessment to reflect real progress & completion
    const attemptsRes = await pool.query(
      `SELECT DISTINCT ON (assessment_id)
              id, assessment_id, status, total_questions, answered_count
       FROM assessment_attempts
       WHERE participant_id = $1
       ORDER BY assessment_id, updated_at DESC`,
      [userId]
    );

    const attemptMap: Record<string, any> = {};
    for (const row of attemptsRes.rows) {
      attemptMap[row.assessment_id] = row;
    }

    const eligibleAssessmentItems: ParticipantAssessmentItemDTO[] = [];

    for (const assessment of activeCatalog) {
      const eligibility = evaluateAssessmentEligibility({
        assessment,
        age: derivedAge,
        educationStage: profile.educationStage,
        gradeLevel: profile.gradeLevel,
      });

      if (eligibility.isEligible) {
        const userAttempt = attemptMap[assessment.id];
        let status: "AVAILABLE" | "IN_PROGRESS" | "COMPLETED" | "LOCKED" = "AVAILABLE";
        let progressPercentage = 0;
        let activeAttemptId: string | null = null;

        if (userAttempt) {
          activeAttemptId = userAttempt.id;
          if (userAttempt.status === "COMPLETED") {
            status = "COMPLETED";
            progressPercentage = 100;
          } else if (userAttempt.status === "IN_PROGRESS") {
            status = "IN_PROGRESS";
            const total =
              parseInt(userAttempt.total_questions, 10) ||
              assessment.questionCount ||
              1;
            const answered = parseInt(userAttempt.answered_count, 10) || 0;
            progressPercentage = Math.min(99, Math.round((answered / total) * 100));
          }
        }

        eligibleAssessmentItems.push({
          id: assessment.id,
          code: assessment.code,
          name: assessment.name,
          category: assessment.category,
          description: assessment.description,
          estimatedMinutes: assessment.estimatedMinutes,
          questionCount: assessment.questionCount,
          status,
          progressPercentage,
          isEligible: true,
          eligibilityReason: eligibility.reason,
          activeAttemptId,
        });
      }
    }

    const completedCount = eligibleAssessmentItems.filter(
      (a) => a.status === "COMPLETED"
    ).length;

    const totalAvailable = eligibleAssessmentItems.length;
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
        eligibleCount: totalAvailable,
      },
      "Evaluated participant assessment eligibility"
    );

    return {
      state: totalAvailable > 0 ? "ELIGIBLE" : "NO_ELIGIBLE_ASSESSMENTS",
      derivedAge,
      educationStage: profile.educationStage,
      gradeLevel: profile.gradeLevel,
      totalAvailable,
      completedCount,
      overallProgressPercentage: overallProgress,
      assessments: eligibleAssessmentItems,
    };
  }
}

export const assessmentEligibilityService = new AssessmentEligibilityService();
