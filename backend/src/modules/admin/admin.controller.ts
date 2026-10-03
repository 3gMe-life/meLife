import { Request, Response, NextFunction } from "express";
import { AppError } from "../../common/errors/app-error";
import { HttpStatus } from "../../common/constants/http-status";
import { adminService } from "./admin.service";

export class AdminController {
  /**
   * GET /api/v1/admin/overview
   * Retrieves aggregated platform metrics and recent registrations/applications.
   */
  async getPlatformOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const overview = await adminService.getPlatformOverview();

      res.status(HttpStatus.OK).json({
        success: true,
        data: overview,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/counsellor-applications
   * Lists all counsellor applications, optionally filtered by status (PENDING, APPROVED, REJECTED, ALL).
   */
  async listCounsellorApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = req.query.status as string;
      const applications = await adminService.listCounsellorApplications(status);

      res.status(HttpStatus.OK).json({
        success: true,
        data: applications,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/counsellor-applications/:id
   * Retrieves single application by application UUID or applicant user UUID.
   */
  async getCounsellorApplicationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const applicationId = String(req.params.id);
      const application = await adminService.getCounsellorApplicationById(applicationId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: application,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/admin/counsellor-applications/:id/approve
   * Approves a pending counsellor application atomically.
   */
  async approveCounsellorApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const applicationId = String(req.params.id);
      const result = await adminService.approveCounsellorApplication(
        req.user.id,
        applicationId,
        req.body
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/admin/counsellor-applications/:id/reject
   * Rejects a pending counsellor application with review notes.
   */
  async rejectCounsellorApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const applicationId = String(req.params.id);
      const result = await adminService.rejectCounsellorApplication(
        req.user.id,
        applicationId,
        req.body
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/users
   * Lists administrative users with search, role, status filters, and pagination.
   */
  async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, role, status, sortBy, sortOrder } = req.query;
      const result = await adminService.listUsers({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: typeof search === "string" ? search : undefined,
        role: typeof role === "string" ? role : undefined,
        status: typeof status === "string" ? status : undefined,
        sortBy: typeof sortBy === "string" ? sortBy : undefined,
        sortOrder: typeof sortOrder === "string" ? sortOrder : undefined,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/users/:id
   * Retrieves single administrative user detail with assigned roles, permissions, and profile context.
   */
  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = String(req.params.id);
      const user = await adminService.getUserById(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/admin/users/:id/status
   * Updates user account status (ACTIVE, SUSPENDED, DISABLED, PENDING_VERIFICATION) with safeguards.
   */
  async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const targetUserId = String(req.params.id);
      const { status } = req.body;
      if (!status) {
        throw AppError.badRequest("Missing required status field.");
      }

      const updatedUser = await adminService.updateUserStatus(
        req.user.id,
        targetUserId,
        String(status)
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: `User status successfully updated to ${updatedUser.status}.`,
        data: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/admin/users/:id/role
   * Updates user role assignment with SUPER_ADMIN safeguards.
   */
  async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const targetUserId = String(req.params.id);
      const { role } = req.body;
      if (!role) {
        throw AppError.badRequest("Missing required role field.");
      }

      // Check if non-SUPER_ADMIN is trying to grant SUPER_ADMIN or PLATFORM_ADMIN
      const isSuperAdmin = req.user.role === "SUPER_ADMIN";
      const normalizedRole = String(role).toUpperCase();
      if ((normalizedRole === "SUPER_ADMIN" || normalizedRole === "PLATFORM_ADMIN") && !isSuperAdmin) {
        throw AppError.forbidden(
          "Only Super Administrators can assign administrative privileged roles.",
          "INSUFFICIENT_PRIVILEGE"
        );
      }

      const updatedUser = await adminService.updateUserRole(
        req.user.id,
        targetUserId,
        normalizedRole
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: `User role successfully updated to ${updatedUser.role}.`,
        data: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/admin/users/:id
   * Updates administrative user profile names (first name, last name).
   */
  async updateUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }
      const targetUserId = String(req.params.id);
      const { firstName, lastName } = req.body;
      const updatedUser = await adminService.updateUserProfile(req.user.id, targetUserId, {
        firstName: typeof firstName === "string" ? firstName : undefined,
        lastName: typeof lastName === "string" ? lastName : undefined,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "User profile updated successfully.",
        data: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/v1/admin/users/:id
   * Safely deletes or disables a user account with dependency protection.
   */
  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }
      const targetUserId = String(req.params.id);
      const result = await adminService.deleteUser(req.user.id, targetUserId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/admin/users/bulk-delete
   * Atomically deletes or deactivates multiple user accounts with dependency protection.
   */
  async deleteUsersBulk(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }
      const userIds = req.body?.userIds || [];
      const result = await adminService.deleteUsersBulk(req.user.id, { userIds });

      res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/admin/users/bulk-status
   * Bulk updates status for multiple user accounts.
   */
  async updateUsersStatusBulk(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }
      const userIds = req.body?.userIds || [];
      const status = req.body?.status;
      const result = await adminService.updateUsersStatusBulk(req.user.id, { userIds, status });

      res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/roles
   * Lists all canonical platform roles with aggregated user and permission counts.
   */
  async listRoles(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await adminService.listRoles();

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/roles/:id
   * Retrieves single role details including assigned permissions and assigned users.
   */
  async getRoleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roleIdOrName = String(req.params.id);
      const role = await adminService.getRoleDetail(roleIdOrName);

      res.status(HttpStatus.OK).json({
        success: true,
        data: role,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/permissions
   * Lists all system permissions with category and roles count.
   */
  async listPermissions(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const permissions = await adminService.listPermissions();

      res.status(HttpStatus.OK).json({
        success: true,
        data: permissions,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/roles/:id/permissions
   * Retrieves complete system permission matrix for a specific role.
   */
  async getRolePermissionsMatrix(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roleIdOrName = String(req.params.id);
      const matrix = await adminService.getRolePermissionsMatrix(roleIdOrName);

      res.status(HttpStatus.OK).json({
        success: true,
        data: matrix,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/v1/admin/roles/:id/permissions
   * Updates permission assignments for a specific role with strict SUPER_ADMIN protection.
   */
  async updateRolePermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const roleIdOrName = String(req.params.id);
      const result = await adminService.updateRolePermissions(
        { id: req.user.id, role: req.user.role },
        roleIdOrName,
        req.body
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/dashboard-features
   * Lists all available system dashboard features.
   */
  async listDashboardFeatures(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const features = await adminService.listDashboardFeatures();

      res.status(HttpStatus.OK).json({
        success: true,
        data: features,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/roles/:id/dashboard-features
   * Retrieves dashboard features matrix for a specific role with permission status.
   */
  async getRoleDashboardFeatures(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roleIdOrName = String(req.params.id);
      const matrix = await adminService.getRoleDashboardFeatures(roleIdOrName);

      res.status(HttpStatus.OK).json({
        success: true,
        data: matrix,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/v1/admin/roles/:id/dashboard-features
   * Updates dashboard features for a role with SUPER_ADMIN safeguards.
   */
  async updateRoleDashboardFeatures(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const roleIdOrName = String(req.params.id);
      const result = await adminService.updateRoleDashboardFeatures(
        { id: req.user.id, role: req.user.role },
        roleIdOrName,
        req.body
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/counsellors/:id/access
   * Retrieves complete access management details for a counsellor.
   */
  async getCounsellorAccess(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const counsellorId = String(req.params.id);
      const access = await adminService.getCounsellorAccess(counsellorId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: access,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/v1/admin/counsellors/:id/profile
   * Updates counsellor practitioner profile across identity and domain records.
   */
  async updateCounsellorProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const counsellorId = String(req.params.id);
      const result = await adminService.updateCounsellorProfile(
        req.user.id,
        counsellorId,
        req.body
      );

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Counsellor profile updated successfully.",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/admin/counsellors/:id/suspend
   * Suspends a counsellor account and revokes active sessions.
   */
  async suspendCounsellor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const counsellorId = String(req.params.id);
      const user = await adminService.suspendCounsellor(req.user.id, counsellorId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Counsellor account has been suspended.",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/admin/counsellors/:id/reactivate
   * Reactivates a suspended counsellor account.
   */
  async reactivateCounsellor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const counsellorId = String(req.params.id);
      const user = await adminService.reactivateCounsellor(req.user.id, counsellorId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Counsellor account has been reactivated.",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/v1/admin/counsellor-applications/:id
   * Safely deletes an application or deactivates an approved counsellor with dependency protection.
   */
  async deleteCounsellorApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }

      const id = String(req.params.id);
      const result = await adminService.deleteOrDeactivateCounsellor(req.user.id, id);

      res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  // ==========================================
  // INSTITUTION / SCHOOL MANAGEMENT CONTROLLERS
  // ==========================================

  /**
   * GET /api/v1/admin/institutions/metrics
   * Returns top summary metrics for institution applications & directory.
   */
  async getInstitutionMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }
      const metrics = await adminService.getInstitutionMetrics();
      res.status(HttpStatus.OK).json({
        success: true,
        data: metrics,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/institutions/applications
   * Lists all institution applications with optional status & search filter.
   */
  async listInstitutionApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }
      const status = req.query.status as string;
      const search = req.query.search as string;
      const applications = await adminService.listInstitutionApplications(status, search);
      res.status(HttpStatus.OK).json({
        success: true,
        data: applications,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/institutions/applications/:id
   * Retrieves single institution application detail.
   */
  async getInstitutionApplicationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }
      const applicationId = String(req.params.id);
      const application = await adminService.getInstitutionApplicationById(applicationId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: application,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/admin/institutions/applications/:id/approve
   * Approves an institution application, provisions user account and institution portal.
   */
  async approveInstitutionApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }
      const applicationId = String(req.params.id);
      const result = await adminService.approveInstitutionApplication(req.user.id, applicationId, req.body);
      res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/admin/institutions/applications/:id/reject
   * Rejects an institution application with audit notes.
   */
  async rejectInstitutionApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }
      const applicationId = String(req.params.id);
      const result = await adminService.rejectInstitutionApplication(req.user.id, applicationId, req.body);
      res.status(HttpStatus.OK).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/institutions
   * Lists approved educational institutions with aggregate student counts.
   */
  async listInstitutions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }
      const search = req.query.search as string;
      const status = req.query.status as string;
      const type = req.query.type as string;
      const institutions = await adminService.listInstitutions({ search, status, type });
      res.status(HttpStatus.OK).json({
        success: true,
        data: institutions,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/institutions/:id
   * Retrieves single approved institution detail with class cohorts and students.
   */
  async getInstitutionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }
      const institutionId = String(req.params.id);
      const detail = await adminService.getInstitutionById(institutionId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: detail,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/admin/institutions/:id/status
   * Toggles institution active/suspended state.
   */
  async updateInstitutionStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }
      const institutionId = String(req.params.id);
      const { isActive } = req.body;
      const result = await adminService.updateInstitutionStatus(req.user.id, institutionId, Boolean(isActive));
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Institution status updated to ${result.isActive ? "ACTIVE" : "SUSPENDED"}.`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/v1/admin/institutions/applications/:id
   * Deletes an institution application record.
   */
  async deleteInstitutionApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required", "AUTH_UNAUTHORIZED");
      }
      const applicationId = String(req.params.id);
      await adminService.deleteInstitutionApplication(applicationId);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Institution application deleted successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  // ==========================================
  // COMPANY / ORGANIZATION MANAGEMENT
  // ==========================================

  /**
   * GET /api/v1/admin/companies
   * Lists companies across the platform.
   */
  async listCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = req.query.search as string;
      const status = req.query.status as string;
      const companies = await adminService.listCompanies({ search, status });
      res.status(HttpStatus.OK).json({
        success: true,
        data: companies,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/companies/:id
   * Detailed company metadata.
   */
  async getCompanyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.params.id as string;
      const company = await adminService.getCompanyById(companyId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: company,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/v1/admin/companies
   * Creates a new company organization.
   */
  async createCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, code, contactEmail, phone, address, city, state, country, studentCapacity, adminUserId } = req.body;
      if (!name || !contactEmail) {
        throw AppError.badRequest("Company name and contact email are required.");
      }
      const company = await adminService.createCompany({
        name,
        code,
        contactEmail,
        phone,
        address,
        city,
        state,
        country,
        studentCapacity: studentCapacity ? Number(studentCapacity) : undefined,
        adminUserId,
      });
      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Company organization created successfully.",
        data: company,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/v1/admin/companies/:id/status
   * Toggles company status.
   */
  async updateCompanyStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.params.id as string;
      const { status } = req.body;
      if (!status || !["ACTIVE", "PENDING", "SUSPENDED"].includes(status)) {
        throw AppError.badRequest("Valid status ('ACTIVE', 'PENDING', 'SUSPENDED') is required.");
      }
      await adminService.updateCompanyStatus(companyId, status);
      res.status(HttpStatus.OK).json({
        success: true,
        message: `Company status updated to ${status}.`,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/v1/admin/audit-logs
   * Retrieves platform audit log records.
   */
  async listAuditLogs(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const logs = await adminService.listAuditLogs();
      res.status(HttpStatus.OK).json({
        success: true,
        data: logs,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const adminController = new AdminController();





