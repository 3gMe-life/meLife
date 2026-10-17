/**
 * 3G MeLife Frontend Messaging Types
 */

export type ConversationStatus = "ACTIVE" | "CLOSED";
export type MessageDeliveryStatus = "SENDING" | "SENT" | "DELIVERED" | "READ" | "FAILED";
export type MessageType = "TEXT" | "SYSTEM";
export type SocketConnectionState = "CONNECTING" | "CONNECTED" | "RECONNECTING" | "OFFLINE";
export type PartnerPresenceState = "UNKNOWN" | "ONLINE" | "OFFLINE";

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
  counsellorId: string;
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
  senderRole?: "PARTICIPANT" | "CAREER_COUNSELLOR" | "SUPER_ADMIN";
  messageType: MessageType;
  content: string;
  clientMessageId?: string | null;
  createdAt: string;
  deliveredAt?: string | null;
  readAt?: string | null;
  status: MessageDeliveryStatus;
}

export interface MessagesPagination {
  nextCursor: string | null;
  hasMore: boolean;
}

export interface MessagesResponse {
  items: MessageDTO[];
  pagination: MessagesPagination;
}

export interface TypingState {
  isTyping: boolean;
  userName?: string;
}

export interface MessagingAccessDTO {
  hasAccess: boolean;
  eligibleCounsellorCount: number;
  unreadCount: number;
}
