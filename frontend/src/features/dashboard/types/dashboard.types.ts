import type { UserRole, UserProfile } from "../../auth/types/auth.types";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
  badgeColor?: "primary" | "accent" | "emerald" | "amber";
  isExact?: boolean;
  rolesAllowed?: UserRole[];
};

export type NavSection = {
  id: string;
  title?: string;
  items: NavItem[];
};

export interface MetricCardData {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  iconName: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: "blue" | "teal" | "emerald" | "indigo" | "amber" | "rose";
}

export type AssessmentStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface AssessmentItem {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  estimatedMinutes: number;
  questionCount: number;
  status: AssessmentStatus;
  progressPercentage: number;
  completedAt?: string;
  dominantTrait?: string;
}

export interface CareerPathwayPreview {
  id: string;
  title: string;
  category: string;
  matchScore: number;
  stream: string;
  growthOutlook: "Very High" | "High" | "Moderate";
  keySkills: string[];
  description: string;
}

export interface StrengthTrait {
  dimension: string;
  score: number;
  level: "High" | "Proficient" | "Developing";
  description: string;
}

export interface ParticipantDashboardState {
  user: UserProfile;
  educationStage: string | null;
  overallReadinessScore: number;
  assessments: AssessmentItem[];
  careerPathways: CareerPathwayPreview[];
  strengthTraits: StrengthTrait[];
  counsellorNotesCount: number;
}
