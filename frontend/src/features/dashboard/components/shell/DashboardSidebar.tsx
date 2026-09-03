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
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#0D1C1B]/95 backdrop-blur-2xl border-r border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] h-screen sticky top-0 z-40 select-none text-[#172B2A] dark:text-[#F7FAF9] transition-colors duration-200">
      {/* 1. Brand Logo Header */}
      <div className="h-18 flex items-center px-6 border-b border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] justify-between">
        <Link href="/participant/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center font-black text-sm text-[#172B2A] shadow-md shadow-[#00BFA5]/20 group-hover:scale-105 transition-transform duration-200">
            3G
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-1">
              <span>MeLife</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA5]" />
            </span>
            <span className="text-[10px] font-bold text-[#008F83] dark:text-[#00BFA5] tracking-wider uppercase">
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
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-2">
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
                        ? "bg-[#00BFA5] text-[#172B2A] font-bold shadow-md shadow-[#00BFA5]/25"
                        : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`transition-colors ${
                          isActive
                            ? "text-[#172B2A]"
                            : "text-[#728B88] dark:text-[#7D9491] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5]"
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
                            ? "bg-[#172B2A] text-white"
                            : "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border border-[#00BFA5]/30"
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
      <div className="p-4 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] bg-[#F7FAF9] dark:bg-[#172B2A] transition-colors duration-200">
        <div className="p-3 rounded-2xl bg-white dark:bg-[#0D1C1B]/60 border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#172B2A] dark:text-[#F7FAF9] leading-none">
                  {formatStageLabel(educationStage)}
                </span>
                <span className="text-[9px] text-[#728B88] dark:text-[#7D9491]">Calibrated Stage</span>
              </div>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-[#00BFA5] animate-pulse" />
          </div>

          <Link
            href="/participant/assessments"
            className="block text-center text-[10px] font-bold text-[#008F83] dark:text-[#00BFA5] hover:text-[#00BFA5] dark:hover:text-[#00C896] hover:underline transition-colors mt-1"
          >
            Explore Next Assessment →
          </Link>
        </div>
      </div>
    </aside>
  );
}
