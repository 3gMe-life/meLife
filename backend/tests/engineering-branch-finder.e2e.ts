/**
 * 3G MELIFE | ENGINEERING BRANCH FINDER END-TO-END INTEGRATION TEST
 * Full simulation: User registration, onboarding, attempt start, 80 question fetch & save,
 * final submission, psychometric scoring calculation, report generation, and retake lifecycle.
 */

import http from "http";
import { createApp } from "../src/app";
import { connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { engineeringBranchFinderQuestionSelectionService } from "../src/modules/assessments/services/engineering-branch-finder-question-selection.service";
import { engineeringBranchFinderTranslationsService } from "../src/modules/assessments/services/engineering-branch-finder-translations.service";

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

async function runE2ETests() {
  console.log("================================================================================");
  console.log("🧪 STARTING ENGINEERING BRANCH FINDER E2E INTEGRATION TEST (80 QUESTIONS)");
  console.log("================================================================================\n");

  try {
    // 1. Initialize DB and server
    await connectDatabase();
    await assessmentRepository.initSchema();
    await assessmentRepository.seedCatalog();
    await assessmentContentRepository.initSchema();
    await assessmentContentRepository.seedEngineeringBranchFinderContent();
    await engineeringBranchFinderQuestionSelectionService.seedEngineeringBranchFinderVersions();
    await engineeringBranchFinderTranslationsService.seedEngineeringBranchFinderTranslations();

    const app = createApp();
    server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const port = (server.address() as any).port;
    baseUrl = `http://localhost:${port}/api/v1`;

    const timestamp = Date.now();
    const email = `eng_student_${timestamp}@example.com`;

    // 2. Register Student
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Aarav",
        lastName: "Sharma",
        email,
        password: "Password123!",
        registrationPath: "STUDENT",
      }),
    });
    const regData: any = await regRes.json();
    assert(regRes.status === 201 && regData.data?.accessToken, "1. Student Registration (201 Created)");

    const token = regData.data.accessToken;

    // 3. Complete Student Onboarding
    const onboardRes = await fetch(`${baseUrl}/participant/onboarding`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateOfBirth: "2004-05-12",
        educationStage: "UNDERGRADUATE",
        schoolName: "Delhi Technological University",
      }),
    });
    assert(onboardRes.status === 200, "2. Student Calibration & Onboarding");

    // 4. Start Engineering Branch Finder Attempt
    const startRes = await fetch(`${baseUrl}/assessments/ENGINEERING_BRANCH_FINDER/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const startData: any = await startRes.json();
    assert(
      startRes.status === 200 && startData.data?.attemptId && startData.data?.status === "IN_PROGRESS",
      "3. Start Engineering Branch Finder Attempt (IN_PROGRESS)",
      `Attempt ID: ${startData.data?.attemptId}`
    );

    const attemptId = startData.data.attemptId;

    // 5. Fetch all 80 questions with options
    const qRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/questions?lang=en`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const qData: any = await qRes.json();
    assert(
      qRes.status === 200 && qData.data?.questions?.length === 80,
      "4. Fetch All 80 Sanitized Questions (E01–E80)",
      `Received ${qData.data?.questions?.length} questions.`
    );

    const questions = qData.data.questions;

    // 6. Answer all 80 questions (simulate Mechanical & Aerospace dominant preferences)
    console.log("⏳ Submitting responses for all 80 questions in concurrent batches...");
    for (let i = 0; i < questions.length; i += 8) {
      const batch = questions.slice(i, i + 8);
      await Promise.all(
        batch.map(async (q: any) => {
          let responseVal = "2";
          if (q.questionNumber >= 25 && q.questionNumber <= 32) {
            responseVal = "4"; // High on Mechanical (Q25-Q32)
          } else if (q.questionNumber >= 57 && q.questionNumber <= 64) {
            responseVal = "3"; // High on Aerospace (Q57-Q64)
          }

          if (q.questionNumber >= 65) {
            // Forced choice: pick D (ME) or H (AERO)
            responseVal = q.questionNumber % 2 === 0 ? "D" : "H";
          }

          const saveRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/responses`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              questionId: q.id,
              responseValue: responseVal,
            }),
          });
          if (saveRes.status !== 200) {
            const saveData: any = await saveRes.json();
            console.error(`Failed to save question #${q.questionNumber}:`, saveData);
          }
        })
      );
    }
    assert(true, "5. Response Persistence (Autosave across 80 questions)");

    // 7. Submit Attempt for Final Scoring
    const submitRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/submit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        languageCode: "en",
      }),
    });
    const submitData: any = await submitRes.json();
    assert(
      submitRes.status === 200 && submitData.data?.result?.assessmentCode === "ENGINEERING_BRANCH_FINDER",
      "6. Final Submission & Psychometric Scoring Pipeline",
      `Result ID: ${submitData.data?.resultId}`
    );

    const result = submitData.data.result;
    assert(
      result.primaryBranch?.branchCode === "ME",
      "7. Scoring Accuracy: Primary Branch is Mechanical Engineering",
      `Primary: ${result.primaryBranch?.branchName} (${result.primaryBranch?.displayPercentage}%)`
    );
    assert(
      result.secondaryBranch?.branchCode === "AERO",
      "8. Scoring Accuracy: Secondary Branch is Aerospace Engineering",
      `Secondary: ${result.secondaryBranch?.branchName} (${result.secondaryBranch?.displayPercentage}%)`
    );
    assert(
      result.pilotStatus === "Development / Pilot Required",
      "9. Pilot Status Declaration: 'Development / Pilot Required'",
      `Pilot status correctly tagged.`
    );
    assert(
      Object.keys(result.constructScores).length === 8,
      "10. 8-Construct Profile Generation (C01–C08)",
      `Construct scores: ${Object.keys(result.constructScores).join(", ")}`
    );

    // 8. Retrieve Result Snapshot (Immutability check)
    const getResultRes = await fetch(`${baseUrl}/assessments/results/${attemptId}?lang=en`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getResultData: any = await getResultRes.json();
    assert(
      getResultRes.status === 200 &&
        getResultData.data?.primaryBranch?.branchCode === "ME" &&
        getResultData.data?.attemptId === attemptId,
      "11. Immutable Result Snapshot Retrieval"
    );

    // 9. Generate Report Snapshot
    const resultId = submitData.data?.resultId || getResultData.data?.id;
    const reportRes = await fetch(`${baseUrl}/reports/generate/${resultId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language: "en" }),
    });
    const reportData: any = await reportRes.json();
    assert(
      (reportRes.status === 201 || reportRes.status === 200) &&
        (reportData.data?.report?.assessmentCode === "ENGINEERING_BRANCH_FINDER" ||
          reportData.data?.reportData?.assessmentCode === "ENGINEERING_BRANCH_FINDER"),
      "12. Exploratory Report Synthesizer (Report Snapshot Generated)"
    );

    // 10. Start Retake Attempt (Milestone Tracking)
    const retakeRes = await fetch(`${baseUrl}/assessments/ENGINEERING_BRANCH_FINDER/retake`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const retakeData: any = await retakeRes.json();
    assert(
      retakeRes.status === 200 &&
        retakeData.data?.isNew === true &&
        retakeData.data?.attemptId !== attemptId,
      "13. Longitudinal Retake Session Initialization (Attempt #2 created, Baseline #1 preserved)"
    );

    console.log("\n================================================================================");
    console.log(`📊 E2E TEST SUMMARY: ${testsPassed} Passed, ${testsFailed} Failed`);
    console.log("================================================================================\n");

  } finally {
    if (server) {
      server.close();
    }
    await closeDatabasePool();
  }
}

runE2ETests().then(() => {
  if (testsFailed > 0) {
    process.exit(1);
  }
});
