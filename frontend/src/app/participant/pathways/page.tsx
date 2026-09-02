"use client";

import React from "react";
import { DashboardShell } from "@/features/dashboard/components/shell/DashboardShell";
import { PageHeader } from "@/features/dashboard/components/common/PageHeader";
import { CareerPathwayCard } from "@/features/dashboard/components/common/CareerPathwayCard";
import type { CareerPathwayPreview } from "@/features/dashboard/types/dashboard.types";

const ALL_PATHWAYS: CareerPathwayPreview[] = [
  {
    id: "ai-systems-architect",
    title: "AI & Machine Learning Architect",
    category: "Computational Technology",
    matchScore: 94,
    stream: "STEM / Advanced Computing",
    growthOutlook: "Very High",
    keySkills: ["Neural Architectures", "Discrete Math", "Systems Thinking", "Python/Rust"],
    description: "Designs, trains, and deploys intelligent models for autonomous systems, generative reasoning, and scientific discovery.",
  },
  {
    id: "biomedical-data-scientist",
    title: "Biomedical Data Scientist",
    category: "Bio-Informatics",
    matchScore: 89,
    stream: "Applied Biology & Analytics",
    growthOutlook: "High",
    keySkills: ["Genomic Data", "Statistical Inference", "Clinical Research", "Bio-Computing"],
    description: "Applies high-throughput computational analytics to accelerate therapeutic development, oncology genomics, and precision medicine.",
  },
  {
    id: "quantitative-economic-strategist",
    title: "Quantitative Economic Strategist",
    category: "Financial Technology",
    matchScore: 86,
    stream: "Mathematics & Economics",
    growthOutlook: "High",
    keySkills: ["Algorithmic Modeling", "Econometrics", "Risk Analysis", "Game Theory"],
    description: "Formulates predictive econometric models, algorithmic market structures, and quantitative risk mechanisms.",
  },
  {
    id: "aerospace-systems-engineer",
    title: "Aerospace Systems & Propulsion Engineer",
    category: "Physical Sciences",
    matchScore: 83,
    stream: "Pure Science & Physics",
    growthOutlook: "High",
    keySkills: ["Thermodynamics", "Aerodynamics", "CAD Simulation", "Control Theory"],
    description: "Architects high-efficiency aerospace propulsion systems, satellite structures, and autonomous flight mechanics.",
  },
];

export default function ParticipantPathwaysPage() {
  return (
    <DashboardShell allowedRoles={["PARTICIPANT"]}>
      <div className="space-y-6">
        <PageHeader
          title="Curated Career Pathways"
          subtitle="Explore careers, academic subject combinations, and industry growth vectors mapped to your psychometric profile."
          badge="AI Mapped"
          badgeColor="primary"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_PATHWAYS.map((pathway) => (
            <CareerPathwayCard key={pathway.id} pathway={pathway} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
