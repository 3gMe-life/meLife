export type InvitationStatus = "ACTIVE" | "USED" | "EXPIRED" | "REVOKED";

export type LinkStatus = "ACTIVE" | "PENDING" | "REVOKED";

export type RelationshipType = "PARENT" | "GUARDIAN" | "FATHER" | "MOTHER" | "OTHER";

export type LinkMethod = "INVITATION_CODE" | "DIRECT_ADMIN" | "MANUAL";

export interface ParentInvitation {
  id: string;
  studentId?: string;
  student_id?: string;
  inviteCode?: string;
  invite_code?: string;
  status: InvitationStatus;
  expiresAt?: Date | string;
  expires_at?: Date | string;
  usedAt?: Date | string | null;
  used_at?: Date | string | null;
  usedByParentId?: string | null;
  used_by_parent_id?: string | null;
  createdAt?: Date | string;
  created_at?: Date | string;
}

export interface StudentParentLink {
  id: string;
  parent_user_id: string;
  student_user_id: string;
  relationship_type: string;
  link_status: LinkStatus;
  link_method: string;
  invitation_id?: string | null;
  invitationId?: string | null;
  verified_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface InvitationSafeVerification {
  valid: boolean;
  inviteCode: string;
  student: {
    id: string;
    firstName: string;
    gradeLevel: string | null;
    educationStage: string | null;
    schoolName: string | null;
  };
  expiresAt: Date;
}

export interface ConnectedChildInfo {
  linkId: string;
  studentId: string;
  id?: string;
  name?: string;
  firstName: string;
  lastName: string;
  age?: number | string | null;
  dateOfBirth?: string | null;
  grade?: string | null;
  gradeLevel: string | null;
  educationStage: string | null;
  school?: string | null;
  schoolName: string | null;
  curriculumOrBoard: string | null;
  relationship?: string;
  relationshipType: string;
  linkStatus: LinkStatus;
  status?: string;
  verifiedAt: Date | string;
  connectedAt: Date | string;
  assessmentProgress?: {
    completed: number;
    total: number;
  };
}

export interface LinkedParentInfo {
  linkId: string;
  parentId: string;
  firstName: string;
  lastName: string;
  email?: string;
  relationshipType: string;
  linkStatus: LinkStatus;
  verifiedAt: Date;
  connectedAt: Date;
}

export interface ChildAssessmentSummary {
  assessmentCode: string;
  title: string;
  category: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  completedAt: Date | null;
  dominantTraits?: string[];
  summary?: string;
  resultId?: string;
}

export interface ChildReportSummary {
  id: string;
  reportTitle: string;
  assessmentCode: string;
  languageCode: string;
  status: string;
  generatedAt: Date;
}

export interface ParentReportItemDTO {
  id: string;
  assessmentResultId: string;
  studentId: string;
  studentName: string;
  studentFirstName: string;
  studentLastName: string;
  studentGrade: string | null;
  studentSchool: string | null;
  assessmentCode: string;
  reportTitle: string;
  profileArchetype: string | null;
  languageCode: string;
  status: string;
  generatedAt: Date | string;
}

export interface ParentReportDetailDTO {
  id: string;
  assessmentResultId: string;
  studentId: string;
  studentName: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail?: string;
  studentGrade: string | null;
  studentSchool: string | null;
  studentEducationStage: string | null;
  studentCurriculum: string | null;
  studentAge: number | null;
  assessmentCode: string;
  reportTitle: string;
  profileArchetype: string | null;
  languageCode: string;
  status: string;
  reportData: any;
  filePath?: string | null;
  generatedAt: Date | string;
}

export interface ChildOverviewDTO {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    age?: number | null;
    gradeLevel: string | null;
    educationStage: string | null;
    schoolName: string | null;
    curriculumOrBoard: string | null;
    isOnboarded: boolean;
  };
  relationship: {
    linkId: string;
    relationshipType: string;
    linkStatus: LinkStatus;
    verifiedAt: Date;
  };
  assessments: ChildAssessmentSummary[];
  reports: ChildReportSummary[];
  counsellingSessionsCount: number;
}

export interface CreateInvitationDTO {
  studentId: string;
}

export interface VerifyInvitationDTO {
  inviteCode: string;
}

export interface RedeemInvitationDTO {
  inviteCode: string;
  studentEmail: string;
  relationshipType?: string;
}

