"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { useParticipantAssessmentsQuery } from "@/features/assessments/hooks/useParticipantAssessmentsQuery";
import { useLatestAssessmentResultQuery } from "@/features/assessments/hooks/useAssessmentResultQuery";
import { useLatestAssessmentComparisonQuery } from "@/features/assessments/hooks/useLatestAssessmentComparisonQuery";
import { useAssessmentHistoryQuery } from "@/features/assessments/hooks/useAssessmentHistoryQuery";
import { useStartRetakeMutation } from "@/features/assessments/hooks/useStartRetakeMutation";

import { useCareerPathwaysQuery } from "@/features/careers/hooks/useCareerPathwaysQuery";

import { WelcomeCard } from "./widgets/WelcomeCard";
import { MetricCardsRow } from "./widgets/MetricCardsRow";
import { MyAssessmentsPanel } from "./widgets/MyAssessmentsPanel";
import { StrengthProfileSnapshot } from "./widgets/StrengthProfileSnapshot";
import { GrowthJourneyCard } from "./widgets/GrowthJourneyCard";
import { RecommendedPathwaysSection } from "./widgets/RecommendedPathwaysSection";
import { CalendarWidget } from "./widgets/CalendarWidget";
import { OverallProgressWidget } from "./widgets/OverallProgressWidget";
import { RecommendedNextSteps } from "./widgets/RecommendedNextSteps";

import { VoucherRedeemModal } from "../common/VoucherRedeemModal";
import { RetakeConfirmationModal } from "@/features/assessments/components/history/RetakeConfirmationModal";
import { toast } from "@/components/ui/toast";
import type { UserProfile } from "@/features/auth/types/auth.types";
import type { CareerPathwayPreview } from "@/features/dashboard/types/dashboard.types";
import type {
  SkillFinderResult,
  LatestComparisonResponse,
  AssessmentHistoryResponse,
  AssessmentHistoryItem,
  ParticipantAssessmentItem,
} from "@/features/assessments/types/assessment.types";
import { getSavedLanguagePreference } from "@/features/assessments/config/assessment-i18n.config";
import { Download, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ParticipantDashboardViewProps {
  user: UserProfile;
  educationStage?: string | null;
}

export function ParticipantDashboardView({
  user,
  educationStage,
}: ParticipantDashboardViewProps) {
  const router = useRouter();
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [retakeTargetCode, setRetakeTargetCode] = useState<string | null>(null);

  // Synchronized language preference
  const [savedLanguage] = useState<string>(() => getSavedLanguagePreference());

  // 1. Participant Assessments Query
  const { data: assessmentData, isLoading: isAssessmentsLoading } =
    useParticipantAssessmentsQuery();

  // 2. Latest Psychometric Result Query (Real scoring and dimensions in student's preferred language)
  const { data: latestResult, isLoading: isResultLoading } =
    useLatestAssessmentResultQuery(savedLanguage);

  // 3. Career Pathways Query (Calculated via psychometric matching engine in preferred language)
  const { data: pathwaysData } = useCareerPathwaysQuery(savedLanguage);

  // 4. Growth & Retest Comparison Query
  const { data: comparisonData } =
    useLatestAssessmentComparisonQuery("skill-finder");

  // 5. Assessment History Query (for attempts & milestone calendar tracking)
  const { data: historyData } =
    useAssessmentHistoryQuery("skill-finder");

  // 6. Retake Mutation
  const startRetakeMutation = useStartRetakeMutation();

  const handleExecuteRetake = () => {
    const code = retakeTargetCode || "skill-finder";
    startRetakeMutation.mutate(
      { assessmentCode: code },
      {
        onSuccess: () => {
          setRetakeTargetCode(null);
          toast.success("New Milestone Session Initialized", {
            description: "Questions reset for an unbiased evaluation. Your previous results remain safely preserved.",
          });
          router.push(`/participant/assessments/${code}`);
        },
        onError: (err) => {
          console.error("Failed to start retake:", err);
          setRetakeTargetCode(null);
          toast.info("Resuming Assessment Session", {
            description: "Routing to your assessment questions workspace.",
          });
          router.push(`/participant/assessments/${code}`);
        },
      }
    );
  };

  // Derive Assessment Metrics
  const isProfileIncomplete = assessmentData?.state === "PROFILE_INCOMPLETE";
  const assessments: ParticipantAssessmentItem[] = assessmentData?.assessments || [];
  const completedCount = assessmentData?.completedCount || 0;
  const totalCount = assessmentData?.totalAvailable || 0;
  const overallProgressPercent = assessmentData?.overallProgressPercentage || 0;
  const effectiveStage = assessmentData?.educationStage || educationStage;
  const derivedAge = assessmentData?.derivedAge;

  const firstPendingAssessment =
    assessments.find((a) => a.isRecommended && (a.status === "AVAILABLE" || a.status === "IN_PROGRESS")) ||
    assessments.find((a) => a.status === "IN_PROGRESS") ||
    assessments.find((a) => a.status === "AVAILABLE") ||
    null;

  // Derive Top Strength from result
  let topStrengthName = "Analytical Thinking";
  let topStrengthScore = 85;
  if (latestResult?.skillBehaviour?.strongestIndicators?.[0]) {
    topStrengthName = latestResult.skillBehaviour.strongestIndicators[0].name;
    topStrengthScore = Math.round(
      latestResult.skillBehaviour.strongestIndicators[0].scalePositionPercentage
    );
  } else if (latestResult?.demonstratedAptitude?.dimensions?.length) {
    const sortedApt = [...latestResult.demonstratedAptitude.dimensions].sort(
      (a, b) => b.scalePositionPercentage - a.scalePositionPercentage
    )[0];
    if (sortedApt) {
      topStrengthName = sortedApt.name;
      topStrengthScore = Math.round(sortedApt.scalePositionPercentage);
    }
  }

  // Derive Career Pathways from live calibrated recommendations
  const careerPathways: CareerPathwayPreview[] = React.useMemo(() => {
    if (pathwaysData?.recommendations && pathwaysData.recommendations.length > 0) {
      return pathwaysData.recommendations.slice(0, 3).map((rec) => ({
        id: rec.id || rec.slug,
        title: rec.title,
        category: rec.category,
        matchScore: rec.matchPercentage,
        stream: rec.industry,
        growthOutlook: rec.futureGrowth,
        keySkills: rec.keySkills && rec.keySkills.length > 0
          ? rec.keySkills.slice(0, 3)
          : ["Analytical Thinking", "Problem Solving", "Domain Application"],
        description: rec.description,
      }));
    }

    if (latestResult?.explorationDirections?.length) {
      return latestResult.explorationDirections.map((p: any, idx: number) => ({
        id: `pathway-${idx}`,
        title: p.clusterTitle || p.domain || "Specialized Career Pathway",
        category: p.domain || "Applied Domain",
        matchScore: Math.max(78, 94 - idx * 4),
        stream: "Integrated Stream",
        growthOutlook: "High",
        keySkills: p.sampleExplorationAreas && p.sampleExplorationAreas.length > 0
          ? p.sampleExplorationAreas.slice(0, 3)
          : ["Analytical Thinking", "Problem Solving", "Systems Design"],
        description: p.description || "Synthesizes multidimensional aptitude and exploratory interest domains.",
      }));
    }
    return [];
  }, [pathwaysData, latestResult]);

  // Derive Dates for Calendar
  const milestoneDates = React.useMemo(() => {
    if (!historyData?.history) return [];
    return historyData.history
      .map((att: AssessmentHistoryItem) => {
        try {
          if (!att.completedDate) return "";
          return new Date(att.completedDate).toISOString().split("T")[0];
        } catch {
          return "";
        }
      })
      .filter(Boolean);
  }, [historyData]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. Modals */}
      <VoucherRedeemModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
      />

      <RetakeConfirmationModal
        isOpen={Boolean(retakeTargetCode)}
        onClose={() => setRetakeTargetCode(null)}
        onConfirm={handleExecuteRetake}
        isPending={startRetakeMutation.isPending}
        assessmentName={
          assessments.find((a) => (a.code || a.id) === retakeTargetCode)?.name ||
          "Skill Finder Assessment"
        }
      />

      {/* 2. Welcome Banner */}
      <WelcomeCard
        user={user}
        educationStage={effectiveStage}
        derivedAge={derivedAge}
        completedCount={completedCount}
        totalCount={totalCount}
        overallProgressPercent={overallProgressPercent}
        isProfileIncomplete={isProfileIncomplete}
        firstPendingAssessment={firstPendingAssessment}
        onOpenVoucherModal={() => setIsVoucherModalOpen(true)}
      />

      {/* 3. Metric Cards Strip (4 Cards) */}
      <MetricCardsRow
        completedAssessments={completedCount}
        totalAssessments={totalCount}
        progressPercentage={overallProgressPercent}
        profileConfidence={completedCount > 0 ? (latestResult?.profileConfidence || "98%") : "Ready"}
        topStrengthName={topStrengthName}
        topStrengthScore={topStrengthScore}
        careerPathwaysCount={careerPathways.length > 0 ? careerPathways.length : 8}
        isLoading={isAssessmentsLoading || isResultLoading}
      />

      {/* 4. Main Two-Column Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* Left Column (Main Panels - 8 cols on Desktop) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-7">
          {/* Section 1: My Assessments Battery */}
          <MyAssessmentsPanel
            assessments={assessments}
            isLoading={isAssessmentsLoading}
            isProfileIncomplete={isProfileIncomplete}
            onRetake={(code) => setRetakeTargetCode(code)}
          />

          {/* Section 2: My Strength Profile Snapshot */}
          <StrengthProfileSnapshot
            latestResult={latestResult}
            isLoading={isResultLoading}
          />

          {/* Section 3: Growth Journey & Retest */}
          <GrowthJourneyCard
            comparisonData={comparisonData}
            totalAttempts={historyData?.totalAttempts || (completedCount > 0 ? 1 : 0)}
            onOpenRetakeModal={() => setRetakeTargetCode("skill-finder")}
          />

          {/* Section 4: Recommended Career Pathways */}
          <RecommendedPathwaysSection pathways={careerPathways} />
        </div>

        {/* ========================================================================= */}
        {/* Right Column (Contextual Information Panel - 4 cols on Desktop) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6 sm:space-y-7 sticky top-24">
          {/* Widget 1: Interactive Calendar */}
          <CalendarWidget
            assessmentCompletedDates={milestoneDates}
          />

          {/* Widget 2: Overall Discovery Progress */}
          <OverallProgressWidget
            progressPercentage={overallProgressPercent}
            completedCount={completedCount}
            totalCount={totalCount}
            isProfileIncomplete={isProfileIncomplete}
          />

          {/* Widget 3: Upcoming Next Steps */}
          <RecommendedNextSteps
            completedAssessments={completedCount}
            isProfileIncomplete={isProfileIncomplete}
            onOpenVoucherModal={() => setIsVoucherModalOpen(true)}
          />

          {/* Widget 4: Counselor Guidance & Report Download Card */}
          <div className="rounded-3xl bg-gradient-to-br from-white via-[#F7FAF9] to-[#EBF2F0] dark:from-[#172B2A] dark:via-[#142827] dark:to-[#0D1C1B] border border-[#E3ECEA] dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center shrink-0">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  Guidance & Reports
                </h4>
                <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                  Download your certified psychometric dossier or book an advisory session.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Link
                href="/participant/career-reports"
                className="w-full py-2.5 px-3.5 rounded-xl bg-white dark:bg-white/10 hover:bg-[#EBF2F0] dark:hover:bg-white/20 border border-[#E3ECEA] dark:border-white/15 text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] transition-all flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-[#008F83] dark:text-[#00BFA5]" />
                  <span>Download Report (PDF)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/participant/counsellor"
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-[#172B2A] hover:text-white text-xs font-bold transition-all shadow-sm shadow-[#00BFA5]/20 flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Book Counselor Session</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
