"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Loader2,
} from "lucide-react";
import { authApi } from "@/features/auth/api/auth.api";
import { useFeatureAccess } from "@/features/access-control";
import {
  ADMIN_NAVIGATION_ITEMS,
  isNavItemVisible,
  type AdminNavItem,
} from "../../config/admin-navigation.config";

const STORAGE_KEY = "melife_admin_sidebar_pinned";

interface AdminSidebarProps {
  className?: string;
  /** Optional custom navigation items override */
  customNavItems?: AdminNavItem[];
}

export function AdminSidebar({ className = "", customNavItems }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    userPermissions,
    isSuperAdmin,
    canAccess,
    isLoading: isAuthLoading,
  } = useFeatureAccess();

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const isNavActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard" || pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  // Filter navigation items dynamically based on current user permissions
  const visibleNavItems = useMemo(() => {
    const sourceItems = customNavItems || ADMIN_NAVIGATION_ITEMS;
    return sourceItems.filter((item) =>
      isNavItemVisible(item, userPermissions, isSuperAdmin, canAccess)
    );
  }, [customNavItems, userPermissions, isSuperAdmin, canAccess]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group/sidebar transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-[72px]"
      } ${className}`}
    >
      <div
        className={`flex flex-col h-[calc(100vh-120px)] bg-white/95 dark:bg-[#112423]/95 backdrop-blur-xl border border-[#E3ECEA] dark:border-white/10 rounded-[26px] p-3 text-[#172B2A] dark:text-[#F7FAF9] select-none transition-all duration-300 ${
          isPinned
            ? "shadow-sm shadow-[#172B2A]/5 dark:shadow-black/25"
            : isHovered
            ? "shadow-2xl shadow-[#172B2A]/20 dark:shadow-black/60 ring-1 ring-[#00BFA5]/20 z-50 absolute left-0 top-0 w-64"
            : "shadow-sm shadow-[#172B2A]/5 dark:shadow-black/25"
        }`}
      >
        {/* 1. Header Pin Toggle */}
        <div className="flex items-center justify-between px-2.5 py-2 mb-2 border-b border-[#E3ECEA]/60 dark:border-white/5">
          <div
            className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${
              isExpanded ? "opacity-100 max-w-[140px]" : "opacity-0 max-w-0 pointer-events-none"
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-[#00BFA5] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-[#526866] dark:text-[#9FB3B0] whitespace-nowrap">
              Administration
            </span>
          </div>

          <button
            type="button"
            onClick={handleTogglePin}
            className={`p-1.5 rounded-xl text-[#728B88] hover:text-[#172B2A] dark:text-[#7D9491] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors cursor-pointer ${
              !isExpanded ? "mx-auto" : ""
            }`}
            title={isPinned ? "Unpin sidebar (collapse to rail)" : "Pin sidebar expanded"}
            aria-label="Toggle sidebar pinning"
          >
            {isPinned ? (
              <ChevronLeft className="w-4 h-4 text-[#008F83] dark:text-[#00BFA5]" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* 2. Main Navigation Items */}
        <nav
          aria-label="Admin Navigation"
          className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden pr-0.5 custom-scrollbar"
        >
          {isAuthLoading && visibleNavItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-[#728B88] dark:text-[#7D9491]">
              <Loader2 className="w-5 h-5 animate-spin mb-2 text-[#00BFA5]" />
              {isExpanded && (
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  Loading access...
                </span>
              )}
            </div>
          ) : (
            visibleNavItems.map((item) => {
              const active = isNavActive(item.href);
              const Icon = item.icon;

              return (
                <div key={item.id} className="relative group/navitem">
                  <Link
                    href={item.href}
                    className={`group/item flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 relative ${
                      active
                        ? "bg-gradient-to-r from-[#00B8D4]/15 via-[#00BFA5]/15 to-transparent text-[#008F83] dark:text-[#00BFA5] font-extrabold"
                        : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#F4F8F7] dark:hover:bg-white/5"
                    }`}
                  >
                    {/* Active Indicator Bar */}
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#00BFA5]" />
                    )}

                    {/* Icon Container */}
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 transition-colors ${
                        active
                          ? "bg-[#00BFA5]/20 text-[#008F83] dark:text-[#00BFA5]"
                          : "text-[#728B88] dark:text-[#7D9491] group-hover/item:text-[#172B2A] dark:group-hover/item:text-[#F7FAF9]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Text Label (shown when expanded) */}
                    <span
                      className={`whitespace-nowrap transition-all duration-300 ${
                        isExpanded ? "opacity-100 max-w-[140px]" : "opacity-0 max-w-0 overflow-hidden"
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Badge if any (shown when expanded) */}
                    {item.badge && isExpanded && (
                      <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5]">
                        {item.badge}
                      </span>
                    )}
                  </Link>

                  {/* Flyout Tooltip when sidebar is collapsed */}
                  {!isExpanded && (
                    <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-xl bg-[#172B2A] dark:bg-[#1A3331] text-white text-[11px] font-bold shadow-xl border border-white/10 opacity-0 group-hover/navitem:opacity-100 pointer-events-none transition-opacity duration-150 z-50 whitespace-nowrap">
                      {item.label}
                      {item.badge && (
                        <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] bg-[#00BFA5] text-[#172B2A]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>

        {/* 3. Footer Area: Logout */}
        <div className="pt-2 mt-2 border-t border-[#E3ECEA]/60 dark:border-white/5 shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer disabled:opacity-50 ${
              !isExpanded ? "justify-center" : ""
            }`}
            title={!isExpanded ? "Sign Out" : undefined}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-xl shrink-0">
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
            </div>
            <span
              className={`whitespace-nowrap transition-all duration-300 ${
                isExpanded ? "opacity-100 max-w-[140px]" : "opacity-0 max-w-0 overflow-hidden"
              }`}
            >
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
