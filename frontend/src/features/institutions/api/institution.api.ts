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
};
