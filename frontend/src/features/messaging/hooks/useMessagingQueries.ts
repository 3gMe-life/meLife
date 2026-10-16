/**
 * TanStack Query hooks for real-time messaging
 */

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messagingApi } from "../api/messaging.api";
import {
  ConversationDTO,
  MessageDTO,
  MessagesResponse,
} from "../types/messaging.types";

export const messagingKeys = {
  all: ["messaging"] as const,
  access: () => [...messagingKeys.all, "access"] as const,
  conversations: () => [...messagingKeys.all, "conversations"] as const,
  conversation: (id: string) => [...messagingKeys.all, "conversation", id] as const,
  messages: (id: string) => [...messagingKeys.all, "messages", id] as const,
  unreadCount: () => [...messagingKeys.all, "unread-count"] as const,
};

/**
 * Hook to retrieve all active conversations.
 */
export function useConversations() {
  return useQuery({
    queryKey: messagingKeys.conversations(),
    queryFn: () => messagingApi.getConversations(),
    staleTime: 1000 * 30, // 30 seconds (socket handles live updates)
  });
}

/**
 * Hook to retrieve a single conversation by ID.
 */
export function useConversation(conversationId: string | null) {
  return useQuery({
    queryKey: messagingKeys.conversation(conversationId || ""),
    queryFn: () => messagingApi.getConversation(conversationId!),
    enabled: Boolean(conversationId),
  });
}

/**
 * Hook to retrieve message thread history for a conversation.
 */
export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: messagingKeys.messages(conversationId || ""),
    queryFn: () => messagingApi.getMessages(conversationId!),
    enabled: Boolean(conversationId),
    staleTime: Infinity, // Rely on socket updates and manual loads
  });
}

/**
 * Hook to retrieve the total unread message counter.
 */
export function useUnreadCount() {
  return useQuery({
    queryKey: messagingKeys.unreadCount(),
    queryFn: () => messagingApi.getUnreadCount(),
    staleTime: 1000 * 30,
  });
}

/**
 * Hook to retrieve messaging access eligibility and counters.
 */
export function useMessagingAccess(enabled = true) {
  return useQuery({
    queryKey: messagingKeys.access(),
    queryFn: () => messagingApi.getAccess(),
    staleTime: 1000 * 30,
    enabled,
  });
}

/**
 * Mutation hook to create or retrieve a conversation.
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { counsellorId?: string; studentId?: string }) =>
      messagingApi.createConversation(data),
    onSuccess: (newConv) => {
      queryClient.invalidateQueries({ queryKey: messagingKeys.conversations() });
      queryClient.setQueryData(
        messagingKeys.conversation(newConv.id),
        newConv
      );
    },
  });
}

/**
 * Mutation hook to mark conversation messages as read.
 */
export function useMarkConversationRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (vars: { conversationId: string; readThroughMessageId?: string }) =>
      messagingApi.markAsRead(vars.conversationId, vars.readThroughMessageId),
    onSuccess: (data, vars) => {
      const { conversationId } = vars;

      // 1. Directly update active conversation in cache
      queryClient.setQueryData<ConversationDTO>(
        messagingKeys.conversation(conversationId),
        (old) => (old ? { ...old, unreadCount: 0 } : old)
      );

      // 2. Directly update conversation list in cache
      queryClient.setQueryData<ConversationDTO[]>(
        messagingKeys.conversations(),
        (old) => {
          if (!old) return old;
          return old.map((c) =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          );
        }
      );

      // 3. Directly update messages thread cache
      queryClient.setQueryData<MessagesResponse>(
        messagingKeys.messages(conversationId),
        (old) => {
          if (!old) return old;
          const markedSet = new Set(data.messageIds || []);
          return {
            ...old,
            items: old.items.map((m) =>
              markedSet.has(m.id) || (vars.readThroughMessageId && m.id === vars.readThroughMessageId)
                ? { ...m, status: "READ" as const, readAt: new Date().toISOString() }
                : m
            ),
          };
        }
      );

      // 4. Update total unread counter
      if (data.markedCount > 0) {
        queryClient.setQueryData<number>(
          messagingKeys.unreadCount(),
          (old) => Math.max(0, (old || 0) - data.markedCount)
        );
        queryClient.setQueryData<import("../types/messaging.types").MessagingAccessDTO>(
          messagingKeys.access(),
          (old) => (old ? { ...old, unreadCount: Math.max(0, old.unreadCount - data.markedCount) } : old)
        );
      }
    },
  });

  const { mutateAsync } = mutation;
  const markAsRead = useCallback(
    (conversationId: string, readThroughMessageId?: string) =>
      mutateAsync({ conversationId, readThroughMessageId }),
    [mutateAsync]
  );

  return {
    ...mutation,
    markAsRead,
  };
}

/**
 * Mutation hook to send a message with optimistic cache update.
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: {
      conversationId: string;
      content: string;
      clientMessageId: string;
      senderUserId: string;
    }) =>
      messagingApi.sendMessage(
        vars.conversationId,
        vars.content,
        vars.clientMessageId
      ),
    onMutate: async (vars) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: messagingKeys.messages(vars.conversationId),
      });

      const previousMessages = queryClient.getQueryData<MessagesResponse>(
        messagingKeys.messages(vars.conversationId)
      );

      // Create optimistic message
      const optimisticMessage: MessageDTO = {
        id: vars.clientMessageId,
        conversationId: vars.conversationId,
        senderUserId: vars.senderUserId,
        messageType: "TEXT",
        content: vars.content,
        clientMessageId: vars.clientMessageId,
        createdAt: new Date().toISOString(),
        status: "SENDING",
      };

      // Optimistically append to thread
      queryClient.setQueryData<MessagesResponse>(
        messagingKeys.messages(vars.conversationId),
        (old) => {
          if (!old) {
            return {
              items: [optimisticMessage],
              pagination: { nextCursor: null, hasMore: false },
            };
          }
          return {
            ...old,
            items: [...old.items, optimisticMessage],
          };
        }
      );

      return { previousMessages, optimisticId: vars.clientMessageId };
    },
    onSuccess: (savedMessage, vars, context) => {
      // Replace optimistic message with confirmed server message
      queryClient.setQueryData<MessagesResponse>(
        messagingKeys.messages(vars.conversationId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((m) =>
              m.clientMessageId === context?.optimisticId || m.id === context?.optimisticId
                ? savedMessage
                : m
            ),
          };
        }
      );

      // Invalidate conversation list to update lastMessage and lastMessageAt
      queryClient.invalidateQueries({ queryKey: messagingKeys.conversations() });
    },
    onError: (_err, vars, context) => {
      // Mark optimistic message as failed
      queryClient.setQueryData<MessagesResponse>(
        messagingKeys.messages(vars.conversationId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((m) =>
              m.clientMessageId === context?.optimisticId
                ? { ...m, status: "FAILED" }
                : m
            ),
          };
        }
      );
    },
  });
}
