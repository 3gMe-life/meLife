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
        reviewed_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
        reviewed_at TIMESTAMPTZ NULL,
        review_notes TEXT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      ALTER TABLE counsellor_applications ADD COLUMN IF NOT EXISTS reviewed_by UUID NULL REFERENCES users(id) ON DELETE SET NULL;
      ALTER TABLE counsellor_applications ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ NULL;
      ALTER TABLE counsellor_applications ADD COLUMN IF NOT EXISTS review_notes TEXT NULL;
      ALTER TABLE counsellor_applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

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

      -- 11. Dashboard Features Registry
      CREATE TABLE IF NOT EXISTS dashboard_features (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        key VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT NULL,
        category VARCHAR(50) NOT NULL DEFAULT 'CORE',
        icon VARCHAR(50) NULL,
        route VARCHAR(255) NULL,
        required_permission VARCHAR(100) NULL,
        sort_order INT NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- 12. Role Dashboard Features Mapping
      CREATE TABLE IF NOT EXISTS role_dashboard_features (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        feature_id UUID NOT NULL REFERENCES dashboard_features(id) ON DELETE CASCADE,
        is_enabled BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(role_id, feature_id)
      );

      -- 13. Role Feature Audit Logs
      CREATE TABLE IF NOT EXISTS role_feature_audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        feature_key VARCHAR(100) NOT NULL,
        previous_state BOOLEAN NOT NULL,
        new_state BOOLEAN NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Indexes
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(refresh_token_hash);
      CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
      CREATE INDEX IF NOT EXISTS idx_auth_identities_lookup ON auth_identities(provider, provider_account_id);
      CREATE INDEX IF NOT EXISTS idx_counsellor_applications_user ON counsellor_applications(user_id);
      CREATE INDEX IF NOT EXISTS idx_counsellor_applications_status ON counsellor_applications(status);
      CREATE INDEX IF NOT EXISTS idx_dashboard_features_key ON dashboard_features(key);
      CREATE INDEX IF NOT EXISTS idx_role_dashboard_features_lookup ON role_dashboard_features(role_id, feature_id);
      CREATE INDEX IF NOT EXISTS idx_role_feature_audit_logs_role ON role_feature_audit_logs(role_id);
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

    logger.info("📦 Core Auth, User, Role, Session, and Dashboard Feature schema initialized and verified.");
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
   * Finds the latest counsellor application for a user.
   */
  async findCounsellorApplicationByUserId(
    userId: string,
    client?: PoolClient
  ): Promise<{
    id: string;
    userId: string;
    qualification: string | null;
    organization: string | null;
    status: string;
    createdAt: Date;
  } | null> {
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return null;
    }
    const db = client || pool;
    const query = `
      SELECT id, user_id, qualification, organization, status, created_at
      FROM counsellor_applications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const res = await db.query(query, [userId]);
    if (!res.rows[0]) return null;
    return {
      id: res.rows[0].id,
      userId: res.rows[0].user_id,
      qualification: res.rows[0].qualification,
      organization: res.rows[0].organization,
      status: res.rows[0].status,
      createdAt: res.rows[0].created_at,
    };
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

  /**
   * Seeds canonical dashboard feature definitions and default role assignments.
   */
  async seedDashboardFeatures(): Promise<void> {
    try {
      const features = [
        {
          key: "dashboard.overview",
          name: "Overview",
          description: "Main counsellor dashboard overview",
          category: "CORE",
          icon: "LayoutDashboard",
          route: "/counsellor/dashboard",
          requiredPermission: null,
          sortOrder: 1,
        },
        {
          key: "dashboard.calendar",
          name: "Calendar",
          description: "Manage availability and appointments",
          category: "CORE",
          icon: "Calendar",
          route: "/counsellor/calendar",
          requiredPermission: "calendar.read",
          sortOrder: 2,
        },
        {
          key: "dashboard.sessions",
          name: "Sessions",
          description: "View and manage counselling sessions",
          category: "CORE",
          icon: "Clock",
          route: "/counsellor/sessions",
          requiredPermission: "session.read",
          sortOrder: 3,
        },
        {
          key: "dashboard.students",
          name: "Students",
          description: "View assigned students",
          category: "CORE",
          icon: "GraduationCap",
          route: "/counsellor/students",
          requiredPermission: "student.read",
          sortOrder: 4,
        },
        {
          key: "dashboard.reports",
          name: "Reports",
          description: "View available student reports",
          category: "ASSESSMENTS & REPORTS",
          icon: "FileText",
          route: "/counsellor/reports",
          requiredPermission: "result.read_own",
          sortOrder: 5,
        },
        {
          key: "dashboard.messages",
          name: "Messages",
          description: "Communicate with students",
          category: "COMMUNICATION",
          icon: "Inbox",
          route: "/counsellor/messages",
          requiredPermission: null,
          sortOrder: 6,
        },
        {
          key: "dashboard.notifications",
          name: "Notifications",
          description: "View account and session notifications",
          category: "COMMUNICATION",
          icon: "Bell",
          route: "/counsellor/notifications",
          requiredPermission: null,
          sortOrder: 7,
        },
        {
          key: "dashboard.analytics",
          name: "Analytics",
          description: "View counselling performance analytics",
          category: "INSIGHTS",
          icon: "BarChart3",
          route: "/counsellor/analytics",
          requiredPermission: null,
          sortOrder: 8,
        },
        {
          key: "dashboard.reviews",
          name: "Reviews",
          description: "View student feedback and ratings",
          category: "INSIGHTS",
          icon: "Award",
          route: "/counsellor/reviews",
          requiredPermission: null,
          sortOrder: 9,
        },
        {
          key: "dashboard.profile",
          name: "Profile",
          description: "Manage professional counsellor profile",
          category: "ACCOUNT",
          icon: "User",
          route: "/counsellor/profile",
          requiredPermission: null,
          sortOrder: 10,
        },
        {
          key: "dashboard.settings",
          name: "Settings",
          description: "Manage account preferences",
          category: "ACCOUNT",
          icon: "Settings",
          route: "/counsellor/settings",
          requiredPermission: null,
          sortOrder: 11,
        },
      ];

      // 1. Insert or update dashboard features
      for (const feat of features) {
        const query = `
          INSERT INTO dashboard_features (
            key, name, description, category, icon, route, required_permission, sort_order, is_active, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW())
          ON CONFLICT (key) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            category = EXCLUDED.category,
            icon = EXCLUDED.icon,
            route = EXCLUDED.route,
            required_permission = EXCLUDED.required_permission,
            sort_order = EXCLUDED.sort_order,
            updated_at = NOW()
        `;
        await pool.query(query, [
          feat.key,
          feat.name,
          feat.description,
          feat.category,
          feat.icon,
          feat.route,
          feat.requiredPermission,
          feat.sortOrder,
        ]);
      }

      // 2. Default assignments for CAREER_COUNSELLOR
      const counsellorDefaults: Record<string, boolean> = {
        "dashboard.overview": true,
        "dashboard.calendar": true,
        "dashboard.sessions": true,
        "dashboard.students": true,
        "dashboard.reports": true,
        "dashboard.messages": false,
        "dashboard.notifications": true,
        "dashboard.analytics": false,
        "dashboard.reviews": false,
        "dashboard.profile": true,
        "dashboard.settings": true,
      };

      for (const [key, isEnabled] of Object.entries(counsellorDefaults)) {
        const assignQuery = `
          INSERT INTO role_dashboard_features (role_id, feature_id, is_enabled)
          SELECT r.id, df.id, $3
          FROM roles r, dashboard_features df
          WHERE r.name = $1 AND df.key = $2
          ON CONFLICT (role_id, feature_id) DO NOTHING
        `;
        await pool.query(assignQuery, ["CAREER_COUNSELLOR", key, isEnabled]);
      }

      // 3. For administrative and other standard roles, default all registered features to enabled if not yet mapped
      const otherRoles = [
        "SUPER_ADMIN",
        "PLATFORM_ADMIN",
        "COMPANY_ADMIN",
        "INSTITUTION_ADMIN",
        "PARTICIPANT",
        "PARENT_GUARDIAN",
      ];
      for (const roleName of otherRoles) {
        for (const feat of features) {
          const assignQuery = `
            INSERT INTO role_dashboard_features (role_id, feature_id, is_enabled)
            SELECT r.id, df.id, true
            FROM roles r, dashboard_features df
            WHERE r.name = $1 AND df.key = $2
            ON CONFLICT (role_id, feature_id) DO NOTHING
          `;
          await pool.query(assignQuery, [roleName, feat.key]);
        }
      }

      logger.info("✨ Dashboard Features Registry and default role mappings seeded successfully.");
    } catch (err) {
      logger.error({ err }, "Error while seeding dashboard features");
    }
  }
}

export const authRepository = new AuthRepository();


