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
    <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-xs dark:shadow-none">
      <div className="w-14 h-14 rounded-2xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 flex items-center justify-center text-[#008F83] dark:text-[#00BFA5] mb-4 shadow-inner">
        {icon || <FolderOpen className="w-6 h-6 text-[#00BFA5]" />}
      </div>
      <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">{title}</h3>
      <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed mb-6 max-w-sm">
        {description}
      </p>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="px-5 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-md shadow-[#00BFA5]/25"
        >
          {actionText}
        </Link>
      )}

      {actionText && onActionClick && !actionHref && (
        <button
          type="button"
          onClick={onActionClick}
          className="px-5 py-2.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-md shadow-[#00BFA5]/25 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
