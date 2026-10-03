import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";
import { env } from "../../config/env";
import { emailService } from "../email";
import { adminRepository } from "./admin.repository";
import {
  CounsellorApplicationItemDTO,
  ApproveApplicationRequestDTO,
  RejectApplicationRequestDTO,
  ApplicationDecisionResultDTO,
  PlatformOverviewResponseDTO,
  AdminUserListItemDTO,
  AdminUserFilterParams,
  AdminUserListResponseDTO,
  AdminUserDetailDTO,
  AdminRoleDetailDTO,
  AdminRoleListResponseDTO,
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
  BulkDeleteUsersRequestDTO,
  BulkDeleteUsersResultDTO,
  BulkUserStatusRequestDTO,
  BulkUserStatusResultDTO,
  InstitutionApplicationItemDTO,
  ApproveInstitutionApplicationRequestDTO,
  RejectInstitutionApplicationRequestDTO,
  InstitutionApplicationDecisionResultDTO,
  AdminInstitutionMetricsDTO,
  AdminInstitutionListItemDTO,
  AdminInstitutionDetailDTO,
  AdminInstitutionFilterParams,
  AdminCompanyListItemDTO,
  AdminCompanyDetailDTO,
  CreateAdminCompanyDTO,
  AdminAuditLogItemDTO,
} from "./admin.types";

export class AdminService {
  /**
   * Retrieves high-level aggregated platform overview statistics and recent activities.
   */
  async getPlatformOverview(): Promise<PlatformOverviewResponseDTO> {
    return adminRepository.getPlatformOverview();
  }

  /**
   * Retrieves list of counsellor applications.
   */
  async listCounsellorApplications(status?: string): Promise<CounsellorApplicationItemDTO[]> {
    return adminRepository.findApplications(status);
  }

  /**
   * Retrieves single counsellor application by ID or user ID.
   */
  async getCounsellorApplicationById(idOrUserId: string): Promise<CounsellorApplicationItemDTO> {
    const application = await adminRepository.findApplicationById(idOrUserId);
    if (!application) {
      throw AppError.notFound("Counsellor application not found.", "APPLICATION_NOT_FOUND");
    }
    return application;
  }

  /**
   * Atomically approves a pending counsellor application, promotes user to CAREER_COUNSELLOR,
   * activates the account, and registers the counsellors table entity.
   */
  async approveCounsellorApplication(
    adminUserId: string,
    applicationIdOrUserId: string,
    dto?: ApproveApplicationRequestDTO
  ): Promise<ApplicationDecisionResultDTO> {
    const result = await adminRepository.executeApprovalTransaction(adminUserId, applicationIdOrUserId, dto);

    // Non-blocking transactional email notification
    if (result.user?.email) {
      emailService
        .sendCounsellorApplicationApproved({
          to: result.user.email,
          applicantName: `${result.user.firstName} ${result.user.lastName}`.trim(),
          dashboardUrl: `${env.APP_URL || env.FRONTEND_URL}/counsellor/dashboard`,
        })
        .catch((err) => {
          logger.warn({ err, userId: result.user.id }, "Non-fatal: Failed to send counsellor approval email");
        });
    }

    return result;
  }

  /**
   * Rejects a pending counsellor application with review notes.
   */
  async rejectCounsellorApplication(
    adminUserId: string,
    applicationIdOrUserId: string,
    dto?: RejectApplicationRequestDTO
  ): Promise<ApplicationDecisionResultDTO> {
    const result = await adminRepository.executeRejectionTransaction(adminUserId, applicationIdOrUserId, dto);

    // Non-blocking transactional email notification
    if (result.application?.applicantEmail) {
      emailService
        .sendCounsellorApplicationRejected({
          to: result.application.applicantEmail,
          applicantName: result.application.applicantName,
          reason: result.application.reviewNotes || undefined,
        })
        .catch((err) => {
          logger.warn({ err, applicationId: result.application.id }, "Non-fatal: Failed to send counsellor rejection email");
        });
    }

    return result;
  }

  /**
   * Lists administrative users with search, role, status filters, and pagination.
   */
  async listUsers(filters?: AdminUserFilterParams): Promise<AdminUserListResponseDTO> {
    return adminRepository.findUsers(filters);
  }

  /**
   * Retrieves single administrative user detail by ID.
   */
  async getUserById(userId: string): Promise<AdminUserDetailDTO> {
    return adminRepository.findUserAdminDetail(userId);
  }

  /**
   * Updates user account status (ACTIVE, SUSPENDED, DISABLED, PENDING_VERIFICATION) with SUPER_ADMIN protection.
   */
  async updateUserStatus(
    adminUserId: string,
    targetUserId: string,
    status: string
  ): Promise<AdminUserListItemDTO> {
    return adminRepository.updateUserStatus(adminUserId, targetUserId, status);
  }

  /**
   * Updates user role assignment with SUPER_ADMIN protection.
   */
  async updateUserRole(
    adminUserId: string,
    targetUserId: string,
    role: string
  ): Promise<AdminUserListItemDTO> {
    return adminRepository.updateUserRole(adminUserId, targetUserId, role);
  }

  /**
   * Updates user profile names (firstName, lastName).
   */
  async updateUserProfile(
    adminUserId: string,
    targetUserId: string,
    data: UpdateUserProfileRequestDTO
  ): Promise<AdminUserDetailDTO> {
    return adminRepository.updateUserProfile(adminUserId, targetUserId, data);
  }

  /**
   * Safely deletes or deactivates a user account with dependency protection.
   */
  async deleteUser(
    adminUserId: string,
    targetUserId: string
  ): Promise<DeleteUserResultDTO> {
    return adminRepository.deleteUser(adminUserId, targetUserId);
  }

  /**
   * Atomically deletes or deactivates multiple user accounts with dependency protection.
   */
  async deleteUsersBulk(
    adminUserId: string,
    dto: BulkDeleteUsersRequestDTO
  ): Promise<BulkDeleteUsersResultDTO> {
    const userIds = dto?.userIds || [];
    return adminRepository.deleteUsersBulk(adminUserId, userIds);
  }

  /**
   * Bulk updates user status with Super Admin lockout safeguards.
   */
  async updateUsersStatusBulk(
    adminUserId: string,
    dto: BulkUserStatusRequestDTO
  ): Promise<BulkUserStatusResultDTO> {
    const userIds = dto?.userIds || [];
    const status = dto?.status || "ACTIVE";
    return adminRepository.updateUsersStatusBulk(adminUserId, userIds, status);
  }

  /**
   * Lists all canonical database roles with user and permission counts.
   */
  async listRoles(): Promise<AdminRoleListResponseDTO> {
    return adminRepository.findAllRoles();
  }

  /**
   * Retrieves single role details including assigned permissions and users.
   */
  async getRoleDetail(idOrName: string): Promise<AdminRoleDetailDTO> {
    const role = await adminRepository.findRoleByIdOrName(idOrName);
    if (!role) {
      throw AppError.notFound(`Role '${idOrName}' not found.`, "ROLE_NOT_FOUND");
    }
    return role;
  }

  /**
   * Lists all system permissions with category and roles count.
   */
  async listPermissions(): Promise<AdminPermissionListItemDTO[]> {
    return adminRepository.findAllPermissions();
  }

  /**
   * Retrieves complete system permission matrix for a specific role.
   */
  async getRolePermissionsMatrix(roleIdOrName: string): Promise<RolePermissionMatrixResponseDTO> {
    return adminRepository.findRolePermissionsMatrix(roleIdOrName);
  }

  /**
   * Updates permission assignments for a role with SUPER_ADMIN safeguards.
   */
  async updateRolePermissions(
    adminUser: { id: string; role: string },
    roleIdOrName: string,
    dto: UpdateRolePermissionsRequestDTO
  ): Promise<UpdateRolePermissionsResponseDTO> {
    // Only SUPER_ADMIN can configure permissions for administrative personas (SUPER_ADMIN, PLATFORM_ADMIN)
    const matrix = await adminRepository.findRolePermissionsMatrix(roleIdOrName);
    const targetRoleName = matrix.role.name;
    const isTargetAdmin = targetRoleName === "SUPER_ADMIN" || targetRoleName === "PLATFORM_ADMIN";

    if (isTargetAdmin && adminUser.role !== "SUPER_ADMIN") {
      throw AppError.forbidden(
        "Only Super Administrators can configure permissions for administrative roles.",
        "INSUFFICIENT_PRIVILEGE"
      );
    }

    const requestedKeys = dto.permissionIds || dto.permissionNames || [];
    return adminRepository.updateRolePermissions(adminUser.id, roleIdOrName, requestedKeys);
  }

  /**
   * Lists all available system dashboard features.
   */
  async listDashboardFeatures(): Promise<DashboardFeatureItemDTO[]> {
    return adminRepository.findAllDashboardFeatures();
  }

  /**
   * Retrieves role dashboard features configuration with permission status.
   */
  async getRoleDashboardFeatures(roleIdOrName: string): Promise<RoleDashboardFeaturesResponseDTO> {
    return adminRepository.findRoleDashboardFeatures(roleIdOrName);
  }

  /**
   * Updates dashboard features for a role with administrative safety checks.
   */
  async updateRoleDashboardFeatures(
    adminUser: { id: string; role: string },
    roleIdOrName: string,
    dto: UpdateRoleDashboardFeaturesRequestDTO
  ): Promise<UpdateRoleDashboardFeaturesResponseDTO> {
    const matrix = await adminRepository.findRoleDashboardFeatures(roleIdOrName);
    const targetRoleName = matrix.role.name;
    const isTargetAdmin = targetRoleName === "SUPER_ADMIN" || targetRoleName === "PLATFORM_ADMIN";

    if (isTargetAdmin && adminUser.role !== "SUPER_ADMIN") {
      throw AppError.forbidden(
        "Only Super Administrators can configure dashboard features for administrative roles.",
        "INSUFFICIENT_PRIVILEGE"
      );
    }

    const featureMap = dto.features || {};
    return adminRepository.updateRoleDashboardFeatures(adminUser.id, roleIdOrName, featureMap);
  }

  /**
   * Retrieves complete access details for a counsellor.
   */
  async getCounsellorAccess(idOrUserId: string): Promise<AdminCounsellorAccessDTO> {
    return adminRepository.findCounsellorAccess(idOrUserId);
  }

  /**
   * Updates counsellor practitioner profile across identity and domain records.
   */
  async updateCounsellorProfile(
    adminUserId: string,
    idOrUserId: string,
    dto: UpdateCounsellorProfileRequestDTO
  ): Promise<AdminCounsellorAccessDTO> {
    return adminRepository.updateCounsellorProfile(adminUserId, idOrUserId, dto);
  }

  /**
   * Suspends counsellor account, revoking active sessions.
   */
  async suspendCounsellor(adminUserId: string, idOrUserId: string): Promise<AdminUserListItemDTO> {
    return adminRepository.suspendCounsellor(adminUserId, idOrUserId);
  }

  /**
   * Reactivates a suspended counsellor account.
   */
  async reactivateCounsellor(adminUserId: string, idOrUserId: string): Promise<AdminUserListItemDTO> {
    return adminRepository.reactivateCounsellor(adminUserId, idOrUserId);
  }

  /**
   * Safely deletes an application or deactivates an approved counsellor account with dependency protection.
   */
  async deleteOrDeactivateCounsellor(
    adminUserId: string,
    idOrUserId: string
  ): Promise<DeleteCounsellorResultDTO> {
    return adminRepository.deleteOrDeactivateCounsellor(adminUserId, idOrUserId);
  }

  // ==========================================
  // INSTITUTION / SCHOOL MANAGEMENT SERVICE
  // ==========================================

  /**
   * Retrieves summary statistics for institution applications and directory.
   */
  async getInstitutionMetrics(): Promise<AdminInstitutionMetricsDTO> {
    return adminRepository.getInstitutionMetrics();
  }

  /**
   * Lists all institution applications with optional status & search filter.
   */
  async listInstitutionApplications(
    status?: string,
    search?: string
  ): Promise<InstitutionApplicationItemDTO[]> {
    return adminRepository.findInstitutionApplications(status, search);
  }

  /**
   * Retrieves single institution application detail by ID.
   */
  async getInstitutionApplicationById(
    applicationId: string
  ): Promise<InstitutionApplicationItemDTO> {
    return adminRepository.findInstitutionApplicationById(applicationId);
  }

  /**
   * Approves an institution application, creating the institution record and admin user account.
   */
  async approveInstitutionApplication(
    adminUserId: string,
    applicationId: string,
    dto?: ApproveInstitutionApplicationRequestDTO
  ): Promise<InstitutionApplicationDecisionResultDTO> {
    const result = await adminRepository.executeInstitutionApprovalTransaction(adminUserId, applicationId, dto);

    // Non-blocking transactional email notification
    if (result.adminUser?.email && result.institution) {
      emailService
        .sendInstitutionApplicationApproved({
          to: result.adminUser.email,
          contactName: `${result.adminUser.firstName} ${result.adminUser.lastName}`.trim(),
          institutionName: result.institution.name,
          institutionCode: result.institution.code,
          temporaryPassword: dto?.temporaryPassword || "Password123!",
          loginUrl: `${env.APP_URL || env.FRONTEND_URL}/login`,
        })
        .catch((err) => {
          logger.warn({ err, institutionId: result.institution?.id }, "Non-fatal: Failed to send institution approval email");
        });
    }

    return result;
  }

  /**
   * Rejects an institution application with documented review notes.
   */
  async rejectInstitutionApplication(
    adminUserId: string,
    applicationId: string,
    dto?: RejectInstitutionApplicationRequestDTO
  ): Promise<InstitutionApplicationDecisionResultDTO> {
    const result = await adminRepository.executeInstitutionRejectionTransaction(adminUserId, applicationId, dto);

    // Non-blocking transactional email notification
    if (result.application?.officialEmail) {
      emailService
        .sendInstitutionApplicationRejected({
          to: result.application.officialEmail,
          contactName: result.application.contactName || "Administrator",
          institutionName: result.application.institutionName,
          reason: result.application.reviewNotes || undefined,
        })
        .catch((err) => {
          logger.warn({ err, applicationId: result.application.id }, "Non-fatal: Failed to send institution rejection email");
        });
    }

    return result;
  }

  /**
   * Lists all approved educational institutions with aggregate student and cohort counts.
   */
  async listInstitutions(
    filters?: AdminInstitutionFilterParams
  ): Promise<AdminInstitutionListItemDTO[]> {
    return adminRepository.findInstitutions(filters);
  }

  /**
   * Retrieves complete institution detail, cohorts, recent students, and completion metrics.
   */
  async getInstitutionById(
    institutionId: string
  ): Promise<AdminInstitutionDetailDTO> {
    return adminRepository.findInstitutionAdminDetail(institutionId);
  }

  /**
   * Toggles institution active/suspended status and linked admin user status.
   */
  async updateInstitutionStatus(
    adminUserId: string,
    institutionId: string,
    isActive: boolean
  ): Promise<{ id: string; name: string; isActive: boolean }> {
    return adminRepository.updateInstitutionStatus(adminUserId, institutionId, isActive);
  }

  /**
   * Deletes an institution application record.
   */
  async deleteInstitutionApplication(applicationId: string): Promise<void> {
    return adminRepository.deleteInstitutionApplication(applicationId);
  }

  /**
   * Retrieves list of registered platform companies.
   */
  async listCompanies(filters?: { search?: string; status?: string }): Promise<AdminCompanyListItemDTO[]> {
    return adminRepository.findCompanies(filters);
  }

  /**
   * Retrieves detailed company profile, members, and institutions.
   */
  async getCompanyById(companyId: string): Promise<AdminCompanyDetailDTO> {
    return adminRepository.findCompanyById(companyId);
  }

  /**
   * Creates a new company organization.
   */
  async createCompany(dto: CreateAdminCompanyDTO): Promise<AdminCompanyListItemDTO> {
    return adminRepository.createCompany(dto);
  }

  /**
   * Toggles company status.
   */
  async updateCompanyStatus(companyId: string, status: "ACTIVE" | "PENDING" | "SUSPENDED"): Promise<void> {
    return adminRepository.updateCompanyStatus(companyId, status);
  }

  /**
   * Retrieves platform audit log records.
   */
  async listAuditLogs(): Promise<AdminAuditLogItemDTO[]> {
    return adminRepository.findAuditLogs();
  }
}

export const adminService = new AdminService();





