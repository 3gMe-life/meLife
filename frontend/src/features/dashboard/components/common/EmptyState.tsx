import React from "react";
import Link from "next/link";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
  icon,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-xs dark:shadow-none">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 mb-4 shadow-inner">
        {icon || <FolderOpen className="w-6 h-6 text-[#14B8A6]" />}
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{title}</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-sm">
        {description}
      </p>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors shadow-md shadow-[#2563EB]/25"
        >
          {actionText}
        </Link>
      )}

      {actionText && onActionClick && !actionHref && (
        <button
          type="button"
          onClick={onActionClick}
          className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors shadow-md shadow-[#2563EB]/25 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
