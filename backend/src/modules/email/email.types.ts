export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface WelcomeEmailPayload {
  to: string;
  firstName?: string;
  role: "PARTICIPANT" | "PARENT_GUARDIAN" | "CAREER_COUNSELLOR" | "INSTITUTION_ADMIN" | string;
  dashboardUrl?: string;
}

export interface PasswordResetEmailPayload {
  to: string;
  firstName?: string;
  resetUrl: string;
  expiresInMinutes?: number;
}

export interface InstitutionApplicationSubmittedPayload {
  to: string;
  contactName: string;
  institutionName: string;
  institutionType: string;
  trackingId?: string;
}

export interface InstitutionApplicationApprovedPayload {
  to: string;
  contactName: string;
  institutionName: string;
  institutionCode: string;
  temporaryPassword?: string;
  loginUrl?: string;
}

export interface InstitutionApplicationRejectedPayload {
  to: string;
  contactName: string;
  institutionName: string;
  reason?: string;
  reviewNotes?: string;
}

export interface CounsellorApplicationSubmittedPayload {
  to: string;
  applicantName: string;
  qualification?: string;
  organization?: string;
}

export interface CounsellorApplicationApprovedPayload {
  to: string;
  applicantName: string;
  dashboardUrl?: string;
}

export interface CounsellorApplicationRejectedPayload {
  to: string;
  applicantName: string;
  reason?: string;
}

export interface ParentInvitationEmailPayload {
  to: string;
  parentName?: string;
  studentName: string;
  inviteCode: string;
  redeemUrl: string;
  expiresAt: Date | string;
}

export interface ParentLinkedEmailPayload {
  to: string;
  recipientName: string;
  linkedPartyName: string;
  role: "STUDENT" | "PARENT";
  dashboardUrl?: string;
}

export interface SessionBookedEmailPayload {
  to: string;
  recipientName: string;
  counsellorName: string;
  studentName: string;
  sessionDate: string;
  timeSlot?: string;
  meetingLink?: string;
  role: "STUDENT" | "COUNSELLOR" | "PARENT";
}

export interface SessionCancelledEmailPayload {
  to: string;
  recipientName: string;
  counsellorName: string;
  studentName: string;
  sessionDate: string;
  reason?: string;
}

export interface AssessmentCompletedEmailPayload {
  to: string;
  studentName: string;
  assessmentTitle: string;
  reportUrl: string;
  completedAt?: string;
}
