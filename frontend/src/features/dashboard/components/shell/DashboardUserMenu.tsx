"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Loader2,
  Sparkles,
} from "lucide-react";
import { authApi } from "../../../auth/api/auth.api";
import type { UserProfile, UserRole } from "../../../auth/types/auth.types";

interface DashboardUserMenuProps {
  user: UserProfile;
  role?: UserRole;
}

export function DashboardUserMenu({ user, role = "PARTICIPANT" }: DashboardUserMenuProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getRoleDisplayName = (r: UserRole) => {
    switch (r) {
      case "PARTICIPANT":
        return "Student";
      case "PARENT_GUARDIAN":
        return "Parent";
      case "CAREER_COUNSELLOR":
        return "Counsellor";
      case "INSTITUTION_ADMIN":
        return "Institution Admin";
      case "SUPER_ADMIN":
        return "Super Admin";
      default:
        return "Member";
    }
  };

  const getRoleBadgeColor = (r: UserRole) => {
    switch (r) {
      case "PARTICIPANT":
        return "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] border-[#00BFA5]/30";
      case "PARENT_GUARDIAN":
        return "bg-[#00B8D4]/15 text-[#008F83] dark:text-[#00B8D4] border-[#00B8D4]/30";
      case "CAREER_COUNSELLOR":
        return "bg-[#00C896]/15 text-[#008F83] dark:text-[#00C896] border-[#00C896]/30";
      default:
        return "bg-[#008F83]/15 text-[#008F83] dark:text-[#00BFA5] border-[#008F83]/30";
    }
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authApi.logout();
      queryClient.clear();
      router.push("/login");
    } catch {
      queryClient.clear();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || "U"}`.toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-1.5 sm:px-2 rounded-xl bg-[#F4F8F7] hover:bg-[#EBF2F0] dark:bg-white/5 dark:hover:bg-white/10 border border-[#E3ECEA] dark:border-white/10 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00BFA5]/40 select-none flex items-center gap-1.5 sm:gap-2 group shrink-0"
        aria-expanded={isOpen}
        aria-label="User profile menu"
      >
        <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center font-black text-[10px] sm:text-xs text-[#172B2A] shadow-xs shrink-0">
          {initials}
        </div>

        <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] group-hover:text-[#008F83] dark:group-hover:text-[#00BFA5] transition-colors leading-tight truncate max-w-[110px] hidden sm:block">
          {user.firstName || "Student"}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[#728B88] group-hover:text-[#172B2A] dark:group-hover:text-white transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#172B2A] backdrop-blur-2xl border border-[#E3ECEA] dark:border-[rgba(227,236,234,0.15)] shadow-[0_20px_50px_rgba(23,43,42,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-[#172B2A] dark:text-[#F7FAF9]">
          {/* User Header */}
          <div className="p-3 border-b border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)] mb-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] truncate max-w-[150px]">
                {user.firstName} {user.lastName}
              </span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getRoleBadgeColor(
                  role
                )}`}
              >
                {getRoleDisplayName(role)}
              </span>
            </div>
            <p className="text-[11px] text-[#526866] dark:text-[#9FB3B0] truncate">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5 text-xs font-medium">
            <Link
              href={
                role === "CAREER_COUNSELLOR"
                  ? "/counsellor/profile"
                  : role === "SUPER_ADMIN" || role === "PLATFORM_ADMIN"
                  ? "/admin/dashboard"
                  : "/participant/settings"
              }
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors"
            >
              <User className="w-4 h-4 text-[#00BFA5]" />
              <span>{role === "CAREER_COUNSELLOR" ? "My Counsellor Profile" : "My Profile & Stage"}</span>
            </Link>

            <Link
              href={
                role === "CAREER_COUNSELLOR"
                  ? "/counsellor/sessions"
                  : "/participant/results"
              }
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#00B8D4]" />
              <span>{role === "CAREER_COUNSELLOR" ? "Guidance Sessions" : "Assessment Results"}</span>
            </Link>

            <Link
              href={
                role === "CAREER_COUNSELLOR"
                  ? "/counsellor/settings"
                  : "/participant/settings"
              }
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors"
            >
              <Settings className="w-4 h-4 text-[#728B88]" />
              <span>Preferences</span>
            </Link>

            <a
              href="mailto:support@3gmelife.com"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-[#728B88]" />
              <span>Help & Support</span>
            </a>
          </div>

          {/* Sign Out Button */}
          <div className="pt-1.5 mt-1.5 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.12)]">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-60"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
              ) : (
                <LogOut className="w-4 h-4 text-rose-500" />
              )}
              <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
