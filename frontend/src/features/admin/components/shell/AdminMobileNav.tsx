"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  X,
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
import type { UserProfile, UserRole } from "@/features/auth/types/auth.types";

interface AdminMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  role?: UserRole;
  customNavItems?: AdminNavItem[];
}

export function AdminMobileNav({
  isOpen,
  onClose,
  user,
  role = "PLATFORM_ADMIN",
  customNavItems,
}: AdminMobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const {
    userPermissions,
    isSuperAdmin,
    canAccess,
  } = useFeatureAccess();

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

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
    <div className="fixed inset-0 z-50 lg:hidden select-none">
      {/* 1. Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#172B2A]/60 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* 2. Slide-out Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-[#112423] shadow-2xl flex flex-col z-50 p-5 overflow-y-auto">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E3ECEA] dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center font-black text-xs text-[#172B2A] shadow-xs">
              3G
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-[#172B2A] dark:text-[#F7FAF9] flex items-center gap-1">
                <span>MeLife</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA5]" />
              </span>
              <span className="text-[9px] font-bold text-[#008F83] dark:text-[#00BFA5] tracking-wider uppercase">
                Admin Portal
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#728B88] hover:text-[#172B2A] dark:text-[#7D9491] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="my-4 p-3 rounded-2xl bg-[#F4F8F7] dark:bg-white/5 border border-[#E3ECEA] dark:border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00B8D4] to-[#00BFA5] flex items-center justify-center text-sm font-black text-[#172B2A] shrink-0 shadow-xs">
            {(user.firstName || user.email || "A").charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] truncate">
              {`${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email}
            </span>
            <span className="text-[10px] text-[#728B88] dark:text-[#7D9491] truncate">
              {user.email}
            </span>
            <span className="text-[9px] font-black text-[#008F83] dark:text-[#00BFA5] uppercase tracking-wider mt-0.5">
              {role}
            </span>
          </div>
        </div>

        {/* Navigation Items (Permission Filtered) */}
        <nav aria-label="Mobile Admin Navigation" className="flex-1 space-y-1">
          {visibleNavItems.map((item) => {
            const active = isNavActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  active
                    ? "bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5] font-black"
                    : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#F4F8F7] dark:hover:bg-white/5"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 ${
                    active
                      ? "bg-[#00BFA5]/20 text-[#008F83] dark:text-[#00BFA5]"
                      : "text-[#728B88] dark:text-[#7D9491]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00BFA5]/15 text-[#008F83] dark:text-[#00BFA5]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Action */}
        <div className="pt-4 border-t border-[#E3ECEA] dark:border-white/10 mt-auto">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-xl shrink-0">
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
