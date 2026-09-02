import { PoolClient } from "pg";
import { pool } from "../../config/database";
import { User, UserRole, CreateUserData, UserWithRoles } from "./user.types";

export class UserRepository {
  /**
   * Finds a user by their unique UUID.
   */
  async findById(id: string, client?: PoolClient): Promise<User | null> {
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
   * Retrieves student profile onboarding info if available.
   */
  async getStudentProfile(
    userId: string,
    client?: PoolClient
  ): Promise<{ isOnboarded: boolean; educationStage?: string | null } | null> {
    const db = client || pool;
    const query = `
      SELECT is_onboarded, education_stage
      FROM student_profiles
      WHERE user_id = $1
      LIMIT 1
    `;
    const res = await db.query(query, [userId]);
    if (!res.rows[0]) return null;
    return {
      isOnboarded: Boolean(res.rows[0].is_onboarded),
      educationStage: res.rows[0].education_stage,
    };
  }
}

export const userRepository = new UserRepository();
