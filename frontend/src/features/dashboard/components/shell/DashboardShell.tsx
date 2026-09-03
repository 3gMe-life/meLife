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
  const role = data?.data?.role || "PARTICIPANT";
  const educationStage = data?.data?.onboarding?.educationStage;

  return (
    <ProtectedRouteGuard allowedRoles={allowedRoles}>
      <div className="min-h-screen bg-[#F7FAF9] dark:bg-[#0D1C1B] text-[#172B2A] dark:text-[#F7FAF9] flex flex-col lg:flex-row antialiased transition-colors duration-200">
        {/* Desktop Sidebar */}
        {user && (
          <DashboardSidebar
            role={role}
            educationStage={educationStage}
          />
        )}

        {/* Mobile Navigation Drawer */}
        {user && (
          <DashboardMobileNav
            isOpen={isMobileNavOpen}
            onClose={() => setIsMobileNavOpen(false)}
            user={user}
            role={role}
            educationStage={educationStage}
          />
        )}

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          {user && (
            <DashboardHeader
              user={user}
              role={role}
              onMobileMenuToggle={() => setIsMobileNavOpen(true)}
            />
          )}

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRouteGuard>
  );
}
