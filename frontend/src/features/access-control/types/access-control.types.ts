import type { UserRole } from "@/features/auth/types/auth.types";

export type FeatureCategory =
  | "admin"
  | "counsellor"
  | "participant"
  | "institution"
  | "parent";

export type FeatureKey =
  // Admin Features
  | "admin.dashboard"
  | "admin.users"
  | "admin.roles"
  | "admin.counsellors"
  | "admin.students"
  | "admin.sessions"
  | "admin.reports"
  | "admin.settings"
  // Counsellor Features
  | "counsellor.dashboard"
  | "counsellor.sessions"
  | "counsellor.sessions.today"
  | "counsellor.sessions.upcoming"
  | "counsellor.sessions.requests"
  | "counsellor.sessions.history"
  | "counsellor.students"
  | "counsellor.calendar"
  | "counsellor.reports"
  | "counsellor.reviews"
  | "counsellor.profile"
  | "counsellor.settings"
  // Participant / Student Features
  | "participant.dashboard"
  | "participant.assessments"
  | "participant.results"
  | "participant.pathways"
  | "participant.counsellor"
  | "participant.reports"
  | "participant.settings"
  // Institution Features
  | "institution.dashboard"
  | "institution.cohorts"
  | "institution.vouchers"
  | "institution.analytics"
  // Parent Features
  | "parent.dashboard"
  | "parent.children"
  | "parent.reports";

export interface FeatureDefinition {
  /** Unique key identifying the feature */
  key: FeatureKey;
  /** Human-readable display name */
  name: string;
  /** Detailed description of feature purpose */
  description: string;
  /** Canonical frontend route */
  route: string;
  /** Functional category */
  category: FeatureCategory;

  /**
   * Specific database permission required (e.g., "student.read").
   * Evaluated against PostgreSQL `permissions` table.
   */
  requiredPermission?: string;

  /**
   * Any of these database permissions will grant access.
   */
  requiredAnyPermissions?: string[];

  /**
   * Role-based fallback list for features where fine-grained DB permissions
   * have not yet been provisioned in the database schema.
   */
  allowedRoles?: UserRole[];

  /**
   * Whether this feature should appear in the primary navigation / sidebar.
   */
  navigationVisibility: boolean;

  /**
   * Whether this feature should be surfaced as a dashboard card / quick link.
   */
  dashboardVisibility: boolean;

  /**
   * Optional badge metadata
   */
  badge?: {
    text: string;
    variant?: "teal" | "amber" | "indigo" | "primary";
  };
}

export interface FeatureAccessResult {
  isGranted: boolean;
  reason: "SUPER_ADMIN" | "PERMISSION_GRANTED" | "ROLE_FALLBACK" | "DENIED";
  feature?: FeatureDefinition;
}

export interface PermissionGapReportItem {
  featureKey: FeatureKey;
  featureName: string;
  route: string;
  conceptualPermission: string;
  isDbPresent: boolean;
  actualDbPermission?: string;
  resolutionStrategy: "EXACT_DB_PERMISSION" | "COARSE_DB_PERMISSION" | "ROLE_FALLBACK";
  notes: string;
}
