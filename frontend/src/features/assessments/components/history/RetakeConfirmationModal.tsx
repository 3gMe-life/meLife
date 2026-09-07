"use client";

import React from "react";
import { Sparkles, ShieldCheck, Play, X, RotateCcw, TrendingUp, HelpCircle } from "lucide-react";

interface RetakeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  assessmentName?: string;
}

export function RetakeConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
  assessmentName = "Skill Finder Assessment",
}: RetakeConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172B2A]/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] p-6 sm:p-8 shadow-2xl text-[#172B2A] dark:text-[#F7FAF9] animate-in zoom-in-95 duration-200 overflow-hidden space-y-6">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#00BFA5]/15 dark:bg-[#00BFA5]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#728B88] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] text-[#172B2A] flex items-center justify-center shadow-md shadow-[#00BFA5]/20 shrink-0">
            <RotateCcw className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="space-y-1 pr-6">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00BFA5]/10 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/25 text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#00BFA5]" />
              <span>Longitudinal Growth Evaluation</span>
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
              Retake {assessmentName}?
            </h3>

            <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
              Start a fresh evaluation milestone to track your skill evolution over time.
            </p>
          </div>
        </div>

        {/* Information Guarantee Cards */}
        <div className="space-y-3 text-xs sm:text-sm">
          {/* Item 1 */}
          <div className="rounded-2xl p-4 bg-[#F7FAF9] dark:bg-[#0D1C1B]/80 border border-[#E3ECEA] dark:border-white/10 flex items-start gap-3.5 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#172B2A] dark:text-[#F7FAF9] text-xs sm:text-sm">
                Previous Results Are Fully Preserved
              </h4>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed mt-0.5">
                Your past scores, reports, and career pathway recommendations remain permanently saved in your History ledger.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="rounded-2xl p-4 bg-[#F7FAF9] dark:bg-[#0D1C1B]/80 border border-[#E3ECEA] dark:border-white/10 flex items-start gap-3.5 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-[#00B8D4]/10 text-[#008F83] dark:text-[#00B8D4] border border-[#00B8D4]/20 flex items-center justify-center shrink-0 mt-0.5">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#172B2A] dark:text-[#F7FAF9] text-xs sm:text-sm">
                Fresh, Unbiased Evaluation Session
              </h4>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed mt-0.5">
                You will receive a clean session with questions reset to capture your current developmental snapshot.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="rounded-2xl p-4 bg-gradient-to-r from-[#00BFA5]/10 via-[#00BFA5]/5 to-transparent border border-[#00BFA5]/25 flex items-start gap-3.5 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-[#00BFA5]/20 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30 flex items-center justify-center shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#172B2A] dark:text-[#F7FAF9] text-xs sm:text-sm flex items-center gap-1.5">
                <span>Unlock Longitudinal Growth Tracking</span>
                <span className="px-1.5 py-0.2 rounded-md bg-[#00BFA5]/20 text-[9px] font-black text-[#008F83] dark:text-[#00BFA5]">
                  NEW
                </span>
              </h4>
              <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed mt-0.5">
                Upon completion, the system compares your attempts side-by-side to highlight skill gains and evolving interests.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-5 py-2.5 rounded-xl bg-[#EBF2F0] hover:bg-[#E3ECEA] dark:bg-white/5 dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/15 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00BFA5] to-[#00C896] hover:opacity-95 text-[#172B2A] font-extrabold text-xs shadow-lg shadow-[#00BFA5]/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-[#172B2A] border-t-transparent rounded-full animate-spin" />
                <span>Initializing Attempt...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Confirm & Begin Retake</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
