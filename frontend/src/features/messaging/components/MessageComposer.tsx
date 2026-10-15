"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

interface MessageComposerProps {
  onSend: (content: string) => Promise<void>;
  onTyping?: () => void;
  onStopTyping?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSend,
  onTyping,
  onStopTyping,
  disabled = false,
  placeholder = "Type your message... (Press Enter to send, Shift+Enter for new line)",
}) => {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [content]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 4000) {
      setContent(text);

      // Typing indication with 2s debounce
      if (onTyping) {
        onTyping();
        if (typingTimerRef.current) {
          clearTimeout(typingTimerRef.current);
        }
        typingTimerRef.current = setTimeout(() => {
          onStopTyping?.();
        }, 2000);
      }
    }
  };

  const handleSend = async () => {
    const trimmed = content.trim();
    if (!trimmed || isSending || disabled) return;

    try {
      setIsSending(true);
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      onStopTyping?.();

      await onSend(trimmed);
      setContent("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.focus();
      }
    } finally {
      setIsSending(false);
    }
  };

  const canSend = content.trim().length > 0 && !isSending && !disabled;

  return (
    <div className="relative border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-4">
      <div className="flex items-end gap-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 p-1.5 focus-within:border-[#00BFA5] focus-within:ring-2 focus-within:ring-[#00BFA5]/20 transition-all duration-200">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSending}
          placeholder={placeholder}
          rows={1}
          aria-label="Message text"
          className="flex-1 max-h-[140px] min-h-[38px] resize-none bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none custom-scrollbar"
        />

        <div className="flex items-center gap-1.5 pb-1 pr-1 shrink-0">
          {content.length > 3000 && (
            <span
              className={`text-[10px] font-semibold ${
                content.length >= 3900 ? "text-rose-500" : "text-slate-400"
              }`}
            >
              {4000 - content.length}
            </span>
          )}

          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#172B2A] dark:bg-[#00BFA5] text-white dark:text-[#172B2A] shadow-xs hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFA5]"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-slate-400 select-none">
        <span>ME LIFE messaging is intended for educational & career guidance.</span>
        <span>Enter ↵ to send</span>
      </div>
    </div>
  );
};
