import { fetchApi } from "@/services/api/client";
import {
  PlatformOverviewResponseDTO,
  CounsellorApplicationItemDTO,
  ApproveApplicationRequestDTO,
  RejectApplicationRequestDTO,
  ApplicationDecisionResultDTO,
  AdminUserListResponseDTO,
  AdminUserFilterParams,
  AdminUserDetailDTO,
  AdminUserListItemDTO,
  AdminRoleListResponseDTO,
  AdminRoleDetailDTO,
  AdminPermissionListItemDTO,
  RolePermissionMatrixResponseDTO,
  UpdateRolePermissionsRequestDTO,
  UpdateRolePermissionsResponseDTO,
  DashboardFeatureItemDTO,
  RoleDashboardFeaturesResponseDTO,
  UpdateRoleDashboardFeaturesRequestDTO,
  UpdateRoleDashboardFeaturesResponseDTO,
  AdminCounsellorAccessDTO,
  UpdateCounsellorProfileRequestDTO,
  DeleteCounsellorResultDTO,
  UpdateUserProfileRequestDTO,
  DeleteUserResultDTO,
  BulkDeleteUsersResultDTO,
  BulkUserStatusResultDTO,
  InstitutionApplicationItemDTO,
  ApproveInstitutionApplicationRequestDTO,
  RejectInstitutionApplicationRequestDTO,
  InstitutionApplicationDecisionResultDTO,
  AdminInstitutionMetricsDTO,
  AdminInstitutionListItemDTO,
  AdminInstitutionDetailDTO,
  AdminInstitutionFilterParams,
} from "../types/admin.types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const adminApi = {
  /**
   * Fetches real-time platform administrative overview metrics, recent users, and recent applications.
   * Endpoint: GET /api/v1/admin/overview
   */
  async getPlatformOverview(): Promise<PlatformOverviewResponseDTO> {
    const res = await fetchApi<ApiResponse<PlatformOverviewResponseDTO>>("/admin/overview");
    return res.data;
  },

  /**
   * Fetches counsellor applications queue with optional status filter.
   * Endpoint: GET /api/v1/admin/counsellor-applications
   */
  async getCounsellorApplications(status?: string): Promise<CounsellorApplicationItemDTO[]> {
    const query = status && status.toUpperCase() !== "ALL" ? `?status=${status.toUpperCase()}` : "";
    const res = await fetchApi<ApiResponse<CounsellorApplicationItemDTO[]>>(`/admin/counsellor-applications${query}`);
    return res.data || [];
  },

  /**
   * Fetches single counsellor application detail by ID.
   * Endpoint: GET /api/v1/admin/counsellor-applications/:id
   */
  async getCounsellorApplicationById(applicationId: string): Promise<CounsellorApplicationItemDTO> {
    const res = await fetchApi<ApiResponse<CounsellorApplicationItemDTO>>(
      `/admin/counsellor-applications/${applicationId}`
    );
    return res.data;
  },

  /**
   * Approves a counsellor application and assigns practitioner credentials.
   * Endpoint: POST /api/v1/admin/counsellor-applications/:id/approve
   */
  async approveCounsellorApplication(
    applicationId: string,
    dto?: ApproveApplicationRequestDTO
  ): Promise<ApplicationDecisionResultDTO> {
    const res = await fetchApi<ApiResponse<ApplicationDecisionResultDTO>>(
      `/admin/counsellor-applications/${applicationId}/approve`,
      {
        method: "POST",
        body: JSON.stringify(dto || {}),
      }
    );
    return res.data;
  },

  /**
   * Rejects a counsellor application with documented audit reason.
   * Endpoint: POST /api/v1/admin/counsellor-applications/:id/reject
   */
  async rejectCounsellorApplication(
    applicationId: string,
    dto?: RejectApplicationRequestDTO
  ): Promise<ApplicationDecisionResultDTO> {
    const res = await fetchApi<ApiResponse<ApplicationDecisionResultDTO>>(
      `/admin/counsellor-applications/${applicationId}/reject`,
      {
        method: "POST",
        body: JSON.stringify(dto || {}),
      }
    );
    return res.data;
  },

  /**
   * Fetches paginated users list with search, role, status filters, and sorting.
   * Endpoint: GET /api/v1/admin/users
   */
  async getUsers(filters?: AdminUserFilterParams): Promise<AdminUserListResponseDTO> {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));
    if (filters?.search) params.append("search", filters.search);
    if (filters?.role && filters.role !== "ALL") params.append("role", filters.role);
    if (filters?.status && filters.status !== "ALL") params.append("status", filters.status);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetchApi<ApiResponse<AdminUserListResponseDTO>>(`/admin/users${query}`);
    return res.data;
  },

  /**
   * Fetches detailed administrative user profile.
   * Endpoint: GET /api/v1/admin/users/:id
   */
  async getUserById(userId: string): Promise<AdminUserDetailDTO> {
    const res = await fetchApi<ApiResponse<AdminUserDetailDTO>>(`/admin/users/${userId}`);
    return res.data;
  },

  /**
   * Updates user account status (ACTIVE, SUSPENDED, DISABLED, PENDING_VERIFICATION).
   * Endpoint: PATCH /api/v1/admin/users/:id/status
   */
  async updateUserStatus(userId: string, status: string): Promise<AdminUserListItemDTO> {
    const res = await fetchApi<ApiResponse<AdminUserListItemDTO>>(`/admin/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return res.data;
  },

  /**
   * Updates user role assignment with SUPER_ADMIN safeguards.
   * Endpoint: PATCH /api/v1/admin/users/:id/role
   */
  async updateUserRole(userId: string, role: string): Promise<AdminUserListItemDTO> {
    const res = await fetchApi<ApiResponse<AdminUserListItemDTO>>(`/admin/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    return res.data;
  },
  /**
   * Updates user profile names (firstName, lastName).
   * Endpoint: PATCH /api/v1/admin/users/:id
   */
  async updateUserProfile(userId: string, dto: UpdateUserProfileRequestDTO): Promise<AdminUserDetailDTO> {
    const res = await fetchApi<ApiResponse<AdminUserDetailDTO>>(`/admin/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  /**
   * Safely deletes or disables a user account with dependency protection.
   * Endpoint: DELETE /api/v1/admin/users/:id
   */
  async deleteUser(userId: string): Promise<DeleteUserResultDTO> {
    const res = await fetchApi<ApiResponse<DeleteUserResultDTO>>(`/admin/users/${userId}`, {
      method: "DELETE",
    });
    return res.data;
  },

  /**
   * Safely deletes or disables multiple user accounts in batch with dependency protection.
   * Endpoint: POST /api/v1/admin/users/bulk-delete
   */
  async bulkDeleteUsers(userIds: string[]): Promise<BulkDeleteUsersResultDTO> {
    const res = await fetchApi<ApiResponse<BulkDeleteUsersResultDTO>>("/admin/users/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ userIds }),
    });
    return res.data;
  },

  /**
   * Bulk updates account status for multiple users (ACTIVE, SUSPENDED, DISABLED, PENDING_VERIFICATION).
   * Endpoint: PATCH /api/v1/admin/users/bulk-status
   */
  async bulkUpdateUserStatus(userIds: string[], status: string): Promise<BulkUserStatusResultDTO> {
    const res = await fetchApi<ApiResponse<BulkUserStatusResultDTO>>("/admin/users/bulk-status", {
      method: "PATCH",
      body: JSON.stringify({ userIds, status }),
    });
    return res.data;
  },

  /**
   * Fetches all canonical database roles with user and permission counts.
   * Endpoint: GET /api/v1/admin/roles
   */
  async getRoles(): Promise<AdminRoleListResponseDTO> {
    const res = await fetchApi<ApiResponse<AdminRoleListResponseDTO>>("/admin/roles");
    return res.data;
  },

  /**
   * Fetches single role details including assigned permissions and assigned users.
   * Endpoint: GET /api/v1/admin/roles/:id
   */
  async getRoleDetail(idOrName: string): Promise<AdminRoleDetailDTO> {
    const res = await fetchApi<ApiResponse<AdminRoleDetailDTO>>(`/admin/roles/${idOrName}`);
    return res.data;
  },

  /**
   * Fetches all system permissions with category and roles count.
   * Endpoint: GET /api/v1/admin/permissions
   */
  async getPermissions(): Promise<AdminPermissionListItemDTO[]> {
    const res = await fetchApi<ApiResponse<AdminPermissionListItemDTO[]>>("/admin/permissions");
    return res.data || [];
  },

  /**
   * Fetches complete system permission matrix for a specific role.
   * Endpoint: GET /api/v1/admin/roles/:id/permissions
   */
  async getRolePermissionsMatrix(roleIdOrName: string): Promise<RolePermissionMatrixResponseDTO> {
    const res = await fetchApi<ApiResponse<RolePermissionMatrixResponseDTO>>(
      `/admin/roles/${roleIdOrName}/permissions`
    );
    return res.data;
  },

  /**
   * Updates permission assignments for a specific role.
   * Endpoint: PUT /api/v1/admin/roles/:id/permissions
   */
  async updateRolePermissions(
    roleIdOrName: string,
    dto: UpdateRolePermissionsRequestDTO
  ): Promise<UpdateRolePermissionsResponseDTO> {
    const res = await fetchApi<ApiResponse<UpdateRolePermissionsResponseDTO>>(
      `/admin/roles/${roleIdOrName}/permissions`,
      {
        method: "PUT",
        body: JSON.stringify(dto),
      }
    );
    return res.data;
  },

  /**
   * Fetches all registered system dashboard features.
   * Endpoint: GET /api/v1/admin/dashboard-features
   */
  async getDashboardFeatures(): Promise<DashboardFeatureItemDTO[]> {
    const res = await fetchApi<ApiResponse<DashboardFeatureItemDTO[]>>("/admin/dashboard-features");
    return res.data || [];
  },

  /**
   * Fetches complete role dashboard features configuration matrix.
   * Endpoint: GET /api/v1/admin/roles/:id/dashboard-features
   */
  async getRoleDashboardFeatures(roleIdOrName: string): Promise<RoleDashboardFeaturesResponseDTO> {
    const res = await fetchApi<ApiResponse<RoleDashboardFeaturesResponseDTO>>(
      `/admin/roles/${roleIdOrName}/dashboard-features`
    );
    return res.data;
  },

  /**
   * Updates dashboard features configuration for a role.
   * Endpoint: PUT /api/v1/admin/roles/:id/dashboard-features
   */
  async updateRoleDashboardFeatures(
    roleIdOrName: string,
    dto: UpdateRoleDashboardFeaturesRequestDTO
  ): Promise<UpdateRoleDashboardFeaturesResponseDTO> {
    const res = await fetchApi<ApiResponse<UpdateRoleDashboardFeaturesResponseDTO>>(
      `/admin/roles/${roleIdOrName}/dashboard-features`,
      {
        method: "PUT",
        body: JSON.stringify(dto),
      }
    );
    return res.data;
  },

  /**
   * Fetches counsellor access management details (features, permissions, profile).
   * Endpoint: GET /api/v1/admin/counsellors/:id/access
   */
  async getCounsellorAccess(counsellorId: string): Promise<AdminCounsellorAccessDTO> {
    const res = await fetchApi<ApiResponse<AdminCounsellorAccessDTO>>(
      `/admin/counsellors/${counsellorId}/access`
    );
    return res.data;
  },

  /**
   * Updates counsellor practitioner profile across identity and domain records.
   * Endpoint: PUT /api/v1/admin/counsellors/:id/profile
   */
  async updateCounsellorProfile(
    counsellorId: string,
    dto: UpdateCounsellorProfileRequestDTO
  ): Promise<AdminCounsellorAccessDTO> {
    const res = await fetchApi<ApiResponse<AdminCounsellorAccessDTO>>(
      `/admin/counsellors/${counsellorId}/profile`,
      {
        method: "PUT",
        body: JSON.stringify(dto),
      }
    );
    return res.data;
  },

  /**
   * Suspends a counsellor account and revokes active sessions.
   * Endpoint: POST /api/v1/admin/counsellors/:id/suspend
   */
  async suspendCounsellor(counsellorId: string): Promise<AdminUserListItemDTO> {
    const res = await fetchApi<ApiResponse<AdminUserListItemDTO>>(
      `/admin/counsellors/${counsellorId}/suspend`,
      {
        method: "POST",
      }
    );
    return res.data;
  },

  /**
   * Reactivates a suspended counsellor account.
   * Endpoint: POST /api/v1/admin/counsellors/:id/reactivate
   */
  async reactivateCounsellor(counsellorId: string): Promise<AdminUserListItemDTO> {
    const res = await fetchApi<ApiResponse<AdminUserListItemDTO>>(
      `/admin/counsellors/${counsellorId}/reactivate`,
      {
        method: "POST",
      }
    );
    return res.data;
  },

  /**
   * Safely deletes an application or deactivates an approved counsellor with dependency protection.
   * Endpoint: DELETE /api/v1/admin/counsellors/:id
   */
  async deleteCounsellor(id: string): Promise<DeleteCounsellorResultDTO> {
    const res = await fetchApi<ApiResponse<DeleteCounsellorResultDTO>>(
      `/admin/counsellors/${id}`,
      {
        method: "DELETE",
      }
    );
    return res.data;
  },

  /**
   * Fetches institution administrative metrics.
   * Endpoint: GET /api/v1/admin/institutions/metrics
   */
  async getInstitutionMetrics(): Promise<AdminInstitutionMetricsDTO> {
    const res = await fetchApi<ApiResponse<AdminInstitutionMetricsDTO>>("/admin/institutions/metrics");
    return res.data;
  },

  /**
   * Fetches institution applications list with filters.
   * Endpoint: GET /api/v1/admin/institutions/applications
   */
  async getInstitutionApplications(filters?: AdminInstitutionFilterParams): Promise<InstitutionApplicationItemDTO[]> {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "ALL") params.append("status", filters.status);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetchApi<ApiResponse<InstitutionApplicationItemDTO[]>>(
      `/admin/institutions/applications${query}`
    );
    return res.data || [];
  },

  /**
   * Fetches single institution application by ID.
   * Endpoint: GET /api/v1/admin/institutions/applications/:id
   */
  async getInstitutionApplicationById(id: string): Promise<InstitutionApplicationItemDTO> {
    const res = await fetchApi<ApiResponse<InstitutionApplicationItemDTO>>(
      `/admin/institutions/applications/${id}`
    );
    return res.data;
  },

  /**
   * Approves an institution application atomically (creates user, institution, initial cohorts, features).
   * Endpoint: POST /api/v1/admin/institutions/applications/:id/approve
   */
  async approveInstitutionApplication(
    id: string,
    dto?: ApproveInstitutionApplicationRequestDTO
  ): Promise<InstitutionApplicationDecisionResultDTO> {
    const res = await fetchApi<ApiResponse<InstitutionApplicationDecisionResultDTO>>(
      `/admin/institutions/applications/${id}/approve`,
      {
        method: "POST",
        body: JSON.stringify(dto || {}),
      }
    );
    return res.data;
  },

  /**
   * Rejects an institution application with audit notes.
   * Endpoint: POST /api/v1/admin/institutions/applications/:id/reject
   */
  async rejectInstitutionApplication(
    id: string,
    dto?: RejectInstitutionApplicationRequestDTO
  ): Promise<InstitutionApplicationDecisionResultDTO> {
    const res = await fetchApi<ApiResponse<InstitutionApplicationDecisionResultDTO>>(
      `/admin/institutions/applications/${id}/reject`,
      {
        method: "POST",
        body: JSON.stringify(dto || {}),
      }
    );
    return res.data;
  },

  /**
   * Deletes an institution application.
   * Endpoint: DELETE /api/v1/admin/institutions/applications/:id
   */
  async deleteInstitutionApplication(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetchApi<ApiResponse<{ success: boolean; message: string }>>(
      `/admin/institutions/applications/${id}`,
      {
        method: "DELETE",
      }
    );
    return res.data;
  },

  /**
   * Fetches registered institutions list with metrics.
   * Endpoint: GET /api/v1/admin/institutions
   */
  async getInstitutions(filters?: AdminInstitutionFilterParams): Promise<AdminInstitutionListItemDTO[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.status && filters.status !== "ALL") params.append("status", filters.status);
    if (filters?.type && filters.type !== "ALL") params.append("type", filters.type);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));

    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetchApi<ApiResponse<AdminInstitutionListItemDTO[]>>(
      `/admin/institutions${query}`
    );
    return res.data || [];
  },

  /**
   * Fetches single institution detailed breakdown (cohorts, students, completion).
   * Endpoint: GET /api/v1/admin/institutions/:id
   */
  async getInstitutionById(id: string): Promise<AdminInstitutionDetailDTO> {
    const res = await fetchApi<ApiResponse<AdminInstitutionDetailDTO>>(
      `/admin/institutions/${id}`
    );
    return res.data;
  },

  /**
   * Updates institution active / suspended status.
   * Endpoint: PATCH /api/v1/admin/institutions/:id/status
   */
  async updateInstitutionStatus(id: string, isActive: boolean): Promise<AdminInstitutionListItemDTO> {
    const res = await fetchApi<ApiResponse<AdminInstitutionListItemDTO>>(
      `/admin/institutions/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      }
    );
    return res.data;
  },
};




