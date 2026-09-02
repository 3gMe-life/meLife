"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { DashboardUserMenu } from "./DashboardUserMenu";
import { ThemeToggle } from "./ThemeToggle";
import { VoucherRedeemModal } from "../common/VoucherRedeemModal";
import type { UserProfile, UserRole } from "../../../auth/types/auth.types";

interface DashboardHeaderProps {
  user: UserProfile;
  role?: UserRole;
  onMobileMenuToggle: () => void;
}

export function DashboardHeader({
  user,
  role = "PARTICIPANT",
  onMobileMenuToggle,
}: DashboardHeaderProps) {
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  return (
    <>
      <VoucherRedeemModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
      />

      <header className="h-18 px-4 sm:px-8 bg-white/80 dark:bg-slate-950/60 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 sticky top-0 z-30 flex items-center justify-between text-slate-900 dark:text-white select-none transition-colors duration-200">
        {/* Left: Mobile Toggle & Brand / Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors lg:hidden cursor-pointer"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Portal</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-bold">Dashboard</span>
          </div>
        </div>

        {/* Right: Quick Actions, Theme Toggle & User Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Action: Redeem Assessment Voucher */}
          {role === "PARTICIPANT" && (
            <button
              type="button"
              onClick={() => setIsVoucherModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#2563EB]/10 dark:bg-[#2563EB]/20 hover:bg-[#2563EB]/20 dark:hover:bg-[#2563EB]/30 border border-[#2563EB]/20 dark:border-[#2563EB]/30 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] transition-all duration-200 cursor-pointer shadow-2xs group"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#14B8A6] group-hover:rotate-12 transition-transform" />
              <span>Redeem Code</span>
            </button>
          )}

          {/* Quick Assessment CTA */}
          {role === "PARTICIPANT" && (
            <Link
              href="/participant/assessments"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-bold text-white transition-colors shadow-sm shadow-[#2563EB]/25"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Take Assessment</span>
            </Link>
          )}

          {/* Theme Switcher Toggle */}
          <ThemeToggle />

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              type="button"
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#14B8A6] ring-2 ring-white dark:ring-slate-950" />
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-white/10" />

          {/* User Profile Menu */}
          <DashboardUserMenu user={user} role={role} />
        </div>
      </header>
    </>
  );
}
