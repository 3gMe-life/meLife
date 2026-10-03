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

export type StudentInvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";

export type InvitationCampaignStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "PAUSED" | "FAILED";

export type InvitationDeliveryStatus =
  | "QUEUED"
  | "SENDING"
  | "SENT"
  | "DELIVERED"
  | "BOUNCED"
  | "FAILED"
  | "CANCELLED";

export interface InstitutionStudentCampaignEntity {
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

export interface InstitutionEmailJobEntity {
  id: string;
  campaignId: string | null;
  invitationId: string;
  institutionId: string;
  recipientEmail: string;
  recipientName: string;
  rawToken?: string;
  status: InvitationDeliveryStatus;
  attempts: number;
  maxAttempts: number;
  scheduledAt: string;
  processedAt: string | null;
  completedAt: string | null;
  lastError: string | null;
  isPermanentFailure: boolean;
  providerMessageId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionStudentInvitationEntity {
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
  tokenHash: string;
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

export interface ResendWebhookEventDTO {
  type: "email.sent" | "email.delivered" | "email.bounced" | "email.complained" | "email.delivery_delayed";
  created_at: string;
  data: {
    email_id?: string;
    id?: string;
    to?: string[];
    from?: string;
    subject?: string;
    status?: string;
    bounce_type?: string;
  };
}

