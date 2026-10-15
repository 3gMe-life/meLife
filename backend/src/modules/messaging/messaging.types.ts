/**
 * 3G MeLife Messaging Module - Domain & DTO Types
 */

import { UserRole } from "../users/user.types";

export type ConversationStatus = "ACTIVE" | "CLOSED";

export type MessageType = "TEXT" | "SYSTEM";

export type MessageDeliveryStatus = "SENT" | "DELIVERED" | "READ";

export interface ConversationParticipantInfo {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
}

export interface CounsellorParticipantInfo extends ConversationParticipantInfo {
  counsellorProfileId: string;
  userId: string;
  qualification: string;
}

export interface ConversationDTO {
  id: string;
  studentId: string;
  counsellorId: string; // counsellors.id
  status: ConversationStatus;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
  student: ConversationParticipantInfo;
  counsellor: CounsellorParticipantInfo;
  lastMessage: {
    id: string;
    content: string;
    senderUserId: string;
    createdAt: string;
  } | null;
  unreadCount: number;
}

export interface MessageDTO {
  id: string;
  conversationId: string;
  senderUserId: string;
  senderRole?: UserRole;
  messageType: MessageType;
  content: string;
  clientMessageId?: string | null;
  createdAt: string;
  deliveredAt?: string | null;
  readAt?: string | null;
  status: MessageDeliveryStatus;
}

export interface MessageCursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface SocketUserContext {
  userId: string;
  email: string;
  role: UserRole;
  permissions: string[];
  counsellorId?: string; // Present if approved counsellor
}

export interface TypingEventPayload {
  conversationId: string;
  userId: string;
  userName: string;
}

export interface ReadReceiptPayload {
  conversationId: string;
  readByUserId: string;
  readAt: string;
  messageIds: string[];
}

export interface ConversationRow {
  id: string;
  student_id: string;
  counsellor_id: string;
  status: ConversationStatus;
  last_message_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
  student_user_id: string;
  student_name: string | null;
  student_email: string;
  counsellor_user_id: string;
  counsellor_name: string | null;
  counsellor_email: string;
  counsellor_qualification: string | null;
  last_message_id: string | null;
  last_message_content: string | null;
  last_message_sender_id: string | null;
  last_message_created_at: string | Date | null;
  unread_count: string | number;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  message_type: MessageType;
  content: string;
  client_message_id: string | null;
  created_at: string | Date;
  delivered_at: string | Date | null;
  read_at: string | Date | null;
  sender_role?: string;
}
