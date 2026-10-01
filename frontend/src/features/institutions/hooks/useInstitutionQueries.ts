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
  assessments: () => [...institutionKeys.all, "assessments"] as const,
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
