"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell } from "lucide-react";
import { ThemeToggle } from "@/features/dashboard/components/shell/ThemeToggle";
import { DashboardUserMenu } from "@/features/dashboard/components/shell/DashboardUserMenu";
import { toast } from "@/components/ui/toast";
import type { UserProfile, UserRole } from "@/features/auth/types/auth.types";
import { useCounsellorOverview } from "../../hooks/useCounsellorQueries";

interface CounsellorHeaderProps {
  user: UserProfile;
  role?: UserRole;
  onMobileMenuToggle: () => void;
}

export function CounsellorHeader({
  user,
  role = "CAREER_COUNSELLOR",
  onMobileMenuToggle,
}: CounsellorHeaderProps) {
  const pathname = usePathname();
  const { data: overview } = useCounsellorOverview();

  const getPageTitle = (path: string) => {
    if (path === "/counsellor/dashboard" || path === "/counsellor") {
      return "Counsellor Dashboard";
    }
    if (path.startsWith("/counsellor/sessions")) {
      return "Guidance Sessions";
    }
    if (path.startsWith("/counsellor/students")) {
      return "Assigned Students";
    }
    if (path.startsWith("/counsellor/calendar")) {
      return "Calendar & Availability";
    }
    if (path.startsWith("/counsellor/reports")) {
      return "Student Assessment Reports";
    }
    if (path.startsWith("/counsellor/reviews")) {
      return "Reviews & Feedback";
    }
    if (path.startsWith("/counsellor/profile")) {
      return "Counsellor Profile & Slots";
    }
    if (path.startsWith("/counsellor/settings")) {
      return "Practice Settings";
    }
    return "Counsellor Portal";
  };

  const counsellorName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Career Counsellor";
  const qualification = overview?.counsellorProfile?.qualification;
  const pendingCount = overview?.stats?.pendingRequestsCount || 0;

  return (
    <header className="mx-4 sm:mx-6 lg:mx-8 mt-3.5 sm:mt-4 mb-1 h-16 sm:h-[68px] px-4 sm:px-6 bg-white/95 dark:bg-[#112423]/95 backdrop-blur-xl border border-[#E3ECEA] dark:border-white/10 rounded-2xl sm:rounded-[22px] shadow-sm shadow-[#172B2A]/5 dark:shadow-black/25 sticky top-3 sm:top-4 z-40 flex items-center justify-between text-[#172B2A] dark:text-[#F7FAF9] select-none transition-all duration-200">
      {/* 1. Left: Brand Logo & Mobile Trigger */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="p-2 rounded-xl text-[#526866] hover:text-[#172B2A] dark:text-[#9FB3B0] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors lg:hidden cursor-pointer"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* 3G MeLife Brand Logo */}
        <Link
          href="/counsellor/dashboard"
          className="flex items-center gap-2.5 group shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center font-black text-xs text-[#172B2A] shadow-xs group-hover:scale-105 transition-transform duration-200">
            3G
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-1 leading-none">
              <span>MeLife</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA5]" />
            </span>
            <span className="text-[9px] font-bold text-[#008F83] dark:text-[#00BFA5] tracking-wider uppercase leading-tight mt-0.5">
              Counsellor Portal
            </span>
          </div>
        </Link>
      </div>

      {/* 2. Middle: Dynamic Page Title Breadcrumb & Counsellor Credential Pill */}
      <div className="hidden md:flex items-center gap-3">
        <div className="h-5 w-px bg-[#E3ECEA] dark:bg-white/10" />
        <div className="flex flex-col">
          <h2 className="text-xs sm:text-sm font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight leading-tight">
            {getPageTitle(pathname)}
          </h2>
          <span className="text-[10px] text-[#526866] dark:text-[#9FB3B0] leading-none mt-0.5">
            {counsellorName} {qualification ? `• ${qualification}` : ""}
          </span>
        </div>
      </div>

      {/* 3. Right: Controls, Notifications & Profile Menu */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <ThemeToggle />

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              toast.info(`Counsellor Alerts (${pendingCount > 0 ? `${pendingCount} Pending` : "All Clear"})`, {
                description:
                  pendingCount > 0
                    ? `You have ${pendingCount} pending session request(s) waiting for review.`
                    : "Your session schedule is synchronized and up to date.",
              })
            }
            className="w-9 h-9 rounded-xl bg-[#F4F8F7] hover:bg-[#EBF2F0] dark:bg-white/5 dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-[#526866] hover:text-[#172B2A] dark:text-[#9FB3B0] dark:hover:text-[#F7FAF9] flex items-center justify-center transition-colors cursor-pointer relative"
            aria-label="Counsellor Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-white dark:ring-[#112423]">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        <div className="h-5 w-px bg-[#E3ECEA] dark:bg-white/10 mx-0.5" />

        {/* User Profile Menu */}
        <DashboardUserMenu user={user} role={role} />
      </div>
    </header>
  );
}
