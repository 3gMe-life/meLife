import { connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { skillFinderQuestionSelectionService } from "../src/modules/assessments/services/skill-finder-question-selection.service";
import { skillFinderTranslationsService } from "../src/modules/assessments/services/skill-finder-translations.service";
import { reportRepository } from "../src/modules/reports/report.repository";
import { careerRepository } from "../src/modules/careers/career.repository";
import { counsellingRepository } from "../src/modules/counselling/counselling.repository";
import { createApp } from "../src/app";
import http from "http";

async function runCounsellorConnectE2ETests() {
  console.log("🧪 Starting Counsellor Connect & Guidance Ecosystem E2E Test Suite...\n");

  await connectDatabase();
  await authRepository.seedRolePermissions();
  await participantRepository.initSchema();
  await assessmentRepository.initSchema();
  await assessmentRepository.seedCatalog();
  await assessmentContentRepository.initSchema();
  await assessmentContentRepository.seedSkillFinderContent();
  await skillFinderQuestionSelectionService.seedSkillFinderVersions();
  await skillFinderTranslationsService.seedSkillFinderTranslations();
  await reportRepository.initSchema();
  await careerRepository.initSchema();
  await careerRepository.seedCareers();
  await counsellingRepository.initSchema();
  await counsellingRepository.seedCounsellors();

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as { port: number };
  const baseUrl = `http://localhost:${address.port}/api/v1`;

  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string) => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    const timestamp = Date.now();

    // Helper: Create participant and complete onboarding
    const createParticipant = async (email: string, firstName: string, age = 15) => {
      const regRes = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "Password123!",
          firstName,
          lastName: "Student",
          registrationPath: "STUDENT",
        }),
      });
      const regData = (await regRes.json()) as any;
      const token = regData.data.accessToken;
      const userId = regData.data.user.id;

      const birthYear = new Date().getFullYear() - age;
      await fetch(`${baseUrl}/participant/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dateOfBirth: `${birthYear}-06-15`,
          educationStage: "SCHOOL",
          gradeLevel: "10",
          schoolName: "Delhi Public School",
          curriculumOrBoard: "CBSE",
          guardianName: "Parent of " + firstName,
          guardianPhone: "+91 98765 43210",
        }),
      });

      return { token, userId, email };
    };

    // Helper: Login as a seeded certified counsellor
    const loginCounsellor = async (email: string) => {
      const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "Password123!",
        }),
      });
      const data = (await loginRes.json()) as any;
      return {
        token: data.data.accessToken,
        user: data.data.user,
      };
    };

    // =========================================================================
    // TEST 1: Counsellors Directory & Match Percentages
    // =========================================================================
    console.log("\n--- TEST GROUP 1: Counsellor Directory & AI Matching ---");
    const student1 = await createParticipant(`counsel_student_${timestamp}@test.com`, "Aarav", 15);

    const dirRes = await fetch(`${baseUrl}/counsellors`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const dirData = (await dirRes.json()) as any;

    assert(dirRes.status === 200 && dirData.success, "GET /counsellors returns 200 OK");
    assert(Array.isArray(dirData.data) && dirData.data.length >= 4, "Directory contains 4 certified counsellors");
    const firstCounsellor = dirData.data[0];
    assert(typeof firstCounsellor.matchPercentage === "number" && firstCounsellor.matchPercentage >= 75, "Counsellor has AI match percentage calculated");
    assert(Array.isArray(firstCounsellor.specialisations) && firstCounsellor.specialisations.length > 0, "Counsellor has specialisations populated");

    // =========================================================================
    // TEST 2: Counsellor Detail & Schedule
    // =========================================================================
    console.log("\n--- TEST GROUP 2: Counsellor Profile Details & Availability ---");
    const detailRes = await fetch(`${baseUrl}/counsellors/${firstCounsellor.id}`);
    const detailData = (await detailRes.json()) as any;

    assert(detailRes.status === 200 && detailData.success, "GET /counsellors/:id returns 200 OK");
    assert(detailData.data.qualification.length > 0, "Counsellor qualification is returned");
    assert(Array.isArray(detailData.data.availability) && detailData.data.availability.length > 0, "Availability schedule slots returned");
    assert(Array.isArray(detailData.data.reviews) && detailData.data.reviews.length > 0, "Student reviews returned");

    // =========================================================================
    // TEST 3: Student Books Appointment with Profile Consent Opt-In
    // =========================================================================
    console.log("\n--- TEST GROUP 3: Appointment Booking & Consent Opt-in ---");
    const bookingRes = await fetch(`${baseUrl}/counselling/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1.token}`,
      },
      body: JSON.stringify({
        counsellorId: firstCounsellor.id,
        sessionType: "CAREER_GUIDANCE",
        sessionDate: "2026-09-15",
        sessionTime: "10:00 AM",
        studentNotes: "Looking for guidance on choosing between Computer Science and AI Robotics engineering streams.",
        grantConsent: true,
      }),
    });
    const bookingData = (await bookingRes.json()) as any;

    assert(bookingRes.status === 201 && bookingData.success, "POST /counselling/request returns 201 Created");
    assert(bookingData.data.status === "PENDING", "Booking status starts as PENDING");
    assert(bookingData.data.durationMinutes === 45, "CAREER_GUIDANCE session duration set to 45 mins");
    const sessionId = bookingData.data.id;

    // Verify session in student sessions list
    const studentSessionsRes = await fetch(`${baseUrl}/counselling/sessions`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const studentSessionsData = (await studentSessionsRes.json()) as any;
    assert(
      studentSessionsData.data.some((s: any) => s.id === sessionId),
      "Booked session appears in student's session list"
    );

    // =========================================================================
    // TEST 4: Counsellor Portal Management (Overview, Accept, Meeting Link)
    // =========================================================================
    console.log("\n--- TEST GROUP 4: Counsellor Portal & Session Confirmation ---");
    const counsellorLogin = await loginCounsellor(firstCounsellor.email);

    const overviewRes = await fetch(`${baseUrl}/counselling/counsellor/overview`, {
      headers: { Authorization: `Bearer ${counsellorLogin.token}` },
    });
    const overviewData = (await overviewRes.json()) as any;

    assert(overviewRes.status === 200 && overviewData.success, "GET /counselling/counsellor/overview returns 200 OK");
    assert(typeof overviewData.data.stats.pendingRequestsCount === "number", "Counsellor overview stats include pending count");

    // Counsellor confirms session and sets meeting link
    const confirmRes = await fetch(`${baseUrl}/counselling/sessions/${sessionId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${counsellorLogin.token}`,
      },
      body: JSON.stringify({
        status: "CONFIRMED",
        meetingLink: "https://meet.google.com/abc-defg-hij",
      }),
    });
    const confirmData = (await confirmRes.json()) as any;

    assert(confirmRes.status === 200 && confirmData.success, "PATCH /counselling/sessions/:id/status returns 200 OK");
    assert(confirmData.data.status === "CONFIRMED", "Session status changed to CONFIRMED");
    assert(confirmData.data.meetingLink === "https://meet.google.com/abc-defg-hij", "Meeting link attached to session");

    // =========================================================================
    // TEST 5: Privacy Firewall & Safe Psychometric Summary Access
    // =========================================================================
    console.log("\n--- TEST GROUP 5: Privacy Firewall & Safe Assessment Summary ---");
    const summaryRes = await fetch(
      `${baseUrl}/counselling/counsellor/students/${student1.userId}/summary`,
      {
        headers: { Authorization: `Bearer ${counsellorLogin.token}` },
      }
    );
    const summaryData = (await summaryRes.json()) as any;

    assert(summaryRes.status === 200 && summaryData.success, "GET student summary returns 200 when consent is active");
    assert(summaryData.data.studentName.length > 0, "Student name is safely exposed");
    // Verify NO raw answers or scoring keys are present in payload
    assert(summaryData.data.rawResponses === undefined, "Firewall verified: raw answers are NOT exposed");
    assert(summaryData.data.scoringKeys === undefined, "Firewall verified: scoring keys are NOT exposed");

    // Test Consent Revocation
    const revokeRes = await fetch(`${baseUrl}/counselling/consent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1.token}`,
      },
      body: JSON.stringify({
        counsellorId: firstCounsellor.id,
        permission: "REVOKED",
      }),
    });
    assert(revokeRes.status === 200, "POST /counselling/consent revoked permission successfully");

    const blockedSummaryRes = await fetch(
      `${baseUrl}/counselling/counsellor/students/${student1.userId}/summary`,
      {
        headers: { Authorization: `Bearer ${counsellorLogin.token}` },
      }
    );
    assert(blockedSummaryRes.status === 403, "Counsellor access blocked with 403 Forbidden after consent is revoked");

    // Re-grant consent for subsequent testing
    await fetch(`${baseUrl}/counselling/consent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1.token}`,
      },
      body: JSON.stringify({
        counsellorId: firstCounsellor.id,
        permission: "VIEW_ASSESSMENT_SUMMARY",
      }),
    });

    // =========================================================================
    // TEST 6: Counsellor Saves Guidance Notes & Student Action Plan
    // =========================================================================
    console.log("\n--- TEST GROUP 6: Session Notes & Action Plan ---");
    const notesRes = await fetch(`${baseUrl}/counselling/sessions/${sessionId}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${counsellorLogin.token}`,
      },
      body: JSON.stringify({
        summary: "Detailed discussion regarding transition to AI & Data Engineering.",
        observations: "Demonstrated exceptional analytical aptitude and strong mathematical foundations.",
        recommendations: "Recommended focusing on Advanced Mathematics, Python Programming, and participating in National Science Olympiad.",
        actionPlan: [
          "Complete Intro to Python & Algorithms by end of October",
          "Shortlist 5 Tier-1 Engineering Institutes offering AI specialisations",
          "Follow up in 4 weeks to review progress on competitive prep",
        ],
        followUpDate: "2026-10-15",
      }),
    });
    const notesData = (await notesRes.json()) as any;

    assert(notesRes.status === 200 && notesData.success, "POST /counselling/sessions/:id/notes returns 200 OK");
    assert(Array.isArray(notesData.data.actionPlan) && notesData.data.actionPlan.length === 3, "3-step student action plan saved");

    // Student retrieves notes
    const getNotesRes = await fetch(`${baseUrl}/counselling/sessions/${sessionId}/notes`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const getNotesData = (await getNotesRes.json()) as any;
    assert(getNotesRes.status === 200 && getNotesData.data.summary.includes("Detailed discussion"), "Student successfully retrieves session notes and action plan");

    // =========================================================================
    // TEST 7: Notifications System
    // =========================================================================
    console.log("\n--- TEST GROUP 7: User Notifications ---");
    const notifRes = await fetch(`${baseUrl}/notifications`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const notifData = (await notifRes.json()) as any;

    assert(notifRes.status === 200 && notifData.success, "GET /notifications returns 200 OK");
    assert(Array.isArray(notifData.data) && notifData.data.length > 0, "Student has received session notifications");

    const firstNotif = notifData.data[0];
    const readRes = await fetch(`${baseUrl}/notifications/${firstNotif.id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    assert(readRes.status === 200, "PATCH /notifications/:id/read marks notification as read");
  } catch (err) {
    console.error("❌ Unexpected error during E2E test execution:", err);
    failed++;
  } finally {
    server.close();
    await closeDatabasePool();
  }

  console.log(`\n========================================`);
  console.log(`🎯 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runCounsellorConnectE2ETests().catch((err) => {
  console.error("Fatal test runner failure:", err);
  process.exit(1);
});
