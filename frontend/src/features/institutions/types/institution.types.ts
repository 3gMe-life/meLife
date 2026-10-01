/**
 * Institution / School Portal Frontend Types & DTOs
 */

export interface InstitutionProfile {
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

export interface InstitutionClass {
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

export interface InstitutionStudent {
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

export interface InstitutionAssessment {
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

export interface InstitutionStaff {
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

export interface InstitutionOverviewStats {
  totalStudents: number;
  activeStudents: number;
  totalClasses: number;
  assessmentCompletionRate: number;
  pendingAssessmentsCount: number;
  upcomingSessionsCount: number;
  completedSessionsCount: number;
  connectedParentsCount: number;
}

export interface InstitutionActivity {
  id: string;
  type: "ASSESSMENT" | "SESSION" | "PARENT" | "ENROLLMENT";
  title: string;
  description: string;
  timestamp: string;
}

export interface InstitutionOverviewDTO {
  institution: InstitutionProfile;
  stats: InstitutionOverviewStats;
  recentActivities: InstitutionActivity[];
  recentClasses: InstitutionClass[];
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
