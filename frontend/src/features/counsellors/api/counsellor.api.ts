import { fetchApi } from "@/services/api/client";
import {
  CounsellorCardDTO,
  CounsellorDetailDTO,
  CounsellingSessionDTO,
  CounsellingNoteDTO,
  SaveCounsellingNoteDTO,
  CreateBookingRequestDTO,
  StudentPsychometricSummaryDTO,
  NotificationDTO,
  ConsentPermission,
  SessionStatus,
  CounsellorFilterParams,
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
  async getCounsellorOverview(): Promise<{
    stats: {
      upcomingSessionsCount: number;
      pendingRequestsCount: number;
      completedSessionsCount: number;
      totalAssignedStudentsCount: number;
    };
    counsellorProfile: CounsellorDetailDTO;
    upcomingSessions: CounsellingSessionDTO[];
    pendingRequests: CounsellingSessionDTO[];
  }> {
    const res = await fetchApi<ApiResponse<any>>("/counselling/counsellor/overview");
    return res.data;
  },

  /**
   * Counsellor Portal: Fetches assigned appointments.
   */
  async getCounsellorSessions(status?: string): Promise<CounsellingSessionDTO[]> {
    const query = status && status !== "ALL" ? `?status=${status}` : "";
    const res = await fetchApi<ApiResponse<CounsellingSessionDTO[]>>(
      `/counselling/counsellor/sessions${query}`
    );
    return res.data || [];
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
  async getAssignedStudents(): Promise<any[]> {
    const res = await fetchApi<ApiResponse<any[]>>("/counselling/counsellor/students");
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
    await fetchApi<ApiResponse<any>>(`/notifications/${notificationId}/read`, {
      method: "PATCH",
    });
  },
};
