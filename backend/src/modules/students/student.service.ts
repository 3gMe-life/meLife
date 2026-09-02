import { studentRepository } from "./student.repository";
import { userRepository } from "../users/user.repository";
import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";

export interface CompleteOnboardingDTO {
  educationStage: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
}

export class StudentService {
  /**
   * Records student educational calibration and parent/guardian contact info.
   */
  async completeOnboarding(
    userId: string,
    dto: CompleteOnboardingDTO
  ): Promise<{ success: boolean; message: string }> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound("Student user account not found.", "AUTH_USER_NOT_FOUND");
    }

    if (!dto.educationStage) {
      throw AppError.badRequest("Educational stage is required for calibration.", "STUDENT_STAGE_REQUIRED");
    }

    await studentRepository.completeOnboarding({
      userId,
      educationStage: dto.educationStage,
      guardianName: dto.guardianName,
      guardianPhone: dto.guardianPhone,
      guardianEmail: dto.guardianEmail,
    });

    logger.info({ userId, educationStage: dto.educationStage }, "Student onboarding completed");

    return {
      success: true,
      message: "Student onboarding completed successfully.",
    };
  }
}

export const studentService = new StudentService();
