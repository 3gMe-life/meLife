"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, GraduationCap } from "lucide-react";
import { DashboardIcon } from "../common/DashboardIcon";
import { getNavigationForRole } from "../../config/navigation.config";
import type { UserRole } from "../../../auth/types/auth.types";

interface DashboardSidebarProps {
  role?: UserRole;
  educationStage?: string | null;
}

export function DashboardSidebar({
  role = "PARTICIPANT",
  educationStage,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const navigation = getNavigationForRole(role);

  const formatStageLabel = (stage?: string | null) => {
    if (!stage) return "Student Profile";
    return stage
      .replace("grade_", "Class ")
      .replace("college", "Higher Ed")
      .replace("_", " ")
      .toUpperCase();
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white/95 dark:bg-slate-950/80 backdrop-blur-2xl border-r border-slate-200 dark:border-white/10 h-screen sticky top-0 z-40 select-none text-slate-900 dark:text-white transition-colors duration-200">
      {/* 1. Brand Logo Header */}
      <div className="h-18 flex items-center px-6 border-b border-slate-200 dark:border-white/10 justify-between">
        <Link href="/participant/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#14B8A6] flex items-center justify-center font-black text-sm text-white shadow-lg shadow-[#2563EB]/25 group-hover:scale-105 transition-transform duration-200">
            3G
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              <span>MeLife</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]" />
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Student Portal
            </span>
          </div>
        </Link>
      </div>

      {/* 2. Navigation List */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 custom-scrollbar">
        {navigation.map((section) => (
          <div key={section.id} className="space-y-1">
            {section.title && (
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {section.title}
              </h3>
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = item.isExact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                      isActive
                        ? "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-md shadow-[#2563EB]/20"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 dark:text-slate-400 group-hover:text-[#2563EB] dark:group-hover:text-[#14B8A6]"
                        }`}
                      >
                        <DashboardIcon name={item.icon} className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#2563EB]/10 dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#2563EB]/30"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Bottom Education Stage Banner & User Snapshot */}
      <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/40 transition-colors duration-200">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-[#2563EB]/10 via-transparent to-[#14B8A6]/10 dark:from-[#2563EB]/15 dark:to-[#14B8A6]/10 border border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-none">
                  {formatStageLabel(educationStage)}
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400">Calibrated Stage</span>
              </div>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-[#14B8A6] animate-pulse" />
          </div>

          <Link
            href="/participant/assessments"
            className="block text-center text-[10px] font-bold text-[#2563EB] dark:text-[#14B8A6] hover:text-[#1D4ED8] dark:hover:text-[#2DD4BF] hover:underline transition-colors mt-1"
          >
            Explore Next Assessment →
          </Link>
        </div>
      </div>
    </aside>
  );
}
