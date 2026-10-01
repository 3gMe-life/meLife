/**
 * 3G MeLife Institution / School Dashboard Types & DTOs
 */

export interface InstitutionEntity {
  id: string;
  adminUserId: string;
  name: string;
  code: string;
  type: string;
  contactEmail: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  studentCapacity: number;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionClassEntity {
  id: string;
  institutionId: string;
  academicYear: string;
  gradeLevel: string;
  division: string;
  name: string;
  coordinatorName: string | null;
  studentCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type InstitutionStudentStatus = "ENROLLED" | "ACTIVE" | "INACTIVE" | "ALUMNI";

export interface InstitutionStudentEntity {
  id: string;
  institutionId: string;
  classId: string | null;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  rollNumber: string | null;
  academicYear: string;
  status: InstitutionStudentStatus;
  joinedAt: string;
  gradeLevel?: string;
  division?: string;
  className?: string;
  assessmentStatus?: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";
  hasParentLinked?: boolean;
  parentName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionAssessmentEntity {
  id: string;
  institutionId: string;
  classId: string | null;
  className?: string;
  assessmentCode: string;
  title: string;
  deadline: string | null;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  totalAssigned: number;
  completedCount: number;
  createdAt: string;
}

export interface InstitutionStaffEntity {
  id: string;
  institutionId: string;
  userId: string;
  name?: string;
  email?: string;
  roleTitle: string;
  department: string | null;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
}

export interface InstitutionOverviewStatsDTO {
  totalStudents: number;
  activeStudents: number;
  totalClasses: number;
  assessmentCompletionRate: number;
  pendingAssessmentsCount: number;
  upcomingSessionsCount: number;
  completedSessionsCount: number;
  connectedParentsCount: number;
}

export interface InstitutionOverviewDTO {
  institution: InstitutionEntity;
  stats: InstitutionOverviewStatsDTO;
  recentActivities: Array<{
    id: string;
    type: "ASSESSMENT" | "SESSION" | "PARENT" | "ENROLLMENT";
    title: string;
    description: string;
    timestamp: string;
  }>;
  recentClasses: InstitutionClassEntity[];
}

export interface UpdateInstitutionProfileDTO {
  name?: string;
  type?: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  studentCapacity?: number;
  logoUrl?: string | null;
}

export interface CreateInstitutionClassDTO {
  academicYear: string;
  gradeLevel: string;
  division: string;
  name?: string;
  coordinatorName?: string;
}

export interface AssignAssessmentDTO {
  classId?: string; // If omitted, assigned to all students in institution
  assessmentCode: string;
  title?: string;
  deadline?: string;
}
