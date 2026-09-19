"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { StreamFinderResult } from "../../types/assessment.types";
import { toast } from "@/components/ui/toast";
import { RetakeConfirmationModal } from "../history/RetakeConfirmationModal";
import { useStartRetakeMutation } from "../../hooks/useStartRetakeMutation";

// 10-Page Discovery Architecture Subcomponents
import { StreamFinderHeader } from "./stream-finder/StreamFinderHeader";
import { ReportPageWrapper } from "./stream-finder/ReportPageWrapper";
import { StreamCoverPage } from "./stream-finder/StreamCoverPage";
import { StreamResultHeroCard } from "./stream-finder/StreamResultHeroCard";
import { StreamSpectrumVisual } from "./stream-finder/StreamSpectrumVisual";
import { StreamProfileDimensions } from "./stream-finder/StreamProfileDimensions";
import { StreamWhyResultAppeared } from "./stream-finder/StreamWhyResultAppeared";
import { StreamsWorthExploring } from "./stream-finder/StreamsWorthExploring";
import { StreamCareerExploration } from "./stream-finder/StreamCareerExploration";
import { StreamActionPlanRoadmap } from "./stream-finder/StreamActionPlanRoadmap";
import { StreamOnePageSummary } from "./stream-finder/StreamOnePageSummary";
import { StreamTechnicalAppendix } from "./stream-finder/StreamTechnicalAppendix";

interface StreamFinderResultViewProps {
  result: StreamFinderResult;
  onLanguageChange?: (languageCode: string) => void;
  currentLanguage?: string;
}

export function StreamFinderResultView({
  result,
  onLanguageChange,
  currentLanguage = "en",
}: StreamFinderResultViewProps) {
  const router = useRouter();
  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);
  const startRetakeMutation = useStartRetakeMutation();

  const handleStartRetake = () => {
    startRetakeMutation.mutate(
      { assessmentCode: "stream-finder" },
      {
        onSuccess: () => {
          setIsRetakeModalOpen(false);
          toast.success("New Stream Finder Session Initialized", {
            description: "Questions reset for your fresh milestone evaluation.",
          });
          router.push("/participant/assessments/stream-finder");
        },
        onError: (err) => {
          console.error("Failed to start retake:", err);
          setIsRetakeModalOpen(false);
          toast.info("Resuming Assessment Session", {
            description: "Routing to your assessment questions.",
          });
          router.push("/participant/assessments/stream-finder");
        },
      }
    );
  };

  if (!result || !result.streamScores) {
    return (
      <div className="rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-8 text-center max-w-lg mx-auto space-y-4 my-12">
        <h2 className="text-lg font-bold text-amber-950 dark:text-amber-200">
          Incomplete Stream Finder Result
        </h2>
        <p className="text-xs text-amber-800 dark:text-amber-300">
          This result snapshot is currently being processed or missing required score allocations.
        </p>
      </div>
    );
  }

  const TOTAL_PAGES = 10;

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto select-none-safe print:p-0 print:m-0 print:max-w-none print:space-y-0 print:pb-0">
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          html, body {
            background: white !important;
            color: #172b2a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .report-page-container {
            box-sizing: border-box;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            min-height: 280mm;
            max-height: 280mm;
            height: 280mm;
            overflow: hidden !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .print-page {
            page-break-before: always !important;
            break-before: page !important;
          }
          .print-page-first {
            page-break-before: auto !important;
            break-before: auto !important;
          }
        }
      `}</style>

      {/* Toolbar (Web only) */}
      <StreamFinderHeader
        result={result}
        onOpenRetakeModal={() => setIsRetakeModalOpen(true)}
        onLanguageChange={onLanguageChange}
        currentLanguage={currentLanguage}
      />

      {/* PAGE 1: Publication Cover & Student Dossier */}
      <ReportPageWrapper pageNumber={1} totalPages={TOTAL_PAGES} isFirstPage={true}>
        <StreamCoverPage result={result} />
      </ReportPageWrapper>

      {/* PAGE 2: 01. Your Result (Primary Direction & Secondary Synergy) */}
      <ReportPageWrapper pageNumber={2} totalPages={TOTAL_PAGES}>
        <StreamResultHeroCard result={result} />
      </ReportPageWrapper>

      {/* PAGE 3: 02. Stream Profile Comparison (4-Stream Affinity Spectrum) */}
      <ReportPageWrapper pageNumber={3} totalPages={TOTAL_PAGES}>
        <StreamSpectrumVisual result={result} />
      </ReportPageWrapper>

      {/* PAGE 4: 03. Profile Dimensions & Synthesis (6 Measured Constructs) */}
      <ReportPageWrapper pageNumber={4} totalPages={TOTAL_PAGES}>
        <StreamProfileDimensions result={result} />
      </ReportPageWrapper>

      {/* PAGE 5: 04. Assessment Response Analysis (Observed Response Evidence) */}
      <ReportPageWrapper pageNumber={5} totalPages={TOTAL_PAGES}>
        <StreamWhyResultAppeared result={result} />
      </ReportPageWrapper>

      {/* PAGE 6: 05. Stream Exploration (Primary, Close & Lower Tiers) */}
      <ReportPageWrapper pageNumber={6} totalPages={TOTAL_PAGES}>
        <StreamsWorthExploring result={result} />
      </ReportPageWrapper>

      {/* PAGE 7: 06. Career Exploration (Visual Pathway & Clusters) */}
      <ReportPageWrapper pageNumber={7} totalPages={TOTAL_PAGES}>
        <StreamCareerExploration result={result} />
      </ReportPageWrapper>

      {/* PAGE 8: 07. Journey & Action Plan (6-Stage Lifecycle & 5 Steps) */}
      <ReportPageWrapper pageNumber={8} totalPages={TOTAL_PAGES}>
        <StreamActionPlanRoadmap />
      </ReportPageWrapper>

      {/* PAGE 9: 08. Discovery Snapshot & User Guide (Executive Summary & Guide) */}
      <ReportPageWrapper pageNumber={9} totalPages={TOTAL_PAGES}>
        <StreamOnePageSummary result={result} />
      </ReportPageWrapper>

      {/* PAGE 10: 09. Assessment Details & Technical Appendix (Scoring Audit) */}
      <ReportPageWrapper pageNumber={10} totalPages={TOTAL_PAGES}>
        <StreamTechnicalAppendix result={result} />
      </ReportPageWrapper>

      {/* Footer Disclaimer (Web only) */}
      <footer className="text-center text-[11px] text-[#728B88] dark:text-[#7D9491] space-y-1 pt-6 border-t border-[#E3ECEA] dark:border-white/10 print:hidden">
        <p>
          © {new Date().getFullYear()} 3G MeLife Stream Finder • Senior Secondary Academic Discovery Platform.
        </p>
        <p>
          Non-prescriptive educational orientation designed for informed secondary subject decision-making.
        </p>
      </footer>

      {/* Retake Confirmation Modal */}
      <RetakeConfirmationModal
        isOpen={isRetakeModalOpen}
        onClose={() => setIsRetakeModalOpen(false)}
        onConfirm={handleStartRetake}
        assessmentName="Stream Finder (Secondary Edition)"
        isPending={startRetakeMutation.isPending}
      />
    </div>
  );
}
