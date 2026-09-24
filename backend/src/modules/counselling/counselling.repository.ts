import { pool } from "../../config/database";
import { logger } from "../../common/utils/logger";
import { hashPassword } from "../../common/utils/crypto";
import { SEED_COUNSELLORS } from "./counselling.seed-data";
import {
  CounsellorEntity,
  CounsellorAvailability,
  CounsellingSessionDTO,
  CounsellingNoteDTO,
  ConsentPermission,
  NotificationDTO,
  NotificationType,
  SessionStatus,
  SessionType,
  CounsellorSessionFilterParams,
} from "./counselling.types";

export class CounsellingRepository {
  /**
   * Initializes PostgreSQL tables for counsellors, availability, sessions, notes, consent, and notifications.
   */
  async initSchema(): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Counsellors Profile Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS counsellors (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          qualification VARCHAR(255) NOT NULL,
          experience_years INTEGER NOT NULL DEFAULT 0,
          bio TEXT NOT NULL,
          specialisations JSONB NOT NULL DEFAULT '[]'::jsonb,
          languages JSONB NOT NULL DEFAULT '["English"]'::jsonb,
          guidance_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
          profile_image VARCHAR(500) NULL,
          rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
          review_count INTEGER NOT NULL DEFAULT 0,
          reviews JSONB NOT NULL DEFAULT '[]'::jsonb,
          approval_status VARCHAR(50) NOT NULL DEFAULT 'APPROVED',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT uq_counsellor_user UNIQUE (user_id)
        );
      `);

      // 2. Counsellor Availability Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS counsellor_availability (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          counsellor_id UUID NOT NULL REFERENCES counsellors(id) ON DELETE CASCADE,
          day VARCHAR(20) NOT NULL,
          start_time VARCHAR(10) NOT NULL,
          end_time VARCHAR(10) NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // 3. Student-Counsellor Profile Sharing Consent Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS student_counsellor_consent (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          counsellor_id UUID NOT NULL REFERENCES counsellors(id) ON DELETE CASCADE,
          permission VARCHAR(50) NOT NULL DEFAULT 'VIEW_ASSESSMENT_SUMMARY',
          granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          revoked_at TIMESTAMP WITH TIME ZONE NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT uq_student_counsellor_consent UNIQUE (student_id, counsellor_id)
        );
      `);

      // 4. Counselling Sessions Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS counselling_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          counsellor_id UUID NOT NULL REFERENCES counsellors(id) ON DELETE CASCADE,
          session_type VARCHAR(50) NOT NULL DEFAULT 'CAREER_GUIDANCE',
          duration_minutes INTEGER NOT NULL DEFAULT 45,
          session_date DATE NOT NULL,
          session_time VARCHAR(20) NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
          meeting_link VARCHAR(500) NULL,
          student_notes TEXT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // 5. Counselling Notes Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS counselling_notes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          session_id UUID NOT NULL REFERENCES counselling_sessions(id) ON DELETE CASCADE,
          counsellor_id UUID NOT NULL REFERENCES counsellors(id) ON DELETE CASCADE,
          student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          summary TEXT NOT NULL,
          observations TEXT NULL,
          recommendations TEXT NOT NULL,
          action_plan JSONB NOT NULL DEFAULT '[]'::jsonb,
          follow_up_date DATE NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT uq_session_counselling_note UNIQUE (session_id)
        );
      `);

      // 6. User Notifications Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS notifications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          type VARCHAR(50) NOT NULL,
          metadata JSONB NULL,
          is_read BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);

      // Create indexes for optimal query speeds
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_counsellors_status ON counsellors(approval_status);
        CREATE INDEX IF NOT EXISTS idx_counsellor_availability_counsellor ON counsellor_availability(counsellor_id);
        CREATE INDEX IF NOT EXISTS idx_counselling_sessions_student ON counselling_sessions(student_id);
        CREATE INDEX IF NOT EXISTS idx_counselling_sessions_counsellor ON counselling_sessions(counsellor_id);
        CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
      `);

      // Auto-provision profile records for any users with CAREER_COUNSELLOR role lacking a counsellors row
      await client.query(`
        INSERT INTO counsellors (
          user_id, qualification, experience_years, bio,
          specialisations, languages, guidance_areas,
          rating, review_count, reviews, approval_status
        )
        SELECT
          u.id,
          COALESCE(ca.qualification, 'Certified Career Guidance Counsellor'),
          1,
          COALESCE(
            CASE WHEN ca.organization IS NOT NULL THEN 'Career Guidance Specialist at ' || ca.organization ELSE NULL END,
            'Certified Career and Education Guidance Counsellor at MeLife.'
          ),
          '["Career Guidance", "Cognitive Aptitude Alignment", "Higher Education Advisory"]'::jsonb,
          '["English"]'::jsonb,
          '["Stream Selection", "Psychometric Assessment Debriefing", "Career Roadmaps"]'::jsonb,
          5.0, 0, '[]'::jsonb, 'APPROVED'
        FROM users u
        JOIN user_roles ur ON u.id = ur.user_id
        JOIN roles r ON ur.role_id = r.id AND r.name = 'CAREER_COUNSELLOR'
        LEFT JOIN counsellor_applications ca ON u.id = ca.user_id
        ON CONFLICT (user_id) DO NOTHING;
      `);

      // Auto-provision default availability slots for any counsellors missing them
      await client.query(`
        INSERT INTO counsellor_availability (counsellor_id, day, start_time, end_time, is_active)
        SELECT c.id, d.day, '09:00', '17:00', true
        FROM counsellors c
        CROSS JOIN (
          VALUES ('Monday'), ('Tuesday'), ('Wednesday'), ('Thursday'), ('Friday')
        ) AS d(day)
        LEFT JOIN counsellor_availability ca ON c.id = ca.counsellor_id AND ca.day = d.day
        WHERE ca.id IS NULL;
      `);

      await client.query("COMMIT");
      logger.info("📦 Counsellor Connect database schema initialized and verified.");
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error({ err }, "Error initializing Counsellor Connect schema");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Seeds 4 verified certified counsellors and their availability schedules.
   */
  async seedCounsellors(): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const defaultPasswordHash = await hashPassword("Password123!");

      for (const seed of SEED_COUNSELLORS) {
        // 1. Check or create User
        let userId: string;
        const userRes = await client.query(
          "SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1",
          [seed.userEmail]
        );

        if (userRes.rows.length > 0) {
          userId = userRes.rows[0].id;
          await client.query(
            "UPDATE users SET password_hash = $1 WHERE id = $2",
            [defaultPasswordHash, userId]
          );
        } else {
          const newUserRes = await client.query(
            `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
             VALUES ($1, $2, $3, $4, 'ACTIVE', NOW())
             RETURNING id`,
            [seed.userEmail, defaultPasswordHash, seed.firstName, seed.lastName]
          );
          userId = newUserRes.rows[0].id;
        }

        // Assign CAREER_COUNSELLOR role
        await client.query(
          `INSERT INTO user_roles (user_id, role_id, is_primary)
           SELECT $1, r.id, true
           FROM roles r
           WHERE r.name = 'CAREER_COUNSELLOR'
           ON CONFLICT DO NOTHING`,
          [userId]
        );

        // 2. Upsert Counsellor Profile
        const counsellorRes = await client.query(
          `INSERT INTO counsellors (
             user_id, qualification, experience_years, bio, specialisations,
             languages, guidance_areas, profile_image, rating, review_count, reviews, approval_status
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'APPROVED')
           ON CONFLICT (user_id) DO UPDATE
           SET qualification = EXCLUDED.qualification,
               experience_years = EXCLUDED.experience_years,
               bio = EXCLUDED.bio,
               specialisations = EXCLUDED.specialisations,
               languages = EXCLUDED.languages,
               guidance_areas = EXCLUDED.guidance_areas,
               profile_image = EXCLUDED.profile_image,
               rating = EXCLUDED.rating,
               review_count = EXCLUDED.review_count,
               reviews = EXCLUDED.reviews,
               updated_at = NOW()
           RETURNING id`,
          [
            userId,
            seed.qualification,
            seed.experienceYears,
            seed.bio,
            JSON.stringify(seed.specialisations),
            JSON.stringify(seed.languages),
            JSON.stringify(seed.guidanceAreas),
            seed.profileImage,
            seed.rating,
            seed.reviewCount,
            JSON.stringify(seed.reviews),
          ]
        );

        const counsellorId = counsellorRes.rows[0].id;

        // 3. Insert Availability slots
        await client.query("DELETE FROM counsellor_availability WHERE counsellor_id = $1", [counsellorId]);
        for (const slot of seed.availability) {
          await client.query(
            `INSERT INTO counsellor_availability (counsellor_id, day, start_time, end_time, is_active)
             VALUES ($1, $2, $3, $4, true)`,
            [counsellorId, slot.day, slot.startTime, slot.endTime]
          );
        }
      }

      await client.query("COMMIT");
      logger.info(`✨ Successfully seeded ${SEED_COUNSELLORS.length} certified career counsellors.`);
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error({ err }, "Error seeding counsellors");
    } finally {
      client.release();
    }
  }

  /**
   * Retrieves all approved counsellors with availability details.
   */
  async findAllCounsellors(filters?: {
    search?: string;
    specialisation?: string;
    language?: string;
  }): Promise<CounsellorEntity[]> {
    let query = `
      SELECT c.id, c.user_id, c.qualification, c.experience_years, c.bio,
             c.specialisations, c.languages, c.guidance_areas, c.profile_image,
             c.rating, c.review_count, c.approval_status, c.created_at, c.updated_at,
             u.first_name, u.last_name, u.email,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', a.id,
                   'day', a.day,
                   'startTime', a.start_time,
                   'endTime', a.end_time,
                   'isActive', a.is_active
                 )
               ) FILTER (WHERE a.id IS NOT NULL),
               '[]'::json
             ) as availability
      FROM counsellors c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN counsellor_availability a ON c.id = a.counsellor_id AND a.is_active = true
      WHERE c.approval_status = 'APPROVED'
    `;

    const values: any[] = [];
    let paramIndex = 1;

    if (filters?.search) {
      query += ` AND (
        LOWER(u.first_name || ' ' || u.last_name) LIKE $${paramIndex}
        OR LOWER(c.qualification) LIKE $${paramIndex}
        OR LOWER(c.bio) LIKE $${paramIndex}
      )`;
      values.push(`%${filters.search.toLowerCase().trim()}%`);
      paramIndex++;
    }

    if (filters?.specialisation && filters.specialisation !== "ALL") {
      query += ` AND c.specialisations @> $${paramIndex}::jsonb`;
      values.push(JSON.stringify([filters.specialisation]));
      paramIndex++;
    }

    if (filters?.language && filters.language !== "ALL") {
      query += ` AND c.languages @> $${paramIndex}::jsonb`;
      values.push(JSON.stringify([filters.language]));
      paramIndex++;
    }

    query += `
      GROUP BY c.id, u.id
      ORDER BY c.rating DESC, c.experience_years DESC
    `;

    const res = await pool.query(query, values);
    return res.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      name: `${row.first_name} ${row.last_name}`.trim(),
      email: row.email,
      qualification: row.qualification,
      experienceYears: row.experience_years,
      bio: row.bio,
      specialisations: typeof row.specialisations === "string" ? JSON.parse(row.specialisations) : row.specialisations,
      languages: typeof row.languages === "string" ? JSON.parse(row.languages) : row.languages,
      profileImage: row.profile_image,
      rating: parseFloat(row.rating),
      reviewCount: row.review_count,
      approvalStatus: row.approval_status,
      availability: row.availability,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  /**
   * Retrieves single counsellor by counsellor ID or User ID.
   */
  async findCounsellorById(idOrUserId: string): Promise<any | null> {
    if (!idOrUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrUserId)) {
      return null;
    }

    const query = `
      SELECT c.id, c.user_id, c.qualification, c.experience_years, c.bio,
             c.specialisations, c.languages, c.guidance_areas, c.profile_image,
             c.rating, c.review_count, c.reviews, c.approval_status, c.created_at, c.updated_at,
             u.first_name, u.last_name, u.email,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', a.id,
                   'day', a.day,
                   'startTime', a.start_time,
                   'endTime', a.end_time,
                   'isActive', a.is_active
                 )
               ) FILTER (WHERE a.id IS NOT NULL),
               '[]'::json
             ) as availability
      FROM counsellors c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN counsellor_availability a ON c.id = a.counsellor_id AND a.is_active = true
      WHERE (c.id = $1 OR c.user_id = $1)
      GROUP BY c.id, u.id
      LIMIT 1
    `;

    const res = await pool.query(query, [idOrUserId]);
    if (!res.rows[0]) return null;

    const row = res.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      name: `${row.first_name} ${row.last_name}`.trim(),
      email: row.email,
      qualification: row.qualification,
      experienceYears: row.experience_years,
      bio: row.bio,
      specialisations: typeof row.specialisations === "string" ? JSON.parse(row.specialisations) : row.specialisations,
      languages: typeof row.languages === "string" ? JSON.parse(row.languages) : row.languages,
      guidanceAreas: typeof row.guidance_areas === "string" ? JSON.parse(row.guidance_areas) : row.guidance_areas,
      profileImage: row.profile_image,
      rating: parseFloat(row.rating),
      reviewCount: row.review_count,
      reviews: typeof row.reviews === "string" ? JSON.parse(row.reviews) : row.reviews,
      approvalStatus: row.approval_status,
      availability: row.availability,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Lazily provisions or retrieves a counsellor profile for an authenticated user.
   * If the user exists and has a CAREER_COUNSELLOR role or application, safely creates the profile and availability slots.
   */
  async findOrCreateCounsellorProfile(idOrUserId: string): Promise<any | null> {
    if (!idOrUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrUserId)) {
      return null;
    }

    const existing = await this.findCounsellorById(idOrUserId);
    if (existing) {
      return existing;
    }

    // Check if user exists in database
    const userRes = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email,
              ca.qualification as app_qualification, ca.organization as app_organization
       FROM users u
       LEFT JOIN counsellor_applications ca ON u.id = ca.user_id
       WHERE u.id = $1
       ORDER BY ca.created_at DESC
       LIMIT 1`,
      [idOrUserId]
    );

    if (!userRes.rows[0]) {
      return null;
    }

    const user = userRes.rows[0];
    const qualification = user.app_qualification || "Certified Career Guidance Counsellor";
    const bio = user.app_organization
      ? `Career & Educational Guidance Specialist at ${user.app_organization}.`
      : "Certified Career and Education Guidance Counsellor at MeLife.";
    const specialisations = ["Career Guidance", "Cognitive Aptitude Alignment", "Higher Education Advisory"];
    const languages = ["English"];
    const guidanceAreas = ["Stream Selection", "Psychometric Assessment Debriefing", "Career Roadmaps"];

    // Upsert counsellor profile safely
    const counsellorRes = await pool.query(
      `INSERT INTO counsellors (
         user_id, qualification, experience_years, bio,
         specialisations, languages, guidance_areas,
         rating, review_count, reviews, approval_status
       )
       VALUES ($1, $2, 1, $3, $4, $5, $6, 5.0, 0, '[]'::jsonb, 'APPROVED')
       ON CONFLICT (user_id) DO UPDATE
       SET updated_at = NOW()
       RETURNING id`,
      [
        user.id,
        qualification,
        bio,
        JSON.stringify(specialisations),
        JSON.stringify(languages),
        JSON.stringify(guidanceAreas),
      ]
    );

    const counsellorId = counsellorRes.rows[0]?.id;

    // Ensure default weekly availability slots exist
    if (counsellorId) {
      const defaultDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      for (const day of defaultDays) {
        await pool.query(
          `INSERT INTO counsellor_availability (counsellor_id, day, start_time, end_time, is_active)
           SELECT $1, $2, '09:00', '17:00', true
           WHERE NOT EXISTS (
             SELECT 1 FROM counsellor_availability WHERE counsellor_id = $1 AND day = $2
           )`,
          [counsellorId, day]
        );
      }
    }

    return this.findCounsellorById(user.id);
  }

  /**
   * Creates a new appointment / counselling session.
   */
  async createSession(data: {
    studentId: string;
    counsellorId: string;
    sessionType: SessionType;
    durationMinutes: number;
    sessionDate: string;
    sessionTime: string;
    studentNotes?: string;
  }): Promise<CounsellingSessionDTO> {
    const query = `
      INSERT INTO counselling_sessions (
        student_id, counsellor_id, session_type, duration_minutes, session_date, session_time, status, student_notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'PENDING', $7)
      RETURNING id, student_id, counsellor_id, session_type, duration_minutes,
                TO_CHAR(session_date, 'YYYY-MM-DD') as session_date, session_time,
                status, meeting_link, student_notes, created_at, updated_at
    `;
    const res = await pool.query(query, [
      data.studentId,
      data.counsellorId,
      data.sessionType,
      data.durationMinutes,
      data.sessionDate,
      data.sessionTime,
      data.studentNotes || null,
    ]);

    const row = res.rows[0];
    return {
      id: row.id,
      studentId: row.student_id,
      counsellorId: row.counsellor_id,
      sessionType: row.session_type,
      durationMinutes: row.duration_minutes,
      sessionDate: row.session_date,
      sessionTime: row.session_time,
      status: row.status,
      meetingLink: row.meeting_link,
      studentNotes: row.student_notes,
      hasConsent: true,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Retrieves a single session by session ID with student assessment & report status.
   */
  async findSessionById(sessionId: string): Promise<CounsellingSessionDTO | null> {
    if (!sessionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
      return null;
    }

    const query = `
      SELECT s.id, s.student_id, s.counsellor_id, s.session_type, s.duration_minutes,
             TO_CHAR(s.session_date, 'YYYY-MM-DD') as session_date, s.session_time,
             s.status, s.meeting_link, s.student_notes, s.created_at, s.updated_at,
             stu.first_name as student_first_name, stu.last_name as student_last_name, stu.email as student_email,
             c.qualification as counsellor_qualification, c.profile_image as counsellor_profile_image,
             cu.first_name as counsellor_first_name, cu.last_name as counsellor_last_name,
             EXISTS(
               SELECT 1 FROM student_counsellor_consent con
               WHERE con.student_id = s.student_id
                 AND con.counsellor_id = s.counsellor_id
                 AND con.permission = 'VIEW_ASSESSMENT_SUMMARY'
             ) as has_consent,
             EXISTS(
               SELECT 1 FROM counselling_notes cn
               WHERE cn.session_id = s.id
             ) as notes_added,
             CASE
               WHEN EXISTS(SELECT 1 FROM assessment_results ar WHERE ar.participant_id = s.student_id) THEN 'COMPLETED'
               WHEN EXISTS(SELECT 1 FROM assessment_attempts aa WHERE aa.participant_id = s.student_id AND aa.status = 'IN_PROGRESS') THEN 'IN_PROGRESS'
               ELSE 'NOT_STARTED'
             END as assessment_status,
             CASE
               WHEN EXISTS(SELECT 1 FROM assessment_reports rep WHERE rep.participant_id = s.student_id AND rep.status IN ('READY', 'GENERATED', 'COMPLETED'))
                 OR EXISTS(SELECT 1 FROM career_reports cr WHERE cr.student_id = s.student_id AND cr.status IN ('READY', 'GENERATED', 'COMPLETED')) THEN 'AVAILABLE'
               WHEN EXISTS(SELECT 1 FROM assessment_results ar WHERE ar.participant_id = s.student_id) THEN 'PENDING'
               ELSE 'NOT_AVAILABLE'
             END as report_status
      FROM counselling_sessions s
      JOIN users stu ON s.student_id = stu.id
      JOIN counsellors c ON s.counsellor_id = c.id
      JOIN users cu ON c.user_id = cu.id
      WHERE s.id = $1
      LIMIT 1
    `;

    const res = await pool.query(query, [sessionId]);
    if (!res.rows[0]) return null;

    const r = res.rows[0];
    return {
      id: r.id,
      studentId: r.student_id,
      studentName: `${r.student_first_name} ${r.student_last_name}`.trim(),
      studentEmail: r.student_email,
      counsellorId: r.counsellor_id,
      counsellorName: `${r.counsellor_first_name} ${r.counsellor_last_name}`.trim(),
      counsellorQualification: r.counsellor_qualification,
      counsellorProfileImage: r.counsellor_profile_image,
      sessionType: r.session_type,
      durationMinutes: r.duration_minutes,
      sessionDate: r.session_date,
      sessionTime: r.session_time,
      status: r.status,
      meetingLink: r.meeting_link,
      studentNotes: r.student_notes,
      hasConsent: Boolean(r.has_consent),
      notesAdded: Boolean(r.notes_added),
      assessmentStatus: r.assessment_status,
      reportStatus: r.report_status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  /**
   * Retrieves all sessions booked by a student.
   */
  async findSessionsByStudentId(studentId: string): Promise<CounsellingSessionDTO[]> {
    const query = `
      SELECT s.id, s.student_id, s.counsellor_id, s.session_type, s.duration_minutes,
             TO_CHAR(s.session_date, 'YYYY-MM-DD') as session_date, s.session_time,
             s.status, s.meeting_link, s.student_notes, s.created_at, s.updated_at,
             c.qualification as counsellor_qualification, c.profile_image as counsellor_profile_image,
             cu.first_name as counsellor_first_name, cu.last_name as counsellor_last_name,
             EXISTS(
               SELECT 1 FROM student_counsellor_consent con
               WHERE con.student_id = s.student_id
                 AND con.counsellor_id = s.counsellor_id
                 AND con.permission = 'VIEW_ASSESSMENT_SUMMARY'
             ) as has_consent,
             EXISTS(
               SELECT 1 FROM counselling_notes cn
               WHERE cn.session_id = s.id
             ) as notes_added
      FROM counselling_sessions s
      JOIN counsellors c ON s.counsellor_id = c.id
      JOIN users cu ON c.user_id = cu.id
      WHERE s.student_id = $1
      ORDER BY s.session_date DESC, s.session_time DESC
    `;

    const res = await pool.query(query, [studentId]);
    return res.rows.map((r) => ({
      id: r.id,
      studentId: r.student_id,
      counsellorId: r.counsellor_id,
      counsellorName: `${r.counsellor_first_name} ${r.counsellor_last_name}`.trim(),
      counsellorQualification: r.counsellor_qualification,
      counsellorProfileImage: r.counsellor_profile_image,
      sessionType: r.session_type,
      durationMinutes: r.duration_minutes,
      sessionDate: r.session_date,
      sessionTime: r.session_time,
      status: r.status,
      meetingLink: r.meeting_link,
      studentNotes: r.student_notes,
      hasConsent: Boolean(r.has_consent),
      notesAdded: Boolean(r.notes_added),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  /**
   * Retrieves all sessions assigned to a counsellor with student assessment/report status & advanced filtering.
   */
  async findSessionsByCounsellorId(
    counsellorId: string,
    filtersOrStatus?: string | CounsellorSessionFilterParams
  ): Promise<CounsellingSessionDTO[]> {
    const filters: CounsellorSessionFilterParams =
      typeof filtersOrStatus === "string" ? { status: filtersOrStatus } : filtersOrStatus || {};

    let query = `
      SELECT s.id, s.student_id, s.counsellor_id, s.session_type, s.duration_minutes,
             TO_CHAR(s.session_date, 'YYYY-MM-DD') as session_date, s.session_time,
             s.status, s.meeting_link, s.student_notes, s.created_at, s.updated_at,
             stu.first_name as student_first_name, stu.last_name as student_last_name, stu.email as student_email,
             c.qualification as counsellor_qualification, c.profile_image as counsellor_profile_image,
             cu.first_name as counsellor_first_name, cu.last_name as counsellor_last_name,
             EXISTS(
               SELECT 1 FROM student_counsellor_consent con
               WHERE con.student_id = s.student_id
                 AND con.counsellor_id = s.counsellor_id
                 AND con.permission = 'VIEW_ASSESSMENT_SUMMARY'
             ) as has_consent,
             EXISTS(
               SELECT 1 FROM counselling_notes cn
               WHERE cn.session_id = s.id
             ) as notes_added,
             CASE
               WHEN EXISTS(SELECT 1 FROM assessment_results ar WHERE ar.participant_id = s.student_id) THEN 'COMPLETED'
               WHEN EXISTS(SELECT 1 FROM assessment_attempts aa WHERE aa.participant_id = s.student_id AND aa.status = 'IN_PROGRESS') THEN 'IN_PROGRESS'
               ELSE 'NOT_STARTED'
             END as assessment_status,
             CASE
               WHEN EXISTS(SELECT 1 FROM assessment_reports rep WHERE rep.participant_id = s.student_id AND rep.status IN ('READY', 'GENERATED', 'COMPLETED'))
                 OR EXISTS(SELECT 1 FROM career_reports cr WHERE cr.student_id = s.student_id AND cr.status IN ('READY', 'GENERATED', 'COMPLETED')) THEN 'AVAILABLE'
               WHEN EXISTS(SELECT 1 FROM assessment_results ar WHERE ar.participant_id = s.student_id) THEN 'PENDING'
               ELSE 'NOT_AVAILABLE'
             END as report_status
      FROM counselling_sessions s
      JOIN users stu ON s.student_id = stu.id
      JOIN counsellors c ON s.counsellor_id = c.id
      JOIN users cu ON c.user_id = cu.id
      WHERE s.counsellor_id = $1
    `;

    const values: any[] = [counsellorId];
    let paramIndex = 2;

    // 1. Status Filter
    if (filters.status && filters.status !== "ALL") {
      if (filters.status === "TODAY") {
        query += ` AND s.session_date = CURRENT_DATE`;
      } else if (filters.status === "UPCOMING") {
        query += ` AND s.session_date >= CURRENT_DATE AND s.status = 'CONFIRMED'`;
      } else {
        query += ` AND s.status = $${paramIndex}`;
        values.push(filters.status);
        paramIndex++;
      }
    }

    // 2. Search Keyword Filter
    if (filters.search && filters.search.trim()) {
      const sTerm = `%${filters.search.trim().toLowerCase()}%`;
      query += ` AND (
        LOWER(stu.first_name || ' ' || stu.last_name) LIKE $${paramIndex}
        OR LOWER(stu.email) LIKE $${paramIndex}
        OR LOWER(s.session_type) LIKE $${paramIndex}
        OR LOWER(COALESCE(s.student_notes, '')) LIKE $${paramIndex}
      )`;
      values.push(sTerm);
      paramIndex++;
    }

    // 3. Date Filter
    if (filters.dateFilter && filters.dateFilter !== "ALL") {
      if (filters.dateFilter === "TODAY") {
        query += ` AND s.session_date = CURRENT_DATE`;
      } else if (filters.dateFilter === "THIS_WEEK") {
        query += ` AND s.session_date >= date_trunc('week', CURRENT_DATE)::date AND s.session_date < (date_trunc('week', CURRENT_DATE) + interval '7 days')::date`;
      } else if (filters.dateFilter === "THIS_MONTH") {
        query += ` AND s.session_date >= date_trunc('month', CURRENT_DATE)::date AND s.session_date < (date_trunc('month', CURRENT_DATE) + interval '1 month')::date`;
      } else if (filters.dateFilter === "UPCOMING") {
        query += ` AND s.session_date >= CURRENT_DATE`;
      } else if (filters.dateFilter === "PAST") {
        query += ` AND s.session_date < CURRENT_DATE`;
      }
    }

    // 4. Assessment Status Filter
    if (filters.assessmentStatus && filters.assessmentStatus !== "ALL") {
      if (filters.assessmentStatus === "COMPLETED") {
        query += ` AND EXISTS(SELECT 1 FROM assessment_results ar WHERE ar.participant_id = s.student_id)`;
      } else if (filters.assessmentStatus === "IN_PROGRESS") {
        query += ` AND EXISTS(SELECT 1 FROM assessment_attempts aa WHERE aa.participant_id = s.student_id AND aa.status = 'IN_PROGRESS') AND NOT EXISTS(SELECT 1 FROM assessment_results ar WHERE ar.participant_id = s.student_id)`;
      } else if (filters.assessmentStatus === "NOT_STARTED") {
        query += ` AND NOT EXISTS(SELECT 1 FROM assessment_results ar WHERE ar.participant_id = s.student_id) AND NOT EXISTS(SELECT 1 FROM assessment_attempts aa WHERE aa.participant_id = s.student_id)`;
      }
    }

    // 5. Report Status Filter
    if (filters.reportStatus && filters.reportStatus !== "ALL") {
      if (filters.reportStatus === "AVAILABLE") {
        query += ` AND (EXISTS(SELECT 1 FROM assessment_reports rep WHERE rep.participant_id = s.student_id AND rep.status IN ('READY', 'GENERATED', 'COMPLETED')) OR EXISTS(SELECT 1 FROM career_reports cr WHERE cr.student_id = s.student_id AND cr.status IN ('READY', 'GENERATED', 'COMPLETED')))`;
      } else if (filters.reportStatus === "PENDING") {
        query += ` AND EXISTS(SELECT 1 FROM assessment_results ar WHERE ar.participant_id = s.student_id) AND NOT EXISTS(SELECT 1 FROM assessment_reports rep WHERE rep.participant_id = s.student_id AND rep.status IN ('READY', 'GENERATED', 'COMPLETED')) AND NOT EXISTS(SELECT 1 FROM career_reports cr WHERE cr.student_id = s.student_id AND cr.status IN ('READY', 'GENERATED', 'COMPLETED'))`;
      } else if (filters.reportStatus === "NOT_AVAILABLE") {
        query += ` AND NOT EXISTS(SELECT 1 FROM assessment_results ar WHERE ar.participant_id = s.student_id)`;
      }
    }

    // 6. Sorting
    const sortOrder = filters.sortOrder === "desc" ? "DESC" : "ASC";
    if (filters.sortBy === "student") {
      query += ` ORDER BY stu.first_name ${sortOrder}, stu.last_name ${sortOrder}`;
    } else if (filters.sortBy === "status") {
      query += ` ORDER BY s.status ${sortOrder}, s.session_date DESC`;
    } else {
      // Default: sort by session_date, session_time
      query += ` ORDER BY s.session_date ${sortOrder}, s.session_time ${sortOrder}`;
    }

    // 7. Pagination
    if (filters.limit && filters.limit > 0) {
      query += ` LIMIT $${paramIndex}`;
      values.push(filters.limit);
      paramIndex++;

      if (filters.page && filters.page > 1) {
        const offset = (filters.page - 1) * filters.limit;
        query += ` OFFSET $${paramIndex}`;
        values.push(offset);
        paramIndex++;
      }
    }

    const res = await pool.query(query, values);
    return res.rows.map((r) => ({
      id: r.id,
      studentId: r.student_id,
      studentName: `${r.student_first_name} ${r.student_last_name}`.trim(),
      studentEmail: r.student_email,
      counsellorId: r.counsellor_id,
      counsellorName: `${r.counsellor_first_name} ${r.counsellor_last_name}`.trim(),
      counsellorQualification: r.counsellor_qualification,
      counsellorProfileImage: r.counsellor_profile_image,
      sessionType: r.session_type,
      durationMinutes: r.duration_minutes,
      sessionDate: r.session_date,
      sessionTime: r.session_time,
      status: r.status,
      meetingLink: r.meeting_link,
      studentNotes: r.student_notes,
      hasConsent: Boolean(r.has_consent),
      notesAdded: Boolean(r.notes_added),
      assessmentStatus: r.assessment_status,
      reportStatus: r.report_status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  /**
   * Updates session status and meeting link.
   */
  async updateSessionStatus(
    sessionId: string,
    status: SessionStatus,
    meetingLink?: string | null
  ): Promise<any> {
    const query = `
      UPDATE counselling_sessions
      SET status = $1,
          meeting_link = COALESCE($2, meeting_link),
          updated_at = NOW()
      WHERE id = $3
      RETURNING id, student_id, counsellor_id, session_type, status, meeting_link, session_date, session_time
    `;
    const res = await pool.query(query, [status, meetingLink || null, sessionId]);
    return res.rows[0] || null;
  }

  /**
   * Upserts student consent for a counsellor.
   */
  async upsertConsent(
    studentId: string,
    counsellorId: string,
    permission: ConsentPermission
  ): Promise<void> {
    const query = `
      INSERT INTO student_counsellor_consent (student_id, counsellor_id, permission, granted_at, revoked_at)
      VALUES (
        $1, $2, $3,
        NOW(),
        ${permission === "REVOKED" ? "NOW()" : "NULL"}
      )
      ON CONFLICT (student_id, counsellor_id) DO UPDATE
      SET permission = EXCLUDED.permission,
          granted_at = CASE WHEN EXCLUDED.permission = 'VIEW_ASSESSMENT_SUMMARY' THEN NOW() ELSE student_counsellor_consent.granted_at END,
          revoked_at = CASE WHEN EXCLUDED.permission = 'REVOKED' THEN NOW() ELSE NULL END
    `;
    await pool.query(query, [studentId, counsellorId, permission]);
  }

  /**
   * Checks if student has granted profile summary consent to a counsellor.
   */
  async hasConsent(studentId: string, counsellorId: string): Promise<boolean> {
    const query = `
      SELECT 1 FROM student_counsellor_consent
      WHERE student_id = $1 AND counsellor_id = $2 AND permission = 'VIEW_ASSESSMENT_SUMMARY'
      LIMIT 1
    `;
    const res = await pool.query(query, [studentId, counsellorId]);
    return res.rows.length > 0;
  }

  /**
   * Saves or updates counselling notes for a session.
   */
  async saveCounsellingNotes(data: {
    sessionId: string;
    counsellorId: string;
    studentId: string;
    summary: string;
    observations?: string;
    recommendations: string;
    actionPlan?: string[];
    followUpDate?: string | null;
  }): Promise<CounsellingNoteDTO> {
    const query = `
      INSERT INTO counselling_notes (
        session_id, counsellor_id, student_id, summary, observations, recommendations, action_plan, follow_up_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (session_id) DO UPDATE
      SET summary = EXCLUDED.summary,
          observations = EXCLUDED.observations,
          recommendations = EXCLUDED.recommendations,
          action_plan = EXCLUDED.action_plan,
          follow_up_date = EXCLUDED.follow_up_date,
          updated_at = NOW()
      RETURNING id, session_id, counsellor_id, student_id, summary, observations,
                recommendations, action_plan, TO_CHAR(follow_up_date, 'YYYY-MM-DD') as follow_up_date,
                created_at, updated_at
    `;
    const res = await pool.query(query, [
      data.sessionId,
      data.counsellorId,
      data.studentId,
      data.summary,
      data.observations || null,
      data.recommendations,
      JSON.stringify(data.actionPlan || []),
      data.followUpDate || null,
    ]);

    const r = res.rows[0];
    return {
      id: r.id,
      sessionId: r.session_id,
      counsellorId: r.counsellor_id,
      studentId: r.student_id,
      summary: r.summary,
      observations: r.observations,
      recommendations: r.recommendations,
      actionPlan: typeof r.action_plan === "string" ? JSON.parse(r.action_plan) : r.action_plan,
      followUpDate: r.follow_up_date,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  /**
   * Retrieves counselling notes by session ID.
   */
  async findCounsellingNotesBySessionId(sessionId: string): Promise<CounsellingNoteDTO | null> {
    const query = `
      SELECT id, session_id, counsellor_id, student_id, summary, observations,
             recommendations, action_plan, TO_CHAR(follow_up_date, 'YYYY-MM-DD') as follow_up_date,
             created_at, updated_at
      FROM counselling_notes
      WHERE session_id = $1
      LIMIT 1
    `;
    const res = await pool.query(query, [sessionId]);
    if (!res.rows[0]) return null;

    const r = res.rows[0];
    return {
      id: r.id,
      sessionId: r.session_id,
      counsellorId: r.counsellor_id,
      studentId: r.student_id,
      summary: r.summary,
      observations: r.observations,
      recommendations: r.recommendations,
      actionPlan: typeof r.action_plan === "string" ? JSON.parse(r.action_plan) : r.action_plan,
      followUpDate: r.follow_up_date,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  /**
   * Retrieves list of students who have booked sessions with the counsellor.
   */
  async findAssignedStudentsByCounsellorId(counsellorId: string): Promise<any[]> {
    const query = `
      SELECT DISTINCT ON (stu.id)
        stu.id as student_id,
        stu.first_name || ' ' || stu.last_name as student_name,
        stu.email as student_email,
        p.education_stage,
        p.grade_level,
        p.school_name,
        EXISTS(
          SELECT 1 FROM student_counsellor_consent con
          WHERE con.student_id = stu.id
            AND con.counsellor_id = $1
            AND con.permission = 'VIEW_ASSESSMENT_SUMMARY'
        ) as has_consent,
        EXISTS(
          SELECT 1 FROM assessment_results ar
          WHERE ar.participant_id = stu.id
        ) as is_assessed,
        (
          SELECT COUNT(*)::int FROM counselling_sessions cs
          WHERE cs.student_id = stu.id AND cs.counsellor_id = $1
        ) as session_count,
        (
          SELECT TO_CHAR(cs2.session_date, 'YYYY-MM-DD') FROM counselling_sessions cs2
          WHERE cs2.student_id = stu.id AND cs2.counsellor_id = $1
          ORDER BY cs2.session_date DESC
          LIMIT 1
        ) as latest_session_date
      FROM counselling_sessions s
      JOIN users stu ON s.student_id = stu.id
      LEFT JOIN participant_profiles p ON stu.id = p.user_id
      WHERE s.counsellor_id = $1
      ORDER BY stu.id
    `;
    const res = await pool.query(query, [counsellorId]);
    return res.rows;
  }

  /**
   * Retrieves today's sessions scheduled for the authenticated counsellor.
   */
  async findTodaySessionsByCounsellorId(counsellorId: string): Promise<CounsellingSessionDTO[]> {
    const query = `
      SELECT s.id, s.student_id, s.counsellor_id, s.session_type, s.duration_minutes,
             TO_CHAR(s.session_date, 'YYYY-MM-DD') as session_date, s.session_time,
             s.status, s.meeting_link, s.student_notes, s.created_at, s.updated_at,
             stu.first_name as student_first_name, stu.last_name as student_last_name, stu.email as student_email,
             c.qualification as counsellor_qualification, c.profile_image as counsellor_profile_image,
             cu.first_name as counsellor_first_name, cu.last_name as counsellor_last_name,
             EXISTS(
               SELECT 1 FROM student_counsellor_consent con
               WHERE con.student_id = s.student_id
                 AND con.counsellor_id = s.counsellor_id
                 AND con.permission = 'VIEW_ASSESSMENT_SUMMARY'
             ) as has_consent,
             EXISTS(
               SELECT 1 FROM counselling_notes cn
               WHERE cn.session_id = s.id
             ) as notes_added
      FROM counselling_sessions s
      JOIN users stu ON s.student_id = stu.id
      JOIN counsellors c ON s.counsellor_id = c.id
      JOIN users cu ON c.user_id = cu.id
      WHERE s.counsellor_id = $1
        AND s.session_date = CURRENT_DATE
        AND s.status NOT IN ('CANCELLED', 'REJECTED')
      ORDER BY s.session_time ASC
    `;

    const res = await pool.query(query, [counsellorId]);
    return res.rows.map((r) => ({
      id: r.id,
      studentId: r.student_id,
      studentName: `${r.student_first_name} ${r.student_last_name}`.trim(),
      studentEmail: r.student_email,
      counsellorId: r.counsellor_id,
      counsellorName: `${r.counsellor_first_name} ${r.counsellor_last_name}`.trim(),
      counsellorQualification: r.counsellor_qualification,
      counsellorProfileImage: r.counsellor_profile_image,
      sessionType: r.session_type,
      durationMinutes: r.duration_minutes,
      sessionDate: r.session_date,
      sessionTime: r.session_time,
      status: r.status,
      meetingLink: r.meeting_link,
      studentNotes: r.student_notes,
      hasConsent: Boolean(r.has_consent),
      notesAdded: Boolean(r.notes_added),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  /**
   * Retrieves aggregated 6-metric statistics for a counsellor's portal.
   * Accurately calculates available slots based on weekly availability schedule minus active bookings.
   * Student count is derived strictly from distinct students who booked with this counsellor.
   */
  async getCounsellorOverviewStats(counsellorId: string): Promise<{
    todaySessionsCount: number;
    upcomingSessionsCount: number;
    pendingRequestsCount: number;
    completedSessionsCount: number;
    availableSlotsCount: number;
    totalAssignedStudentsCount: number;
    todaySessions: number;
    upcomingSessions: number;
    pendingRequests: number;
    completedSessions: number;
    availableSlots: number;
    studentCount: number;
  }> {
    const query = `
      SELECT
        COUNT(CASE WHEN session_date = CURRENT_DATE AND status IN ('CONFIRMED', 'PENDING') THEN 1 END)::int as today_count,
        COUNT(CASE WHEN session_date >= CURRENT_DATE AND status = 'CONFIRMED' THEN 1 END)::int as upcoming_count,
        COUNT(CASE WHEN status = 'PENDING' THEN 1 END)::int as pending_count,
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END)::int as completed_count,
        GREATEST(
          0,
          (SELECT COUNT(*)::int FROM counsellor_availability WHERE counsellor_id = $1 AND is_active = true) -
          (SELECT COUNT(*)::int FROM counselling_sessions
           WHERE counsellor_id = $1
             AND session_date >= date_trunc('week', CURRENT_DATE)::date
             AND session_date < (date_trunc('week', CURRENT_DATE) + interval '7 days')::date
             AND status IN ('CONFIRMED', 'PENDING'))
        )::int as available_slots_count,
        COUNT(DISTINCT student_id)::int as total_students_count
      FROM counselling_sessions
      WHERE counsellor_id = $1
    `;
    const res = await pool.query(query, [counsellorId]);
    const row = res.rows[0];

    const todaySessionsCount = row?.today_count || 0;
    const upcomingSessionsCount = row?.upcoming_count || 0;
    const pendingRequestsCount = row?.pending_count || 0;
    const completedSessionsCount = row?.completed_count || 0;
    const availableSlotsCount = row?.available_slots_count ?? 0;
    const totalAssignedStudentsCount = row?.total_students_count || 0;

    return {
      todaySessionsCount,
      upcomingSessionsCount,
      pendingRequestsCount,
      completedSessionsCount,
      availableSlotsCount,
      totalAssignedStudentsCount,
      todaySessions: todaySessionsCount,
      upcomingSessions: upcomingSessionsCount,
      pendingRequests: pendingRequestsCount,
      completedSessions: completedSessionsCount,
      availableSlots: availableSlotsCount,
      studentCount: totalAssignedStudentsCount,
    };
  }

  /**
   * Updates counsellor's own profile without modifying admin verification status.
   */
  async updateCounsellorProfile(
    counsellorId: string,
    data: {
      bio?: string;
      qualification?: string;
      experienceYears?: number;
      specialisations?: string[];
      languages?: string[];
      guidanceAreas?: string[];
      profileImage?: string | null;
    }
  ): Promise<any> {
    const query = `
      UPDATE counsellors
      SET bio = COALESCE($1, bio),
          qualification = COALESCE($2, qualification),
          experience_years = COALESCE($3, experience_years),
          specialisations = COALESCE($4::jsonb, specialisations),
          languages = COALESCE($5::jsonb, languages),
          guidance_areas = COALESCE($6::jsonb, guidance_areas),
          profile_image = COALESCE($7, profile_image),
          updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `;
    const res = await pool.query(query, [
      data.bio || null,
      data.qualification || null,
      data.experienceYears !== undefined ? data.experienceYears : null,
      data.specialisations ? JSON.stringify(data.specialisations) : null,
      data.languages ? JSON.stringify(data.languages) : null,
      data.guidanceAreas ? JSON.stringify(data.guidanceAreas) : null,
      data.profileImage !== undefined ? data.profileImage : null,
      counsellorId,
    ]);
    return res.rows[0] || null;
  }

  /**
   * Retrieves active availability slots for a counsellor.
   */
  async getCounsellorAvailability(counsellorId: string): Promise<CounsellorAvailability[]> {
    const query = `
      SELECT id, counsellor_id as "counsellorId", day, start_time as "startTime", end_time as "endTime", is_active as "isActive"
      FROM counsellor_availability
      WHERE counsellor_id = $1
      ORDER BY
        CASE day
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
          ELSE 8
        END, start_time ASC
    `;
    const res = await pool.query(query, [counsellorId]);
    return res.rows;
  }

  /**
   * Replaces weekly recurring availability slots for a counsellor.
   */
  async replaceCounsellorAvailability(
    counsellorId: string,
    slots: CounsellorAvailability[]
  ): Promise<CounsellorAvailability[]> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("DELETE FROM counsellor_availability WHERE counsellor_id = $1", [counsellorId]);

      for (const slot of slots) {
        await client.query(
          `INSERT INTO counsellor_availability (counsellor_id, day, start_time, end_time, is_active)
           VALUES ($1, $2, $3, $4, $5)`,
          [counsellorId, slot.day, slot.startTime, slot.endTime, slot.isActive !== false]
        );
      }

      await client.query("COMMIT");
      return this.getCounsellorAvailability(counsellorId);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Retrieves review list for a counsellor from their profile and completed sessions.
   */
  async getCounsellorReviews(counsellorId: string): Promise<any[]> {
    const counsellor = await this.findCounsellorById(counsellorId);
    if (!counsellor) return [];
    return counsellor.reviews || [];
  }

  /**
   * Dispatches a user notification.
   */
  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const query = `
      INSERT INTO notifications (user_id, title, message, type, metadata, is_read)
      VALUES ($1, $2, $3, $4, $5, false)
    `;
    await pool.query(query, [
      data.userId,
      data.title,
      data.message,
      data.type,
      JSON.stringify(data.metadata || {}),
    ]);
  }

  /**
   * Retrieves recent notifications for a user.
   */
  async findNotificationsByUserId(userId: string): Promise<NotificationDTO[]> {
    const query = `
      SELECT id, user_id, title, message, type, metadata, is_read, created_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 30
    `;
    const res = await pool.query(query, [userId]);
    return res.rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      title: r.title,
      message: r.message,
      type: r.type,
      metadata: typeof r.metadata === "string" ? JSON.parse(r.metadata) : r.metadata,
      isRead: r.is_read,
      createdAt: r.created_at,
    }));
  }

  /**
   * Marks a notification as read.
   */
  async markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
    const query = `
      UPDATE notifications
      SET is_read = true
      WHERE id = $1 AND user_id = $2
    `;
    await pool.query(query, [notificationId, userId]);
  }
}

export const counsellingRepository = new CounsellingRepository();
