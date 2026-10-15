"use client";

import React from "react";
import { MessageDTO } from "../types/messaging.types";
import { MessageStatus } from "./MessageStatus";
import { RotateCw } from "lucide-react";

interface MessageBubbleProps {
  message: MessageDTO;
  isSelf: boolean;
  onRetry?: (message: MessageDTO) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isSelf,
  onRetry,
}) => {
  const formatTime = (isoString: string): string => {
    try {
      return new Date(isoString).toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "";
    }
  };

  return (
    <div
      className={`flex flex-col group mb-2.5 ${
        isSelf ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] md:max-w-[62%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed break-words whitespace-pre-wrap transition-shadow duration-150 ${
          isSelf
            ? "bg-[#172B2A] dark:bg-[#00BFA5] text-white dark:text-[#172B2A] rounded-br-xs shadow-xs"
            : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs shadow-2xs"
        }`}
      >
        {/* Message Content (Plain Text - strictly XSS safe) */}
        <div>{message.content}</div>

        {/* Timestamp & Status Metadata */}
        <div
          className={`mt-1 flex items-center justify-end gap-1.5 text-[10px] select-none ${
            isSelf
              ? "text-white/70 dark:text-[#172B2A]/70"
              : "text-slate-400 dark:text-slate-400"
          }`}
        >
          <span>{formatTime(message.createdAt)}</span>
          {isSelf && <MessageStatus status={message.status} />}
        </div>
      </div>

      {/* Failed Retry CTA */}
      {isSelf && message.status === "FAILED" && (
        <button
          type="button"
          onClick={() => onRetry?.(message)}
          className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-600 transition"
        >
          <RotateCw className="w-3 h-3" />
          <span>Failed to send. Click to retry</span>
        </button>
      )}
    </div>
  );
};
