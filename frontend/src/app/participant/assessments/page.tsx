"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { PageHeader } from "@/features/dashboard/components/common/PageHeader";
import { AssessmentProgressCard } from "@/features/dashboard/components/common/AssessmentProgressCard";
import { VoucherRedeemModal } from "@/features/dashboard/components/common/VoucherRedeemModal";
import { KeyRound } from "lucide-react";
import type { AssessmentItem } from "@/features/dashboard/types/dashboard.types";

const ALL_ASSESSMENTS: AssessmentItem[] = [
  {
    id: "personality-big-five",
    code: "MELIFE-P1",
    title: "Personality Dimensions & Temperament",
    category: "Psychometrics",
    description: "Evaluates the Big Five personality traits, behavioral instincts, emotional balance, and natural work styles.",
    estimatedMinutes: 15,
    questionCount: 40,
    status: "COMPLETED",
    progressPercentage: 100,
    completedAt: "2026-08-28",
  },
  {
    id: "cognitive-aptitude",
    code: "MELIFE-A1",
    title: "Cognitive Aptitude & Logical Reasoning",
    category: "Aptitude",
    description: "Measures abstract logic, spatial reasoning, numerical fluency, pattern deduction, and problem solving speed.",
    estimatedMinutes: 25,
    questionCount: 30,
    status: "COMPLETED",
    progressPercentage: 100,
    completedAt: "2026-08-30",
  },
  {
    id: "career-interest-riasec",
    code: "MELIFE-I1",
    title: "Career Interest Inventory (RIASEC)",
    category: "Vocational",
    description: "Maps vocational affinity across Realistic, Investigative, Artistic, Social, Enterprising, and Conventional domains.",
    estimatedMinutes: 20,
    questionCount: 48,
    status: "IN_PROGRESS",
    progressPercentage: 45,
  },
  {
    id: "eq-work-styles",
    code: "MELIFE-E1",
    title: "Emotional Intelligence & Workplace Dynamics",
    category: "Interpersonal",
    description: "Assesses situational judgment, empathetic collaboration, interpersonal communication, and stress management.",
    estimatedMinutes: 15,
    questionCount: 35,
    status: "NOT_STARTED",
    progressPercentage: 0,
  },
];

export default function ParticipantAssessmentsPage() {
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "COMPLETED" | "PENDING">("ALL");

  const filteredAssessments = ALL_ASSESSMENTS.filter((a) => {
    if (filter === "COMPLETED") return a.status === "COMPLETED";
    if (filter === "PENDING") return a.status !== "COMPLETED";
    return true;
  });

  return (
    <DashboardShell allowedRoles={["PARTICIPANT"]}>
      <VoucherRedeemModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
      />

      <div className="space-y-6">
        <PageHeader
          title="Psychometric Assessments"
          subtitle="Complete your validated assessments to generate your multi-dimensional career pathway and subject stream recommendations."
          badge="4 Modules"
          actionElement={
            <button
              type="button"
              onClick={() => setIsVoucherModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#2563EB]/10 dark:bg-gradient-to-r dark:from-[#2563EB]/20 dark:to-[#14B8A6]/20 hover:bg-[#2563EB]/20 dark:hover:from-[#2563EB]/30 dark:hover:to-[#14B8A6]/30 border border-[#2563EB]/20 dark:border-[#2563EB]/30 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <KeyRound className="w-4 h-4 text-[#14B8A6]" />
              <span>Redeem Assessment Code</span>
            </button>
          }
        />

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(["ALL", "PENDING", "COMPLETED"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                filter === f
                  ? "bg-[#2563EB] text-white shadow-sm shadow-[#2563EB]/25"
                  : "bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
              }`}
            >
              {f === "ALL" ? "All Assessments (4)" : f === "PENDING" ? "Pending (2)" : "Completed (2)"}
            </button>
          ))}
        </div>

        {/* Assessments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssessments.map((assessment) => (
            <AssessmentProgressCard key={assessment.id} assessment={assessment} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
