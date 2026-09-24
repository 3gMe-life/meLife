import type { RegistrationPath } from "../types/auth.types";

export const REGISTRATION_PATHS: Array<{
  id: RegistrationPath;
  title: string;
  description: string;
  iconName: "GraduationCap" | "Users" | "Compass" | "Building2";
  badge?: string;
}> = [
  {
    id: "STUDENT",
    title: "Student / Individual",
    description: "Discover your strengths and career pathways.",
    iconName: "GraduationCap",
  },
  {
    id: "PARENT",
    title: "Parent / Guardian",
    description: "Support your child's educational journey.",
    iconName: "Users",
  },
  {
    id: "COUNSELLOR",
    title: "Career Counsellor",
    description: "Guide participants using MeLife insights.",
    iconName: "Compass",
    badge: "Verification Required",
  },
  {
    id: "INSTITUTION",
    title: "School / Institution",
    description: "Assess learners at scale with cohort analytics.",
    iconName: "Building2",
    badge: "Application Flow",
  },
];

export const EDUCATION_STAGES = [
  { id: "grade_5", label: "Grade / Class 5", category: "Middle School" },
  { id: "grade_6", label: "Grade / Class 6", category: "Middle School" },
  { id: "grade_7", label: "Grade / Class 7", category: "Middle School" },
  { id: "grade_8", label: "Grade / Class 8", category: "Middle School" },
  { id: "grade_9", label: "Grade / Class 9", category: "Secondary School" },
  { id: "grade_10", label: "Grade / Class 10", category: "Secondary School" },
  { id: "grade_11", label: "Grade / Class 11", category: "Higher Secondary" },
  { id: "grade_12", label: "Grade / Class 12", category: "Higher Secondary" },
  { id: "college", label: "College / University", category: "Higher Education" },
  { id: "working_professional", label: "Working Professional", category: "Early Career" },
  { id: "other", label: "Other", category: "General" },
] as const;

export const INSTITUTION_TYPES = [
  { id: "school", label: "School" },
  { id: "college", label: "College" },
  { id: "university", label: "University" },
  { id: "training_institute", label: "Training Institute" },
  { id: "guidance_centre", label: "Career Guidance Centre" },
  { id: "other", label: "Other" },
] as const;

/**
 * Centralized dashboard destination resolver
 * Resolves user role to correct frontend dashboard route
 */
export const DASHBOARD_ROUTES: Record<string, string> = {
  PARTICIPANT: "/participant/dashboard",
  STUDENT: "/participant/dashboard",
  PARENT_GUARDIAN: "/parent/dashboard",
  PARENT: "/parent/dashboard",
  CAREER_COUNSELLOR: "/counsellor/dashboard",
  COUNSELLOR: "/counsellor/dashboard",
  INSTITUTION_ADMIN: "/institution/dashboard",
  PLATFORM_ADMIN: "/admin/dashboard",
  COMPANY_ADMIN: "/company/dashboard",
  SUPER_ADMIN: "/admin/dashboard",
  COUNSELLOR_PENDING: "/counsellor/application-pending",
  DEFAULT: "/participant/dashboard",
};

export const resolveDashboardRoute = (
  role?: string,
  userStatus?: string,
  counsellorApplication?: { status: string } | null
): string => {
  // 1. Counsellor applicant pending verification check
  if (
    counsellorApplication?.status === "PENDING" ||
    (userStatus === "PENDING_VERIFICATION" && counsellorApplication)
  ) {
    return DASHBOARD_ROUTES.COUNSELLOR_PENDING;
  }

  // 2. Counsellor applicant rejected check
  if (counsellorApplication?.status === "REJECTED") {
    return DASHBOARD_ROUTES.COUNSELLOR_PENDING;
  }

  // 3. Role-based routing for active personas
  if (!role) return DASHBOARD_ROUTES.DEFAULT;
  const normalized = role.toUpperCase().trim();
  return DASHBOARD_ROUTES[normalized] || DASHBOARD_ROUTES.DEFAULT;
};

// Backward compatibility alias
export const resolveDashboardPath = resolveDashboardRoute;
