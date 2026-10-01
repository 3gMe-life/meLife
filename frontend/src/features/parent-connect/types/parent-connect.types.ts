export type InvitationStatus = "ACTIVE" | "USED" | "EXPIRED" | "REVOKED";
export type LinkStatus = "ACTIVE" | "PENDING" | "REVOKED";
export type RelationshipType = "PARENT" | "GUARDIAN" | "FATHER" | "MOTHER" | "OTHER";

export interface ParentInvitation {
  id: string;
  studentId: string;
  inviteCode: string;
  status: InvitationStatus;
  expiresAt: string;
  usedAt: string | null;
  usedByParentId: string | null;
  createdAt: string;
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
  expiresAt: string;
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
  verifiedAt: string;
  connectedAt: string;
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
  verifiedAt: string;
  connectedAt: string;
}

export interface ChildAssessmentSummary {
  assessmentCode: string;
  title: string;
  category: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  completedAt: string | null;
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
  generatedAt: string;
}

export interface ParentReportItem {
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
  generatedAt: string;
}

export interface ParentReportDetail {
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
  generatedAt: string;
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
    verifiedAt: string;
  };
  assessments: ChildAssessmentSummary[];
  reports: ChildReportSummary[];
  counsellingSessionsCount: number;
}

export interface CreateInvitationResponse {
  inviteCode: string;
  formattedCode: string;
  expiresAt: string;
  status: string;
}

export interface RedeemInvitationPayload {
  inviteCode: string;
  studentEmail: string;
  relationshipType?: string;
}

