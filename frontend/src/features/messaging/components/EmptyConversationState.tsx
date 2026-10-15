"use client";

import React from "react";
import { MessageSquare, ShieldCheck } from "lucide-react";

interface EmptyConversationStateProps {
  title?: string;
  description?: string;
}

export const EmptyConversationState: React.FC<EmptyConversationStateProps> = ({
  title = "Select a Conversation",
  description = "Choose a counselling conversation from the list to view your guidance messages and mentorship threads.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50/50 dark:bg-slate-900/50 select-none">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-xs mb-4">
        <MessageSquare className="h-8 w-8 stroke-[1.75]" />
      </div>

      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1.5">
        {title}
      </h3>

      <p className="max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        {description}
      </p>

      <div className="mt-6 flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
        <ShieldCheck className="h-3.5 w-3.5 text-[#00BFA5]" />
        <span>End-to-end verified counselling relationships</span>
      </div>
    </div>
  );
};
