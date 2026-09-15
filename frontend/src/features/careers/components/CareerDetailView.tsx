"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Briefcase,
  Compass,
  Milestone,
  Globe,
  Layers,
  ChevronRight,
  Target,
  Brain,
  Award,
  Zap,
  ShieldCheck,
  Building,
  Laptop,
  Check,
} from "lucide-react";
import { CareerDetailDTO, CareerTier } from "../types/career.types";
import { MatchScore } from "./MatchScore";

interface CareerDetailViewProps {
  career: CareerDetailDTO;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", native: "English", dir: "ltr" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", dir: "ltr" },
  { code: "hi", label: "Hindi", native: "हिन्दी", dir: "ltr" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
  { code: "ta", label: "Tamil", native: "தமிழ்", dir: "ltr" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", dir: "ltr" },
];

export function CareerDetailView({
  career,
  currentLanguage,
  onLanguageChange,
}: CareerDetailViewProps) {
  const activeLangConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  const isRtl = activeLangConfig.dir === "rtl";

  // Determine Growth styling
  const growthColor =
    career.futureGrowth === "Very High"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
      : career.futureGrowth === "High"
      ? "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/30"
      : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";

  // Determine Tier styling
  const getTierBadge = (tier?: CareerTier) => {
    switch (tier) {
      case "PRIMARY":
        return {
          label: "Strong Alignment (Primary)",
          className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
        };
      case "SECONDARY":
        return {
          label: "High Compatibility (Secondary)",
          className: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
        };
      case "EXPLORE_FURTHER":
        return {
          label: "Recommended for Exploration",
          className: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
        };
      case "DEVELOPING":
      default:
        return {
          label: "Developing Alignment",
          className: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
        };
    }
  };

  const tierConfig = getTierBadge(career.tier);
  const drivers = career.driverConstructs || career.reasoning?.driverConstructs || [];

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Top Navigation Bar & Hierarchy Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <Link
            href="/participant/career-pathways"
            className="inline-flex items-center gap-1.5 font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#008F83] dark:hover:text-[#00BFA5] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Pathways</span>
          </Link>

          {career.domainName && (
            <>
              <span className="text-[#A5B8B5]">/</span>
              <span className="font-semibold text-[#728B88] dark:text-[#9FB3B0]">
                {career.domainName}
              </span>
            </>
          )}

          {career.familyName && (
            <>
              <span className="text-[#A5B8B5]">/</span>
              <span className="font-semibold text-[#728B88] dark:text-[#9FB3B0]">
                {career.familyName}
              </span>
            </>
          )}

          {career.clusterName && (
            <>
              <span className="text-[#A5B8B5]">/</span>
              <span className="font-bold text-[#172B2A] dark:text-white">
                {career.clusterName}
              </span>
            </>
          )}
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 text-xs font-semibold shadow-sm">
          <Globe className="w-3.5 h-3.5 text-[#00BFA5]" />
          <select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-transparent text-[#172B2A] dark:text-white focus:outline-none cursor-pointer font-bold pr-1"
            aria-label="Select career detail language"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option
                key={lang.code}
                value={lang.code}
                className="bg-[#172B2A] text-white"
              >
                {lang.native} ({lang.label})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#172B2A] via-[#102423] to-[#0D1C1B] text-white p-6 sm:p-10 border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#00BFA5]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-[#00B8D4]/15 blur-2xl pointer-events-none" />

        <div className="relative space-y-5">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase border ${tierConfig.className}`}
            >
              {tierConfig.label}
            </span>

            <span className="px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-white/10 text-white/90 border border-white/15">
              {career.category}
            </span>

            {career.isEmerging && (
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Emerging Future Occupation</span>
              </span>
            )}

            <MatchScore score={career.matchPercentage} size="md" showLabel={true} />

            {career.confidence && (
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>{career.confidence}</span>
              </span>
            )}

            <div
              className={`px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${growthColor}`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{career.futureGrowth} Growth Outlook</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
              {career.title}
            </h1>
            {career.specialization && (
              <p className="text-sm font-semibold text-[#00BFA5] mb-3">
                Focus Area: {career.specialization}
              </p>
            )}
            <p className="text-sm sm:text-base text-[#C2D6D3] max-w-3xl leading-relaxed">
              {career.description}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Psychometric Match Reasoning Card ("Why This Matches You") */}
      <div className="space-y-6">
        {career.reasoning && (
          <div className="relative rounded-3xl bg-gradient-to-br from-white to-[#F4F8F7] dark:from-[#172B2A] dark:to-[#122221] border border-[#00BFA5]/40 p-6 sm:p-8 shadow-md">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  Why This Occupation Matches Your Profile
                </h2>
                <p className="text-[11px] text-[#728B88] dark:text-[#7D9491]">
                  Evidence synthesis across cognitive aptitude, behavioral competencies, interest vectors, and stream alignment
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#C2D6D3] leading-relaxed">
                {career.reasoning.summary}
              </p>

              {/* Explainability Drivers: Top Construct Drivers */}
              {drivers.length > 0 && (
                <div className="pt-2 border-t border-[#E3ECEA] dark:border-white/10 space-y-3">
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491]">
                    Key Psychometric Driver Constructs:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {drivers.map((driver, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                          <span className="truncate pr-1">{driver.constructName || driver.dimensionName}</span>
                          {driver.normalizedScore !== undefined && (
                            <span className="font-mono text-[#008F83] dark:text-[#00BFA5]">
                              {driver.normalizedScore}%
                            </span>
                          )}
                        </div>
                        {driver.normalizedScore !== undefined && (
                          <div className="w-full bg-[#E3ECEA] dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#00BFA5] h-full rounded-full"
                              style={{ width: `${driver.normalizedScore}%` }}
                            />
                          </div>
                        )}
                        <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] leading-snug">
                          {driver.rationale}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multi-Pillar Breakdown Visualizer */}
              {career.matchBreakdown && (
                <div className="pt-2 border-t border-[#E3ECEA] dark:border-white/10">
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-3">
                    Multi-Dimensional Match Breakdown:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Pillar 1: Interest */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
                      <div className="flex items-center justify-between text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-[#00BFA5]" />
                          RIASEC Interest
                        </span>
                        <span className="font-mono text-[#008F83] dark:text-[#00BFA5]">
                          {career.matchBreakdown.interestScore}%
                        </span>
                      </div>
                      <div className="w-full bg-[#E3ECEA] dark:bg-white/10 h-2 rounded-full overflow-hidden mb-1">
                        <div
                          className="bg-[#00BFA5] h-full rounded-full transition-all duration-500"
                          style={{ width: `${career.matchBreakdown.interestScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Pillar 2: Skills */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
                      <div className="flex items-center justify-between text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-[#00B8D4]" />
                          Cognitive Skills
                        </span>
                        <span className="font-mono text-[#008F83] dark:text-[#00B8D4]">
                          {career.matchBreakdown.skillScore}%
                        </span>
                      </div>
                      <div className="w-full bg-[#E3ECEA] dark:bg-white/10 h-2 rounded-full overflow-hidden mb-1">
                        <div
                          className="bg-[#00B8D4] h-full rounded-full transition-all duration-500"
                          style={{ width: `${career.matchBreakdown.skillScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Pillar 3: Aptitude */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
                      <div className="flex items-center justify-between text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Brain className="w-3.5 h-3.5 text-indigo-500" />
                          Aptitude Logic
                        </span>
                        <span className="font-mono text-indigo-600 dark:text-indigo-400">
                          {career.matchBreakdown.aptitudeScore}%
                        </span>
                      </div>
                      <div className="w-full bg-[#E3ECEA] dark:bg-white/10 h-2 rounded-full overflow-hidden mb-1">
                        <div
                          className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${career.matchBreakdown.aptitudeScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Pillar 4: Personality & Archetype */}
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10">
                      <div className="flex items-center justify-between text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          Personality / Style
                        </span>
                        <span className="font-mono text-amber-600 dark:text-amber-400">
                          {career.matchBreakdown.personalityScore}%
                        </span>
                      </div>
                      <div className="w-full bg-[#E3ECEA] dark:bg-white/10 h-2 rounded-full overflow-hidden mb-1">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${career.matchBreakdown.personalityScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Strengths & Development Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Strength Alignments */}
                {(career.strengthAlignment || career.reasoning?.topMatchingFactors) && (
                  <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Key Strength Alignments</span>
                    </div>
                    <div className="space-y-1.5">
                      {(career.strengthAlignment || career.reasoning?.topMatchingFactors || []).map(
                        (factor, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-xs text-[#172B2A] dark:text-[#F7FAF9]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{factor}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Development Areas */}
                {career.developmentAreas && career.developmentAreas.length > 0 && (
                  <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                      <Target className="w-4 h-4" />
                      <span>Growth & Development Targets</span>
                    </div>
                    <div className="space-y-1.5">
                      {career.developmentAreas.map((area, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-[#172B2A] dark:text-[#F7FAF9]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                          <span>{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {career.reasoning.alignmentNote && (
                <div className="p-3.5 rounded-xl bg-[#00BFA5]/10 border border-[#00BFA5]/20 text-[11px] text-[#008F83] dark:text-[#00BFA5] font-medium leading-relaxed">
                  💡 <span className="font-bold">Guidance Note:</span> {career.reasoning.alignmentNote}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Two-Column Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Overview, Roadmap, Degrees & Entry Pathways */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Overview */}
          {career.overview && (
            <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#00BFA5]" />
                <h2 className="text-base sm:text-lg font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  Occupational Overview
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                {career.overview}
              </p>
            </div>
          )}

          {/* Degrees & Entry Qualifications */}
          {(career.recommendedDegrees?.length || career.typicalQualifications?.length || career.careerEntryPath?.length) && (
            <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#00BFA5]" />
                <h2 className="text-base sm:text-lg font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  Academic Degrees & Entry Pathways
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recommended Degrees */}
                {career.recommendedDegrees && career.recommendedDegrees.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block">
                      Recommended Degrees & Majors:
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#172B2A] dark:text-[#F7FAF9]">
                      {career.recommendedDegrees.map((deg, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#00BFA5] shrink-0 mt-0.5" />
                          <span>{deg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Typical Qualifications */}
                {career.typicalQualifications && career.typicalQualifications.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block">
                      Typical Qualifications & Levels:
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#172B2A] dark:text-[#F7FAF9]">
                      {career.typicalQualifications.map((qual, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#00BFA5] shrink-0 mt-0.5" />
                          <span>{qual}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Career Entry Paths */}
              {career.careerEntryPath && career.careerEntryPath.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] block">
                    Career Entry Routes:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#172B2A] dark:text-[#F7FAF9]">
                    {career.careerEntryPath.map((entry, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <ArrowLeft className="w-3.5 h-3.5 text-[#00BFA5] shrink-0 rotate-180 mt-0.5" />
                        <span>{entry}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step-by-Step Learning Roadmap */}
          {career.learningRoadmap && career.learningRoadmap.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2">
                <Milestone className="w-5 h-5 text-[#00BFA5]" />
                <h2 className="text-base sm:text-lg font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  Step-by-Step Learning & Career Roadmap
                </h2>
              </div>

              <div className="relative space-y-6 before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E3ECEA] dark:before:bg-white/10">
                {career.learningRoadmap.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    {/* Step Icon Badge */}
                    <div className="w-7 h-7 rounded-full bg-[#00BFA5] text-[#172B2A] font-black text-xs flex items-center justify-center shrink-0 ring-4 ring-white dark:ring-[#172B2A] z-10">
                      {idx + 1}
                    </div>

                    <div className="flex-1 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 p-4 sm:p-5 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5]">
                          {step.stage}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#172B2A] dark:text-[#F7FAF9]">
                        {step.title}
                      </h4>
                      <p className="text-xs text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                        {step.description}
                      </p>

                      {step.focusAreas && step.focusAreas.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {step.focusAreas.map((area, aIdx) => (
                            <span
                              key={aIdx}
                              className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white dark:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-[#F7FAF9]"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Academic Paths */}
          {career.educationPaths && career.educationPaths.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#00BFA5]" />
                <h2 className="text-base sm:text-lg font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  Recommended Educational Pathways
                </h2>
              </div>
              <ul className="space-y-2.5">
                {career.educationPaths.map((path, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#172B2A] dark:text-[#F7FAF9] font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
                    <span>{path}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right 1 Column: Skills, Subjects, Sample Roles, Related Careers */}
        <div className="space-y-8">
          {/* Core & Required Competencies */}
          <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#00BFA5]" />
              <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9]">
                Core Competencies
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(career.coreSkills || career.requiredSkills || career.keySkills || []).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-[#F7FAF9]"
                >
                  {skill}
                </span>
              ))}
            </div>

            {career.supportingSkills && career.supportingSkills.length > 0 && (
              <div className="pt-2 border-t border-[#E3ECEA] dark:border-white/10">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-2 block">
                  Supporting Skills:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {career.supportingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#C2D6D3]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recommended Subjects & Streams */}
          {(career.recommendedSubjects?.length || career.recommendedStreams?.length) && (
            <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#00BFA5]" />
                <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  Recommended Academic Alignment
                </h3>
              </div>

              {career.recommendedStreams && career.recommendedStreams.length > 0 && (
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#008F83] dark:text-[#00BFA5] mb-1.5 block">
                    Recommended Streams:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {career.recommendedStreams.map((stream, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30"
                      >
                        {stream}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {career.recommendedSubjects && career.recommendedSubjects.length > 0 && (
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-1.5 block">
                    Foundational Subjects:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {career.recommendedSubjects.map((sub, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#F4F8F7] dark:bg-white/5 text-[#172B2A] dark:text-[#F7FAF9] border border-[#E3ECEA] dark:border-white/10"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Work Environment & Technology Areas */}
          {(career.workEnvironment?.length || career.technologyAreas?.length) && (
            <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-[#00BFA5]" />
                <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  Workplace & Technologies
                </h3>
              </div>

              {career.workEnvironment && career.workEnvironment.length > 0 && (
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-1.5 block">
                    Work Environments:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {career.workEnvironment.map((env, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[#526866] dark:text-[#C2D6D3]"
                      >
                        {env}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {career.technologyAreas && career.technologyAreas.length > 0 && (
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-1.5 block">
                    Technology Stacks & Tools:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {career.technologyAreas.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#00B8D4]/10 text-[#008F83] dark:text-[#00B8D4] border border-[#00B8D4]/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sample Job Roles */}
          {career.sampleRoles && career.sampleRoles.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#00BFA5]" />
                <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  Sample Professional Roles
                </h3>
              </div>
              <div className="space-y-2">
                {career.sampleRoles.map((role, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs font-semibold text-[#172B2A] dark:text-[#F7FAF9]"
                  >
                    {role}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Career Pathways */}
          {career.relatedCareers && career.relatedCareers.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-7 shadow-sm space-y-4">
              <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9]">
                Related Occupations
              </h3>
              <div className="space-y-2.5">
                {career.relatedCareers.map((rel) => (
                  <Link
                    key={rel.id || rel.slug}
                    href={`/participant/career-pathways/${rel.slug || rel.id}`}
                    className="group flex items-center justify-between p-3 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/50 transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5] transition-colors">
                        {rel.title}
                      </h4>
                      <p className="text-[10px] text-[#728B88] dark:text-[#7D9491]">
                        {rel.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-[#008F83] dark:text-[#00BFA5]">
                        {rel.matchPercentage}%
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#728B88] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
