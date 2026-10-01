import { fetchApi } from "@/services/api/client";
import {
  CounsellorCardDTO,
  CounsellorDetailDTO,
  CounsellorDateAvailabilityDTO,
  CounsellorAvailability,
  CounsellingSessionDTO,
  CounsellingNoteDTO,
  SaveCounsellingNoteDTO,
  CreateBookingRequestDTO,
  StudentPsychometricSummaryDTO,
  NotificationDTO,
  ConsentPermission,
  SessionStatus,
  CounsellorFilterParams,
  CounsellorSessionFilterParams,
  CounsellorOverviewDTO,
  UpdateCounsellorProfileDTO,
  AssignedStudentDTO,
  CounsellorReviewDTO,
} from "../types/counsellor.types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  isAssessed?: boolean;
}

export const counsellorApi = {
  /**
   * Fetches approved certified career counsellors with personalized AI match ranking.
   */
  async getCounsellors(
    filters?: CounsellorFilterParams
  ): Promise<{ counsellors: CounsellorCardDTO[]; isAssessed: boolean }> {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.specialisation && filters.specialisation !== "ALL") {
      params.append("specialisation", filters.specialisation);
    }
    if (filters?.language && filters.language !== "ALL") {
      params.append("language", filters.language);
    }
    if (filters?.experience && filters.experience !== "ALL") {
      params.append("experience", String(filters.experience));
    }
    if (filters?.day && filters.day !== "ALL") {
      params.append("day", filters.day);
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetchApi<ApiResponse<CounsellorCardDTO[]>>(`/counsellors${query}`);
    return {
      counsellors: res.data || [],
      isAssessed: Boolean(res.isAssessed),
    };
  },

  /**
   * Fetches full profile details, availability schedule, and student reviews.
   */
  async getCounsellorById(id: string): Promise<CounsellorDetailDTO> {
    const res = await fetchApi<ApiResponse<CounsellorDetailDTO>>(`/counsellors/${id}`);
    return res.data;
  },

  /**
   * Fetches dynamic slot availability for a specific calendar date (including occupied slots).
   */
  async getDateAvailability(id: string, date?: string): Promise<CounsellorDateAvailabilityDTO> {
    const query = date ? `?date=${encodeURIComponent(date)}` : "";
    const res = await fetchApi<ApiResponse<CounsellorDateAvailabilityDTO>>(`/counsellors/${id}/availability${query}`);
    return res.data;
  },

  /**
   * Submits a session appointment booking request with optional consent.
   */
  async requestBooking(dto: CreateBookingRequestDTO): Promise<CounsellingSessionDTO> {
    const res = await fetchApi<ApiResponse<CounsellingSessionDTO>>("/counselling/request", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  /**
   * Fetches sessions booked by current student.
   */
  async getStudentSessions(): Promise<CounsellingSessionDTO[]> {
    const res = await fetchApi<ApiResponse<CounsellingSessionDTO[]>>("/counselling/sessions");
    return res.data || [];
  },

  /**
   * Updates student profile sharing consent for a counsellor.
   */
  async updateConsent(
    counsellorId: string,
    permission: ConsentPermission
  ): Promise<{ success: boolean; permission: ConsentPermission }> {
    const res = await fetchApi<ApiResponse<{ success: boolean; permission: ConsentPermission }>>(
      "/counselling/consent",
      {
        method: "POST",
        body: JSON.stringify({ counsellorId, permission }),
      }
    );
    return res.data;
  },

  /**
   * Counsellor Portal: Fetches dashboard overview statistics and pending queue.
   */
  async getCounsellorOverview(): Promise<CounsellorOverviewDTO> {
    const res = await fetchApi<ApiResponse<CounsellorOverviewDTO>>("/counselling/counsellor/overview");
    return res.data;
  },

  /**
   * Counsellor Portal: Updates counsellor personal & professional profile.
   */
  async updateCounsellorProfile(dto: UpdateCounsellorProfileDTO): Promise<CounsellorDetailDTO> {
    const res = await fetchApi<ApiResponse<CounsellorDetailDTO>>("/counselling/counsellor/profile", {
      method: "PUT",
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  /**
   * Counsellor Portal: Fetches recurring availability schedule.
   */
  async getCounsellorAvailability(): Promise<CounsellorAvailability[]> {
    const res = await fetchApi<ApiResponse<CounsellorAvailability[]>>("/counselling/counsellor/availability");
    return res.data || [];
  },

  /**
   * Counsellor Portal: Updates weekly availability schedule.
   */
  async updateCounsellorAvailability(availability: CounsellorAvailability[]): Promise<CounsellorAvailability[]> {
    const res = await fetchApi<ApiResponse<CounsellorAvailability[]>>("/counselling/counsellor/availability", {
      method: "PUT",
      body: JSON.stringify({ availability }),
    });
    return res.data || [];
  },

  /**
   * Counsellor Portal: Fetches student reviews and feedback.
   */
  async getCounsellorReviews(): Promise<CounsellorReviewDTO[]> {
    const res = await fetchApi<ApiResponse<CounsellorReviewDTO[]>>("/counselling/counsellor/reviews");
    return res.data || [];
  },

  /**
   * Counsellor Portal: Fetches assigned appointments with advanced search and filters.
   */
  async getCounsellorSessions(
    filters?: string | CounsellorSessionFilterParams
  ): Promise<CounsellingSessionDTO[]> {
    const params = new URLSearchParams();

    if (typeof filters === "string") {
      if (filters && filters !== "ALL") params.append("status", filters);
    } else if (filters) {
      if (filters.status && filters.status !== "ALL") params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      if (filters.dateFilter && filters.dateFilter !== "ALL") params.append("dateFilter", filters.dateFilter);
      if (filters.assessmentStatus && filters.assessmentStatus !== "ALL") params.append("assessmentStatus", filters.assessmentStatus);
      if (filters.reportStatus && filters.reportStatus !== "ALL") params.append("reportStatus", filters.reportStatus);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
      if (filters.page) params.append("page", String(filters.page));
      if (filters.limit) params.append("limit", String(filters.limit));
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetchApi<ApiResponse<CounsellingSessionDTO[]>>(
      `/counselling/counsellor/sessions${query}`
    );
    return res.data || [];
  },

  /**
   * Counsellor Portal: Fetches single session details with notes and status.
   */
  async getSessionById(
    sessionId: string
  ): Promise<CounsellingSessionDTO & { notes?: CounsellingNoteDTO | null }> {
    const res = await fetchApi<ApiResponse<CounsellingSessionDTO & { notes?: CounsellingNoteDTO | null }>>(
      `/counselling/counsellor/sessions/${sessionId}`
    );
    return res.data;
  },

  /**
   * Counsellor Portal: Updates session status (CONFIRMED, REJECTED, COMPLETED, CANCELLED) with meeting link.
   */
  async updateSessionStatus(
    sessionId: string,
    status: SessionStatus,
    meetingLink?: string
  ): Promise<CounsellingSessionDTO> {
    const res = await fetchApi<ApiResponse<CounsellingSessionDTO>>(
      `/counselling/sessions/${sessionId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status, meetingLink }),
      }
    );
    return res.data;
  },

  /**
   * Counsellor Portal: Fetches list of assigned students.
   */
  async getAssignedStudents(): Promise<AssignedStudentDTO[]> {
    const res = await fetchApi<ApiResponse<AssignedStudentDTO[]>>("/counselling/counsellor/students");
    return res.data || [];
  },

  /**
   * Counsellor Portal: Fetches safe high-level psychometric summary if consent is granted.
   */
  async getStudentSummary(studentId: string): Promise<StudentPsychometricSummaryDTO> {
    const res = await fetchApi<ApiResponse<StudentPsychometricSummaryDTO>>(
      `/counselling/counsellor/students/${studentId}/summary`
    );
    return res.data;
  },

  /**
   * Counsellor Portal: Saves guidance notes, observations, recommendations, and action plan.
   */
  async saveSessionNotes(
    sessionId: string,
    dto: SaveCounsellingNoteDTO
  ): Promise<CounsellingNoteDTO> {
    const res = await fetchApi<ApiResponse<CounsellingNoteDTO>>(
      `/counselling/sessions/${sessionId}/notes`,
      {
        method: "POST",
        body: JSON.stringify(dto),
      }
    );
    return res.data;
  },

  /**
   * Fetches session notes (student or counsellor).
   */
  async getSessionNotes(sessionId: string): Promise<CounsellingNoteDTO | null> {
    const res = await fetchApi<ApiResponse<CounsellingNoteDTO | null>>(
      `/counselling/sessions/${sessionId}/notes`
    );
    return res.data;
  },

  /**
   * Fetches user notifications.
   */
  async getNotifications(): Promise<NotificationDTO[]> {
    const res = await fetchApi<ApiResponse<NotificationDTO[]>>("/notifications");
    return res.data || [];
  },

  /**
   * Marks a notification as read.
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    await fetchApi<ApiResponse<unknown>>(`/notifications/${notificationId}/read`, {
      method: "PATCH",
    });
  },
};
