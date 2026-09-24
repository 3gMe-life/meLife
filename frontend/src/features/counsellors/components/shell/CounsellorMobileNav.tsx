"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  X,
  LayoutDashboard,
  Clock,
  GraduationCap,
  Calendar,
  FileText,
  Award,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Loader2,
  Inbox,
  CalendarCheck,
  History,
} from "lucide-react";
import { authApi } from "@/features/auth/api/auth.api";
import type { UserProfile, UserRole } from "@/features/auth/types/auth.types";
import { useCounsellorOverview } from "../../hooks/useCounsellorQueries";

interface CounsellorMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  role?: UserRole;
}

export function CounsellorMobileNav({
  isOpen,
  onClose,
  user,
  role = "CAREER_COUNSELLOR",
}: CounsellorMobileNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isSessionsOpen, setIsSessionsOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { data: overview } = useCounsellorOverview();
  const pendingCount = overview?.stats?.pendingRequestsCount || 0;
  const currentTab = searchParams.get("tab");
  const isSessionsActive = pathname.startsWith("/counsellor/sessions");

  // Lock body scrolling and handle Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authApi.logout();
      queryClient.clear();
      onClose();
      router.push("/login");
    } catch {
      queryClient.clear();
      onClose();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden flex items-start justify-start p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Counsellor Mobile Navigation"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D1C1B]/65 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Panel */}
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-[min(320px,calc(100vw-24px))] max-h-[calc(100dvh-24px)] rounded-[28px] bg-[#172B2A] dark:bg-[#112423] text-white border border-white/12 shadow-[0_20px_60px_rgba(0,0,0,0.55)] flex flex-col overflow-hidden animate-in zoom-in-95 fade-in slide-in-from-top-3 duration-200 ease-out select-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/10 shrink-0">
          <Link
            href="/counsellor/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center font-black text-xs text-[#172B2A] shadow-xs">
              3G
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-white flex items-center gap-1 leading-none">
                <span>MeLife</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA5]" />
              </span>
              <span className="text-[9px] font-bold text-[#00BFA5] tracking-wider uppercase leading-tight mt-0.5">
                Counsellor Portal
              </span>
            </div>
          </Link>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-1 custom-scrollbar min-h-0">
          {/* Dashboard */}
          <Link
            href="/counsellor/dashboard"
            onClick={onClose}
            className={`min-h-[46px] w-full px-2.5 py-1.5 rounded-2xl flex items-center gap-3 transition-all ${
              pathname === "/counsellor/dashboard"
                ? "bg-[#00BFA5] text-[#172B2A] font-bold shadow-md shadow-[#00BFA5]/25"
                : "text-[#9FB3B0] hover:text-white hover:bg-white/8"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                pathname === "/counsellor/dashboard"
                  ? "bg-[#172B2A]/20 text-[#172B2A]"
                  : "bg-white/5 text-[#9FB3B0]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold truncate">Dashboard</span>
          </Link>

          {/* Sessions with Accordion Submenu */}
          <div className="space-y-1">
            <div
              className={`min-h-[46px] w-full px-2.5 py-1.5 rounded-2xl flex items-center justify-between transition-all ${
                isSessionsActive
                  ? "bg-white/10 text-white font-bold"
                  : "text-[#9FB3B0] hover:text-white hover:bg-white/8"
              }`}
            >
              <Link
                href="/counsellor/sessions"
                onClick={onClose}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    isSessionsActive
                      ? "bg-[#00BFA5] text-[#172B2A] font-bold"
                      : "bg-white/5 text-[#9FB3B0]"
                  }`}
                >
                  <Clock className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-xs font-semibold truncate">Sessions</span>
                {pendingCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                    {pendingCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setIsSessionsOpen(!isSessionsOpen)}
                className="p-1.5 text-[#9FB3B0] hover:text-white"
                aria-label="Toggle sessions menu"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isSessionsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {isSessionsOpen && (
              <div className="pl-11 pr-2 space-y-1 pt-0.5 pb-1">
                <Link
                  href="/counsellor/sessions?tab=today"
                  onClick={onClose}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs ${
                    isSessionsActive && currentTab === "today"
                      ? "bg-white/15 text-white font-bold"
                      : "text-[#9FB3B0] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Today&apos;s Sessions</span>
                </Link>

                <Link
                  href="/counsellor/sessions?tab=upcoming"
                  onClick={onClose}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs ${
                    isSessionsActive && (currentTab === "upcoming" || !currentTab)
                      ? "bg-white/15 text-white font-bold"
                      : "text-[#9FB3B0] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Upcoming Sessions</span>
                </Link>

                <Link
                  href="/counsellor/sessions?tab=requests"
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs ${
                    isSessionsActive && currentTab === "requests"
                      ? "bg-white/15 text-white font-bold"
                      : "text-[#9FB3B0] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Inbox className="w-3.5 h-3.5" />
                    <span>Requests</span>
                  </div>
                  {pendingCount > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                      {pendingCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/counsellor/sessions?tab=history"
                  onClick={onClose}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs ${
                    isSessionsActive && currentTab === "history"
                      ? "bg-white/15 text-white font-bold"
                      : "text-[#9FB3B0] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Session History</span>
                </Link>
              </div>
            )}
          </div>

          {/* Students */}
          <Link
            href="/counsellor/students"
            onClick={onClose}
            className={`min-h-[46px] w-full px-2.5 py-1.5 rounded-2xl flex items-center gap-3 transition-all ${
              pathname.startsWith("/counsellor/students")
                ? "bg-[#00BFA5] text-[#172B2A] font-bold shadow-md shadow-[#00BFA5]/25"
                : "text-[#9FB3B0] hover:text-white hover:bg-white/8"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                pathname.startsWith("/counsellor/students")
                  ? "bg-[#172B2A]/20 text-[#172B2A]"
                  : "bg-white/5 text-[#9FB3B0]"
              }`}
            >
              <GraduationCap className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold truncate">Students</span>
          </Link>

          {/* Calendar */}
          <Link
            href="/counsellor/calendar"
            onClick={onClose}
            className={`min-h-[46px] w-full px-2.5 py-1.5 rounded-2xl flex items-center gap-3 transition-all ${
              pathname.startsWith("/counsellor/calendar")
                ? "bg-[#00BFA5] text-[#172B2A] font-bold shadow-md shadow-[#00BFA5]/25"
                : "text-[#9FB3B0] hover:text-white hover:bg-white/8"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                pathname.startsWith("/counsellor/calendar")
                  ? "bg-[#172B2A]/20 text-[#172B2A]"
                  : "bg-white/5 text-[#9FB3B0]"
              }`}
            >
              <Calendar className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold truncate">Calendar</span>
          </Link>

          {/* Reports */}
          <Link
            href="/counsellor/reports"
            onClick={onClose}
            className={`min-h-[46px] w-full px-2.5 py-1.5 rounded-2xl flex items-center gap-3 transition-all ${
              pathname.startsWith("/counsellor/reports")
                ? "bg-[#00BFA5] text-[#172B2A] font-bold shadow-md shadow-[#00BFA5]/25"
                : "text-[#9FB3B0] hover:text-white hover:bg-white/8"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                pathname.startsWith("/counsellor/reports")
                  ? "bg-[#172B2A]/20 text-[#172B2A]"
                  : "bg-white/5 text-[#9FB3B0]"
              }`}
            >
              <FileText className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold truncate">Reports</span>
          </Link>

          {/* Reviews */}
          <Link
            href="/counsellor/reviews"
            onClick={onClose}
            className={`min-h-[46px] w-full px-2.5 py-1.5 rounded-2xl flex items-center gap-3 transition-all ${
              pathname.startsWith("/counsellor/reviews")
                ? "bg-[#00BFA5] text-[#172B2A] font-bold shadow-md shadow-[#00BFA5]/25"
                : "text-[#9FB3B0] hover:text-white hover:bg-white/8"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                pathname.startsWith("/counsellor/reviews")
                  ? "bg-[#172B2A]/20 text-[#172B2A]"
                  : "bg-white/5 text-[#9FB3B0]"
              }`}
            >
              <Award className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold truncate">Reviews</span>
          </Link>

          {/* Profile */}
          <Link
            href="/counsellor/profile"
            onClick={onClose}
            className={`min-h-[46px] w-full px-2.5 py-1.5 rounded-2xl flex items-center gap-3 transition-all ${
              pathname.startsWith("/counsellor/profile")
                ? "bg-[#00BFA5] text-[#172B2A] font-bold shadow-md shadow-[#00BFA5]/25"
                : "text-[#9FB3B0] hover:text-white hover:bg-white/8"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                pathname.startsWith("/counsellor/profile")
                  ? "bg-[#172B2A]/20 text-[#172B2A]"
                  : "bg-white/5 text-[#9FB3B0]"
              }`}
            >
              <User className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold truncate">Profile</span>
          </Link>

          {/* Settings */}
          <Link
            href="/counsellor/settings"
            onClick={onClose}
            className={`min-h-[46px] w-full px-2.5 py-1.5 rounded-2xl flex items-center gap-3 transition-all ${
              pathname.startsWith("/counsellor/settings")
                ? "bg-[#00BFA5] text-[#172B2A] font-bold shadow-md shadow-[#00BFA5]/25"
                : "text-[#9FB3B0] hover:text-white hover:bg-white/8"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                pathname.startsWith("/counsellor/settings")
                  ? "bg-[#172B2A]/20 text-[#172B2A]"
                  : "bg-white/5 text-[#9FB3B0]"
              }`}
            >
              <Settings className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold truncate">Settings</span>
          </Link>
        </div>

        {/* Profile Footer & Sign Out */}
        <div className="px-4 py-3 border-t border-white/10 bg-black/20 shrink-0 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center font-black text-xs text-[#172B2A] shrink-0">
                {user.firstName?.[0] || "C"}
              </div>
              <div className="flex flex-col min-w-0 truncate">
                <span className="text-xs font-bold text-white truncate">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-[10px] text-[#00BFA5] font-semibold truncate">
                  {overview?.counsellorProfile?.qualification || (role === "CAREER_COUNSELLOR" ? "Career Counsellor" : role)}
                </span>
              </div>
            </div>

            <a
              href="mailto:support@3gmelife.com?subject=Counsellor%20Support"
              className="p-2 rounded-xl text-[#9FB3B0] hover:text-white hover:bg-white/10"
              aria-label="Help & Support"
            >
              <HelpCircle className="w-4 h-4" />
            </a>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full h-9 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
          >
            {isLoggingOut ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-300" />
            ) : (
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
            )}
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
