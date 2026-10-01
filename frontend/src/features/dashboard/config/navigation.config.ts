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
        featureKey: "dashboard.overview",
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
        featureKey: "dashboard.counsellors",
      },
      {
        id: "parent-connect",
        label: "Parent Connect",
        href: "/participant/parent-connect",
        icon: "ShieldCheck",
      },
      {
        id: "reports",
        label: "Career Reports",
        href: "/participant/reports",
        icon: "FileText",
        featureKey: "dashboard.reports",
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
        featureKey: "dashboard.settings",
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
        featureKey: "dashboard.overview",
      },
      {
        id: "children",
        label: "Children Profiles",
        href: "/parent/children",
        icon: "Users",
        featureKey: "dashboard.children",
      },
      {
        id: "connect",
        label: "Link Child",
        href: "/parent/connect",
        icon: "ShieldCheck",
        featureKey: "dashboard.students",
      },
      {
        id: "results",
        label: "Assessment Reports",
        href: "/parent/reports",
        icon: "FileText",
        featureKey: "dashboard.reports",
      },
    ],
  },
  {
    id: "guidance",
    title: "Guidance & Insights",
    items: [
      {
        id: "analytics",
        label: "Child Analytics",
        href: "/parent/analytics",
        icon: "BarChart3",
        featureKey: "dashboard.analytics",
      },
      {
        id: "sessions",
        label: "Guidance Sessions",
        href: "/parent/sessions",
        icon: "Clock",
        featureKey: "dashboard.sessions",
      },
      {
        id: "calendar",
        label: "Calendar",
        href: "/parent/calendar",
        icon: "Calendar",
        featureKey: "dashboard.calendar",
      },
      {
        id: "reviews",
        label: "Reviews & Feedback",
        href: "/parent/reviews",
        icon: "Award",
        featureKey: "dashboard.reviews",
      },
    ],
  },
  {
    id: "account",
    title: "Communication & Account",
    items: [
      {
        id: "messages",
        label: "Messages",
        href: "/parent/messages",
        icon: "Inbox",
        featureKey: "dashboard.messages",
      },
      {
        id: "notifications",
        label: "Notifications",
        href: "/parent/notifications",
        icon: "Bell",
        featureKey: "dashboard.notifications",
      },
      {
        id: "profile",
        label: "Parent Profile",
        href: "/parent/profile",
        icon: "Users",
        featureKey: "dashboard.profile",
      },
      {
        id: "settings",
        label: "Settings",
        href: "/parent/settings",
        icon: "Settings",
        featureKey: "dashboard.settings",
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
        featureKey: "dashboard.overview",
      },
      {
        id: "calendar",
        label: "Calendar",
        href: "/counsellor/calendar",
        icon: "Calendar",
        featureKey: "dashboard.calendar",
      },
      {
        id: "sessions",
        label: "Guidance Sessions",
        href: "/counsellor/sessions",
        icon: "Clock",
        featureKey: "dashboard.sessions",
      },
      {
        id: "students",
        label: "Assigned Students",
        href: "/counsellor/students",
        icon: "GraduationCap",
        featureKey: "dashboard.students",
      },
      {
        id: "reviews",
        label: "Reviews & Feedback",
        href: "/counsellor/reviews",
        icon: "Award",
        featureKey: "dashboard.reviews",
      },
    ],
  },
  {
    id: "account",
    title: "Account & Practice",
    items: [
      {
        id: "profile",
        label: "Profile & Availability",
        href: "/counsellor/profile",
        icon: "Users",
        featureKey: "dashboard.profile",
      },
      {
        id: "settings",
        label: "Settings",
        href: "/counsellor/settings",
        icon: "Settings",
        featureKey: "dashboard.settings",
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
        featureKey: "dashboard.overview",
      },
      {
        id: "students",
        label: "Student Directory",
        href: "/institution/students",
        icon: "GraduationCap",
        featureKey: "dashboard.students",
      },
      {
        id: "cohorts",
        label: "Classes & Cohorts",
        href: "/institution/classes",
        icon: "School",
        featureKey: "dashboard.cohorts",
      },
      {
        id: "assessments",
        label: "Assessments",
        href: "/institution/assessments",
        icon: "ClipboardCheck",
        featureKey: "dashboard.assessments",
      },
      {
        id: "reports",
        label: "Student Reports",
        href: "/institution/reports",
        icon: "FileText",
        featureKey: "dashboard.reports",
      },
    ],
  },
  {
    id: "guidance",
    title: "Guidance & Ecosystem",
    items: [
      {
        id: "counsellors",
        label: "Counsellor Connect",
        href: "/institution/counsellors",
        icon: "Users",
        featureKey: "dashboard.counsellors",
      },
      {
        id: "sessions",
        label: "Guidance Sessions",
        href: "/institution/sessions",
        icon: "Clock",
        featureKey: "dashboard.sessions",
      },
      {
        id: "parents",
        label: "Parent Connect",
        href: "/institution/parents",
        icon: "HeartHandshake",
        featureKey: "dashboard.parents",
      },
      {
        id: "messages",
        label: "Messages",
        href: "/institution/messages",
        icon: "Inbox",
        featureKey: "dashboard.messages",
      },
    ],
  },
  {
    id: "management",
    title: "Management & Insights",
    items: [
      {
        id: "analytics",
        label: "Analytics & Reports",
        href: "/institution/analytics",
        icon: "BarChart3",
        featureKey: "dashboard.analytics",
      },
      {
        id: "staff",
        label: "Staff & Teachers",
        href: "/institution/staff",
        icon: "ShieldCheck",
        featureKey: "dashboard.staff",
      },
      {
        id: "vouchers",
        label: "Assessment Vouchers",
        href: "/institution/vouchers",
        icon: "Ticket",
        featureKey: "dashboard.vouchers",
      },
      {
        id: "settings",
        label: "Settings",
        href: "/institution/settings",
        icon: "Settings",
        featureKey: "dashboard.settings",
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
        featureKey: "dashboard.overview",
      },
      {
        id: "users",
        label: "User Management",
        href: "/admin/users",
        icon: "Users",
        featureKey: "dashboard.users",
      },
      {
        id: "institutions",
        label: "Institutions & Schools",
        href: "/admin/institutions",
        icon: "School",
        featureKey: "dashboard.institutions",
      },
      {
        id: "applications",
        label: "Counsellor Applications",
        href: "/admin/applications",
        icon: "CheckSquare",
        featureKey: "dashboard.counsellors",
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

export function getNavigationForRole(
  role?: UserRole,
  dashboardFeatures?: string[]
): NavSection[] {
  let baseSections: NavSection[] = [];
  switch (role) {
    case "PARENT_GUARDIAN":
      baseSections = PARENT_NAVIGATION;
      break;
    case "CAREER_COUNSELLOR":
      baseSections = COUNSELLOR_NAVIGATION;
      break;
    case "INSTITUTION_ADMIN":
      baseSections = INSTITUTION_NAVIGATION;
      break;
    case "PLATFORM_ADMIN":
    case "COMPANY_ADMIN":
    case "SUPER_ADMIN":
      baseSections = ADMIN_NAVIGATION;
      break;
    case "PARTICIPANT":
    default:
      baseSections = PARTICIPANT_NAVIGATION;
      break;
  }

  // Super Admin always sees all configured navigation items
  if (role === "SUPER_ADMIN") {
    return baseSections;
  }

  // If dashboardFeatures are loaded for user, dynamically filter disabled features
  if (dashboardFeatures && Array.isArray(dashboardFeatures)) {
    return baseSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          if (!item.featureKey) return true;
          if (item.id === "children") {
            return (
              dashboardFeatures.includes("dashboard.children") ||
              dashboardFeatures.includes("dashboard.students")
            );
          }
          if (item.id === "connect") {
            return (
              dashboardFeatures.includes("dashboard.students") ||
              dashboardFeatures.includes("dashboard.children")
            );
          }
          if (item.id === "counsellor") {
            return (
              dashboardFeatures.includes("dashboard.counsellors") ||
              dashboardFeatures.includes("dashboard.counsellor_connect")
            );
          }
          return dashboardFeatures.includes(item.featureKey);
        }),
      }))
      .filter((section) => section.items.length > 0);
  }

  return baseSections;
}
