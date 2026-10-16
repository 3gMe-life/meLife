/**
 * 3G MeLife Messaging Repository
 *
 * PostgreSQL persistence layer for conversations, messages, and read receipts.
 */

import { pool } from "../../config/database";
import type { PoolClient } from "pg";
import { UserRole } from "../users/user.types";
import {
  ConversationDTO,
  MessageDTO,
  MessageCursorPage,
  MessageType,
  MessageDeliveryStatus,
  ConversationRow,
  MessageRow,
  MessagingAccessDTO,
} from "./messaging.types";
import { logger } from "../../common/utils/logger";

export class MessagingRepository {
  /**
   * Initializes messaging schema and performance indexes idempotently.
   */
  async initSchema(): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Conversations Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS conversations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          counsellor_id UUID NOT NULL REFERENCES counsellors(id) ON DELETE CASCADE,
          status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
          last_message_at TIMESTAMP WITH TIME ZONE NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT uq_conversation_student_counsellor UNIQUE (student_id, counsellor_id)
        );
      `);

      // 2. Messages Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
          sender_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          message_type VARCHAR(20) NOT NULL DEFAULT 'TEXT',
          content TEXT NOT NULL,
          client_message_id UUID NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          edited_at TIMESTAMP WITH TIME ZONE NULL,
          deleted_at TIMESTAMP WITH TIME ZONE NULL,
          CONSTRAINT uq_message_sender_client_id UNIQUE (sender_user_id, client_message_id)
        );
      `);

      // 3. Message Receipts Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS message_receipts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
          message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          delivered_at TIMESTAMP WITH TIME ZONE NULL,
          read_at TIMESTAMP WITH TIME ZONE NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT uq_receipt_message_user UNIQUE (message_id, user_id)
        );
      `);

      // 4. Optimized Indexes
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_conversations_student ON conversations(student_id);
        CREATE INDEX IF NOT EXISTS idx_conversations_counsellor ON conversations(counsellor_id);
        CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC NULLS LAST);
        CREATE INDEX IF NOT EXISTS idx_messages_conv_created ON messages(conversation_id, created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_user_id);
        CREATE INDEX IF NOT EXISTS idx_message_receipts_user_unread ON message_receipts(user_id, read_at) WHERE read_at IS NULL;
        CREATE INDEX IF NOT EXISTS idx_message_receipts_conv_user ON message_receipts(conversation_id, user_id, read_at);
      `);

      await client.query("COMMIT");
      logger.info("Messaging schema initialized successfully.");
    } catch (err) {
      await client.query("ROLLBACK");
      logger.error({ err }, "Failed to initialize messaging database schema");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Verifies if a student and counsellor have an eligible counselling relationship.
   * Canonical rule:
   * - student user status = ACTIVE
   * - counsellor user status = ACTIVE
   * - counsellor profile approval_status = APPROVED
   * - EXISTS counselling_sessions with status IN ('CONFIRMED', 'COMPLETED')
   * PENDING, REJECTED, and CANCELLED-only relationships evaluate to false.
   */
  async hasEligibleCounsellingRelationship(
    studentId: string,
    counsellorId: string,
    client?: PoolClient
  ): Promise<boolean> {
    const query = `
      SELECT 1
      FROM counselling_sessions cs
      JOIN users u_stu ON cs.student_id = u_stu.id
      JOIN counsellors c ON cs.counsellor_id = c.id
      JOIN users u_coun ON c.user_id = u_coun.id
      WHERE cs.student_id = $1
        AND cs.counsellor_id = $2
        AND u_stu.status = 'ACTIVE'
        AND u_coun.status = 'ACTIVE'
        AND c.approval_status = 'APPROVED'
        AND cs.status IN ('CONFIRMED', 'COMPLETED')
      LIMIT 1;
    `;
    const db = client || pool;
    const res = await db.query(query, [studentId, counsellorId]);
    return res.rows.length > 0;
  }

  /**
   * Evaluates messaging access summary for a user based on the canonical eligibility rule.
   */
  async getMessagingAccessSummary(
    userId: string,
    role: UserRole
  ): Promise<MessagingAccessDTO> {
    if (role === "PARTICIPANT") {
      const query = `
        SELECT 
          COUNT(DISTINCT cs.counsellor_id)::int AS eligible_counsellor_count,
          COALESCE(
            (SELECT COUNT(*)::int FROM message_receipts mr WHERE mr.user_id = $1 AND mr.read_at IS NULL),
            0
          ) AS unread_count
        FROM counselling_sessions cs
        JOIN users u_stu ON cs.student_id = u_stu.id
        JOIN counsellors c ON cs.counsellor_id = c.id
        JOIN users u_coun ON c.user_id = u_coun.id
        WHERE cs.student_id = $1
          AND u_stu.status = 'ACTIVE'
          AND u_coun.status = 'ACTIVE'
          AND c.approval_status = 'APPROVED'
          AND cs.status IN ('CONFIRMED', 'COMPLETED');
      `;
      const res = await pool.query(query, [userId]);
      const eligibleCount = res.rows[0]?.eligible_counsellor_count || 0;
      const unreadCount = res.rows[0]?.unread_count || 0;

      return {
        hasAccess: eligibleCount > 0,
        eligibleCounsellorCount: eligibleCount,
        unreadCount,
      };
    } else if (role === "CAREER_COUNSELLOR") {
      const query = `
        SELECT 
          c.id AS counsellor_id,
          c.approval_status,
          u.status AS user_status,
          (
            SELECT COUNT(DISTINCT cs.student_id)::int
            FROM counselling_sessions cs
            JOIN users stu ON cs.student_id = stu.id
            WHERE cs.counsellor_id = c.id
              AND stu.status = 'ACTIVE'
              AND cs.status IN ('CONFIRMED', 'COMPLETED')
          ) AS eligible_student_count,
          COALESCE(
            (SELECT COUNT(*)::int FROM message_receipts mr WHERE mr.user_id = $1 AND mr.read_at IS NULL),
            0
          ) AS unread_count
        FROM counsellors c
        JOIN users u ON c.user_id = u.id
        WHERE c.user_id = $1
        LIMIT 1;
      `;
      const res = await pool.query(query, [userId]);
      if (res.rows.length === 0) {
        return { hasAccess: false, eligibleCounsellorCount: 0, unreadCount: 0 };
      }
      const r = res.rows[0];
      const isApprovedAndActive = r.approval_status === "APPROVED" && r.user_status === "ACTIVE";
      const eligibleCount = r.eligible_student_count || 0;
      const unreadCount = r.unread_count || 0;

      return {
        hasAccess: isApprovedAndActive,
        eligibleCounsellorCount: eligibleCount,
        unreadCount,
      };
    } else if (role === "SUPER_ADMIN" || role === "PLATFORM_ADMIN") {
      const unreadCount = await this.getUnreadCountForUser(userId);
      return {
        hasAccess: true,
        eligibleCounsellorCount: 999,
        unreadCount,
      };
    }

    return {
      hasAccess: false,
      eligibleCounsellorCount: 0,
      unreadCount: 0,
    };
  }

  /**
   * Finds counsellor profile by user ID.
   */
  async findCounsellorByUserId(userId: string): Promise<{
    id: string;
    userId: string;
    approvalStatus: string;
    qualification: string;
  } | null> {
    const query = `
      SELECT c.id, c.user_id, c.approval_status, c.qualification
      FROM counsellors c
      WHERE c.user_id = $1
      LIMIT 1;
    `;
    const res = await pool.query(query, [userId]);
    if (res.rows.length === 0) return null;
    const r = res.rows[0];
    return {
      id: r.id,
      userId: r.user_id,
      approvalStatus: r.approval_status,
      qualification: r.qualification,
    };
  }

  /**
   * Finds counsellor profile by counsellor ID.
   */
  async findCounsellorById(counsellorId: string): Promise<{
    id: string;
    userId: string;
    approvalStatus: string;
    qualification: string;
  } | null> {
    const query = `
      SELECT c.id, c.user_id, c.approval_status, c.qualification
      FROM counsellors c
      WHERE c.id = $1
      LIMIT 1;
    `;
    const res = await pool.query(query, [counsellorId]);
    if (res.rows.length === 0) return null;
    const r = res.rows[0];
    return {
      id: r.id,
      userId: r.user_id,
      approvalStatus: r.approval_status,
      qualification: r.qualification,
    };
  }

  /**
   * Creates or returns an existing conversation between a student and counsellor.
   */
  async getOrCreateConversation(
    studentId: string,
    counsellorId: string,
    client?: PoolClient
  ): Promise<string> {
    const query = `
      INSERT INTO conversations (student_id, counsellor_id, status)
      VALUES ($1, $2, 'ACTIVE')
      ON CONFLICT (student_id, counsellor_id)
      DO UPDATE SET updated_at = NOW()
      RETURNING id;
    `;
    const db = client || pool;
    const res = await db.query(query, [studentId, counsellorId]);
    return res.rows[0].id;
  }

  /**
   * Finds a conversation by its UUID and maps DTO with unread count for viewer.
   */
  async findConversationById(
    conversationId: string,
    viewerUserId: string
  ): Promise<ConversationDTO | null> {
    const query = `
      SELECT 
        c.id,
        c.student_id,
        c.counsellor_id,
        c.status,
        c.created_at,
        c.updated_at,
        c.last_message_at,
        stu.id AS student_user_id,
        TRIM(CONCAT(stu.first_name, ' ', stu.last_name)) AS student_name,
        stu.email AS student_email,
        cu.id AS counsellor_user_id,
        TRIM(CONCAT(cu.first_name, ' ', cu.last_name)) AS counsellor_name,
        cu.email AS counsellor_email,
        co.qualification AS counsellor_qualification,
        lm.id AS last_message_id,
        lm.content AS last_message_content,
        lm.sender_user_id AS last_message_sender_id,
        lm.created_at AS last_message_created_at,
        COALESCE(unr.unread_count, 0) AS unread_count
      FROM conversations c
      JOIN users stu ON c.student_id = stu.id
      JOIN counsellors co ON c.counsellor_id = co.id
      JOIN users cu ON co.user_id = cu.id
      LEFT JOIN LATERAL (
        SELECT m.id, m.content, m.sender_user_id, m.created_at
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) lm ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*)::int AS unread_count
        FROM message_receipts mr
        WHERE mr.conversation_id = c.id
          AND mr.user_id = $2
          AND mr.read_at IS NULL
      ) unr ON true
      WHERE c.id = $1;
    `;

    const res = await pool.query(query, [conversationId, viewerUserId]);
    if (res.rows.length === 0) return null;
    return this.mapConversationRowToDTO(res.rows[0]);
  }

  /**
   * Lists all conversations for a student or counsellor without N+1 queries.
   */
  async listConversationsForUser(
    userId: string,
    role: UserRole
  ): Promise<ConversationDTO[]> {
    const query = `
      SELECT 
        c.id,
        c.student_id,
        c.counsellor_id,
        c.status,
        c.created_at,
        c.updated_at,
        c.last_message_at,
        stu.id AS student_user_id,
        TRIM(CONCAT(stu.first_name, ' ', stu.last_name)) AS student_name,
        stu.email AS student_email,
        cu.id AS counsellor_user_id,
        TRIM(CONCAT(cu.first_name, ' ', cu.last_name)) AS counsellor_name,
        cu.email AS counsellor_email,
        co.qualification AS counsellor_qualification,
        lm.id AS last_message_id,
        lm.content AS last_message_content,
        lm.sender_user_id AS last_message_sender_id,
        lm.created_at AS last_message_created_at,
        COALESCE(unr.unread_count, 0) AS unread_count
      FROM conversations c
      JOIN users stu ON c.student_id = stu.id
      JOIN counsellors co ON c.counsellor_id = co.id
      JOIN users cu ON co.user_id = cu.id
      LEFT JOIN LATERAL (
        SELECT m.id, m.content, m.sender_user_id, m.created_at
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) lm ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*)::int AS unread_count
        FROM message_receipts mr
        WHERE mr.conversation_id = c.id
          AND mr.user_id = $1
          AND mr.read_at IS NULL
      ) unr ON true
      WHERE ($2 = 'PARTICIPANT' AND c.student_id = $1)
         OR ($2 = 'CAREER_COUNSELLOR' AND co.user_id = $1)
         OR ($2 = 'SUPER_ADMIN')
      ORDER BY c.last_message_at DESC NULLS LAST, c.created_at DESC;
    `;

    const res = await pool.query(query, [userId, role]);
    return res.rows.map((row) => this.mapConversationRowToDTO(row));
  }

  /**
   * Persists a message within a transaction with clientMessageId idempotency.
   */
  async createMessage(data: {
    conversationId: string;
    senderUserId: string;
    senderRole: UserRole;
    recipientUserId: string;
    content: string;
    clientMessageId?: string;
    messageType?: MessageType;
  }): Promise<{ message: MessageDTO; isDuplicate: boolean }> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Check idempotency if clientMessageId provided
      if (data.clientMessageId) {
        const checkQuery = `
          SELECT m.id, m.conversation_id, m.sender_user_id, m.message_type,
                 m.content, m.client_message_id, m.created_at,
                 mr.delivered_at, mr.read_at
          FROM messages m
          LEFT JOIN message_receipts mr ON m.id = mr.message_id
          WHERE m.sender_user_id = $1 AND m.client_message_id = $2
          LIMIT 1;
        `;
        const existing = await client.query(checkQuery, [
          data.senderUserId,
          data.clientMessageId,
        ]);

        if (existing.rows.length > 0) {
          await client.query("COMMIT");
          return {
            message: this.mapMessageRowToDTO(existing.rows[0], data.senderRole),
            isDuplicate: true,
          };
        }
      }

      // Insert message
      const msgType = data.messageType || "TEXT";
      const insertQuery = `
        INSERT INTO messages (
          conversation_id, sender_user_id, message_type, content, client_message_id
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, conversation_id, sender_user_id, message_type, content,
                  client_message_id, created_at;
      `;
      const msgRes = await client.query(insertQuery, [
        data.conversationId,
        data.senderUserId,
        msgType,
        data.content,
        data.clientMessageId || null,
      ]);
      const messageRow = msgRes.rows[0];

      // Insert recipient receipt record (unread)
      const receiptQuery = `
        INSERT INTO message_receipts (
          conversation_id, message_id, user_id, delivered_at, read_at
        )
        VALUES ($1, $2, $3, NOW(), NULL);
      `;
      await client.query(receiptQuery, [
        data.conversationId,
        messageRow.id,
        data.recipientUserId,
      ]);

      // Update conversation timestamp
      const convQuery = `
        UPDATE conversations
        SET last_message_at = $2, updated_at = NOW()
        WHERE id = $1;
      `;
      await client.query(convQuery, [data.conversationId, messageRow.created_at]);

      await client.query("COMMIT");

      const messageDTO: MessageDTO = {
        id: messageRow.id,
        conversationId: messageRow.conversation_id,
        senderUserId: messageRow.sender_user_id,
        senderRole: data.senderRole,
        messageType: messageRow.message_type,
        content: messageRow.content,
        clientMessageId: messageRow.client_message_id,
        createdAt: messageRow.created_at.toISOString(),
        deliveredAt: new Date().toISOString(),
        readAt: null,
        status: "SENT",
      };

      return { message: messageDTO, isDuplicate: false };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Retrieves messages for a conversation with cursor pagination (before timestamp).
   */
  async getMessagesByConversationId(
    conversationId: string,
    before?: string,
    limit = 30
  ): Promise<MessageCursorPage<MessageDTO>> {
    // Query limit + 1 to detect hasMore
    const query = `
      SELECT 
        m.id,
        m.conversation_id,
        m.sender_user_id,
        m.message_type,
        m.content,
        m.client_message_id,
        m.created_at,
        mr.delivered_at,
        mr.read_at,
        ur.sender_role
      FROM messages m
      LEFT JOIN message_receipts mr ON m.id = mr.message_id
      LEFT JOIN LATERAL (
        SELECT r.name AS sender_role
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = m.sender_user_id
        ORDER BY ur.is_primary DESC LIMIT 1
      ) ur ON true
      WHERE m.conversation_id = $1
        AND ($2::timestamptz IS NULL OR m.created_at < $2::timestamptz)
        AND m.deleted_at IS NULL
      ORDER BY m.created_at DESC
      LIMIT $3;
    `;

    const res = await pool.query(query, [conversationId, before || null, limit + 1]);
    const hasMore = res.rows.length > limit;
    const rows = hasMore ? res.rows.slice(0, limit) : res.rows;

    const items: MessageDTO[] = rows.map((r) =>
      this.mapMessageRowToDTO(r, r.sender_role as UserRole)
    );

    // Items ordered oldest -> newest for convenient display in UI
    const chronologicalItems = [...items].reverse();
    const nextCursor =
      hasMore && rows.length > 0
        ? rows[rows.length - 1].created_at.toISOString()
        : null;

    return {
      items: chronologicalItems,
      nextCursor,
      hasMore,
    };
  }

  /**
   * Marks unread messages in a conversation as read for the reader.
   * Returns IDs of marked messages.
   */
  async markConversationMessagesRead(
    conversationId: string,
    readerUserId: string,
    readThroughMessageId?: string
  ): Promise<string[]> {
    if (readThroughMessageId) {
      const query = `
        UPDATE message_receipts mr
        SET read_at = NOW()
        FROM messages m
        WHERE mr.message_id = m.id
          AND mr.conversation_id = $1
          AND mr.user_id = $2
          AND mr.read_at IS NULL
          AND m.created_at <= (
            SELECT created_at FROM messages WHERE id = $3
          )
        RETURNING mr.message_id;
      `;
      const res = await pool.query(query, [conversationId, readerUserId, readThroughMessageId]);
      return res.rows.map((r) => r.message_id);
    }

    const query = `
      UPDATE message_receipts
      SET read_at = NOW()
      WHERE conversation_id = $1
        AND user_id = $2
        AND read_at IS NULL
      RETURNING message_id;
    `;
    const res = await pool.query(query, [conversationId, readerUserId]);
    return res.rows.map((r) => r.message_id);
  }

  /**
   * Gets total unread message count across all conversations for a user.
   */
  async getUnreadCountForUser(userId: string): Promise<number> {
    const query = `
      SELECT COUNT(*)::int AS count
      FROM message_receipts
      WHERE user_id = $1 AND read_at IS NULL;
    `;
    const res = await pool.query(query, [userId]);
    return res.rows[0]?.count || 0;
  }

  // --- Helpers & Mappers ---

  private mapConversationRowToDTO(row: ConversationRow): ConversationDTO {
    return {
      id: row.id,
      studentId: row.student_id,
      counsellorId: row.counsellor_id,
      status: row.status,
      lastMessageAt: row.last_message_at ? new Date(row.last_message_at).toISOString() : null,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
      student: {
        id: row.student_user_id,
        fullName: row.student_name || "Student Candidate",
        email: row.student_email,
        avatarUrl: null,
      },
      counsellor: {
        id: row.counsellor_id,
        counsellorProfileId: row.counsellor_id,
        userId: row.counsellor_user_id,
        fullName: row.counsellor_name || "Career Counsellor",
        email: row.counsellor_email,
        qualification: row.counsellor_qualification || "Certified Career Guidance Expert",
        avatarUrl: null,
      },
      lastMessage: row.last_message_id
        ? {
            id: row.last_message_id,
            content: row.last_message_content || "",
            senderUserId: row.last_message_sender_id || "",
            createdAt: new Date(row.last_message_created_at || row.created_at).toISOString(),
          }
        : null,
      unreadCount: typeof row.unread_count === "number" ? row.unread_count : parseInt(row.unread_count, 10) || 0,
    };
  }

  private mapMessageRowToDTO(row: MessageRow, senderRole?: UserRole): MessageDTO {
    let status: MessageDeliveryStatus = "SENT";
    if (row.read_at) {
      status = "READ";
    } else if (row.delivered_at) {
      status = "DELIVERED";
    }

    return {
      id: row.id,
      conversationId: row.conversation_id,
      senderUserId: row.sender_user_id,
      senderRole: senderRole || "PARTICIPANT",
      messageType: row.message_type,
      content: row.content,
      clientMessageId: row.client_message_id,
      createdAt: new Date(row.created_at).toISOString(),
      deliveredAt: row.delivered_at ? new Date(row.delivered_at).toISOString() : null,
      readAt: row.read_at ? new Date(row.read_at).toISOString() : null,
      status,
    };
  }
}

export const messagingRepository = new MessagingRepository();
