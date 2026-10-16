import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { counsellorApi } from "../api/counsellor.api";
import {
  CounsellorFilterParams,
  CreateBookingRequestDTO,
  ConsentPermission,
  SessionStatus,
  SaveCounsellingNoteDTO,
  CounsellorSessionFilterParams,
  UpdateCounsellorProfileDTO,
  CounsellorAvailability,
} from "../types/counsellor.types";

export const counsellorKeys = {
  all: ["counsellors"] as const,
  lists: () => [...counsellorKeys.all, "list"] as const,
  list: (filters?: CounsellorFilterParams) => [...counsellorKeys.lists(), filters] as const,
  details: () => [...counsellorKeys.all, "detail"] as const,
  detail: (id: string) => [...counsellorKeys.details(), id] as const,
  dateAvailability: (id: string, date?: string) => [...counsellorKeys.all, "date-availability", id, date] as const,
  studentSessions: () => ["student-counselling-sessions"] as const,
  counsellorOverview: () => ["counsellor-overview"] as const,
  counsellorSessions: (filters?: string | CounsellorSessionFilterParams) => ["counsellor-sessions", filters] as const,
  sessionDetail: (sessionId: string) => ["counsellor-session-detail", sessionId] as const,
  assignedStudents: () => ["counsellor-assigned-students"] as const,
  studentSummary: (studentId: string) => ["counsellor-student-summary", studentId] as const,
  sessionNotes: (sessionId: string) => ["counselling-session-notes", sessionId] as const,
  notifications: () => ["user-notifications"] as const,
};

/**
 * Hook to fetch recommended career counsellors with AI match score.
 */
export function useCounsellors(filters?: CounsellorFilterParams) {
  return useQuery({
    queryKey: counsellorKeys.list(filters),
    queryFn: () => counsellorApi.getCounsellors(filters),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch single counsellor full profile and availability.
 */
export function useCounsellorDetail(id: string) {
  return useQuery({
    queryKey: counsellorKeys.detail(id),
    queryFn: () => counsellorApi.getCounsellorById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch dynamic slot availability for a specific date (with occupied / booked status).
 */
export function useCounsellorDateAvailability(id: string, date?: string) {
  return useQuery({
    queryKey: counsellorKeys.dateAvailability(id, date),
    queryFn: () => counsellorApi.getDateAvailability(id, date),
    enabled: Boolean(id && date),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch student's booked sessions.
 */
export function useStudentSessions() {
  return useQuery({
    queryKey: counsellorKeys.studentSessions(),
    queryFn: () => counsellorApi.getStudentSessions(),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch counsellor portal overview metrics.
 */
export function useCounsellorOverview() {
  return useQuery({
    queryKey: counsellorKeys.counsellorOverview(),
    queryFn: () => counsellorApi.getCounsellorOverview(),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch counsellor's appointments with advanced filtering & search.
 */
export function useCounsellorSessions(filters?: string | CounsellorSessionFilterParams) {
  return useQuery({
    queryKey: counsellorKeys.counsellorSessions(filters),
    queryFn: () => counsellorApi.getCounsellorSessions(filters),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch single session detail for counsellor with security authorization.
 */
export function useSessionDetail(sessionId: string, enabled = true) {
  return useQuery({
    queryKey: counsellorKeys.sessionDetail(sessionId),
    queryFn: () => counsellorApi.getSessionById(sessionId),
    enabled: Boolean(sessionId) && enabled,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch assigned students for counsellor.
 */
export function useAssignedStudents() {
  return useQuery({
    queryKey: counsellorKeys.assignedStudents(),
    queryFn: () => counsellorApi.getAssignedStudents(),
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to fetch safe psychometric summary with privacy consent check.
 */
export function useStudentSummary(studentId: string, enabled = true) {
  return useQuery({
    queryKey: counsellorKeys.studentSummary(studentId),
    queryFn: () => counsellorApi.getStudentSummary(studentId),
    enabled: Boolean(studentId) && enabled,
    retry: false,
  });
}

/**
 * Hook to fetch notes for a session.
 */
export function useSessionNotes(sessionId: string, enabled = true) {
  return useQuery({
    queryKey: counsellorKeys.sessionNotes(sessionId),
    queryFn: () => counsellorApi.getSessionNotes(sessionId),
    enabled: Boolean(sessionId) && enabled,
  });
}

/**
 * Hook to fetch user notifications.
 */
export function useNotifications() {
  return useQuery({
    queryKey: counsellorKeys.notifications(),
    queryFn: () => counsellorApi.getNotifications(),
    refetchInterval: 60 * 1000,
  });
}

/**
 * Mutation: Student requests session booking.
 */
export function useRequestBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateBookingRequestDTO) => counsellorApi.requestBooking(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: counsellorKeys.all });
      queryClient.invalidateQueries({ queryKey: counsellorKeys.studentSessions() });
      queryClient.invalidateQueries({ queryKey: counsellorKeys.notifications() });
    },
  });
}

/**
 * Mutation: Student updates consent.
 */
export function useUpdateConsent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ counsellorId, permission }: { counsellorId: string; permission: ConsentPermission }) =>
      counsellorApi.updateConsent(counsellorId, permission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: counsellorKeys.studentSessions() });
    },
  });
}

/**
 * Mutation: Counsellor updates session status.
 */
export function useUpdateSessionStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      status,
      meetingLink,
    }: {
      sessionId: string;
      status: SessionStatus;
      meetingLink?: string;
    }) => counsellorApi.updateSessionStatus(sessionId, status, meetingLink),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: counsellorKeys.counsellorOverview() });
      queryClient.invalidateQueries({ queryKey: ["counsellor-sessions"] });
      queryClient.invalidateQueries({ queryKey: counsellorKeys.studentSessions() });
      queryClient.invalidateQueries({ queryKey: ["messaging"] });
    },
  });
}

/**
 * Mutation: Counsellor saves session notes.
 */
export function useSaveSessionNotes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, dto }: { sessionId: string; dto: SaveCounsellingNoteDTO }) =>
      counsellorApi.saveSessionNotes(sessionId, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: counsellorKeys.sessionNotes(variables.sessionId) });
      queryClient.invalidateQueries({ queryKey: ["counsellor-sessions"] });
      queryClient.invalidateQueries({ queryKey: counsellorKeys.studentSessions() });
    },
  });
}

/**
 * Mutation: Mark notification as read.
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => counsellorApi.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: counsellorKeys.notifications() });
    },
  });
}

/**
 * Hook to fetch counsellor availability.
 */
export function useCounsellorAvailability() {
  return useQuery({
    queryKey: ["counsellor-availability"],
    queryFn: () => counsellorApi.getCounsellorAvailability(),
    staleTime: 60 * 1000,
  });
}

/**
 * Mutation: Update counsellor weekly availability.
 */
export function useUpdateCounsellorAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (availability: CounsellorAvailability[]) => counsellorApi.updateCounsellorAvailability(availability),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["counsellor-availability"] });
      queryClient.invalidateQueries({ queryKey: counsellorKeys.counsellorOverview() });
    },
  });
}

/**
 * Hook to fetch counsellor reviews.
 */
export function useCounsellorReviews() {
  return useQuery({
    queryKey: ["counsellor-reviews"],
    queryFn: () => counsellorApi.getCounsellorReviews(),
    staleTime: 60 * 1000,
  });
}

/**
 * Mutation: Update counsellor personal & professional profile.
 */
export function useUpdateCounsellorProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateCounsellorProfileDTO) => counsellorApi.updateCounsellorProfile(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: counsellorKeys.counsellorOverview() });
    },
  });
}

