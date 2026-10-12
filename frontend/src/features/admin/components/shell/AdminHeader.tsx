"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, Shield, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/features/dashboard/components/shell/ThemeToggle";
import { DashboardUserMenu } from "@/features/dashboard/components/shell/DashboardUserMenu";
import { toast } from "@/components/ui/toast";
import type { UserProfile, UserRole } from "@/features/auth/types/auth.types";

interface AdminHeaderProps {
  user: UserProfile;
  role?: UserRole;
  onMobileMenuToggle: () => void;
}

export function AdminHeader({
  user,
  role = "PLATFORM_ADMIN",
  onMobileMenuToggle,
}: AdminHeaderProps) {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path === "/admin/dashboard" || path === "/admin") {
      return "Platform Overview & Analytics";
    }
    if (path.startsWith("/admin/counsellors")) {
      return "Counsellor Verifications & Directory";
    }
    if (path.startsWith("/admin/users")) {
      return "User Directory & Account Controls";
    }
    if (path.startsWith("/admin/students")) {
      return "Student Cohort Management";
    }
    if (path.startsWith("/admin/sessions")) {
      return "Counselling Sessions Hub";
    }
    if (path.startsWith("/admin/reports")) {
      return "Psychometric & Career Reports";
    }
    if (path.startsWith("/admin/roles-permissions") || path.startsWith("/admin/roles")) {
      return "Role & Permission Security Matrix";
    }
    if (path.startsWith("/admin/settings")) {
      return "Platform Configuration & Settings";
    }
    return "Administration Portal";
  };

  const adminName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Platform Admin";

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case "SUPER_ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Shield className="w-3 h-3 text-purple-600 dark:text-purple-400" /> Super Admin
          </span>
        );
      case "COMPANY_ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Company Admin
          </span>
        );
      case "PLATFORM_ADMIN":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            <ShieldCheck className="w-3 h-3 text-teal-600 dark:text-teal-400" /> Platform Admin
          </span>
        );
    }
  };

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
          href="/admin/dashboard"
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
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* 2. Middle: Dynamic Page Title & Admin Credential Pill */}
      <div className="hidden md:flex items-center gap-3">
        <div className="h-5 w-px bg-[#E3ECEA] dark:bg-white/10" />
        <div className="flex flex-col">
          <h2 className="text-xs sm:text-sm font-black text-[#172B2A] dark:text-[#F7FAF9] tracking-tight leading-tight">
            {getPageTitle(pathname)}
          </h2>
          <span className="text-[10px] text-[#526866] dark:text-[#9FB3B0] leading-none mt-0.5">
            {adminName}
          </span>
        </div>
        <div>{getRoleBadge(role)}</div>
      </div>

      {/* 3. Right: System Controls, Notifications, Theme Toggle, Profile Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => {
            toast.info("System Notifications", {
              description: "All administrative audit logs and services operating normally.",
            });
          }}
          className="relative p-2 sm:p-2.5 rounded-xl text-[#526866] hover:text-[#172B2A] dark:text-[#9FB3B0] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Platform alerts"
        >
          <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>

        {/* Theme Toggle */}
        <div className="shrink-0">
          <ThemeToggle />
        </div>

        {/* User Profile Menu */}
        <div className="shrink-0 pl-1 border-l border-[#E3ECEA] dark:border-white/10">
          <DashboardUserMenu user={user} role={role} />
        </div>
      </div>
    </header>
  );
}
