import { PoolClient } from "pg";
import { pool } from "../../config/database";
import { ParticipantProfile, ParticipantOnboardingDTO, UpdateParticipantProfileDTO } from "./participant.types";
import { logger } from "../../common/utils/logger";

export class ParticipantRepository {
  /**
   * Initializes or upgrades PostgreSQL schema for Participant & Student profiles.
   */
  async initSchema(): Promise<void> {
    try {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        // 1. Upgrade student_profiles table with additional education & guardian metadata
        await client.query(`
          ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
          ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS grade_level VARCHAR(50);
          ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS school_name VARCHAR(255);
          ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS curriculum_or_board VARCHAR(100);
          ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS guardian_relationship VARCHAR(50);
          ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;
        `);

        // 2. Create canonical participant_profiles table
        await client.query(`
          CREATE TABLE IF NOT EXISTS participant_profiles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
            date_of_birth DATE,
            education_stage VARCHAR(100),
            grade_level VARCHAR(50),
            school_name VARCHAR(255),
            curriculum_or_board VARCHAR(100),
            guardian_name VARCHAR(255),
            guardian_phone VARCHAR(50),
            guardian_email VARCHAR(255),
            guardian_relationship VARCHAR(50),
            guardian_verification_status VARCHAR(50) DEFAULT 'PENDING',
            is_onboarded BOOLEAN DEFAULT FALSE,
            onboarding_completed_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );

          CREATE INDEX IF NOT EXISTS idx_participant_profiles_user_id ON participant_profiles(user_id);
        `);

        // 3. Sync existing student_profiles records to participant_profiles if missing
        await client.query(`
          INSERT INTO participant_profiles (
            user_id, date_of_birth, education_stage, grade_level, school_name, curriculum_or_board,
            guardian_name, guardian_phone, guardian_email, guardian_relationship, guardian_verification_status,
            is_onboarded, onboarding_completed_at, created_at, updated_at
          )
          SELECT
            sp.user_id, sp.date_of_birth, sp.education_stage, sp.grade_level, sp.school_name, sp.curriculum_or_board,
            sp.guardian_name, sp.guardian_phone, sp.guardian_email, sp.guardian_relationship,
            COALESCE(sp.guardian_verification_status, 'PENDING'),
            COALESCE(sp.is_onboarded, false), sp.onboarding_completed_at, sp.created_at, sp.updated_at
          FROM student_profiles sp
          ON CONFLICT (user_id) DO UPDATE
          SET
            date_of_birth = COALESCE(EXCLUDED.date_of_birth, participant_profiles.date_of_birth),
            education_stage = COALESCE(EXCLUDED.education_stage, participant_profiles.education_stage),
            grade_level = COALESCE(EXCLUDED.grade_level, participant_profiles.grade_level),
            school_name = COALESCE(EXCLUDED.school_name, participant_profiles.school_name),
            curriculum_or_board = COALESCE(EXCLUDED.curriculum_or_board, participant_profiles.curriculum_or_board),
            guardian_name = COALESCE(EXCLUDED.guardian_name, participant_profiles.guardian_name),
            guardian_phone = COALESCE(EXCLUDED.guardian_phone, participant_profiles.guardian_phone),
            guardian_email = COALESCE(EXCLUDED.guardian_email, participant_profiles.guardian_email),
            guardian_relationship = COALESCE(EXCLUDED.guardian_relationship, participant_profiles.guardian_relationship),
            is_onboarded = EXCLUDED.is_onboarded OR participant_profiles.is_onboarded,
            updated_at = NOW();
        `);

        await client.query("COMMIT");
        logger.info("📦 Participant profile schema initialized and verified.");
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error({ error }, "Error initializing participant profile schema");
    }
  }

  /**
   * Finds a participant profile by user ID with attached user identity metadata.
   */
  async findByUserId(
    userId: string,
    client?: PoolClient
  ): Promise<ParticipantProfile | null> {
    const db = client || pool;
    const query = `
      SELECT
        p.id,
        p.user_id as "userId",
        u.first_name as "firstName",
        u.last_name as "lastName",
        u.email as "email",
        TO_CHAR(p.date_of_birth, 'YYYY-MM-DD') as "dateOfBirth",
        p.education_stage as "educationStage",
        p.grade_level as "gradeLevel",
        p.school_name as "schoolName",
        p.curriculum_or_board as "curriculumOrBoard",
        p.guardian_name as "guardianName",
        p.guardian_phone as "guardianPhone",
        p.guardian_email as "guardianEmail",
        p.guardian_relationship as "guardianRelationship",
        p.guardian_verification_status as "guardianVerificationStatus",
        p.is_onboarded as "isOnboarded",
        p.onboarding_completed_at as "onboardingCompletedAt",
        p.created_at as "createdAt",
        p.updated_at as "updatedAt"
      FROM participant_profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1
      LIMIT 1
    `;
    const res = await db.query(query, [userId]);
    return res.rows[0] || null;
  }

  /**
   * Upserts participant profile, updates user names if provided, and syncs student_profiles.
   */
  async upsertProfile(
    userId: string,
    data: UpdateParticipantProfileDTO,
    client?: PoolClient
  ): Promise<ParticipantProfile> {
    const db = client || pool;

    // Update user first_name and last_name if provided
    if (data.firstName !== undefined || data.lastName !== undefined) {
      const userRes = await db.query(`SELECT first_name, last_name FROM users WHERE id = $1`, [userId]);
      const currentFirst = userRes.rows[0]?.first_name || "";
      const currentLast = userRes.rows[0]?.last_name || "";
      const newFirst = data.firstName !== undefined ? data.firstName.trim() : currentFirst;
      const newLast = data.lastName !== undefined ? data.lastName.trim() : currentLast;

      await db.query(
        `UPDATE users SET first_name = $2, last_name = $3, updated_at = NOW() WHERE id = $1`,
        [userId, newFirst, newLast]
      );
    }

    const query = `
      INSERT INTO participant_profiles (
        user_id,
        date_of_birth,
        education_stage,
        grade_level,
        school_name,
        curriculum_or_board,
        guardian_name,
        guardian_phone,
        guardian_email,
        guardian_relationship,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (user_id) DO UPDATE
      SET
        date_of_birth = COALESCE(EXCLUDED.date_of_birth, participant_profiles.date_of_birth),
        education_stage = COALESCE(EXCLUDED.education_stage, participant_profiles.education_stage),
        grade_level = COALESCE(EXCLUDED.grade_level, participant_profiles.grade_level),
        school_name = COALESCE(EXCLUDED.school_name, participant_profiles.school_name),
        curriculum_or_board = COALESCE(EXCLUDED.curriculum_or_board, participant_profiles.curriculum_or_board),
        guardian_name = COALESCE(EXCLUDED.guardian_name, participant_profiles.guardian_name),
        guardian_phone = COALESCE(EXCLUDED.guardian_phone, participant_profiles.guardian_phone),
        guardian_email = COALESCE(EXCLUDED.guardian_email, participant_profiles.guardian_email),
        guardian_relationship = COALESCE(EXCLUDED.guardian_relationship, participant_profiles.guardian_relationship),
        updated_at = NOW()
      RETURNING
        id,
        user_id as "userId",
        TO_CHAR(date_of_birth, 'YYYY-MM-DD') as "dateOfBirth",
        education_stage as "educationStage",
        grade_level as "gradeLevel",
        school_name as "schoolName",
        curriculum_or_board as "curriculumOrBoard",
        guardian_name as "guardianName",
        guardian_phone as "guardianPhone",
        guardian_email as "guardianEmail",
        guardian_relationship as "guardianRelationship",
        guardian_verification_status as "guardianVerificationStatus",
        is_onboarded as "isOnboarded",
        onboarding_completed_at as "onboardingCompletedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    const values = [
      userId,
      data.dateOfBirth || null,
      data.educationStage || null,
      data.gradeLevel || null,
      data.schoolName || null,
      data.curriculumOrBoard || null,
      data.guardianName || null,
      data.guardianPhone || null,
      data.guardianEmail || null,
      data.guardianRelationship || null,
    ];

    await db.query(query, values);

    // Also sync to student_profiles
    const studentQuery = `
      INSERT INTO student_profiles (
        user_id, date_of_birth, education_stage, grade_level, school_name, curriculum_or_board,
        guardian_name, guardian_phone, guardian_email, guardian_relationship, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (user_id) DO UPDATE
      SET
        date_of_birth = COALESCE(EXCLUDED.date_of_birth, student_profiles.date_of_birth),
        education_stage = COALESCE(EXCLUDED.education_stage, student_profiles.education_stage),
        grade_level = COALESCE(EXCLUDED.grade_level, student_profiles.grade_level),
        school_name = COALESCE(EXCLUDED.school_name, student_profiles.school_name),
        curriculum_or_board = COALESCE(EXCLUDED.curriculum_or_board, student_profiles.curriculum_or_board),
        guardian_name = COALESCE(EXCLUDED.guardian_name, student_profiles.guardian_name),
        guardian_phone = COALESCE(EXCLUDED.guardian_phone, student_profiles.guardian_phone),
        guardian_email = COALESCE(EXCLUDED.guardian_email, student_profiles.guardian_email),
        guardian_relationship = COALESCE(EXCLUDED.guardian_relationship, student_profiles.guardian_relationship),
        updated_at = NOW()
    `;
    await db.query(studentQuery, values);

    const fullProfile = await this.findByUserId(userId, client);
    return fullProfile!;
  }

  /**
   * Completes participant onboarding, persisting verified values and setting is_onboarded = true.
   */
  async completeOnboarding(
    userId: string,
    data: ParticipantOnboardingDTO,
    client?: PoolClient
  ): Promise<ParticipantProfile> {
    const db = client || pool;
    const query = `
      INSERT INTO participant_profiles (
        user_id,
        date_of_birth,
        education_stage,
        grade_level,
        school_name,
        curriculum_or_board,
        guardian_name,
        guardian_phone,
        guardian_email,
        guardian_relationship,
        guardian_verification_status,
        is_onboarded,
        onboarding_completed_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'PENDING', true, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE
      SET
        date_of_birth = COALESCE(EXCLUDED.date_of_birth, participant_profiles.date_of_birth),
        education_stage = EXCLUDED.education_stage,
        grade_level = EXCLUDED.grade_level,
        school_name = EXCLUDED.school_name,
        curriculum_or_board = EXCLUDED.curriculum_or_board,
        guardian_name = COALESCE(EXCLUDED.guardian_name, participant_profiles.guardian_name),
        guardian_phone = COALESCE(EXCLUDED.guardian_phone, participant_profiles.guardian_phone),
        guardian_email = COALESCE(EXCLUDED.guardian_email, participant_profiles.guardian_email),
        guardian_relationship = COALESCE(EXCLUDED.guardian_relationship, participant_profiles.guardian_relationship),
        is_onboarded = true,
        onboarding_completed_at = NOW(),
        updated_at = NOW()
      RETURNING
        id,
        user_id as "userId",
        TO_CHAR(date_of_birth, 'YYYY-MM-DD') as "dateOfBirth",
        education_stage as "educationStage",
        grade_level as "gradeLevel",
        school_name as "schoolName",
        curriculum_or_board as "curriculumOrBoard",
        guardian_name as "guardianName",
        guardian_phone as "guardianPhone",
        guardian_email as "guardianEmail",
        guardian_relationship as "guardianRelationship",
        guardian_verification_status as "guardianVerificationStatus",
        is_onboarded as "isOnboarded",
        onboarding_completed_at as "onboardingCompletedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    const values = [
      userId,
      data.dateOfBirth || null,
      data.educationStage,
      data.gradeLevel || null,
      data.schoolName || null,
      data.curriculumOrBoard || null,
      data.guardianName || null,
      data.guardianPhone || null,
      data.guardianEmail || null,
      data.guardianRelationship || null,
    ];

    const res = await db.query(query, values);

    // Also sync to student_profiles
    const studentQuery = `
      INSERT INTO student_profiles (
        user_id, date_of_birth, education_stage, grade_level, school_name, curriculum_or_board,
        guardian_name, guardian_phone, guardian_email, guardian_relationship, is_onboarded,
        onboarding_completed_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE
      SET
        date_of_birth = COALESCE(EXCLUDED.date_of_birth, student_profiles.date_of_birth),
        education_stage = EXCLUDED.education_stage,
        grade_level = EXCLUDED.grade_level,
        school_name = EXCLUDED.school_name,
        curriculum_or_board = EXCLUDED.curriculum_or_board,
        guardian_name = COALESCE(EXCLUDED.guardian_name, student_profiles.guardian_name),
        guardian_phone = COALESCE(EXCLUDED.guardian_phone, student_profiles.guardian_phone),
        guardian_email = COALESCE(EXCLUDED.guardian_email, student_profiles.guardian_email),
        guardian_relationship = COALESCE(EXCLUDED.guardian_relationship, student_profiles.guardian_relationship),
        is_onboarded = true,
        onboarding_completed_at = NOW(),
        updated_at = NOW()
    `;
    await db.query(studentQuery, values);

    return res.rows[0];
  }
}

export const participantRepository = new ParticipantRepository();
