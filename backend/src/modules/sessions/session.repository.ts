import { PoolClient } from "pg";
import { pool } from "../../config/database";
import { Session, CreateSessionData } from "./session.types";

export class SessionRepository {
  /**
   * Inserts a new database-backed session with hashed refresh token.
   */
  async createSession(
    data: CreateSessionData,
    client?: PoolClient
  ): Promise<Session> {
    const db = client || pool;
    const query = `
      INSERT INTO sessions (
        user_id, refresh_token_hash, expires_at, ip_address, user_agent, last_used_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, user_id, refresh_token_hash, user_agent, ip_address,
                expires_at, revoked_at, last_used_at, created_at, updated_at
    `;
    const values = [
      data.userId,
      data.refreshTokenHash,
      data.expiresAt,
      data.ipAddress || null,
      data.userAgent || null,
    ];
    const res = await db.query(query, values);
    return res.rows[0];
  }

  /**
   * Finds an active (non-revoked, unexpired) session matching the refresh token hash.
   */
  async findActiveSessionByTokenHash(
    refreshTokenHash: string,
    client?: PoolClient
  ): Promise<Session | null> {
    const db = client || pool;
    const query = `
      SELECT id, user_id, refresh_token_hash, user_agent, ip_address,
             expires_at, revoked_at, last_used_at, created_at, updated_at
      FROM sessions
      WHERE refresh_token_hash = $1
        AND revoked_at IS NULL
        AND expires_at > NOW()
      LIMIT 1
    `;
    const res = await db.query(query, [refreshTokenHash]);
    return res.rows[0] || null;
  }

  /**
   * Finds any session matching the refresh token hash, including revoked or expired ones
   * (used for detecting token reuse attempts).
   */
  async findSessionByTokenHash(
    refreshTokenHash: string,
    client?: PoolClient
  ): Promise<Session | null> {
    const db = client || pool;
    const query = `
      SELECT id, user_id, refresh_token_hash, user_agent, ip_address,
             expires_at, revoked_at, last_used_at, created_at, updated_at
      FROM sessions
      WHERE refresh_token_hash = $1
      LIMIT 1
    `;
    const res = await db.query(query, [refreshTokenHash]);
    return res.rows[0] || null;
  }

  /**
   * Atomically rotates the refresh token hash, updates expiration and last_used_at.
   */
  async updateRefreshToken(
    sessionId: string,
    newRefreshTokenHash: string,
    expiresAt: Date,
    ipAddress?: string | null,
    userAgent?: string | null,
    client?: PoolClient
  ): Promise<Session | null> {
    const db = client || pool;
    const query = `
      UPDATE sessions
      SET refresh_token_hash = $2,
          expires_at = $3,
          ip_address = COALESCE($4, ip_address),
          user_agent = COALESCE($5, user_agent),
          last_used_at = NOW(),
          updated_at = NOW()
      WHERE id = $1 AND revoked_at IS NULL
      RETURNING id, user_id, refresh_token_hash, user_agent, ip_address,
                expires_at, revoked_at, last_used_at, created_at, updated_at
    `;
    const values = [
      sessionId,
      newRefreshTokenHash,
      expiresAt,
      ipAddress || null,
      userAgent || null,
    ];
    const res = await db.query(query, values);
    return res.rows[0] || null;
  }

  /**
   * Revokes a specific session by ID.
   */
  async revokeSession(sessionId: string, client?: PoolClient): Promise<void> {
    const db = client || pool;
    const query = `
      UPDATE sessions
      SET revoked_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND revoked_at IS NULL
    `;
    await db.query(query, [sessionId]);
  }

  /**
   * Revokes all active sessions for a user (e.g. on password change, logout-all, or compromised account).
   */
  async revokeAllUserSessions(
    userId: string,
    client?: PoolClient
  ): Promise<number> {
    const db = client || pool;
    const query = `
      UPDATE sessions
      SET revoked_at = NOW(), updated_at = NOW()
      WHERE user_id = $1 AND revoked_at IS NULL
    `;
    const res = await db.query(query, [userId]);
    return res.rowCount || 0;
  }
}

export const sessionRepository = new SessionRepository();
