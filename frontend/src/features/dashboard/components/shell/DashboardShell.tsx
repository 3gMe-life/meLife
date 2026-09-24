"use client";

import React, { useState } from "react";
import { ProtectedRouteGuard } from "../../guards/ProtectedRouteGuard";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardMobileNav } from "./DashboardMobileNav";
import { useCurrentUserQuery } from "../../../auth/hooks/useCurrentUserQuery";
import type { UserRole } from "../../../auth/types/auth.types";

interface DashboardShellProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function DashboardShell({
  children,
  allowedRoles,
}: DashboardShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { data } = useCurrentUserQuery();

  const user = data?.data?.user;
  const role = data?.data?.role || (user as any)?.role || "PARTICIPANT";
  const educationStage = data?.data?.onboarding?.educationStage;

  return (
    <ProtectedRouteGuard allowedRoles={allowedRoles}>
      <div className="min-h-screen bg-[#F7FAF9] dark:bg-[#0D1C1B] text-[#172B2A] dark:text-[#F7FAF9] flex flex-col antialiased transition-colors duration-200">
        {/* Top Header */}
        {user && (
          <div className="print:hidden">
            <DashboardHeader
              user={user}
              role={role}
              onMobileMenuToggle={() => setIsMobileNavOpen(true)}
            />
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {user && (
          <div className="print:hidden">
            <DashboardMobileNav
              isOpen={isMobileNavOpen}
              onClose={() => setIsMobileNavOpen(false)}
              user={user}
              role={role}
              educationStage={educationStage}
            />
          </div>
        )}

        {/* Body Area: Floating Pill Navigation Rail on Left + Main Content Viewport */}
        <div className="flex-1 flex w-full print:block print:p-0 print:m-0">
          {/* Desktop Floating Pill Sidebar Rail */}
          {user && (
            <aside className="hidden lg:block shrink-0 pl-4 sm:pl-6 lg:pl-8 py-3.5 sticky top-24 self-start z-40 print:hidden">
              <DashboardSidebar
                role={role}
                educationStage={educationStage}
              />
            </aside>
          )}

          {/* Main Content Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-3 sm:pt-4 max-w-7xl w-full mx-auto space-y-6 min-w-0 print:p-0 print:m-0 print:max-w-none print:w-full print:space-y-0">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRouteGuard>
  );
}
