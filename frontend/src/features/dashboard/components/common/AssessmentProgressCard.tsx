"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, HelpCircle, CheckCircle2, Play, Sparkles, ArrowRight, ShieldCheck, RotateCcw, History } from "lucide-react";
import type { ParticipantAssessmentItem } from "@/features/assessments/types/assessment.types";
import type { AssessmentItem } from "../../types/dashboard.types";
import { useStartRetakeMutation } from "@/features/assessments/hooks/useStartRetakeMutation";
import { RetakeConfirmationModal } from "@/features/assessments/components/history/RetakeConfirmationModal";
import { toast } from "@/components/ui/toast";

export type AssessmentCardItem = (ParticipantAssessmentItem | AssessmentItem) & {
  title?: string;
  name?: string;
  code?: string;
  activeAttemptId?: string | null;
  eligibilityReason?: string;
};

interface AssessmentProgressCardProps {
  assessment: AssessmentCardItem;
}

export function AssessmentProgressCard({ assessment }: AssessmentProgressCardProps) {
  const router = useRouter();
  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);
  const startRetakeMutation = useStartRetakeMutation();

  const isCompleted = assessment.status === "COMPLETED";
  const isInProgress = assessment.status === "IN_PROGRESS";
  const title = assessment.name || assessment.title || "Psychometric Assessment";
  const assessmentCode = assessment.code || assessment.id || "skill-finder";

  const handleStartRetake = () => {
    startRetakeMutation.mutate(
      { assessmentCode },
      {
        onSuccess: () => {
          setIsRetakeModalOpen(false);
          toast.success("New Milestone Initialized", {
            description: `A fresh retake session for "${title}" is ready.`,
          });
          router.push(`/participant/assessments/${assessmentCode}`);
        },
        onError: (err) => {
          console.error("Failed to start retake:", err);
          setIsRetakeModalOpen(false);
          toast.info("Resuming Assessment Session", {
            description: `Routing to "${title}".`,
          });
          router.push(`/participant/assessments/${assessmentCode}`);
        },
      }
    );
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#00C896]/15 text-[#008F83] dark:text-[#00C896] border border-[#00C896]/30">
          <CheckCircle2 className="w-3 h-3" />
          <span>Completed</span>
        </span>
      );
    }
    if (isInProgress) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30">
          <Play className="w-3 h-3 fill-current" />
          <span>In Progress</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF2F0] dark:bg-white/5 text-[#526866] dark:text-[#9FB3B0] border border-[#E3ECEA] dark:border-white/10">
        <span>Available</span>
      </span>
    );
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#172B2A] backdrop-blur-xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] p-5 sm:p-6 flex flex-col justify-between hover:border-[#00BFA5]/50 dark:hover:border-[#00BFA5]/40 shadow-xs dark:shadow-none transition-all duration-300 hover:shadow-lg group">
        <div>
          {/* Top Meta */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF2F0] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#9FB3B0] uppercase tracking-wider">
              {assessment.category}
            </span>
            {getStatusBadge()}
          </div>

          {/* Title & Description */}
          <h3 className="text-base sm:text-lg font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5] transition-colors mb-1.5 line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed mb-3.5 line-clamp-2">
            {assessment.description}
          </p>

          {/* Eligibility Reason Badge */}
          {assessment.eligibilityReason && (
            <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#00BFA5]/10 dark:bg-[#00BFA5]/15 border border-[#00BFA5]/25 text-[11px] font-semibold text-[#008F83] dark:text-[#00BFA5]">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#00BFA5]" />
              <span className="truncate">{assessment.eligibilityReason}</span>
            </div>
          )}

          {/* Details: Duration & Questions */}
          <div className="flex items-center gap-4 text-[11px] text-[#728B88] dark:text-[#7D9491] mb-5">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#00B8D4]" />
              <span>~{assessment.estimatedMinutes} mins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#00BFA5]" />
              <span>{assessment.questionCount} Questions</span>
            </div>
          </div>
        </div>

        {/* Bottom Progress & Action CTA */}
        <div className="pt-4 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] space-y-3">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-[#728B88] dark:text-[#7D9491] mb-1.5">
              <span>Progress</span>
              <span className={isCompleted ? "text-[#008F83] dark:text-[#00C896]" : "text-[#172B2A] dark:text-[#F7FAF9]"}>
                {assessment.progressPercentage}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#EBF2F0] dark:bg-black/30 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted
                    ? "bg-gradient-to-r from-[#00BFA5] to-[#00C896]"
                    : "bg-gradient-to-r from-[#00B8D4] via-[#00BFA5] to-[#00C896]"
                }`}
                style={{ width: `${assessment.progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-2">
            {isCompleted ? (
              <>
                <Link
                  href={
                    assessment.activeAttemptId
                      ? `/participant/results/${assessment.activeAttemptId}`
                      : `/participant/results`
                  }
                  className="w-full py-2.5 px-4 rounded-xl bg-[#EBF2F0] hover:bg-[#E3ECEA] dark:bg-white/5 dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/15 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] transition-colors flex items-center justify-center gap-2 group/btn"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00BFA5]" />
                  <span>Review Psychometric Insights</span>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRetakeModalOpen(true)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#00BFA5]/10 hover:bg-[#00BFA5]/20 border border-[#00BFA5]/25 text-[11px] font-bold text-[#008F83] dark:text-[#00BFA5] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Retake</span>
                  </button>

                  <Link
                    href={`/participant/assessments/history?code=${encodeURIComponent(assessmentCode)}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-surface-muted hover:bg-surface-elevated border border-border-default text-[11px] font-bold text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center gap-1.5"
                  >
                    <History className="w-3 h-3 text-[#00B8D4]" />
                    <span>History</span>
                  </Link>
                </div>
              </>
            ) : isInProgress ? (
              <Link
                href={`/participant/assessments/${assessment.code || assessment.id}`}
                className="w-full py-2.5 px-4 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-md shadow-[#00BFA5]/25 flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href={`/participant/assessments/${assessment.code || assessment.id}`}
                className="w-full py-2.5 px-4 rounded-xl bg-[#EBF2F0] hover:bg-[#E3ECEA] dark:bg-white/10 dark:hover:bg-white/20 border border-[#E3ECEA] dark:border-white/20 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] transition-colors flex items-center justify-center gap-2"
              >
                <span>Start Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <RetakeConfirmationModal
        isOpen={isRetakeModalOpen}
        onClose={() => setIsRetakeModalOpen(false)}
        onConfirm={handleStartRetake}
        isPending={startRetakeMutation.isPending}
        assessmentName={title}
      />
    </>
  );
}

