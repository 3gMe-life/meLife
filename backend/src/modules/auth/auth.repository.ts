import { PoolClient } from "pg";
import { pool } from "../../config/database";
import { AuthProvider } from "./auth.types";
import { logger } from "../../common/utils/logger";

export class AuthRepository {
  /**
   * Finds an auth identity by provider and external account ID (e.g. Google sub).
   */
  async findAuthIdentity(
    provider: AuthProvider,
    providerAccountId: string,
    client?: PoolClient
  ): Promise<{ id: string; user_id: string; provider: string; provider_account_id: string } | null> {
    const db = client || pool;
    const query = `
      SELECT id, user_id, provider, provider_account_id
      FROM auth_identities
      WHERE provider = $1 AND provider_account_id = $2
      LIMIT 1
    `;
    const res = await db.query(query, [provider, providerAccountId]);
    return res.rows[0] || null;
  }

  /**
   * Inserts a new authentication identity (LOCAL or GOOGLE).
   */
  async createAuthIdentity(
    data: { userId: string; provider: AuthProvider; providerAccountId: string },
    client?: PoolClient
  ): Promise<void> {
    const db = client || pool;
    const query = `
      INSERT INTO auth_identities (user_id, provider, provider_account_id)
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
    `;
    await db.query(query, [data.userId, data.provider, data.providerAccountId]);
  }

  /**
   * Creates or updates a student profile on initial signup / onboarding.
   */
  async createStudentProfile(
    data: {
      userId: string;
      educationStage?: string | null;
      guardianName?: string | null;
      guardianPhone?: string | null;
      guardianEmail?: string | null;
    },
    client?: PoolClient
  ): Promise<void> {
    const db = client || pool;
    const query = `
      INSERT INTO student_profiles (
        user_id, education_stage, guardian_name, guardian_phone, guardian_email, is_onboarded
      )
      VALUES ($1, $2, $3, $4, $5, false)
      ON CONFLICT DO NOTHING
    `;
    await db.query(query, [
      data.userId,
      data.educationStage || null,
      data.guardianName || null,
      data.guardianPhone || null,
      data.guardianEmail || null,
    ]);
  }

  /**
   * Creates a counsellor application record pending admin review.
   */
  async createCounsellorApplication(
    data: {
      userId: string;
      qualification?: string | null;
      organization?: string | null;
    },
    client?: PoolClient
  ): Promise<{ id: string; status: string }> {
    const db = client || pool;
    const query = `
      INSERT INTO counsellor_applications (user_id, qualification, organization, status)
      VALUES ($1, $2, $3, 'PENDING')
      RETURNING id, status
    `;
    const res = await db.query(query, [
      data.userId,
      data.qualification || null,
      data.organization || null,
    ]);
    return res.rows[0];
  }

  /**
   * Creates an institution partner application record pending platform review.
   */
  async createInstitutionApplication(
    data: {
      institutionName: string;
      institutionType: string;
      officialEmail: string;
      contactName: string;
      phoneNumber: string;
    },
    client?: PoolClient
  ): Promise<{ id: string; status: string }> {
    const db = client || pool;
    const query = `
      INSERT INTO institution_applications (
        institution_name, institution_type, official_email, contact_name, phone_number, status
      )
      VALUES ($1, $2, $3, $4, $5, 'PENDING')
      RETURNING id, status
    `;
    const res = await db.query(query, [
      data.institutionName.trim(),
      data.institutionType.trim(),
      data.officialEmail.toLowerCase().trim(),
      data.contactName.trim(),
      data.phoneNumber.trim(),
    ]);
    return res.rows[0];
  }

  /**
   * Seeds role-permission relationships if currently unmapped in the database.
   */
  async seedRolePermissions(): Promise<void> {
    try {
      const mapping = [
        {
          role: "PARTICIPANT",
          permissions: ["assessment.take", "result.read_own"],
        },
        {
          role: "PARENT_GUARDIAN",
          permissions: ["student.read", "result.read_own"],
        },
        {
          role: "CAREER_COUNSELLOR",
          permissions: ["student.read", "result.read_own"],
        },
        {
          role: "INSTITUTION_ADMIN",
          permissions: ["student.read", "student.manage", "institution.manage"],
        },
        {
          role: "PLATFORM_ADMIN",
          permissions: ["admin.all", "student.read", "student.manage", "institution.manage"],
        },
        {
          role: "COMPANY_ADMIN",
          permissions: ["admin.all"],
        },
        {
          role: "SUPER_ADMIN",
          permissions: ["admin.all"],
        },
      ];

      for (const item of mapping) {
        for (const perm of item.permissions) {
          const insertQuery = `
            INSERT INTO role_permissions (role_id, permission_id)
            SELECT r.id, p.id
            FROM roles r, permissions p
            WHERE r.name = $1 AND p.name = $2
            ON CONFLICT DO NOTHING
          `;
          await pool.query(insertQuery, [item.role, perm]);
        }
      }
    } catch (err) {
      logger.error({ err }, "Error while seeding role permissions");
    }
  }
}

export const authRepository = new AuthRepository();
