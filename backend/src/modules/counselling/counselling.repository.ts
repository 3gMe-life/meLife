import { pool } from "../../config/database";
import { logger } from "../../common/utils/logger";
import { hashPassword } from "../../common/utils/crypto";
import { SEED_COUNSELLORS } from "./counselling.seed-data";
import {
  CounsellorEntity,
  CounsellingSessionDTO,
  CounsellingNoteDTO,
  ConsentPermission,
  NotificationDTO,
  NotificationType,
  SessionStatus,
  SessionType,
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
   * Retrieves a single session by session ID.
   */
  async findSessionById(sessionId: string): Promise<any | null> {
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
             ) as notes_added
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
   * Retrieves all sessions assigned to a counsellor.
   */
  async findSessionsByCounsellorId(
    counsellorId: string,
    status?: string
  ): Promise<CounsellingSessionDTO[]> {
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
             ) as notes_added
      FROM counselling_sessions s
      JOIN users stu ON s.student_id = stu.id
      JOIN counsellors c ON s.counsellor_id = c.id
      JOIN users cu ON c.user_id = cu.id
      WHERE s.counsellor_id = $1
    `;

    const values: any[] = [counsellorId];
    if (status && status !== "ALL") {
      query += ` AND s.status = $2`;
      values.push(status);
    }

    query += ` ORDER BY s.session_date ASC, s.session_time ASC`;

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
   * Retrieves aggregated statistics for a counsellor's portal.
   */
  async getCounsellorOverviewStats(counsellorId: string): Promise<{
    upcomingSessionsCount: number;
    pendingRequestsCount: number;
    completedSessionsCount: number;
    totalAssignedStudentsCount: number;
  }> {
    const query = `
      SELECT
        COUNT(CASE WHEN status = 'CONFIRMED' AND session_date >= CURRENT_DATE THEN 1 END)::int as upcoming_count,
        COUNT(CASE WHEN status = 'PENDING' THEN 1 END)::int as pending_count,
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END)::int as completed_count,
        COUNT(DISTINCT student_id)::int as total_students_count
      FROM counselling_sessions
      WHERE counsellor_id = $1
    `;
    const res = await pool.query(query, [counsellorId]);
    const row = res.rows[0];
    return {
      upcomingSessionsCount: row?.upcoming_count || 0,
      pendingRequestsCount: row?.pending_count || 0,
      completedSessionsCount: row?.completed_count || 0,
      totalAssignedStudentsCount: row?.total_students_count || 0,
    };
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
