import { fetchApi } from "@/services/api/client";
import {
  InstitutionProfile,
  InstitutionOverviewDTO,
  InstitutionClass,
  UpdateInstitutionProfileDTO,
  CreateInstitutionClassDTO,
} from "../types/institution.types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const institutionApi = {
  /**
   * Fetches full dashboard overview, aggregate stats, and recent cohorts.
   */
  async getOverview(): Promise<InstitutionOverviewDTO> {
    const res = await fetchApi<ApiResponse<InstitutionOverviewDTO>>("/institution/overview");
    return res.data;
  },

  /**
   * Fetches the institution profile information.
   */
  async getProfile(): Promise<InstitutionProfile> {
    const res = await fetchApi<ApiResponse<InstitutionProfile>>("/institution/profile");
    return res.data;
  },

  /**
   * Updates the institution profile details.
   */
  async updateProfile(data: UpdateInstitutionProfileDTO): Promise<InstitutionProfile> {
    const res = await fetchApi<ApiResponse<InstitutionProfile>>("/institution/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  /**
   * Fetches all registered class cohorts for the institution.
   */
  async getClasses(): Promise<InstitutionClass[]> {
    const res = await fetchApi<ApiResponse<InstitutionClass[]>>("/institution/classes");
    return res.data || [];
  },

  /**
   * Creates a new class cohort.
   */
  async createClass(data: CreateInstitutionClassDTO): Promise<InstitutionClass> {
    const res = await fetchApi<ApiResponse<InstitutionClass>>("/institution/classes", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  /**
   * Fetches all registered students for the institution.
   */
  async getStudents(classId?: string): Promise<import("../types/institution.types").InstitutionStudent[]> {
    const query = classId ? `?classId=${encodeURIComponent(classId)}` : "";
    const res = await fetchApi<ApiResponse<import("../types/institution.types").InstitutionStudent[]>>(
      `/institution/students${query}`
    );
    return res.data || [];
  },

  /**
   * Fetches all allocated assessments for the institution.
   */
  async getAssessments(): Promise<import("../types/institution.types").InstitutionAssessment[]> {
    const res = await fetchApi<ApiResponse<import("../types/institution.types").InstitutionAssessment[]>>(
      "/institution/assessments"
    );
    return res.data || [];
  },

  /**
   * Assigns an assessment to a cohort or entire institution.
   */
  async assignAssessment(data: {
    assessmentCode: string;
    classId?: string;
    title?: string;
    deadline?: string;
  }): Promise<import("../types/institution.types").InstitutionAssessment> {
    const res = await fetchApi<ApiResponse<import("../types/institution.types").InstitutionAssessment>>(
      "/institution/assessments/assign",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return res.data;
  },

  /**
   * Fetches all student invitations for the institution.
   */
  async getInvitations(status?: string): Promise<import("../types/institution.types").InstitutionStudentInvitation[]> {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    const res = await fetchApi<ApiResponse<import("../types/institution.types").InstitutionStudentInvitation[]>>(
      `/institution/invitations${query}`
    );
    return res.data || [];
  },

  /**
   * Sends an individual student invitation.
   */
  async inviteStudent(
    data: import("../types/institution.types").CreateStudentInvitationDTO
  ): Promise<import("../types/institution.types").InstitutionStudentInvitation> {
    const res = await fetchApi<ApiResponse<import("../types/institution.types").InstitutionStudentInvitation>>(
      "/institution/invitations",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return res.data;
  },

  /**
   * Bulk imports students and creates onboarding invitations.
   */
  async bulkImportStudents(
    data: import("../types/institution.types").BulkImportStudentInvitationsRequestDTO
  ): Promise<import("../types/institution.types").BulkImportStudentInvitationsResultDTO> {
    const res = await fetchApi<ApiResponse<import("../types/institution.types").BulkImportStudentInvitationsResultDTO>>(
      "/institution/invitations/bulk",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    return res.data;
  },

  /**
   * Resends a pending invitation with a new token and refreshed expiry.
   */
  async resendInvitation(
    id: string
  ): Promise<import("../types/institution.types").InstitutionStudentInvitation> {
    const res = await fetchApi<ApiResponse<import("../types/institution.types").InstitutionStudentInvitation>>(
      `/institution/invitations/${encodeURIComponent(id)}/resend`,
      {
        method: "POST",
      }
    );
    return res.data;
  },

  /**
   * Revokes a pending invitation.
   */
  async revokeInvitation(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetchApi<ApiResponse<{ success: boolean; message: string }>>(
      `/institution/invitations/${encodeURIComponent(id)}/revoke`,
      {
        method: "POST",
      }
    );
    return res.data;
  },

  /**
   * Validates a public invitation token.
   */
  async validateInvitationToken(
    token: string
  ): Promise<import("../types/institution.types").StudentInvitationValidationDTO> {
    const res = await fetchApi<ApiResponse<import("../types/institution.types").StudentInvitationValidationDTO>>(
      `/institution/invitations/validate?token=${encodeURIComponent(token)}`
    );
    return res.data;
  },

  /**
   * Accepts a student invitation, provisions user account if needed, and links to institution cohort.
   */
  async acceptInvitation(
    data: import("../types/institution.types").AcceptStudentInvitationDTO
  ): Promise<any> {
    const res = await fetchApi<ApiResponse<any>>("/institution/invitations/accept", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  /**
   * Fetches all invitation campaigns for the institution.
   */
  async getCampaigns(status?: string): Promise<import("../types/institution.types").InstitutionStudentCampaign[]> {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    const res = await fetchApi<ApiResponse<import("../types/institution.types").InstitutionStudentCampaign[]>>(
      `/institution/campaigns${query}`
    );
    return res.data || [];
  },

  /**
   * Fetches campaign details and student invitations.
   */
  async getCampaignDetails(id: string): Promise<{
    campaign: import("../types/institution.types").InstitutionStudentCampaign;
    invitations: import("../types/institution.types").InstitutionStudentInvitation[];
  }> {
    const res = await fetchApi<
      ApiResponse<{
        campaign: import("../types/institution.types").InstitutionStudentCampaign;
        invitations: import("../types/institution.types").InstitutionStudentInvitation[];
      }>
    >(`/institution/campaigns/${encodeURIComponent(id)}`);
    return res.data;
  },

  /**
   * Retries failed invitation jobs in a campaign.
   */
  async retryFailedCampaign(id: string): Promise<{ retriedCount: number; message: string }> {
    const res = await fetchApi<ApiResponse<{ retriedCount: number; message: string }>>(
      `/institution/campaigns/${encodeURIComponent(id)}/retry-failed`,
      {
        method: "POST",
      }
    );
    return res.data;
  },
};
