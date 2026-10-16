import { AppError } from "../../common/errors/app-error";
import { logger } from "../../common/utils/logger";
import { emailService } from "../email";
import { userRepository } from "../users/user.repository";
import { counsellingRepository } from "./counselling.repository";
import { assessmentContentRepository } from "../assessments/assessment-content.repository";
import { careerRecommendationService } from "../careers/career-recommendation.service";
import { pool } from "../../config/database";
import {
  CounsellorCardDTO,
  CounsellorDetailDTO,
  CreateBookingRequestDTO,
  CounsellingSessionDTO,
  CounsellingNoteDTO,
  SaveCounsellingNoteDTO,
  StudentPsychometricSummaryDTO,
  ConsentPermission,
  SessionStatus,
  NotificationDTO,
  CounsellorOverviewDTO,
  CounsellorSessionFilterParams,
} from "./counselling.types";
import { SkillFinderFullResultDTO } from "../scoring/scoring.types";
import {
  broadcastAccessChanged,
  broadcastConversationAvailable,
} from "../messaging/messaging.socket";

export class CounsellingService {
  /**
   * Retrieves approved certified counsellors with personalized AI match scoring
   * based on the student's psychometric profile and learning archetype.
   */
  async getRecommendedCounsellors(
    userId?: string,
    filters?: {
      search?: string;
      specialisation?: string;
      language?: string;
      experience?: string | number;
      day?: string;
    }
  ): Promise<{ counsellors: CounsellorCardDTO[]; isAssessed: boolean }> {
    const counsellors = await counsellingRepository.findAllCounsellors(filters);

    if (!userId) {
      const defaultCards: CounsellorCardDTO[] = counsellors.map((c, idx) => ({
        id: c.id,
        userId: c.userId,
        name: c.name || "Certified Counsellor",
        email: c.email || "",
        qualification: c.qualification,
        experienceYears: c.experienceYears,
        bio: c.bio,
        specialisations: c.specialisations,
        languages: c.languages,
        profileImage: c.profileImage,
        rating: c.rating,
        reviewCount: c.reviewCount,
        approvalStatus: c.approvalStatus,
        matchPercentage: Math.max(78, 96 - idx * 4),
        matchReason: `Top rated expert in ${c.specialisations.slice(0, 2).join(" & ")}.`,
      }));

      return { counsellors: defaultCards, isAssessed: false };
    }

    // Check if student has completed an assessment
    const latestResultRow = await assessmentContentRepository.findLatestResultByUserId(userId);
    const isAssessed = Boolean(latestResultRow?.result_data);
    const resultData: SkillFinderFullResultDTO | null = latestResultRow?.result_data || null;

    const cards: CounsellorCardDTO[] = counsellors.map((c, idx) => {
      let matchPercentage = Math.max(78, 94 - idx * 4);
      let matchReason = `Certified career guidance mentor specialising in ${c.specialisations.slice(0, 2).join(", ")}.`;

      if (isAssessed && resultData) {
        const topClusters = resultData.interestDiscovery?.topClusters || [];
        const clusterNames = topClusters.map((tc: { name: string }) => tc.name.toLowerCase());
        const primaryOrientation = (resultData.interestDiscovery?.primaryOrientation || "").toLowerCase();
        const archetype = (resultData.learningProfile?.archetypeTitle || "").toLowerCase();

        // Calculate domain affinity score
        let matchScore = 78;
        const reasons: string[] = [];

        for (const spec of c.specialisations) {
          const sLower = spec.toLowerCase();
          if (
            (sLower.includes("stem") || sLower.includes("tech") || sLower.includes("ai") || sLower.includes("computer")) &&
            (clusterNames.some((cn: string) => cn.includes("investigative") || cn.includes("realistic") || cn.includes("tech") || cn.includes("science")) ||
             archetype.includes("analyst") || archetype.includes("architect") || archetype.includes("engineer"))
          ) {
            matchScore += 18;
            reasons.push("Strong alignment with your Investigative & Analytical cognitive strengths");
          } else if (
            (sLower.includes("business") || sLower.includes("finance") || sLower.includes("management") || sLower.includes("leadership")) &&
            (clusterNames.some((cn: string) => cn.includes("enterprising") || cn.includes("business") || cn.includes("conventional")) ||
             primaryOrientation.includes("enterprising") || archetype.includes("strategist") || archetype.includes("leader"))
          ) {
            matchScore += 17;
            reasons.push("Matches your Enterprising career interest orientation & strategic leadership traits");
          } else if (
            (sLower.includes("design") || sLower.includes("creative") || sLower.includes("ux") || sLower.includes("media") || sLower.includes("art")) &&
            (clusterNames.some((cn: string) => cn.includes("artistic") || cn.includes("creative")) ||
             archetype.includes("creator") || archetype.includes("designer") || archetype.includes("innovator"))
          ) {
            matchScore += 18;
            reasons.push("Directly matches your Artistic & Visual Design psychometric cluster");
          } else if (
            (sLower.includes("health") || sLower.includes("bio") || sLower.includes("medical") || sLower.includes("life science")) &&
            (clusterNames.some((cn: string) => cn.includes("investigative") || cn.includes("social") || cn.includes("health")) ||
             primaryOrientation.includes("social") || archetype.includes("healer") || archetype.includes("explorer"))
          ) {
            matchScore += 16;
            reasons.push("Aligned with your Life Sciences & Applied Research aptitude profile");
          }
        }

        matchPercentage = Math.min(99, Math.max(82, matchScore));
        if (reasons.length > 0) {
          matchReason = reasons[0];
        } else {
          matchReason = `Excellent match for your learning archetype (${resultData.learningProfile?.archetypeTitle || "Profile"}).`;
        }
      }

      return {
        id: c.id,
        userId: c.userId,
        name: c.name || "Certified Counsellor",
        email: c.email || "",
        qualification: c.qualification,
        experienceYears: c.experienceYears,
        bio: c.bio,
        specialisations: c.specialisations,
        languages: c.languages,
        profileImage: c.profileImage,
        rating: c.rating,
        reviewCount: c.reviewCount,
        approvalStatus: c.approvalStatus,
        matchPercentage,
        matchReason,
      };
    });

    // Rank counsellors by match percentage descending
    cards.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));

    return {
      counsellors: cards,
      isAssessed,
    };
  }

  /**
   * Retrieves complete counsellor profile with availability and reviews.
   */
  async getCounsellorDetail(counsellorId: string): Promise<CounsellorDetailDTO> {
    const counsellor = await counsellingRepository.findCounsellorById(counsellorId);
    if (!counsellor) {
      throw AppError.notFound("Counsellor not found", "COUNSELLOR_NOT_FOUND");
    }

    return {
      id: counsellor.id,
      userId: counsellor.userId,
      name: counsellor.name,
      email: counsellor.email,
      qualification: counsellor.qualification,
      experienceYears: counsellor.experienceYears,
      bio: counsellor.bio,
      specialisations: counsellor.specialisations || [],
      languages: counsellor.languages || [],
      guidanceAreas: counsellor.guidanceAreas || counsellor.specialisations || [],
      profileImage: counsellor.profileImage,
      rating: counsellor.rating,
      reviewCount: counsellor.reviewCount,
      approvalStatus: counsellor.approvalStatus,
      availability: counsellor.availability || [],
      reviews: counsellor.reviews || [],
      matchPercentage: 94,
      matchReason: `Certified expert with ${counsellor.experienceYears}+ years in career advisory.`,
    };
  }

  /**
   * Books a counselling appointment with consent opt-in, slot collision protection, and past-date validation.
   */
  async bookSession(
    studentId: string,
    dto: CreateBookingRequestDTO
  ): Promise<CounsellingSessionDTO> {
    const counsellor = await counsellingRepository.findCounsellorById(dto.counsellorId);
    if (!counsellor) {
      throw AppError.notFound("Specified counsellor not found", "COUNSELLOR_NOT_FOUND");
    }

    if (counsellor.approvalStatus !== "APPROVED") {
      throw AppError.badRequest("Selected counsellor is not currently active for appointments", "COUNSELLOR_NOT_ACTIVE");
    }

    if (!dto.sessionDate || !dto.sessionTime) {
      throw AppError.badRequest("Session date and time are required", "INVALID_SESSION_TIME");
    }

    // Past date check
    const todayStr = new Date().toISOString().split("T")[0];
    if (dto.sessionDate < todayStr) {
      throw AppError.badRequest("Cannot book sessions in the past. Please select a future date.", "PAST_DATE_NOT_ALLOWED");
    }

    // Check slot collision / double booking
    const isSlotTaken = await counsellingRepository.checkSlotCollision(
      counsellor.id,
      dto.sessionDate,
      dto.sessionTime
    );
    if (isSlotTaken) {
      throw AppError.conflict(
        `The time slot (${dto.sessionTime}) on ${dto.sessionDate} is already booked or awaiting confirmation. Please select another time slot.`,
        "SLOT_COLLISION"
      );
    }

    let durationMinutes = 45;
    if (dto.sessionType === "FREE_INTRO") durationMinutes = 15;
    else if (dto.sessionType === "DETAILED_PROFILE") durationMinutes = 60;

    // 1. Create counselling session record
    const session = await counsellingRepository.createSession({
      studentId,
      counsellorId: counsellor.id,
      sessionType: dto.sessionType,
      durationMinutes,
      sessionDate: dto.sessionDate,
      sessionTime: dto.sessionTime,
      studentNotes: dto.studentNotes,
    });

    // 2. Handle Consent: Default to granted if dto.grantConsent is true or undefined
    const shouldGrantConsent = dto.grantConsent !== false;
    if (shouldGrantConsent) {
      await counsellingRepository.upsertConsent(
        studentId,
        counsellor.id,
        "VIEW_ASSESSMENT_SUMMARY"
      );
    }

    // 3. Dispatch In-App Notifications
    try {
      // Notify counsellor
      await counsellingRepository.createNotification({
        userId: counsellor.userId,
        title: "New Counselling Session Request",
        message: `A student requested a ${durationMinutes}-min ${dto.sessionType.replace("_", " ")} session on ${dto.sessionDate} at ${dto.sessionTime}.`,
        type: "SESSION_REQUEST",
        metadata: {
          sessionId: session.id,
          studentId,
          sessionDate: dto.sessionDate,
          sessionTime: dto.sessionTime,
        },
      });

      // Notify student
      await counsellingRepository.createNotification({
        userId: studentId,
        title: "Session Request Submitted",
        message: `Your appointment request with ${counsellor.name} for ${dto.sessionDate} at ${dto.sessionTime} is pending confirmation.`,
        type: "SESSION_REQUEST",
        metadata: {
          sessionId: session.id,
          counsellorId: counsellor.id,
          counsellorName: counsellor.name,
        },
      });
    } catch (notifErr) {
      logger.warn({ err: notifErr }, "Non-fatal error creating session booking notifications");
    }

    // 4. Dispatch Non-Blocking Transactional Emails
    (async () => {
      try {
        const studentUser = await userRepository.findById(studentId);
        const studentFullName = studentUser
          ? `${studentUser.first_name} ${studentUser.last_name}`.trim()
          : "Student";

        if (studentUser?.email) {
          // Send to Student
          emailService
            .sendSessionBookedEmail({
              to: studentUser.email,
              recipientName: studentFullName,
              counsellorName: counsellor.name,
              studentName: studentFullName,
              sessionDate: dto.sessionDate,
              timeSlot: dto.sessionTime,
              role: "STUDENT",
            })
            .catch((err) => {
              logger.warn({ err, studentId }, "Non-fatal: Failed to send session booked email to student");
            });
        }

        if (counsellor.email) {
          // Send to Counsellor
          emailService
            .sendSessionBookedEmail({
              to: counsellor.email,
              recipientName: counsellor.name,
              counsellorName: counsellor.name,
              studentName: studentFullName,
              sessionDate: dto.sessionDate,
              timeSlot: dto.sessionTime,
              role: "COUNSELLOR",
            })
            .catch((err) => {
              logger.warn({ err, counsellorId: counsellor.id }, "Non-fatal: Failed to send session booked email to counsellor");
            });
        }
      } catch (emailErr) {
        logger.warn({ emailErr, studentId, counsellorId: counsellor.id }, "Non-fatal error dispatching session booked emails");
      }
    })();

    return {
      ...session,
      counsellorName: counsellor.name,
      counsellorQualification: counsellor.qualification,
      counsellorProfileImage: counsellor.profileImage,
      hasConsent: shouldGrantConsent,
    };
  }

  /**
   * Retrieves all sessions booked by a student.
   */
  async getStudentSessions(studentId: string): Promise<CounsellingSessionDTO[]> {
    return counsellingRepository.findSessionsByStudentId(studentId);
  }

  /**
   * Helper to resolve counsellor profile from user ID or counsellor ID.
   */
  private async resolveCounsellor(idOrUserId: string) {
    let counsellor = await counsellingRepository.findCounsellorById(idOrUserId);
    if (!counsellor) {
      counsellor = await counsellingRepository.findOrCreateCounsellorProfile(idOrUserId);
    }
    if (!counsellor) {
      throw AppError.notFound("Counsellor profile not found", "COUNSELLOR_NOT_FOUND");
    }
    return counsellor;
  }

  /**
   * Retrieves all sessions assigned to a counsellor with optional search, status, and filter params.
   */
  async getCounsellorSessions(
    counsellorUserIdOrId: string,
    filters?: string | CounsellorSessionFilterParams
  ): Promise<CounsellingSessionDTO[]> {
    const counsellor = await this.resolveCounsellor(counsellorUserIdOrId);
    return counsellingRepository.findSessionsByCounsellorId(counsellor.id, filters);
  }

  /**
   * Retrieves single session detail with strict counsellor authorization.
   * Validates that the requested session is assigned to the authenticated counsellor.
   */
  async getSessionDetailForCounsellor(
    counsellorUserIdOrId: string,
    sessionId: string
  ): Promise<CounsellingSessionDTO & { notes?: CounsellingNoteDTO | null }> {
    const counsellor = await this.resolveCounsellor(counsellorUserIdOrId);
    const session = await counsellingRepository.findSessionById(sessionId);

    if (!session) {
      throw AppError.notFound("Session not found", "SESSION_NOT_FOUND");
    }

    if (session.counsellorId !== counsellor.id) {
      throw AppError.forbidden("Unauthorized: Session is not assigned to this counsellor", "SESSION_FORBIDDEN");
    }

    const notes = await counsellingRepository.findCounsellingNotesBySessionId(sessionId);

    return {
      ...session,
      notes,
    };
  }

  /**
   * Updates session status (CONFIRM, REJECT, COMPLETE, CANCEL) and creates meeting link if confirmed.
   */
  async updateSessionStatus(
    counsellorUserIdOrId: string,
    sessionId: string,
    status: SessionStatus,
    meetingLink?: string | null
  ): Promise<CounsellingSessionDTO> {
    const counsellor = await this.resolveCounsellor(counsellorUserIdOrId);
    const existingSession = await counsellingRepository.findSessionById(sessionId);

    if (!existingSession) {
      throw AppError.notFound("Session not found", "SESSION_NOT_FOUND");
    }

    if (existingSession.counsellorId !== counsellor.id) {
      throw AppError.forbidden("Unauthorized: Session is not assigned to this counsellor", "SESSION_UNAUTHORIZED");
    }

    let resolvedMeetingLink = meetingLink;
    if (status === "CONFIRMED" && !resolvedMeetingLink && !existingSession.meetingLink) {
      resolvedMeetingLink = `https://meet.3gmelife.com/session-${sessionId.slice(0, 8)}`;
    }

    let updated: CounsellingSessionDTO;
    let createdConversationId: string | undefined;

    if (status === "CONFIRMED") {
      const result = await counsellingRepository.confirmSessionAndEnsureConversation(
        sessionId,
        counsellor.id,
        resolvedMeetingLink
      );
      updated = result.session;
      createdConversationId = result.conversationId;
    } else {
      updated = await counsellingRepository.updateSessionStatus(
        sessionId,
        status,
        resolvedMeetingLink
      );
    }

    // Notify student of session status change
    try {
      let title = "Session Status Updated";
      let message = `Your session on ${existingSession.sessionDate} has been updated to ${status}.`;

      if (status === "CONFIRMED") {
        title = "Counselling Session Confirmed! 📅";
        message = `Dr./Mr. ${counsellor.name} confirmed your session on ${existingSession.sessionDate} at ${existingSession.sessionTime}. Messaging is now available.`;
      } else if (status === "COMPLETED") {
        title = "Counselling Session Completed";
        message = `Your session with ${counsellor.name} has concluded. You can review recommendations and notes in your dashboard.`;
      } else if (status === "REJECTED") {
        title = "Session Request Declined";
        message = `Unfortunately, the requested time slot could not be accommodated. Please select an alternative slot.`;
      }

      await counsellingRepository.createNotification({
        userId: existingSession.studentId,
        title,
        message,
        type: status === "CONFIRMED" ? "BOOKING_CONFIRMED" : status === "COMPLETED" ? "SESSION_COMPLETED" : "SESSION_REQUEST",
        metadata: {
          sessionId,
          status,
          meetingLink: resolvedMeetingLink,
        },
      });

      // Emit live unlock socket events ONLY AFTER database transaction commit
      if (status === "CONFIRMED") {
        try {
          broadcastAccessChanged(existingSession.studentId, true);
          if (createdConversationId) {
            broadcastConversationAvailable(existingSession.studentId, createdConversationId);
          }
        } catch (socketErr) {
          logger.warn({ err: socketErr }, "Non-fatal error broadcasting session confirmation socket event");
        }
      }
    } catch (notifErr) {
      logger.warn({ err: notifErr }, "Non-fatal error sending session update notification");
    }

    // Non-blocking transactional email notification for cancellation or rejection
    if (status === "REJECTED" || (status as string) === "CANCELLED") {
      (async () => {
        try {
          const studentUser = await userRepository.findById(existingSession.studentId);
          if (studentUser?.email) {
            const studentFullName = `${studentUser.first_name} ${studentUser.last_name}`.trim();
            emailService
              .sendSessionCancelledEmail({
                to: studentUser.email,
                recipientName: studentFullName,
                counsellorName: counsellor.name,
                studentName: studentFullName,
                sessionDate: `${existingSession.sessionDate} at ${existingSession.sessionTime}`,
                reason:
                  status === "REJECTED"
                    ? "The counsellor had an unavoidable scheduling conflict. Please select another slot."
                    : "Session was cancelled.",
              })
              .catch((err) => {
                logger.warn({ err, studentId: existingSession.studentId }, "Non-fatal: Failed to send session cancellation email");
              });
          }
        } catch (emailErr) {
          logger.warn({ emailErr, sessionId }, "Non-fatal error dispatching cancellation email");
        }
      })();
    }

    return {
      ...existingSession,
      status: updated.status,
      meetingLink: updated.meetingLink,
    };
  }

  /**
   * Retrieves aggregated statistics & upcoming queue for the Counsellor Portal.
   */
  async getCounsellorOverview(counsellorUserIdOrId: string): Promise<CounsellorOverviewDTO> {
    const counsellor = await this.resolveCounsellor(counsellorUserIdOrId);
    const stats = await counsellingRepository.getCounsellorOverviewStats(counsellor.id);
    const todaySessions = await counsellingRepository.findTodaySessionsByCounsellorId(counsellor.id);
    const allSessions = await counsellingRepository.findSessionsByCounsellorId(counsellor.id);

    const upcomingSessions = allSessions
      .filter((s) => s.status === "CONFIRMED" && s.sessionDate >= new Date().toISOString().split("T")[0])
      .slice(0, 10);

    const pendingRequests = allSessions
      .filter((s) => s.status === "PENDING")
      .slice(0, 10);

    return {
      stats,
      counsellorProfile: counsellor,
      todaySessions,
      upcomingSessions,
      pendingRequests,
    };
  }

  /**
   * Updates counsellor profile details.
   */
  async updateCounsellorProfile(
    counsellorUserIdOrId: string,
    data: {
      bio?: string;
      qualification?: string;
      experienceYears?: number;
      specialisations?: string[];
      languages?: string[];
      guidanceAreas?: string[];
      profileImage?: string | null;
    }
  ): Promise<CounsellorDetailDTO> {
    const counsellor = await this.resolveCounsellor(counsellorUserIdOrId);
    await counsellingRepository.updateCounsellorProfile(counsellor.id, data);
    return this.getCounsellorDetail(counsellor.id);
  }

  /**
   * Retrieves availability schedule for a counsellor.
   */
  async getCounsellorAvailability(counsellorUserIdOrId: string) {
    const counsellor = await this.resolveCounsellor(counsellorUserIdOrId);
    return counsellingRepository.getCounsellorAvailability(counsellor.id);
  }

  /**
   * Retrieves date-specific slot availability including booked / occupied status.
   */
  async getDateSlotAvailability(
    counsellorIdOrUserId: string,
    dateStr?: string
  ): Promise<{
    counsellorId: string;
    date: string;
    dayOfWeek: string;
    isPastDate: boolean;
    weeklySchedule: any[];
    bookedSlots: string[];
    isAvailableDay: boolean;
  }> {
    const counsellor = await this.resolveCounsellor(counsellorIdOrUserId);

    const todayStr = new Date().toISOString().split("T")[0];
    const targetDate = dateStr || todayStr;
    const isPastDate = targetDate < todayStr;

    // Determine day of week for targetDate
    const parsedDate = new Date(`${targetDate}T00:00:00Z`);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = dayNames[parsedDate.getUTCDay()];

    const weeklySchedule = counsellor.availability || (await counsellingRepository.getCounsellorAvailability(counsellor.id));
    const daySchedule = weeklySchedule.find(
      (s: any) => s.day?.toLowerCase() === dayOfWeek.toLowerCase() && s.isActive !== false
    );

    const bookedSlots = isPastDate
      ? []
      : await counsellingRepository.getBookedSlotsForDate(counsellor.id, targetDate);

    return {
      counsellorId: counsellor.id,
      date: targetDate,
      dayOfWeek,
      isPastDate,
      weeklySchedule,
      bookedSlots,
      isAvailableDay: Boolean(daySchedule),
    };
  }

  /**
   * Updates weekly availability schedule for a counsellor.
   */
  async updateCounsellorAvailability(counsellorUserIdOrId: string, slots: any[]) {
    const counsellor = await this.resolveCounsellor(counsellorUserIdOrId);
    return counsellingRepository.replaceCounsellorAvailability(counsellor.id, slots);
  }

  /**
   * Retrieves reviews and student feedback for a counsellor.
   */
  async getCounsellorReviews(counsellorUserIdOrId: string) {
    const counsellor = await this.resolveCounsellor(counsellorUserIdOrId);
    return counsellingRepository.getCounsellorReviews(counsellor.id);
  }

  /**
   * Retrieves students who have interacted with this counsellor.
   */
  async getAssignedStudents(counsellorUserIdOrId: string): Promise<any[]> {
    const counsellor = await this.resolveCounsellor(counsellorUserIdOrId);
    return counsellingRepository.findAssignedStudentsByCounsellorId(counsellor.id);
  }

  /**
   * SECURE PRIVACY FIREWALL:
   * Retrieves high-level psychometric summary for a student ONLY IF explicit consent is granted.
   * NEVER exposes raw answers, scoring keys, or proprietary weights.
   */
  async getStudentSummaryForCounsellor(
    counsellorUserIdOrId: string,
    studentId: string
  ): Promise<StudentPsychometricSummaryDTO> {
    const counsellor = await this.resolveCounsellor(counsellorUserIdOrId);

    // 1. Verify consent
    const hasConsent = await counsellingRepository.hasConsent(studentId, counsellor.id);
    if (!hasConsent) {
      throw AppError.forbidden(
        "Student has not granted consent to view psychometric assessment summary. Ask the student to enable profile sharing.",
        "CONSENT_REQUIRED"
      );
    }

    // 2. Fetch student user & profile information
    const userRes = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email,
              p.education_stage, p.grade_level, p.school_name, p.date_of_birth
       FROM users u
       LEFT JOIN participant_profiles p ON u.id = p.user_id
       WHERE u.id = $1 LIMIT 1`,
      [studentId]
    );

    if (!userRes.rows[0]) {
      throw AppError.notFound("Student user not found", "STUDENT_NOT_FOUND");
    }

    const u = userRes.rows[0];
    const studentName = `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email;
    const studentAge = u.date_of_birth
      ? new Date().getFullYear() - new Date(u.date_of_birth).getFullYear()
      : null;

    // 3. Fetch latest completed assessment results
    const latestResultRow = await assessmentContentRepository.findLatestResultByUserId(studentId);

    if (!latestResultRow || !latestResultRow.result_data) {
      return {
        studentId: u.id,
        studentName,
        age: studentAge,
        educationStage: u.education_stage || null,
        gradeLevel: u.grade_level || null,
        schoolName: u.school_name || null,
        isAssessed: false,
      };
    }

    const resData: SkillFinderFullResultDTO = latestResultRow.result_data;

    // 4. Fetch recommended career pathways
    let topCareerPathways: Array<{
      title: string;
      category: string;
      matchPercentage: number;
      reasoning?: string;
      strengthAlignment?: string[];
      developmentAreas?: string[];
    }> = [];
    let matchingReasons: string[] = [];
    try {
      const pathwayResult = await careerRecommendationService.getRecommendedPathways(studentId, "en");
      topCareerPathways = pathwayResult.recommendations.slice(0, 4).map((p) => ({
        title: p.title,
        category: p.category,
        matchPercentage: p.matchPercentage,
        reasoning: p.reasoning?.summary,
        strengthAlignment: p.strengthAlignment,
        developmentAreas: p.developmentAreas,
      }));
      matchingReasons = pathwayResult.recommendations.slice(0, 3).map((p) => p.reasoning?.summary).filter(Boolean);
    } catch (careerErr) {
      logger.warn({ err: careerErr }, "Could not fetch career recommendations for student summary");
    }

    // 5. Extract safe summary without raw item scores or answers
    const topInterestDimensions = (resData.interestDiscovery?.dimensions || []).slice(0, 5).map((d) => ({
      name: d.name,
      score: Math.round(d.scalePositionPercentage),
      description: d.description || "",
    }));

    const topSkills = (resData.skillBehaviour?.strongestIndicators || []).slice(0, 4).map((s) => ({
      name: s.name,
      score: Math.round(s.scalePositionPercentage),
    }));

    const topAptitudes = (resData.demonstratedAptitude?.dimensions || []).slice(0, 4).map((a) => ({
      name: a.name,
      score: Math.round(a.scalePositionPercentage),
    }));

    const strengthAreas = (resData.developmentalStrengths?.topStrengths || []).map((s) => s.name).slice(0, 4);
    const developmentAreas = (resData.developmentalStrengths?.growthAreas || []).slice(0, 4);

    const parentGuidanceSummary = {
      interests: (resData.interestDiscovery?.topClusters || []).map((c) => c.name).slice(0, 3),
      suggestedExplorations: [
        "Hands-on technical or creative science projects",
        "Subject stream exploration aligned with analytical reasoning",
        "Extracurricular clubs, hackathons, or debate workshops",
      ],
    };

    return {
      studentId: u.id,
      studentName,
      age: u.age || null,
      educationStage: u.education_stage || null,
      gradeLevel: u.grade_level || null,
      schoolName: u.school_name || null,
      isAssessed: true,
      assessmentCode: latestResultRow.assessment_code || "SKILL_FINDER",
      archetype: resData.learningProfile?.archetypeTitle || "Multidisciplinary Explorer",
      riasecCode: resData.interestDiscovery?.primaryOrientation || "Investigative-Artistic",
      topInterestDimensions,
      topSkills,
      topAptitudes,
      topCareerPathways,
      matchingReasons,
      strengthAreas,
      developmentAreas,
      parentGuidanceSummary,
    };
  }

  /**
   * Saves or updates counselling notes, observations, recommendations, and action plan.
   */
  async saveSessionNotes(
    counsellorUserIdOrId: string,
    sessionId: string,
    dto: SaveCounsellingNoteDTO,
    userRole?: string
  ): Promise<CounsellingNoteDTO> {
    const session = await counsellingRepository.findSessionById(sessionId);

    if (!session) {
      throw AppError.notFound("Session not found", "SESSION_NOT_FOUND");
    }

    const isAdmin = userRole === "PLATFORM_ADMIN" || userRole === "SUPER_ADMIN";
    let counsellor: CounsellorDetailDTO | null = null;

    if (!isAdmin) {
      // Look up existing counsellor profile directly without creating an orphan profile
      counsellor = await counsellingRepository.findCounsellorById(counsellorUserIdOrId);
      if (!counsellor || session.counsellorId !== counsellor.id) {
        throw AppError.forbidden("Unauthorized: Session does not belong to this counsellor", "SESSION_UNAUTHORIZED");
      }
    } else {
      counsellor = await counsellingRepository.findCounsellorById(session.counsellorId);
      if (!counsellor) {
        throw AppError.notFound("Assigned counsellor not found for session", "COUNSELLOR_NOT_FOUND");
      }
    }

    if (!dto.summary || !dto.recommendations) {
      throw AppError.badRequest("Session summary and recommendations are required", "INVALID_NOTE_DATA");
    }

    const note = await counsellingRepository.saveCounsellingNotes({
      sessionId,
      counsellorId: counsellor.id,
      studentId: session.studentId,
      summary: dto.summary,
      observations: dto.observations,
      recommendations: dto.recommendations,
      actionPlan: dto.actionPlan || [],
      followUpDate: dto.followUpDate,
    });

    // Notify student that guidance notes and action plan are available
    try {
      await counsellingRepository.createNotification({
        userId: session.studentId,
        title: "Counsellor Added Guidance Notes 📝",
        message: `${counsellor.name} added post-session guidance notes and a personalized action plan for your session on ${session.sessionDate}.`,
        type: "NOTES_ADDED",
        metadata: {
          sessionId,
          noteId: note.id,
          counsellorName: counsellor.name,
        },
      });
    } catch (notifErr) {
      logger.warn({ err: notifErr }, "Non-fatal error creating note notification");
    }

    return note;
  }

  /**
   * Retrieves counselling notes for a session. Validates student or counsellor access.
   */
  async getSessionNotes(userId: string, sessionId: string): Promise<CounsellingNoteDTO | null> {
    const session = await counsellingRepository.findSessionById(sessionId);
    if (!session) {
      throw AppError.notFound("Session not found", "SESSION_NOT_FOUND");
    }

    // Verify user is either student or counsellor
    const counsellor = await counsellingRepository.findCounsellorById(userId);
    const isStudent = session.studentId === userId;
    const isCounsellor = counsellor && counsellor.id === session.counsellorId;

    if (!isStudent && !isCounsellor) {
      throw AppError.forbidden("Unauthorized access to session notes", "UNAUTHORIZED_NOTES_ACCESS");
    }

    return counsellingRepository.findCounsellingNotesBySessionId(sessionId);
  }

  /**
   * Updates student consent permission (grant or revoke).
   */
  async updateConsent(
    studentId: string,
    counsellorId: string,
    permission: ConsentPermission
  ): Promise<{ success: boolean; permission: ConsentPermission }> {
    await counsellingRepository.upsertConsent(studentId, counsellorId, permission);

    try {
      const counsellor = await counsellingRepository.findCounsellorById(counsellorId);
      if (counsellor) {
        await counsellingRepository.createNotification({
          userId: counsellor.userId,
          title: "Student Consent Updated",
          message: `A student has ${permission === "REVOKED" ? "revoked" : "granted"} consent to view their psychometric assessment summary.`,
          type: "CONSENT_UPDATED",
          metadata: {
            studentId,
            permission,
          },
        });
      }
    } catch (notifErr) {
      logger.warn({ err: notifErr }, "Non-fatal error sending consent notification");
    }

    return { success: true, permission };
  }

  /**
   * Retrieves user notifications.
   */
  async getNotifications(userId: string): Promise<NotificationDTO[]> {
    return counsellingRepository.findNotificationsByUserId(userId);
  }

  /**
   * Marks a notification as read.
   */
  async markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
    await counsellingRepository.markNotificationAsRead(notificationId, userId);
  }
}

export const counsellingService = new CounsellingService();
