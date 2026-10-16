"use client";

import React from "react";
import Link from "next/link";
import {
  Lock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

export const LockedMessagingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[520px] h-full w-full p-6 sm:p-12 text-center select-none bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 dark:from-slate-900/40 dark:via-slate-900 dark:to-slate-950/40">
      {/* Padlock glowing badge */}
      <div className="relative mb-6">
        <div className="absolute -inset-2 rounded-3xl bg-amber-500/20 blur-xl dark:bg-amber-500/10" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/60 shadow-lg shadow-amber-500/10">
          <Lock className="h-10 w-10 stroke-[2]" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-amber-400 border-2 border-white dark:border-slate-900 shadow-sm">
          <Clock className="h-4 w-4" />
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
        Messages
      </h2>

      <p className="mt-2 text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300 max-w-lg">
        Chat becomes available after a counsellor accepts your session request.
      </p>

      {/* Supporting Text */}
      <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
        Once your counselling request is accepted, you can communicate securely with your counsellor here.
      </p>

      {/* Interactive Workflow Explainer Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl text-left">
        <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-850/80 shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 text-[11px] font-black text-indigo-600 dark:text-indigo-400">
              1
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Request Session
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Choose a certified counsellor and pick a guidance slot.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl border border-amber-200/80 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900 text-[11px] font-black text-amber-700 dark:text-amber-300">
              2
            </span>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-200">
              Status: Pending
            </span>
          </div>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80 leading-snug">
            Chat remains locked while the counsellor reviews your request.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
              Accepted
            </span>
          </div>
          <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 leading-snug">
            Session is confirmed and your private chat unlocks instantly.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/participant/counsellor?tab=my-sessions"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
        >
          <Calendar className="h-4 w-4" />
          <span>View Counsellor Sessions</span>
          <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
        </Link>
      </div>

      {/* Privacy guarantee note */}
      <div className="mt-6 flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
        <Sparkles className="h-3 w-3 text-indigo-400" />
        <span>Verified student-counsellor privacy and safety architecture</span>
      </div>
    </div>
  );
};
