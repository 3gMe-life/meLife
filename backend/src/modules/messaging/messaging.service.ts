/**
 * 3G MeLife Messaging Service Layer
 *
 * Implements conversation eligibility, membership authorization,
 * message persistence dispatch, read tracking, and real-time broadcast.
 */

import { AppError } from "../../common/errors/app-error";
import { UserRole } from "../users/user.types";
import { userRepository } from "../users/user.repository";
import { counsellingRepository } from "../counselling/counselling.repository";
import { messagingRepository } from "./messaging.repository";
import {
  broadcastNewMessage,
  broadcastMessageRead,
  broadcastConversationUpdated,
} from "./messaging.socket";
import {
  ConversationDTO,
  MessageDTO,
  MessageCursorPage,
  MessagingAccessDTO,
} from "./messaging.types";
import {
  CreateConversationInput,
  SendMessageInput,
  GetMessagesQueryInput,
} from "./messaging.schema";
import { logger } from "../../common/utils/logger";

export class MessagingService {
  /**
   * Lists all conversations accessible to the authenticated user.
   */
  async listUserConversations(
    userId: string,
    role: UserRole
  ): Promise<ConversationDTO[]> {
    return messagingRepository.listConversationsForUser(userId, role);
  }

  /**
   * Retrieves messaging access summary for the authenticated user.
   */
  async getMessagingAccess(
    userId: string,
    role: UserRole
  ): Promise<MessagingAccessDTO> {
    return messagingRepository.getMessagingAccessSummary(userId, role);
  }

  /**
   * Retrieves a single conversation by ID with membership and relationship authorization.
   */
  async getConversationById(
    conversationId: string,
    userId: string,
    role: UserRole
  ): Promise<ConversationDTO> {
    const conversation = await messagingRepository.findConversationById(
      conversationId,
      userId
    );

    if (!conversation) {
      throw AppError.notFound(
        "Conversation not found",
        "MESSAGING_CONVERSATION_NOT_FOUND"
      );
    }

    await this.assertConversationAccess(conversation, userId, role);
    return conversation;
  }

  /**
   * Creates or retrieves an existing conversation between a student and counsellor.
   * Enforces approved counsellor status and legitimate counselling_sessions relationship.
   */
  async getOrCreateConversation(
    userId: string,
    role: UserRole,
    input: CreateConversationInput
  ): Promise<ConversationDTO> {
    let studentId: string;
    let counsellorProfileId: string;

    if (role === "PARTICIPANT") {
      studentId = userId;
      if (!input.counsellorId) {
        throw AppError.badRequest(
          "counsellorId is required to start a conversation with a counsellor",
          "MESSAGING_MISSING_COUNSELLOR_ID"
        );
      }
      counsellorProfileId = input.counsellorId;

      // 1. Verify counsellor exists and is APPROVED
      const counsellor = await messagingRepository.findCounsellorById(counsellorProfileId);
      if (!counsellor || counsellor.approvalStatus !== "APPROVED") {
        throw AppError.forbidden(
          "This counsellor profile is not currently approved for messaging.",
          "MESSAGING_COUNSELLOR_NOT_APPROVED"
        );
      }

      // 2. Verify counselling relationship
      const hasRelationship = await messagingRepository.hasEligibleCounsellingRelationship(
        studentId,
        counsellorProfileId
      );

      if (!hasRelationship) {
        throw AppError.forbidden(
          "You must have a scheduled, confirmed, or completed session with this counsellor to message them.",
          "MESSAGING_RELATIONSHIP_REQUIRED"
        );
      }
    } else if (role === "CAREER_COUNSELLOR") {
      // Counsellor initiating or opening conversation with an assigned student
      if (!input.studentId) {
        throw AppError.badRequest(
          "studentId is required for counsellors to open a conversation",
          "MESSAGING_MISSING_STUDENT_ID"
        );
      }
      studentId = input.studentId;

      // 1. Verify authenticated counsellor profile
      const counsellor = await messagingRepository.findCounsellorByUserId(userId);
      if (!counsellor || counsellor.approvalStatus !== "APPROVED") {
        throw AppError.forbidden(
          "Your counsellor profile is not currently approved for messaging.",
          "MESSAGING_COUNSELLOR_NOT_APPROVED"
        );
      }
      counsellorProfileId = counsellor.id;

      // 2. Verify student exists and is active
      const studentUser = await userRepository.findById(studentId);
      if (!studentUser || studentUser.status !== "ACTIVE") {
        throw AppError.notFound("Student user not found or inactive", "USER_NOT_FOUND");
      }

      // 3. Verify counselling relationship
      const hasRelationship = await messagingRepository.hasEligibleCounsellingRelationship(
        studentId,
        counsellorProfileId
      );

      if (!hasRelationship) {
        throw AppError.forbidden(
          "You can only message students who have booked or completed sessions with you.",
          "MESSAGING_RELATIONSHIP_REQUIRED"
        );
      }
    } else if (role === "SUPER_ADMIN") {
      if (!input.studentId || !input.counsellorId) {
        throw AppError.badRequest(
          "Both studentId and counsellorId are required for admin creation",
          "MESSAGING_BAD_INPUT"
        );
      }
      studentId = input.studentId;
      counsellorProfileId = input.counsellorId;
    } else {
      throw AppError.forbidden(
        "Only students and career counsellors are authorized for counselling messaging.",
        "AUTH_FORBIDDEN"
      );
    }

    const conversationId = await messagingRepository.getOrCreateConversation(
      studentId,
      counsellorProfileId
    );

    const conv = await messagingRepository.findConversationById(conversationId, userId);
    if (!conv) {
      throw AppError.internal("Failed to retrieve created conversation");
    }

    return conv;
  }

  /**
   * Retrieves paginated messages for a conversation with membership verification.
   */
  async getMessages(
    conversationId: string,
    userId: string,
    role: UserRole,
    query: GetMessagesQueryInput
  ): Promise<MessageCursorPage<MessageDTO>> {
    const conversation = await messagingRepository.findConversationById(
      conversationId,
      userId
    );

    if (!conversation) {
      throw AppError.notFound(
        "Conversation not found",
        "MESSAGING_CONVERSATION_NOT_FOUND"
      );
    }

    await this.assertConversationAccess(conversation, userId, role);

    return messagingRepository.getMessagesByConversationId(
      conversationId,
      query.before,
      query.limit
    );
  }

  /**
   * Sends a message with transactional persistence, idempotency, and live Socket.IO emission.
   */
  async sendMessage(
    conversationId: string,
    senderUserId: string,
    senderRole: UserRole,
    input: SendMessageInput
  ): Promise<MessageDTO> {
    const conversation = await messagingRepository.findConversationById(
      conversationId,
      senderUserId
    );

    if (!conversation) {
      throw AppError.notFound(
        "Conversation not found",
        "MESSAGING_CONVERSATION_NOT_FOUND"
      );
    }

    await this.assertConversationAccess(conversation, senderUserId, senderRole);

    if (conversation.status === "CLOSED") {
      throw AppError.badRequest(
        "This conversation has been closed. New messages cannot be sent.",
        "MESSAGING_CONVERSATION_CLOSED"
      );
    }

    // Determine recipient user ID
    let recipientUserId: string;
    let senderName: string;

    if (conversation.studentId === senderUserId) {
      recipientUserId = conversation.counsellor.userId;
      senderName = conversation.student.fullName;
    } else if (conversation.counsellor.userId === senderUserId) {
      recipientUserId = conversation.studentId;
      senderName = conversation.counsellor.fullName;
    } else if (senderRole === "SUPER_ADMIN") {
      recipientUserId = conversation.studentId;
      senderName = "Platform Administrator";
    } else {
      throw AppError.forbidden(
        "Access denied. You are not a member of this conversation.",
        "MESSAGING_NOT_PARTICIPANT"
      );
    }

    // Verify recipient account status
    const recipientUser = await userRepository.findById(recipientUserId);
    if (!recipientUser || recipientUser.status !== "ACTIVE") {
      throw AppError.badRequest(
        "Cannot send message. Recipient account is inactive or disabled.",
        "MESSAGING_RECIPIENT_INACTIVE"
      );
    }

    // Persist message transactionally
    const { message, isDuplicate } = await messagingRepository.createMessage({
      conversationId,
      senderUserId,
      senderRole,
      recipientUserId,
      content: input.content,
      clientMessageId: input.clientMessageId,
      messageType: input.messageType,
    });

    // If not a duplicate resend, trigger live real-time broadcast and notification
    if (!isDuplicate) {
      broadcastNewMessage(conversationId, message, recipientUserId);
      broadcastConversationUpdated(conversationId, [
        senderUserId,
        recipientUserId,
      ]);

      // Create asynchronous notification for recipient
      try {
        await counsellingRepository.createNotification({
          userId: recipientUserId,
          title: "New Message",
          message: `${senderName} sent you a message.`,
          type: "NEW_MESSAGE",
          metadata: {
            conversationId,
            senderUserId,
            senderName,
          },
        });
      } catch (notifErr) {
        logger.warn({ err: notifErr }, "Non-critical: failed to create message notification");
      }
    }

    return message;
  }

  /**
   * Marks unread messages in a conversation as read.
   */
  async markAsRead(
    conversationId: string,
    readerUserId: string,
    readerRole: UserRole
  ): Promise<{ markedCount: number; messageIds: string[] }> {
    const conversation = await messagingRepository.findConversationById(
      conversationId,
      readerUserId
    );

    if (!conversation) {
      throw AppError.notFound(
        "Conversation not found",
        "MESSAGING_CONVERSATION_NOT_FOUND"
      );
    }

    await this.assertConversationAccess(conversation, readerUserId, readerRole);

    const messageIds = await messagingRepository.markConversationMessagesRead(
      conversationId,
      readerUserId
    );

    if (messageIds.length > 0) {
      const readAt = new Date().toISOString();
      broadcastMessageRead(conversationId, {
        conversationId,
        readByUserId: readerUserId,
        readAt,
        messageIds,
      });

      // Update unread count for reader
      const participantUserIds = [
        conversation.studentId,
        conversation.counsellor.userId,
      ];
      broadcastConversationUpdated(conversationId, participantUserIds);
    }

    return {
      markedCount: messageIds.length,
      messageIds,
    };
  }

  /**
   * Gets total unread message count for a user across all conversations.
   */
  async getUnreadCount(userId: string): Promise<number> {
    return messagingRepository.getUnreadCountForUser(userId);
  }

  // --- Security Helpers ---

  /**
   * Authorizes that a user is an active participant AND has an eligible counselling relationship.
   */
  async assertConversationAccess(
    conversation: ConversationDTO,
    userId: string,
    role: UserRole
  ): Promise<void> {
    this.assertConversationMembership(conversation, userId, role);

    if (role !== "SUPER_ADMIN") {
      const isEligible = await messagingRepository.hasEligibleCounsellingRelationship(
        conversation.studentId,
        conversation.counsellorId
      );
      if (!isEligible) {
        logger.warn(
          { userId, role, conversationId: conversation.id },
          "Blocked messaging access: Ineligible counselling relationship"
        );
        throw AppError.forbidden(
          "Messaging is locked. An accepted counselling session is required.",
          "MESSAGING_RELATIONSHIP_REQUIRED"
        );
      }
    }
  }

  /**
   * Verifies socket membership and counselling relationship eligibility for Socket.IO actions.
   */
  async verifyConversationSocketAccess(
    conversationId: string,
    userId: string,
    role: UserRole
  ): Promise<{ conversation: ConversationDTO | null; eligible: boolean }> {
    const conversation = await messagingRepository.findConversationById(
      conversationId,
      userId
    );
    if (!conversation) {
      return { conversation: null, eligible: false };
    }

    if (role === "SUPER_ADMIN") {
      return { conversation, eligible: true };
    }

    const isMember =
      conversation.studentId === userId ||
      conversation.counsellor.userId === userId;
    if (!isMember) {
      return { conversation, eligible: false };
    }

    const isEligible = await messagingRepository.hasEligibleCounsellingRelationship(
      conversation.studentId,
      conversation.counsellorId
    );

    return { conversation, eligible: isEligible };
  }

  private assertConversationMembership(
    conversation: ConversationDTO,
    userId: string,
    role: UserRole
  ): void {
    if (role === "SUPER_ADMIN") return;

    const isStudent = conversation.studentId === userId;
    const isCounsellor = conversation.counsellor.userId === userId;

    if (!isStudent && !isCounsellor) {
      logger.warn(
        { userId, role, conversationId: conversation.id },
        "BOLA / IDOR Violation detected: Attempted unauthorized access to conversation"
      );
      throw AppError.forbidden(
        "Access denied. You do not have permission to view or participate in this conversation.",
        "MESSAGING_NOT_PARTICIPANT"
      );
    }
  }
}

export const messagingService = new MessagingService();
