"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { DashboardIcon } from "../common/DashboardIcon";
import { getNavigationForRole } from "../../config/navigation.config";
import type { UserProfile, UserRole } from "../../../auth/types/auth.types";

interface DashboardMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  role?: UserRole;
  educationStage?: string | null;
}

export function DashboardMobileNav({
  isOpen,
  onClose,
  user,
  role = "PARTICIPANT",
}: DashboardMobileNavProps) {
  const pathname = usePathname();
  const navigation = getNavigationForRole(role);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key and trap focus
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Lock body scrolling while open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    // Initial focus on close button
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden flex items-start justify-start p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Subtle Dark Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D1C1B]/65 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Pill-Themed Navigation Panel */}
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-[min(320px,calc(100vw-24px))] max-h-[calc(100dvh-24px)] rounded-[28px] bg-[#172B2A] dark:bg-[#112423] text-white border border-white/12 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.55)] flex flex-col overflow-hidden animate-in zoom-in-95 fade-in slide-in-from-top-3 duration-200 ease-out select-none"
      >
        {/* 1. Header Row: Compact MeLife Brand + Close Button */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/10 shrink-0">
          <Link
            href="/participant/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center font-black text-xs text-[#172B2A] shadow-xs group-hover:scale-105 transition-transform duration-200">
              3G
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-white flex items-center gap-1 leading-none">
                <span>MeLife</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA5]" />
              </span>
              <span className="text-[9px] font-bold text-[#00BFA5] tracking-wider uppercase leading-tight mt-0.5">
                Student Portal
              </span>
            </div>
          </Link>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFA5]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3.5 custom-scrollbar min-h-0">
          {navigation.map((section, sIdx) => (
            <div key={section.id} className="space-y-1">
              {section.title && (
                <div className="px-2.5 pt-1 pb-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7D9491]">
                    {section.title}
                  </h4>
                </div>
              )}

              <div className="space-y-1">
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
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      aria-current={isActive ? "page" : undefined}
                      className={`min-h-[46px] w-full px-2.5 py-1.5 rounded-2xl flex items-center justify-between transition-all duration-150 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFA5] ${
                        isActive
                          ? "bg-white/10 text-white font-bold shadow-inner"
                          : "text-[#9FB3B0] hover:text-white hover:bg-white/8 active:scale-[0.98]"
                      }`}
                    >
                      {/* Icon with circular highlight + Label */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 ${
                            isActive
                              ? "bg-[#00BFA5] text-[#172B2A] shadow-sm shadow-[#00BFA5]/30 font-black"
                              : "bg-white/5 text-[#9FB3B0] group-hover:text-white group-hover:bg-white/10"
                          }`}
                        >
                          <DashboardIcon
                            name={item.icon}
                            className={`w-4 h-4 ${
                              isActive ? "stroke-[2.5]" : "stroke-[1.85]"
                            }`}
                          />
                        </div>
                        <span
                          className={`text-xs truncate ${
                            isActive
                              ? "font-bold text-white"
                              : "font-medium text-[#9FB3B0] group-hover:text-white"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>

                      {/* Badge Pill */}
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                            isActive
                              ? "bg-[#00BFA5] text-[#172B2A]"
                              : "bg-[#00BFA5]/20 text-[#00BFA5] border border-[#00BFA5]/30"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 3. Compact Student Profile Footer */}
        <div className="px-4 py-3 border-t border-white/10 bg-black/15 shrink-0 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center font-black text-xs text-[#172B2A] shrink-0 shadow-xs">
            {user.firstName?.[0] || "U"}
          </div>
          <div className="flex flex-col min-w-0 truncate">
            <span className="text-xs font-bold text-white truncate leading-tight">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-[10px] text-[#7D9491] truncate leading-tight mt-0.5">
              {user.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
