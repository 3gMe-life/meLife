/**
 * 3G MeLife Messaging API Client
 */

import { fetchApi } from "@/services/api/client";
import {
  ConversationDTO,
  MessageDTO,
  MessagesResponse,
} from "../types/messaging.types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export const messagingApi = {
  /**
   * Fetches all conversations accessible to the current user.
   */
  async getConversations(): Promise<ConversationDTO[]> {
    const res = await fetchApi<ApiResponse<ConversationDTO[]>>("/messaging/conversations");
    return res.data;
  },

  /**
   * Fetches a single conversation by ID.
   */
  async getConversation(conversationId: string): Promise<ConversationDTO> {
    const res = await fetchApi<ApiResponse<ConversationDTO>>(
      `/messaging/conversations/${conversationId}`
    );
    return res.data;
  },

  /**
   * Initiates or retrieves an existing conversation with a counsellor or student.
   */
  async createConversation(data: {
    counsellorId?: string;
    studentId?: string;
  }): Promise<ConversationDTO> {
    const res = await fetchApi<ApiResponse<ConversationDTO>>("/messaging/conversations", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  /**
   * Fetches message history with optional cursor pagination.
   */
  async getMessages(
    conversationId: string,
    before?: string,
    limit = 30
  ): Promise<MessagesResponse> {
    const params = new URLSearchParams();
    if (before) params.set("before", before);
    if (limit) params.set("limit", String(limit));

    const qs = params.toString() ? `?${params.toString()}` : "";
    const res = await fetchApi<ApiResponse<MessageDTO[]>>(
      `/messaging/conversations/${conversationId}/messages${qs}`
    );

    return {
      items: res.data,
      pagination: res.pagination || { nextCursor: null, hasMore: false },
    };
  },

  /**
   * Sends a message in a conversation.
   */
  async sendMessage(
    conversationId: string,
    content: string,
    clientMessageId?: string
  ): Promise<MessageDTO> {
    const res = await fetchApi<ApiResponse<MessageDTO>>(
      `/messaging/conversations/${conversationId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          content,
          clientMessageId,
          messageType: "TEXT",
        }),
      }
    );
    return res.data;
  },

  /**
   * Marks unread messages in a conversation as read.
   */
  async markAsRead(
    conversationId: string
  ): Promise<{ markedCount: number; messageIds: string[] }> {
    const res = await fetchApi<ApiResponse<{ markedCount: number; messageIds: string[] }>>(
      `/messaging/conversations/${conversationId}/read`,
      {
        method: "PATCH",
      }
    );
    return res.data;
  },

  /**
   * Fetches total unread messages count for badges.
   */
  async getUnreadCount(): Promise<number> {
    const res = await fetchApi<ApiResponse<{ unreadCount: number }>>(
      "/messaging/unread-count"
    );
    return res.data.unreadCount;
  },
};
