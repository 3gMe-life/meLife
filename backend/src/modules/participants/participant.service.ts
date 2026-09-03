import { participantRepository } from "./participant.repository";
import { userRepository } from "../users/user.repository";
import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";
import { isGuardianRequired, calculateAge, normalizeEducationStage, extractGradeLevel } from "./participant.rules";
import {
  ParticipantProfile,
  ParticipantOnboardingDTO,
  UpdateParticipantProfileDTO,
} from "./participant.types";

export class ParticipantService {
  /**
   * Retrieves participant profile by authenticated user ID.
   */
  async getProfile(userId: string): Promise<ParticipantProfile> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound("Participant user not found.", "AUTH_USER_NOT_FOUND");
    }

    let profile = await participantRepository.findByUserId(userId);
    if (!profile) {
      // Auto-create initial profile placeholder if not yet exists
      profile = await participantRepository.upsertProfile(userId, {});
    }

    return profile;
  }

  /**
   * Updates participant profile fields progressively.
   */
  async updateProfile(
    userId: string,
    dto: UpdateParticipantProfileDTO
  ): Promise<ParticipantProfile> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound("Participant user not found.", "AUTH_USER_NOT_FOUND");
    }

    const updated = await participantRepository.upsertProfile(userId, dto);
    logger.info({ userId }, "Participant profile updated");
    return updated;
  }

  /**
   * Checks onboarding status and requirement rules for current participant.
   */
  async getOnboardingState(userId: string): Promise<{
    isOnboarded: boolean;
    isGuardianRequired: boolean;
    profile: ParticipantProfile | null;
  }> {
    const profile = await participantRepository.findByUserId(userId);
    const guardianRequired = isGuardianRequired({
      dateOfBirth: profile?.dateOfBirth,
      educationStage: profile?.educationStage,
      gradeLevel: profile?.gradeLevel,
    });

    return {
      isOnboarded: Boolean(profile?.isOnboarded),
      isGuardianRequired: guardianRequired,
      profile,
    };
  }

  /**
   * Validates and completes participant onboarding inside an atomic transaction.
   */
  async completeOnboarding(
    userId: string,
    dto: ParticipantOnboardingDTO
  ): Promise<{
    success: boolean;
    message: string;
    profile: ParticipantProfile;
  }> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound("Participant user not found.", "AUTH_USER_NOT_FOUND");
    }

    if (!dto.educationStage || !dto.educationStage.trim()) {
      throw AppError.badRequest(
        "Educational stage is required for calibration.",
        "PARTICIPANT_STAGE_REQUIRED"
      );
    }

    const normalizedStage = normalizeEducationStage(dto.educationStage);
    const gradeLevel = extractGradeLevel(dto.educationStage, dto.gradeLevel);

    // Validate DOB if provided
    if (dto.dateOfBirth) {
      const age = calculateAge(dto.dateOfBirth);
      if (age === null || age < 5 || age > 120) {
        throw AppError.badRequest(
          "Please enter a valid date of birth. Age must be between 5 and 120.",
          "PARTICIPANT_INVALID_DOB"
        );
      }
    }

    // Verify guardian requirement rule
    const guardianRequired = isGuardianRequired({
      dateOfBirth: dto.dateOfBirth,
      educationStage: dto.educationStage,
      gradeLevel,
    });

    if (guardianRequired) {
      if (!dto.guardianName || dto.guardianName.trim().length < 2) {
        throw AppError.badRequest(
          "Parent or guardian full name is required for minors and school students.",
          "GUARDIAN_NAME_REQUIRED"
        );
      }
      if (!dto.guardianPhone || dto.guardianPhone.trim().length < 7) {
        throw AppError.badRequest(
          "Guardian contact phone number is required.",
          "GUARDIAN_PHONE_REQUIRED"
        );
      }
    }

    const completedProfile = await participantRepository.completeOnboarding(userId, {
      ...dto,
      educationStage: dto.educationStage,
      gradeLevel,
    });

    logger.info(
      {
        userId,
        educationStage: normalizedStage,
        gradeLevel,
        isGuardianRequired: guardianRequired,
      },
      "Participant onboarding completed successfully"
    );

    return {
      success: true,
      message: "Participant profile calibrated and onboarding completed successfully.",
      profile: completedProfile,
    };
  }
}

export const participantService = new ParticipantService();
