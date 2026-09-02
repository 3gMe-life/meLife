import type { NavSection } from "../types/dashboard.types";
import type { UserRole } from "../../auth/types/auth.types";

export const PARTICIPANT_NAVIGATION: NavSection[] = [
  {
    id: "main",
    title: "Core Portal",
    items: [
      {
        id: "overview",
        label: "Dashboard",
        href: "/participant/dashboard",
        icon: "LayoutDashboard",
        isExact: true,
      },
      {
        id: "assessments",
        label: "My Assessments",
        href: "/participant/assessments",
        icon: "BookOpenCheck",
        badge: "2 Active",
        badgeColor: "primary",
      },
      {
        id: "results",
        label: "Psychometric Results",
        href: "/participant/results",
        icon: "LineChart",
      },
      {
        id: "pathways",
        label: "Career Pathways",
        href: "/participant/pathways",
        icon: "Compass",
      },
    ],
  },
  {
    id: "guidance",
    title: "Guidance & Growth",
    items: [
      {
        id: "counsellor",
        label: "Counsellor Connect",
        href: "/participant/counsellor",
        icon: "Users",
      },
      {
        id: "reports",
        label: "Career Reports",
        href: "/participant/reports",
        icon: "FileText",
      },
    ],
  },
  {
    id: "account",
    title: "Account",
    items: [
      {
        id: "settings",
        label: "Profile & Settings",
        href: "/participant/settings",
        icon: "Settings",
      },
    ],
  },
];

export const PARENT_NAVIGATION: NavSection[] = [
  {
    id: "main",
    title: "Parent Portal",
    items: [
      {
        id: "overview",
        label: "Dashboard",
        href: "/parent/dashboard",
        icon: "LayoutDashboard",
        isExact: true,
      },
      {
        id: "children",
        label: "Children Profiles",
        href: "/parent/children",
        icon: "Users",
      },
      {
        id: "results",
        label: "Assessment Reports",
        href: "/parent/reports",
        icon: "FileText",
      },
    ],
  },
];

export const COUNSELLOR_NAVIGATION: NavSection[] = [
  {
    id: "main",
    title: "Counsellor Portal",
    items: [
      {
        id: "overview",
        label: "Dashboard",
        href: "/counsellor/dashboard",
        icon: "LayoutDashboard",
        isExact: true,
      },
      {
        id: "students",
        label: "Assigned Students",
        href: "/counsellor/students",
        icon: "GraduationCap",
      },
      {
        id: "sessions",
        label: "Guidance Sessions",
        href: "/counsellor/sessions",
        icon: "Calendar",
      },
    ],
  },
];

export const INSTITUTION_NAVIGATION: NavSection[] = [
  {
    id: "main",
    title: "Institution Portal",
    items: [
      {
        id: "overview",
        label: "Dashboard",
        href: "/institution/dashboard",
        icon: "LayoutDashboard",
        isExact: true,
      },
      {
        id: "cohorts",
        label: "Student Cohorts",
        href: "/institution/cohorts",
        icon: "School",
      },
      {
        id: "vouchers",
        label: "Assessment Vouchers",
        href: "/institution/vouchers",
        icon: "Ticket",
      },
      {
        id: "analytics",
        label: "Analytics & Reports",
        href: "/institution/analytics",
        icon: "BarChart3",
      },
    ],
  },
];

export const ADMIN_NAVIGATION: NavSection[] = [
  {
    id: "main",
    title: "Administration",
    items: [
      {
        id: "overview",
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: "LayoutDashboard",
        isExact: true,
      },
      {
        id: "users",
        label: "User Management",
        href: "/admin/users",
        icon: "Users",
      },
      {
        id: "applications",
        label: "Pending Applications",
        href: "/admin/applications",
        icon: "CheckSquare",
      },
      {
        id: "assessments",
        label: "Question Banks",
        href: "/admin/assessments",
        icon: "Layers",
      },
    ],
  },
];

export function getNavigationForRole(role?: UserRole): NavSection[] {
  switch (role) {
    case "PARENT_GUARDIAN":
      return PARENT_NAVIGATION;
    case "CAREER_COUNSELLOR":
      return COUNSELLOR_NAVIGATION;
    case "INSTITUTION_ADMIN":
      return INSTITUTION_NAVIGATION;
    case "PLATFORM_ADMIN":
    case "COMPANY_ADMIN":
    case "SUPER_ADMIN":
      return ADMIN_NAVIGATION;
    case "PARTICIPANT":
    default:
      return PARTICIPANT_NAVIGATION;
  }
}
