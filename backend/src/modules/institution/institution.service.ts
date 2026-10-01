import { institutionRepository } from "./institution.repository";
import {
  InstitutionEntity,
  InstitutionOverviewDTO,
  UpdateInstitutionProfileDTO,
  CreateInstitutionClassDTO,
  InstitutionClassEntity,
} from "./institution.types";
import { logger } from "../../common/utils/logger";

export class InstitutionService {
  /**
   * Resolves or provisions the institution entity associated with the authenticated admin user.
   */
  async resolveInstitution(adminUserId: string): Promise<InstitutionEntity> {
    return institutionRepository.findOrCreateInstitutionForAdmin(adminUserId);
  }

  /**
   * Retrieves high-level dashboard overview data, aggregated statistics, and recent activity.
   */
  async getOverview(adminUserId: string): Promise<InstitutionOverviewDTO> {
    const institution = await this.resolveInstitution(adminUserId);
    const stats = await institutionRepository.getOverviewStats(institution.id);
    const classes = await institutionRepository.findClassesByInstitutionId(institution.id);

    // Mock/Synthesized recent activities based on institution activity
    const recentActivities = [
      {
        id: "act-1",
        type: "ENROLLMENT" as const,
        title: "New Student Cohort Enrolled",
        description: `Class Grade 12-A successfully registered with 32 students`,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: "act-2",
        type: "ASSESSMENT" as const,
        title: "Assessment Milestone Reached",
        description: `${stats.activeStudents > 0 ? Math.round((stats.assessmentCompletionRate * stats.activeStudents) / 100) : 18} students completed Skill Finder Assessment`,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      },
      {
        id: "act-3",
        type: "SESSION" as const,
        title: "Career Guidance Session Completed",
        description: "1-on-1 Stream Selection Session conducted with certified counsellor",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: "act-4",
        type: "PARENT" as const,
        title: "Parent Account Verified",
        description: "Parent linked to Student Profile via Invitation Token",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      },
    ];

    return {
      institution,
      stats,
      recentActivities,
      recentClasses: classes.slice(0, 5),
    };
  }

  /**
   * Retrieves full institutional profile and settings.
   */
  async getProfile(adminUserId: string): Promise<InstitutionEntity> {
    return this.resolveInstitution(adminUserId);
  }

  /**
   * Updates institutional details and configuration.
   */
  async updateProfile(
    adminUserId: string,
    data: UpdateInstitutionProfileDTO
  ): Promise<InstitutionEntity> {
    const institution = await this.resolveInstitution(adminUserId);
    const updated = await institutionRepository.updateInstitutionProfile(institution.id, data);
    if (!updated) {
      throw new Error("Failed to update institution profile");
    }
    logger.info({ institutionId: institution.id }, "Institution profile updated successfully");
    return updated;
  }

  /**
   * Retrieves all classes/cohorts for the institution.
   */
  async getClasses(adminUserId: string): Promise<InstitutionClassEntity[]> {
    const institution = await this.resolveInstitution(adminUserId);
    return institutionRepository.findClassesByInstitutionId(institution.id);
  }

  /**
   * Creates a new class/cohort in the institution.
   */
  async createClass(
    adminUserId: string,
    data: CreateInstitutionClassDTO
  ): Promise<InstitutionClassEntity> {
    const institution = await this.resolveInstitution(adminUserId);
    if (!data.academicYear || !data.gradeLevel || !data.division) {
      throw new Error("Academic Year, Grade Level, and Division are required");
    }
    return institutionRepository.createClass(institution.id, data);
  }

  /**
   * Retrieves all students belonging to this institution.
   */
  async getStudents(
    adminUserId: string,
    classId?: string
  ): Promise<import("./institution.types").InstitutionStudentEntity[]> {
    const institution = await this.resolveInstitution(adminUserId);
    return institutionRepository.findStudentsByInstitutionId(institution.id, classId);
  }

  /**
   * Retrieves all allocated assessments for this institution.
   */
  async getAssessments(
    adminUserId: string
  ): Promise<import("./institution.types").InstitutionAssessmentEntity[]> {
    const institution = await this.resolveInstitution(adminUserId);
    return institutionRepository.findAssessmentsByInstitutionId(institution.id);
  }

  /**
   * Allocates an assessment to an institution or cohort.
   */
  async assignAssessment(
    adminUserId: string,
    data: import("./institution.types").AssignAssessmentDTO
  ): Promise<import("./institution.types").InstitutionAssessmentEntity> {
    const institution = await this.resolveInstitution(adminUserId);
    if (!data.assessmentCode) {
      throw new Error("Assessment Code is required");
    }
    return institutionRepository.assignAssessment(institution.id, data);
  }
}

export const institutionService = new InstitutionService();
