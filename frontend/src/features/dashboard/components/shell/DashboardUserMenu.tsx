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
        return "bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/30";
      case "PARENT_GUARDIAN":
        return "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30";
      case "CAREER_COUNSELLOR":
        return "bg-teal-500/10 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/20 dark:border-teal-500/30";
      default:
        return "bg-purple-500/10 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20 dark:border-purple-500/30";
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
        className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 select-none group"
        aria-expanded={isOpen}
        aria-label="User profile menu"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#14B8A6] flex items-center justify-center font-bold text-xs text-white shadow-md shadow-[#2563EB]/20 ring-1 ring-black/5 dark:ring-white/20">
          {initials}
        </div>

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-[#14B8A6] transition-colors leading-tight truncate max-w-[120px]">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
            {getRoleDisplayName(role)}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-white">
          {/* User Header */}
          <div className="p-3 border-b border-slate-100 dark:border-white/10 mb-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
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
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5 text-xs font-medium">
            <Link
              href="/participant/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <User className="w-4 h-4 text-[#14B8A6]" />
              <span>My Profile & Stage</span>
            </Link>

            <Link
              href="/participant/results"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span>Assessment Results</span>
            </Link>

            <Link
              href="/participant/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Preferences</span>
            </Link>

            <a
              href="mailto:support@3gmelife.com"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Help & Support</span>
            </a>
          </div>

          {/* Sign Out Button */}
          <div className="pt-1.5 mt-1.5 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-60"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-500 dark:text-red-400" />
              ) : (
                <LogOut className="w-4 h-4 text-red-500 dark:text-red-400" />
              )}
              <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
