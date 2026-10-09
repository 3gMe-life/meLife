import { AssessmentProductCode } from "@/features/assessments/types/assessment.types";
import {
  Compass,
  GraduationCap,
  Wrench,
  TrendingUp,
  BookOpen,
  Sparkles,
  Bot,
  Rocket,
  FileText,
} from "lucide-react";

export type ReportDisplayType = "FORMAL_REPORT" | "PSYCHOMETRIC_INSIGHTS";

export interface AssessmentReportConfigItem {
  code: AssessmentProductCode | string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  colorScheme: {
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    iconBg: string;
    iconText: string;
    accentColor: string;
  };
  reportType: ReportDisplayType;
  formalReportSupported: boolean;
  pdfSupported: boolean;
  getReportRoute: (attemptId: string, resultId?: string, reportId?: string) => string;
  getResultRoute: (attemptId: string) => string;
}

export const ASSESSMENT_REPORT_REGISTRY: Record<
  AssessmentProductCode | string,
  AssessmentReportConfigItem
> = {
  SKILL_FINDER: {
    code: "SKILL_FINDER",
    title: "Skill Finder Assessment Report",
    shortTitle: "Skill Finder",
    tagline: "Cognitive Aptitude, RIASEC Orientation & Core Learning Behaviors",
    description:
      "Detailed psychometric evaluation of learning behaviors, cognitive aptitude accuracy, and developmental opportunities from your assessment attempts.",
    category: "Cognitive & Behavioural Foundations",
    icon: Sparkles,
    colorScheme: {
      badgeBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
      badgeText: "text-cyan-700 dark:text-cyan-300",
      badgeBorder: "border-cyan-500/30",
      iconBg: "bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400",
      iconText: "text-cyan-600 dark:text-cyan-400",
      accentColor: "#00BFA5",
    },
    reportType: "FORMAL_REPORT",
    formalReportSupported: true,
    pdfSupported: true,
    getReportRoute: (_attemptId, _resultId, reportId) =>
      reportId ? `/participant/reports/${reportId}` : `/participant/reports/skill-finder`,
    getResultRoute: (attemptId) => `/participant/results/${attemptId}`,
  },

  STREAM_FINDER: {
    code: "STREAM_FINDER",
    title: "Stream Finder Assessment Report",
    shortTitle: "Stream Finder",
    tagline: "Academic Stream & Subject Affinity Analysis",
    description:
      "Evaluates subject-level affinity, cognitive readiness, and curricular alignment for Grade 11-12 stream selection across Science, Commerce, and Humanities.",
    category: "Academic Stream Selection",
    icon: GraduationCap,
    colorScheme: {
      badgeBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      badgeText: "text-indigo-700 dark:text-indigo-300",
      badgeBorder: "border-indigo-500/30",
      iconBg: "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400",
      iconText: "text-indigo-600 dark:text-indigo-400",
      accentColor: "#6366F1",
    },
    reportType: "PSYCHOMETRIC_INSIGHTS",
    formalReportSupported: false,
    pdfSupported: false,
    getReportRoute: (attemptId) => `/participant/results/${attemptId}`,
    getResultRoute: (attemptId) => `/participant/results/${attemptId}`,
  },

  ENGINEERING_BRANCH_FINDER: {
    code: "ENGINEERING_BRANCH_FINDER",
    title: "Engineering Branch Finder Report",
    shortTitle: "Engineering Branch Finder",
    tagline: "Specialization Fit & Engineering Discipline Matrix",
    description:
      "Deep-dive mapping of analytical thinking, systems reasoning, and technical passions to optimal engineering branches (CS, AI, Mechanical, Electrical, Biotech).",
    category: "Engineering & STEM Disciplines",
    icon: Wrench,
    colorScheme: {
      badgeBg: "bg-blue-500/10 dark:bg-blue-500/20",
      badgeText: "text-blue-700 dark:text-blue-300",
      badgeBorder: "border-blue-500/30",
      iconBg: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
      iconText: "text-blue-600 dark:text-blue-400",
      accentColor: "#3B82F6",
    },
    reportType: "FORMAL_REPORT",
    formalReportSupported: true,
    pdfSupported: false,
    getReportRoute: (attemptId) => `/participant/results/${attemptId}`,
    getResultRoute: (attemptId) => `/participant/results/${attemptId}`,
  },

  COMMERCE_CAREER_FINDER: {
    code: "COMMERCE_CAREER_FINDER",
    title: "Commerce Career Finder Report",
    shortTitle: "Commerce Career Finder",
    tagline: "Finance, Management & Quantitative Strategy Pathways",
    description:
      "Evaluates commercial acumen, numerical reasoning, risk evaluation, and organizational instincts across financial, managerial, and corporate disciplines.",
    category: "Commerce, Finance & Management",
    icon: TrendingUp,
    colorScheme: {
      badgeBg: "bg-amber-500/10 dark:bg-amber-500/20",
      badgeText: "text-amber-700 dark:text-amber-300",
      badgeBorder: "border-amber-500/30",
      iconBg: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
      iconText: "text-amber-600 dark:text-amber-400",
      accentColor: "#F59E0B",
    },
    reportType: "FORMAL_REPORT",
    formalReportSupported: true,
    pdfSupported: false,
    getReportRoute: (attemptId) => `/participant/results/${attemptId}`,
    getResultRoute: (attemptId) => `/participant/results/${attemptId}`,
  },

  HUMANITIES_CAREER_FINDER: {
    code: "HUMANITIES_CAREER_FINDER",
    title: "Humanities Career Finder Report",
    shortTitle: "Humanities Career Finder",
    tagline: "Social Impact, Law, Policy, Media & Creative Expression",
    description:
      "Synthesizes verbal fluency, empathetic reasoning, societal analysis, and communication strengths for careers in public policy, journalism, law, and creative arts.",
    category: "Humanities, Law & Public Policy",
    icon: BookOpen,
    colorScheme: {
      badgeBg: "bg-rose-500/10 dark:bg-rose-500/20",
      badgeText: "text-rose-700 dark:text-rose-300",
      badgeBorder: "border-rose-500/30",
      iconBg: "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400",
      iconText: "text-rose-600 dark:text-rose-400",
      accentColor: "#F43F5E",
    },
    reportType: "FORMAL_REPORT",
    formalReportSupported: true,
    pdfSupported: false,
    getReportRoute: (attemptId) => `/participant/results/${attemptId}`,
    getResultRoute: (attemptId) => `/participant/results/${attemptId}`,
  },

  RIGHT_CAREER_FINDER: {
    code: "RIGHT_CAREER_FINDER",
    title: "Right Career Finder Report",
    shortTitle: "Right Career Finder",
    tagline: "Multidisciplinary Vocational & Holistic Career Match Matrix",
    description:
      "Holistic psychometric synthesis aligning core personality traits, work values, and functional strengths with curated career families.",
    category: "Vocational & Holistic Career Fit",
    icon: Compass,
    colorScheme: {
      badgeBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      badgeText: "text-emerald-700 dark:text-emerald-300",
      badgeBorder: "border-emerald-500/30",
      iconBg: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
      iconText: "text-emerald-600 dark:text-emerald-400",
      accentColor: "#10B981",
    },
    reportType: "FORMAL_REPORT",
    formalReportSupported: true,
    pdfSupported: false,
    getReportRoute: (attemptId) => `/participant/results/${attemptId}`,
    getResultRoute: (attemptId) => `/participant/results/${attemptId}`,
  },

  AI_JOB_RISK_FINDER: {
    code: "AI_JOB_RISK_FINDER",
    title: "AI Job Risk & Future of Work Index",
    shortTitle: "AI Job Risk Finder",
    tagline: "Automation Vulnerability & Career Resilience Forecast",
    description:
      "Assesses automation vulnerability for chosen fields and outlines future-proof human capabilities required in the 2030+ algorithmic landscape.",
    category: "Future of Work & AI Readiness",
    icon: Bot,
    colorScheme: {
      badgeBg: "bg-purple-500/10 dark:bg-purple-500/20",
      badgeText: "text-purple-700 dark:text-purple-300",
      badgeBorder: "border-purple-500/30",
      iconBg: "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
      iconText: "text-purple-600 dark:text-purple-400",
      accentColor: "#A855F7",
    },
    reportType: "PSYCHOMETRIC_INSIGHTS",
    formalReportSupported: false,
    pdfSupported: false,
    getReportRoute: (attemptId) => `/participant/results/${attemptId}`,
    getResultRoute: (attemptId) => `/participant/results/${attemptId}`,
  },

  ENTREPRENEUR_DEVELOPMENT_TEST: {
    code: "ENTREPRENEUR_DEVELOPMENT_TEST",
    title: "Entrepreneur Development & Venture Readiness Report",
    shortTitle: "Entrepreneur Test",
    tagline: "Innovation Drive, Risk Tolerance & Founder Capabilities",
    description:
      "Diagnostic evaluation of founder mindset, opportunity recognition, perseverance, and leadership readiness for building new ventures.",
    category: "Venture Building & Leadership",
    icon: Rocket,
    colorScheme: {
      badgeBg: "bg-amber-500/10 dark:bg-amber-500/20",
      badgeText: "text-amber-800 dark:text-amber-200",
      badgeBorder: "border-amber-500/30",
      iconBg: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
      iconText: "text-amber-700 dark:text-amber-400",
      accentColor: "#D97706",
    },
    reportType: "FORMAL_REPORT",
    formalReportSupported: true,
    pdfSupported: false,
    getReportRoute: (attemptId) => `/participant/results/${attemptId}`,
    getResultRoute: (attemptId) => `/participant/results/${attemptId}`,
  },
};

export function getAssessmentReportConfig(code: string): AssessmentReportConfigItem {
  const normalized = String(code || "").toUpperCase().trim();
  if (ASSESSMENT_REPORT_REGISTRY[normalized]) {
    return ASSESSMENT_REPORT_REGISTRY[normalized];
  }

  // Fallback for custom or newly added assessment codes
  const fallbackTitle = normalized
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  return {
    code: normalized,
    title: `${fallbackTitle} Assessment Report`,
    shortTitle: fallbackTitle,
    tagline: "Psychometric Evaluation & Dimension Analytics",
    description: "Multidimensional assessment evaluation snapshot and personalized capability matrix.",
    category: "Psychometric Assessment",
    icon: FileText,
    colorScheme: {
      badgeBg: "bg-teal-500/10 dark:bg-teal-500/20",
      badgeText: "text-teal-700 dark:text-teal-300",
      badgeBorder: "border-teal-500/30",
      iconBg: "bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400",
      iconText: "text-teal-600 dark:text-teal-400",
      accentColor: "#00BFA5",
    },
    reportType: "PSYCHOMETRIC_INSIGHTS",
    formalReportSupported: false,
    pdfSupported: false,
    getReportRoute: (attemptId) => `/participant/results/${attemptId}`,
    getResultRoute: (attemptId) => `/participant/results/${attemptId}`,
  };
}
