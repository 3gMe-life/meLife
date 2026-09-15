/**
 * 3G MELIFE | CAREER FINDER (RIGHT_CAREER_FINDER) END-TO-END INTEGRATION TEST
 * Full simulation:
 * 1. Master Item Bank preservation in DB (all 80 questions).
 * 2. Version definition & Question linkages (50 questions: 45 Likert + 5 Forced Choice).
 * 3. Multilingual translations across EN, HI, ML, TA, KN, AR.
 * 4. Assessment Attempt creation & 50-question retrieval.
 * 5. Answering 50 questions (0/50 -> 50/50).
 * 6. Scoring calculation across 6 Career families, 9 construct dimensions, explainability layer.
 * 7. Report persistence & retrieval.
 * 8. Retake attempt creation (50 questions).
 */

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import http from "http";
import { createApp } from "../src/app";
import { connectDatabase, closeDatabasePool, pool } from "../src/config/database";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { rightCareerFinderQuestionSelectionService } from "../src/modules/assessments/services/right-career-finder-question-selection.service";
import { rightCareerFinderTranslationsService } from "../src/modules/assessments/services/right-career-finder-translations.service";

let server: http.Server;
let baseUrl = "";
let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    testsPassed++;
    console.log(`✅ [PASS] ${testName}`);
  } else {
    testsFailed++;
    console.error(`❌ [FAIL] ${testName}: ${details || "Assertion failed"}`);
  }
}

async function runRightCareerFinderE2ETests() {
  console.log("================================================================================");
  console.log("🚀 STARTING CAREER FINDER (RIGHT_CAREER_FINDER) E2E INTEGRATION TEST (50 ITEMS)");
  console.log("================================================================================\n");

  try {
    // 1. Initialize DB and server
    await connectDatabase();
    await assessmentRepository.initSchema();
    await assessmentRepository.seedCatalog();
    await assessmentContentRepository.initSchema();
    await assessmentContentRepository.seedRightCareerFinderContent();
    await rightCareerFinderQuestionSelectionService.seedRightCareerFinderVersions();
    await rightCareerFinderTranslationsService.seedRightCareerFinderTranslations();

    const app = createApp();
    server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const port = (server.address() as any).port;
    baseUrl = `http://localhost:${port}/api/v1`;

    const timestamp = Date.now();
    const email = `career_explorer_${timestamp}@example.com`;

    // 2. Register Participant
    console.log("📝 1. Registering new participant...");
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Aarav",
        lastName: "Nair",
        email,
        password: "Password123!",
        registrationPath: "STUDENT",
      }),
    });
    const regData: any = await regRes.json();
    assert(regRes.status === 201 && regData.data?.accessToken, "1. Participant Registration (201 Created)");
    const token = regData.data.accessToken;
    const authHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // 3. Complete Onboarding Profile
    console.log("\n🎓 2. Completing onboarding profile for participant...");
    const onbRes = await fetch(`${baseUrl}/participant/onboarding`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        dateOfBirth: "2005-04-12",
        educationStage: "COLLEGE_UNIVERSITY",
        schoolName: "National Institute of Technology",
      }),
    });
    assert(onbRes.status === 200, "2. Participant Calibration & Onboarding completed");

    // 4. Verify Item Bank Preservation in PostgreSQL (80 master items)
    console.log("\n📦 3. Verifying 80-question item bank preserved in DB...");
    const assessRes = await pool.query(
      `SELECT id FROM assessments WHERE code = 'RIGHT_CAREER_FINDER' LIMIT 1`
    );
    const assessmentId = assessRes.rows[0].id;
    const countCheck = await pool.query(
      `SELECT COUNT(*)::int as count FROM assessment_questions WHERE assessment_id = $1`,
      [assessmentId]
    );
    assert(countCheck.rows[0].count === 80, "3. Assessment questions table preserves all 80 master items", `Got ${countCheck.rows[0].count}`);

    // 5. Verify Assessment Version is set to 50 questions
    console.log("\n📋 4. Verifying version definition and question linkages...");
    const verRes = await pool.query(
      `SELECT id, version_code, question_count, is_default FROM assessment_versions
       WHERE assessment_id = $1 AND version_code = 'RIGHT_CAREER_FINDER_V1'`,
      [assessmentId]
    );
    assert(verRes.rows.length === 1, "4.1 RIGHT_CAREER_FINDER_V1 version exists in DB");
    assert(verRes.rows[0].question_count === 50, "4.2 Version question_count is exactly 50");
    assert(verRes.rows[0].is_default === true, "4.3 Version is marked as default");

    const vqCount = await pool.query(
      `SELECT COUNT(*)::int as count FROM assessment_version_questions WHERE version_id = $1`,
      [verRes.rows[0].id]
    );
    assert(vqCount.rows[0].count === 50, "4.4 Version has exactly 50 linked questions in assessment_version_questions");

    // 6. Start Assessment Attempt
    console.log("\n🚀 5. Starting Career Finder attempt...");
    const startRes = await fetch(`${baseUrl}/assessments/RIGHT_CAREER_FINDER/start`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({}),
    });
    const startData: any = await startRes.json();
    assert(startRes.status === 200 && startData.data?.attemptId, "5. Career Finder attempt started successfully");
    const attemptId = startData.data.attemptId;

    // 7. Retrieve Administered 50 Questions
    console.log("\n📥 6. Retrieving administered questions for attempt...");
    const qRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/questions?lang=en`, {
      headers: authHeaders,
    });
    const qData: any = await qRes.json();
    assert(qRes.status === 200, "6.1 Questions endpoint returned 200 OK");
    assert(qData.data?.questions?.length === 50, "6.2 Standard form delivers exactly 50 questions", `Got ${qData.data?.questions?.length}`);
    assert(qData.data?.sections?.length === 10, "6.3 Standard form has 10 sections", `Got ${qData.data?.sections?.length}`);

    // Verify multilingual translation support
    const mlRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/questions?lang=ml`, {
      headers: authHeaders,
    });
    const mlData: any = await mlRes.json();
    assert(
      mlRes.status === 200 &&
        mlData.data?.questions?.[0]?.questionText &&
        mlData.data?.questions?.[0]?.questionText !== qData.data?.questions?.[0]?.questionText,
      "6.4 Multilingual translation (Malayalam) verified for questions"
    );

    // 8. Submit Answers for all 50 questions
    console.log("\n✍️ 7. Submitting responses for all 50 questions...");
    for (let i = 0; i < qData.data.questions.length; i++) {
      const q = qData.data.questions[i];
      let selectedOption: any;

      if (q.questionType === "likert_1_5") {
        const qNum = q.questionNumber;
        if ((qNum >= 1 && qNum <= 4) || (qNum >= 57 && qNum <= 60)) {
          // Strong affinity for Tech & Engineering
          selectedOption = q.options.find((o: any) => o.optionKey === "5") || q.options[4];
        } else if (qNum === 5 || qNum === 61) {
          // Reverse keyed items: answer 1 so reverse is 5
          selectedOption = q.options.find((o: any) => o.optionKey === "1") || q.options[0];
        } else {
          // Neutral for others
          selectedOption = q.options.find((o: any) => o.optionKey === "3") || q.options[2];
        }
      } else {
        // Forced-choice scenarios: select TECH_COMPUTING_AI option
        selectedOption =
          q.options.find((o: any) => o.optionKey === "TECH_COMPUTING_AI") ||
          q.options.find((o: any) => o.metadata?.familyTarget === "TECH_COMPUTING_AI") ||
          q.options[0];
      }

      const ansRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/responses`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          questionId: q.id,
          selectedOptionId: selectedOption?.id,
          responseValue: selectedOption?.optionKey || "5",
        }),
      });
      const ansData: any = await ansRes.json();
      if (!ansData.success) {
        console.error(`Failed to save question ${i + 1}:`, ansData);
      }
    }

    const checkAttemptRes = await pool.query(
      `SELECT answered_count FROM assessment_attempts WHERE id = $1`,
      [attemptId]
    );
    assert(
      checkAttemptRes.rows[0].answered_count === 50,
      `7. Answered count reaches 50/50 (got ${checkAttemptRes.rows[0].answered_count})`
    );

    // 9. Finalize and Score Attempt
    console.log("\n⚡ 8. Finalizing and scoring attempt...");
    const scoreRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/submit`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({}),
    });
    const scoreData: any = await scoreRes.json();
    assert(scoreRes.status === 200 && scoreData.data?.resultId, "8.1 Scoring completed and result persisted");

    const result = scoreData.data?.result;
    assert(result?.assessmentCode === "RIGHT_CAREER_FINDER", "8.2 Result assessment code matches RIGHT_CAREER_FINDER");
    assert(result?.primaryFamily?.familyCode === "TECH_COMPUTING_AI", "8.3 Primary career family identified as TECH_COMPUTING_AI", `Got ${result?.primaryFamily?.familyCode}`);
    assert(result?.sortedFamilies?.length === 6, "8.4 All 6 Career families ranked and scored");
    assert(Object.keys(result?.dimensionScores || {}).length === 9, "8.5 All 9 construct dimensions scored");
    assert(result?.primaryDriverConstructs?.length > 0, "8.6 Explainability layer includes driver constructs");
    assert(typeof result?.scoreGapPercentage === "number", "8.7 Score gap percentage calculated");
    assert(result?.responseQuality?.isComplete === true, "8.8 Response quality indicates complete attempt");

    // 10. Generate Psychometric Report
    console.log("\n📄 9. Generating psychometric report...");
    const reportRes = await fetch(`${baseUrl}/reports/generate/${scoreData.data.resultId}`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({}),
    });
    const reportData: any = await reportRes.json();
    assert(reportRes.status === 201 || reportRes.status === 200, "9.1 Report generation API returned 200/201 OK");
    assert(reportData.data?.report?.assessmentCode === "RIGHT_CAREER_FINDER", "9.2 Report DTO assessment code is RIGHT_CAREER_FINDER");
    assert(reportData.data?.report?.pilotStatus === "Standard Pilot Edition", "9.3 Report carries Standard Pilot Edition badge");
    assert(reportData.data?.report?.allFamilies?.length === 6, "9.4 Report contains 6-family matrix");

    // 11. Retake session creation
    console.log("\n🔄 10. Initializing retake assessment...");
    const retakeRes = await fetch(`${baseUrl}/assessments/RIGHT_CAREER_FINDER/retake`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({}),
    });
    const retakeData: any = await retakeRes.json();
    assert(retakeRes.status === 200 && retakeData.data?.attemptId, "10.1 Retake attempt created successfully");
    assert(retakeData.data?.attemptId !== attemptId, "10.2 Retake has a distinct new attempt ID");

    // Print summary
    console.log("\n================================================================================");
    console.log(`🎉 TEST RUN COMPLETE: ${testsPassed} PASSED, ${testsFailed} FAILED`);
    console.log("================================================================================\n");

    if (testsFailed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("💥 Unhandled test error:", err);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
    await closeDatabasePool();
  }
}

runRightCareerFinderE2ETests();
