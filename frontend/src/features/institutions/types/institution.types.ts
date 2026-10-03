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

export type StudentInvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";

export type InvitationCampaignStatus =
  | "QUEUED"
  | "PROCESSING"
  | "COMPLETED"
  | "PARTIALLY_FAILED"
  | "FAILED"
  | "CANCELLED";

export type InvitationDeliveryStatus =
  | "QUEUED"
  | "PROCESSING"
  | "SENT"
  | "DELIVERED"
  | "BOUNCED"
  | "FAILED"
  | "CANCELLED";

export interface InstitutionStudentCampaign {
  id: string;
  institutionId: string;
  institutionName?: string;
  classId: string | null;
  className?: string;
  createdByUserId: string;
  createdByName?: string;
  name: string;
  totalCount: number;
  queuedCount: number;
  processingCount: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  bouncedCount: number;
  acceptedCount: number;
  status: InvitationCampaignStatus;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
}

export interface InstitutionStudentInvitation {
  id: string;
  institutionId: string;
  institutionName?: string;
  campaignId?: string | null;
  classId: string | null;
  className?: string;
  gradeLevel?: string;
  division?: string;
  email: string;
  firstName: string;
  lastName: string;
  rollNumber: string | null;
  academicYear: string;
  status: StudentInvitationStatus;
  deliveryStatus?: InvitationDeliveryStatus;
  deliveryEventAt?: string | null;
  providerMessageId?: string | null;
  failureReason?: string | null;
  invitedByUserId: string;
  acceptedByUserId: string | null;
  expiresAt: string;
  sentAt: string;
  acceptedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentInvitationDTO {
  email: string;
  firstName: string;
  lastName: string;
  classId?: string | null;
  rollNumber?: string | null;
  academicYear?: string;
}

export interface BulkImportStudentInvitationRowDTO {
  firstName: string;
  lastName: string;
  email: string;
  classId?: string | null;
  className?: string | null;
  gradeLevel?: string | null;
  division?: string | null;
  rollNumber?: string | null;
  academicYear?: string;
}

export interface BulkImportStudentInvitationsRequestDTO {
  campaignName?: string;
  previewOnly?: boolean;
  invitations: BulkImportStudentInvitationRowDTO[];
  defaultClassId?: string | null;
  defaultAcademicYear?: string;
}

export interface BulkImportRowResult {
  row: number;
  email: string;
  name: string;
  status: "IMPORTED" | "SKIPPED" | "FAILED" | "DUPLICATE_IN_FILE" | "ALREADY_ENROLLED" | "ALREADY_INVITED" | "INVALID_EMAIL";
  message?: string;
  invitationId?: string;
}

export interface BulkImportStudentInvitationsResultDTO {
  campaignId?: string;
  totalProcessed: number;
  importedCount: number;
  skippedCount: number;
  failedCount: number;
  results: BulkImportRowResult[];
}

export interface StudentInvitationValidationDTO {
  isValid: boolean;
  status: StudentInvitationStatus;
  invitationId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  rollNumber?: string | null;
  academicYear?: string;
  institutionName?: string;
  className?: string | null;
  gradeLevel?: string | null;
  division?: string | null;
  hasExistingAccount?: boolean;
  error?: string;
}

export interface AcceptStudentInvitationDTO {
  token: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}
