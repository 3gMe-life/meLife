"use client";

import React from "react";
import { ReportStrengthItem } from "../../types/career-report.types";
import { StrengthsInActionGrid } from "../visual/StrengthsInActionGrid";
import { ScoredDimensionItem } from "../../types/report.types";

interface StrengthAnalysisSectionProps {
  strengths: ReportStrengthItem[];
}

export const StrengthAnalysisSection: React.FC<StrengthAnalysisSectionProps> = ({ strengths }) => {
  const mappedStrengths: ScoredDimensionItem[] = (strengths || []).map((s) => ({
    code: s.dimensionCode || s.name.toUpperCase().replace(/[^A-Z0-9]/g, "_"),
    name: s.name,
    rawScore: s.score,
    maxScore: 100,
    scalePositionPercentage: s.score,
    description: s.whatItMeans,
    level: s.score >= 80 ? "High" : s.score >= 60 ? "Proficient" : "Moderate",
  }));

  return (
    <div id="section-strengths" className="space-y-6">
      <StrengthsInActionGrid
        strengths={mappedStrengths}
        title="Cognitive & Analytical Strengths in Action"
        subtitle="Mapping demonstrated cognitive indicators directly to learning mastery, problem-solving, and career exploration readiness."
      />
    </div>
  );
};
