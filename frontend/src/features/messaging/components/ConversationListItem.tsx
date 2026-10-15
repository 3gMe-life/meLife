"use client";

import React from "react";
import { ConversationDTO } from "../types/messaging.types";
import { UnreadBadge } from "./UnreadBadge";

interface ConversationListItemProps {
  conversation: ConversationDTO;
  isSelected: boolean;
  isCounsellorView: boolean;
  onClick: () => void;
}

export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  isSelected,
  isCounsellorView,
  onClick,
}) => {
  const partnerName = isCounsellorView
    ? conversation.student.fullName
    : conversation.counsellor.fullName;

  const partnerInitial = (partnerName || "U").charAt(0).toUpperCase();

  const formatTimestamp = (isoString: string | null): string => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      if (isToday) {
        return date.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      }

      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

      if (isYesterday) return "Yesterday";

      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const snippet = conversation.lastMessage
    ? conversation.lastMessage.content
    : "No messages yet. Tap to start.";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-2xl transition-all duration-150 flex items-center gap-3 cursor-pointer select-none ${
        isSelected
          ? "bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-300 dark:ring-slate-700 shadow-2xs font-semibold"
          : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
      }`}
    >
      {/* Avatar */}
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#172B2A] to-[#00BFA5] font-extrabold text-white text-sm shadow-xs">
        {partnerInitial}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
            {partnerName}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
            {formatTimestamp(conversation.lastMessageAt || conversation.createdAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-xs truncate ${
              conversation.unreadCount > 0
                ? "font-bold text-slate-900 dark:text-white"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {snippet}
          </p>

          <UnreadBadge count={conversation.unreadCount} size="sm" />
        </div>
      </div>
    </button>
  );
};
