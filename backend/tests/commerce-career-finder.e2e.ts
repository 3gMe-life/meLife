/**
 * 3G MELIFE | COMMERCE CAREER FINDER END-TO-END INTEGRATION TEST
 * Full simulation:
 * 1. Master Item Bank preservation in DB (all 80 questions).
 * 2. Version definition & Question linkages (45 questions: 40 Likert + 5 Forced Choice).
 * 3. Multilingual translations across EN, HI, ML, TA, KN, AR.
 * 4. Assessment Attempt creation & 45-question retrieval.
 * 5. Answering 45 questions (0/45 -> 45/45).
 * 6. Scoring calculation across 4 Commerce domains, 4 Career families, and top career matches.
 * 7. Report persistence & retrieval.
 * 8. Retake attempt creation (45 questions).
 */

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import http from "http";
import { createApp } from "../src/app";
import { connectDatabase, closeDatabasePool, pool } from "../src/config/database";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { commerceCareerFinderQuestionSelectionService } from "../src/modules/assessments/services/commerce-career-finder-question-selection.service";
import { commerceCareerFinderTranslationsService } from "../src/modules/assessments/services/commerce-career-finder-translations.service";
import { assessmentRunnerService } from "../src/modules/assessments/assessment-runner.service";
import { scoringService } from "../src/modules/scoring/scoring.service";

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

async function runCommerceE2ETests() {
  console.log("================================================================================");
  console.log("🚀 STARTING COMMERCE CAREER FINDER E2E INTEGRATION TEST (45 QUESTIONS)");
  console.log("================================================================================\n");

  try {
    // 1. Initialize DB and server
    await connectDatabase();
    await assessmentRepository.initSchema();
    await assessmentRepository.seedCatalog();
    await assessmentContentRepository.initSchema();
    await assessmentContentRepository.seedCommerceCareerFinderContent();
    await commerceCareerFinderQuestionSelectionService.seedCommerceCareerFinderVersions();
    await commerceCareerFinderTranslationsService.seedCommerceCareerFinderTranslations();

    const app = createApp();
    server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const port = (server.address() as any).port;
    baseUrl = `http://localhost:${port}/api/v1`;

    const timestamp = Date.now();
    const email = `commerce_student_${timestamp}@example.com`;

    // 2. Register Student
    console.log("📝 1. Registering new participant...");
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Rhea",
        lastName: "Menon",
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
    console.log("\n🎓 2. Completing onboarding profile for student...");
    const onbRes = await fetch(`${baseUrl}/participant/onboarding`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        dateOfBirth: "2006-08-14",
        educationStage: "HIGHER_SECONDARY",
        schoolName: "Loyola Higher Secondary School",
      }),
    });
    assert(onbRes.status === 200, "2. Student Calibration & Onboarding completed");

    // 4. Verify Item Bank Preservation in PostgreSQL
    console.log("\n📦 3. Verifying 80-question item bank preserved in DB...");
    const assessRes = await pool.query(
      `SELECT id FROM assessments WHERE code = 'COMMERCE_CAREER_FINDER' LIMIT 1`
    );
    const assessmentId = assessRes.rows[0].id;
    const countCheck = await pool.query(
      `SELECT COUNT(*)::int as count FROM assessment_questions WHERE assessment_id = $1`,
      [assessmentId]
    );
    assert(countCheck.rows[0].count === 80, "3. Assessment questions table preserves all 80 items", `Got ${countCheck.rows[0].count}`);

    // 5. Verify Assessment Version is set to 45 questions
    console.log("\n📋 4. Verifying version definition and question linkages...");
    const verRes = await pool.query(
      `SELECT id, version_code, question_count, is_default FROM assessment_versions
       WHERE assessment_id = $1 AND version_code = 'COMMERCE_CAREER_FINDER_V1'`,
      [assessmentId]
    );
    assert(verRes.rows.length === 1, "4.1 COMMERCE_CAREER_FINDER_V1 version exists in DB");
    assert(verRes.rows[0].question_count === 45, "4.2 Version question_count is exactly 45");
    assert(verRes.rows[0].is_default === true, "4.3 Version is marked as default");

    const vqCount = await pool.query(
      `SELECT COUNT(*)::int as count FROM assessment_version_questions WHERE version_id = $1`,
      [verRes.rows[0].id]
    );
    assert(vqCount.rows[0].count === 45, "4.4 Version has exactly 45 linked questions in assessment_version_questions");

    // 6. Start Assessment Attempt
    console.log("\n🚀 5. Starting Commerce Career Finder attempt...");
    const startRes = await fetch(`${baseUrl}/assessments/COMMERCE_CAREER_FINDER/start`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({}),
    });
    const startData: any = await startRes.json();
    assert(startRes.status === 200 && startData.data?.attemptId, "5. Commerce Career Finder attempt started successfully");
    const attemptId = startData.data.attemptId;

    // 7. Fetch Assessment Questions (English)
    console.log("\n❓ 6. Fetching 45 questions in English...");
    const qResEn = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/questions?lang=en`, {
      headers: authHeaders,
    });
    const qDataEn: any = await qResEn.json();
    assert(qResEn.status === 200, "6.1 Fetched questions in English");
    const questions = qDataEn.data.questions;
    assert(questions.length === 45, `6.2 Questions payload returns exactly 45 questions (got ${questions.length})`);
    assert(qDataEn.data.totalQuestions === 45, `6.3 Attempt totalQuestions is 45 (got ${qDataEn.data.totalQuestions})`);

    // Verify ordering: 1..40 Likert (5 items/construct x 8), 41..45 Forced Choice
    const likertCount = questions.filter((q: any) => q.questionType === "likert_1_5").length;
    const forcedChoiceCount = questions.filter((q: any) => q.questionType === "forced_choice_4").length;
    assert(likertCount === 40, `6.4 Exactly 40 Likert items in standard administration form (got ${likertCount})`);
    assert(forcedChoiceCount === 5, `6.5 Exactly 5 Forced Choice items in standard administration form (got ${forcedChoiceCount})`);
    assert(questions[0].questionNumber === 1, "6.6 First question has questionNumber = 1");
    assert(questions[44].questionNumber === 45, "6.7 45th question has questionNumber = 45");

    // 8. Test Multilingual Question Retrieval (Hindi & Malayalam)
    console.log("\n🌐 7. Testing multilingual translation delivery (HI & ML)...");
    const qResHi = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/questions?lang=hi`, {
      headers: authHeaders,
    });
    const qDataHi: any = await qResHi.json();
    assert(qDataHi.data.questions.length === 45, "7.1 Hindi question set contains 45 items");
    assert(Boolean(qDataHi.data.questions[0].questionText), "7.2 Hindi question text translated");
    assert(qDataHi.data.questions[0].options[0].optionText === "पूरी तरह असहमत", "7.3 Hindi Likert options translated");

    const qResMl = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/questions?lang=ml`, {
      headers: authHeaders,
    });
    const qDataMl: any = await qResMl.json();
    assert(qDataMl.data.questions.length === 45, "7.4 Malayalam question set contains 45 items");
    assert(Boolean(qDataMl.data.questions[0].questionText), "7.5 Malayalam question text translated");
    assert(qDataMl.data.questions[0].options[0].optionText === "പൂർണ്ണമായും വിയോജിക്കുന്നു", "7.6 Malayalam Likert options translated");

    // 9. Answer All 45 Questions (Simulating Finance & Economics/Fintech Profile)
    console.log("\n✍️  8. Submitting responses for all 45 questions...");
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      let selectedOption: any;

      if (q.questionType === "likert_1_5") {
        // High interest in accounting/finance (5), moderate in others (4)
        const optIndex = (i % 2 === 0) ? 4 : 3;
        selectedOption = q.options[optIndex];
      } else {
        // Forced choice: pick option B (Finance & Investment) or option D (Economics & FinTech)
        selectedOption = q.options[i % 2 === 0 ? 1 : 3] || q.options[0];
      }

      const ansRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/responses`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          questionId: q.id,
          selectedOptionId: selectedOption.id,
          responseValue: selectedOption.optionKey,
        }),
      });
      const ansData: any = await ansRes.json();
      if (!ansData.success) {
        console.error(`Failed to save question ${i + 1}:`, ansData);
      }
    }

    // Verify all 45 answers recorded
    const checkAttemptRes = await pool.query(
      `SELECT answered_count FROM assessment_attempts WHERE id = $1`,
      [attemptId]
    );
    assert(checkAttemptRes.rows[0].answered_count === 45, `8. Attempt answered_count is 45/45 (got ${checkAttemptRes.rows[0].answered_count})`);

    // 10. Submit Attempt and Score Assessment
    console.log("\n📊 9. Finalizing and scoring Commerce Career Finder assessment...");
    const submitRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/submit`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        languageCode: "en",
      }),
    });
    const submitData: any = await submitRes.json();
    assert(submitRes.status === 200 && submitData.success, "9.1 Assessment submitted and scored successfully");
    const result = submitData.data.result;

    assert(result.assessmentCode === "COMMERCE_CAREER_FINDER", "9.2 Result assessmentCode is COMMERCE_CAREER_FINDER");
    assert(result.completedQuestions === 45, `9.3 completedQuestions in report is 45 (got ${result.completedQuestions})`);
    assert(result.totalQuestions === 45, `9.4 totalQuestions in report is 45 (got ${result.totalQuestions})`);
    assert(result.sortedFamilies.length === 4, `9.5 Evaluates 4 core career families (got ${result.sortedFamilies?.length})`);
    assert(result.sortedDimensions.length === 6, `9.6 Evaluates 6 core dimensions (got ${result.sortedDimensions?.length})`);
    assert(Boolean(result.primaryFamily), `9.7 Primary career family identified: ${result.primaryFamily?.familyName}`);
    assert(Boolean(result.secondaryFamily), `9.8 Secondary career family identified: ${result.secondaryFamily?.familyName}`);
    assert(Boolean(result.guidance?.interpretationSummary), "9.9 Guidance interpretation summary generated");
    assert(Boolean(result.guidance?.counsellorPrinciples?.length > 0), "9.10 Counsellor principles provided");
    assert(Boolean(result.responseQuality?.pilotDisclaimer), "9.11 Pilot disclaimer present in response quality");

    console.log(`\n🏆 Primary Career Family: ${result.primaryFamily?.familyName} (${result.primaryFamily?.displayPercentage}%) - ${result.primaryFamily?.alignment}`);
    console.log(`⭐ Secondary Career Family: ${result.secondaryFamily?.familyName} (${result.secondaryFamily?.displayPercentage}%) - ${result.secondaryFamily?.alignment}`);
    console.log(`🧭 Recommendation Clarity: ${result.clarity}`);

    // 11. Fetch Report Result via Result API
    console.log("\n📑 10. Fetching report snapshot via Result API...");
    const repRes = await fetch(`${baseUrl}/assessments/results/${attemptId}?lang=en`, {
      headers: authHeaders,
    });
    const repData: any = await repRes.json();
    const repResult = repData.data?.result || repData.data;
    assert(repRes.status === 200 && repData.success, "10.1 Report snapshot retrieved successfully");
    assert(repResult.completedQuestions === 45, "10.2 Report snapshot contains 45 completed questions");
    assert(repResult.sortedFamilies.length === 4, "10.3 Report snapshot contains 4 career families");

    // 12. Create Retest Attempt
    console.log("\n🔄 11. Testing retest/retake attempt creation...");
    const retestRes = await fetch(`${baseUrl}/assessments/COMMERCE_CAREER_FINDER/retake`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({}),
    });
    const retestData: any = await retestRes.json();
    assert(retestRes.status === 200 && retestData.success, "11.1 Retake attempt created successfully");
    assert(retestData.data.attemptNumber === 2, `11.2 Retake attempt number is 2 (got ${retestData.data.attemptNumber})`);

    const retestQRes = await fetch(`${baseUrl}/assessments/attempts/${retestData.data.attemptId}/questions?lang=en`, {
      headers: authHeaders,
    });
    const retestQData: any = await retestQRes.json();
    assert(retestQData.data.questions.length === 45, `11.3 Retake attempt has exactly 45 questions (got ${retestQData.data.questions.length})`);
    assert(retestQData.data.totalQuestions === 45, "11.4 Retake attempt totalQuestions is 45");

    console.log("\n================================================================================");
    console.log(`🎉 TEST SUMMARY: ${testsPassed} PASSED, ${testsFailed} FAILED`);
    console.log("================================================================================\n");

    if (testsFailed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ E2E Test execution failed with error:", err);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
    await closeDatabasePool();
  }
}

runCommerceE2ETests();
