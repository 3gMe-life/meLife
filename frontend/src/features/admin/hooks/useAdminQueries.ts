import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../api/admin.api";
import {
  ApproveApplicationRequestDTO,
  RejectApplicationRequestDTO,
  AdminUserFilterParams,
  UpdateRolePermissionsRequestDTO,
  UpdateRoleDashboardFeaturesRequestDTO,
  UpdateCounsellorProfileRequestDTO,
  UpdateUserProfileRequestDTO,
  ApproveInstitutionApplicationRequestDTO,
  RejectInstitutionApplicationRequestDTO,
  AdminInstitutionFilterParams,
} from "../types/admin.types";

export const adminKeys = {
  all: ["admin"] as const,
  overview: () => [...adminKeys.all, "overview"] as const,
  counsellorApplications: (status?: string) =>
    status !== undefined
      ? ([...adminKeys.all, "counsellor-applications", status] as const)
      : ([...adminKeys.all, "counsellor-applications"] as const),
  applicationDetail: (id: string) =>
    [...adminKeys.all, "counsellor-application", id] as const,
  counsellorAccess: (id: string) =>
    [...adminKeys.all, "counsellor-access", id] as const,
  users: (filters?: AdminUserFilterParams) =>
    filters !== undefined
      ? ([...adminKeys.all, "users", filters] as const)
      : ([...adminKeys.all, "users"] as const),
  userDetail: (id: string) =>
    [...adminKeys.all, "user-detail", id] as const,
  roles: () => [...adminKeys.all, "roles"] as const,
  roleDetail: (idOrName: string) =>
    [...adminKeys.all, "role-detail", idOrName] as const,
  rolePermissionsMatrix: (idOrName: string) =>
    [...adminKeys.all, "role-permissions-matrix", idOrName] as const,
  permissions: () => [...adminKeys.all, "permissions"] as const,
  dashboardFeatures: () => [...adminKeys.all, "dashboard-features"] as const,
  roleDashboardFeatures: (idOrName: string) =>
    [...adminKeys.all, "role-dashboard-features", idOrName] as const,
  institutionMetrics: () => [...adminKeys.all, "institution-metrics"] as const,
  institutionApplications: (filters?: AdminInstitutionFilterParams) =>
    filters !== undefined
      ? ([...adminKeys.all, "institution-applications", filters] as const)
      : ([...adminKeys.all, "institution-applications"] as const),
  institutionApplicationDetail: (id: string) =>
    [...adminKeys.all, "institution-application", id] as const,
  institutions: (filters?: AdminInstitutionFilterParams) =>
    filters !== undefined
      ? ([...adminKeys.all, "institutions", filters] as const)
      : ([...adminKeys.all, "institutions"] as const),
  institutionDetail: (id: string) =>
    [...adminKeys.all, "institution-detail", id] as const,
};

/**
 * Hook to fetch live administrative platform overview metrics, recent users, and recent applications.
 */
export function useAdminOverview() {
  return useQuery({
    queryKey: adminKeys.overview(),
    queryFn: () => adminApi.getPlatformOverview(),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch counsellor applications queue.
 */
export function useAdminCounsellorApplications(status?: string) {
  return useQuery({
    queryKey: adminKeys.counsellorApplications(status),
    queryFn: () => adminApi.getCounsellorApplications(status),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch single counsellor application detail.
 */
export function useAdminCounsellorApplicationDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: adminKeys.applicationDetail(id),
    queryFn: () => adminApi.getCounsellorApplicationById(id),
    enabled: Boolean(id) && enabled,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch paginated users list with search and filters.
 */
export function useAdminUsers(filters?: AdminUserFilterParams) {
  return useQuery({
    queryKey: adminKeys.users(filters),
    queryFn: () => adminApi.getUsers(filters),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch single administrative user detail.
 */
export function useAdminUserDetail(userId: string, enabled = true) {
  return useQuery({
    queryKey: adminKeys.userDetail(userId),
    queryFn: () => adminApi.getUserById(userId),
    enabled: Boolean(userId) && enabled,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch all canonical database roles with user and permission counts.
 */
export function useAdminRoles() {
  return useQuery({
    queryKey: adminKeys.roles(),
    queryFn: () => adminApi.getRoles(),
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to fetch single role detail with assigned permissions and users.
 */
export function useAdminRoleDetail(idOrName: string, enabled = true) {
  return useQuery({
    queryKey: adminKeys.roleDetail(idOrName),
    queryFn: () => adminApi.getRoleDetail(idOrName),
    enabled: Boolean(idOrName) && enabled,
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to fetch all system permissions.
 */
export function useAdminPermissions() {
  return useQuery({
    queryKey: adminKeys.permissions(),
    queryFn: () => adminApi.getPermissions(),
    staleTime: 60 * 1000,
  });
}

/**
 * Mutation: Approve counsellor application atomically.
 */
export function useApproveCounsellorApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      dto,
    }: {
      applicationId: string;
      dto?: ApproveApplicationRequestDTO;
    }) => adminApi.approveCounsellorApplication(applicationId, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.counsellorApplications() });
      queryClient.invalidateQueries({ queryKey: adminKeys.applicationDetail(variables.applicationId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      queryClient.invalidateQueries({ queryKey: ["counsellors"] });
    },
  });
}

/**
 * Mutation: Reject counsellor application with documented audit reason.
 */
export function useRejectCounsellorApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicationId,
      dto,
    }: {
      applicationId: string;
      dto?: RejectApplicationRequestDTO;
    }) => adminApi.rejectCounsellorApplication(applicationId, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.counsellorApplications() });
      queryClient.invalidateQueries({ queryKey: adminKeys.applicationDetail(variables.applicationId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      queryClient.invalidateQueries({ queryKey: ["counsellors"] });
    },
  });
}

/**
 * Mutation: Update user account status (ACTIVE, SUSPENDED, DISABLED, PENDING_VERIFICATION).
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: string;
    }) => adminApi.updateUserStatus(userId, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.roles() });
      queryClient.invalidateQueries({ queryKey: adminKeys.userDetail(variables.userId) });
    },
  });
}

/**
 * Mutation: Update user role assignment.
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: string;
    }) => adminApi.updateUserRole(userId, role),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      queryClient.invalidateQueries({ queryKey: adminKeys.roles() });
      queryClient.invalidateQueries({ queryKey: adminKeys.userDetail(variables.userId) });
    },
  });
}

/**
 * Hook to fetch complete system permission matrix for a specific role.
 */
export function useAdminRolePermissionsMatrix(idOrName: string, enabled = true) {
  return useQuery({
    queryKey: adminKeys.rolePermissionsMatrix(idOrName),
    queryFn: () => adminApi.getRolePermissionsMatrix(idOrName),
    enabled: Boolean(idOrName) && enabled,
    staleTime: 30 * 1000,
  });
}

/**
 * Mutation: Update role permissions matrix.
 */
export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roleIdOrName,
      dto,
    }: {
      roleIdOrName: string;
      dto: UpdateRolePermissionsRequestDTO;
    }) => adminApi.updateRolePermissions(roleIdOrName, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.roles() });
      queryClient.invalidateQueries({ queryKey: adminKeys.roleDetail(variables.roleIdOrName) });
      queryClient.invalidateQueries({ queryKey: adminKeys.rolePermissionsMatrix(variables.roleIdOrName) });
      queryClient.invalidateQueries({ queryKey: adminKeys.permissions() });
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/**
 * Hook to fetch all available platform dashboard features.
 */
export function useAdminDashboardFeatures() {
  return useQuery({
    queryKey: adminKeys.dashboardFeatures(),
    queryFn: () => adminApi.getDashboardFeatures(),
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to fetch role dashboard features configuration matrix.
 */
export function useAdminRoleDashboardFeatures(idOrName: string, enabled = true) {
  return useQuery({
    queryKey: adminKeys.roleDashboardFeatures(idOrName),
    queryFn: () => adminApi.getRoleDashboardFeatures(idOrName),
    enabled: Boolean(idOrName) && enabled,
    staleTime: 30 * 1000,
  });
}

/**
 * Mutation: Update role dashboard features configuration.
 */
export function useUpdateRoleDashboardFeatures() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roleIdOrName,
      dto,
    }: {
      roleIdOrName: string;
      dto: UpdateRoleDashboardFeaturesRequestDTO;
    }) => adminApi.updateRoleDashboardFeatures(roleIdOrName, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.roles() });
      queryClient.invalidateQueries({ queryKey: adminKeys.roleDetail(variables.roleIdOrName) });
      queryClient.invalidateQueries({ queryKey: adminKeys.roleDashboardFeatures(variables.roleIdOrName) });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboardFeatures() });
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/**
 * Hook to fetch counsellor access management details.
 */
export function useAdminCounsellorAccess(id: string | null, enabled = true) {
  return useQuery({
    queryKey: adminKeys.counsellorAccess(id || ""),
    queryFn: () => adminApi.getCounsellorAccess(id || ""),
    enabled: Boolean(id) && enabled,
    staleTime: 15 * 1000,
  });
}

/**
 * Mutation: Update counsellor practitioner profile.
 */
export function useUpdateCounsellorProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      counsellorId,
      dto,
    }: {
      counsellorId: string;
      dto: UpdateCounsellorProfileRequestDTO;
    }) => adminApi.updateCounsellorProfile(counsellorId, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.counsellorAccess(variables.counsellorId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.counsellorApplications() });
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

/**
 * Mutation: Suspend counsellor account.
 */
export function useSuspendCounsellor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (counsellorId: string) => adminApi.suspendCounsellor(counsellorId),
    onSuccess: (_data, counsellorId) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.counsellorAccess(counsellorId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.counsellorApplications() });
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

/**
 * Mutation: Reactivate suspended counsellor account.
 */
export function useReactivateCounsellor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (counsellorId: string) => adminApi.reactivateCounsellor(counsellorId),
    onSuccess: (_data, counsellorId) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.counsellorAccess(counsellorId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.counsellorApplications() });
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

/**
 * Mutation: Delete or soft-deactivate counsellor application/account.
 */
export function useDeleteCounsellor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCounsellor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.counsellorApplications() });
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

/**
 * Mutation: Updates user basic profile (firstName, lastName).
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      dto,
    }: {
      userId: string;
      dto: UpdateUserProfileRequestDTO;
    }) => adminApi.updateUserProfile(userId, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.userDetail(variables.userId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/**
 * Mutation: Delete or soft-deactivate user account with dependency protection.
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.roles() });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/**
 * Mutation: Bulk delete or soft-deactivate user accounts with dependency protection.
 */
export function useBulkDeleteUsers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userIds: string[]) => adminApi.bulkDeleteUsers(userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.roles() });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/**
 * Mutation: Bulk update status for multiple user accounts.
 */
export function useBulkUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userIds, status }: { userIds: string[]; status: string }) =>
      adminApi.bulkUpdateUserStatus(userIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.roles() });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/**
 * Hook to fetch institution administrative overview metrics.
 */
export function useAdminInstitutionMetrics() {
  return useQuery({
    queryKey: adminKeys.institutionMetrics(),
    queryFn: () => adminApi.getInstitutionMetrics(),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch institution applications queue with filters.
 */
export function useAdminInstitutionApplications(filters?: AdminInstitutionFilterParams) {
  return useQuery({
    queryKey: adminKeys.institutionApplications(filters),
    queryFn: () => adminApi.getInstitutionApplications(filters),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch single institution application detail.
 */
export function useAdminInstitutionApplicationDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: adminKeys.institutionApplicationDetail(id),
    queryFn: () => adminApi.getInstitutionApplicationById(id),
    enabled: Boolean(id) && enabled,
    staleTime: 30 * 1000,
  });
}

/**
 * Mutation: Approve institution application atomically.
 */
export function useApproveInstitutionApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string;
      dto?: ApproveInstitutionApplicationRequestDTO;
    }) => adminApi.approveInstitutionApplication(id, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.institutionMetrics() });
      queryClient.invalidateQueries({ queryKey: adminKeys.institutionApplications() });
      queryClient.invalidateQueries({ queryKey: adminKeys.institutionApplicationDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.institutions() });
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/**
 * Mutation: Reject institution application with audit notes.
 */
export function useRejectInstitutionApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string;
      dto?: RejectInstitutionApplicationRequestDTO;
    }) => adminApi.rejectInstitutionApplication(id, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.institutionMetrics() });
      queryClient.invalidateQueries({ queryKey: adminKeys.institutionApplications() });
      queryClient.invalidateQueries({ queryKey: adminKeys.institutionApplicationDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.institutions() });
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/**
 * Mutation: Delete institution application.
 */
export function useDeleteInstitutionApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteInstitutionApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.institutionMetrics() });
      queryClient.invalidateQueries({ queryKey: adminKeys.institutionApplications() });
      queryClient.invalidateQueries({ queryKey: adminKeys.institutions() });
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

/**
 * Hook to fetch registered institutions list.
 */
export function useAdminInstitutions(filters?: AdminInstitutionFilterParams) {
  return useQuery({
    queryKey: adminKeys.institutions(filters),
    queryFn: () => adminApi.getInstitutions(filters),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch single institution detail with cohorts and students.
 */
export function useAdminInstitutionDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: adminKeys.institutionDetail(id),
    queryFn: () => adminApi.getInstitutionById(id),
    enabled: Boolean(id) && enabled,
    staleTime: 30 * 1000,
  });
}

/**
 * Mutation: Update institution status (activate/suspend).
 */
export function useUpdateInstitutionStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.updateInstitutionStatus(id, isActive),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.institutions() });
      queryClient.invalidateQueries({ queryKey: adminKeys.institutionDetail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.institutionMetrics() });
      queryClient.invalidateQueries({ queryKey: adminKeys.overview() });
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}




