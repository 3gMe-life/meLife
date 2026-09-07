import { pool, connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { createApp } from "../src/app";
import http from "http";

async function runRetakeComparisonE2ETests() {
  console.log("🧪 Starting 3G MeLife Skill Finder Retake & Result Comparison E2E Test Suite...\n");

  await connectDatabase();
  await authRepository.seedRolePermissions();
  await participantRepository.initSchema();
  await assessmentRepository.initSchema();
  await assessmentRepository.seedCatalog();
  await assessmentContentRepository.initSchema();
  await assessmentContentRepository.seedSkillFinderContent();

  const app = createApp();
  const server = http.createServer(app);

  const port = 5066;
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
    const createParticipant = async (email: string, firstName: string, age = 14) => {
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
      const regData = await regRes.json();
      const token = regData.data.accessToken;
      const userId = regData.data.user.id;

      const birthYear = new Date().getFullYear() - age;
      await fetch(`${baseUrl}/participant/onboarding`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateOfBirth: `${birthYear}-04-10`,
          educationStage: "SCHOOL",
          gradeLevel: "9",
          guardianName: "Parent of " + firstName,
          guardianPhone: "+91 98765 11111",
        }),
      });

      return { userId, token, email };
    };

    // ==========================================
    // 1. SETUP FIRST PARTICIPANT & FIRST ATTEMPT
    // ==========================================
    console.log("\n--- Scenario 1: Initial Attempt #1 Execution & History Ledger Creation ---");
    const studentA = await createParticipant(`student_retest_${timestamp}@example.com`, "Aarav", 14);

    const startRes1 = await fetch(`${baseUrl}/assessments/skill-finder/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${studentA.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ versionCode: "ADVANCED_COMPREHENSIVE" }),
    });
    const startData1 = await startRes1.json();
    assert(
      startRes1.status === 200 && startData1.data?.attemptId,
      "Attempt #1: Successfully started initial assessment attempt"
    );
    const attemptId1 = startData1.data.attemptId;

    // Load questions for attempt 1
    const qRes1 = await fetch(`${baseUrl}/attempts/${attemptId1}/questions`, {
      headers: { Authorization: `Bearer ${studentA.token}` },
    });
    const qData1 = await qRes1.json();
    const questions1 = qData1.data.questions;
    assert(
      questions1?.length > 0,
      `Attempt #1: Retrieved ${questions1?.length} questions for baseline session`
    );

    // Answer questions for attempt 1 (Baseline Profile: Likert 2 representing moderate/emerging)
    for (const q of questions1) {
      let selectedOptionId: string | null = null;
      let responseValue = "2";

      if (q.questionType === "LIKERT" || q.questionType === "SJT") {
        responseValue = "2";
      } else if (q.options && q.options.length > 1) {
        selectedOptionId = q.options[1].id;
        responseValue = q.options[1].optionKey || "B";
      } else if (q.options && q.options.length > 0) {
        selectedOptionId = q.options[0].id;
        responseValue = q.options[0].optionKey || "A";
      }

      await fetch(`${baseUrl}/attempts/${attemptId1}/responses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${studentA.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: q.id,
          selectedOptionId,
          responseValue,
          timeSpentSeconds: 5,
        }),
      });
    }

    // Submit attempt 1
    const submitRes1 = await fetch(`${baseUrl}/attempts/${attemptId1}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentA.token}` },
    });
    const submitData1 = await submitRes1.json();
    assert(
      submitRes1.status === 200 && submitData1.data?.resultId,
      "Attempt #1: Successfully submitted and scored baseline assessment"
    );
    const resultId1 = submitData1.data.resultId;
    const result1 = submitData1.data.result;

    // Verify assessment history ledger for attempt 1
    const histRes1 = await fetch(`${baseUrl}/assessments/skill-finder/history`, {
      headers: { Authorization: `Bearer ${studentA.token}` },
    });
    const histData1 = await histRes1.json();
    assert(
      histRes1.status === 200 &&
        histData1.data?.totalAttempts === 1 &&
        histData1.data?.history?.[0]?.attemptNumber === 1 &&
        histData1.data?.history?.[0]?.attemptId === attemptId1 &&
        histData1.data?.history?.[0]?.resultId === resultId1,
      "History Ledger: Attempt #1 recorded with attemptNumber=1, correct attemptId & resultId"
    );

    // ==========================================
    // 2. RETAKE ATTEMPT INITIATION & ISOLATION
    // ==========================================
    console.log("\n--- Scenario 2: Retake Assessment Creation & Attempt Isolation ---");
    const retakeRes = await fetch(`${baseUrl}/assessments/skill-finder/retake`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${studentA.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ versionCode: "ADVANCED_COMPREHENSIVE" }),
    });
    const retakeData = await retakeRes.json();
    assert(
      retakeRes.status === 200 &&
        retakeData.data?.attemptId &&
        retakeData.data?.attemptId !== attemptId1 &&
        retakeData.data?.isNew === true &&
        retakeData.data?.attemptNumber === 2,
      "Retake Action: POST /assessments/skill-finder/retake created new Attempt #2"
    );
    const attemptId2 = retakeData.data.attemptId;

    // Verify Attempt #1 remains COMPLETED in database (0 data loss)
    const prevAttemptCheck = await pool.query(
      `SELECT status FROM assessment_attempts WHERE id = $1`,
      [attemptId1]
    );
    assert(
      prevAttemptCheck.rows[0]?.status === "COMPLETED",
      "Data Preservation: Attempt #1 remains permanently marked as COMPLETED"
    );

    // Verify Attempt #2 has fresh unanswered questions session
    const qRes2 = await fetch(`${baseUrl}/attempts/${attemptId2}/questions`, {
      headers: { Authorization: `Bearer ${studentA.token}` },
    });
    const qData2 = await qRes2.json();
    const answeredInNewSession = (qData2.data?.responses || []).length;
    assert(
      answeredInNewSession === 0,
      "Session Reset: Attempt #2 starts with 0 pre-filled responses (fresh evaluation)"
    );

    // ==========================================
    // 3. ANSWER & COMPLETE ATTEMPT #2 (GROWTH)
    // ==========================================
    console.log("\n--- Scenario 3: Complete Attempt #2 with Evolved Responses ---");
    const questions2 = qData2.data.questions;
    for (const q of questions2) {
      let selectedOptionId: string | null = null;
      let responseValue = "4";

      if (q.questionType === "LIKERT" || q.questionType === "SJT") {
        responseValue = "4"; // High 4s representing growth
      } else if (q.options && q.options.length > 0) {
        selectedOptionId = q.options[0].id;
        responseValue = q.options[0].optionKey || "A";
      }

      await fetch(`${baseUrl}/attempts/${attemptId2}/responses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${studentA.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: q.id,
          selectedOptionId,
          responseValue,
          timeSpentSeconds: 6,
        }),
      });
    }


    // Submit attempt 2
    const submitRes2 = await fetch(`${baseUrl}/attempts/${attemptId2}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentA.token}` },
    });
    const submitData2 = await submitRes2.json();
    assert(
      submitRes2.status === 200 && submitData2.data?.resultId,
      "Attempt #2: Successfully submitted and scored second evaluation"
    );
    const resultId2 = submitData2.data.resultId;

    // Verify history ledger now contains both attempts in descending order
    const histRes2 = await fetch(`${baseUrl}/assessments/skill-finder/history`, {
      headers: { Authorization: `Bearer ${studentA.token}` },
    });
    const histData2 = await histRes2.json();
    assert(
      histRes2.status === 200 &&
        histData2.data?.totalAttempts === 2 &&
        histData2.data?.history?.[0]?.attemptNumber === 2 &&
        histData2.data?.history?.[1]?.attemptNumber === 1,
      "History Ledger: Both Attempt #1 and Attempt #2 present in chronological sequence"
    );

    // ==========================================
    // 4. LONGITUDINAL COMPARISON ENGINE
    // ==========================================
    console.log("\n--- Scenario 4: Longitudinal Result Comparison & Growth Trajectory ---");
    const compareRes = await fetch(
      `${baseUrl}/assessments/compare?oldResultId=${encodeURIComponent(resultId1)}&newResultId=${encodeURIComponent(resultId2)}`,
      {
        headers: { Authorization: `Bearer ${studentA.token}` },
      }
    );
    const compareData = await compareRes.json();
    const comp = compareData.data;

    assert(
      compareRes.status === 200 && comp && comp.oldResultId === resultId1 && comp.newResultId === resultId2,
      "Comparison API: Successfully generated longitudinal comparison between results"
    );

    assert(
      comp.interestComparison?.length === 6,
      "Comparison Constructs: RIASEC comparison contains all 6 Holland domains"
    );

    assert(
      comp.skillsComparison?.length === 8,
      "Comparison Constructs: Skill behaviours comparison contains all 8 behavioral dimensions"
    );

    assert(
      comp.aptitudeComparison?.length >= 1,
      "Comparison Constructs: Aptitude comparison contains accuracy delta"
    );

    assert(
      comp.strengthsComparison?.length >= 1,
      "Comparison Constructs: Developmental strengths comparison contains habit dimensions"
    );

    assert(
      Array.isArray(comp.topGains) && comp.topGains.length > 0,
      `Growth Synthesis: Identified ${comp.topGains?.length} top positive gain dimensions`
    );

    assert(
      comp.growthTrajectory && comp.growthSummary,
      `Growth Trajectory: Synthesized narrative trajectory: "${comp.growthTrajectory}"`
    );

    assert(
      Array.isArray(comp.narrativeInsights) && comp.narrativeInsights.length > 0,
      `Counselor Insights: Generated ${comp.narrativeInsights?.length} psychological narrative insights`
    );

    // ==========================================
    // 5. LATEST COMPARISON AUTO-RESOLUTION
    // ==========================================
    console.log("\n--- Scenario 5: Latest Comparison Auto-Discovery ---");
    const latestCompRes = await fetch(
      `${baseUrl}/assessments/compare/latest?assessmentCode=skill-finder`,
      {
        headers: { Authorization: `Bearer ${studentA.token}` },
      }
    );
    const latestCompData = await latestCompRes.json();
    assert(
      latestCompRes.status === 200 &&
        latestCompData.data?.hasComparison === true &&
        latestCompData.data?.comparison?.oldResultId === resultId1 &&
        latestCompData.data?.comparison?.newResultId === resultId2,
      "Latest Comparison: GET /assessments/compare/latest automatically pairs latest two attempts"
    );

    // ==========================================
    // 6. MULTI-TENANT ISOLATION & ACCESS CONTROL
    // ==========================================
    console.log("\n--- Scenario 6: Security & Participant Data Isolation ---");
    const studentB = await createParticipant(`student_other_${timestamp}@example.com`, "Diya", 15);

    // Student B attempts to query Student A's history
    const crossHistRes = await fetch(`${baseUrl}/assessments/skill-finder/history`, {
      headers: { Authorization: `Bearer ${studentB.token}` },
    });
    const crossHistData = await crossHistRes.json();
    assert(
      crossHistRes.status === 200 && crossHistData.data?.totalAttempts === 0,
      "Participant Isolation: Student B has 0 attempts and cannot view Student A's history"
    );

    // Student B attempts to compare Student A's results
    const crossCompRes = await fetch(
      `${baseUrl}/assessments/compare?oldResultId=${encodeURIComponent(resultId1)}&newResultId=${encodeURIComponent(resultId2)}`,
      {
        headers: { Authorization: `Bearer ${studentB.token}` },
      }
    );
    assert(
      crossCompRes.status === 403 || crossCompRes.status === 404,
      "Access Control: Cross-participant comparison request is strictly rejected (403/404)"
    );

    console.log(`\n========================================`);
    console.log(`E2E TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Unexpected Error in E2E Test Suite:", err);
    process.exit(1);
  } finally {
    server.close();
    await closeDatabasePool();
  }
}

runRetakeComparisonE2ETests();
