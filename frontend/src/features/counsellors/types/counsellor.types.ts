/**
 * 3G MeLife Counsellor Connect Frontend Types
 */

export type SessionType = "FREE_INTRO" | "CAREER_GUIDANCE" | "DETAILED_PROFILE";

export type SessionStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

export type ConsentPermission = "VIEW_ASSESSMENT_SUMMARY" | "REVOKED";

export interface CounsellorAvailability {
  id?: string;
  counsellorId?: string;
  day: string;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export interface CounsellorReview {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CounsellorCardDTO {
  id: string;
  userId: string;
  name: string;
  email: string;
  qualification: string;
  experienceYears: number;
  bio: string;
  specialisations: string[];
  languages: string[];
  profileImage: string | null;
  rating: number;
  reviewCount: number;
  approvalStatus: string;
  matchPercentage?: number;
  matchReason?: string;
}

export interface CounsellorDetailDTO extends CounsellorCardDTO {
  availability: CounsellorAvailability[];
  guidanceAreas: string[];
  reviews: CounsellorReview[];
}

export interface CreateBookingRequestDTO {
  counsellorId: string;
  sessionType: SessionType;
  sessionDate: string; // "YYYY-MM-DD"
  sessionTime: string; // "10:00 AM"
  studentNotes?: string;
  grantConsent?: boolean;
}

export type AssessmentStatus = "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED";
export type ReportStatus = "AVAILABLE" | "PENDING" | "NOT_AVAILABLE";

export interface CounsellorSessionFilterParams {
  status?: string;
  search?: string;
  dateFilter?: "ALL" | "TODAY" | "THIS_WEEK" | "THIS_MONTH" | "UPCOMING" | "PAST";
  assessmentStatus?: "ALL" | AssessmentStatus;
  reportStatus?: "ALL" | ReportStatus;
  sortBy?: "date" | "student" | "status";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CounsellingSessionDTO {
  id: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  counsellorId: string;
  counsellorName?: string;
  counsellorQualification?: string;
  counsellorProfileImage?: string | null;
  sessionType: SessionType;
  durationMinutes: number;
  sessionDate: string;
  sessionTime: string;
  status: SessionStatus;
  meetingLink: string | null;
  studentNotes: string | null;
  hasConsent: boolean;
  notesAdded?: boolean;
  assessmentStatus?: AssessmentStatus;
  reportStatus?: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CounsellingNoteDTO {
  id: string;
  sessionId: string;
  counsellorId: string;
  studentId: string;
  summary: string;
  observations: string | null;
  recommendations: string;
  actionPlan: string[];
  followUpDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveCounsellingNoteDTO {
  summary: string;
  observations?: string;
  recommendations: string;
  actionPlan?: string[];
  followUpDate?: string | null;
}

export interface StudentPsychometricSummaryDTO {
  studentId: string;
  studentName: string;
  age?: number | null;
  educationStage?: string | null;
  gradeLevel?: string | null;
  schoolName?: string | null;
  isAssessed: boolean;
  assessmentCode?: string;
  archetype?: string;
  riasecCode?: string;
  topInterestDimensions?: Array<{
    name: string;
    score: number;
    description: string;
  }>;
  topSkills?: Array<{
    name: string;
    score: number;
  }>;
  topAptitudes?: Array<{
    name: string;
    score: number;
  }>;
  topCareerPathways?: Array<{
    title: string;
    category: string;
    matchPercentage: number;
  }>;
}

export interface NotificationDTO {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  metadata: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

export interface CounsellorReviewDTO {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
  sessionType?: string;
}

export interface AssignedStudentDTO {
  student_id: string;
  student_name: string;
  student_email: string;
  education_stage?: string | null;
  grade_level?: string | null;
  school_name?: string | null;
  has_consent: boolean;
  is_assessed: boolean;
  session_count: number;
  latest_session_date?: string | null;
}

export interface CounsellorFilterParams {
  search?: string;
  specialisation?: string;
  language?: string;
}

export interface CounsellorOverviewStatsDTO {
  todaySessionsCount: number;
  upcomingSessionsCount: number;
  pendingRequestsCount: number;
  completedSessionsCount: number;
  availableSlotsCount: number;
  totalAssignedStudentsCount: number;
  todaySessions?: number;
  upcomingSessions?: number;
  pendingRequests?: number;
  completedSessions?: number;
  availableSlots?: number;
  studentCount?: number;
}

export interface CounsellorOverviewDTO {
  stats: CounsellorOverviewStatsDTO;
  counsellorProfile: CounsellorDetailDTO;
  todaySessions: CounsellingSessionDTO[];
  upcomingSessions: CounsellingSessionDTO[];
  pendingRequests: CounsellingSessionDTO[];
}

export interface UpdateCounsellorProfileDTO {
  bio?: string;
  qualification?: string;
  experienceYears?: number;
  specialisations?: string[];
  languages?: string[];
  guidanceAreas?: string[];
  profileImage?: string | null;
}
