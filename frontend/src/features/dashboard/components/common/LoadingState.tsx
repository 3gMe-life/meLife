import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse select-none">
      {/* Page Header Skeleton */}
      <div className="h-16 rounded-2xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5" />

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-3xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5"
          />
        ))}
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 rounded-3xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5" />
        <div className="h-80 rounded-3xl bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/5" />
      </div>
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Failed to load dashboard data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-3xl bg-rose-500/10 dark:bg-rose-950/20 border border-rose-500/20 p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">Data Loading Error</h3>
      <p className="text-xs text-[#526866] dark:text-[#9FB3B0] mb-5 leading-relaxed">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EBF2F0] hover:bg-[#E3ECEA] dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
