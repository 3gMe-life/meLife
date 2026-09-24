"use client";

import React from "react";
import type { UserProfile } from "@/features/auth/types/auth.types";
import { AdminOverviewView } from "./AdminOverviewView";

export interface AdminDashboardViewProps {
  user: UserProfile;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ user }) => {
  return <AdminOverviewView user={user} />;
};

export { AdminOverviewView };
