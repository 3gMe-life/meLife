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
  Share2,
  Layers,
  ChevronRight,
  Target,
  Brain,
  Award,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { CareerDetailDTO } from "../types/career.types";
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

  const isTopMatch = career.matchPercentage >= 88;

  // Determine Growth styling
  const growthColor =
    career.futureGrowth === "Very High"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
      : career.futureGrowth === "High"
      ? "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/30"
      : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/participant/career-pathways"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#526866] dark:text-[#9FB3B0] hover:text-[#008F83] dark:hover:text-[#00BFA5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Career Pathways</span>
        </Link>

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
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-white/10 text-white/90 border border-white/15">
              {career.category}
            </span>
            <span className="px-3.5 py-1 rounded-full text-[11px] font-bold text-[#9FB3B0]">
              {career.industry}
            </span>

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

          {/* Title & Description */}
          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3">
              {career.title}
            </h1>
            <p className="text-sm sm:text-base text-[#C2D6D3] max-w-3xl leading-relaxed">
              {career.description}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Psychometric Match Reasoning Card ("Why This Matches You") & 4-Pillar Score Breakdown */}
      <div className="space-y-6">
        {career.reasoning && (
          <div className="relative rounded-3xl bg-gradient-to-br from-white to-[#F4F8F7] dark:from-[#172B2A] dark:to-[#122221] border border-[#00BFA5]/40 p-6 sm:p-8 shadow-md">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  Why This Career Pathway Matches Your Profile
                </h2>
                <p className="text-[11px] text-[#728B88] dark:text-[#7D9491]">
                  Scientifically computed psychometric alignment across Interests, Skills, Aptitudes, Traits, and Academic Streams
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#C2D6D3] leading-relaxed">
                {career.reasoning.summary}
              </p>

              {/* Multi-Pillar Breakdown Visualizer */}
              {career.matchBreakdown && (
                <div className="pt-2 border-t border-[#E3ECEA] dark:border-white/10">
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-3">
                    Multi-Dimensional Match Breakdown:
                  </div>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 ${career.matchBreakdown.streamScore !== undefined ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-3`}>
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
                      <span className="text-[10px] text-[#728B88] dark:text-[#7D9491]">
                        Interest Alignment
                      </span>
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
                      <span className="text-[10px] text-[#728B88] dark:text-[#7D9491]">
                        Skill Behaviour
                      </span>
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
                      <span className="text-[10px] text-[#728B88] dark:text-[#7D9491]">
                        Demonstrated Tasks
                      </span>
                    </div>

                    {/* Pillar 4: Personality */}
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
                      <span className="text-[10px] text-[#728B88] dark:text-[#7D9491]">
                        Archetype & Traits
                      </span>
                    </div>

                    {/* Pillar 5: Stream Finder (if assessed) */}
                    {career.matchBreakdown.streamScore !== undefined && (
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-[#00BFA5]/30 bg-[#00BFA5]/5">
                        <div className="flex items-center justify-between text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] mb-1.5">
                          <span className="flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-[#00BFA5]" />
                            Stream Match
                          </span>
                          <span className="font-mono text-[#008F83] dark:text-[#00BFA5]">
                            {career.matchBreakdown.streamScore}%
                          </span>
                        </div>
                        <div className="w-full bg-[#E3ECEA] dark:bg-white/10 h-2 rounded-full overflow-hidden mb-1">
                          <div
                            className="bg-[#00BFA5] h-full rounded-full transition-all duration-500"
                            style={{ width: `${career.matchBreakdown.streamScore}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-[#008F83] dark:text-[#00BFA5] font-semibold">
                          Academic Stream
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Strengths & Development Areas Grid */}
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
        {/* Left 2 Columns: Overview, Roadmap, and Education */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Overview */}
          {career.overview && (
            <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#00BFA5]" />
                <h2 className="text-base sm:text-lg font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  Career Pathway Overview
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#526866] dark:text-[#9FB3B0] leading-relaxed">
                {career.overview}
              </p>
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
          {/* Required Skills & Competencies */}
          <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#00BFA5]" />
              <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9]">
                Required Competencies
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(career.requiredSkills || career.keySkills || []).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-[#172B2A] dark:text-[#F7FAF9]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Subjects */}
          {career.recommendedSubjects && career.recommendedSubjects.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#00BFA5]" />
                <h3 className="text-sm sm:text-base font-black text-[#172B2A] dark:text-[#F7FAF9]">
                  Recommended Subjects
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {career.recommendedSubjects.map((sub, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#00BFA5]/10 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/20"
                  >
                    {sub}
                  </span>
                ))}
              </div>
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
                Related Career Pathways
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
