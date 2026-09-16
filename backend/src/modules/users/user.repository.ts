import { PoolClient } from "pg";
import { pool } from "../../config/database";
import { User, UserRole, CreateUserData, UserWithRoles } from "./user.types";

export class UserRepository {
  /**
   * Finds a user by their unique UUID.
   */
  async findById(id: string, client?: PoolClient): Promise<User | null> {
    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return null;
    }
    const db = client || pool;
    const query = `
      SELECT id, email, password_hash, first_name, last_name, status,
             email_verified_at, last_login_at, created_at, updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `;
    const res = await db.query(query, [id]);
    return res.rows[0] || null;
  }

  /**
   * Finds a user by normalized lowercase email.
   */
  async findByEmail(email: string, client?: PoolClient): Promise<User | null> {
    const db = client || pool;
    const query = `
      SELECT id, email, password_hash, first_name, last_name, status,
             email_verified_at, last_login_at, created_at, updated_at
      FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
    `;
    const res = await db.query(query, [email.trim()]);
    return res.rows[0] || null;
  }

  /**
   * Inserts a new user record.
   */
  async createUser(data: CreateUserData, client?: PoolClient): Promise<User> {
    const db = client || pool;
    const query = `
      INSERT INTO users (
        email, password_hash, first_name, last_name, status, email_verified_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, password_hash, first_name, last_name, status,
                email_verified_at, last_login_at, created_at, updated_at
    `;
    const values = [
      data.email.toLowerCase().trim(),
      data.passwordHash || null,
      data.firstName.trim(),
      data.lastName.trim(),
      data.status || "ACTIVE",
      data.emailVerifiedAt || null,
    ];
    const res = await db.query(query, values);
    return res.rows[0];
  }

  /**
   * Assigns a role to a user by role name.
   */
  async assignRole(
    userId: string,
    roleName: UserRole,
    isPrimary = true,
    client?: PoolClient
  ): Promise<void> {
    const db = client || pool;
    const query = `
      INSERT INTO user_roles (user_id, role_id, is_primary)
      SELECT $1, r.id, $3
      FROM roles r
      WHERE r.name = $2
      ON CONFLICT DO NOTHING
    `;
    await db.query(query, [userId, roleName, isPrimary]);
  }

  /**
   * Updates a user's last_login_at timestamp.
   */
  async updateLastLogin(userId: string, client?: PoolClient): Promise<void> {
    const db = client || pool;
    const query = `
      UPDATE users
      SET last_login_at = NOW(), updated_at = NOW()
      WHERE id = $1
    `;
    await db.query(query, [userId]);
  }

  /**
   * Retrieves all roles and distinct permissions assigned to a user.
   */
  async getUserRolesAndPermissions(
    userId: string,
    client?: PoolClient
  ): Promise<{ roles: UserRole[]; permissions: string[] }> {
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return { roles: [], permissions: [] };
    }
    const db = client || pool;

    // 1. Fetch assigned roles
    const rolesQuery = `
      SELECT r.name
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = $1
      ORDER BY ur.is_primary DESC, ur.created_at ASC
    `;
    const rolesRes = await db.query(rolesQuery, [userId]);
    const roles = rolesRes.rows.map((row) => row.name as UserRole);

    // 2. Fetch distinct permissions from all assigned roles
    const permsQuery = `
      SELECT DISTINCT p.name
      FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = $1
      ORDER BY p.name ASC
    `;
    const permsRes = await db.query(permsQuery, [userId]);
    const permissions = permsRes.rows.map((row) => row.name as string);

    return { roles, permissions };
  }

  /**
   * Retrieves a complete user along with their roles and permissions.
   */
  async findUserWithRolesAndPermissions(
    userId: string,
    client?: PoolClient
  ): Promise<UserWithRoles | null> {
    const user = await this.findById(userId, client);
    if (!user) return null;

    const { roles, permissions } = await this.getUserRolesAndPermissions(userId, client);
    return {
      ...user,
      roles,
      permissions,
    };
  }

  /**
   * Retrieves student/participant profile onboarding info if available.
   */
  async getStudentProfile(
    userId: string,
    client?: PoolClient
  ): Promise<{
    isOnboarded: boolean;
    educationStage?: string | null;
    gradeLevel?: string | null;
    dateOfBirth?: string | null;
  } | null> {
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return null;
    }
    const db = client || pool;
    const query = `
      SELECT
        COALESCE(p.is_onboarded, s.is_onboarded, false) as is_onboarded,
        COALESCE(p.education_stage, s.education_stage) as education_stage,
        COALESCE(p.grade_level, s.grade_level) as grade_level,
        TO_CHAR(COALESCE(p.date_of_birth, s.date_of_birth), 'YYYY-MM-DD') as date_of_birth
      FROM users u
      LEFT JOIN participant_profiles p ON u.id = p.user_id
      LEFT JOIN student_profiles s ON u.id = s.user_id
      WHERE u.id = $1
      LIMIT 1
    `;
    const res = await db.query(query, [userId]);
    if (!res.rows[0]) return null;
    return {
      isOnboarded: Boolean(res.rows[0].is_onboarded),
      educationStage: res.rows[0].education_stage || null,
      gradeLevel: res.rows[0].grade_level || null,
      dateOfBirth: res.rows[0].date_of_birth || null,
    };
  }

  /**
   * Updates a user's first and last name in the users table.
   */
  async updateProfileNames(
    userId: string,
    firstName: string,
    lastName: string,
    client?: PoolClient
  ): Promise<void> {
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return;
    }
    const db = client || pool;
    const query = `
      UPDATE users
      SET first_name = $2, last_name = $3, updated_at = NOW()
      WHERE id = $1
    `;
    await db.query(query, [userId, firstName.trim(), lastName.trim()]);
  }

  /**
   * Updates a user's password hash in the users table.
   */
  async updatePassword(
    userId: string,
    passwordHash: string,
    client?: PoolClient
  ): Promise<void> {
    if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return;
    }
    const db = client || pool;
    const query = `
      UPDATE users
      SET password_hash = $2, updated_at = NOW()
      WHERE id = $1
    `;
    await db.query(query, [userId, passwordHash]);
  }
}

export const userRepository = new UserRepository();
