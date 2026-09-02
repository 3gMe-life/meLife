import { PoolClient } from "pg";
import { pool } from "../../config/database";

export interface StudentOnboardingData {
  userId: string;
  educationStage: string;
  guardianName?: string | null;
  guardianPhone?: string | null;
  guardianEmail?: string | null;
}

export class StudentRepository {
  /**
   * Upserts a student profile and marks onboarding as complete.
   */
  async completeOnboarding(
    data: StudentOnboardingData,
    client?: PoolClient
  ): Promise<void> {
    const db = client || pool;
    const query = `
      INSERT INTO student_profiles (
        user_id, education_stage, guardian_name, guardian_phone, guardian_email, is_onboarded, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, true, NOW())
      ON CONFLICT (user_id) DO UPDATE
      SET education_stage = EXCLUDED.education_stage,
          guardian_name = COALESCE(EXCLUDED.guardian_name, student_profiles.guardian_name),
          guardian_phone = COALESCE(EXCLUDED.guardian_phone, student_profiles.guardian_phone),
          guardian_email = COALESCE(EXCLUDED.guardian_email, student_profiles.guardian_email),
          is_onboarded = true,
          updated_at = NOW()
    `;
    await db.query(query, [
      data.userId,
      data.educationStage,
      data.guardianName || null,
      data.guardianPhone || null,
      data.guardianEmail || null,
    ]);
  }

  /**
   * Retrieves student profile by user ID.
   */
  async findByUserId(
    userId: string,
    client?: PoolClient
  ): Promise<{
    id: string;
    userId: string;
    educationStage: string | null;
    guardianName: string | null;
    guardianPhone: string | null;
    guardianEmail: string | null;
    isOnboarded: boolean;
  } | null> {
    const db = client || pool;
    const query = `
      SELECT id, user_id as "userId", education_stage as "educationStage",
             guardian_name as "guardianName", guardian_phone as "guardianPhone",
             guardian_email as "guardianEmail", is_onboarded as "isOnboarded"
      FROM student_profiles
      WHERE user_id = $1
      LIMIT 1
    `;
    const res = await db.query(query, [userId]);
    return res.rows[0] || null;
  }
}

export const studentRepository = new StudentRepository();
