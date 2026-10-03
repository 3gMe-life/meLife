/**
 * 3G MeLife Company & Multi-Tenant Administration Types & DTOs
 */

export interface CompanyEntity {
  id: string;
  name: string;
  code: string;
  contactEmail: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  studentCapacity: number;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyUserItemDTO {
  id: string;
  companyId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  isActive: boolean;
  status: string;
  createdAt: string;
}

export interface CompanyOverviewMetricsDTO {
  totalUsers: number;
  activeUsers: number;
  totalStudents: number;
  totalInstitutions: number;
  totalCounsellors: number;
  activeAssessments: number;
  completedAssessments: number;
  upcomingSessions: number;
  completedSessions: number;
  pendingInvitations: number;
}

export interface CompanyRecentActivityDTO {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
}

export interface CompanyOverviewResponseDTO {
  company: CompanyEntity;
  metrics: CompanyOverviewMetricsDTO;
  recentActivities: CompanyRecentActivityDTO[];
}

export interface CompanyStudentItemDTO {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  institutionName: string;
  className?: string | null;
  gradeLevel?: string | null;
  academicYear: string;
  status: string;
  assessmentStatus: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";
  joinedAt: string;
}

export interface CompanyInstitutionItemDTO {
  id: string;
  name: string;
  code: string;
  type: string;
  contactEmail: string;
  city: string | null;
  state: string | null;
  studentCapacity: number;
  enrolledStudentsCount: number;
  classesCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CompanyCounsellorItemDTO {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  qualification: string | null;
  organization: string | null;
  approvalStatus: string;
  experienceYears: number;
  rating: number;
  isAvailable: boolean;
}

export interface CompanyAssessmentAllocationItemDTO {
  id: string;
  institutionId: string;
  institutionName: string;
  assessmentCode: string;
  title: string;
  deadline: string | null;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  totalAssigned: number;
  completedCount: number;
  createdAt: string;
}

export interface CompanySessionItemDTO {
  id: string;
  counsellorId: string;
  counsellorName: string;
  studentId: string;
  studentName: string;
  institutionName?: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
  meetingLink?: string | null;
  topic?: string | null;
}

export interface CompanyReportSummaryDTO {
  totalAssessmentsConducted: number;
  overallCompletionRate: number;
  topCareerClusters: Array<{ name: string; matchCount: number; percentage: number }>;
  cohortPerformance: Array<{
    institutionName: string;
    studentsCount: number;
    completedCount: number;
    completionRate: number;
  }>;
}

export interface CompanyInvitationItemDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  institutionName?: string;
  className?: string;
  status: "QUEUED" | "SENT" | "DELIVERED" | "FAILED" | "ACCEPTED" | "EXPIRED" | "REVOKED";
  invitedAt: string;
  acceptedAt?: string | null;
  expiresAt: string;
}

export interface CreateCompanyInvitationDTO {
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  institutionId?: string;
  classId?: string;
}

export interface BulkCompanyInvitationDTO {
  invitations: CreateCompanyInvitationDTO[];
}

export interface UpdateCompanySettingsDTO {
  name?: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  logoUrl?: string;
  studentCapacity?: number;
}
