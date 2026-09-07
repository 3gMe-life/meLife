"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  GraduationCap,
  Play,
  ArrowRight,
  BookOpen,
  KeyRound,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import type { UserProfile } from "@/features/auth/types/auth.types";
import type { ParticipantAssessmentItem } from "@/features/assessments/types/assessment.types";

interface WelcomeCardProps {
  user: UserProfile;
  educationStage?: string | null;
  derivedAge?: number | null;
  completedCount: number;
  totalCount: number;
  overallProgressPercent: number;
  isProfileIncomplete: boolean;
  firstPendingAssessment?: ParticipantAssessmentItem | null;
  onOpenVoucherModal: () => void;
}

export function WelcomeCard({
  user,
  educationStage,
  derivedAge,
  completedCount,
  totalCount,
  overallProgressPercent,
  isProfileIncomplete,
  firstPendingAssessment,
  onOpenVoucherModal,
}: WelcomeCardProps) {
  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatStage = (s?: string | null) => {
    if (!s) return "Student Profile";
    return s
      .replace("grade_", "Class ")
      .replace("college", "College / University")
      .replace("_", " ")
      .toUpperCase();
  };

  const displayName = user.firstName || "Student";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#F7FAF9] to-[#EBF2F0] dark:from-[#172B2A] dark:via-[#142827] dark:to-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-300">
      {/* Background Soft Ambient Light Blurs */}
      <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#00BFA5]/15 dark:from-[#00BFA5]/25 via-[#00B8D4]/10 dark:via-[#00B8D4]/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 left-1/4 w-64 h-64 rounded-full bg-gradient-to-tr from-[#00C896]/10 dark:from-[#00C896]/15 to-transparent blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Info Column */}
        <div className="space-y-3 max-w-2xl">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3G MeLife Student Portal</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 dark:bg-white/5 text-[#526866] dark:text-[#9FB3B0] border border-[#E3ECEA] dark:border-white/10">
              <GraduationCap className="w-3.5 h-3.5 text-[#00B8D4]" />
              <span>{formatStage(educationStage)}</span>
            </span>

            {derivedAge !== null && derivedAge !== undefined && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/80 dark:bg-white/5 text-[#008F83] dark:text-[#00BFA5] border border-[#E3ECEA] dark:border-white/10">
                Age: {derivedAge} yrs
              </span>
            )}

            {completedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{completedCount} Evaluated</span>
              </span>
            )}
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight leading-tight">
            {getGreeting()}, {displayName}! 👋
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
            {completedCount > 0 ? (
              <>
                Your multidimensional career discovery is <strong className="text-[#172B2A] dark:text-[#F7FAF9] font-bold">{overallProgressPercent}% calibrated</strong>. Review your strengths, explore aligned career pathways, or generate your official guidance report.
              </>
            ) : isProfileIncomplete ? (
              <>
                Please complete your student profile calibration to unlock your customized psychometric assessment battery and career matches.
              </>
            ) : (
              <>
                Discover your natural cognitive strengths, exploratory interests, and durable learning habits to guide your future academic roadmap.
              </>
            )}
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenVoucherModal}
            className="px-4 py-3 rounded-2xl bg-white dark:bg-white/5 hover:bg-[#EBF2F0] dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/15 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
          >
            <KeyRound className="w-4 h-4 text-[#00B8D4]" />
            <span>Redeem Code</span>
          </button>

          {firstPendingAssessment ? (
            <Link
              href={`/participant/assessments/${firstPendingAssessment.code || firstPendingAssessment.id}`}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] hover:opacity-95 text-[#172B2A] text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#00BFA5]/25 active:scale-98"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {firstPendingAssessment.status === "IN_PROGRESS"
                  ? `Resume (${firstPendingAssessment.progressPercentage}%)`
                  : "Start Assessment"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : isProfileIncomplete ? (
            <Link
              href="/participant/onboarding"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] hover:opacity-95 text-[#172B2A] text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#00BFA5]/25 active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Complete Setup</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/participant/results"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] hover:opacity-95 text-[#172B2A] text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#00BFA5]/25 active:scale-98"
            >
              <BookOpen className="w-4 h-4" />
              <span>View My Results</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
