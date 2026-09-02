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
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-xs bg-slate-950/95 backdrop-blur-2xl border-r border-white/10 h-full flex flex-col justify-between text-white p-5 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#14B8A6] flex items-center justify-center font-black text-xs text-white">
                3G
              </div>
              <span className="text-base font-black tracking-tight text-white">
                MeLife
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-1 custom-scrollbar">
            {navigation.map((section) => (
              <div key={section.id} className="space-y-1">
                {section.title && (
                  <h4 className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
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
                          ? "bg-[#2563EB] text-white"
                          : "text-slate-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <DashboardIcon name={item.icon} className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/20">
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
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#14B8A6] flex items-center justify-center font-bold text-xs text-white">
              {user.firstName?.[0] || "U"}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-white truncate">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {user.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
