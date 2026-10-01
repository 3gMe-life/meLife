"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  Compass,
  Calendar,
  KeyRound,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";
import { useFeatureAccess } from "@/features/access-control/hooks/useFeatureAccess";

interface NextStepItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  onClick?: () => void;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  badge: string;
  badgeColor: string;
}

interface RecommendedNextStepsProps {
  completedAssessments: number;
  isProfileIncomplete?: boolean;
  onOpenVoucherModal: () => void;
}

export function RecommendedNextSteps({
  completedAssessments,
  isProfileIncomplete = false,
  onOpenVoucherModal,
}: RecommendedNextStepsProps) {
  const { canAccess } = useFeatureAccess();
  // Dynamically assemble actionable steps based on current state
  const steps: NextStepItem[] = [];

  if (isProfileIncomplete) {
    steps.push({
      id: "complete-onboarding",
      title: "Complete Demographic Profile",
      subtitle: "Calibrate grade and age matrix",
      href: "/participant/onboarding",
      icon: Sparkles,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-500/15 border-amber-500/30",
      badge: "High",
      badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    });
  }

  if (completedAssessments === 0) {
    steps.push({
      id: "take-skill-finder",
      title: "Take Skill Finder Assessment",
      subtitle: "~30 mins multidimensional battery",
      href: "/participant/assessments/skill-finder",
      icon: BookOpen,
      iconColor: "text-[#008F83] dark:text-[#00BFA5]",
      iconBg: "bg-[#00BFA5]/15 border-[#00BFA5]/30",
      badge: "Action",
      badgeColor: "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/30",
    });
  } else {
    steps.push({
      id: "view-report",
      title: "Review Official Guidance Report",
      subtitle: "Comprehensive 3-page PDF dossier",
      href: "/participant/career-reports",
      icon: FileText,
      iconColor: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-500/15 border-indigo-500/30",
      badge: "Ready",
      badgeColor: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30",
    });

    steps.push({
      id: "explore-pathways",
      title: "Explore Recommended Pathways",
      subtitle: "AI, Bio-Informatics & Economics",
      href: "/participant/pathways",
      icon: Compass,
      iconColor: "text-[#008F83] dark:text-[#00B8D4]",
      iconBg: "bg-[#00B8D4]/15 border-[#00B8D4]/30",
      badge: "High",
      badgeColor: "bg-[#00B8D4]/15 text-[#008F83] dark:text-[#00B8D4] border-[#00B8D4]/30",
    });

    if (canAccess("participant.counsellor")) {
      steps.push({
        id: "book-counselor",
        title: "1-on-1 Guidance Session",
        subtitle: "Review results with a certified advisor",
        href: "/participant/counsellor",
        icon: Calendar,
        iconColor: "text-emerald-600 dark:text-emerald-400",
        iconBg: "bg-emerald-500/15 border-emerald-500/30",
        badge: "Medium",
        badgeColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
      });
    }
  }

  // Always offer voucher redemption as a step
  steps.push({
    id: "redeem-voucher",
    title: "Redeem Assessment Voucher",
    subtitle: "Unlock institution sponsored tests",
    href: "#",
    onClick: onOpenVoucherModal,
    icon: KeyRound,
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-500/15 border-purple-500/30",
    badge: "Code",
    badgeColor: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
  });

  return (
    <div className="rounded-3xl bg-white dark:bg-[#172B2A] border border-[#E3ECEA] dark:border-white/10 p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all duration-200 space-y-4">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight">
            Upcoming Next Steps
          </h3>
          <p className="text-[11px] text-[#728B88] dark:text-[#7D9491]">
            Curated actions for your career roadmap
          </p>
        </div>
      </div>

      {/* 2. List of Next Steps */}
      <div className="space-y-2.5">
        {steps.map((step) => {
          const Icon = step.icon;
          const content = (
            <div className="p-3 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 hover:border-[#00BFA5]/40 hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-all duration-200 flex items-center justify-between gap-3 group cursor-pointer">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${step.iconBg} ${step.iconColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h4 className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] truncate group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5] transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-[#728B88] dark:text-[#7D9491] truncate">
                    {step.subtitle}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shrink-0 uppercase tracking-wider ${step.badgeColor}`}
              >
                {step.badge}
              </span>
            </div>
          );

          if (step.onClick) {
            return (
              <button
                key={step.id}
                type="button"
                onClick={step.onClick}
                className="w-full text-left"
              >
                {content}
              </button>
            );
          }

          return (
            <Link key={step.id} href={step.href} className="block">
              {content}
            </Link>
          );
        })}
      </div>

      {/* 3. Footer Link */}
      <div className="pt-2 border-t border-[#E3ECEA] dark:border-white/10">
        <Link
          href="/participant/assessments"
          className="w-full text-center text-xs font-bold text-[#008F83] dark:text-[#00BFA5] hover:text-[#00BFA5] dark:hover:text-[#00C896] hover:underline flex items-center justify-center gap-1 transition-colors"
        >
          <span>View all tasks & modules</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
