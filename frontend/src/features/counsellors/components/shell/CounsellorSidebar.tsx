"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
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
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Loader2,
  Inbox,
  CalendarCheck,
  History,
} from "lucide-react";
import { authApi } from "@/features/auth/api/auth.api";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import { useCounsellorOverview } from "../../hooks/useCounsellorQueries";

const STORAGE_KEY = "melife_counsellor_sidebar_pinned";

interface CounsellorSidebarProps {
  className?: string;
}

export function CounsellorSidebar({ className = "" }: CounsellorSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isPinned, setIsPinned] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(STORAGE_KEY) === "true";
      } catch {
        return false;
      }
    }
    return false;
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isSessionsExpanded, setIsSessionsExpanded] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: overview } = useCounsellorOverview();
  const pendingRequestsCount = overview?.stats?.pendingRequestsCount || 0;

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 120);
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPinned((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Ignore localStorage write errors
      }
      return next;
    });
  };

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

  const isExpanded = isPinned || isHovered;
  const currentTab = searchParams.get("tab");
  const isSessionsActive = pathname.startsWith("/counsellor/sessions");

  const { data: authData } = useCurrentUserQuery();
  const enabledDashboardFeatures = authData?.data?.dashboardFeatures;

  const allNavItems = [
    {
      id: "dashboard",
      featureKey: "dashboard.overview",
      label: "Dashboard",
      href: "/counsellor/dashboard",
      icon: LayoutDashboard,
      isExact: true,
    },
    {
      id: "sessions",
      featureKey: "dashboard.sessions",
      label: "Sessions",
      href: "/counsellor/sessions",
      icon: Clock,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
      hasSubmenu: true,
      subItems: [
        {
          id: "sessions-today",
          label: "Today's Sessions",
          href: "/counsellor/sessions?tab=today",
          icon: Clock,
          active: isSessionsActive && currentTab === "today",
        },
        {
          id: "sessions-upcoming",
          label: "Upcoming Sessions",
          href: "/counsellor/sessions?tab=upcoming",
          icon: CalendarCheck,
          active: isSessionsActive && (currentTab === "upcoming" || !currentTab),
        },
        {
          id: "sessions-requests",
          label: "Requests",
          href: "/counsellor/sessions?tab=requests",
          icon: Inbox,
          badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
          active: isSessionsActive && currentTab === "requests",
        },
        {
          id: "sessions-history",
          label: "Session History",
          href: "/counsellor/sessions?tab=history",
          icon: History,
          active: isSessionsActive && currentTab === "history",
        },
      ],
    },
    {
      id: "students",
      featureKey: "dashboard.students",
      label: "Students",
      href: "/counsellor/students",
      icon: GraduationCap,
    },
    {
      id: "calendar",
      featureKey: "dashboard.calendar",
      label: "Calendar",
      href: "/counsellor/calendar",
      icon: Calendar,
    },
    {
      id: "reports",
      featureKey: "dashboard.reports",
      label: "Reports",
      href: "/counsellor/reports",
      icon: FileText,
    },
    {
      id: "reviews",
      featureKey: "dashboard.reviews",
      label: "Reviews",
      href: "/counsellor/reviews",
      icon: Award,
    },
    {
      id: "profile",
      featureKey: "dashboard.profile",
      label: "Profile",
      href: "/counsellor/profile",
      icon: User,
    },
    {
      id: "settings",
      featureKey: "dashboard.settings",
      label: "Settings",
      href: "/counsellor/settings",
      icon: Settings,
    },
  ];

  const navItems = allNavItems.filter((item) => {
    if (!enabledDashboardFeatures || enabledDashboardFeatures.length === 0) return true;
    return enabledDashboardFeatures.includes(item.featureKey);
  });

  return (
    <div
      className={`relative transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
        isPinned ? "w-[260px]" : "w-[68px]"
      } ${className}`}
    >
      <nav
        aria-label="Counsellor Navigation"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`bg-[#172B2A] dark:bg-[#112423] py-3.5 px-2 flex flex-col rounded-[22px] border border-white/10 select-none transition-[width,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
          isPinned
            ? "relative w-[260px] shadow-2xl shadow-black/40"
            : isHovered
            ? "absolute left-0 top-0 w-[260px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 ring-1 ring-white/10"
            : "relative w-[68px] shadow-xl shadow-[#172B2A]/20 dark:shadow-black/40"
        }`}
      >
        {/* Top Header & Toggle Pin Control */}
        <div className="w-full flex items-center justify-between h-9 px-1.5 mb-2">
          <div
            className={`overflow-hidden transition-[opacity,max-width,transform] duration-200 ${
              isExpanded
                ? "opacity-100 max-w-[170px] translate-x-0"
                : "opacity-0 max-w-0 -translate-x-2 pointer-events-none"
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7D9491] whitespace-nowrap">
              {isPinned ? "Pinned Menu" : "Counsellor Menu"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleTogglePin}
            aria-expanded={isExpanded}
            aria-label={
              isPinned
                ? "Unpin sidebar"
                : isExpanded
                ? "Pin sidebar open"
                : "Expand navigation sidebar"
            }
            title={isPinned ? "Click to unpin sidebar" : "Click to pin sidebar"}
            className={`h-8 w-8 rounded-lg text-[#9FB3B0] hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFA5] shrink-0 ${
              !isExpanded ? "mx-auto" : ""
            }`}
          >
            {isPinned ? (
              <ChevronLeft className="w-4 h-4 transition-transform duration-200" />
            ) : isExpanded ? (
              <ChevronLeft className="w-4 h-4 transition-transform duration-200" />
            ) : (
              <ChevronRight className="w-4 h-4 transition-transform duration-200" />
            )}
          </button>
        </div>

        {/* Divider */}
        <div
          className={`h-px bg-white/10 mb-2 transition-all duration-200 ${
            isExpanded ? "w-full" : "w-8 mx-auto"
          }`}
        />

        {/* Main Navigation Items */}
        <div className="flex flex-col gap-1 w-full overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isExact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <div key={item.id} className="relative flex flex-col w-full group">
                <div className="flex items-center w-full">
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative flex items-center h-11 w-full rounded-xl transition-all duration-200 cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFA5] ${
                      isActive
                        ? "bg-[#00BFA5] text-[#172B2A] shadow-md shadow-[#00BFA5]/25 font-bold"
                        : "text-[#9FB3B0] hover:text-white hover:bg-white/10 active:scale-[0.98]"
                    }`}
                  >
                    {/* Fixed-size Icon Container */}
                    <div className="w-12 h-11 flex items-center justify-center shrink-0">
                      <Icon
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isActive
                            ? "text-[#172B2A] stroke-[2.25] scale-105"
                            : "text-[#9FB3B0] group-hover:text-white group-hover:scale-110 stroke-[1.85]"
                        }`}
                      />
                    </div>

                    {/* Collapsed dot badge */}
                    {!isExpanded && item.badge && (
                      <span
                        className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ring-2 ${
                          isActive
                            ? "bg-[#172B2A] ring-[#00BFA5]"
                            : "bg-[#00BFA5] ring-[#172B2A] animate-pulse"
                        }`}
                        aria-hidden="true"
                      />
                    )}

                    {/* Expanded Label & Badge */}
                    <div
                      className={`flex items-center justify-between flex-1 min-w-0 pr-3 transition-[opacity,transform] duration-200 overflow-hidden whitespace-nowrap ${
                        isExpanded
                          ? "opacity-100 max-w-[180px] translate-x-0 delay-75"
                          : "opacity-0 max-w-0 -translate-x-2 pointer-events-none"
                      }`}
                    >
                      <span
                        className={`text-xs truncate tracking-tight ${
                          isActive
                            ? "font-extrabold text-[#172B2A]"
                            : "font-semibold text-[#9FB3B0] group-hover:text-white"
                        }`}
                      >
                        {item.label}
                      </span>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                            isActive
                              ? "bg-[#172B2A] text-[#00BFA5]"
                              : "bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Submenu toggle button when expanded and has sub-items */}
                  {item.hasSubmenu && isExpanded && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsSessionsExpanded((prev) => !prev);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#7D9491] hover:text-white cursor-pointer z-10"
                      aria-label="Toggle sessions submenu"
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isSessionsExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Submenu links (e.g. for Sessions) */}
                {item.hasSubmenu && item.subItems && isExpanded && isSessionsExpanded && (
                  <div className="pl-6 pr-1 pt-1 pb-1 space-y-0.5 flex flex-col transition-all duration-200">
                    {item.subItems.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.id}
                          href={sub.href}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                            sub.active
                              ? "bg-white/15 text-white font-bold"
                              : "text-[#9FB3B0] hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <SubIcon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{sub.label}</span>
                          </div>
                          {sub.badge && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-[#00BFA5] text-[#172B2A]">
                              {sub.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Collapsed Tooltip */}
                {!isExpanded && (
                  <div
                    role="tooltip"
                    className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#172B2A] text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-white/15 pointer-events-none opacity-0 -translate-x-2 transition-all duration-150 ease-out z-50 flex items-center gap-2 group-hover:opacity-100 group-hover:translate-x-0"
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#00BFA5] text-[#172B2A]">
                        {item.badge}
                      </span>
                    )}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#172B2A] rotate-45 border-l border-b border-white/15" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Utility Items: Help & Support + Sign Out */}
        <div className="mt-auto pt-2 border-t border-white/10 flex flex-col gap-1 w-full">
          {/* Help & Support */}
          <div className="relative flex items-center w-full group">
            <a
              href="mailto:support@3gmelife.com?subject=Counsellor%20Support%20Request"
              className="relative flex items-center h-10 w-full rounded-xl text-[#9FB3B0] hover:text-white hover:bg-white/10 transition-colors cursor-pointer overflow-hidden"
              aria-label="Help & Support"
            >
              <div className="w-12 h-10 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4.5 h-4.5 text-[#9FB3B0] group-hover:text-white transition-colors" />
              </div>
              <div
                className={`flex items-center min-w-0 pr-3 transition-[opacity,transform] duration-200 overflow-hidden whitespace-nowrap ${
                  isExpanded
                    ? "opacity-100 max-w-[180px] translate-x-0 delay-75"
                    : "opacity-0 max-w-0 -translate-x-2 pointer-events-none"
                }`}
              >
                <span className="text-xs font-medium text-[#9FB3B0] group-hover:text-white truncate">
                  Help & Support
                </span>
              </div>
            </a>

            {!isExpanded && (
              <div
                role="tooltip"
                className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#172B2A] text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-white/15 pointer-events-none opacity-0 -translate-x-2 transition-all duration-150 ease-out z-50 flex items-center gap-2 group-hover:opacity-100 group-hover:translate-x-0"
              >
                <span>Help & Support</span>
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#172B2A] rotate-45 border-l border-b border-white/15" />
              </div>
            )}
          </div>

          {/* Sign Out Button */}
          <div className="relative flex items-center w-full group">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="relative flex items-center h-10 w-full rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 transition-colors cursor-pointer overflow-hidden disabled:opacity-60"
              aria-label="Sign out"
            >
              <div className="w-12 h-10 flex items-center justify-center shrink-0">
                {isLoggingOut ? (
                  <Loader2 className="w-4.5 h-4.5 animate-spin text-rose-400" />
                ) : (
                  <LogOut className="w-4.5 h-4.5 text-rose-400" />
                )}
              </div>
              <div
                className={`flex items-center min-w-0 pr-3 transition-[opacity,transform] duration-200 overflow-hidden whitespace-nowrap ${
                  isExpanded
                    ? "opacity-100 max-w-[180px] translate-x-0 delay-75"
                    : "opacity-0 max-w-0 -translate-x-2 pointer-events-none"
                }`}
              >
                <span className="text-xs font-semibold text-rose-400 truncate">
                  {isLoggingOut ? "Signing out..." : "Sign Out"}
                </span>
              </div>
            </button>

            {!isExpanded && (
              <div
                role="tooltip"
                className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#172B2A] text-rose-300 text-xs font-semibold whitespace-nowrap shadow-xl border border-white/15 pointer-events-none opacity-0 -translate-x-2 transition-all duration-150 ease-out z-50 flex items-center gap-2 group-hover:opacity-100 group-hover:translate-x-0"
              >
                <span>Sign Out</span>
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#172B2A] rotate-45 border-l border-b border-white/15" />
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
