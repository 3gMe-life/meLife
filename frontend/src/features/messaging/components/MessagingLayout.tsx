"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import {
  useConversations,
  useConversation,
  useMessages,
  useSendMessage,
  useMarkConversationRead,
  useCreateConversation,
  useMessagingAccess,
} from "../hooks/useMessagingQueries";
import { useMessagingSocket } from "../hooks/useMessagingSocket";
import { ConversationList } from "./ConversationList";
import { ConversationHeader } from "./ConversationHeader";
import { MessageThread } from "./MessageThread";
import { MessageComposer } from "./MessageComposer";
import { EmptyConversationState } from "./EmptyConversationState";
import { LockedMessagingState } from "./LockedMessagingState";
import { MessageDTO } from "../types/messaging.types";

interface MessagingLayoutProps {
  isCounsellorView: boolean;
}

export const MessagingLayout: React.FC<MessagingLayoutProps> = ({
  isCounsellorView,
}) => {
  const searchParams = useSearchParams();
  const { data: authData } = useCurrentUserQuery();
  const currentUser = authData?.data?.user;

  const [manualSelectedId, setManualSelectedId] = useState<string | null>(null);
  const [mobileClosed, setMobileClosed] = useState(false);
  const processedParamRef = useRef<string | null>(null);

  // Queries & Mutations
  const { data: conversations = [], isLoading: isLoadingConversations } = useConversations();
  const { data: messagingAccess, isLoading: isLoadingAccess } = useMessagingAccess(!isCounsellorView);

  const isStudentLocked =
    !isCounsellorView &&
    !isLoadingAccess &&
    !isLoadingConversations &&
    messagingAccess !== undefined &&
    !messagingAccess.hasAccess &&
    conversations.length === 0;

  // Derive the active conversation ID without synchronous setState inside effects
  const paramConvId = searchParams.get("conversationId");
  const paramStudentId = searchParams.get("studentId");
  const paramCounsellorId = searchParams.get("counsellorId");

  const matchingParamConv = conversations.find((c) =>
    paramStudentId
      ? c.studentId === paramStudentId
      : paramCounsellorId
      ? c.counsellorId === paramCounsellorId
      : false
  );

  let selectedConversationId: string | null = null;
  if (!mobileClosed) {
    selectedConversationId =
      manualSelectedId ||
      paramConvId ||
      matchingParamConv?.id ||
      (conversations.length > 0 && typeof window !== "undefined" && window.innerWidth >= 768
        ? conversations[0].id
        : null);
  }

  const { data: activeConversation } = useConversation(selectedConversationId);
  const { data: messagesData, isLoading: isLoadingMessages } = useMessages(selectedConversationId);
  const sendMessageMutation = useSendMessage();
  const markReadMutation = useMarkConversationRead();
  const createConversationMutation = useCreateConversation();

  // Socket Hook
  const {
    connectionState,
    typingState,
    emitTyping,
    emitStopTyping,
  } = useMessagingSocket({
    activeConversationId: selectedConversationId,
    currentUserId: currentUser?.id,
  });

  // Handle on-demand conversation auto-creation if not already existing
  useEffect(() => {
    if (paramStudentId && isCounsellorView && !conversations.some((c) => c.studentId === paramStudentId)) {
      if (processedParamRef.current === `student:${paramStudentId}`) return;
      processedParamRef.current = `student:${paramStudentId}`;

      createConversationMutation.mutate(
        { studentId: paramStudentId },
        {
          onSuccess: (newConv) => {
            setManualSelectedId(newConv.id);
            setMobileClosed(false);
          },
        }
      );
    } else if (
      paramCounsellorId &&
      !isCounsellorView &&
      messagingAccess?.hasAccess &&
      !conversations.some((c) => c.counsellorId === paramCounsellorId)
    ) {
      if (processedParamRef.current === `counsellor:${paramCounsellorId}`) return;
      processedParamRef.current = `counsellor:${paramCounsellorId}`;

      createConversationMutation.mutate(
        { counsellorId: paramCounsellorId },
        {
          onSuccess: (newConv) => {
            setManualSelectedId(newConv.id);
            setMobileClosed(false);
          },
        }
      );
    }
  }, [
    paramStudentId,
    paramCounsellorId,
    isCounsellorView,
    messagingAccess?.hasAccess,
    conversations,
    createConversationMutation,
  ]);

  // Deduplicated Read Receipt Refs
  const lastAcknowledgedMessageIdRef = useRef<Record<string, string>>({});
  const readRequestInFlightRef = useRef(false);

  // Identify the newest incoming unread message from the other participant
  const latestUnreadIncomingMessage = useMemo(() => {
    if (!messagesData?.items || !currentUser) return null;
    for (let i = messagesData.items.length - 1; i >= 0; i--) {
      const msg = messagesData.items[i];
      if (msg.senderUserId !== currentUser.id && msg.status !== "READ") {
        return msg;
      }
    }
    return null;
  }, [messagesData?.items, currentUser]);

  const attemptMarkRead = useCallback(() => {
    if (!selectedConversationId || !currentUser) return;

    // 1. Tab/window must be visible
    if (typeof document !== "undefined" && document.visibilityState !== "visible") {
      return;
    }

    // 2. Identify target message to acknowledge
    let targetMessageId: string | null = null;
    if (latestUnreadIncomingMessage) {
      targetMessageId = latestUnreadIncomingMessage.id;
    } else if (
      activeConversation &&
      activeConversation.unreadCount > 0 &&
      activeConversation.lastMessage &&
      activeConversation.lastMessage.senderUserId !== currentUser.id
    ) {
      targetMessageId = activeConversation.lastMessage.id;
    }

    if (!targetMessageId) return;

    // 3. Deduplicate: must be newer than the last message already acknowledged for this conversation
    const lastAckId = lastAcknowledgedMessageIdRef.current[selectedConversationId];
    if (lastAckId === targetMessageId) {
      return;
    }

    // 4. Request must not already be in flight
    if (readRequestInFlightRef.current) {
      return;
    }

    // Execute edge-triggered read write
    readRequestInFlightRef.current = true;
    const currentConvId = selectedConversationId;
    const msgId = targetMessageId;

    markReadMutation.mutate(
      { conversationId: currentConvId, readThroughMessageId: msgId },
      {
        onSuccess: () => {
          lastAcknowledgedMessageIdRef.current[currentConvId] = msgId;
          readRequestInFlightRef.current = false;
        },
        onError: () => {
          readRequestInFlightRef.current = false;
        },
      }
    );
  }, [selectedConversationId, currentUser, latestUnreadIncomingMessage, activeConversation, markReadMutation]);

  // Edge-triggered: Fires when the newest unread incoming message ID changes
  useEffect(() => {
    attemptMarkRead();
  }, [selectedConversationId, latestUnreadIncomingMessage?.id, attemptMarkRead]);

  // Edge-triggered: Fires when the tab returns to focus/visible
  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        attemptMarkRead();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
    };
  }, [attemptMarkRead]);

  // Send message handler
  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !currentUser) return;

    const clientMessageId = crypto.randomUUID();
    await sendMessageMutation.mutateAsync({
      conversationId: selectedConversationId,
      content,
      clientMessageId,
      senderUserId: currentUser.id,
    });
  };

  const handleRetryMessage = async (failedMessage: MessageDTO) => {
    if (!selectedConversationId || !currentUser) return;

    await sendMessageMutation.mutateAsync({
      conversationId: selectedConversationId,
      content: failedMessage.content,
      clientMessageId: failedMessage.clientMessageId || crypto.randomUUID(),
      senderUserId: currentUser.id,
    });
  };

  const currentUserName =
    currentUser ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() : "Me";

  if (isStudentLocked) {
    return (
      <div className="mx-auto max-w-7xl px-2 sm:px-4 py-4 sm:py-6 h-[calc(100vh-100px)]">
        <div className="h-full rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden flex items-center justify-center">
          <LockedMessagingState />
        </div>
      </div>
    );
  }

  if (!isCounsellorView && (isLoadingAccess || isLoadingConversations)) {
    return (
      <div className="mx-auto max-w-7xl px-2 sm:px-4 py-4 sm:py-6 h-[calc(100vh-100px)]">
        <div className="h-full rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="h-4 w-40 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="h-3 w-64 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-4 py-4 sm:py-6 h-[calc(100vh-100px)]">
      <div className="h-full rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden flex">
        {/* Left: Conversation List */}
        <div
          className={`w-full md:w-[320px] lg:w-[380px] shrink-0 h-full ${
            selectedConversationId ? "hidden md:flex md:flex-col" : "flex flex-col"
          }`}
        >
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={(id) => {
              setManualSelectedId(id);
              setMobileClosed(false);
            }}
            isCounsellorView={isCounsellorView}
            isLoading={isLoadingConversations}
          />
        </div>

        {/* Right: Message Thread & Composer */}
        <div
          className={`flex-1 flex-col h-full ${
            selectedConversationId ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedConversationId && activeConversation ? (
            <>
              <ConversationHeader
                conversation={activeConversation}
                isCounsellorView={isCounsellorView}
                connectionState={connectionState}
                onBackMobile={() => {
                  setMobileClosed(true);
                  setManualSelectedId(null);
                }}
              />

              <MessageThread
                messages={messagesData?.items || []}
                currentUserId={currentUser?.id || ""}
                typingState={typingState}
                onRetry={handleRetryMessage}
                isLoading={isLoadingMessages}
              />

              <MessageComposer
                onSend={handleSendMessage}
                onTyping={() => emitTyping(currentUserName)}
                onStopTyping={emitStopTyping}
                disabled={activeConversation.status === "CLOSED"}
                placeholder={
                  activeConversation.status === "CLOSED"
                    ? "This conversation is closed."
                    : "Type your guidance message..."
                }
              />
            </>
          ) : (
            <EmptyConversationState />
          )}
        </div>
      </div>
    </div>
  );
};
