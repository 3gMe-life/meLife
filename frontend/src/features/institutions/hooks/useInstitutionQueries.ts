import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { institutionApi } from "../api/institution.api";
import {
  UpdateInstitutionProfileDTO,
  CreateInstitutionClassDTO,
} from "../types/institution.types";

export const institutionKeys = {
  all: ["institution"] as const,
  overview: () => [...institutionKeys.all, "overview"] as const,
  profile: () => [...institutionKeys.all, "profile"] as const,
  classes: () => [...institutionKeys.all, "classes"] as const,
  students: (classId?: string) => [...institutionKeys.all, "students", classId || "ALL"] as const,
  invitations: (status?: string) => [...institutionKeys.all, "invitations", status || "ALL"] as const,
  assessments: () => [...institutionKeys.all, "assessments"] as const,
  campaigns: (status?: string) => [...institutionKeys.all, "campaigns", status || "ALL"] as const,
  campaignDetails: (id: string) => [...institutionKeys.all, "campaign", id] as const,
};

/**
 * Hook to retrieve institution dashboard overview with 8-KPI stats and recent cohorts.
 */
export function useInstitutionOverview() {
  return useQuery({
    queryKey: institutionKeys.overview(),
    queryFn: () => institutionApi.getOverview(),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to retrieve institution profile.
 */
export function useInstitutionProfile() {
  return useQuery({
    queryKey: institutionKeys.profile(),
    queryFn: () => institutionApi.getProfile(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to update institution profile.
 */
export function useUpdateInstitutionProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateInstitutionProfileDTO) => institutionApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: institutionKeys.profile() });
      queryClient.invalidateQueries({ queryKey: institutionKeys.overview() });
    },
  });
}

/**
 * Hook to retrieve all registered cohorts for this institution.
 */
export function useInstitutionClasses() {
  return useQuery({
    queryKey: institutionKeys.classes(),
    queryFn: () => institutionApi.getClasses(),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to create a new cohort for this institution.
 */
export function useCreateInstitutionClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInstitutionClassDTO) => institutionApi.createClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: institutionKeys.classes() });
      queryClient.invalidateQueries({ queryKey: institutionKeys.overview() });
    },
  });
}

/**
 * Hook to retrieve all enrolled students for this institution.
 */
export function useInstitutionStudents(classId?: string) {
  return useQuery({
    queryKey: institutionKeys.students(classId),
    queryFn: () => institutionApi.getStudents(classId),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to retrieve all student invitations for this institution.
 */
export function useInstitutionInvitations(status?: string) {
  return useQuery({
    queryKey: institutionKeys.invitations(status),
    queryFn: () => institutionApi.getInvitations(status),
    refetchInterval: 4000,
    staleTime: 2000,
  });
}

/**
 * Hook to retrieve all invitation campaigns with live polling.
 */
export function useInstitutionCampaigns(status?: string) {
  return useQuery({
    queryKey: institutionKeys.campaigns(status),
    queryFn: () => institutionApi.getCampaigns(status),
    refetchInterval: 3000,
    staleTime: 2000,
  });
}

/**
 * Hook to retrieve campaign details and students with live progress updates.
 */
export function useInstitutionCampaignDetails(campaignId: string | null) {
  return useQuery({
    queryKey: institutionKeys.campaignDetails(campaignId || ""),
    queryFn: () => (campaignId ? institutionApi.getCampaignDetails(campaignId) : null),
    enabled: !!campaignId,
    refetchInterval: (query) => {
      const status = query.state.data?.campaign?.status;
      return status === "PROCESSING" || status === "QUEUED" ? 2500 : false;
    },
    staleTime: 2000,
  });
}

/**
 * Hook to retry failed jobs in a campaign.
 */
export function useRetryFailedCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (campaignId: string) => institutionApi.retryFailedCampaign(campaignId),
    onSuccess: (_, campaignId) => {
      queryClient.invalidateQueries({ queryKey: institutionKeys.campaigns() });
      queryClient.invalidateQueries({ queryKey: institutionKeys.campaignDetails(campaignId) });
      queryClient.invalidateQueries({ queryKey: institutionKeys.invitations() });
    },
  });
}

/**
 * Hook to send an individual student invitation.
 */
export function useInviteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: import("../types/institution.types").CreateStudentInvitationDTO) =>
      institutionApi.inviteStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: institutionKeys.invitations() });
      queryClient.invalidateQueries({ queryKey: institutionKeys.students() });
      queryClient.invalidateQueries({ queryKey: institutionKeys.overview() });
      queryClient.invalidateQueries({ queryKey: institutionKeys.campaigns() });
    },
  });
}

/**
 * Hook to bulk import students and create an invitation campaign.
 */
export function useBulkImportStudents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: import("../types/institution.types").BulkImportStudentInvitationsRequestDTO) =>
      institutionApi.bulkImportStudents(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: institutionKeys.invitations() });
      queryClient.invalidateQueries({ queryKey: institutionKeys.campaigns() });
      queryClient.invalidateQueries({ queryKey: institutionKeys.students() });
      queryClient.invalidateQueries({ queryKey: institutionKeys.overview() });
    },
  });
}

/**
 * Hook to resend a student invitation.
 */
export function useResendInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => institutionApi.resendInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: institutionKeys.invitations() });
      queryClient.invalidateQueries({ queryKey: institutionKeys.campaigns() });
    },
  });
}

/**
 * Hook to revoke a student invitation.
 */
export function useRevokeInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => institutionApi.revokeInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: institutionKeys.invitations() });
      queryClient.invalidateQueries({ queryKey: institutionKeys.campaigns() });
    },
  });
}

/**
 * Hook to retrieve all allocated assessments for this institution.
 */
export function useInstitutionAssessments() {
  return useQuery({
    queryKey: institutionKeys.assessments(),
    queryFn: () => institutionApi.getAssessments(),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to assign an assessment to an institution or cohort.
 */
export function useAssignInstitutionAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      assessmentCode: string;
      classId?: string;
      title?: string;
      deadline?: string;
    }) => institutionApi.assignAssessment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: institutionKeys.assessments() });
      queryClient.invalidateQueries({ queryKey: institutionKeys.overview() });
    },
  });
}
