import { pool } from "../../config/database";
import { logger } from "../../common/utils/logger";
import {
  InstitutionEntity,
  InstitutionClassEntity,
  InstitutionOverviewStatsDTO,
  UpdateInstitutionProfileDTO,
  CreateInstitutionClassDTO,
  InstitutionStudentEntity,
  InstitutionAssessmentEntity,
  AssignAssessmentDTO,
  InstitutionStudentInvitationEntity,
  InstitutionStudentCampaignEntity,
  InstitutionEmailJobEntity,
  InvitationCampaignStatus,
  InvitationDeliveryStatus,
} from "./institution.types";
import { PoolClient } from "pg";

export class InstitutionRepository {
  /**
   * Initializes PostgreSQL tables for institutions, classes, student links, assessments, and staff.
   */
  async initSchema(): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Core Institutions Profile Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS institutions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          code VARCHAR(50) UNIQUE NOT NULL,
          type VARCHAR(100) NOT NULL DEFAULT 'K-12 School',
          contact_email VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NULL,
          address VARCHAR(255) NULL,
          city VARCHAR(100) NULL,
          state VARCHAR(100) NULL,
          country VARCHAR(100) NOT NULL DEFAULT 'India',
          student_capacity INT NOT NULL DEFAULT 500,
          logo_url VARCHAR(500) NULL,
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          CONSTRAINT uq_institution_admin UNIQUE (admin_user_id)
        );
      `);

      // 2. Institution Classes / Cohorts Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS institution_classes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
          academic_year VARCHAR(20) NOT NULL DEFAULT '2026-2027',
          grade_level VARCHAR(50) NOT NULL,
          division VARCHAR(20) NOT NULL,
          name VARCHAR(100) NOT NULL,
          coordinator_name VARCHAR(100) NULL,
          student_count INT NOT NULL DEFAULT 0,
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          CONSTRAINT uq_institution_class UNIQUE (institution_id, academic_year, grade_level, division)
        );
      `);

      // 3. Institution Students Link Table (Strictly references canonical users table)
      await client.query(`
        CREATE TABLE IF NOT EXISTS institution_students (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
          class_id UUID NULL REFERENCES institution_classes(id) ON DELETE SET NULL,
          student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          roll_number VARCHAR(50) NULL,
          academic_year VARCHAR(20) NOT NULL DEFAULT '2026-2027',
          status VARCHAR(50) NOT NULL DEFAULT 'ENROLLED',
          joined_at TIMESTAMPTZ DEFAULT NOW(),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          CONSTRAINT uq_institution_student UNIQUE (institution_id, student_id)
        );
      `);

      // 4. Institution Assessment Allocations Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS institution_assessments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
          class_id UUID NULL REFERENCES institution_classes(id) ON DELETE CASCADE,
          assessment_code VARCHAR(50) NOT NULL,
          title VARCHAR(255) NOT NULL,
          deadline DATE NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
          total_assigned INT NOT NULL DEFAULT 0,
          completed_count INT NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // 5. Institution Staff & Coordinators Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS institution_staff (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          role_title VARCHAR(100) NOT NULL,
          department VARCHAR(100) NULL,
          permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          CONSTRAINT uq_institution_staff_user UNIQUE (institution_id, user_id)
        );
      `);

      // 6. Institution Student Campaigns Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS institution_student_campaigns (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
          class_id UUID NULL REFERENCES institution_classes(id) ON DELETE SET NULL,
          created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          total_count INT NOT NULL DEFAULT 0,
          queued_count INT NOT NULL DEFAULT 0,
          processing_count INT NOT NULL DEFAULT 0,
          sent_count INT NOT NULL DEFAULT 0,
          delivered_count INT NOT NULL DEFAULT 0,
          failed_count INT NOT NULL DEFAULT 0,
          bounced_count INT NOT NULL DEFAULT 0,
          accepted_count INT NOT NULL DEFAULT 0,
          status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          started_at TIMESTAMPTZ NULL,
          completed_at TIMESTAMPTZ NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      // 7. Institution Student Invitations Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS institution_student_invitations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
          campaign_id UUID NULL REFERENCES institution_student_campaigns(id) ON DELETE SET NULL,
          class_id UUID NULL REFERENCES institution_classes(id) ON DELETE SET NULL,
          email VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          roll_number VARCHAR(50) NULL,
          academic_year VARCHAR(20) NOT NULL DEFAULT '2026-2027',
          token_hash VARCHAR(64) UNIQUE NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
          delivery_status VARCHAR(50) NOT NULL DEFAULT 'QUEUED',
          delivery_event_at TIMESTAMPTZ NULL,
          provider_message_id VARCHAR(255) NULL,
          failure_reason TEXT NULL,
          invited_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          accepted_by_user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          sent_at TIMESTAMPTZ DEFAULT NOW(),
          accepted_at TIMESTAMPTZ NULL,
          revoked_at TIMESTAMPTZ NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // 8. Durable Asynchronous Email Jobs Table (PostgreSQL Outbox/Job Queue)
      await client.query(`
        CREATE TABLE IF NOT EXISTS institution_email_jobs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          campaign_id UUID NULL REFERENCES institution_student_campaigns(id) ON DELETE SET NULL,
          invitation_id UUID NOT NULL REFERENCES institution_student_invitations(id) ON DELETE CASCADE,
          institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
          recipient_email VARCHAR(255) NOT NULL,
          recipient_name VARCHAR(255) NOT NULL,
          raw_token VARCHAR(255) NOT NULL DEFAULT '',
          status VARCHAR(50) NOT NULL DEFAULT 'QUEUED',
          attempts INT NOT NULL DEFAULT 0,
          max_attempts INT NOT NULL DEFAULT 3,
          scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          processed_at TIMESTAMPTZ NULL,
          completed_at TIMESTAMPTZ NULL,
          last_error TEXT NULL,
          is_permanent_failure BOOLEAN NOT NULL DEFAULT false,
          provider_message_id VARCHAR(255) NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          CONSTRAINT uq_invitation_job UNIQUE (invitation_id)
        );
      `);

      // Ensure migrations for existing installations
      await client.query(`
        ALTER TABLE institution_student_invitations ADD COLUMN IF NOT EXISTS campaign_id UUID NULL REFERENCES institution_student_campaigns(id) ON DELETE SET NULL;
        ALTER TABLE institution_student_invitations ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(50) NOT NULL DEFAULT 'QUEUED';
        ALTER TABLE institution_student_invitations ADD COLUMN IF NOT EXISTS delivery_event_at TIMESTAMPTZ NULL;
        ALTER TABLE institution_student_invitations ADD COLUMN IF NOT EXISTS provider_message_id VARCHAR(255) NULL;
        ALTER TABLE institution_student_invitations ADD COLUMN IF NOT EXISTS failure_reason TEXT NULL;
      `);

      // Indexes for performance, isolation, and queue polling
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_institutions_admin ON institutions(admin_user_id);
        CREATE INDEX IF NOT EXISTS idx_institution_classes_inst ON institution_classes(institution_id);
        CREATE INDEX IF NOT EXISTS idx_institution_students_inst ON institution_students(institution_id);
        CREATE INDEX IF NOT EXISTS idx_institution_students_student ON institution_students(student_id);
        CREATE INDEX IF NOT EXISTS idx_institution_students_class ON institution_students(class_id);
        CREATE INDEX IF NOT EXISTS idx_institution_assessments_inst ON institution_assessments(institution_id);
        CREATE INDEX IF NOT EXISTS idx_inst_campaigns_inst ON institution_student_campaigns(institution_id);
        CREATE INDEX IF NOT EXISTS idx_inst_campaigns_status ON institution_student_campaigns(status);
        CREATE INDEX IF NOT EXISTS idx_inst_invitations_inst ON institution_student_invitations(institution_id);
        CREATE INDEX IF NOT EXISTS idx_inst_invitations_camp ON institution_student_invitations(campaign_id);
        CREATE INDEX IF NOT EXISTS idx_inst_invitations_email ON institution_student_invitations(LOWER(email));
        CREATE INDEX IF NOT EXISTS idx_inst_invitations_token ON institution_student_invitations(token_hash);
        CREATE INDEX IF NOT EXISTS idx_inst_invitations_status ON institution_student_invitations(status);
        CREATE INDEX IF NOT EXISTS idx_inst_email_jobs_poll ON institution_email_jobs(status, scheduled_at) WHERE status = 'QUEUED';
        CREATE INDEX IF NOT EXISTS idx_inst_email_jobs_inst ON institution_email_jobs(institution_id);
        CREATE INDEX IF NOT EXISTS idx_inst_email_jobs_camp ON institution_email_jobs(campaign_id);
        CREATE INDEX IF NOT EXISTS idx_inst_email_jobs_msg ON institution_email_jobs(provider_message_id);
      `);

      await client.query("COMMIT");
      logger.info("📦 Institution Dashboard database schema initialized and verified.");
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error({ err }, "Error initializing Institution schema");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Retrieves real database activity timeline for an institution.
   */
  async getRecentActivities(institutionId: string): Promise<Array<{
    id: string;
    type: "ENROLLMENT" | "ASSESSMENT" | "SESSION" | "PARENT";
    title: string;
    description: string;
    timestamp: string;
  }>> {
    const query = `
      SELECT * FROM (
        -- 1. Student Enrollments
        SELECT
          CONCAT('act-enr-', ist.id::text) as id,
          'ENROLLMENT' as type,
          'Student Enrolled' as title,
          CONCAT(TRIM(CONCAT(u.first_name, ' ', u.last_name)), ' enrolled into ', COALESCE(ic.name, 'Institution Cohort')) as description,
          ist.joined_at as created_at
        FROM institution_students ist
        JOIN users u ON ist.student_id = u.id
        LEFT JOIN institution_classes ic ON ist.class_id = ic.id
        WHERE ist.institution_id = $1

        UNION ALL

        -- 2. Assessment Completions
        SELECT
          CONCAT('act-ass-', ar.id::text) as id,
          'ASSESSMENT' as type,
          'Assessment Completed' as title,
          CONCAT(TRIM(CONCAT(u.first_name, ' ', u.last_name)), ' completed psychometric assessment') as description,
          ar.created_at
        FROM assessment_results ar
        JOIN institution_students ist ON ar.participant_id = ist.student_id
        JOIN users u ON ist.student_id = u.id
        WHERE ist.institution_id = $1

        UNION ALL

        -- 3. Counselling Guidance Sessions
        SELECT
          CONCAT('act-ses-', cs.id::text) as id,
          'SESSION' as type,
          'Career Guidance Session' as title,
          CONCAT('Guidance session with ', TRIM(CONCAT(uc.first_name, ' ', uc.last_name)), ' for ', TRIM(CONCAT(us.first_name, ' ', us.last_name))) as description,
          cs.created_at
        FROM counselling_sessions cs
        JOIN institution_students ist ON cs.student_id = ist.student_id
        JOIN users us ON ist.student_id = us.id
        JOIN counsellors c ON cs.counsellor_id = c.id
        JOIN users uc ON c.user_id = uc.id
        WHERE ist.institution_id = $1

        UNION ALL

        -- 4. Parent Account Linkings
        SELECT
          CONCAT('act-par-', spl.id::text) as id,
          'PARENT' as type,
          'Parent Connected' as title,
          CONCAT('Parent linked to student ', TRIM(CONCAT(u.first_name, ' ', u.last_name))) as description,
          spl.created_at
        FROM student_parent_links spl
        JOIN institution_students ist ON spl.student_user_id = ist.student_id
        JOIN users u ON ist.student_id = u.id
        WHERE ist.institution_id = $1 AND spl.link_status = 'ACTIVE'
      ) recent_events
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const res = await pool.query(query, [institutionId]);
    return res.rows.map((r) => ({
      id: r.id,
      type: r.type,
      title: r.title,
      description: r.description,
      timestamp: new Date(r.created_at).toISOString(),
    }));
  }

  /**
   * Finds institution entity by admin user ID.
   */
  async findByAdminUserId(adminUserId: string): Promise<InstitutionEntity | null> {
    const query = `
      SELECT id, admin_user_id as "adminUserId", name, code, type, contact_email as "contactEmail",
             phone, address, city, state, country, student_capacity as "studentCapacity",
             logo_url as "logoUrl", is_active as "isActive",
             created_at as "createdAt", updated_at as "updatedAt"
      FROM institutions
      WHERE admin_user_id = $1
      LIMIT 1
    `;
    const res = await pool.query(query, [adminUserId]);
    return res.rows[0] || null;
  }

  /**
   * Finds or creates institution for authenticated admin user.
   */
  async findOrCreateInstitutionForAdmin(adminUserId: string): Promise<InstitutionEntity> {
    const existing = await this.findByAdminUserId(adminUserId);
    if (existing) return existing;

    // Fetch admin user name/email to auto-provision institution
    const userRes = await pool.query(
      `SELECT email, first_name, last_name FROM users WHERE id = $1 LIMIT 1`,
      [adminUserId]
    );
    const user = userRes.rows[0];
    const schoolName = user ? `${user.first_name}'s Educational Institution` : "Academic Institution";
    const code = `INST-${adminUserId.slice(0, 6).toUpperCase()}`;

    const insertRes = await pool.query(
      `INSERT INTO institutions (
         admin_user_id, name, code, type, contact_email, student_capacity, is_active
       )
       VALUES ($1, $2, $3, 'K-12 School', $4, 500, true)
       ON CONFLICT (admin_user_id) DO UPDATE SET updated_at = NOW()
       RETURNING id, admin_user_id as "adminUserId", name, code, type, contact_email as "contactEmail",
                 phone, address, city, state, country, student_capacity as "studentCapacity",
                 logo_url as "logoUrl", is_active as "isActive",
                 created_at as "createdAt", updated_at as "updatedAt"`,
      [adminUserId, schoolName, code, user?.email || "institution@3gmelife.com"]
    );

    return insertRes.rows[0];
  }

  /**
   * Retrieves aggregated 8-metric overview stats for an institution.
   */
  async getOverviewStats(institutionId: string): Promise<InstitutionOverviewStatsDTO> {
    const query = `
      SELECT
        COUNT(DISTINCT ist.student_id)::int as total_students,
        COUNT(DISTINCT CASE WHEN ist.status IN ('ENROLLED', 'ACTIVE') THEN ist.student_id END)::int as active_students,
        (SELECT COUNT(*)::int FROM institution_classes WHERE institution_id = $1 AND is_active = true) as total_classes,
        COUNT(DISTINCT ar.participant_id)::int as assessed_students,
        (
          SELECT COUNT(*)::int
          FROM counselling_sessions cs
          JOIN institution_students ist2 ON cs.student_id = ist2.student_id
          WHERE ist2.institution_id = $1 AND cs.session_date >= CURRENT_DATE AND cs.status = 'CONFIRMED'
        ) as upcoming_sessions,
        (
          SELECT COUNT(*)::int
          FROM counselling_sessions cs
          JOIN institution_students ist2 ON cs.student_id = ist2.student_id
          WHERE ist2.institution_id = $1 AND cs.status = 'COMPLETED'
        ) as completed_sessions,
        (
          SELECT COUNT(DISTINCT spl.student_user_id)::int
          FROM student_parent_links spl
          JOIN institution_students ist3 ON spl.student_user_id = ist3.student_id
          WHERE ist3.institution_id = $1 AND spl.link_status = 'ACTIVE'
        ) as connected_parents
      FROM institution_students ist
      LEFT JOIN assessment_results ar ON ist.student_id = ar.participant_id
      WHERE ist.institution_id = $1
    `;

    const res = await pool.query(query, [institutionId]);
    const row = res.rows[0] || {};

    const totalStudents = row.total_students || 0;
    const activeStudents = row.active_students || 0;
    const totalClasses = row.total_classes || 0;
    const assessedStudents = row.assessed_students || 0;
    const upcomingSessionsCount = row.upcoming_sessions || 0;
    const completedSessionsCount = row.completed_sessions || 0;
    const connectedParentsCount = row.connected_parents || 0;

    const assessmentCompletionRate =
      totalStudents > 0 ? Math.round((assessedStudents / totalStudents) * 100) : 0;
    const pendingAssessmentsCount = Math.max(0, totalStudents - assessedStudents);

    return {
      totalStudents,
      activeStudents,
      totalClasses,
      assessmentCompletionRate,
      pendingAssessmentsCount,
      upcomingSessionsCount,
      completedSessionsCount,
      connectedParentsCount,
    };
  }

  /**
   * Retrieves all classes / cohorts for an institution.
   */
  async findClassesByInstitutionId(institutionId: string): Promise<InstitutionClassEntity[]> {
    const query = `
      SELECT id, institution_id as "institutionId", academic_year as "academicYear",
             grade_level as "gradeLevel", division, name, coordinator_name as "coordinatorName",
             (
               SELECT COUNT(*)::int FROM institution_students is_stu
               WHERE is_stu.class_id = ic.id AND is_stu.status IN ('ENROLLED', 'ACTIVE')
             ) as "studentCount",
             is_active as "isActive", created_at as "createdAt", updated_at as "updatedAt"
      FROM institution_classes ic
      WHERE institution_id = $1 AND is_active = true
      ORDER BY grade_level ASC, division ASC
    `;
    const res = await pool.query(query, [institutionId]);
    return res.rows;
  }

  /**
   * Creates a new class cohort for an institution.
   */
  async createClass(
    institutionId: string,
    data: CreateInstitutionClassDTO
  ): Promise<InstitutionClassEntity> {
    const defaultName = data.name || `${data.gradeLevel}-${data.division} (${data.academicYear})`;
    const query = `
      INSERT INTO institution_classes (
        institution_id, academic_year, grade_level, division, name, coordinator_name, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING id, institution_id as "institutionId", academic_year as "academicYear",
                grade_level as "gradeLevel", division, name, coordinator_name as "coordinatorName",
                student_count as "studentCount", is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    const res = await pool.query(query, [
      institutionId,
      data.academicYear,
      data.gradeLevel,
      data.division,
      defaultName,
      data.coordinatorName || null,
    ]);
    return res.rows[0];
  }

  /**
   * Updates institution profile.
   */
  async updateInstitutionProfile(
    institutionId: string,
    data: UpdateInstitutionProfileDTO
  ): Promise<InstitutionEntity | null> {
    const query = `
      UPDATE institutions
      SET name = COALESCE($1, name),
          type = COALESCE($2, type),
          contact_email = COALESCE($3, contact_email),
          phone = COALESCE($4, phone),
          address = COALESCE($5, address),
          city = COALESCE($6, city),
          state = COALESCE($7, state),
          country = COALESCE($8, country),
          student_capacity = COALESCE($9, student_capacity),
          logo_url = COALESCE($10, logo_url),
          updated_at = NOW()
      WHERE id = $11
      RETURNING id, admin_user_id as "adminUserId", name, code, type, contact_email as "contactEmail",
                phone, address, city, state, country, student_capacity as "studentCapacity",
                logo_url as "logoUrl", is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    const res = await pool.query(query, [
      data.name || null,
      data.type || null,
      data.contactEmail || null,
      data.phone || null,
      data.address || null,
      data.city || null,
      data.state || null,
      data.country || null,
      data.studentCapacity !== undefined ? data.studentCapacity : null,
      data.logoUrl !== undefined ? data.logoUrl : null,
      institutionId,
    ]);
    return res.rows[0] || null;
  }

  /**
   * Retrieves students enrolled in this institution.
   */
  async findStudentsByInstitutionId(
    institutionId: string,
    classId?: string
  ): Promise<InstitutionStudentEntity[]> {
    let query = `
      SELECT
        ist.id,
        ist.institution_id as "institutionId",
        ist.class_id as "classId",
        ist.student_id as "studentId",
        TRIM(CONCAT(u.first_name, ' ', u.last_name)) as "studentName",
        u.email as "studentEmail",
        ist.roll_number as "rollNumber",
        ist.academic_year as "academicYear",
        ist.status,
        ist.joined_at as "joinedAt",
        ic.grade_level as "gradeLevel",
        ic.division,
        ic.name as "className",
        CASE
          WHEN EXISTS (SELECT 1 FROM assessment_results ar WHERE ar.participant_id = ist.student_id) THEN 'COMPLETED'
          WHEN EXISTS (SELECT 1 FROM assessment_attempts aa WHERE aa.participant_id = ist.student_id AND aa.status = 'IN_PROGRESS') THEN 'IN_PROGRESS'
          ELSE 'NOT_STARTED'
        END as "assessmentStatus",
        EXISTS (
          SELECT 1 FROM student_parent_links spl
          WHERE spl.student_user_id = ist.student_id AND spl.link_status = 'ACTIVE'
        ) as "hasParentLinked",
        ist.created_at as "createdAt",
        ist.updated_at as "updatedAt"
      FROM institution_students ist
      JOIN users u ON ist.student_id = u.id
      LEFT JOIN institution_classes ic ON ist.class_id = ic.id
      WHERE ist.institution_id = $1
    `;
    const params: any[] = [institutionId];
    if (classId) {
      params.push(classId);
      query += ` AND ist.class_id = $2`;
    }
    query += ` ORDER BY u.first_name ASC, u.last_name ASC`;
    const res = await pool.query(query, params);
    return res.rows;
  }

  /**
   * Retrieves assessment allocations for this institution.
   */
  async findAssessmentsByInstitutionId(
    institutionId: string
  ): Promise<InstitutionAssessmentEntity[]> {
    const query = `
      SELECT
        ia.id,
        ia.institution_id as "institutionId",
        ia.class_id as "classId",
        ic.name as "className",
        ia.assessment_code as "assessmentCode",
        ia.title,
        ia.deadline,
        ia.status,
        ia.total_assigned as "totalAssigned",
        ia.completed_count as "completedCount",
        ia.created_at as "createdAt"
      FROM institution_assessments ia
      LEFT JOIN institution_classes ic ON ia.class_id = ic.id
      WHERE ia.institution_id = $1
      ORDER BY ia.created_at DESC
    `;
    const res = await pool.query(query, [institutionId]);
    return res.rows;
  }

  /**
   * Assigns an assessment to an institution or cohort.
   */
  async assignAssessment(
    institutionId: string,
    data: AssignAssessmentDTO
  ): Promise<InstitutionAssessmentEntity> {
    const title =
      data.title ||
      (data.assessmentCode === "ENTREPRENEUR_DEVELOPMENT_TEST"
        ? "Entrepreneur Development Test"
        : "Skill Finder Assessment");
    const query = `
      INSERT INTO institution_assessments (
        institution_id, class_id, assessment_code, title, deadline, status, total_assigned, completed_count
      )
      VALUES ($1, $2, $3, $4, $5, 'ACTIVE', 0, 0)
      RETURNING id, institution_id as "institutionId", class_id as "classId",
                assessment_code as "assessmentCode", title, deadline, status,
                total_assigned as "totalAssigned", completed_count as "completedCount",
                created_at as "createdAt"
    `;
    const res = await pool.query(query, [
      institutionId,
      data.classId || null,
      data.assessmentCode,
      title,
      data.deadline || null,
    ]);
    return res.rows[0];
  }

  /**
   * Creates a student invitation record.
   */
  async createInvitation(
    data: {
      institutionId: string;
      campaignId?: string | null;
      classId?: string | null;
      email: string;
      firstName: string;
      lastName: string;
      rollNumber?: string | null;
      academicYear: string;
      tokenHash: string;
      deliveryStatus?: InvitationDeliveryStatus;
      invitedByUserId: string;
      expiresAt: Date;
    },
    client?: PoolClient
  ): Promise<InstitutionStudentInvitationEntity> {
    const db = client || pool;
    const query = `
      INSERT INTO institution_student_invitations (
        institution_id, campaign_id, class_id, email, first_name, last_name, roll_number,
        academic_year, token_hash, status, delivery_status, invited_by_user_id, expires_at, sent_at
      )
      VALUES ($1, $2, $3, LOWER($4), $5, $6, $7, $8, $9, 'PENDING', $10, $11, $12, NOW())
      RETURNING id, institution_id as "institutionId", campaign_id as "campaignId", class_id as "classId",
                email, first_name as "firstName", last_name as "lastName",
                roll_number as "rollNumber", academic_year as "academicYear",
                token_hash as "tokenHash", status, delivery_status as "deliveryStatus",
                delivery_event_at as "deliveryEventAt", provider_message_id as "providerMessageId",
                failure_reason as "failureReason", invited_by_user_id as "invitedByUserId",
                accepted_by_user_id as "acceptedByUserId", expires_at as "expiresAt",
                sent_at as "sentAt", accepted_at as "acceptedAt", revoked_at as "revokedAt",
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    const res = await db.query(query, [
      data.institutionId,
      data.campaignId || null,
      data.classId || null,
      data.email.trim(),
      data.firstName.trim(),
      data.lastName.trim(),
      data.rollNumber || null,
      data.academicYear || "2026-2027",
      data.tokenHash,
      data.deliveryStatus || "QUEUED",
      data.invitedByUserId,
      data.expiresAt,
    ]);
    return res.rows[0];
  }

  /**
   * Finds invitation by its SHA-256 token hash with associated institution and class metadata.
   */
  async findInvitationByTokenHash(
    tokenHash: string
  ): Promise<InstitutionStudentInvitationEntity | null> {
    const query = `
      SELECT
        isi.id,
        isi.institution_id as "institutionId",
        inst.name as "institutionName",
        isi.class_id as "classId",
        ic.name as "className",
        ic.grade_level as "gradeLevel",
        ic.division,
        isi.email,
        isi.first_name as "firstName",
        isi.last_name as "lastName",
        isi.roll_number as "rollNumber",
        isi.academic_year as "academicYear",
        isi.token_hash as "tokenHash",
        isi.status,
        isi.invited_by_user_id as "invitedByUserId",
        isi.accepted_by_user_id as "acceptedByUserId",
        isi.expires_at as "expiresAt",
        isi.sent_at as "sentAt",
        isi.accepted_at as "acceptedAt",
        isi.revoked_at as "revokedAt",
        isi.created_at as "createdAt",
        isi.updated_at as "updatedAt"
      FROM institution_student_invitations isi
      JOIN institutions inst ON isi.institution_id = inst.id
      LEFT JOIN institution_classes ic ON isi.class_id = ic.id
      WHERE isi.token_hash = $1
      LIMIT 1
    `;
    const res = await pool.query(query, [tokenHash]);
    return res.rows[0] || null;
  }

  /**
   * Finds invitation by ID (with optional institution check for strict tenant isolation).
   */
  async findInvitationById(
    invitationId: string,
    institutionId?: string
  ): Promise<InstitutionStudentInvitationEntity | null> {
    let query = `
      SELECT
        isi.id,
        isi.institution_id as "institutionId",
        inst.name as "institutionName",
        isi.class_id as "classId",
        ic.name as "className",
        ic.grade_level as "gradeLevel",
        ic.division,
        isi.email,
        isi.first_name as "firstName",
        isi.last_name as "lastName",
        isi.roll_number as "rollNumber",
        isi.academic_year as "academicYear",
        isi.token_hash as "tokenHash",
        isi.status,
        isi.invited_by_user_id as "invitedByUserId",
        isi.accepted_by_user_id as "acceptedByUserId",
        isi.expires_at as "expiresAt",
        isi.sent_at as "sentAt",
        isi.accepted_at as "acceptedAt",
        isi.revoked_at as "revokedAt",
        isi.created_at as "createdAt",
        isi.updated_at as "updatedAt"
      FROM institution_student_invitations isi
      JOIN institutions inst ON isi.institution_id = inst.id
      LEFT JOIN institution_classes ic ON isi.class_id = ic.id
      WHERE isi.id = $1
    `;
    const params: any[] = [invitationId];
    if (institutionId) {
      params.push(institutionId);
      query += ` AND isi.institution_id = $2`;
    }
    const res = await pool.query(query, params);
    return res.rows[0] || null;
  }

  /**
   * Finds all student invitations for an institution (supports filtering by status).
   */
  async findInvitationsByInstitutionId(
    institutionId: string,
    status?: string
  ): Promise<InstitutionStudentInvitationEntity[]> {
    let query = `
      SELECT
        isi.id,
        isi.institution_id as "institutionId",
        inst.name as "institutionName",
        isi.class_id as "classId",
        ic.name as "className",
        ic.grade_level as "gradeLevel",
        ic.division,
        isi.email,
        isi.first_name as "firstName",
        isi.last_name as "lastName",
        isi.roll_number as "rollNumber",
        isi.academic_year as "academicYear",
        isi.token_hash as "tokenHash",
        isi.status,
        isi.invited_by_user_id as "invitedByUserId",
        isi.accepted_by_user_id as "acceptedByUserId",
        isi.expires_at as "expiresAt",
        isi.sent_at as "sentAt",
        isi.accepted_at as "acceptedAt",
        isi.revoked_at as "revokedAt",
        isi.created_at as "createdAt",
        isi.updated_at as "updatedAt"
      FROM institution_student_invitations isi
      JOIN institutions inst ON isi.institution_id = inst.id
      LEFT JOIN institution_classes ic ON isi.class_id = ic.id
      WHERE isi.institution_id = $1
    `;
    const params: any[] = [institutionId];
    if (status) {
      params.push(status);
      query += ` AND isi.status = $2`;
    }
    query += ` ORDER BY isi.created_at DESC`;
    const res = await pool.query(query, params);
    return res.rows;
  }

  /**
   * Checks for an existing active (PENDING) invitation for this email and institution.
   */
  async findActiveInvitationByEmail(
    institutionId: string,
    email: string
  ): Promise<InstitutionStudentInvitationEntity | null> {
    const query = `
      SELECT id, institution_id as "institutionId", class_id as "classId",
             email, first_name as "firstName", last_name as "lastName",
             roll_number as "rollNumber", academic_year as "academicYear",
             token_hash as "tokenHash", status, invited_by_user_id as "invitedByUserId",
             expires_at as "expiresAt", sent_at as "sentAt",
             created_at as "createdAt", updated_at as "updatedAt"
      FROM institution_student_invitations
      WHERE institution_id = $1 AND LOWER(email) = LOWER($2) AND status = 'PENDING' AND expires_at > NOW()
      LIMIT 1
    `;
    const res = await pool.query(query, [institutionId, email.trim()]);
    return res.rows[0] || null;
  }

  /**
   * Retrieves a Set of all currently active pending invitation emails for an institution.
   */
  async findActiveInvitationEmailsByInstitutionId(institutionId: string): Promise<Set<string>> {
    const query = `
      SELECT LOWER(email) as email FROM institution_student_invitations
      WHERE institution_id = $1 AND status = 'PENDING' AND expires_at > NOW()
    `;
    const res = await pool.query(query, [institutionId]);
    return new Set(res.rows.map((r) => r.email));
  }

  /**
   * Retrieves a Set of all currently enrolled student emails for an institution.
   */
  async findEnrolledEmailsByInstitutionId(institutionId: string): Promise<Set<string>> {
    const query = `
      SELECT LOWER(u.email) as email FROM institution_students ist
      JOIN users u ON ist.student_id = u.id
      WHERE ist.institution_id = $1
    `;
    const res = await pool.query(query, [institutionId]);
    return new Set(res.rows.map((r) => r.email));
  }

  /**
   * Checks if an email is already an enrolled student in this institution.
   */
  async findStudentByInstitutionAndEmail(
    institutionId: string,
    email: string
  ): Promise<InstitutionStudentEntity | null> {
    const query = `
      SELECT ist.id, ist.institution_id as "institutionId", ist.class_id as "classId",
             ist.student_id as "studentId", ist.roll_number as "rollNumber",
             ist.academic_year as "academicYear", ist.status, ist.joined_at as "joinedAt"
      FROM institution_students ist
      JOIN users u ON ist.student_id = u.id
      WHERE ist.institution_id = $1 AND LOWER(u.email) = LOWER($2)
      LIMIT 1
    `;
    const res = await pool.query(query, [institutionId, email.trim()]);
    return res.rows[0] || null;
  }

  /**
   * Updates an invitation with a newly generated token and renewed expiration date (Resend flow).
   */
  async updateInvitationToken(
    invitationId: string,
    tokenHash: string,
    expiresAt: Date
  ): Promise<InstitutionStudentInvitationEntity | null> {
    const query = `
      UPDATE institution_student_invitations
      SET token_hash = $1,
          expires_at = $2,
          sent_at = NOW(),
          status = 'PENDING',
          updated_at = NOW()
      WHERE id = $3
      RETURNING id, institution_id as "institutionId", class_id as "classId",
                email, first_name as "firstName", last_name as "lastName",
                roll_number as "rollNumber", academic_year as "academicYear",
                token_hash as "tokenHash", status, invited_by_user_id as "invitedByUserId",
                expires_at as "expiresAt", sent_at as "sentAt",
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    const res = await pool.query(query, [tokenHash, expiresAt, invitationId]);
    return res.rows[0] || null;
  }

  /**
   * Revokes a pending invitation.
   */
  async revokeInvitation(
    invitationId: string,
    institutionId: string
  ): Promise<InstitutionStudentInvitationEntity | null> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const query = `
        UPDATE institution_student_invitations
        SET status = 'REVOKED',
            revoked_at = NOW(),
            updated_at = NOW()
        WHERE id = $1 AND institution_id = $2 AND status = 'PENDING'
        RETURNING id, institution_id as "institutionId", status, revoked_at as "revokedAt"
      `;
      const res = await client.query(query, [invitationId, institutionId]);
      if (res.rows[0]) {
        await client.query(
          `UPDATE institution_email_jobs
           SET status = 'FAILED',
               is_permanent_failure = true,
               last_error = 'Invitation was revoked before dispatch',
               updated_at = NOW()
           WHERE invitation_id = $1 AND status = 'QUEUED'`,
          [invitationId]
        );
      }
      await client.query("COMMIT");
      return res.rows[0] || null;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Marks an invitation as ACCEPTED in a transaction.
   */
  async markInvitationAccepted(
    invitationId: string,
    acceptedByUserId: string,
    client?: PoolClient
  ): Promise<void> {
    const db = client || pool;
    const query = `
      UPDATE institution_student_invitations
      SET status = 'ACCEPTED',
          accepted_by_user_id = $1,
          accepted_at = NOW(),
          updated_at = NOW()
      WHERE id = $2
    `;
    await db.query(query, [acceptedByUserId, invitationId]);
  }

  /**
   * Links a student user to an institution and cohort.
   */
  async linkStudentToInstitutionAndCohort(
    institutionId: string,
    studentId: string,
    classId?: string | null,
    rollNumber?: string | null,
    academicYear?: string,
    client?: PoolClient
  ): Promise<void> {
    const db = client || pool;
    const query = `
      INSERT INTO institution_students (
        institution_id, class_id, student_id, roll_number, academic_year, status, joined_at
      )
      VALUES ($1, $2, $3, $4, $5, 'ENROLLED', NOW())
      ON CONFLICT (institution_id, student_id)
      DO UPDATE SET
        class_id = COALESCE(EXCLUDED.class_id, institution_students.class_id),
        roll_number = COALESCE(EXCLUDED.roll_number, institution_students.roll_number),
        status = 'ENROLLED',
        updated_at = NOW()
    `;
    await db.query(query, [
      institutionId,
      classId || null,
      studentId,
      rollNumber || null,
      academicYear || "2026-2027",
    ]);

    // Update student count in cohort
    if (classId) {
      await db.query(
        `UPDATE institution_classes
         SET student_count = (
           SELECT COUNT(*)::int FROM institution_students
           WHERE class_id = $1 AND status IN ('ENROLLED', 'ACTIVE')
         ),
         updated_at = NOW()
         WHERE id = $1`,
        [classId]
      );
    }
  }

  // =========================================================================
  // CAMPAIGN & QUEUE OUTBOX REPOSITORY METHODS
  // =========================================================================

  /**
   * Creates an invitation campaign record.
   */
  async createCampaign(
    data: {
      institutionId: string;
      classId?: string | null;
      createdByUserId: string;
      name: string;
      totalCount: number;
      queuedCount?: number;
    },
    client?: PoolClient
  ): Promise<InstitutionStudentCampaignEntity> {
    const db = client || pool;
    const query = `
      INSERT INTO institution_student_campaigns (
        institution_id, class_id, created_by_user_id, name, total_count, queued_count, status, started_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'PROCESSING', NOW())
      RETURNING id, institution_id as "institutionId", class_id as "classId",
                created_by_user_id as "createdByUserId", name, total_count as "totalCount",
                queued_count as "queuedCount", processing_count as "processingCount",
                sent_count as "sentCount", delivered_count as "deliveredCount",
                failed_count as "failedCount", bounced_count as "bouncedCount",
                accepted_count as "acceptedCount", status, created_at as "createdAt",
                started_at as "startedAt", completed_at as "completedAt",
                updated_at as "updatedAt"
    `;
    const res = await db.query(query, [
      data.institutionId,
      data.classId || null,
      data.createdByUserId,
      data.name,
      data.totalCount,
      data.queuedCount !== undefined ? data.queuedCount : data.totalCount,
    ]);
    return res.rows[0];
  }

  /**
   * Finds a campaign by ID with associated institution and class metadata.
   */
  async findCampaignById(
    campaignId: string,
    institutionId?: string
  ): Promise<InstitutionStudentCampaignEntity | null> {
    let query = `
      SELECT
        c.id,
        c.institution_id as "institutionId",
        inst.name as "institutionName",
        c.class_id as "classId",
        ic.name as "className",
        c.created_by_user_id as "createdByUserId",
        TRIM(CONCAT(u.first_name, ' ', u.last_name)) as "createdByName",
        c.name,
        c.total_count as "totalCount",
        c.queued_count as "queuedCount",
        c.processing_count as "processingCount",
        c.sent_count as "sentCount",
        c.delivered_count as "deliveredCount",
        c.failed_count as "failedCount",
        c.bounced_count as "bouncedCount",
        c.accepted_count as "acceptedCount",
        c.status,
        c.created_at as "createdAt",
        c.started_at as "startedAt",
        c.completed_at as "completedAt",
        c.updated_at as "updatedAt"
      FROM institution_student_campaigns c
      JOIN institutions inst ON c.institution_id = inst.id
      JOIN users u ON c.created_by_user_id = u.id
      LEFT JOIN institution_classes ic ON c.class_id = ic.id
      WHERE c.id = $1
    `;
    const params: any[] = [campaignId];
    if (institutionId) {
      params.push(institutionId);
      query += ` AND c.institution_id = $2`;
    }
    const res = await pool.query(query, params);
    return res.rows[0] || null;
  }

  /**
   * Finds all campaigns for an institution with optional status filter.
   */
  async findCampaignsByInstitutionId(
    institutionId: string,
    status?: string
  ): Promise<InstitutionStudentCampaignEntity[]> {
    let query = `
      SELECT
        c.id,
        c.institution_id as "institutionId",
        inst.name as "institutionName",
        c.class_id as "classId",
        ic.name as "className",
        c.created_by_user_id as "createdByUserId",
        TRIM(CONCAT(u.first_name, ' ', u.last_name)) as "createdByName",
        c.name,
        c.total_count as "totalCount",
        c.queued_count as "queuedCount",
        c.processing_count as "processingCount",
        c.sent_count as "sentCount",
        c.delivered_count as "deliveredCount",
        c.failed_count as "failedCount",
        c.bounced_count as "bouncedCount",
        c.accepted_count as "acceptedCount",
        c.status,
        c.created_at as "createdAt",
        c.started_at as "startedAt",
        c.completed_at as "completedAt",
        c.updated_at as "updatedAt"
      FROM institution_student_campaigns c
      JOIN institutions inst ON c.institution_id = inst.id
      JOIN users u ON c.created_by_user_id = u.id
      LEFT JOIN institution_classes ic ON c.class_id = ic.id
      WHERE c.institution_id = $1
    `;
    const params: any[] = [institutionId];
    if (status) {
      params.push(status);
      query += ` AND c.status = $2`;
    }
    query += ` ORDER BY c.created_at DESC`;
    const res = await pool.query(query, params);
    return res.rows;
  }

  /**
   * Updates campaign counts atomically based on current job and invitation states.
   */
  async updateCampaignCounts(campaignId: string, client?: PoolClient): Promise<void> {
    const db = client || pool;
    const query = `
      WITH job_stats AS (
        SELECT
          COUNT(*) FILTER (WHERE status = 'QUEUED')::int AS queued_cnt,
          COUNT(*) FILTER (WHERE status = 'PROCESSING')::int AS proc_cnt,
          COUNT(*) FILTER (WHERE status IN ('SENT', 'DELIVERED'))::int AS sent_cnt,
          COUNT(*) FILTER (WHERE status = 'FAILED')::int AS failed_cnt
        FROM institution_email_jobs
        WHERE campaign_id = $1
      ),
      inv_stats AS (
        SELECT
          COUNT(*) FILTER (WHERE delivery_status = 'DELIVERED')::int AS deliv_cnt,
          COUNT(*) FILTER (WHERE delivery_status = 'BOUNCED')::int AS bounce_cnt,
          COUNT(*) FILTER (WHERE status = 'ACCEPTED')::int AS accepted_cnt
        FROM institution_student_invitations
        WHERE campaign_id = $1
      )
      UPDATE institution_student_campaigns c
      SET
        queued_count = COALESCE(j.queued_cnt, 0),
        processing_count = COALESCE(j.proc_cnt, 0),
        sent_count = COALESCE(j.sent_cnt, 0),
        failed_count = COALESCE(j.failed_cnt, 0),
        delivered_count = COALESCE(i.deliv_cnt, 0),
        bounced_count = COALESCE(i.bounce_cnt, 0),
        accepted_count = COALESCE(i.accepted_cnt, 0),
        status = CASE
          WHEN (COALESCE(j.queued_cnt, 0) + COALESCE(j.proc_cnt, 0)) = 0 AND c.total_count > 0 THEN 'COMPLETED'
          ELSE 'PROCESSING'
        END,
        completed_at = CASE
          WHEN (COALESCE(j.queued_cnt, 0) + COALESCE(j.proc_cnt, 0)) = 0 AND c.total_count > 0 AND c.completed_at IS NULL THEN NOW()
          ELSE c.completed_at
        END,
        updated_at = NOW()
      FROM job_stats j, inv_stats i
      WHERE c.id = $1
    `;
    await db.query(query, [campaignId]);
  }

  /**
   * Updates campaign status.
   */
  async updateCampaignStatus(
    campaignId: string,
    status: InvitationCampaignStatus,
    client?: PoolClient
  ): Promise<void> {
    const db = client || pool;
    const query = `
      UPDATE institution_student_campaigns
      SET status = $1,
          completed_at = CASE WHEN $1 = 'COMPLETED' THEN NOW() ELSE completed_at END,
          updated_at = NOW()
      WHERE id = $2
    `;
    await db.query(query, [status, campaignId]);
  }

  /**
   * Enqueues a durable email job into the PostgreSQL Outbox queue.
   */
  async createEmailJob(
    data: {
      campaignId?: string | null;
      invitationId: string;
      institutionId: string;
      recipientEmail: string;
      recipientName: string;
      rawToken: string;
    },
    client?: PoolClient
  ): Promise<InstitutionEmailJobEntity> {
    const db = client || pool;
    const query = `
      INSERT INTO institution_email_jobs (
        campaign_id, invitation_id, institution_id, recipient_email, recipient_name, raw_token, status, attempts
      )
      VALUES ($1, $2, $3, LOWER($4), $5, $6, 'QUEUED', 0)
      ON CONFLICT (invitation_id) DO UPDATE SET
        raw_token = EXCLUDED.raw_token,
        status = 'QUEUED',
        attempts = 0,
        scheduled_at = NOW(),
        updated_at = NOW()
      RETURNING id, campaign_id as "campaignId", invitation_id as "invitationId",
                institution_id as "institutionId", recipient_email as "recipientEmail",
                recipient_name as "recipientName", status, attempts, max_attempts as "maxAttempts",
                scheduled_at as "scheduledAt", processed_at as "processedAt",
                completed_at as "completedAt", last_error as "lastError",
                is_permanent_failure as "isPermanentFailure",
                provider_message_id as "providerMessageId",
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    const res = await db.query(query, [
      data.campaignId || null,
      data.invitationId,
      data.institutionId,
      data.recipientEmail.trim(),
      data.recipientName.trim(),
      data.rawToken,
    ]);
    return res.rows[0];
  }

  /**
   * Atomically claims a batch of pending email jobs using SELECT FOR UPDATE SKIP LOCKED.
   */
  async claimQueuedEmailJobs(limit = 10): Promise<Array<InstitutionEmailJobEntity & {
    institutionName: string;
    className: string | null;
    gradeLevel: string | null;
    division: string | null;
    expiresAt: string;
  }>> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const selectQuery = `
        SELECT
          j.id,
          j.campaign_id as "campaignId",
          j.invitation_id as "invitationId",
          j.institution_id as "institutionId",
          inst.name as "institutionName",
          ic.name as "className",
          ic.grade_level as "gradeLevel",
          ic.division,
          j.recipient_email as "recipientEmail",
          j.recipient_name as "recipientName",
          j.raw_token as "rawToken",
          j.status,
          j.attempts,
          j.max_attempts as "maxAttempts",
          j.scheduled_at as "scheduledAt",
          j.processed_at as "processedAt",
          j.completed_at as "completedAt",
          j.last_error as "lastError",
          j.is_permanent_failure as "isPermanentFailure",
          j.provider_message_id as "providerMessageId",
          isi.expires_at as "expiresAt",
          j.created_at as "createdAt",
          j.updated_at as "updatedAt"
        FROM institution_email_jobs j
        JOIN institutions inst ON j.institution_id = inst.id
        JOIN institution_student_invitations isi ON j.invitation_id = isi.id
        LEFT JOIN institution_classes ic ON isi.class_id = ic.id
        WHERE j.status = 'QUEUED' AND j.scheduled_at <= NOW() AND isi.status = 'PENDING'
        ORDER BY j.scheduled_at ASC
        LIMIT $1
        FOR UPDATE OF j SKIP LOCKED
      `;

      const res = await client.query(selectQuery, [limit]);
      if (res.rows.length === 0) {
        await client.query("COMMIT");
        return [];
      }

      const jobIds = res.rows.map((r) => r.id);
      await client.query(
        `UPDATE institution_email_jobs
         SET status = 'PROCESSING',
             processed_at = NOW(),
             updated_at = NOW()
         WHERE id = ANY($1::uuid[])`,
        [jobIds]
      );

      await client.query("COMMIT");
      return res.rows;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Marks an email job as successfully sent, clears raw token for security, and updates invitation & campaign.
   */
  async updateEmailJobSuccess(
    jobId: string,
    providerMessageId?: string
  ): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const updateJobRes = await client.query(
        `UPDATE institution_email_jobs
         SET status = 'SENT',
             raw_token = '',
             provider_message_id = $1,
             completed_at = NOW(),
             updated_at = NOW()
         WHERE id = $2
         RETURNING campaign_id, invitation_id`,
        [providerMessageId || null, jobId]
      );

      const job = updateJobRes.rows[0];
      if (job) {
        await client.query(
          `UPDATE institution_student_invitations
           SET delivery_status = 'SENT',
               provider_message_id = $1,
               sent_at = NOW(),
               updated_at = NOW()
           WHERE id = $2`,
          [providerMessageId || null, job.invitation_id]
        );

        if (job.campaign_id) {
          await this.updateCampaignCounts(job.campaign_id, client);
        }
      }

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Records failure on an email job, handling retries or permanent failure.
   */
  async updateEmailJobFailure(
    jobId: string,
    error: string,
    isPermanent: boolean,
    nextScheduledAt?: Date
  ): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const nextStatus = isPermanent ? "FAILED" : "QUEUED";

      const updateJobRes = await client.query(
        `UPDATE institution_email_jobs
         SET status = $1,
             attempts = attempts + 1,
             scheduled_at = COALESCE($2, NOW()),
             last_error = $3,
             is_permanent_failure = $4,
             updated_at = NOW()
         WHERE id = $5
         RETURNING campaign_id, invitation_id, attempts, max_attempts`,
        [
          nextStatus,
          nextScheduledAt || null,
          error.slice(0, 500),
          isPermanent,
          jobId,
        ]
      );

      const job = updateJobRes.rows[0];
      if (job && isPermanent) {
        await client.query(
          `UPDATE institution_student_invitations
           SET delivery_status = 'FAILED',
               failure_reason = $1,
               updated_at = NOW()
           WHERE id = $2`,
          [error.slice(0, 500), job.invitation_id]
        );

        if (job.campaign_id) {
          await this.updateCampaignCounts(job.campaign_id, client);
        }
      }

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Updates job and invitation to DELIVERED status from provider webhook event.
   */
  async updateEmailJobDelivered(providerMessageId: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const jobRes = await client.query(
        `UPDATE institution_email_jobs
         SET status = 'DELIVERED',
             updated_at = NOW()
         WHERE provider_message_id = $1
         RETURNING campaign_id, invitation_id`,
        [providerMessageId]
      );

      const job = jobRes.rows[0];
      if (job) {
        await client.query(
          `UPDATE institution_student_invitations
           SET delivery_status = 'DELIVERED',
               delivery_event_at = NOW(),
               updated_at = NOW()
           WHERE id = $1`,
          [job.invitation_id]
        );

        if (job.campaign_id) {
          await this.updateCampaignCounts(job.campaign_id, client);
        }
      }

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Updates job and invitation to BOUNCED status from provider webhook event.
   */
  async updateEmailJobBounced(
    providerMessageId: string,
    bounceType?: string
  ): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const reason = `Bounced (${bounceType || "Hard Bounce"})`;

      const jobRes = await client.query(
        `UPDATE institution_email_jobs
         SET status = 'BOUNCED',
             is_permanent_failure = true,
             last_error = $1,
             updated_at = NOW()
         WHERE provider_message_id = $2
         RETURNING campaign_id, invitation_id`,
        [reason, providerMessageId]
      );

      const job = jobRes.rows[0];
      if (job) {
        await client.query(
          `UPDATE institution_student_invitations
           SET delivery_status = 'BOUNCED',
               failure_reason = $1,
               delivery_event_at = NOW(),
               updated_at = NOW()
           WHERE id = $2`,
          [reason, job.invitation_id]
        );

        if (job.campaign_id) {
          await this.updateCampaignCounts(job.campaign_id, client);
        }
      }

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Finds all student invitations associated with a campaign.
   */
  async findInvitationsByCampaignId(
    campaignId: string
  ): Promise<InstitutionStudentInvitationEntity[]> {
    const query = `
      SELECT
        isi.id,
        isi.institution_id as "institutionId",
        inst.name as "institutionName",
        isi.campaign_id as "campaignId",
        isi.class_id as "classId",
        ic.name as "className",
        ic.grade_level as "gradeLevel",
        ic.division,
        isi.email,
        isi.first_name as "firstName",
        isi.last_name as "lastName",
        isi.roll_number as "rollNumber",
        isi.academic_year as "academicYear",
        isi.token_hash as "tokenHash",
        isi.status,
        isi.delivery_status as "deliveryStatus",
        isi.delivery_event_at as "deliveryEventAt",
        isi.provider_message_id as "providerMessageId",
        isi.failure_reason as "failureReason",
        isi.invited_by_user_id as "invitedByUserId",
        isi.accepted_by_user_id as "acceptedByUserId",
        isi.expires_at as "expiresAt",
        isi.sent_at as "sentAt",
        isi.accepted_at as "acceptedAt",
        isi.revoked_at as "revokedAt",
        isi.created_at as "createdAt",
        isi.updated_at as "updatedAt"
      FROM institution_student_invitations isi
      JOIN institutions inst ON isi.institution_id = inst.id
      LEFT JOIN institution_classes ic ON isi.class_id = ic.id
      WHERE isi.campaign_id = $1
      ORDER BY isi.created_at ASC
    `;
    const res = await pool.query(query, [campaignId]);
    return res.rows;
  }

  /**
   * Retries only failed email jobs for a campaign without resending successful ones.
   */
  async retryFailedCampaignJobs(
    campaignId: string,
    institutionId: string
  ): Promise<number> {
    const query = `
      UPDATE institution_email_jobs
      SET status = 'QUEUED',
          attempts = 0,
          scheduled_at = NOW(),
          is_permanent_failure = false,
          updated_at = NOW()
      WHERE campaign_id = $1 AND institution_id = $2 AND status = 'FAILED'
    `;
    const res = await pool.query(query, [campaignId, institutionId]);
    await this.updateCampaignCounts(campaignId);
    return res.rowCount || 0;
  }
}

export const institutionRepository = new InstitutionRepository();
