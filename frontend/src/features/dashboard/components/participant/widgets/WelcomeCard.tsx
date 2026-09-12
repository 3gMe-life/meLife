"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Play,
  ArrowRight,
  BookOpen,
  KeyRound,
  ShieldCheck,
  Sparkles,
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
      .replace("college", "Higher Ed")
      .replace("_", " ")
      .toUpperCase();
  };

  const displayName = user.firstName || "Student";

  return (
    <section
      aria-label="Welcome and assessment overview"
      className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#172B2A]/90 border border-[#E3ECEA] dark:border-white/10 p-5 sm:p-6 lg:p-7 shadow-xs transition-all duration-300"
    >
      {/* Subtle Ambient Light Accents */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gradient-to-br from-[#00BFA5]/10 via-[#00B8D4]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-gradient-to-tr from-[#00C896]/8 to-transparent blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Personalized Greeting & Context */}
        <div className="space-y-2 flex-1 min-w-0">
          {/* Eyebrow Label & Badges */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5]">
              Your Dashboard
            </span>

            {educationStage && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF2F0] dark:bg-white/8 text-[#526866] dark:text-[#9FB3B0] border border-[#E3ECEA] dark:border-white/10">
                <GraduationCap className="w-3.5 h-3.5 text-[#00B8D4]" />
                <span>{formatStage(educationStage)}</span>
              </span>
            )}

            {derivedAge !== null && derivedAge !== undefined && (
              <span className="text-xs text-[#728B88] dark:text-[#7D9491] font-medium">
                • Age {derivedAge}
              </span>
            )}

            {completedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{completedCount} Evaluated</span>
              </span>
            )}
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B2A] dark:text-[#F7FAF9] tracking-tight leading-tight">
            {getGreeting()}, {displayName}! 👋
          </h1>

          {/* Short Supporting Sentence */}
          <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] leading-relaxed max-w-xl">
            {completedCount > 0 ? (
              <>
                Explore your strengths and plan your next step. Your discovery is{" "}
                <strong className="text-[#172B2A] dark:text-[#F7FAF9] font-bold">
                  {overallProgressPercent}% calibrated
                </strong>.
              </>
            ) : isProfileIncomplete ? (
              "Complete your calibration to unlock your customized assessment battery."
            ) : (
              "Explore your strengths and plan your next step."
            )}
          </p>
        </div>

        {/* Right: Compact Assessment Panel */}
        <div className="rounded-2xl bg-[#F7FAF9] dark:bg-white/[0.04] border border-[#E3ECEA] dark:border-white/10 p-4 sm:p-4.5 flex flex-col justify-between gap-3 w-full lg:w-80 shrink-0 shadow-2xs">
          {firstPendingAssessment ? (
            <>
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    firstPendingAssessment.status === "IN_PROGRESS"
                      ? "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30"
                      : firstPendingAssessment.isRecommended
                      ? "bg-gradient-to-r from-[#00BFA5]/25 to-[#00B8D4]/25 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/40"
                      : "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30"
                  }`}>
                    {firstPendingAssessment.status === "IN_PROGRESS" ? (
                      <span>In Progress</span>
                    ) : firstPendingAssessment.isRecommended ? (
                      <>
                        <Sparkles className="w-2.5 h-2.5 fill-current text-[#00BFA5]" />
                        <span>Recommended</span>
                      </>
                    ) : (
                      <span>Next Module</span>
                    )}
                  </span>
                  <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                    {firstPendingAssessment.progressPercentage}%
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9] truncate">
                  {firstPendingAssessment.name}
                </h3>
                {firstPendingAssessment.recommendationReason && firstPendingAssessment.status !== "IN_PROGRESS" && (
                  <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] truncate mt-0.5">
                    {firstPendingAssessment.recommendationReason}
                  </p>
                )}
                {/* Progress Bar */}
                <div className="w-full bg-[#E3ECEA] dark:bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896] h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(4, firstPendingAssessment.progressPercentage)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  href={`/participant/assessments/${firstPendingAssessment.code || firstPendingAssessment.id}`}
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm shadow-[#00BFA5]/20 active:scale-[0.98]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {firstPendingAssessment.status === "IN_PROGRESS"
                      ? `Resume (${firstPendingAssessment.progressPercentage}%)`
                      : firstPendingAssessment.isRecommended
                      ? "Start recommended"
                      : "Start assessment"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={onOpenVoucherModal}
                  className="p-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-[#EBF2F0] dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-[#526866] hover:text-[#172B2A] dark:text-[#9FB3B0] dark:hover:text-white transition-colors cursor-pointer"
                  title="Redeem Voucher Code"
                  aria-label="Redeem Voucher Code"
                >
                  <KeyRound className="w-4 h-4 text-[#00B8D4]" />
                </button>
              </div>
            </>
          ) : isProfileIncomplete ? (
            <>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                  Setup Required
                </span>
                <h3 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9] mt-1.5 truncate">
                  Student Calibration
                </h3>
                <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] mt-0.5 line-clamp-2">
                  Configure your grade & age calibration to access modules.
                </p>
              </div>
              <Link
                href="/participant/onboarding"
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm shadow-[#00BFA5]/20 active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Complete setup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          ) : completedCount > 0 ? (
            <>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  Evaluated
                </span>
                <h3 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9] mt-1.5 truncate">
                  Psychometric Profile Active
                </h3>
                <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] mt-0.5 line-clamp-2">
                  Review your strengths and explore matched career pathways.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Link
                  href="/participant/results"
                  className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm shadow-[#00BFA5]/20 active:scale-[0.98]"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={onOpenVoucherModal}
                  className="p-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-[#EBF2F0] dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-[#526866] hover:text-[#172B2A] dark:text-[#9FB3B0] dark:hover:text-white transition-colors cursor-pointer"
                  title="Redeem Voucher Code"
                  aria-label="Redeem Voucher Code"
                >
                  <KeyRound className="w-4 h-4 text-[#00B8D4]" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30">
                  Access Code
                </span>
                <h3 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9] mt-1.5 truncate">
                  Unlock Modules
                </h3>
                <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] mt-0.5 line-clamp-2">
                  Redeem your school or organization voucher to begin.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenVoucherModal}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm shadow-[#00BFA5]/20 active:scale-[0.98] cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Redeem Code</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
