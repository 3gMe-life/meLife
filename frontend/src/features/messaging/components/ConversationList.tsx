"use client";

import React, { useState, useMemo } from "react";
import { Search, MessageSquare, Loader2 } from "lucide-react";
import { ConversationDTO } from "../types/messaging.types";
import { ConversationListItem } from "./ConversationListItem";

interface ConversationListProps {
  conversations: ConversationDTO[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  isCounsellorView: boolean;
  isLoading?: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isCounsellorView,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase().trim();

    return conversations.filter((c) => {
      const partnerName = (
        isCounsellorView ? c.student.fullName : c.counsellor.fullName
      ).toLowerCase();
      const partnerEmail = (
        isCounsellorView ? c.student.email : c.counsellor.email
      ).toLowerCase();
      const qualification = isCounsellorView
        ? ""
        : (c.counsellor.qualification || "").toLowerCase();
      const lastMsg = (c.lastMessage?.content || "").toLowerCase();

      return (
        partnerName.includes(q) ||
        partnerEmail.includes(q) ||
        qualification.includes(q) ||
        lastMsg.includes(q)
      );
    });
  }, [conversations, searchQuery, isCounsellorView]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800">
      {/* Header & Search */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#00BFA5]" />
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white">
              Messages
            </h1>
          </div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {conversations.length} {conversations.length === 1 ? "thread" : "threads"}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isCounsellorView
                ? "Search students by name..."
                : "Search counsellors by name..."
            }
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#00BFA5] focus:ring-2 focus:ring-[#00BFA5]/20 transition"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#00BFA5]" />
            <span className="text-xs">Loading conversations...</span>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            {searchQuery
              ? "No conversations match your search query."
              : isCounsellorView
              ? "No student conversations yet. Students with confirmed guidance sessions will appear here."
              : "No active conversations. Book a session with an approved counsellor to start messaging."}
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <ConversationListItem
              key={conv.id}
              conversation={conv}
              isSelected={conv.id === selectedConversationId}
              isCounsellorView={isCounsellorView}
              onClick={() => onSelectConversation(conv.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
