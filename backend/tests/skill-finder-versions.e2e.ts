import { pool, connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { skillFinderQuestionSelectionService } from "../src/modules/assessments/services/skill-finder-question-selection.service";
import { createApp } from "../src/app";
import http from "http";

async function runSkillFinderVersionsE2ETests() {
  console.log("🧪 Starting Skill Finder Question Bank & Versioning E2E Test Suite...\n");

  await connectDatabase();
  await authRepository.seedRolePermissions();
  await participantRepository.initSchema();
  await assessmentRepository.initSchema();
  await assessmentRepository.seedCatalog();
  await assessmentContentRepository.initSchema();
  await assessmentContentRepository.seedSkillFinderContent();
  await skillFinderQuestionSelectionService.seedSkillFinderVersions();

  const app = createApp();
  const server = http.createServer(app);

  const port = 5088;
  await new Promise<void>((resolve) => server.listen(port, resolve));
  const baseUrl = `http://localhost:${port}/api/v1`;

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

    // Helper to register participant & complete onboarding
    const createParticipant = async (email: string, firstName: string, age = 12) => {
      const regRes = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "Password123!",
          firstName,
          lastName: "TestStudent",
          registrationPath: "STUDENT",
        }),
      });
      const regData = await regRes.json();
      const token = regData.data.accessToken;
      const userId = regData.data.user.id;

      // Onboard
      const birthYear = new Date().getFullYear() - age;
      await fetch(`${baseUrl}/participant/onboarding`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateOfBirth: `${birthYear}-05-15`,
          educationStage: "SCHOOL",
          gradeLevel: "7",
          guardianName: "Parent of " + firstName,
          guardianPhone: "+91 98765 00000",
        }),
      });

      return { userId, token, email };
    };

    // =========================================================================
    // 1. TEST: Master Question Bank & Version Distribution
    // =========================================================================
    const bankCountRes = await pool.query(
      `SELECT COUNT(*) as count FROM assessment_questions WHERE assessment_id = (SELECT id FROM assessments WHERE code = 'SKILL_FINDER')`
    );
    assert(
      parseInt(bankCountRes.rows[0].count, 10) === 104,
      "Question Bank: Master Bank preserves exactly 104 questions"
    );

    const studentVersionRes = await pool.query(
      `SELECT COUNT(*) as count FROM assessment_version_questions
       WHERE version_id = (SELECT id FROM assessment_versions WHERE version_code = 'STUDENT_STANDARD')`
    );
    assert(
      parseInt(studentVersionRes.rows[0].count, 10) === 68,
      "Version Model: Student Edition linked to exactly 68 curated questions"
    );

    const advancedVersionRes = await pool.query(
      `SELECT COUNT(*) as count FROM assessment_version_questions
       WHERE version_id = (SELECT id FROM assessment_versions WHERE version_code = 'ADVANCED_COMPREHENSIVE')`
    );
    assert(
      parseInt(advancedVersionRes.rows[0].count, 10) === 104,
      "Version Model: Advanced Edition linked to all 104 questions"
    );

    // =========================================================================
    // 2. TEST: Student Edition Lifecycle (68 questions)
    // =========================================================================
    const student1 = await createParticipant(`student_edition_${timestamp}@example.com`, "Aarav", 12);

    const startStudentRes = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${student1.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ versionCode: "STUDENT_STANDARD" }),
    });
    const startStudentData = await startStudentRes.json();
    assert(
      startStudentRes.status === 200 &&
      startStudentData.data?.attemptId &&
      startStudentData.data?.versionCode === "STUDENT_STANDARD",
      "Lifecycle: Started Student Edition attempt (STUDENT_STANDARD)"
    );

    const studentAttemptId = startStudentData.data.attemptId;

    // Load questions for Student Edition
    const qStudentRes = await fetch(`${baseUrl}/attempts/${studentAttemptId}/questions`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const qStudentData = await qStudentRes.json();
    assert(
      qStudentRes.status === 200 &&
      qStudentData.data?.totalQuestions === 68 &&
      qStudentData.data?.questions?.length === 68 &&
      qStudentData.data?.versionName === "Skill Finder — Student Edition",
      "Question Delivery: Returns exactly 68 questions with clean Student Edition metadata"
    );

    // Verify sections breakdown in Student Edition
    const secSum = qStudentData.data.sections;
    const secA = secSum.find((s: any) => s.code === "SECTION_A");
    const secB = secSum.find((s: any) => s.code === "SECTION_B");
    const secC = secSum.find((s: any) => s.code === "SECTION_C");
    const secD = secSum.find((s: any) => s.code === "SECTION_D");
    const secE = secSum.find((s: any) => s.code === "SECTION_E");

    assert(
      secA?.totalQuestions === 24 &&
      secB?.totalQuestions === 16 &&
      secC?.totalQuestions === 16 &&
      secD?.totalQuestions === 10 &&
      secE?.totalQuestions === 2,
      "Question Distribution: Balanced across RIASEC (24), Skills (16), Aptitude (16), Habits (10), Quality (2)"
    );

    // Save responses for all 68 questions
    const saveStudentPromises = qStudentData.data.questions.map((q: any) => {
      let ansVal = "3";
      let optId = q.options[0]?.id;

      if (q.questionType === "likert_1_4") {
        ansVal = q.questionNumber === 68 ? "2" : "3";
        optId = q.options.find((o: any) => o.optionKey === ansVal)?.id;
      } else if (q.questionType === "mcq_text" || q.questionType === "mcq_image") {
        ansVal = "B";
        optId = q.options.find((o: any) => o.optionKey === ansVal)?.id;
      } else if (q.questionType === "open_scored") {
        ansVal = "Desk organizer, mini flower vase, bird feeder, pencil holder, paper cup megaphone, paint mixer.";
      }

      return fetch(`${baseUrl}/attempts/${studentAttemptId}/responses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${student1.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: q.id,
          selectedOptionId: optId,
          responseValue: ansVal,
        }),
      });
    });
    await Promise.all(saveStudentPromises);

    // Submit Student Edition
    const submitStudentRes = await fetch(`${baseUrl}/attempts/${studentAttemptId}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const submitStudentData = await submitStudentRes.json();
    assert(
      submitStudentRes.status === 200 && submitStudentData.success,
      "Submission Engine: Successfully submitted Student Edition attempt"
    );

    const studentResult = submitStudentData.data.result;
    assert(
      studentResult.interestDiscovery?.dimensions?.length === 6 &&
      studentResult.interestDiscovery?.topClusters?.length === 3,
      "Dynamic Scoring: All 6 RIASEC domains scored dynamically from 24 items"
    );
    assert(
      studentResult.skillBehaviour?.dimensions?.length === 8 &&
      studentResult.demonstratedAptitude?.dimensions?.length === 8 &&
      studentResult.developmentalStrengths?.dimensions?.length === 7,
      "Dynamic Scoring: All Skill (8), Aptitude (8), and Habit (7) dimensions evaluated accurately"
    );

    // =========================================================================
    // 3. TEST: Advanced Edition Lifecycle (104 questions)
    // =========================================================================
    const student2 = await createParticipant(`counsellor_adv_${timestamp}@example.com`, "Priya", 13);

    const startAdvRes = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${student2.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ versionCode: "ADVANCED_COMPREHENSIVE" }),
    });
    const startAdvData = await startAdvRes.json();
    assert(
      startAdvRes.status === 200 &&
      startAdvData.data?.attemptId &&
      startAdvData.data?.versionCode === "ADVANCED_COMPREHENSIVE",
      "Lifecycle: Started Advanced Comprehensive Edition attempt"
    );

    const advAttemptId = startAdvData.data.attemptId;

    const qAdvRes = await fetch(`${baseUrl}/attempts/${advAttemptId}/questions`, {
      headers: { Authorization: `Bearer ${student2.token}` },
    });
    const qAdvData = await qAdvRes.json();
    assert(
      qAdvRes.status === 200 &&
      qAdvData.data?.totalQuestions === 104 &&
      qAdvData.data?.questions?.length === 104,
      "Question Delivery: Advanced Edition loads all 104 questions"
    );

    // Answer & submit Advanced Edition
    const saveAdvPromises = qAdvData.data.questions.map((q: any) => {
      let ansVal = "3";
      let optId = q.options[0]?.id;

      if (q.questionType === "likert_1_4") {
        ansVal = q.questionNumber === 104 ? "2" : "3";
        optId = q.options.find((o: any) => o.optionKey === ansVal)?.id;
      } else if (q.questionType === "mcq_text" || q.questionType === "mcq_image") {
        ansVal = "B";
        optId = q.options.find((o: any) => o.optionKey === ansVal)?.id;
      } else if (q.questionType === "open_scored") {
        ansVal = "Cardboard organizer, mini garage, drawer separator, shadow puppet theater, bird feeder, gift box.";
      }

      return fetch(`${baseUrl}/attempts/${advAttemptId}/responses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${student2.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: q.id,
          selectedOptionId: optId,
          responseValue: ansVal,
        }),
      });
    });
    await Promise.all(saveAdvPromises);

    const submitAdvRes = await fetch(`${baseUrl}/attempts/${advAttemptId}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student2.token}` },
    });
    const submitAdvData = await submitAdvRes.json();
    assert(
      submitAdvRes.status === 200 && submitAdvData.success,
      "Submission Engine: Successfully submitted Advanced Edition attempt"
    );

    // =========================================================================
    // 4. TEST: Security & Isolation
    // =========================================================================
    const unauthRes = await fetch(`${baseUrl}/attempts/${studentAttemptId}/questions`);
    assert(
      unauthRes.status === 401,
      "Security: Unauthenticated request blocked (401 Unauthorized)"
    );

    const crossUserRes = await fetch(`${baseUrl}/attempts/${studentAttemptId}/questions`, {
      headers: { Authorization: `Bearer ${student2.token}` },
    });
    assert(
      crossUserRes.status === 403,
      "Security: Cross-participant attempt access blocked (403 Forbidden)"
    );

  } catch (err) {
    console.error("Test execution error:", err);
    failed++;
  } finally {
    server.close();
    await closeDatabasePool();
  }

  console.log("\n========================================");
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log("========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runSkillFinderVersionsE2ETests();
