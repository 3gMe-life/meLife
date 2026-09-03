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

      <header className="h-18 px-4 sm:px-8 bg-white/90 dark:bg-[#0D1C1B]/85 backdrop-blur-2xl border-b border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] sticky top-0 z-30 flex items-center justify-between text-[#172B2A] dark:text-[#F7FAF9] select-none transition-colors duration-200">
        {/* Left: Mobile Toggle & Brand / Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="p-2 rounded-xl text-[#526866] hover:text-[#172B2A] dark:text-[#9FB3B0] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors lg:hidden cursor-pointer"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#526866] dark:text-[#9FB3B0]">
            <span>Portal</span>
            <span>/</span>
            <span className="text-[#172B2A] dark:text-[#F7FAF9] font-bold">Dashboard</span>
          </div>
        </div>

        {/* Right: Quick Actions, Theme Toggle & User Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick Action: Redeem Assessment Voucher */}
          {role === "PARTICIPANT" && (
            <button
              type="button"
              onClick={() => setIsVoucherModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00BFA5]/10 dark:bg-[#00BFA5]/20 hover:bg-[#00BFA5]/20 dark:hover:bg-[#00BFA5]/30 border border-[#00BFA5]/30 text-xs font-semibold text-[#008F83] dark:text-[#00BFA5] transition-all duration-200 cursor-pointer shadow-2xs group"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#00B8D4] group-hover:rotate-12 transition-transform" />
              <span>Redeem Code</span>
            </button>
          )}

          {/* Quick Assessment CTA */}
          {role === "PARTICIPANT" && (
            <Link
              href="/participant/assessments"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00BFA5] hover:bg-[#008F83] text-xs font-semibold text-[#172B2A] hover:text-white transition-all shadow-sm shadow-[#00BFA5]/20"
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
              className="p-2 rounded-2xl bg-[#EBF2F0] hover:bg-[#E3ECEA] dark:bg-white/5 dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] text-[#526866] hover:text-[#172B2A] dark:text-[#9FB3B0] dark:hover:text-[#F7FAF9] transition-colors cursor-pointer relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00BFA5] ring-2 ring-white dark:ring-[#0D1C1B]" />
            </button>
          </div>

          <div className="h-5 w-px bg-[#E3ECEA] dark:bg-[rgba(227,236,234,0.1)]" />

          {/* User Profile Menu */}
          <DashboardUserMenu user={user} role={role} />
        </div>
      </header>
    </>
  );
}
