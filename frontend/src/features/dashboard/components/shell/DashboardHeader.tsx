"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, Bell, Search } from "lucide-react";
import { DashboardUserMenu } from "./DashboardUserMenu";
import { ThemeToggle } from "./ThemeToggle";
import { toast } from "@/components/ui/toast";
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
  const [searchQuery, setSearchQuery] = useState("");

  const getHomeRoute = (r: UserRole) => {
    switch (r) {
      case "CAREER_COUNSELLOR":
        return "/counsellor/dashboard";
      case "SUPER_ADMIN":
      case "PLATFORM_ADMIN":
        return "/admin/dashboard";
      case "INSTITUTION_ADMIN":
        return "/institution/dashboard";
      case "PARENT_GUARDIAN":
        return "/parent/dashboard";
      default:
        return "/participant/dashboard";
    }
  };

  const getPortalLabel = (r: UserRole) => {
    switch (r) {
      case "CAREER_COUNSELLOR":
        return "Counsellor Portal";
      case "SUPER_ADMIN":
      case "PLATFORM_ADMIN":
        return "Admin Portal";
      case "INSTITUTION_ADMIN":
        return "Institution Portal";
      case "PARENT_GUARDIAN":
        return "Parent Portal";
      default:
        return "Student Portal";
    }
  };

  return (
    <header className="mx-4 sm:mx-6 lg:mx-8 mt-3.5 sm:mt-4 mb-1 h-16 sm:h-[68px] px-4 sm:px-6 bg-white/95 dark:bg-[#112423]/95 backdrop-blur-xl border border-[#E3ECEA] dark:border-white/10 rounded-2xl sm:rounded-[22px] shadow-sm shadow-[#172B2A]/5 dark:shadow-black/25 sticky top-3 sm:top-4 z-40 flex items-center justify-between text-[#172B2A] dark:text-[#F7FAF9] select-none transition-all duration-200">
      {/* 1. Left: Brand Logo & Mobile Trigger */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Mobile Menu Toggle Button */}
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
          href={getHomeRoute(role)}
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
              {getPortalLabel(role)}
            </span>
          </div>
        </Link>
      </div>

      {/* 2. Middle: Flexible Search Bar */}
      <div className="hidden md:flex items-center gap-2.5 flex-1 max-w-md mx-4 lg:mx-8 px-4 py-2 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 text-xs text-[#526866] dark:text-[#9FB3B0] focus-within:border-[#00BFA5]/50 focus-within:ring-2 focus-within:ring-[#00BFA5]/20 transition-all">
        <Search className="w-4 h-4 text-[#728B88] dark:text-[#7D9491] shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search assessments, pathways, reports..."
          className="bg-transparent border-none outline-none w-full text-xs text-[#172B2A] dark:text-[#F7FAF9] placeholder:text-[#728B88] dark:placeholder:text-[#7D9491]"
        />
      </div>

      {/* 3. Right: Utility Controls & User Profile Menu */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Notifications Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              toast.info("Notifications (2 Unread)", {
                description:
                  "1. Your preliminary career report is ready for download. 2. Academic milestone 2025-26 active.",
              })
            }
            className="w-9 h-9 rounded-xl bg-[#F4F8F7] hover:bg-[#EBF2F0] dark:bg-white/5 dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/10 text-[#526866] hover:text-[#172B2A] dark:text-[#9FB3B0] dark:hover:text-[#F7FAF9] flex items-center justify-center transition-colors cursor-pointer relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-white dark:ring-[#112423]">
              2
            </span>
          </button>
        </div>

        <div className="h-5 w-px bg-[#E3ECEA] dark:bg-white/10 mx-0.5" />

        {/* User Profile Menu */}
        <DashboardUserMenu user={user} role={role} />
      </div>
    </header>
  );
}
