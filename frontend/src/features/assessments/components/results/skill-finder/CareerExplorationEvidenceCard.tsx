"use client";

import React from "react";
import { Compass, CheckCircle2, AlertCircle } from "lucide-react";
import { ExplorationDirection } from "../../../types/assessment.types";

interface CareerExplorationEvidenceCardProps {
  direction: ExplorationDirection;
  index: number;
  topSkillName?: string;
  accuracyPercentage?: number;
  className?: string;
}

export function CareerExplorationEvidenceCard({
  direction,
  index,
  topSkillName = "Practical & Technical Dexterity",
  accuracyPercentage = 50,
  className = "",
}: CareerExplorationEvidenceCardProps) {
  // Derive status badge transparently from real available data
  let statusBadge = "Worth Exploring";
  let badgeStyle = "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/30";

  if (accuracyPercentage >= 70) {
    statusBadge = "Strong Supporting Evidence";
    badgeStyle = "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
  } else if (accuracyPercentage < 45) {
    statusBadge = "Worth Exploring — More Task Evidence Needed";
    badgeStyle = "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30";
  }

  return (
    <div
      className={`rounded-3xl bg-surface-elevated border border-border-default p-6 sm:p-7 shadow-sm space-y-5 transition-all hover:border-[#00BFA5]/40 print:p-5 print:rounded-2xl print:border-[#E3ECEA] print:shadow-none print-break-avoid ${className}`}
    >
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-default pb-4">
        <div className="flex items-start sm:items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-[#00BFA5] text-[#172B2A] font-black text-sm flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <div>
            <h4 className="text-base sm:text-lg font-black text-text-primary tracking-tight">
              {direction.clusterTitle}
            </h4>
            <span className="text-xs font-semibold text-[#008F83] dark:text-[#00BFA5]">
              Primary Domain: {direction.domain}
            </span>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold border self-start sm:self-auto ${badgeStyle}`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{statusBadge}</span>
        </span>
      </div>

      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
        {direction.description}
      </p>

      {/* 3-Column Evidence Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* 1. Why This Appears */}
        <div className="p-3.5 rounded-2xl bg-surface-muted/60 border border-border-default space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5]">
            <Compass className="w-3.5 h-3.5" />
            <span>Why This Appears</span>
          </div>
          <p className="text-xs text-text-secondary leading-snug">
            Strong vocational interest alignment in <strong>{direction.domain}</strong> environments.
          </p>
        </div>

        {/* 2. Supporting Behaviour Evidence */}
        <div className="p-3.5 rounded-2xl bg-surface-muted/60 border border-border-default space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Supporting Behaviour</span>
          </div>
          <p className="text-xs text-text-secondary leading-snug">
            Reinforced by self-reported habits in <strong>{topSkillName}</strong>.
          </p>
        </div>

        {/* 3. Evidence to Strengthen / Validate Next */}
        <div className="p-3.5 rounded-2xl bg-surface-muted/60 border border-border-default space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>What to Validate Next</span>
          </div>
          <p className="text-xs text-text-secondary leading-snug">
            Build hands-on task performance and problem-solving experience through starter projects.
          </p>
        </div>
      </div>

      {/* Sample Areas & Hands-on Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div className="bg-surface-muted/40 p-4 rounded-2xl border border-border-default space-y-2">
          <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
            <span>🔍</span> Sample Exploration Areas:
          </span>
          <ul className="space-y-1.5 text-xs text-text-secondary list-disc list-inside">
            {(direction.sampleExplorationAreas || []).map((area, aIdx) => (
              <li key={aIdx} className="leading-snug">
                {area}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface-muted/40 p-4 rounded-2xl border border-border-default space-y-2">
          <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
            <span>🚀</span> Hands-on Projects to Try Next:
          </span>
          <ul className="space-y-1.5 text-xs text-text-secondary list-disc list-inside">
            {(direction.suggestedActivities || []).map((act, actIdx) => (
              <li key={actIdx} className="leading-snug">
                {act}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
