import type { FeatureDefinition, FeatureKey } from "../types/access-control.types";

/**
 * Centralized Platform Feature Registry
 * Defines all conceptual and implemented features across all portals.
 *
 * Each feature registers:
 * - key: Unique feature identifier
 * - name: Display title
 * - route: Canonical URL path
 * - requiredPermission: DB permission required for access
 * - allowedRoles: Fallback roles authorized when fine-grained DB permissions are missing
 * - navigationVisibility: Whether to show in main portal navigation
 * - dashboardVisibility: Whether to show as a quick link / widget on the overview
 */
export const FEATURE_REGISTRY: Record<FeatureKey, FeatureDefinition> = {
  // ==========================================
  // ADMIN PORTAL FEATURES
  // ==========================================
  "admin.dashboard": {
    key: "admin.dashboard",
    name: "Admin Dashboard",
    description: "System overview, active user counts, and platform telemetry",
    route: "/admin/dashboard",
    category: "admin",
    requiredPermission: "admin.all",
    allowedRoles: ["SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "admin.users": {
    key: "admin.users",
    name: "User Management",
    description: "Administrative directory, account lifecycle, and role assignment",
    route: "/admin/users",
    category: "admin",
    requiredPermission: "admin.all",
    allowedRoles: ["SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "admin.roles": {
    key: "admin.roles",
    name: "Roles & Permissions",
    description: "Role definition, RBAC matrix, and permission grant management",
    route: "/admin/roles",
    category: "admin",
    requiredPermission: "admin.all",
    allowedRoles: ["SUPER_ADMIN", "PLATFORM_ADMIN"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "admin.counsellors": {
    key: "admin.counsellors",
    name: "Counsellors Management",
    description: "Counsellor applications, vetting, verification, and credentials",
    route: "/admin/counsellors",
    category: "admin",
    requiredPermission: "admin.all",
    allowedRoles: ["SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "admin.students": {
    key: "admin.students",
    name: "Students Directory",
    description: "Cross-platform student profiles, cohorts, and assessment progress",
    route: "/admin/students",
    category: "admin",
    requiredAnyPermissions: ["student.read", "student.manage", "admin.all"],
    allowedRoles: ["SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "admin.sessions": {
    key: "admin.sessions",
    name: "Guidance Sessions",
    description: "Platform-wide counselling sessions and booking audit trails",
    route: "/admin/sessions",
    category: "admin",
    requiredPermission: "admin.all",
    allowedRoles: ["SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "admin.reports": {
    key: "admin.reports",
    name: "Administrative Reports",
    description: "Platform analytics, assessment summaries, and exportable reports",
    route: "/admin/reports",
    category: "admin",
    requiredPermission: "admin.all",
    allowedRoles: ["SUPER_ADMIN", "PLATFORM_ADMIN", "COMPANY_ADMIN"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "admin.settings": {
    key: "admin.settings",
    name: "System Settings",
    description: "Global system configuration, security policies, and integrations",
    route: "/admin/settings",
    category: "admin",
    requiredPermission: "admin.all",
    allowedRoles: ["SUPER_ADMIN", "PLATFORM_ADMIN"],
    navigationVisibility: true,
    dashboardVisibility: false,
  },

  // ==========================================
  // COUNSELLOR PORTAL FEATURES
  // ==========================================
  "counsellor.dashboard": {
    key: "counsellor.dashboard",
    name: "Counsellor Dashboard",
    description: "Counsellor activity hub, upcoming sessions, and pending requests",
    route: "/counsellor/dashboard",
    category: "counsellor",
    allowedRoles: ["CAREER_COUNSELLOR"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "counsellor.sessions": {
    key: "counsellor.sessions",
    name: "Guidance Sessions",
    description: "1-on-1 career guidance sessions, booking manager, and history",
    route: "/counsellor/sessions",
    category: "counsellor",
    allowedRoles: ["CAREER_COUNSELLOR"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "counsellor.sessions.today": {
    key: "counsellor.sessions.today",
    name: "Today's Sessions",
    description: "Sessions scheduled for today's agenda",
    route: "/counsellor/sessions?tab=today",
    category: "counsellor",
    allowedRoles: ["CAREER_COUNSELLOR"],
    navigationVisibility: false,
    dashboardVisibility: true,
  },
  "counsellor.sessions.upcoming": {
    key: "counsellor.sessions.upcoming",
    name: "Upcoming Sessions",
    description: "Future confirmed guidance sessions",
    route: "/counsellor/sessions?tab=upcoming",
    category: "counsellor",
    allowedRoles: ["CAREER_COUNSELLOR"],
    navigationVisibility: false,
    dashboardVisibility: true,
  },
  "counsellor.sessions.requests": {
    key: "counsellor.sessions.requests",
    name: "Session Requests",
    description: "Pending student guidance booking requests awaiting response",
    route: "/counsellor/sessions?tab=requests",
    category: "counsellor",
    allowedRoles: ["CAREER_COUNSELLOR"],
    navigationVisibility: false,
    dashboardVisibility: true,
  },
  "counsellor.sessions.history": {
    key: "counsellor.sessions.history",
    name: "Session History",
    description: "Past completed counselling logs and student case notes",
    route: "/counsellor/sessions?tab=history",
    category: "counsellor",
    allowedRoles: ["CAREER_COUNSELLOR"],
    navigationVisibility: false,
    dashboardVisibility: false,
  },
  "counsellor.students": {
    key: "counsellor.students",
    name: "Assigned Students",
    description: "Student rosters, psychometric summaries, and academic progress",
    route: "/counsellor/students",
    category: "counsellor",
    requiredPermission: "student.read",
    allowedRoles: ["CAREER_COUNSELLOR"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "counsellor.calendar": {
    key: "counsellor.calendar",
    name: "Availability Calendar",
    description: "Weekly availability schedule, working hours, and time blocks",
    route: "/counsellor/calendar",
    category: "counsellor",
    allowedRoles: ["CAREER_COUNSELLOR"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "counsellor.reports": {
    key: "counsellor.reports",
    name: "Student Reports",
    description: "Psychometric assessment reports and career pathway recommendations",
    route: "/counsellor/reports",
    category: "counsellor",
    requiredPermission: "result.read_own",
    allowedRoles: ["CAREER_COUNSELLOR"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "counsellor.reviews": {
    key: "counsellor.reviews",
    name: "Reviews & Feedback",
    description: "Student ratings, testimonials, and session feedback",
    route: "/counsellor/reviews",
    category: "counsellor",
    allowedRoles: ["CAREER_COUNSELLOR"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "counsellor.profile": {
    key: "counsellor.profile",
    name: "Professional Profile",
    description: "Public counsellor bio, specialties, credentials, and meeting links",
    route: "/counsellor/profile",
    category: "counsellor",
    allowedRoles: ["CAREER_COUNSELLOR"],
    navigationVisibility: true,
    dashboardVisibility: false,
  },
  "counsellor.settings": {
    key: "counsellor.settings",
    name: "Practice Settings",
    description: "Notification preferences, security, and account settings",
    route: "/counsellor/settings",
    category: "counsellor",
    allowedRoles: ["CAREER_COUNSELLOR"],
    navigationVisibility: true,
    dashboardVisibility: false,
  },

  // ==========================================
  // PARTICIPANT / STUDENT PORTAL FEATURES
  // ==========================================
  "participant.dashboard": {
    key: "participant.dashboard",
    name: "Participant Dashboard",
    description: "Student overview, active assessments, and career journey progress",
    route: "/participant/dashboard",
    category: "participant",
    allowedRoles: ["PARTICIPANT"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "participant.assessments": {
    key: "participant.assessments",
    name: "My Assessments",
    description: "Take assigned psychometric and aptitude assessments",
    route: "/participant/assessments",
    category: "participant",
    requiredPermission: "assessment.take",
    allowedRoles: ["PARTICIPANT"],
    navigationVisibility: true,
    dashboardVisibility: true,
    badge: {
      text: "2 Active",
      variant: "primary",
    },
  },
  "participant.results": {
    key: "participant.results",
    name: "Psychometric Results",
    description: "Comprehensive trait scores, career fit indices, and comparisons",
    route: "/participant/results",
    category: "participant",
    requiredPermission: "result.read_own",
    allowedRoles: ["PARTICIPANT"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "participant.pathways": {
    key: "participant.pathways",
    name: "Career Pathways",
    description: "AI-powered career recommendations and educational milestones",
    route: "/participant/pathways",
    category: "participant",
    requiredPermission: "result.read_own",
    allowedRoles: ["PARTICIPANT"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "participant.counsellor": {
    key: "participant.counsellor",
    name: "Counsellor Connect",
    description: "Book guidance sessions with certified career counsellors",
    route: "/participant/counsellor",
    category: "participant",
    allowedRoles: ["PARTICIPANT"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "participant.reports": {
    key: "participant.reports",
    name: "Career Reports",
    description: "Detailed downloadable PDF and interactive career reports",
    route: "/participant/reports",
    category: "participant",
    requiredPermission: "result.read_own",
    allowedRoles: ["PARTICIPANT"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "participant.settings": {
    key: "participant.settings",
    name: "Profile & Settings",
    description: "Student account settings, grade level, and security preferences",
    route: "/participant/settings",
    category: "participant",
    allowedRoles: ["PARTICIPANT"],
    navigationVisibility: true,
    dashboardVisibility: false,
  },

  // ==========================================
  // INSTITUTION PORTAL FEATURES
  // ==========================================
  "institution.dashboard": {
    key: "institution.dashboard",
    name: "Institution Dashboard",
    description: "School / College cohort statistics and license management",
    route: "/institution/dashboard",
    category: "institution",
    requiredPermission: "institution.manage",
    allowedRoles: ["INSTITUTION_ADMIN"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "institution.cohorts": {
    key: "institution.cohorts",
    name: "Student Cohorts",
    description: "Manage classes, student rosters, and batch enrollments",
    route: "/institution/cohorts",
    category: "institution",
    requiredAnyPermissions: ["student.manage", "institution.manage"],
    allowedRoles: ["INSTITUTION_ADMIN"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "institution.vouchers": {
    key: "institution.vouchers",
    name: "Assessment Vouchers",
    description: "Generate and distribute bulk assessment licenses",
    route: "/institution/vouchers",
    category: "institution",
    requiredPermission: "institution.manage",
    allowedRoles: ["INSTITUTION_ADMIN"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "institution.analytics": {
    key: "institution.analytics",
    name: "Analytics & Reports",
    description: "Aggregate institutional career readiness analytics",
    route: "/institution/analytics",
    category: "institution",
    requiredPermission: "institution.manage",
    allowedRoles: ["INSTITUTION_ADMIN"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },

  // ==========================================
  // PARENT PORTAL FEATURES
  // ==========================================
  "parent.dashboard": {
    key: "parent.dashboard",
    name: "Parent Dashboard",
    description: "Parent portal overview and linked children summary",
    route: "/parent/dashboard",
    category: "parent",
    allowedRoles: ["PARENT_GUARDIAN"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "parent.children": {
    key: "parent.children",
    name: "Children Profiles",
    description: "View linked children's assessment milestones and progress",
    route: "/parent/children",
    category: "parent",
    requiredPermission: "student.read",
    allowedRoles: ["PARENT_GUARDIAN"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
  "parent.reports": {
    key: "parent.reports",
    name: "Child Assessment Reports",
    description: "Access child psychometric evaluation reports and career fits",
    route: "/parent/reports",
    category: "parent",
    requiredPermission: "result.read_own",
    allowedRoles: ["PARENT_GUARDIAN"],
    navigationVisibility: true,
    dashboardVisibility: true,
  },
};

/**
 * Helper to get all registered features as a list
 */
export function getAllFeatures(): FeatureDefinition[] {
  return Object.values(FEATURE_REGISTRY);
}

/**
 * Helper to get features filtered by category
 */
export function getFeaturesByCategory(category: FeatureDefinition["category"]): FeatureDefinition[] {
  return Object.values(FEATURE_REGISTRY).filter((f) => f.category === category);
}

/**
 * Helper to look up a feature by its canonical route
 */
export function getFeatureByRoute(route: string): FeatureDefinition | undefined {
  return Object.values(FEATURE_REGISTRY).find((f) => f.route === route);
}
