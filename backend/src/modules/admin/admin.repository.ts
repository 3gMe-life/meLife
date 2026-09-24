import { pool } from "../../config/database";
import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";
import {
  CounsellorApplicationItemDTO,
  ApproveApplicationRequestDTO,
  RejectApplicationRequestDTO,
  ApplicationDecisionResultDTO,
  PlatformOverviewResponseDTO,
  PlatformMetricsDTO,
  RecentUserDTO,
  RecentApplicationDTO,
  AdminUserListItemDTO,
  AdminUserFilterParams,
  AdminUserListResponseDTO,
  AdminUserDetailDTO,
  AdminRoleListItemDTO,
  AdminRoleDetailDTO,
  AdminRoleListResponseDTO,
  AdminPermissionListItemDTO,
  AdminRolePermissionDTO,
  AdminRoleAssignedUserDTO,
  RolePermissionMatrixResponseDTO,
  RolePermissionMatrixItemDTO,
  UpdateRolePermissionsResponseDTO,
  DashboardFeatureItemDTO,
  RoleDashboardFeatureItemDTO,
  RoleDashboardFeaturesResponseDTO,
  UpdateRoleDashboardFeaturesResponseDTO,
  AdminCounsellorAccessDTO,
  UpdateCounsellorProfileRequestDTO,
  DeleteCounsellorResultDTO,
  UpdateUserProfileRequestDTO,
  DeleteUserResultDTO,
  BulkDeleteUsersResultDTO,
  BulkDeleteUserItemResult,
  BulkUserStatusResultDTO,
} from "./admin.types";

export class AdminRepository {
  /**
   * Retrieves counsellor applications with user & reviewer metadata.
   */
  async findApplications(status?: string): Promise<CounsellorApplicationItemDTO[]> {
    let query = `
      SELECT ca.id, ca.user_id, ca.qualification, ca.organization, ca.status,
             ca.reviewed_by, ca.reviewed_at, ca.review_notes, ca.created_at, ca.updated_at,
             u.first_name as applicant_first_name, u.last_name as applicant_last_name, u.email as applicant_email,
             ru.first_name as reviewer_first_name, ru.last_name as reviewer_last_name
      FROM counsellor_applications ca
      JOIN users u ON ca.user_id = u.id
      LEFT JOIN users ru ON ca.reviewed_by = ru.id
    `;

    const values: unknown[] = [];
    if (status && status.toUpperCase() !== "ALL") {
      query += ` WHERE ca.status = $1`;
      values.push(status.toUpperCase());
    }

    query += ` ORDER BY ca.created_at DESC`;

    const res = await pool.query(query, values);
    return res.rows.map(this.mapToApplicationDTO);
  }

  /**
   * Finds a single application by application UUID or applicant user UUID.
   */
  async findApplicationById(idOrUserId: string): Promise<CounsellorApplicationItemDTO | null> {
    if (!idOrUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrUserId)) {
      return null;
    }

    const query = `
      SELECT ca.id, ca.user_id, ca.qualification, ca.organization, ca.status,
             ca.reviewed_by, ca.reviewed_at, ca.review_notes, ca.created_at, ca.updated_at,
             u.first_name as applicant_first_name, u.last_name as applicant_last_name, u.email as applicant_email,
             ru.first_name as reviewer_first_name, ru.last_name as reviewer_last_name
      FROM counsellor_applications ca
      JOIN users u ON ca.user_id = u.id
      LEFT JOIN users ru ON ca.reviewed_by = ru.id
      WHERE ca.id = $1 OR ca.user_id = $1
      ORDER BY ca.created_at DESC
      LIMIT 1
    `;

    const res = await pool.query(query, [idOrUserId]);
    if (!res.rows[0]) return null;
    return this.mapToApplicationDTO(res.rows[0]);
  }

  /**
   * Atomically approves a pending counsellor application within an ACID transaction.
   * 1. Verifies application exists and is PENDING.
   * 2. Updates users.status to ACTIVE.
   * 3. Sets user_roles: CAREER_COUNSELLOR (is_primary = true) and removes previous PARTICIPANT role.
   * 4. Updates counsellor_applications to APPROVED with audit metadata.
   * 5. Inserts / activates counsellors profile.
   * 6. Dispatches approval notification.
   */
  async executeApprovalTransaction(
    adminUserId: string,
    applicationIdOrUserId: string,
    options?: ApproveApplicationRequestDTO
  ): Promise<ApplicationDecisionResultDTO> {
    if (
      !applicationIdOrUserId ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(applicationIdOrUserId)
    ) {
      throw AppError.notFound(
        "Counsellor application not found.",
        "APPLICATION_NOT_FOUND"
      );
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Lock and verify application
      const lockQuery = `
        SELECT ca.id, ca.user_id, ca.qualification, ca.organization, ca.status, ca.created_at,
               u.id as u_id, u.email, u.first_name, u.last_name, u.status as u_status
        FROM counsellor_applications ca
        JOIN users u ON ca.user_id = u.id
        WHERE ca.id = $1 OR ca.user_id = $1
        ORDER BY ca.created_at DESC
        LIMIT 1
        FOR UPDATE OF ca, u
      `;
      const appRes = await client.query(lockQuery, [applicationIdOrUserId]);
      if (!appRes.rows[0]) {
        throw AppError.notFound(
          "Counsellor application not found.",
          "APPLICATION_NOT_FOUND"
        );
      }

      const rawApp = appRes.rows[0];

      if (rawApp.status !== "PENDING") {
        throw AppError.badRequest(
          `Application cannot be approved. Current status is already ${rawApp.status}.`,
          "APPLICATION_ALREADY_PROCESSED"
        );
      }

      const userId = rawApp.user_id;
      const resolvedQualification =
        options?.qualification?.trim() ||
        rawApp.qualification ||
        "Certified Career Guidance Counsellor";
      const resolvedBio =
        options?.bio?.trim() ||
        "Certified Career and Education Guidance Counsellor at MeLife.";
      const experienceYears =
        options?.experienceYears !== undefined && options.experienceYears >= 0
          ? options.experienceYears
          : 1;
      const specialisations = options?.specialisations?.length
        ? options.specialisations
        : ["School Career Guidance", "Higher Education Advisory", "Cognitive Aptitude Alignment"];
      const languages = options?.languages?.length
        ? options.languages
        : ["English"];
      const guidanceAreas = options?.guidanceAreas?.length
        ? options.guidanceAreas
        : ["Stream Selection", "Psychometric Assessment Debriefing", "Career Roadmaps"];

      // 2. Update users.status to ACTIVE
      const userUpdateRes = await client.query(
        `UPDATE users
         SET status = 'ACTIVE', updated_at = NOW()
         WHERE id = $1
         RETURNING id, email, first_name, last_name, status`,
        [userId]
      );
      const updatedUser = userUpdateRes.rows[0];

      // 3. Update user_roles: assign CAREER_COUNSELLOR (is_primary = true) and remove old PARTICIPANT assignment
      await client.query(
        `DELETE FROM user_roles WHERE user_id = $1`,
        [userId]
      );

      await client.query(
        `INSERT INTO user_roles (user_id, role_id, is_primary)
         SELECT $1, r.id, true
         FROM roles r
         WHERE r.name = 'CAREER_COUNSELLOR'`,
        [userId]
      );

      // 4. Update counsellor_applications status to APPROVED
      const appUpdateRes = await client.query(
        `UPDATE counsellor_applications
         SET status = 'APPROVED',
             reviewed_by = $1,
             reviewed_at = NOW(),
             review_notes = $2,
             updated_at = NOW()
         WHERE id = $3
         RETURNING id, user_id, qualification, organization, status, reviewed_by, reviewed_at, review_notes, created_at, updated_at`,
        [adminUserId, options?.reviewNotes || null, rawApp.id]
      );
      const updatedApp = appUpdateRes.rows[0];

      // 5. Create or activate counsellors profile
      const counsellorRes = await client.query(
        `INSERT INTO counsellors (
           user_id, qualification, experience_years, bio,
           specialisations, languages, guidance_areas,
           rating, review_count, reviews, approval_status
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, 5.0, 0, '[]'::jsonb, 'APPROVED')
         ON CONFLICT (user_id) DO UPDATE
         SET qualification = EXCLUDED.qualification,
             experience_years = EXCLUDED.experience_years,
             bio = EXCLUDED.bio,
             specialisations = EXCLUDED.specialisations,
             languages = EXCLUDED.languages,
             guidance_areas = EXCLUDED.guidance_areas,
             approval_status = 'APPROVED',
             updated_at = NOW()
         RETURNING id, user_id, qualification, approval_status`,
        [
          userId,
          resolvedQualification,
          experienceYears,
          resolvedBio,
          JSON.stringify(specialisations),
          JSON.stringify(languages),
          JSON.stringify(guidanceAreas),
        ]
      );
      const counsellorProfile = counsellorRes.rows[0];

      // 6. Dispatch approval notification
      try {
        await client.query(
          `INSERT INTO notifications (user_id, title, message, type, metadata)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            userId,
            "Counsellor Application Approved! 🎉",
            "Congratulations! Your professional career counsellor profile has been verified and approved. You now have full access to your Counsellor Portal.",
            "BOOKING_CONFIRMED",
            JSON.stringify({ applicationId: rawApp.id, status: "APPROVED", role: "CAREER_COUNSELLOR" }),
          ]
        );
      } catch (notifErr) {
        logger.warn({ err: notifErr }, "Non-fatal error creating counsellor approval notification");
      }

      await client.query("COMMIT");

      logger.info(
        { applicationId: rawApp.id, userId, adminUserId },
        "Counsellor application approved atomically"
      );

      // Fetch reviewer name
      const adminUserRes = await pool.query(
        "SELECT first_name, last_name FROM users WHERE id = $1 LIMIT 1",
        [adminUserId]
      );
      const reviewer = adminUserRes.rows[0];
      const reviewerName = reviewer ? `${reviewer.first_name} ${reviewer.last_name}`.trim() : "Platform Administrator";

      return {
        success: true,
        message: "Counsellor application approved successfully. User activated as CAREER_COUNSELLOR.",
        application: {
          id: updatedApp.id,
          userId: updatedApp.user_id,
          applicantName: `${updatedUser.first_name} ${updatedUser.last_name}`.trim(),
          applicantEmail: updatedUser.email,
          qualification: updatedApp.qualification,
          organization: updatedApp.organization,
          status: updatedApp.status,
          reviewedBy: updatedApp.reviewed_by,
          reviewerName,
          reviewedAt: updatedApp.reviewed_at ? new Date(updatedApp.reviewed_at).toISOString() : null,
          reviewNotes: updatedApp.review_notes,
          createdAt: new Date(updatedApp.created_at).toISOString(),
          updatedAt: updatedApp.updated_at ? new Date(updatedApp.updated_at).toISOString() : null,
        },
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          status: updatedUser.status,
          role: "CAREER_COUNSELLOR",
        },
        counsellor: {
          id: counsellorProfile.id,
          userId: counsellorProfile.user_id,
          qualification: counsellorProfile.qualification,
          approvalStatus: counsellorProfile.approval_status,
        },
      };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Rejects a pending counsellor application within an ACID transaction.
   * Does NOT activate user or promote role.
   */
  async executeRejectionTransaction(
    adminUserId: string,
    applicationIdOrUserId: string,
    options?: RejectApplicationRequestDTO
  ): Promise<ApplicationDecisionResultDTO> {
    if (
      !applicationIdOrUserId ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(applicationIdOrUserId)
    ) {
      throw AppError.notFound(
        "Counsellor application not found.",
        "APPLICATION_NOT_FOUND"
      );
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Lock and verify application
      const lockQuery = `
        SELECT ca.id, ca.user_id, ca.qualification, ca.organization, ca.status, ca.created_at,
               u.id as u_id, u.email, u.first_name, u.last_name, u.status as u_status
        FROM counsellor_applications ca
        JOIN users u ON ca.user_id = u.id
        WHERE ca.id = $1 OR ca.user_id = $1
        ORDER BY ca.created_at DESC
        LIMIT 1
        FOR UPDATE OF ca, u
      `;
      const appRes = await client.query(lockQuery, [applicationIdOrUserId]);
      if (!appRes.rows[0]) {
        throw AppError.notFound(
          "Counsellor application not found.",
          "APPLICATION_NOT_FOUND"
        );
      }

      const rawApp = appRes.rows[0];

      if (rawApp.status !== "PENDING") {
        throw AppError.badRequest(
          `Application cannot be rejected. Current status is already ${rawApp.status}.`,
          "APPLICATION_ALREADY_PROCESSED"
        );
      }

      const rejectionReason =
        options?.reason?.trim() ||
        options?.reviewNotes?.trim() ||
        "Your counsellor application could not be verified at this time.";

      // 2. Update counsellor_applications status to REJECTED
      const appUpdateRes = await client.query(
        `UPDATE counsellor_applications
         SET status = 'REJECTED',
             reviewed_by = $1,
             reviewed_at = NOW(),
             review_notes = $2,
             updated_at = NOW()
         WHERE id = $3
         RETURNING id, user_id, qualification, organization, status, reviewed_by, reviewed_at, review_notes, created_at, updated_at`,
        [adminUserId, rejectionReason, rawApp.id]
      );
      const updatedApp = appUpdateRes.rows[0];

      // 3. Dispatch rejection notification
      try {
        await client.query(
          `INSERT INTO notifications (user_id, title, message, type, metadata)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            rawApp.user_id,
            "Counsellor Application Update",
            rejectionReason,
            "SESSION_REQUEST",
            JSON.stringify({ applicationId: rawApp.id, status: "REJECTED" }),
          ]
        );
      } catch (notifErr) {
        logger.warn({ err: notifErr }, "Non-fatal error creating counsellor rejection notification");
      }

      await client.query("COMMIT");

      logger.info(
        { applicationId: rawApp.id, userId: rawApp.user_id, adminUserId },
        "Counsellor application rejected"
      );

      // Fetch reviewer name
      const adminUserRes = await pool.query(
        "SELECT first_name, last_name FROM users WHERE id = $1 LIMIT 1",
        [adminUserId]
      );
      const reviewer = adminUserRes.rows[0];
      const reviewerName = reviewer ? `${reviewer.first_name} ${reviewer.last_name}`.trim() : "Platform Administrator";

      return {
        success: true,
        message: "Counsellor application rejected successfully.",
        application: {
          id: updatedApp.id,
          userId: updatedApp.user_id,
          applicantName: `${rawApp.first_name} ${rawApp.last_name}`.trim(),
          applicantEmail: rawApp.email,
          qualification: updatedApp.qualification,
          organization: updatedApp.organization,
          status: updatedApp.status,
          reviewedBy: updatedApp.reviewed_by,
          reviewerName,
          reviewedAt: updatedApp.reviewed_at ? new Date(updatedApp.reviewed_at).toISOString() : null,
          reviewNotes: updatedApp.review_notes,
          createdAt: new Date(updatedApp.created_at).toISOString(),
          updatedAt: updatedApp.updated_at ? new Date(updatedApp.updated_at).toISOString() : null,
        },
        user: {
          id: rawApp.u_id,
          email: rawApp.email,
          firstName: rawApp.first_name,
          lastName: rawApp.last_name,
          status: rawApp.u_status,
          role: "PARTICIPANT",
        },
        counsellor: null,
      };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Retrieves high-level aggregated platform overview statistics and recent activities.
   * Runs single aggregated query and indexed recent entity queries in parallel.
   */
  async getPlatformOverview(): Promise<PlatformOverviewResponseDTO> {
    const metricsQuery = `
      SELECT
        (SELECT COUNT(*)::int FROM users) AS total_users,
        (SELECT COUNT(DISTINCT u.id)::int
         FROM users u
         JOIN user_roles ur ON u.id = ur.user_id
         JOIN roles r ON ur.role_id = r.id
         WHERE r.name IN ('PARTICIPANT', 'STUDENT') AND u.status = 'ACTIVE'
        ) AS active_students,
        (SELECT COUNT(*)::int FROM counsellors WHERE approval_status = 'APPROVED') AS approved_counsellors,
        (SELECT COUNT(*)::int FROM counsellor_applications WHERE status = 'PENDING') AS pending_counsellor_applications,
        (SELECT COUNT(*)::int FROM assessment_results) AS completed_assessments,
        (SELECT COUNT(*)::int FROM institution_applications) AS total_institution_applications
    `;

    const recentUsersQuery = `
      SELECT u.id, u.email, u.first_name, u.last_name, u.status, u.created_at,
             COALESCE(r.name, 'PARTICIPANT') as role
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.is_primary = true
      LEFT JOIN roles r ON ur.role_id = r.id
      ORDER BY u.created_at DESC
      LIMIT 5
    `;

    const recentApplicationsQuery = `
      SELECT ca.id, ca.user_id, ca.qualification, ca.organization, ca.status, ca.created_at,
             u.first_name as applicant_first_name, u.last_name as applicant_last_name, u.email as applicant_email
      FROM counsellor_applications ca
      JOIN users u ON ca.user_id = u.id
      ORDER BY ca.created_at DESC
      LIMIT 5
    `;

    const recentActivitiesQuery = `
      SELECT id, title, message, type, created_at
      FROM notifications
      ORDER BY created_at DESC
      LIMIT 5
    `;

    const [metricsRes, recentUsersRes, recentAppsRes, recentActsRes] = await Promise.all([
      pool.query(metricsQuery),
      pool.query(recentUsersQuery),
      pool.query(recentApplicationsQuery),
      pool.query(recentActivitiesQuery),
    ]);

    const m = metricsRes.rows[0] || {};
    const metrics: PlatformMetricsDTO = {
      totalUsers: parseInt(m.total_users || 0, 10),
      activeStudents: parseInt(m.active_students || 0, 10),
      approvedCounsellors: parseInt(m.approved_counsellors || 0, 10),
      pendingCounsellorApplications: parseInt(m.pending_counsellor_applications || 0, 10),
      completedAssessments: parseInt(m.completed_assessments || 0, 10),
      institutionApplications: parseInt(m.total_institution_applications || 0, 10),
    };

    const recentUsers: RecentUserDTO[] = recentUsersRes.rows.map((row) => ({
      id: String(row.id),
      email: String(row.email),
      name: `${String(row.first_name || "")} ${String(row.last_name || "")}`.trim() || String(row.email),
      role: String(row.role || "PARTICIPANT"),
      status: String(row.status || "ACTIVE"),
      createdAt: new Date(row.created_at as string | Date).toISOString(),
    }));

    const recentApplications: RecentApplicationDTO[] = recentAppsRes.rows.map((row) => ({
      id: String(row.id),
      userId: String(row.user_id),
      applicantName: `${String(row.applicant_first_name || "")} ${String(row.applicant_last_name || "")}`.trim() || String(row.applicant_email),
      applicantEmail: String(row.applicant_email),
      qualification: row.qualification ? String(row.qualification) : null,
      organization: row.organization ? String(row.organization) : null,
      status: String(row.status),
      createdAt: new Date(row.created_at as string | Date).toISOString(),
    }));

    const recentActivities = recentActsRes.rows.map((row) => ({
      id: String(row.id),
      title: String(row.title || "System Activity"),
      message: String(row.message || ""),
      type: String(row.type || "INFO"),
      createdAt: new Date(row.created_at as string | Date).toISOString(),
    }));

    return {
      metrics,
      recentUsers,
      recentApplications,
      recentActivities,
    };
  }

  /**
   * Lists administrative users with filtering, search, sorting, and pagination.
   */
  async findUsers(filters?: AdminUserFilterParams): Promise<AdminUserListResponseDTO> {
    const page = Math.max(1, Number(filters?.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters?.limit) || 10));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    // Search filter (name or email)
    if (filters?.search && filters.search.trim()) {
      const s = `%${filters.search.trim().toLowerCase()}%`;
      conditions.push(
        `(LOWER(u.first_name || ' ' || u.last_name) LIKE $${paramIndex} OR LOWER(u.email) LIKE $${paramIndex})`
      );
      values.push(s);
      paramIndex++;
    }

    // Status filter
    if (filters?.status && filters.status.toUpperCase() !== "ALL") {
      conditions.push(`u.status = $${paramIndex}`);
      values.push(filters.status.toUpperCase());
      paramIndex++;
    }

    // Role filter
    if (filters?.role && filters.role.toUpperCase() !== "ALL") {
      conditions.push(`EXISTS (
        SELECT 1 FROM user_roles ur2
        JOIN roles r2 ON ur2.role_id = r2.id
        WHERE ur2.user_id = u.id AND r2.name = $${paramIndex}
      )`);
      values.push(filters.role.toUpperCase());
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Sorting
    let orderBy = "u.created_at DESC";
    const allowedSortColumns: Record<string, string> = {
      created_at: "u.created_at",
      email: "u.email",
      first_name: "u.first_name",
      name: "u.first_name",
      last_login_at: "u.last_login_at",
      status: "u.status",
    };

    if (filters?.sortBy && allowedSortColumns[filters.sortBy.toLowerCase()]) {
      const col = allowedSortColumns[filters.sortBy.toLowerCase()];
      const order = filters.sortOrder && filters.sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";
      orderBy = `${col} ${order}`;
    }

    // 1. Total count query
    const countQuery = `
      SELECT COUNT(DISTINCT u.id) as total
      FROM users u
      ${whereClause}
    `;
    const countRes = await pool.query(countQuery, values);
    const totalItems = parseInt(countRes.rows[0]?.total || 0, 10);
    const totalPages = Math.ceil(totalItems / limit) || 1;

    // 2. Paginated data query
    const dataValues = [...values, limit, offset];
    const dataQuery = `
      SELECT u.id, u.email, u.first_name, u.last_name, u.status,
             u.email_verified_at, u.last_login_at, u.created_at, u.updated_at,
             COALESCE(
               (SELECT r.name FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = u.id ORDER BY ur.is_primary DESC, ur.created_at ASC LIMIT 1),
               'PARTICIPANT'
             ) as primary_role,
             COALESCE(
               (SELECT array_agg(r.name) FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = u.id),
               ARRAY['PARTICIPANT'::varchar]
             ) as all_roles
      FROM users u
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const dataRes = await pool.query(dataQuery, dataValues);
    const users: AdminUserListItemDTO[] = dataRes.rows.map(this.mapToUserListItemDTO);

    return {
      users,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Updates user status with security safeguards preventing deactivation of the last SUPER_ADMIN.
   */
  async updateUserStatus(
    _adminUserId: string,
    targetUserId: string,
    newStatus: string
  ): Promise<AdminUserListItemDTO> {
    if (!targetUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetUserId)) {
      throw AppError.notFound("User not found.", "USER_NOT_FOUND");
    }

    const validStatuses = ["ACTIVE", "PENDING_VERIFICATION", "SUSPENDED", "DISABLED"];
    const normalizedStatus = newStatus.toUpperCase();
    if (!validStatuses.includes(normalizedStatus)) {
      throw AppError.badRequest(`Invalid user status '${newStatus}'. Allowed: ${validStatuses.join(", ")}`);
    }

    // If attempting to suspend or disable a user, verify they are not the last active SUPER_ADMIN
    if (normalizedStatus !== "ACTIVE") {
      const isSuperAdminRes = await pool.query(`
        SELECT 1 FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = $1 AND r.name = 'SUPER_ADMIN'
        LIMIT 1
      `, [targetUserId]);

      if (isSuperAdminRes.rows.length > 0) {
        const countSuperAdminsRes = await pool.query(`
          SELECT COUNT(DISTINCT ur.user_id) as total
          FROM user_roles ur
          JOIN roles r ON r.id = ur.role_id
          JOIN users u ON u.id = ur.user_id
          WHERE r.name = 'SUPER_ADMIN' AND u.status = 'ACTIVE'
        `);
        const totalSuperAdmins = parseInt(countSuperAdminsRes.rows[0]?.total || 0, 10);
        if (totalSuperAdmins <= 1) {
          throw AppError.badRequest(
            "Cannot deactivate or suspend the last remaining active SUPER_ADMIN account in the system.",
            "CANNOT_MODIFY_LAST_SUPER_ADMIN"
          );
        }
      }
    }

    const updateRes = await pool.query(`
      UPDATE users
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, email, first_name, last_name, status,
                email_verified_at, last_login_at, created_at, updated_at
    `, [normalizedStatus, targetUserId]);

    if (!updateRes.rows[0]) {
      throw AppError.notFound("User not found.", "USER_NOT_FOUND");
    }

    return this.findUserAdminDetail(targetUserId);
  }

  /**
   * Updates user primary role with security safeguards preventing demoting the last SUPER_ADMIN.
   */
  async updateUserRole(
    _adminUserId: string,
    targetUserId: string,
    newRole: string
  ): Promise<AdminUserListItemDTO> {
    if (!targetUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetUserId)) {
      throw AppError.notFound("User not found.", "USER_NOT_FOUND");
    }

    const normalizedRole = newRole.toUpperCase();

    // Check if newRole is valid in roles table
    const roleRes = await pool.query("SELECT id, name FROM roles WHERE name = $1 LIMIT 1", [normalizedRole]);
    if (!roleRes.rows[0]) {
      throw AppError.badRequest(`Role '${newRole}' does not exist in the system.`);
    }
    const roleId = roleRes.rows[0].id;

    // Check if target user is currently SUPER_ADMIN and is being changed to a non-SUPER_ADMIN role
    if (normalizedRole !== "SUPER_ADMIN") {
      const isSuperAdminRes = await pool.query(`
        SELECT 1 FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        WHERE ur.user_id = $1 AND r.name = 'SUPER_ADMIN'
        LIMIT 1
      `, [targetUserId]);

      if (isSuperAdminRes.rows.length > 0) {
        const countSuperAdminsRes = await pool.query(`
          SELECT COUNT(DISTINCT ur.user_id) as total
          FROM user_roles ur
          JOIN roles r ON r.id = ur.role_id
          JOIN users u ON u.id = ur.user_id
          WHERE r.name = 'SUPER_ADMIN' AND u.status = 'ACTIVE'
        `);
        const totalSuperAdmins = parseInt(countSuperAdminsRes.rows[0]?.total || 0, 10);
        if (totalSuperAdmins <= 1) {
          throw AppError.badRequest(
            "Cannot remove the SUPER_ADMIN role from the last remaining super administrator.",
            "CANNOT_MODIFY_LAST_SUPER_ADMIN"
          );
        }
      }
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Replace user_roles
      await client.query("DELETE FROM user_roles WHERE user_id = $1", [targetUserId]);
      await client.query(
        "INSERT INTO user_roles (user_id, role_id, is_primary) VALUES ($1, $2, true)",
        [targetUserId, roleId]
      );

      // If changing to CAREER_COUNSELLOR, ensure counsellors entity exists
      if (normalizedRole === "CAREER_COUNSELLOR") {
        await client.query(`
          INSERT INTO counsellors (user_id, qualification, experience_years, bio, specialisations, languages, guidance_areas, rating, review_count, reviews, approval_status)
          VALUES ($1, 'Certified Career Guidance Counsellor', 1, 'Certified Counsellor at MeLife', '[]'::jsonb, '["English"]'::jsonb, '[]'::jsonb, 5.0, 0, '[]'::jsonb, 'APPROVED')
          ON CONFLICT (user_id) DO UPDATE SET approval_status = 'APPROVED', updated_at = NOW()
        `, [targetUserId]);
      }

      await client.query("UPDATE users SET updated_at = NOW() WHERE id = $1", [targetUserId]);
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    return this.findUserAdminDetail(targetUserId);
  }

  /**
   * Updates user profile names (firstName, lastName).
   */
  async updateUserProfile(
    _adminUserId: string,
    targetUserId: string,
    data: UpdateUserProfileRequestDTO
  ): Promise<AdminUserDetailDTO> {
    if (
      !targetUserId ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetUserId)
    ) {
      throw AppError.notFound("User not found.", "USER_NOT_FOUND");
    }

    const checkRes = await pool.query("SELECT id FROM users WHERE id = $1 LIMIT 1", [targetUserId]);
    if (!checkRes.rows[0]) {
      throw AppError.notFound("User not found.", "USER_NOT_FOUND");
    }

    const firstName = data.firstName !== undefined ? data.firstName.trim() : null;
    const lastName = data.lastName !== undefined ? data.lastName.trim() : null;

    if (firstName !== null && firstName.length === 0) {
      throw AppError.badRequest("First name cannot be empty.");
    }

    await pool.query(
      `
      UPDATE users
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          updated_at = NOW()
      WHERE id = $3
    `,
      [firstName, lastName, targetUserId]
    );

    return this.findUserAdminDetail(targetUserId);
  }

  /**
   * Safely deletes or deactivates a user account with dependency protection.
   */
  async deleteUser(
    adminUserId: string,
    targetUserId: string
  ): Promise<DeleteUserResultDTO> {
    if (
      !targetUserId ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetUserId)
    ) {
      throw AppError.notFound("User not found.", "USER_NOT_FOUND");
    }

    // Safeguard 1: Prevent self-deletion
    if (adminUserId === targetUserId) {
      throw AppError.badRequest(
        "You cannot delete your own administrative account.",
        "CANNOT_DELETE_SELF"
      );
    }

    // Check if target user exists
    const userRes = await pool.query(
      "SELECT id, email, status FROM users WHERE id = $1 LIMIT 1",
      [targetUserId]
    );
    if (!userRes.rows[0]) {
      throw AppError.notFound("User not found.", "USER_NOT_FOUND");
    }

    // Safeguard 2: Prevent deleting the last active SUPER_ADMIN
    const isSuperAdminRes = await pool.query(
      `
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = $1 AND r.name = 'SUPER_ADMIN'
      LIMIT 1
    `,
      [targetUserId]
    );

    if (isSuperAdminRes.rows.length > 0) {
      const countSuperAdminsRes = await pool.query(`
        SELECT COUNT(DISTINCT ur.user_id) as total
        FROM user_roles ur
        JOIN roles r ON r.id = ur.role_id
        JOIN users u ON u.id = ur.user_id
        WHERE r.name = 'SUPER_ADMIN' AND u.status = 'ACTIVE'
      `);
      const totalSuperAdmins = parseInt(countSuperAdminsRes.rows[0]?.total || 0, 10);
      if (totalSuperAdmins <= 1) {
        throw AppError.badRequest(
          "Cannot delete the last remaining active SUPER_ADMIN account in the system.",
          "CANNOT_DELETE_LAST_SUPER_ADMIN"
        );
      }
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Nullify NO ACTION foreign key references in applications
      await client.query(
        "UPDATE counsellor_applications SET reviewed_by = NULL WHERE reviewed_by = $1",
        [targetUserId]
      );
      await client.query(
        "UPDATE institution_applications SET reviewed_by = NULL WHERE reviewed_by = $1",
        [targetUserId]
      );

      // 2. Permanently delete user (all dependent records automatically cascaded)
      await client.query("DELETE FROM users WHERE id = $1", [targetUserId]);

      await client.query("COMMIT");
      return {
        success: true,
        message: "User account and associated records have been permanently removed.",
        actionTaken: "HARD_DELETED",
      };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Safely deletes or deactivates multiple user accounts in an atomic batch operation with dependency protection.
   */
  async deleteUsersBulk(
    adminUserId: string,
    targetUserIds: string[]
  ): Promise<BulkDeleteUsersResultDTO> {
    const rawIds = Array.isArray(targetUserIds) ? targetUserIds : [];
    const uniqueIds = Array.from(new Set(rawIds.map((id) => String(id).trim()))).filter(Boolean);

    if (uniqueIds.length === 0) {
      throw AppError.badRequest("No valid user IDs provided for deletion.", "INVALID_INPUT");
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const results: BulkDeleteUserItemResult[] = [];
    let deletedCount = 0;
    let deactivatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    // Filter valid UUIDs vs invalid format
    const validCandidateIds: string[] = [];
    for (const uid of uniqueIds) {
      if (!uuidRegex.test(uid)) {
        failedCount++;
        results.push({
          userId: uid,
          success: false,
          actionTaken: "FAILED",
          reason: "Invalid user ID format.",
        });
      } else if (uid === adminUserId) {
        // Safeguard 1: Prevent self-deletion
        skippedCount++;
        results.push({
          userId: uid,
          success: false,
          actionTaken: "SKIPPED_PROTECTED",
          reason: "You cannot delete your own administrative account.",
        });
      } else {
        validCandidateIds.push(uid);
      }
    }

    if (validCandidateIds.length === 0) {
      return {
        totalRequested: uniqueIds.length,
        deletedCount,
        deactivatedCount,
        skippedCount,
        failedCount,
        results,
        message: "No eligible user accounts to delete.",
      };
    }

    // Fetch details for all valid candidate users
    const usersRes = await pool.query(
      `
      SELECT u.id, u.email, u.first_name, u.last_name, u.status,
             COALESCE(r.name, 'PARTICIPANT') as role_name
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id AND ur.is_primary = true
      LEFT JOIN roles r ON r.id = ur.role_id
      WHERE u.id = ANY($1)
    `,
      [validCandidateIds]
    );

    const userMap = new Map<string, { id: string; email: string; fullName: string; status: string; roleName: string }>();
    for (const row of usersRes.rows) {
      const fullName = [row.first_name, row.last_name].filter(Boolean).join(" ") || row.email;
      userMap.set(row.id, {
        id: row.id,
        email: row.email,
        fullName,
        status: row.status,
        roleName: row.role_name,
      });
    }

    // Check for non-existent users
    for (const uid of validCandidateIds) {
      if (!userMap.has(uid)) {
        failedCount++;
        results.push({
          userId: uid,
          success: false,
          actionTaken: "FAILED",
          reason: "User account not found.",
        });
      }
    }

    // Safeguard 2: Check Super Admin lockout
    const countSuperAdminsRes = await pool.query(`
      SELECT COUNT(DISTINCT ur.user_id) as total
      FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      JOIN users u ON u.id = ur.user_id
      WHERE r.name = 'SUPER_ADMIN' AND u.status = 'ACTIVE'
    `);
    const totalActiveSuperAdmins = parseInt(countSuperAdminsRes.rows[0]?.total || "0", 10);

    const superAdminCandidates = Array.from(userMap.values()).filter(
      (u) => u.roleName === "SUPER_ADMIN" && u.status === "ACTIVE"
    );

    const protectedSuperAdminIds = new Set<string>();
    if (superAdminCandidates.length >= totalActiveSuperAdmins) {
      // Deleting all of them would leave 0 active Super Admins. Protect the last one(s).
      const protectCount = 1;
      for (let i = 0; i < protectCount && i < superAdminCandidates.length; i++) {
        protectedSuperAdminIds.add(superAdminCandidates[i].id);
      }
    }

    // Identify eligible users to delete vs protected accounts
    const userIdsToDelete: string[] = [];
    for (const [userId, user] of userMap.entries()) {
      if (protectedSuperAdminIds.has(userId)) {
        skippedCount++;
        results.push({
          userId,
          email: user.email,
          fullName: user.fullName,
          success: false,
          actionTaken: "SKIPPED_PROTECTED",
          reason: "Cannot delete the last remaining active SUPER_ADMIN account.",
        });
      } else {
        userIdsToDelete.push(userId);
      }
    }

    if (userIdsToDelete.length > 0) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        // 1. Nullify NO ACTION foreign key references in applications
        await client.query(
          "UPDATE counsellor_applications SET reviewed_by = NULL WHERE reviewed_by = ANY($1)",
          [userIdsToDelete]
        );
        await client.query(
          "UPDATE institution_applications SET reviewed_by = NULL WHERE reviewed_by = ANY($1)",
          [userIdsToDelete]
        );

        // 2. Permanently delete users (all dependent records automatically cascaded)
        await client.query(
          "DELETE FROM users WHERE id = ANY($1)",
          [userIdsToDelete]
        );

        await client.query("COMMIT");

        for (const userId of userIdsToDelete) {
          const user = userMap.get(userId);
          deletedCount++;
          results.push({
            userId,
            email: user?.email,
            fullName: user?.fullName,
            success: true,
            actionTaken: "HARD_DELETED",
            reason: "Account and associated records permanently deleted.",
          });
        }
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    }

    let message = `${deletedCount} user account${deletedCount === 1 ? "" : "s"} permanently removed.`;
    if (skippedCount > 0) {
      message += ` (${skippedCount} protected account${skippedCount === 1 ? "" : "s"} skipped)`;
    }

    return {
      totalRequested: uniqueIds.length,
      deletedCount,
      deactivatedCount: 0,
      skippedCount,
      failedCount,
      results,
      message,
    };
  }

  /**
   * Bulk updates user status (ACTIVE, SUSPENDED, DISABLED, PENDING_VERIFICATION) with safeguards.
   */
  async updateUsersStatusBulk(
    _adminUserId: string,
    targetUserIds: string[],
    newStatus: string
  ): Promise<BulkUserStatusResultDTO> {
    const rawIds = Array.isArray(targetUserIds) ? targetUserIds : [];
    const uniqueIds = Array.from(new Set(rawIds.map((id) => String(id).trim()))).filter(Boolean);

    if (uniqueIds.length === 0) {
      throw AppError.badRequest("No valid user IDs provided.", "INVALID_INPUT");
    }

    const validStatuses = ["ACTIVE", "PENDING_VERIFICATION", "SUSPENDED", "DISABLED"];
    const normalizedStatus = newStatus.toUpperCase();
    if (!validStatuses.includes(normalizedStatus)) {
      throw AppError.badRequest(`Invalid user status '${newStatus}'. Allowed: ${validStatuses.join(", ")}`);
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validCandidateIds = uniqueIds.filter((id) => uuidRegex.test(id));

    if (validCandidateIds.length === 0) {
      throw AppError.badRequest("No valid UUIDs provided.", "INVALID_INPUT");
    }

    // Check if suspending or disabling the last Super Admin
    const protectedIds = new Set<string>();
    if (normalizedStatus !== "ACTIVE") {
      const superAdminRows = await pool.query(`
        SELECT u.id
        FROM users u
        JOIN user_roles ur ON ur.user_id = u.id
        JOIN roles r ON r.id = ur.role_id
        WHERE u.id = ANY($1) AND r.name = 'SUPER_ADMIN' AND u.status = 'ACTIVE'
      `, [validCandidateIds]);

      if (superAdminRows.rows.length > 0) {
        const countSuperAdminsRes = await pool.query(`
          SELECT COUNT(DISTINCT ur.user_id) as total
          FROM user_roles ur
          JOIN roles r ON r.id = ur.role_id
          JOIN users u ON u.id = ur.user_id
          WHERE r.name = 'SUPER_ADMIN' AND u.status = 'ACTIVE'
        `);
        const totalActiveSuperAdmins = parseInt(countSuperAdminsRes.rows[0]?.total || "0", 10);
        if (superAdminRows.rows.length >= totalActiveSuperAdmins) {
          // Protect the last super admin from deactivation
          protectedIds.add(superAdminRows.rows[0].id);
        }
      }
    }

    const eligibleIds = validCandidateIds.filter((id) => !protectedIds.has(id));

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      if (eligibleIds.length > 0) {
        await client.query(
          "UPDATE users SET status = $1, updated_at = NOW() WHERE id = ANY($2)",
          [normalizedStatus, eligibleIds]
        );

        if (normalizedStatus === "SUSPENDED" || normalizedStatus === "DISABLED") {
          await client.query("DELETE FROM sessions WHERE user_id = ANY($1)", [eligibleIds]);
        }
      }

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    const updatedCount = eligibleIds.length;
    const skippedCount = protectedIds.size + (uniqueIds.length - validCandidateIds.length);

    const results = uniqueIds.map((id) => {
      if (!uuidRegex.test(id)) {
        return { userId: id, success: false, reason: "Invalid UUID format." };
      }
      if (protectedIds.has(id)) {
        return { userId: id, success: false, reason: "Protected Super Administrator account." };
      }
      return { userId: id, success: true, status: normalizedStatus };
    });

    return {
      totalRequested: uniqueIds.length,
      updatedCount,
      skippedCount,
      results,
      message: `${updatedCount} user account${updatedCount === 1 ? "" : "s"} updated to ${normalizedStatus}.`,
    };
  }

  /**
   * Retrieves single user detail including permissions and profiles.
   */
  async findUserAdminDetail(userId: string): Promise<AdminUserDetailDTO> {
    if (
      !userId ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)
    ) {
      throw AppError.notFound("User not found.", "USER_NOT_FOUND");
    }

    const query = `
      SELECT u.id, u.email, u.first_name, u.last_name, u.status,
             u.email_verified_at, u.last_login_at, u.created_at, u.updated_at,
             COALESCE(
               (SELECT r.name FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = u.id ORDER BY ur.is_primary DESC, ur.created_at ASC LIMIT 1),
               'PARTICIPANT'
             ) as primary_role,
             COALESCE(
               (SELECT array_agg(r.name) FROM user_roles ur JOIN roles r ON ur.role_id = r.id WHERE ur.user_id = u.id),
               ARRAY['PARTICIPANT'::varchar]
             ) as all_roles
      FROM users u
      WHERE u.id = $1
      LIMIT 1
    `;
    const res = await pool.query(query, [userId]);
    if (!res.rows[0]) {
      throw AppError.notFound("User not found.", "USER_NOT_FOUND");
    }

    const baseUser = this.mapToUserListItemDTO(res.rows[0]);

    // Fetch distinct permissions
    const permsRes = await pool.query(`
      SELECT DISTINCT p.name
      FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = $1
      ORDER BY p.name ASC
    `, [userId]);
    const permissions = permsRes.rows.map((r) => r.name as string);

    // Fetch counsellor profile if exists
    const counsellorRes = await pool.query(`
      SELECT id, qualification, experience_years, approval_status, rating
      FROM counsellors
      WHERE user_id = $1
      LIMIT 1
    `, [userId]);
    const counsellorProfile = counsellorRes.rows[0]
      ? {
          id: String(counsellorRes.rows[0].id),
          qualification: String(counsellorRes.rows[0].qualification),
          experienceYears: Number(counsellorRes.rows[0].experience_years),
          approvalStatus: String(counsellorRes.rows[0].approval_status),
          rating: Number(counsellorRes.rows[0].rating),
        }
      : null;

    // Fetch student profile if exists
    const studentRes = await pool.query(`
      SELECT
        COALESCE(p.is_onboarded, s.is_onboarded, false) as is_onboarded,
        COALESCE(p.education_stage, s.education_stage) as education_stage,
        COALESCE(p.grade_level, s.grade_level) as grade_level
      FROM users u
      LEFT JOIN participant_profiles p ON u.id = p.user_id
      LEFT JOIN student_profiles s ON u.id = s.user_id
      WHERE u.id = $1
      LIMIT 1
    `, [userId]);
    const studentProfile = studentRes.rows[0]
      ? {
          isOnboarded: Boolean(studentRes.rows[0].is_onboarded),
          educationStage: studentRes.rows[0].education_stage || null,
          gradeLevel: studentRes.rows[0].grade_level || null,
        }
      : null;

    return {
      ...baseUser,
      permissions,
      counsellorProfile,
      studentProfile,
    };
  }

  private mapToUserListItemDTO(row: Record<string, unknown>): AdminUserListItemDTO {
    const firstName = String(row.first_name || "");
    const lastName = String(row.last_name || "");
    const fullName = `${firstName} ${lastName}`.trim() || String(row.email || "Unnamed User");
    const role = String(row.primary_role || "PARTICIPANT");
    const roles = Array.isArray(row.all_roles) ? row.all_roles.map(String) : [role];

    return {
      id: String(row.id),
      email: String(row.email),
      firstName,
      lastName,
      fullName,
      status: String(row.status || "ACTIVE"),
      role,
      roles,
      emailVerifiedAt: row.email_verified_at ? new Date(row.email_verified_at as string | Date).toISOString() : null,
      lastLoginAt: row.last_login_at ? new Date(row.last_login_at as string | Date).toISOString() : null,
      createdAt: new Date(row.created_at as string | Date).toISOString(),
      updatedAt: row.updated_at ? new Date(row.updated_at as string | Date).toISOString() : null,
    };
  }

  private mapToApplicationDTO(row: Record<string, unknown>): CounsellorApplicationItemDTO {
    const applicantName = `${String(row.applicant_first_name || "")} ${String(row.applicant_last_name || "")}`.trim() || String(row.applicant_email || "");
    const reviewerName = row.reviewer_first_name
      ? `${String(row.reviewer_first_name)} ${String(row.reviewer_last_name || "")}`.trim()
      : null;

    return {
      id: String(row.id),
      userId: String(row.user_id),
      applicantName,
      applicantEmail: String(row.applicant_email),
      qualification: row.qualification ? String(row.qualification) : null,
      organization: row.organization ? String(row.organization) : null,
      status: String(row.status),
      reviewedBy: row.reviewed_by ? String(row.reviewed_by) : null,
      reviewerName,
      reviewedAt: row.reviewed_at ? new Date(row.reviewed_at as string | Date).toISOString() : null,
      reviewNotes: row.review_notes ? String(row.review_notes) : null,
      createdAt: new Date(row.created_at as string | Date).toISOString(),
      updatedAt: row.updated_at ? new Date(row.updated_at as string | Date).toISOString() : null,
    };
  }

  /**
   * Retrieves all canonical platform roles with aggregated user and permission counts.
   */
  async findAllRoles(): Promise<AdminRoleListResponseDTO> {
    const rolesQuery = `
      SELECT
        r.id,
        r.name,
        r.description,
        r.created_at,
        COUNT(DISTINCT ur.user_id)::int as user_count,
        COUNT(DISTINCT rp.permission_id)::int as permission_count
      FROM roles r
      LEFT JOIN user_roles ur ON r.id = ur.role_id
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      GROUP BY r.id, r.name, r.description, r.created_at
      ORDER BY
        CASE r.name
          WHEN 'SUPER_ADMIN' THEN 1
          WHEN 'PLATFORM_ADMIN' THEN 2
          WHEN 'COMPANY_ADMIN' THEN 3
          WHEN 'INSTITUTION_ADMIN' THEN 4
          WHEN 'CAREER_COUNSELLOR' THEN 5
          WHEN 'PARENT_GUARDIAN' THEN 6
          WHEN 'PARTICIPANT' THEN 7
          ELSE 8
        END ASC,
        r.name ASC
    `;

    const summaryQuery = `
      SELECT
        (SELECT COUNT(*)::int FROM roles) as total_roles,
        (SELECT COUNT(*)::int FROM permissions) as total_permissions,
        (SELECT COUNT(DISTINCT user_id)::int FROM user_roles) as total_assigned_users
    `;

    const [rolesRes, summaryRes] = await Promise.all([
      pool.query(rolesQuery),
      pool.query(summaryQuery),
    ]);

    const summary = summaryRes.rows[0] || {};
    const roles: AdminRoleListItemDTO[] = rolesRes.rows.map((row) => {
      const name = String(row.name);
      const isProtected = name === "SUPER_ADMIN" || name === "PLATFORM_ADMIN";
      return {
        id: String(row.id),
        name,
        description: row.description ? String(row.description) : null,
        userCount: parseInt(row.user_count || 0, 10),
        permissionCount: parseInt(row.permission_count || 0, 10),
        isSystemRole: true,
        isProtected,
        createdAt: new Date(row.created_at as string | Date).toISOString(),
      };
    });

    return {
      roles,
      totalRoles: parseInt(summary.total_roles || 0, 10),
      totalPermissions: parseInt(summary.total_permissions || 0, 10),
      totalAssignedUsers: parseInt(summary.total_assigned_users || 0, 10),
    };
  }

  /**
   * Retrieves single role details including assigned permissions and assigned users.
   */
  async findRoleByIdOrName(idOrName: string): Promise<AdminRoleDetailDTO | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrName);
    const roleQuery = isUuid
      ? `SELECT id, name, description, created_at FROM roles WHERE id = $1 LIMIT 1`
      : `SELECT id, name, description, created_at FROM roles WHERE UPPER(name) = UPPER($1) LIMIT 1`;

    const roleRes = await pool.query(roleQuery, [idOrName]);
    if (!roleRes.rows[0]) {
      return null;
    }

    const role = roleRes.rows[0];
    const roleId = role.id;
    const roleName = String(role.name);
    const isProtected = roleName === "SUPER_ADMIN" || roleName === "PLATFORM_ADMIN";

    // 1. Fetch assigned permissions
    const permsQuery = `
      SELECT p.id, p.name, p.description, p.category, p.created_at
      FROM role_permissions rp
      JOIN permissions p ON rp.permission_id = p.id
      WHERE rp.role_id = $1
      ORDER BY p.category ASC, p.name ASC
    `;
    const permsRes = await pool.query(permsQuery, [roleId]);
    const permissions: AdminRolePermissionDTO[] = permsRes.rows.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      description: row.description ? String(row.description) : null,
      category: row.category ? String(row.category) : null,
      createdAt: new Date(row.created_at as string | Date).toISOString(),
    }));

    // 2. Fetch assigned users (limit to 100 for safety and performance)
    const usersQuery = `
      SELECT u.id, u.email, u.first_name, u.last_name, u.status, ur.is_primary, ur.created_at as assigned_at
      FROM user_roles ur
      JOIN users u ON ur.user_id = u.id
      WHERE ur.role_id = $1
      ORDER BY ur.is_primary DESC, ur.created_at DESC
      LIMIT 100
    `;
    const usersRes = await pool.query(usersQuery, [roleId]);
    const users: AdminRoleAssignedUserDTO[] = usersRes.rows.map((row) => {
      const firstName = String(row.first_name || "");
      const lastName = String(row.last_name || "");
      const fullName = `${firstName} ${lastName}`.trim() || String(row.email || "Unnamed User");
      return {
        id: String(row.id),
        email: String(row.email),
        firstName,
        lastName,
        fullName,
        status: String(row.status || "ACTIVE"),
        isPrimary: Boolean(row.is_primary),
        assignedAt: new Date(row.assigned_at as string | Date).toISOString(),
      };
    });

    // 3. Count total users
    const countRes = await pool.query(`SELECT COUNT(*)::int as total FROM user_roles WHERE role_id = $1`, [roleId]);
    const userCount = parseInt(countRes.rows[0]?.total || 0, 10);

    return {
      id: String(role.id),
      name: roleName,
      description: role.description ? String(role.description) : null,
      userCount,
      permissionCount: permissions.length,
      isSystemRole: true,
      isProtected,
      createdAt: new Date(role.created_at as string | Date).toISOString(),
      permissions,
      users,
    };
  }

  /**
   * Retrieves all platform permissions with usage statistics.
   */
  async findAllPermissions(): Promise<AdminPermissionListItemDTO[]> {
    const query = `
      SELECT
        p.id,
        p.name,
        p.description,
        p.category,
        p.created_at,
        COUNT(DISTINCT rp.role_id)::int as roles_count
      FROM permissions p
      LEFT JOIN role_permissions rp ON p.id = rp.permission_id
      GROUP BY p.id, p.name, p.description, p.category, p.created_at
      ORDER BY p.category ASC, p.name ASC
    `;
    const res = await pool.query(query);
    return res.rows.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      description: row.description ? String(row.description) : null,
      category: row.category ? String(row.category) : null,
      rolesCount: parseInt(row.roles_count || 0, 10),
      createdAt: new Date(row.created_at as string | Date).toISOString(),
    }));
  }

  /**
   * Retrieves complete system permission matrix for a specific role.
   */
  async findRolePermissionsMatrix(roleIdOrName: string): Promise<RolePermissionMatrixResponseDTO> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(roleIdOrName);
    const roleQuery = isUuid
      ? `SELECT id, name, description FROM roles WHERE id = $1 LIMIT 1`
      : `SELECT id, name, description FROM roles WHERE UPPER(name) = UPPER($1) LIMIT 1`;

    const roleRes = await pool.query(roleQuery, [roleIdOrName]);
    if (!roleRes.rows[0]) {
      throw AppError.notFound(`Role '${roleIdOrName}' not found.`, "ROLE_NOT_FOUND");
    }

    const role = roleRes.rows[0];
    const roleId = role.id;
    const roleName = String(role.name);
    const isProtected = roleName === "SUPER_ADMIN" || roleName === "PLATFORM_ADMIN";

    // Query all canonical system permissions and left join role_permissions
    const matrixQuery = `
      SELECT
        p.id,
        p.name,
        p.description,
        p.category,
        p.created_at,
        (rp.role_id IS NOT NULL) as is_assigned
      FROM permissions p
      LEFT JOIN role_permissions rp ON p.id = rp.permission_id AND rp.role_id = $1
      ORDER BY
        CASE p.category
          WHEN 'admin' THEN 1
          WHEN 'assessment' THEN 2
          WHEN 'institution' THEN 3
          WHEN 'result' THEN 4
          WHEN 'student' THEN 5
          ELSE 6
        END ASC,
        p.name ASC
    `;

    const matrixRes = await pool.query(matrixQuery, [roleId]);
    const categoriesSet = new Set<string>();
    let assignedCount = 0;

    const permissions: RolePermissionMatrixItemDTO[] = matrixRes.rows.map((row) => {
      const isAssigned = Boolean(row.is_assigned);
      if (isAssigned) assignedCount++;
      const cat = row.category ? String(row.category) : "general";
      categoriesSet.add(cat);

      return {
        id: String(row.id),
        name: String(row.name),
        description: row.description ? String(row.description) : null,
        category: row.category ? String(row.category) : null,
        isAssigned,
        createdAt: new Date(row.created_at as string | Date).toISOString(),
      };
    });

    return {
      role: {
        id: String(role.id),
        name: roleName,
        description: role.description ? String(role.description) : null,
        isSystemRole: true,
        isProtected,
      },
      permissions,
      categories: Array.from(categoriesSet),
      totalAvailablePermissions: permissions.length,
      assignedPermissionsCount: assignedCount,
    };
  }

  /**
   * Updates permission assignments for a role within an ACID transaction.
   * Enforces SUPER_ADMIN protection against removing root permissions.
   */
  async updateRolePermissions(
    adminUserId: string,
    roleIdOrName: string,
    requestedPermissionIdsOrNames: string[]
  ): Promise<UpdateRolePermissionsResponseDTO> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(roleIdOrName);
    const roleQuery = isUuid
      ? `SELECT id, name, description FROM roles WHERE id = $1 LIMIT 1`
      : `SELECT id, name, description FROM roles WHERE UPPER(name) = UPPER($1) LIMIT 1`;

    const roleRes = await pool.query(roleQuery, [roleIdOrName]);
    if (!roleRes.rows[0]) {
      throw AppError.notFound(`Role '${roleIdOrName}' not found.`, "ROLE_NOT_FOUND");
    }

    const role = roleRes.rows[0];
    const roleId = role.id;
    const roleName = String(role.name);
    const isProtected = roleName === "SUPER_ADMIN" || roleName === "PLATFORM_ADMIN";

    // Deduplicate requested items
    const rawKeys = Array.from(new Set(requestedPermissionIdsOrNames || []));

    // Resolve matching permission records from database
    let resolvedPermissionIds: string[] = [];
    if (rawKeys.length > 0) {
      const permsRes = await pool.query(
        `SELECT id, name FROM permissions WHERE id::text = ANY($1::text[]) OR name = ANY($1::text[])`,
        [rawKeys]
      );

      if (permsRes.rows.length !== rawKeys.length) {
        const foundKeys = new Set([...permsRes.rows.map((r) => r.id), ...permsRes.rows.map((r) => r.name)]);
        const invalidKeys = rawKeys.filter((k) => !foundKeys.has(k));
        throw AppError.badRequest(
          `Invalid permission identifiers specified: ${invalidKeys.join(", ")}`,
          "INVALID_PERMISSIONS"
        );
      }

      resolvedPermissionIds = permsRes.rows.map((r) => r.id as string);
    }

    // SUPER_ADMIN Safeguard: Ensure SUPER_ADMIN retains 'admin.all'
    if (roleName === "SUPER_ADMIN") {
      const adminAllRes = await pool.query(`SELECT id FROM permissions WHERE name = 'admin.all' LIMIT 1`);
      const adminAllId = adminAllRes.rows[0]?.id;
      if (adminAllId && !resolvedPermissionIds.includes(adminAllId)) {
        throw AppError.badRequest(
          "Cannot remove 'admin.all' root permission from SUPER_ADMIN role. Root administrative access is protected.",
          "CANNOT_STRIP_SUPER_ADMIN_PERMISSIONS"
        );
      }
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Clear existing assignments for this role
      await client.query(`DELETE FROM role_permissions WHERE role_id = $1`, [roleId]);

      // 2. Insert new assignments
      if (resolvedPermissionIds.length > 0) {
        for (const permId of resolvedPermissionIds) {
          await client.query(
            `INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [roleId, permId]
          );
        }
      }

      await client.query("COMMIT");

      logger.info(
        { adminUserId, roleId, roleName, count: resolvedPermissionIds.length },
        "Role permissions updated successfully"
      );
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    const matrix = await this.findRolePermissionsMatrix(roleId);

    return {
      success: true,
      message: `Permissions for role '${roleName}' updated successfully (${resolvedPermissionIds.length} granted).`,
      role: {
        id: String(role.id),
        name: roleName,
        description: role.description ? String(role.description) : null,
        isSystemRole: true,
        isProtected,
      },
      permissions: matrix.permissions,
      assignedPermissionsCount: matrix.assignedPermissionsCount,
    };
  }

  /**
   * Retrieves all registered dashboard features ordered by category and sort order.
   */
  async findAllDashboardFeatures(): Promise<DashboardFeatureItemDTO[]> {
    const query = `
      SELECT id, key, name, description, category, icon, route, required_permission, sort_order, is_active
      FROM dashboard_features
      WHERE is_active = true
      ORDER BY
        CASE category
          WHEN 'CORE' THEN 1
          WHEN 'ASSESSMENTS & REPORTS' THEN 2
          WHEN 'COMMUNICATION' THEN 3
          WHEN 'INSIGHTS' THEN 4
          WHEN 'ACCOUNT' THEN 5
          ELSE 6
        END ASC,
        sort_order ASC,
        name ASC
    `;
    const res = await pool.query(query);
    return res.rows.map((row) => ({
      id: String(row.id),
      key: String(row.key),
      name: String(row.name),
      description: row.description ? String(row.description) : null,
      category: String(row.category),
      icon: row.icon ? String(row.icon) : null,
      route: row.route ? String(row.route) : null,
      requiredPermission: row.required_permission ? String(row.required_permission) : null,
      sortOrder: parseInt(row.sort_order || 0, 10),
      isActive: Boolean(row.is_active),
    }));
  }

  /**
   * Retrieves the complete dashboard features matrix for a specific role.
   * Includes permission requirement verification.
   */
  async findRoleDashboardFeatures(roleIdOrName: string): Promise<RoleDashboardFeaturesResponseDTO> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(roleIdOrName);
    const roleQuery = isUuid
      ? `SELECT id, name, description FROM roles WHERE id = $1 LIMIT 1`
      : `SELECT id, name, description FROM roles WHERE UPPER(name) = UPPER($1) LIMIT 1`;

    const roleRes = await pool.query(roleQuery, [roleIdOrName]);
    if (!roleRes.rows[0]) {
      throw AppError.notFound(`Role '${roleIdOrName}' not found.`, "ROLE_NOT_FOUND");
    }

    const role = roleRes.rows[0];
    const roleId = String(role.id);
    const roleName = String(role.name);
    const isProtected = roleName === "SUPER_ADMIN" || roleName === "PLATFORM_ADMIN";

    // 1. Fetch role's assigned permissions to check dependency status
    const permsRes = await pool.query(
      `SELECT p.name FROM role_permissions rp JOIN permissions p ON rp.permission_id = p.id WHERE rp.role_id = $1`,
      [roleId]
    );
    const rolePermissions = new Set(permsRes.rows.map((r) => String(r.name)));
    const isSuperAdminRole = roleName === "SUPER_ADMIN" || rolePermissions.has("admin.all");

    // 2. Fetch all active features with role enablement status
    const featuresQuery = `
      SELECT
        df.id,
        df.key,
        df.name,
        df.description,
        df.category,
        df.icon,
        df.route,
        df.required_permission,
        df.sort_order,
        df.is_active,
        COALESCE(rdf.is_enabled, false) as is_enabled
      FROM dashboard_features df
      LEFT JOIN role_dashboard_features rdf ON df.id = rdf.feature_id AND rdf.role_id = $1
      WHERE df.is_active = true
      ORDER BY
        CASE df.category
          WHEN 'CORE' THEN 1
          WHEN 'ASSESSMENTS & REPORTS' THEN 2
          WHEN 'COMMUNICATION' THEN 3
          WHEN 'INSIGHTS' THEN 4
          WHEN 'ACCOUNT' THEN 5
          ELSE 6
        END ASC,
        df.sort_order ASC,
        df.name ASC
    `;
    const featuresRes = await pool.query(featuresQuery, [roleId]);

    const categoriesSet = new Set<string>();
    let enabledCount = 0;

    const features: RoleDashboardFeatureItemDTO[] = featuresRes.rows.map((row) => {
      const category = String(row.category);
      categoriesSet.add(category);
      const isEnabled = Boolean(row.is_enabled);
      if (isEnabled) enabledCount++;

      const requiredPermission = row.required_permission ? String(row.required_permission) : null;
      // Permission is granted if no permission required, or role has admin.all, or role explicitly has the permission
      const isPermissionGranted = !requiredPermission || isSuperAdminRole || rolePermissions.has(requiredPermission);

      return {
        id: String(row.id),
        key: String(row.key),
        name: String(row.name),
        description: row.description ? String(row.description) : null,
        category,
        icon: row.icon ? String(row.icon) : null,
        route: row.route ? String(row.route) : null,
        requiredPermission,
        sortOrder: parseInt(row.sort_order || 0, 10),
        isActive: Boolean(row.is_active),
        isEnabled,
        isPermissionGranted,
      };
    });

    return {
      role: {
        id: roleId,
        name: roleName,
        description: role.description ? String(role.description) : null,
        isSystemRole: true,
        isProtected,
      },
      features,
      categories: Array.from(categoriesSet),
      totalFeaturesCount: features.length,
      enabledFeaturesCount: enabledCount,
    };
  }

  /**
   * Atomically updates a role's dashboard feature configuration.
   * Logs audit trail of state changes.
   */
  async updateRoleDashboardFeatures(
    adminUserId: string,
    roleIdOrName: string,
    featureMap: Record<string, boolean>
  ): Promise<UpdateRoleDashboardFeaturesResponseDTO> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(roleIdOrName);
    const roleQuery = isUuid
      ? `SELECT id, name, description FROM roles WHERE id = $1 LIMIT 1`
      : `SELECT id, name, description FROM roles WHERE UPPER(name) = UPPER($1) LIMIT 1`;

    const roleRes = await pool.query(roleQuery, [roleIdOrName]);
    if (!roleRes.rows[0]) {
      throw AppError.notFound(`Role '${roleIdOrName}' not found.`, "ROLE_NOT_FOUND");
    }

    const role = roleRes.rows[0];
    const roleId = String(role.id);
    const roleName = String(role.name);

    // Fetch all valid features from database
    const allFeaturesRes = await pool.query(`SELECT id, key FROM dashboard_features WHERE is_active = true`);
    const featureKeyToId = new Map<string, string>();
    for (const row of allFeaturesRes.rows) {
      featureKeyToId.set(String(row.key), String(row.id));
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      for (const [key, nextState] of Object.entries(featureMap)) {
        const featureId = featureKeyToId.get(key);
        if (!featureId) continue;

        // Check previous state
        const prevRes = await client.query(
          `SELECT is_enabled FROM role_dashboard_features WHERE role_id = $1 AND feature_id = $2`,
          [roleId, featureId]
        );
        const previousState = prevRes.rows.length > 0 ? Boolean(prevRes.rows[0].is_enabled) : false;

        // Upsert into role_dashboard_features
        await client.query(
          `
          INSERT INTO role_dashboard_features (role_id, feature_id, is_enabled, updated_at)
          VALUES ($1, $2, $3, NOW())
          ON CONFLICT (role_id, feature_id)
          DO UPDATE SET is_enabled = $3, updated_at = NOW()
          `,
          [roleId, featureId, nextState]
        );

        // Record audit log if state changed
        if (prevRes.rows.length === 0 || previousState !== nextState) {
          await client.query(
            `
            INSERT INTO role_feature_audit_logs (admin_user_id, role_id, feature_key, previous_state, new_state)
            VALUES ($1, $2, $3, $4, $5)
            `,
            [adminUserId, roleId, key, previousState, nextState]
          );
        }
      }

      await client.query("COMMIT");
      logger.info(
        { adminUserId, roleId, roleName, count: Object.keys(featureMap).length },
        "Role dashboard features updated successfully"
      );
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    const updated = await this.findRoleDashboardFeatures(roleId);

    return {
      success: true,
      message: `Dashboard features for role '${roleName}' updated successfully (${updated.enabledFeaturesCount}/${updated.totalFeaturesCount} enabled).`,
      role: {
        id: roleId,
        name: roleName,
      },
      features: updated.features,
      enabledFeaturesCount: updated.enabledFeaturesCount,
    };
  }
  /**
   * Retrieves complete access management details for a counsellor (user, role, profile, features, permissions).
   */
  async findCounsellorAccess(idOrUserId: string): Promise<AdminCounsellorAccessDTO> {
    if (!idOrUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrUserId)) {
      throw AppError.notFound("Counsellor not found.", "COUNSELLOR_NOT_FOUND");
    }

    const query = `
      SELECT u.id as user_id, u.email, u.first_name, u.last_name, u.status,
             ca.id as app_id, ca.status as app_status, ca.qualification as app_qualification,
             ca.organization as app_organization, ca.reviewed_at as app_reviewed_at,
             c.id as counsellor_id, c.qualification as counsellor_qualification,
             c.experience_years, c.bio, c.specialisations, c.languages, c.guidance_areas,
             c.approval_status as counsellor_approval_status,
             r.id as role_id, r.name as role_name, r.description as role_description
      FROM users u
      LEFT JOIN counsellor_applications ca ON ca.user_id = u.id
      LEFT JOIN counsellors c ON c.user_id = u.id
      LEFT JOIN user_roles ur ON ur.user_id = u.id AND ur.is_primary = true
      LEFT JOIN roles r ON r.id = ur.role_id
      WHERE u.id = $1 OR ca.id = $1 OR c.id = $1
      ORDER BY ca.created_at DESC NULLS LAST
      LIMIT 1
    `;

    const res = await pool.query(query, [idOrUserId]);
    if (!res.rows[0]) {
      throw AppError.notFound("Counsellor not found.", "COUNSELLOR_NOT_FOUND");
    }

    const row = res.rows[0];
    const roleName = row.role_name || "CAREER_COUNSELLOR";

    const featuresMatrix = await this.findRoleDashboardFeatures(roleName);
    const permissionsMatrix = await this.findRolePermissionsMatrix(roleName);

    // Calculate effective counts and missing required permissions
    const enabledFeatures = featuresMatrix.features.filter((f) => f.isEnabled);
    const missingPermissions = enabledFeatures.filter((f) => !f.isPermissionGranted);

    return {
      user: {
        id: row.user_id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        fullName: `${row.first_name} ${row.last_name}`.trim() || row.email,
        status: row.status,
        role: roleName,
        avatarUrl: null,
      },
      counsellor: row.counsellor_id
        ? {
            id: row.counsellor_id,
            qualification: row.counsellor_qualification || "Certified Career Guidance Counsellor",
            experienceYears: row.experience_years || 0,
            bio: row.bio || "",
            specialisations: row.specialisations || [],
            languages: row.languages || ["English"],
            guidanceAreas: row.guidance_areas || [],
            approvalStatus: row.counsellor_approval_status || "APPROVED",
          }
        : null,
      application: row.app_id
        ? {
            id: row.app_id,
            status: row.app_status,
            qualification: row.app_qualification,
            organization: row.app_organization,
            reviewedAt: row.app_reviewed_at ? row.app_reviewed_at.toISOString() : null,
          }
        : null,
      role: {
        id: featuresMatrix.role.id,
        name: featuresMatrix.role.name,
        description: featuresMatrix.role.description,
      },
      features: featuresMatrix.features,
      permissions: permissionsMatrix.permissions,
      effectiveSummary: {
        totalFeatures: featuresMatrix.totalFeaturesCount,
        enabledFeaturesCount: featuresMatrix.enabledFeaturesCount,
        totalPermissions: permissionsMatrix.totalAvailablePermissions,
        activePermissionsCount: permissionsMatrix.assignedPermissionsCount,
        missingRequiredPermissionsCount: missingPermissions.length,
      },
    };
  }

  /**
   * Updates counsellor practitioner profile across users, applications, and counsellors tables.
   */
  async updateCounsellorProfile(
    adminUserId: string,
    idOrUserId: string,
    dto: UpdateCounsellorProfileRequestDTO
  ): Promise<AdminCounsellorAccessDTO> {
    if (!idOrUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrUserId)) {
      throw AppError.notFound("Counsellor not found.", "COUNSELLOR_NOT_FOUND");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Find user and counsellor records with lock
      const userRes = await client.query(
        `SELECT u.id, u.first_name, u.last_name, ca.id as app_id, c.id as counsellor_id
         FROM users u
         LEFT JOIN counsellor_applications ca ON ca.user_id = u.id
         LEFT JOIN counsellors c ON c.user_id = u.id
         WHERE u.id = $1 OR ca.id = $1 OR c.id = $1
         LIMIT 1
         FOR UPDATE OF u`,
        [idOrUserId]
      );

      if (!userRes.rows[0]) {
        throw AppError.notFound("Counsellor not found.", "COUNSELLOR_NOT_FOUND");
      }

      const targetUser = userRes.rows[0];
      const userId = targetUser.id;

      // 1. Update user names if provided
      if (dto.firstName !== undefined || dto.lastName !== undefined) {
        await client.query(
          `UPDATE users
           SET first_name = COALESCE($1, first_name),
               last_name = COALESCE($2, last_name),
               updated_at = NOW()
           WHERE id = $3`,
          [dto.firstName?.trim() ?? null, dto.lastName?.trim() ?? null, userId]
        );
      }

      // 2. Update counsellor_applications if row exists
      if (dto.qualification !== undefined || dto.organization !== undefined) {
        await client.query(
          `UPDATE counsellor_applications
           SET qualification = COALESCE($1, qualification),
               organization = COALESCE($2, organization),
               updated_at = NOW()
           WHERE user_id = $3`,
          [dto.qualification?.trim() ?? null, dto.organization?.trim() ?? null, userId]
        );
      }

      // 3. Update or create counsellors profile
      if (targetUser.counsellor_id) {
        await client.query(
          `UPDATE counsellors
           SET qualification = COALESCE($1, qualification),
               bio = COALESCE($2, bio),
               experience_years = COALESCE($3, experience_years),
               specialisations = COALESCE($4, specialisations),
               languages = COALESCE($5, languages),
               guidance_areas = COALESCE($6, guidance_areas),
               updated_at = NOW()
           WHERE user_id = $7`,
          [
            dto.qualification?.trim() ?? null,
            dto.bio?.trim() ?? null,
            dto.experienceYears !== undefined ? dto.experienceYears : null,
            dto.specialisations ? JSON.stringify(dto.specialisations) : null,
            dto.languages ? JSON.stringify(dto.languages) : null,
            dto.guidanceAreas ? JSON.stringify(dto.guidanceAreas) : null,
            userId,
          ]
        );
      }

      await client.query("COMMIT");
      logger.info(
        { adminUserId, targetUserId: userId, dto },
        "Counsellor practitioner profile updated successfully"
      );
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    return this.findCounsellorAccess(idOrUserId);
  }

  /**
   * Suspends counsellor account, invalidates active sessions, and marks profile suspended.
   */
  async suspendCounsellor(adminUserId: string, idOrUserId: string): Promise<AdminUserListItemDTO> {
    if (!idOrUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrUserId)) {
      throw AppError.notFound("Counsellor not found.", "COUNSELLOR_NOT_FOUND");
    }

    const userRes = await pool.query(
      `SELECT u.id, u.status FROM users u
       LEFT JOIN counsellor_applications ca ON ca.user_id = u.id
       LEFT JOIN counsellors c ON c.user_id = u.id
       WHERE u.id = $1 OR ca.id = $1 OR c.id = $1 LIMIT 1`,
      [idOrUserId]
    );

    if (!userRes.rows[0]) {
      throw AppError.notFound("Counsellor not found.", "COUNSELLOR_NOT_FOUND");
    }

    const userId = userRes.rows[0].id;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Invalidate active auth sessions
      await client.query(`UPDATE sessions SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL`, [userId]);

      // Update users.status = 'SUSPENDED'
      await client.query(`UPDATE users SET status = 'SUSPENDED', updated_at = NOW() WHERE id = $1`, [userId]);

      // Update counsellors.approval_status = 'SUSPENDED'
      await client.query(`UPDATE counsellors SET approval_status = 'SUSPENDED', updated_at = NOW() WHERE user_id = $1`, [userId]);

      await client.query("COMMIT");
      logger.info({ adminUserId, targetUserId: userId }, "Counsellor account suspended successfully");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    return this.findUserAdminDetail(userId);
  }

  /**
   * Reactivates a suspended counsellor account.
   */
  async reactivateCounsellor(adminUserId: string, idOrUserId: string): Promise<AdminUserListItemDTO> {
    if (!idOrUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrUserId)) {
      throw AppError.notFound("Counsellor not found.", "COUNSELLOR_NOT_FOUND");
    }

    const userRes = await pool.query(
      `SELECT u.id, u.status FROM users u
       LEFT JOIN counsellor_applications ca ON ca.user_id = u.id
       LEFT JOIN counsellors c ON c.user_id = u.id
       WHERE u.id = $1 OR ca.id = $1 OR c.id = $1 LIMIT 1`,
      [idOrUserId]
    );

    if (!userRes.rows[0]) {
      throw AppError.notFound("Counsellor not found.", "COUNSELLOR_NOT_FOUND");
    }

    const userId = userRes.rows[0].id;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Update users.status = 'ACTIVE'
      await client.query(`UPDATE users SET status = 'ACTIVE', updated_at = NOW() WHERE id = $1`, [userId]);

      // Update counsellors.approval_status = 'APPROVED'
      await client.query(`UPDATE counsellors SET approval_status = 'APPROVED', updated_at = NOW() WHERE user_id = $1`, [userId]);

      await client.query("COMMIT");
      logger.info({ adminUserId, targetUserId: userId }, "Counsellor account reactivated successfully");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    return this.findUserAdminDetail(userId);
  }

  /**
   * Safely deletes an application or deactivates an approved counsellor with dependency protection.
   */
  async deleteOrDeactivateCounsellor(
    adminUserId: string,
    idOrUserId: string
  ): Promise<DeleteCounsellorResultDTO> {
    if (!idOrUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrUserId)) {
      throw AppError.notFound("Counsellor application not found.", "APPLICATION_NOT_FOUND");
    }

    const userRes = await pool.query(
      `SELECT u.id as user_id, u.status as user_status,
              ca.id as app_id, ca.status as app_status,
              c.id as counsellor_id
       FROM users u
       LEFT JOIN counsellor_applications ca ON ca.user_id = u.id
       LEFT JOIN counsellors c ON c.user_id = u.id
       WHERE u.id = $1 OR ca.id = $1 OR c.id = $1
       LIMIT 1`,
      [idOrUserId]
    );

    if (!userRes.rows[0]) {
      throw AppError.notFound("Counsellor application not found.", "APPLICATION_NOT_FOUND");
    }

    const row = userRes.rows[0];
    const userId = row.user_id;
    const appId = row.app_id;
    const counsellorId = row.counsellor_id;
    const isApproved = row.app_status === "APPROVED";

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // If pending or rejected, delete the application directly
      if (!isApproved) {
        if (appId) {
          await client.query(`DELETE FROM counsellor_applications WHERE id = $1`, [appId]);
        }

        // Check if user has other administrative or institutional staff roles
        const isStaffRes = await client.query(
          `SELECT 1 FROM user_roles ur
           JOIN roles r ON r.id = ur.role_id
           WHERE ur.user_id = $1 AND r.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN', 'COMPANY_ADMIN', 'INSTITUTION_ADMIN')`,
          [userId]
        );

        if (isStaffRes.rows.length === 0) {
          // Check if user has assessment attempts using participant_id
          const hasAssessments = await client.query(
            `SELECT 1 FROM assessment_attempts WHERE participant_id = $1 LIMIT 1`,
            [userId]
          );

          if (hasAssessments.rows.length === 0) {
            // Nullify any reviewed_by references if any exist to prevent foreign key errors
            await client.query(
              `UPDATE counsellor_applications SET reviewed_by = NULL WHERE reviewed_by = $1`,
              [userId]
            );
            await client.query(
              `UPDATE institution_applications SET reviewed_by = NULL WHERE reviewed_by = $1`,
              [userId]
            );

            // Delete user - cascades to user_roles, auth_identities, sessions, profiles
            await client.query(`DELETE FROM users WHERE id = $1`, [userId]);
          }
        }

        await client.query("COMMIT");
        logger.info({ adminUserId, applicationId: appId, userId }, "Pending/Rejected counsellor application deleted");

        return {
          success: true,
          message: "Counsellor application has been removed successfully.",
          actionTaken: "HARD_DELETED",
        };
      }

      // If approved, check foreign key historical dependencies
      let sessionsCount = 0;
      let notesCount = 0;
      let consentsCount = 0;

      if (counsellorId) {
        const sessRes = await client.query(
          `SELECT COUNT(*)::int as count FROM counselling_sessions WHERE counsellor_id = $1`,
          [counsellorId]
        );
        sessionsCount = sessRes.rows[0]?.count || 0;

        const notesRes = await client.query(
          `SELECT COUNT(*)::int as count FROM counselling_notes WHERE counsellor_id = $1`,
          [counsellorId]
        );
        notesCount = notesRes.rows[0]?.count || 0;

        const consentsRes = await client.query(
          `SELECT COUNT(*)::int as count FROM student_counsellor_consent WHERE counsellor_id = $1`,
          [counsellorId]
        );
        consentsCount = consentsRes.rows[0]?.count || 0;
      }

      const totalHistoricalRecords = sessionsCount + notesCount + consentsCount;

      if (totalHistoricalRecords > 0) {
        // Soft deactivate to protect historical student data
        await client.query(`UPDATE users SET status = 'DISABLED', updated_at = NOW() WHERE id = $1`, [userId]);
        await client.query(`UPDATE sessions SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL`, [userId]);
        if (counsellorId) {
          await client.query(`UPDATE counsellors SET approval_status = 'DISABLED', updated_at = NOW() WHERE id = $1`, [counsellorId]);
        }
        if (appId) {
          await client.query(`UPDATE counsellor_applications SET status = 'REJECTED', review_notes = 'Account deactivated by administrator.', updated_at = NOW() WHERE id = $1`, [appId]);
        }

        await client.query("COMMIT");
        logger.info(
          { adminUserId, userId, counsellorId, sessionsCount, notesCount, consentsCount },
          "Counsellor account deactivated (soft-delete) to preserve historical data"
        );

        return {
          success: true,
          message: `Counsellor account deactivated. ${sessionsCount} sessions and historical student records have been safely preserved.`,
          actionTaken: "SOFT_DEACTIVATED",
          details: {
            sessionsCount,
            notesCount,
            consentsCount,
          },
        };
      } else {
        // Zero dependent records - hard delete cleanly
        await client.query(`DELETE FROM users WHERE id = $1`, [userId]);

        await client.query("COMMIT");
        logger.info({ adminUserId, userId }, "Counsellor account permanently deleted (zero historical records)");

        return {
          success: true,
          message: "Counsellor account has been permanently deleted.",
          actionTaken: "HARD_DELETED",
        };
      }
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}

export const adminRepository = new AdminRepository();




