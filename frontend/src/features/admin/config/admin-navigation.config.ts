import React from "react";
import {
  LayoutDashboard,
  School,
  UserCheck,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  ShieldCheck,
  Settings,
} from "lucide-react";
import type { FeatureKey } from "@/features/access-control";

export interface AdminNavItem {
  id: string;
  featureKey: FeatureKey;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  /**
   * Primary required permission for this navigation item.
   * If the user has 'admin.all' (or super admin status), access is automatically granted.
   */
  requiredPermission?: string;
  /**
   * Any of these permissions will grant visibility to the item.
   */
  requiredAnyPermissions?: string[];
  /**
   * Optional badge text
   */
  badge?: string;
  /**
   * Badge color styling variant
   */
  badgeVariant?: "teal" | "amber" | "indigo" | "rose";
}

/**
 * Canonical Administrative Navigation Definitions
 * Maps each administrative feature to its required permissions and routes.
 */
export const ADMIN_NAVIGATION_ITEMS: AdminNavItem[] = [
  {
    id: "dashboard",
    featureKey: "admin.dashboard",
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    requiredPermission: "admin.all",
    requiredAnyPermissions: ["dashboard.view", "admin.all"],
  },
  {
    id: "institutions",
    featureKey: "admin.institutions",
    label: "Institutions & Schools",
    href: "/admin/institutions",
    icon: School,
    requiredPermission: "admin.all",
    requiredAnyPermissions: ["institution.manage", "institution.read", "admin.all"],
  },
  {
    id: "counsellors",
    featureKey: "admin.counsellors",
    label: "Counsellors",
    href: "/admin/counsellors",
    icon: UserCheck,
    requiredPermission: "admin.all",
    requiredAnyPermissions: ["counsellor.read", "counsellor.manage", "admin.all"],
  },
  {
    id: "users",
    featureKey: "admin.users",
    label: "Users & Accounts",
    href: "/admin/users",
    icon: Users,
    requiredPermission: "admin.all",
    requiredAnyPermissions: ["user.read", "user.manage", "admin.all"],
  },
  {
    id: "students",
    featureKey: "admin.students",
    label: "Students",
    href: "/admin/students",
    icon: GraduationCap,
    requiredPermission: "student.read",
    requiredAnyPermissions: ["student.read", "student.manage", "admin.all"],
  },
  {
    id: "sessions",
    featureKey: "admin.sessions",
    label: "Sessions",
    href: "/admin/sessions",
    icon: Calendar,
    requiredPermission: "admin.all",
    requiredAnyPermissions: ["session.read", "session.manage", "admin.all"],
  },
  {
    id: "reports",
    featureKey: "admin.reports",
    label: "Reports",
    href: "/admin/reports",
    icon: FileText,
    requiredPermission: "admin.all",
    requiredAnyPermissions: ["report.read", "report.manage", "admin.all"],
  },
  {
    id: "roles-permissions",
    featureKey: "admin.roles",
    label: "Roles & Permissions",
    href: "/admin/roles",
    icon: ShieldCheck,
    requiredPermission: "admin.all",
    requiredAnyPermissions: ["role.read", "permission.read", "admin.all"],
  },
  {
    id: "settings",
    featureKey: "admin.settings",
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    requiredPermission: "admin.all",
    requiredAnyPermissions: ["settings.read", "settings.manage", "admin.all"],
  },
];

/**
 * Evaluates whether an administrative navigation item should be visible
 * to the user based on verified permissions, super admin overrides, or feature access evaluation.
 */
export function isNavItemVisible(
  item: AdminNavItem,
  permissions: string[] = [],
  isSuperAdmin = false,
  canAccessFn?: (featureKey: FeatureKey) => boolean
): boolean {
  // 1. Root / Super Admin Override
  if (isSuperAdmin || permissions.includes("admin.all")) {
    return true;
  }

  // 2. Specific Permission Grant
  if (item.requiredPermission && permissions.includes(item.requiredPermission)) {
    return true;
  }

  // 3. Any Permission Match
  if (
    item.requiredAnyPermissions &&
    item.requiredAnyPermissions.some((p) => permissions.includes(p))
  ) {
    return true;
  }

  // 4. Feature Access Engine Fallback (handles role-based fallback rules)
  if (canAccessFn && canAccessFn(item.featureKey)) {
    return true;
  }

  return false;
}
