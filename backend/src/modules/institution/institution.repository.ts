import { pool } from "../../config/database";
import { logger } from "../../common/utils/logger";
import { hashPassword } from "../../common/utils/crypto";
import { SEED_INSTITUTION } from "./institution.seed-data";
import {
  InstitutionEntity,
  InstitutionClassEntity,
  InstitutionOverviewStatsDTO,
  UpdateInstitutionProfileDTO,
  CreateInstitutionClassDTO,
  InstitutionStudentEntity,
  InstitutionAssessmentEntity,
  AssignAssessmentDTO,
} from "./institution.types";

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

      // Indexes for performance and isolation
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_institutions_admin ON institutions(admin_user_id);
        CREATE INDEX IF NOT EXISTS idx_institution_classes_inst ON institution_classes(institution_id);
        CREATE INDEX IF NOT EXISTS idx_institution_students_inst ON institution_students(institution_id);
        CREATE INDEX IF NOT EXISTS idx_institution_students_student ON institution_students(student_id);
        CREATE INDEX IF NOT EXISTS idx_institution_students_class ON institution_students(class_id);
        CREATE INDEX IF NOT EXISTS idx_institution_assessments_inst ON institution_assessments(institution_id);
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
   * Seeds demo institution and default classes.
   */
  async seedInstitution(): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const defaultPasswordHash = await hashPassword("Password123!");

      // 1. Upsert Admin User for Institution
      let adminUserId: string;
      const userRes = await client.query(
        "SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
        [SEED_INSTITUTION.adminEmail]
      );

      if (userRes.rows.length > 0) {
        adminUserId = userRes.rows[0].id;
        await client.query(
          "UPDATE users SET password_hash = $1 WHERE id = $2",
          [defaultPasswordHash, adminUserId]
        );
      } else {
        const newUserRes = await client.query(
          `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
           VALUES ($1, $2, $3, $4, 'ACTIVE', NOW())
           RETURNING id`,
          [
            SEED_INSTITUTION.adminEmail,
            defaultPasswordHash,
            SEED_INSTITUTION.adminFirstName,
            SEED_INSTITUTION.adminLastName,
          ]
        );
        adminUserId = newUserRes.rows[0].id;
      }

      // Assign INSTITUTION_ADMIN role
      await client.query(
        `INSERT INTO user_roles (user_id, role_id, is_primary)
         SELECT $1, r.id, true
         FROM roles r
         WHERE r.name = 'INSTITUTION_ADMIN'
         ON CONFLICT DO NOTHING`,
        [adminUserId]
      );

      // 2. Upsert Institution Profile
      const instRes = await client.query(
        `INSERT INTO institutions (
           admin_user_id, name, code, type, contact_email, phone,
           address, city, state, country, student_capacity, is_active
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
         ON CONFLICT (admin_user_id) DO UPDATE
         SET name = EXCLUDED.name,
             type = EXCLUDED.type,
             contact_email = EXCLUDED.contact_email,
             phone = EXCLUDED.phone,
             address = EXCLUDED.address,
             city = EXCLUDED.city,
             state = EXCLUDED.state,
             country = EXCLUDED.country,
             student_capacity = EXCLUDED.student_capacity,
             updated_at = NOW()
         RETURNING id`,
        [
          adminUserId,
          SEED_INSTITUTION.name,
          SEED_INSTITUTION.code,
          SEED_INSTITUTION.type,
          SEED_INSTITUTION.contactEmail,
          SEED_INSTITUTION.phone,
          SEED_INSTITUTION.address,
          SEED_INSTITUTION.city,
          SEED_INSTITUTION.state,
          SEED_INSTITUTION.country,
          SEED_INSTITUTION.studentCapacity,
        ]
      );

      const institutionId = instRes.rows[0].id;

      // 3. Insert / Sync Classes
      for (const cls of SEED_INSTITUTION.classes) {
        await client.query(
          `INSERT INTO institution_classes (
             institution_id, academic_year, grade_level, division, name, coordinator_name, is_active
           )
           VALUES ($1, $2, $3, $4, $5, $6, true)
           ON CONFLICT (institution_id, academic_year, grade_level, division) DO UPDATE
           SET name = EXCLUDED.name,
               coordinator_name = EXCLUDED.coordinator_name,
               updated_at = NOW()`,
          [
            institutionId,
            cls.academicYear,
            cls.gradeLevel,
            cls.division,
            cls.name,
            cls.coordinatorName,
          ]
        );
      }

      // 4. Auto-enroll any existing students whose school_name matches this institution or lack assignment
      const firstClassRes = await client.query(
        `SELECT id FROM institution_classes WHERE institution_id = $1 ORDER BY grade_level ASC LIMIT 1`,
        [institutionId]
      );
      const defaultClassId = firstClassRes.rows[0]?.id || null;

      await client.query(
        `INSERT INTO institution_students (institution_id, class_id, student_id, roll_number, status, joined_at)
         SELECT $1, $2, u.id, 'ROLL-' || SUBSTRING(u.id::text, 1, 4), 'ENROLLED', NOW()
         FROM users u
         JOIN user_roles ur ON u.id = ur.user_id
         JOIN roles r ON ur.role_id = r.id AND r.name = 'PARTICIPANT'
         WHERE NOT EXISTS (
           SELECT 1 FROM institution_students ist WHERE ist.student_id = u.id
         )
         LIMIT 20
         ON CONFLICT (institution_id, student_id) DO NOTHING`,
        [institutionId, defaultClassId]
      );

      // Recalculate student counts on classes
      await client.query(`
        UPDATE institution_classes ic
        SET student_count = (
          SELECT COUNT(*)::int FROM institution_students is_stu
          WHERE is_stu.class_id = ic.id AND is_stu.status IN ('ENROLLED', 'ACTIVE')
        )
        WHERE ic.institution_id = $1
      `, [institutionId]);

      await client.query("COMMIT");
      logger.info("✨ Demo Institution and cohorts seeded successfully.");
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error({ err }, "Error seeding demo institution");
    } finally {
      client.release();
    }
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
}

export const institutionRepository = new InstitutionRepository();
