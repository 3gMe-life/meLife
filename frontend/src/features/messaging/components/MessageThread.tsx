"use client";

import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { ChevronDown } from "lucide-react";
import { MessageDTO, TypingState } from "../types/messaging.types";
import { MessageBubble } from "./MessageBubble";
import { MessageDateSeparator } from "./MessageDateSeparator";
import { TypingIndicator } from "./TypingIndicator";

interface MessageThreadProps {
  messages: MessageDTO[];
  currentUserId: string;
  typingState: TypingState;
  onRetry?: (message: MessageDTO) => void;
  isLoading?: boolean;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  currentUserId,
  typingState,
  onRetry,
  isLoading = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const isNearBottomRef = useRef(true);

  // Check if near bottom on scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const isNear = distanceFromBottom < 100;
    isNearBottomRef.current = isNear;
    setShowScrollBottom(!isNear);
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
    setShowScrollBottom(false);
  };

  // Scroll to bottom on initial load
  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  // On new messages: auto-scroll only if user was already near bottom
  useEffect(() => {
    if (isNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // Group messages by date string
  const groupedMessages = React.useMemo(() => {
    const groups: { date: string; items: MessageDTO[] }[] = [];
    let currentDate = "";
    let currentGroup: MessageDTO[] = [];

    for (const msg of messages) {
      const msgDate = new Date(msg.createdAt).toDateString();
      if (msgDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, items: currentGroup });
        }
        currentDate = msgDate;
        currentGroup = [msg];
      } else {
        currentGroup.push(msg);
      }
    }

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, items: currentGroup });
    }

    return groups;
  }, [messages]);

  return (
    <div className="relative flex-1 overflow-hidden bg-slate-50/50 dark:bg-slate-950/40">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-4 py-4 custom-scrollbar"
      >
        {isLoading && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            Loading message thread...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400 select-none">
            No messages yet. Send a greeting to initiate your guidance thread!
          </div>
        ) : (
          <>
            {groupedMessages.map((group) => (
              <React.Fragment key={group.date}>
                <MessageDateSeparator dateString={group.date} />
                {group.items.map((msg) => (
                  <MessageBubble
                    key={msg.id || msg.clientMessageId}
                    message={msg}
                    isSelf={msg.senderUserId === currentUserId}
                    onRetry={onRetry}
                  />
                ))}
              </React.Fragment>
            ))}

            {/* Ephemeral Typing Indicator */}
            {typingState.isTyping && (
              <div className="mb-2">
                <TypingIndicator userName={typingState.userName} />
              </div>
            )}

            <div ref={bottomRef} className="h-1" />
          </>
        )}
      </div>

      {/* Floating Jump to Bottom Button */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={() => scrollToBottom("smooth")}
          className="absolute bottom-4 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#172B2A] dark:bg-[#00BFA5] text-white dark:text-[#172B2A] text-xs font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-2 duration-150 cursor-pointer"
        >
          <span>New messages</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
