/**
 * React hook connecting components to the Socket.IO real-time messaging gateway.
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { messagingSocketService } from "../services/messaging.socket.service";
import { messagingKeys } from "./useMessagingQueries";
import {
  MessageDTO,
  MessagesResponse,
  ConversationDTO,
  SocketConnectionState,
  TypingState,
} from "../types/messaging.types";

interface UseMessagingSocketOptions {
  activeConversationId?: string | null;
  currentUserId?: string;
}

export function useMessagingSocket(options: UseMessagingSocketOptions = {}) {
  const { activeConversationId, currentUserId } = options;
  const queryClient = useQueryClient();

  const [connectionState, setConnectionState] = useState<SocketConnectionState>(
    messagingSocketService.getConnectionState()
  );
  const [typingState, setTypingState] = useState<TypingState>({ isTyping: false });
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeConvIdRef = useRef(activeConversationId);
  const currentUserIdRef = useRef(currentUserId);

  useEffect(() => {
    activeConvIdRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  // 1. Subscribe to Socket Connection State
  useEffect(() => {
    const unsubscribe = messagingSocketService.subscribeConnectionState((state) => {
      setConnectionState(state);
    });

    const socket = messagingSocketService.getSocket();
    if (socket && !socket.connected && !socket.active) {
      socket.connect();
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // 2. Join/Leave Active Conversation Room (for typing indicators & read receipts)
  useEffect(() => {
    if (!activeConversationId) return;

    messagingSocketService.joinConversation(activeConversationId);

    return () => {
      messagingSocketService.leaveConversation(activeConversationId);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setTypingState({ isTyping: false });
    };
  }, [activeConversationId]);

  // 3. Register Real-Time Event Handlers
  useEffect(() => {
    const socket = messagingSocketService.getSocket();
    if (!socket) return;

    // Handle incoming new message across all conversations
    const handleNewMessage = (newMessage: MessageDTO) => {
      const currentActiveId = activeConvIdRef.current;
      const currentUid = currentUserIdRef.current;

      // 1. Update the message thread cache for the conversation this message belongs to
      const targetQueryKey = messagingKeys.messages(newMessage.conversationId);
      const cachedMessages = queryClient.getQueryData<MessagesResponse>(targetQueryKey);

      if (cachedMessages) {
        queryClient.setQueryData<MessagesResponse>(targetQueryKey, (old) => {
          if (!old) return old;

          const alreadyExists = old.items.some(
            (m) =>
              m.id === newMessage.id ||
              (m.clientMessageId && m.clientMessageId === newMessage.clientMessageId)
          );

          if (alreadyExists) {
            return {
              ...old,
              items: old.items.map((m) =>
                m.id === newMessage.id ||
                (m.clientMessageId && m.clientMessageId === newMessage.clientMessageId)
                  ? newMessage
                  : m
              ),
            };
          }

          return {
            ...old,
            items: [...old.items, newMessage],
          };
        });
      } else {
        // Query has never been loaded into cache yet:
        // Invalidate so that opening this conversation immediately fetches the full history
        queryClient.invalidateQueries({ queryKey: targetQueryKey });
      }

      // 2. Update conversation list item lastMessage, lastMessageAt, and unreadCount
      queryClient.setQueryData<ConversationDTO[]>(
        messagingKeys.conversations(),
        (old) => {
          if (!old) return old;
          return old.map((c) => {
            if (c.id === newMessage.conversationId) {
              const isCurrentActive = currentActiveId === c.id;
              const isSelf = currentUid && newMessage.senderUserId === currentUid;
              const newUnread = isCurrentActive || isSelf ? c.unreadCount : c.unreadCount + 1;

              return {
                ...c,
                lastMessageAt: newMessage.createdAt,
                lastMessage: {
                  id: newMessage.id,
                  content: newMessage.content,
                  senderUserId: newMessage.senderUserId,
                  createdAt: newMessage.createdAt,
                },
                unreadCount: newUnread,
              };
            }
            return c;
          });
        }
      );

      // 3. Invalidate total unread badge if message is from someone else and not active
      if (!currentActiveId || currentActiveId !== newMessage.conversationId) {
        if (currentUid && newMessage.senderUserId !== currentUid) {
          queryClient.invalidateQueries({ queryKey: messagingKeys.unreadCount() });
        }
      }
    };

    // Handle read receipt event
    const handleReadReceipt = (payload: {
      conversationId: string;
      readByUserId: string;
      readAt: string;
      messageIds: string[];
    }) => {
      const targetQueryKey = messagingKeys.messages(payload.conversationId);
      queryClient.setQueryData<MessagesResponse>(targetQueryKey, (old) => {
        if (!old) return old;
        const msgSet = new Set(payload.messageIds);
        return {
          ...old,
          items: old.items.map((m) => {
            if (msgSet.has(m.id)) {
              return { ...m, status: "READ" as const, readAt: payload.readAt };
            }
            return m;
          }),
        };
      });
    };

    // Handle typing events (ephemeral indicator for current active thread)
    const handleUserTyping = (payload: {
      conversationId: string;
      userId: string;
      userName: string;
      isTyping: boolean;
    }) => {
      const currentActiveId = activeConvIdRef.current;
      const currentUid = currentUserIdRef.current;

      if (currentActiveId && payload.conversationId === currentActiveId) {
        if (payload.userId !== currentUid) {
          if (payload.isTyping) {
            setTypingState({ isTyping: true, userName: payload.userName });
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => {
              setTypingState({ isTyping: false });
            }, 3500);
          } else {
            setTypingState({ isTyping: false });
          }
        }
      }
    };

    // Handle conversation updated event (e.g. read count changes)
    const handleConversationUpdated = (payload?: { conversationId?: string }) => {
      const currentActiveId = activeConvIdRef.current;
      if (payload?.conversationId && payload.conversationId === currentActiveId) {
        queryClient.invalidateQueries({ queryKey: messagingKeys.unreadCount() });
        return;
      }
      queryClient.invalidateQueries({ queryKey: messagingKeys.conversations() });
      queryClient.invalidateQueries({ queryKey: messagingKeys.unreadCount() });
    };

    // Handle real-time access unlock / change event
    const handleAccessChanged = () => {
      queryClient.invalidateQueries({ queryKey: messagingKeys.access() });
      queryClient.invalidateQueries({ queryKey: messagingKeys.conversations() });
    };

    // Handle real-time conversation available event
    const handleConversationAvailable = (payload: { conversationId: string }) => {
      queryClient.invalidateQueries({ queryKey: messagingKeys.access() });
      queryClient.invalidateQueries({ queryKey: messagingKeys.conversations() });
      queryClient.invalidateQueries({ queryKey: messagingKeys.conversation(payload.conversationId) });
    };

    socket.on("message:new", handleNewMessage);
    socket.on("message:read", handleReadReceipt);
    socket.on("user:typing", handleUserTyping);
    socket.on("conversation:updated", handleConversationUpdated);
    socket.on("messaging:access-changed", handleAccessChanged);
    socket.on("conversation:available", handleConversationAvailable);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:read", handleReadReceipt);
      socket.off("user:typing", handleUserTyping);
      socket.off("conversation:updated", handleConversationUpdated);
      socket.off("messaging:access-changed", handleAccessChanged);
      socket.off("conversation:available", handleConversationAvailable);
    };
  }, [queryClient]);

  // Typing helper emitters
  const emitTyping = useCallback(
    (userName: string) => {
      if (activeConversationId) {
        messagingSocketService.startTyping(activeConversationId, userName);
      }
    },
    [activeConversationId]
  );

  const emitStopTyping = useCallback(() => {
    if (activeConversationId) {
      messagingSocketService.stopTyping(activeConversationId);
    }
  }, [activeConversationId]);

  return {
    connectionState,
    typingState,
    emitTyping,
    emitStopTyping,
  };
}
