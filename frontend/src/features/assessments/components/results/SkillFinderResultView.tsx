"use client";

import React, { useState } from "react";
import { SkillFinderResult } from "../../types/assessment.types";

interface SkillFinderResultViewProps {
  result: SkillFinderResult;
}

type TabType =
  | "overview"
  | "interests"
  | "skills"
  | "aptitude"
  | "development"
  | "exploration";

const TABS: Array<{ id: TabType; label: string }> = [
  { id: "overview", label: "Executive Overview" },
  { id: "interests", label: "Interest Discovery (RIASEC)" },
  { id: "skills", label: "Skill Behaviours" },
  { id: "aptitude", label: "Demonstrated Aptitude" },
  { id: "development", label: "Developmental Habits" },
  { id: "exploration", label: "Career Exploration" },
];

export function SkillFinderResultView({ result }: SkillFinderResultViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const {
    interestDiscovery,
    skillBehaviour,
    demonstratedAptitude,
    developmentalStrengths,
    explorationDirections,
    responseQuality,
  } = result;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 print:p-0 print:space-y-6">
      {/* 1. REPORT HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-950 via-slate-900 to-slate-950 border border-primary/20 p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-light border border-primary/30 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Validated Psychometric Profile
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Skill Finder Assessment Report
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Exploratory profile covering vocational interest clusters, self-reported skill behaviours, demonstrated task aptitude, and developmental strengths.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 print:hidden">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-slate-900 font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Download PDF / Print</span>
            </button>
          </div>
        </div>

        {/* Quality Banner */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Reliability Signal:</span>
            <span className="font-bold text-primary-light text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {responseQuality.consistencySignal}
            </span>
          </div>
          <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Assessment Completed:</span>
            <span className="font-semibold text-slate-200 text-sm">
              {new Date(result.completedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Guidance Framework:</span>
            <span className="font-semibold text-slate-200 text-sm">
              Holistic Multidimensional Model
            </span>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS (Screen Only) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border-default print:hidden">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-primary text-slate-900 shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. EXECUTIVE OVERVIEW TAB */}
      {(activeTab === "overview" || typeof window === "undefined") && (
        <div className="space-y-8">
          {/* Top 3 Interest Clusters Highlight */}
          <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  Top 3 Interest Affinity Clusters
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">
                  Primary vocational orientations identified through self-reported activity preferences.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {interestDiscovery.topClusters.map((cluster, idx) => (
                <div
                  key={cluster.code}
                  className="relative rounded-2xl p-5 border-2 border-primary/20 bg-primary-50/40 dark:bg-primary-950/20 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-primary text-slate-900 font-extrabold text-sm flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="text-lg font-black text-primary">
                      {cluster.scalePositionPercentage}%
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary text-base mb-1">
                      {cluster.name}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                      {cluster.clusterTitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Pillars Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skill Strengths */}
            <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                Strongest Skill Behaviours
              </h3>
              <div className="space-y-4">
                {skillBehaviour.strongestIndicators.map((item) => (
                  <div key={item.code} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-text-primary">
                      <span>{item.name}</span>
                      <span className="text-primary font-bold">{item.scalePositionPercentage}%</span>
                    </div>
                    <div className="w-full bg-surface-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${item.scalePositionPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demonstrated Aptitude */}
            <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                Demonstrated Task Aptitude
              </h3>
              <div className="space-y-4">
                {demonstratedAptitude.dimensions.slice(0, 4).map((item) => (
                  <div key={item.code} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-text-primary">
                      <span>{item.name}</span>
                      <span className="text-secondary font-bold">{item.scalePositionPercentage}%</span>
                    </div>
                    <div className="w-full bg-surface-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-secondary h-full rounded-full transition-all"
                        style={{ width: `${item.scalePositionPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. INTEREST DISCOVERY TAB */}
      {(activeTab === "interests" || typeof window === "undefined") && (
        <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              Section A: Interest Discovery (Holland RIASEC Profile)
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Evaluates vocational orientation across the 6 validated domains.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {interestDiscovery.dimensions.map((dim) => (
              <div
                key={dim.code}
                className="p-5 rounded-2xl bg-surface-muted/60 border border-border-default space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary text-base">{dim.name}</span>
                  <span className="text-sm font-extrabold text-primary px-2.5 py-0.5 rounded-lg bg-primary-50 dark:bg-primary-950/50">
                    {dim.scalePositionPercentage}%
                  </span>
                </div>
                <div className="w-full bg-surface-elevated h-2.5 rounded-full overflow-hidden border border-border-default">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${dim.scalePositionPercentage}%` }}
                  />
                </div>
                {dim.description && (
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {dim.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SKILL BEHAVIOURS TAB */}
      {(activeTab === "skills" || typeof window === "undefined") && (
        <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              Section B: Skill Behaviours (Self-Reported Instincts)
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Measures problem-solving approaches, communication, spatial instincts, and teamwork.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skillBehaviour.dimensions.map((dim) => (
              <div
                key={dim.code}
                className="p-4 rounded-2xl bg-surface-muted/60 border border-border-default space-y-2"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-text-primary">
                  <span>{dim.name}</span>
                  <span className="text-primary font-bold">{dim.scalePositionPercentage}%</span>
                </div>
                <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${dim.scalePositionPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. DEMONSTRATED APTITUDE TAB */}
      {(activeTab === "aptitude" || typeof window === "undefined") && (
        <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Section C: Demonstrated Cognitive Aptitude
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Objective task performance across reasoning, logic, spatial transformation, and problem solving.
              </p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary font-extrabold text-sm self-start">
              Overall Accuracy: {demonstratedAptitude.overallAccuracyPercentage}%
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {demonstratedAptitude.dimensions.map((dim) => (
              <div
                key={dim.code}
                className="p-5 rounded-2xl bg-surface-muted/60 border border-border-default space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary text-sm">{dim.name}</span>
                  <span className="text-xs font-bold text-secondary px-2.5 py-1 rounded-lg bg-secondary/10">
                    {dim.rawScore} / {dim.maxScore} pts ({dim.scalePositionPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-secondary h-full rounded-full"
                    style={{ width: `${dim.scalePositionPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. DEVELOPMENTAL HABITS TAB */}
      {(activeTab === "development" || typeof window === "undefined") && (
        <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              Section D: Developmental Strengths & Learning Habits
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Positive learning habits to observe and nurture over time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {developmentalStrengths.dimensions.map((dim) => (
              <div
                key={dim.code}
                className="p-4 rounded-2xl bg-surface-muted/60 border border-border-default space-y-2"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-text-primary">
                  <span>{dim.name}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {dim.scalePositionPercentage}%
                  </span>
                </div>
                <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${dim.scalePositionPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. CAREER EXPLORATION TAB */}
      {(activeTab === "exploration" || typeof window === "undefined") && (
        <div className="space-y-6">
          <div className="bg-surface-elevated border border-border-default rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-text-primary">
                Positive Career & Project Exploration Directions
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                These clusters are supportive exploration suggestions based on top interest domains, not fixed career labels.
              </p>
            </div>

            <div className="space-y-5">
              {explorationDirections.map((exp, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-6 border border-border-default bg-surface-muted/40 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary text-slate-900 font-bold text-sm flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-text-primary">
                        {exp.clusterTitle}
                      </h3>
                      <span className="text-xs font-medium text-primary">
                        Primary Domain: {exp.domain}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-surface-elevated p-4 rounded-xl border border-border-default">
                      <span className="text-xs font-bold text-text-primary block mb-2">
                        🔍 Sample Exploration Areas:
                      </span>
                      <ul className="space-y-1 text-xs text-text-secondary list-disc list-inside">
                        {exp.sampleExplorationAreas.map((area, aIdx) => (
                          <li key={aIdx}>{area}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-surface-elevated p-4 rounded-xl border border-border-default">
                      <span className="text-xs font-bold text-text-primary block mb-2">
                        🚀 Hands-on Suggested Activities:
                      </span>
                      <ul className="space-y-1 text-xs text-text-secondary list-disc list-inside">
                        {exp.suggestedActivities.map((act, actIdx) => (
                          <li key={actIdx}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Suggestions */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-300/40 rounded-3xl p-6 sm:p-8 space-y-3">
            <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <span className="text-lg">💡</span> Actionable Next Steps for Student & Parents
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300/80 list-disc list-inside">
              {result.growthSuggestions.map((sug, sIdx) => (
                <li key={sIdx}>{sug}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
