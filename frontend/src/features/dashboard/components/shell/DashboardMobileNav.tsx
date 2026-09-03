"use client";

import React from "react";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#172B2A]/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-xs bg-white dark:bg-[#0D1C1B]/95 backdrop-blur-2xl border-r border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] h-full flex flex-col justify-between text-[#172B2A] dark:text-[#F7FAF9] p-5 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)] mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center font-black text-xs text-[#172B2A]">
                3G
              </div>
              <span className="text-base font-black tracking-tight text-[#172B2A] dark:text-[#F7FAF9]">
                MeLife
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#728B88] hover:text-[#172B2A] dark:hover:text-white hover:bg-[#EBF2F0] dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-1 custom-scrollbar">
            {navigation.map((section) => (
              <div key={section.id} className="space-y-1">
                {section.title && (
                  <h4 className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#728B88] dark:text-[#7D9491] mb-1">
                    {section.title}
                  </h4>
                )}

                {section.items.map((item) => {
                  const isActive = item.isExact
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-[#00BFA5] text-[#172B2A] font-bold shadow-xs"
                          : "text-[#526866] dark:text-[#9FB3B0] hover:text-[#172B2A] dark:hover:text-[#F7FAF9] hover:bg-[#EBF2F0] dark:hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <DashboardIcon name={item.icon} className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#EBF2F0] dark:bg-white/20 text-[#172B2A] dark:text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer User Card */}
        <div className="pt-4 border-t border-[#E3ECEA] dark:border-[rgba(227,236,234,0.1)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00B8D4] via-[#00BFA5] to-[#00C896] flex items-center justify-center font-bold text-xs text-[#172B2A]">
              {user.firstName?.[0] || "U"}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-[#172B2A] dark:text-[#F7FAF9] truncate">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-[10px] text-[#526866] dark:text-[#9FB3B0] truncate">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
