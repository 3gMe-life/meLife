"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardIcon } from "../common/DashboardIcon";
import { getNavigationForRole } from "../../config/navigation.config";
import type { UserRole } from "../../../auth/types/auth.types";

interface DashboardSidebarProps {
  role?: UserRole;
  educationStage?: string | null;
}

export function DashboardSidebar({
  role = "PARTICIPANT",
  educationStage,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const navigation = getNavigationForRole(role);

  return (
    <nav
      aria-label="Sidebar Navigation"
      className="w-[68px] rounded-full bg-[#172B2A] dark:bg-[#112423] py-6 px-2 flex flex-col items-center shadow-2xl shadow-[#172B2A]/25 dark:shadow-black/50 border border-white/10 dark:border-white/10 select-none transition-all duration-200"
    >
      {/* Navigation Items List */}
      <div className="flex flex-col items-center gap-3.5 w-full">
        {navigation.map((section, sIdx) => (
          <React.Fragment key={section.id}>
            {/* Subtle Divider between sections */}
            {sIdx > 0 && <div className="w-6 h-px bg-white/15 dark:bg-white/10 my-0.5" />}

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
                    pathname.startsWith("/counsellor/students"));

              return (
                <div key={item.id} className="relative flex items-center justify-center group">
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                    className={`w-12 h-12 rounded-full flex items-center justify-center relative transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFA5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#172B2A] ${
                      isActive
                        ? "bg-[#00BFA5] text-[#172B2A] shadow-md shadow-[#00BFA5]/30 font-bold"
                        : "text-[#9FB3B0] hover:text-white hover:bg-white/10 active:scale-95"
                    }`}
                  >
                    <DashboardIcon
                      name={item.icon}
                      className={`w-[22px] h-[22px] transition-transform duration-200 ${
                        isActive
                          ? "text-[#172B2A] stroke-[2.35] scale-105"
                          : "text-[#9FB3B0] group-hover:text-white group-hover:scale-110 stroke-[1.85]"
                      }`}
                    />

                    {/* Notification / Badge Dot */}
                    {item.badge && (
                      <span
                        className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ring-2 ${
                          isActive
                            ? "bg-[#172B2A] ring-[#00BFA5]"
                            : "bg-[#00BFA5] ring-[#172B2A] animate-pulse"
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </Link>

                  {/* Floating Tooltip on Hover and Focus */}
                  <div
                    role="tooltip"
                    className="absolute left-full ml-3.5 px-3 py-1.5 rounded-xl bg-[#172B2A] text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-white/15 pointer-events-none opacity-0 -translate-x-2 transition-all duration-150 ease-out z-50 flex items-center gap-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0"
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#00BFA5] text-[#172B2A]">
                        {item.badge}
                      </span>
                    )}
                    {/* Tooltip arrow pointing left */}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#172B2A] rotate-45 border-l border-b border-white/15" />
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
