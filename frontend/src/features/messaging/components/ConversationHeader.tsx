"use client";

import React from "react";
import { ArrowLeft, GraduationCap, ShieldCheck, Wifi, WifiOff } from "lucide-react";
import { ConversationDTO, SocketConnectionState } from "../types/messaging.types";

interface ConversationHeaderProps {
  conversation: ConversationDTO;
  isCounsellorView: boolean;
  connectionState: SocketConnectionState;
  onBackMobile?: () => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
  isCounsellorView,
  connectionState,
  onBackMobile,
}) => {
  // If counsellor is viewing, the partner is the student. If student is viewing, the partner is the counsellor.
  const partnerName = isCounsellorView
    ? conversation.student.fullName
    : conversation.counsellor.fullName;

  const partnerSubtitle = isCounsellorView
    ? conversation.student.email
    : conversation.counsellor.qualification;

  const partnerInitial = (partnerName || "U").charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3 sm:px-5 py-3 select-none">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        {onBackMobile && (
          <button
            type="button"
            onClick={onBackMobile}
            aria-label="Back to conversations list"
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}

        {/* Partner Avatar */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#172B2A] to-[#00BFA5] font-extrabold text-white text-sm shadow-xs">
          {partnerInitial}
          {connectionState === "CONNECTED" && (
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
              title="Online"
            />
          )}
        </div>

        {/* Partner Details */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {partnerName}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
              {isCounsellorView ? (
                <>
                  <GraduationCap className="w-3 h-3 text-indigo-500" />
                  <span>Student</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3 h-3 text-[#00BFA5]" />
                  <span>Career Counsellor</span>
                </>
              )}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
            {partnerSubtitle}
          </div>
        </div>
      </div>

      {/* Connection State Badge */}
      <div className="flex items-center gap-2 shrink-0">
        {connectionState === "CONNECTED" ? (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <Wifi className="w-3.5 h-3.5" />
            <span>Live</span>
          </span>
        ) : connectionState === "RECONNECTING" || connectionState === "CONNECTING" ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500 animate-pulse">
            <Wifi className="w-3.5 h-3.5" />
            <span>Connecting...</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline</span>
          </span>
        )}
      </div>
    </div>
  );
};
