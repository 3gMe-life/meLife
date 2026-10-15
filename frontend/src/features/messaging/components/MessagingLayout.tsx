"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import {
  useConversations,
  useConversation,
  useMessages,
  useSendMessage,
  useMarkConversationRead,
  useCreateConversation,
} from "../hooks/useMessagingQueries";
import { useMessagingSocket } from "../hooks/useMessagingSocket";
import { ConversationList } from "./ConversationList";
import { ConversationHeader } from "./ConversationHeader";
import { MessageThread } from "./MessageThread";
import { MessageComposer } from "./MessageComposer";
import { EmptyConversationState } from "./EmptyConversationState";
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
    } else if (paramCounsellorId && !isCounsellorView && !conversations.some((c) => c.counsellorId === paramCounsellorId)) {
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
    conversations,
    createConversationMutation,
  ]);

  // Mark messages as read when active conversation changes or new unread messages arrive
  useEffect(() => {
    if (selectedConversationId && activeConversation && activeConversation.unreadCount > 0) {
      markReadMutation.mutate(selectedConversationId);
    }
  }, [selectedConversationId, activeConversation, markReadMutation]);

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
