"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HumanitiesCareerFinderResult,
  HumanitiesFamilyCode,
  HumanitiesCareerFamilyScoreItem,
} from "../../types/assessment.types";
import {
  Sparkles,
  Compass,
  Lightbulb,
  Target,
  Brain,
  Printer,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  BarChart3,
  Layers,
  GraduationCap,
  Info,
  ChevronRight,
  Briefcase,
  Users,
  Scale,
  Radio,
  FileText,
  Globe2,
  HeartHandshake,
  HelpCircle,
  AlertTriangle,
  Feather,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import { RetakeConfirmationModal } from "../history/RetakeConfirmationModal";
import { useStartRetakeMutation } from "../../hooks/useStartRetakeMutation";
import { useAssessmentHistoryQuery } from "../../hooks/useAssessmentHistoryQuery";
import { AssessmentTimeline } from "../history/AssessmentTimeline";

interface HumanitiesCareerFinderResultViewProps {
  result: HumanitiesCareerFinderResult;
  onLanguageChange?: (languageCode: string) => void;
  currentLanguage?: string;
}

type TabType = "overview" | "families" | "dimensions" | "clusters" | "academic" | "counsellor" | "history";

const TABS: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "Career Overview", icon: <Sparkles className="w-4 h-4" /> },
  { id: "families", label: "4-Family Matrix", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "dimensions", label: "8-Dimension Profile", icon: <Brain className="w-4 h-4" /> },
  { id: "clusters", label: "Career Clusters", icon: <Briefcase className="w-4 h-4" /> },
  { id: "academic", label: "Academic Review", icon: <BookOpen className="w-4 h-4" /> },
  { id: "counsellor", label: "Counsellor Guide", icon: <GraduationCap className="w-4 h-4" /> },
  { id: "history", label: "Milestone History", icon: <TrendingUp className="w-4 h-4" /> },
];

const FAMILY_THEMES: Record<
  HumanitiesFamilyCode,
  {
    icon: React.ReactNode;
    color: string;
    bgLight: string;
    bgDark: string;
    borderColor: string;
    badgeBg: string;
    badgeText: string;
    barGradient: string;
    accentColor: string;
  }
> = {
  HUMAN_BEHAVIOUR_WELLBEING: {
    icon: <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    color: "#4F46E5",
    bgLight: "bg-indigo-50/80",
    bgDark: "dark:bg-indigo-950/20",
    borderColor: "border-indigo-300/40 dark:border-indigo-700/40",
    badgeBg: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    barGradient: "from-indigo-500 to-purple-400",
    accentColor: "#6366F1",
  },
  LAW_PUBLIC_AFFAIRS_JUSTICE: {
    icon: <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    color: "#D97706",
    bgLight: "bg-amber-50/80",
    bgDark: "dark:bg-amber-950/20",
    borderColor: "border-amber-300/40 dark:border-amber-700/40",
    badgeBg: "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200",
    badgeText: "text-amber-700 dark:text-amber-300",
    barGradient: "from-amber-500 to-orange-400",
    accentColor: "#F59E0B",
  },
  MEDIA_COMM_CREATIVE_CULTURE: {
    icon: <Radio className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
    color: "#E11D48",
    bgLight: "bg-rose-50/80",
    bgDark: "dark:bg-rose-950/20",
    borderColor: "border-rose-300/40 dark:border-rose-700/40",
    badgeBg: "bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200",
    badgeText: "text-rose-700 dark:text-rose-300",
    barGradient: "from-rose-500 to-pink-400",
    accentColor: "#F43F5E",
  },
  EDUCATION_LANG_SOCIAL_RESEARCH: {
    icon: <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    color: "#059669",
    bgLight: "bg-emerald-50/80",
    bgDark: "dark:bg-emerald-950/20",
    borderColor: "border-emerald-300/40 dark:border-emerald-700/40",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    barGradient: "from-emerald-500 to-teal-400",
    accentColor: "#10B981",
  },
};

const CAREER_CLUSTERS_DETAILS: Record<
  HumanitiesFamilyCode,
  {
    pathwayTitle: string;
    description: string;
    sampleRoles: string[];
    emergingDomains: string[];
    degreeOptions: string[];
    coreSkills: string[];
  }
> = {
  HUMAN_BEHAVIOUR_WELLBEING: {
    pathwayTitle: "Human Behaviour, Mental Health & Social Wellbeing",
    description:
      "Focuses on understanding the human mind, cognitive processes, interpersonal relationships, counselling, social rehabilitation, and organizational empathy.",
    sampleRoles: [
      "Clinical & Counselling Psychologist",
      "Child & School Psychologist",
      "Organizational Behaviour & HR Specialist",
      "Social Rehabilitation Consultant",
      "Mental Health Advocate & Coach",
      "Community Wellness Coordinator",
    ],
    emergingDomains: [
      "Digital Mental Health & Tele-therapy",
      "Neurodiversity Workplace Consulting",
      "Behavioural Economics & Decision Sciences",
      "Geriatric & Wellness Counselling",
    ],
    degreeOptions: [
      "BA / B.Sc Psychology",
      "BSW (Bachelor of Social Work)",
      "MA / M.Sc Applied / Clinical Psychology",
      "M.Phil / Psy.D Clinical Psychology",
      "MSW (Master of Social Work)",
    ],
    coreSkills: [
      "Empathetic Active Listening",
      "Qualitative Case Formulation",
      "Ethical Practice & Boundaries",
      "Psychological Assessment",
      "Crisis Intervention",
    ],
  },
  LAW_PUBLIC_AFFAIRS_JUSTICE: {
    pathwayTitle: "Law, Public Policy, Governance & Social Justice",
    description:
      "Emphasizes logical argument, statutory interpretation, constitutional principles, civic accountability, human rights advocacy, and administrative leadership.",
    sampleRoles: [
      "Corporate & Commercial Legal Counsel",
      "Litigation Advocate & Legal Consultant",
      "Civil Services Officer (IAS / IPS / IFS)",
      "Public Policy Analyst & Legislative Assistant",
      "Human Rights / Environmental Lawyer",
      "Arbitrator & Dispute Resolution Mediator",
    ],
    emergingDomains: [
      "Cyber Law & AI Governance",
      "ESG (Environmental, Social & Governance) Compliance",
      "Space Law & Emerging Tech Policy",
      "Data Privacy & Consumer Protection",
    ],
    degreeOptions: [
      "BA LLB (Integrated 5-Year Law)",
      "BBA LLB (Business Law)",
      "BA Political Science / Public Administration",
      "Master of Public Policy (MPP)",
      "LLM (Master of Laws)",
    ],
    coreSkills: [
      "Statutory Reasoning & Case Briefing",
      "Mooting & Oral Persuasion",
      "Policy Drafting & Regulatory Impact Analysis",
      "Negotiation & Dispute Mediation",
    ],
  },
  MEDIA_COMM_CREATIVE_CULTURE: {
    pathwayTitle: "Media, Communication, Journalism & Creative Expression",
    description:
      "Combines compelling narrative storytelling, investigative journalism, digital media creation, cultural curation, public relations, and artistic synthesis.",
    sampleRoles: [
      "Investigative Journalist & News Editor",
      "Digital Content Strategist & Producer",
      "Public Relations & Communications Director",
      "Screenwriter, Author & Creative Copywriter",
      "Museum Curator & Cultural Heritage Manager",
      "Documentary Filmmaker & Visual Storyteller",
    ],
    emergingDomains: [
      "Data Journalism & Interactive Storytelling",
      "Cross-Platform Podcasting & Audio Media",
      "Immersive XR Narrative Design",
      "Brand Storytelling & Influencer Strategy",
    ],
    degreeOptions: [
      "BA Journalism & Mass Communication (BJMC)",
      "BA English Literature / Creative Writing",
      "BA Visual Arts / Film Studies",
      "MA Mass Communication & Digital Media",
      "Post-Graduate Diploma in Journalism",
    ],
    coreSkills: [
      "Narrative Arc & Persuasive Writing",
      "Fact-Checking & Source Verification",
      "Multi-Media Editing & Visual Composition",
      "Audience Engagement Strategy",
    ],
  },
  EDUCATION_LANG_SOCIAL_RESEARCH: {
    pathwayTitle: "Education, Languages, Sociology & Social Research",
    description:
      "Dedicated to intellectual inquiry, historical evidence analysis, sociological critique, foreign language mastery, translation, and transformative teaching pedagogy.",
    sampleRoles: [
      "University Lecturer / School Educator",
      "Sociologist & Ethnographic Researcher",
      "Historian & Archival Researcher",
      "Linguist, Translator & Interpreter",
      "Educational Curriculum Designer",
      "Think Tank Research Fellow",
    ],
    emergingDomains: [
      "EdTech Pedagogical Architecture",
      "Computational Linguistics & NLP Annotation",
      "Digital Humanities & Archival Data Mining",
      "Social Impact Assessment & Monitoring",
    ],
    degreeOptions: [
      "BA History / Sociology / Philosophy",
      "BA Foreign Languages (German, French, Spanish, Japanese, Mandarin)",
      "B.Ed (Bachelor of Education)",
      "MA Sociology / History / Linguistics",
      "Ph.D. in Humanities / Social Sciences",
    ],
    coreSkills: [
      "Primary Source Archival Synthesis",
      "Cross-Cultural Linguistic Fluency",
      "Curriculum Design & Facilitation",
      "Quantitative & Qualitative Social Statistics",
    ],
  },
};

export const HumanitiesCareerFinderResultView: React.FC<HumanitiesCareerFinderResultViewProps> = ({
  result,
  onLanguageChange,
  currentLanguage = "en",
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);

  const retakeMutation = useStartRetakeMutation();
  const { data: historyData } = useAssessmentHistoryQuery("HUMANITIES_CAREER_FINDER");

  const primary = result.primaryFamily;
  const secondary = result.secondaryFamily;
  const primaryTheme = FAMILY_THEMES[primary?.familyCode] || FAMILY_THEMES.HUMAN_BEHAVIOUR_WELLBEING;
  const secondaryTheme = FAMILY_THEMES[secondary?.familyCode] || FAMILY_THEMES.LAW_PUBLIC_AFFAIRS_JUSTICE;

  const handleStartRetake = () => {
    retakeMutation.mutate(
      { assessmentCode: "HUMANITIES_CAREER_FINDER" },
      {
        onSuccess: (res) => {
          setIsRetakeModalOpen(false);
          toast.success("Fresh Humanities Career Finder session initialized.");
          router.push(`/participant/assessments/${res.attemptId}`);
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to initiate retake session.");
        },
      }
    );
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto pb-16 print:p-0 print:space-y-4">
      {/* 1. Header & Pilot Disclaimer Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden print:bg-none print:text-black print:p-0 print:shadow-none">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-400/20 text-indigo-300 border border-indigo-400/30">
                Standard Pilot Edition
              </span>
              <span className="text-xs text-indigo-200/70 font-medium">
                45 Items Administered (40 Likert + 5 Scenarios)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white print:text-black">
              Humanities & Liberal Arts Compatibility Profile
            </h1>
            <p className="text-sm text-indigo-100/80 max-w-2xl leading-relaxed">
              Psychometric exploration battery mapping affinities across Psychology & Wellbeing, Law & Governance, Media & Creative Expression, and Education & Social Research.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setIsRetakeModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-400 text-slate-950 hover:bg-indigo-300 text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>

        {/* Pilot Advisory Callout */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-start gap-3 text-xs text-indigo-100/70">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-300" />
          <p className="leading-relaxed">
            {result.responseQuality?.pilotDisclaimer ||
              "This assessment is educational career guidance evidence. Results should be interpreted with academic records, eligibility requirements, student interests, career goals, current course requirements and professional counselling."}
          </p>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border-default print:hidden no-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-200 inline-flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-primary text-slate-900 shadow-xs"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB 1: Career Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Hero Recommendation Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Primary Career Alignment */}
            <div
              className={`lg:col-span-7 rounded-3xl border ${primaryTheme.borderColor} ${primaryTheme.bgLight} ${primaryTheme.bgDark} p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xs`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/80 dark:bg-white/10 text-text-primary border border-border-default">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Primary Career Alignment</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${primaryTheme.badgeBg}`}>
                  {primary.alignment}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white dark:bg-surface-elevated shadow-xs">
                    {primaryTheme.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-text-primary">
                      {primary.familyName}
                    </h2>
                    <p className="text-xs font-medium text-text-tertiary">
                      Leading Compatibility Affinity
                    </p>
                  </div>
                </div>

                {/* Compatibility Progress */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-text-secondary">Overall Compatibility Score</span>
                    <span className="text-2xl font-black text-text-primary">{primary.displayPercentage}%</span>
                  </div>
                  <div className="h-3.5 bg-surface-sunken rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full bg-gradient-to-r ${primaryTheme.barGradient} rounded-full transition-all duration-700`}
                      style={{ width: `${Math.max(5, primary.displayPercentage)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-text-tertiary">
                    <span>Likert Component: {primary.likertDisplayPercentage}% (70% wt)</span>
                    <span>Scenario Choices: {primary.choiceCount}/5 ({primary.choiceDisplayPercentage}%, 30% wt)</span>
                  </div>
                </div>
              </div>

              {/* Pathways & Examples */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-surface-elevated border border-border-subtle space-y-1">
                  <div className="font-bold text-text-primary flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-primary" />
                    <span>Suggested Pathways</span>
                  </div>
                  <p className="text-text-secondary leading-relaxed">{primary.suggestedPathways}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-surface-elevated border border-border-subtle space-y-1">
                  <div className="font-bold text-text-primary flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                    <span>Example Focus Areas</span>
                  </div>
                  <p className="text-text-secondary leading-relaxed">{primary.exampleAreas}</p>
                </div>
              </div>

              {/* Counselling Note */}
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-surface-elevated border border-border-subtle text-xs text-text-secondary leading-relaxed flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p>{primary.counsellingNote}</p>
              </div>
            </div>

            {/* Secondary Career Alignment & Clarity Card */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              {/* Secondary Alignment */}
              <div
                className={`rounded-3xl border ${secondaryTheme.borderColor} ${secondaryTheme.bgLight} ${secondaryTheme.bgDark} p-6 space-y-4 shadow-xs`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/80 dark:bg-white/10 text-text-primary border border-border-default">
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    <span>Secondary Career Alignment</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${secondaryTheme.badgeBg}`}>
                    {secondary.displayPercentage}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-surface-elevated shadow-xs">
                    {secondaryTheme.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">{secondary.familyName}</h3>
                    <p className="text-xs text-text-tertiary">{secondary.alignment}</p>
                  </div>
                </div>

                <div className="text-xs text-text-secondary leading-relaxed">
                  <p className="line-clamp-3">{secondary.suggestedPathways}</p>
                </div>
              </div>

              {/* Recommendation Clarity & Decision Gap */}
              <div className="rounded-3xl border border-border-default bg-surface-card p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                    <Target className="w-4 h-4 text-primary" />
                    <span>Profile Clarity Metric</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      result.clarity === "High Clarity"
                        ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                        : result.clarity === "Moderate Clarity"
                        ? "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                        : "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                    }`}
                  >
                    {result.clarity}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-surface-sunken">
                    <span className="text-text-tertiary block text-[11px]">Primary Score</span>
                    <span className="text-lg font-black text-text-primary">{primary.displayPercentage}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-sunken">
                    <span className="text-text-tertiary block text-[11px]">Decision Gap (Δ)</span>
                    <span className="text-lg font-black text-text-primary">
                      {result.scoreGapPercentage}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {result.guidance.interpretationSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Core Decision Principles & Exploration Direction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-border-default bg-surface-card p-6 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                <Compass className="w-4 h-4 text-primary" />
                <span>Exploration Direction</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {result.guidance.careerExplorationDirection}
              </p>
            </div>

            <div className="rounded-3xl border border-border-default bg-surface-card p-6 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Final Decision Principle</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {result.guidance.finalDecisionPrinciple}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: 4-Family Matrix */}
      {activeTab === "families" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-card border border-border-default">
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Humanities & Social Sciences Compatibility Matrix
              </h2>
              <p className="text-xs text-text-tertiary">
                Comparative ranking across all 4 Career Families based on 70% Likert Construct Weights + 30% Scenario Choices.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-text-secondary bg-surface-sunken px-3 py-1.5 rounded-xl">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span>4 Families Evaluated</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.sortedFamilies.map((fam, idx) => {
              const theme = FAMILY_THEMES[fam.familyCode] || FAMILY_THEMES.HUMAN_BEHAVIOUR_WELLBEING;
              return (
                <div
                  key={fam.familyCode}
                  className={`rounded-3xl border ${theme.borderColor} ${theme.bgLight} ${theme.bgDark} p-6 space-y-5 shadow-xs`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-white dark:bg-surface-elevated shadow-xs">
                        {theme.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-text-tertiary">#{idx + 1}</span>
                          <h3 className="text-lg font-extrabold text-text-primary">{fam.familyName}</h3>
                        </div>
                        <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${theme.badgeBg}`}>
                          {fam.alignment}
                        </span>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-text-primary">{fam.displayPercentage}%</span>
                  </div>

                  {/* Visual Progress */}
                  <div className="space-y-1.5">
                    <div className="h-3 bg-surface-sunken rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full bg-gradient-to-r ${theme.barGradient} rounded-full transition-all duration-700`}
                        style={{ width: `${Math.max(5, fam.displayPercentage)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-text-tertiary">
                      <span>Likert Score: {fam.likertDisplayPercentage}% ({fam.likertPoints}/{fam.maxLikertPoints} pts)</span>
                      <span>Scenario Choice: {fam.choiceCount}/5 ({fam.choiceDisplayPercentage}%)</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 text-xs border-t border-border-subtle">
                    <div>
                      <span className="font-bold text-text-primary block mb-0.5">Suggested Pathways:</span>
                      <p className="text-text-secondary leading-relaxed">{fam.suggestedPathways}</p>
                    </div>
                    <div>
                      <span className="font-bold text-text-primary block mb-0.5">Example Focus Areas:</span>
                      <p className="text-text-secondary leading-relaxed">{fam.exampleAreas}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/90 dark:bg-surface-elevated border border-border-subtle">
                      <span className="font-bold text-text-primary block mb-0.5">Counselling Perspective:</span>
                      <p className="text-text-secondary leading-relaxed">{fam.counsellingNote}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. TAB 3: 8-Dimension Profile */}
      {activeTab === "dimensions" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-surface-card border border-border-default">
            <h2 className="text-base font-bold text-text-primary">
              8 Interest & Cognitive Aptitude Dimensions
            </h2>
            <p className="text-xs text-text-tertiary">
              Derived from the 40 Likert questions (5 items per dimension, 25 max points each) with reverse-scored items calibrated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.sortedDimensions.map((dim) => (
              <div
                key={dim.dimensionCode}
                className="p-5 rounded-2xl bg-surface-card border border-border-default space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-text-primary">{dim.dimensionName}</h3>
                    <p className="text-xs text-text-tertiary leading-relaxed">{dim.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-black text-text-primary">{dim.normalizedScore}%</span>
                    <span
                      className={`block text-[10px] font-bold uppercase tracking-wider ${
                        dim.interpretation === "Very Strong"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : dim.interpretation === "Strong"
                          ? "text-blue-600 dark:text-blue-400"
                          : dim.interpretation === "Moderate"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-slate-500"
                      }`}
                    >
                      {dim.interpretation}
                    </span>
                  </div>
                </div>

                <div className="h-2 bg-surface-sunken rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, dim.normalizedScore)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-text-tertiary pt-1">
                  <span>Raw Score: {dim.rawScore} / {dim.maxScore} pts</span>
                  <span className="text-text-secondary font-medium">Link: {dim.strongestCareerLink}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB 4: Career Clusters */}
      {activeTab === "clusters" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-surface-card border border-border-default">
            <h2 className="text-base font-bold text-text-primary">
              Humanities Career Clusters & Specializations
            </h2>
            <p className="text-xs text-text-tertiary">
              Detailed exploration of job roles, higher education degrees, emerging domains, and foundational competencies across each career family.
            </p>
          </div>

          <div className="space-y-6">
            {(Object.keys(CAREER_CLUSTERS_DETAILS) as HumanitiesFamilyCode[]).map((fCode) => {
              const cluster = CAREER_CLUSTERS_DETAILS[fCode];
              const theme = FAMILY_THEMES[fCode];
              const familyScore = result.familyScores[fCode];

              return (
                <div
                  key={fCode}
                  className="rounded-3xl border border-border-default bg-surface-card p-6 sm:p-8 space-y-6 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-surface-elevated shadow-xs">
                        {theme.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-text-primary">{cluster.pathwayTitle}</h3>
                        <p className="text-xs text-text-tertiary leading-relaxed mt-0.5">
                          {cluster.description}
                        </p>
                      </div>
                    </div>
                    {familyScore && (
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${theme.badgeBg}`}>
                          {familyScore.alignment}
                        </span>
                        <span className="text-xl font-black text-text-primary">
                          {familyScore.displayPercentage}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    {/* Sample Roles */}
                    <div className="p-4 rounded-2xl bg-surface-sunken space-y-2.5">
                      <div className="font-bold text-text-primary flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-primary" />
                        <span>Core Job Roles</span>
                      </div>
                      <ul className="space-y-1.5 text-text-secondary">
                        {cluster.sampleRoles.map((role, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-1.5">
                            <span className="text-primary mt-1">•</span>
                            <span>{role}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Emerging Domains */}
                    <div className="p-4 rounded-2xl bg-surface-sunken space-y-2.5">
                      <div className="font-bold text-text-primary flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Emerging Domains</span>
                      </div>
                      <ul className="space-y-1.5 text-text-secondary">
                        {cluster.emergingDomains.map((dom, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-1.5">
                            <span className="text-amber-500 mt-1">•</span>
                            <span>{dom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Degree Options */}
                    <div className="p-4 rounded-2xl bg-surface-sunken space-y-2.5">
                      <div className="font-bold text-text-primary flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Degree Pathways</span>
                      </div>
                      <ul className="space-y-1.5 text-text-secondary">
                        {cluster.degreeOptions.map((deg, degIdx) => (
                          <li key={degIdx} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 mt-1">•</span>
                            <span>{deg}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Core Skills */}
                    <div className="p-4 rounded-2xl bg-surface-sunken space-y-2.5">
                      <div className="font-bold text-text-primary flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-purple-500" />
                        <span>Essential Skills</span>
                      </div>
                      <ul className="space-y-1.5 text-text-secondary">
                        {cluster.coreSkills.map((sk, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-1.5">
                            <span className="text-purple-500 mt-1">•</span>
                            <span>{sk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. TAB 5: Academic Review */}
      {activeTab === "academic" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-surface-card border border-border-default">
            <h2 className="text-base font-bold text-text-primary">
              Academic Roadmap & Subject Guidance
            </h2>
            <p className="text-xs text-text-tertiary">
              Recommendations for Senior Secondary subject combinations, competitive entrance examinations, and skill-building electives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject Selection Strategy */}
            <div className="rounded-3xl border border-border-default bg-surface-card p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Senior Secondary Subject Strategy</span>
              </div>
              <ul className="space-y-3 text-xs text-text-secondary">
                {result.guidance.academicSubjectGuidance.map((guide, gIdx) => (
                  <li key={gIdx} className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-sunken">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{guide}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Entrance Examinations & College Admissions */}
            <div className="rounded-3xl border border-border-default bg-surface-card p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Key Entrance Exams & Admissions</span>
              </div>
              <div className="space-y-3 text-xs text-text-secondary">
                <div className="p-3 rounded-xl bg-surface-sunken space-y-1">
                  <span className="font-bold text-text-primary block">Law: CLAT, AILET, SLAT, LSAT</span>
                  <p className="text-text-secondary">For 5-year integrated BA LLB / BBA LLB programs at National Law Universities and premier law faculties.</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-sunken space-y-1">
                  <span className="font-bold text-text-primary block">Central Universities: CUET UG</span>
                  <p className="text-text-secondary">For BA Honours (Psychology, Political Science, Economics, History, English, Journalism) at central and state universities.</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-sunken space-y-1">
                  <span className="font-bold text-text-primary block">Design & Media: NID DAT, UCEED, NIFT</span>
                  <p className="text-text-secondary">For visual communication, animation, interactive design, and media arts programs.</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-sunken space-y-1">
                  <span className="font-bold text-text-primary block">Social Sciences: TISS-BAT, HSEE / IIT Madras</span>
                  <p className="text-text-secondary">For integrated MA programs in Development Studies, Social Work, and Humanities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB 6: Counsellor Guide */}
      {activeTab === "counsellor" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-surface-card border border-border-default">
            <h2 className="text-base font-bold text-text-primary">
              Counsellor & Educator Decision Framework
            </h2>
            <p className="text-xs text-text-tertiary">
              Structured guidance derived from the official Humanities Career Finder specification sheets.
            </p>
          </div>

          {/* Do's and Don'ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Do Guidelines */}
            <div className="rounded-3xl border border-emerald-300/40 dark:border-emerald-700/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Recommended Counselling Actions (Do's)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-text-secondary">
                {result.guidance.doGuidelines.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-white/80 dark:bg-surface-elevated">
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Avoid Guidelines */}
            <div className="rounded-3xl border border-rose-300/40 dark:border-rose-700/40 bg-rose-50/50 dark:bg-rose-950/20 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-800 dark:text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Practices to Avoid (Don'ts)</span>
              </div>
              <ul className="space-y-2.5 text-xs text-text-secondary">
                {result.guidance.avoidGuidelines.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-white/80 dark:bg-surface-elevated">
                    <span className="text-rose-500 font-bold shrink-0 mt-0.5">✗</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Counsellor Principles Table */}
          <div className="rounded-3xl border border-border-default bg-surface-card p-6 space-y-4 shadow-xs overflow-hidden">
            <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
              <Scale className="w-4 h-4 text-primary" />
              <span>Counselling Principles by Assessment Area</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-surface-sunken text-text-secondary font-bold">
                  <tr>
                    <th className="p-3 rounded-l-xl">Assessment Area</th>
                    <th className="p-3">Interpretation Focus</th>
                    <th className="p-3">Recommended Approach</th>
                    <th className="p-3 rounded-r-xl">Pitfalls to Avoid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {result.guidance.counsellorPrinciples.map((cp, idx) => (
                    <tr key={idx} className="hover:bg-surface-sunken/40 transition-colors">
                      <td className="p-3 font-bold text-text-primary">{cp.area}</td>
                      <td className="p-3 text-text-secondary leading-relaxed">{cp.interpretation}</td>
                      <td className="p-3 text-emerald-700 dark:text-emerald-300 leading-relaxed">{cp.doText}</td>
                      <td className="p-3 text-rose-700 dark:text-rose-300 leading-relaxed">{cp.avoidText}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 9. TAB 7: Milestone History */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-surface-card border border-border-default">
            <h2 className="text-base font-bold text-text-primary">
              Assessment Milestone Timeline
            </h2>
            <p className="text-xs text-text-tertiary">
              Track progression, past attempts, and consistency signals across retest sessions.
            </p>
          </div>

          <AssessmentTimeline
            history={historyData?.history || []}
          />
        </div>
      )}

      {/* Retake Confirmation Modal */}
      <RetakeConfirmationModal
        isOpen={isRetakeModalOpen}
        onClose={() => setIsRetakeModalOpen(false)}
        onConfirm={handleStartRetake}
        assessmentName="Humanities Career Finder"
        isPending={retakeMutation.isPending}
      />
    </div>
  );
};
