import { PoolClient } from "pg";
import { pool } from "../../config/database";
import { AuthProvider } from "./auth.types";
import { logger } from "../../common/utils/logger";

export class AuthRepository {
  /**
   * Initializes core authentication, user, role, permission, and session schemas.
   */
  async initSchema(client?: PoolClient): Promise<void> {
    const db = client || pool;
    const query = `
      -- 1. Users
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NULL,
        first_name VARCHAR(100) NOT NULL DEFAULT '',
        last_name VARCHAR(100) NOT NULL DEFAULT '',
        status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
        email_verified_at TIMESTAMPTZ NULL,
        last_login_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- 2. Roles
      CREATE TABLE IF NOT EXISTS roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- 3. Permissions
      CREATE TABLE IF NOT EXISTS permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- 4. User Roles
      CREATE TABLE IF NOT EXISTS user_roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        is_primary BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, role_id)
      );

      -- 5. Role Permissions
      CREATE TABLE IF NOT EXISTS role_permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(role_id, permission_id)
      );

      -- 6. Sessions
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        refresh_token_hash VARCHAR(255) NOT NULL,
        user_agent TEXT NULL,
        ip_address VARCHAR(100) NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        revoked_at TIMESTAMPTZ NULL,
        last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- 7. Auth Identities (Local & Social OAuth)
      CREATE TABLE IF NOT EXISTS auth_identities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        provider VARCHAR(50) NOT NULL,
        provider_account_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(provider, provider_account_id)
      );

      -- 8. Student Profiles
      CREATE TABLE IF NOT EXISTS student_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        date_of_birth DATE NULL,
        education_stage VARCHAR(100) NULL,
        grade_level VARCHAR(50) NULL,
        school_name VARCHAR(255) NULL,
        curriculum_or_board VARCHAR(100) NULL,
        guardian_name VARCHAR(255) NULL,
        guardian_phone VARCHAR(50) NULL,
        guardian_email VARCHAR(255) NULL,
        guardian_relationship VARCHAR(50) NULL,
        guardian_verification_status VARCHAR(50) DEFAULT 'PENDING',
        is_onboarded BOOLEAN DEFAULT FALSE,
        onboarding_completed_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- 9. Counsellor Applications
      CREATE TABLE IF NOT EXISTS counsellor_applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        qualification VARCHAR(255) NULL,
        organization VARCHAR(255) NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- 10. Institution Applications
      CREATE TABLE IF NOT EXISTS institution_applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        institution_name VARCHAR(255) NOT NULL,
        institution_type VARCHAR(100) NOT NULL,
        official_email VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Indexes
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(refresh_token_hash);
      CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
      CREATE INDEX IF NOT EXISTS idx_auth_identities_lookup ON auth_identities(provider, provider_account_id);
    `;

    await db.query(query);

    // Seed canonical Roles & Permissions
    const standardRoles = [
      "SUPER_ADMIN",
      "COMPANY_ADMIN",
      "PLATFORM_ADMIN",
      "INSTITUTION_ADMIN",
      "PARTICIPANT",
      "PARENT_GUARDIAN",
      "CAREER_COUNSELLOR",
    ];
    for (const r of standardRoles) {
      await db.query(
        `INSERT INTO roles (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING`,
        [r, `${r} platform persona`]
      );
    }

    const standardPerms = [
      "assessment.take",
      "result.read_own",
      "student.read",
      "student.manage",
      "institution.manage",
      "admin.all",
    ];
    for (const p of standardPerms) {
      await db.query(
        `INSERT INTO permissions (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING`,
        [p, `Permission to ${p}`]
      );
    }

    logger.info("📦 Core Auth, User, Role, and Session schema initialized and verified.");
  }

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
