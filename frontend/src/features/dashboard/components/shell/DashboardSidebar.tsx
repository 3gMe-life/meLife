"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { DashboardIcon } from "../common/DashboardIcon";
import { getNavigationForRole } from "../../config/navigation.config";
import type { UserRole } from "../../../auth/types/auth.types";

import { useCurrentUserQuery } from "../../../auth/hooks/useCurrentUserQuery";

interface DashboardSidebarProps {
  role?: UserRole;
  educationStage?: string | null;
  dashboardFeatures?: string[];
}

const STORAGE_KEY = "melife_sidebar_pinned";

export function DashboardSidebar({
  role = "PARTICIPANT",
  educationStage,
  dashboardFeatures,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { data: authData } = useCurrentUserQuery();
  const effectiveFeatures = dashboardFeatures || authData?.data?.dashboardFeatures;
  const navigation = getNavigationForRole(role, effectiveFeatures);
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Read pinned state preference from localStorage safely after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setIsPinned(saved === "true");
      }
    } catch {
      // Ignore localStorage read errors if disabled
    }
  }, []);

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

  const isExpanded = isPinned || isHovered;

  return (
    <div
      className={`relative transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
        isPinned ? "w-[260px]" : "w-[68px]"
      }`}
    >
      <nav
        aria-label="Sidebar Navigation"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`bg-[#172B2A] dark:bg-[#112423] py-3.5 px-2 flex flex-col rounded-[22px] border border-white/10 dark:border-white/10 select-none transition-[width,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
          isPinned
            ? "relative w-[260px] shadow-2xl shadow-black/40"
            : isHovered
            ? "absolute left-0 top-0 w-[260px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 ring-1 ring-white/10"
            : "relative w-[68px] shadow-xl shadow-[#172B2A]/20 dark:shadow-black/40"
        }`}
      >
        {/* 1. Sidebar Top Header & Toggle/Pin Control */}
        <div className="w-full flex items-center justify-between h-9 px-1.5 mb-2">
          <div
            className={`overflow-hidden transition-[opacity,max-width,transform] duration-200 ${
              isExpanded
                ? "opacity-100 max-w-[170px] translate-x-0"
                : "opacity-0 max-w-0 -translate-x-2 pointer-events-none"
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7D9491] whitespace-nowrap select-none">
              {isPinned ? "Pinned Menu" : "Navigation"}
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

        {/* 2. Top Divider */}
        <div
          className={`h-px bg-white/10 dark:bg-white/10 mb-2 transition-all duration-200 ${
            isExpanded ? "w-full" : "w-8 mx-auto"
          }`}
        />

        {/* 3. Navigation Items List */}
        <div className="flex flex-col gap-1.5 w-full">
          {navigation.map((section, sIdx) => (
            <React.Fragment key={section.id}>
              {/* Subtle Divider between sections */}
              {sIdx > 0 && (
                <div
                  className={`h-px bg-white/10 dark:bg-white/10 my-1 transition-all duration-200 ${
                    isExpanded ? "w-full" : "w-8 mx-auto"
                  }`}
                />
              )}

              {section.items.map((item) => {
                const isActive = item.isExact
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`) ||
                    (item.id === "reports" &&
                      (pathname.startsWith("/participant/career-reports") ||
                        pathname.startsWith("/participant/reports"))) ||
                    (item.id === "pathways" &&
                      (pathname.startsWith("/participant/career-pathways") ||
                        pathname.startsWith("/participant/pathways"))) ||
                    (item.id === "counsellor" &&
                      (pathname.startsWith("/participant/counsellors") ||
                        pathname.startsWith("/participant/counsellor"))) ||
                    (item.id === "students" &&
                      pathname.startsWith("/counsellor/students")) ||
                    (item.id === "cohorts" &&
                      (pathname.startsWith("/institution/classes") ||
                        pathname.startsWith("/institution/cohorts")));

                return (
                  <div
                    key={item.id}
                    className="relative flex items-center w-full group"
                  >
                    <Link
                      href={item.href}
                      aria-label={item.label}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative flex items-center h-11 w-full rounded-xl transition-all duration-200 cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFA5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#172B2A] ${
                        isActive
                          ? "bg-[#00BFA5] text-[#172B2A] shadow-md shadow-[#00BFA5]/25 font-bold"
                          : "text-[#9FB3B0] hover:text-white hover:bg-white/10 active:scale-[0.98]"
                      }`}
                    >
                      {/* Fixed-size Icon Container for 100% stable positioning */}
                      <div className="w-12 h-11 flex items-center justify-center shrink-0">
                        <DashboardIcon
                          name={item.icon}
                          className={`w-5 h-5 transition-transform duration-200 ${
                            isActive
                              ? "text-[#172B2A] stroke-[2.25] scale-105"
                              : "text-[#9FB3B0] group-hover:text-white group-hover:scale-110 stroke-[1.85]"
                          }`}
                        />
                      </div>

                      {/* Notification / Badge Dot for Collapsed Rail */}
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

                    {/* Floating Tooltip on Hover and Focus (Only active in Collapsed mode) */}
                    {!isExpanded && (
                      <div
                        role="tooltip"
                        className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#172B2A] dark:bg-[#112423] text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-white/15 pointer-events-none opacity-0 -translate-x-2 transition-all duration-150 ease-out z-50 flex items-center gap-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0"
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#00BFA5] text-[#172B2A]">
                            {item.badge}
                          </span>
                        )}
                        {/* Tooltip arrow pointing left */}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#172B2A] dark:bg-[#112423] rotate-45 border-l border-b border-white/15" />
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </nav>
    </div>
  );
}


