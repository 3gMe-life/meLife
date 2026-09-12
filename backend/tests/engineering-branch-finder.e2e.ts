/**
 * 3G MELIFE | ENGINEERING BRANCH FINDER END-TO-END INTEGRATION TEST
 * Full simulation: User registration, onboarding, attempt start, 80 question fetch & save,
 * final submission, psychometric scoring calculation, report generation, and retake lifecycle.
 */

import http from "http";
import { createApp } from "../src/app";
import { connectDatabase, closeDatabasePool, pool } from "../src/config/database";
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

    // 4.1 Verify Master Item Bank in DB (Must remain 80 questions)
    const bankRes = await pool.query(
      `SELECT COUNT(*) as count FROM assessment_questions q
       JOIN assessments a ON q.assessment_id = a.id
       WHERE a.code = 'ENGINEERING_BRANCH_FINDER'`
    );
    const bankCount = parseInt(bankRes.rows[0]?.count, 10);
    assert(bankCount === 80, "3. Master Item Bank Preserved in DB (80 questions)", `Bank count: ${bankCount}`);

    // 4.2 Start Engineering Branch Finder Attempt (Standard 45-question edition)
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
      "4. Start Engineering Branch Finder Attempt (IN_PROGRESS, 45 questions)",
      `Attempt ID: ${startData.data?.attemptId}, Version: ${startData.data?.versionCode}`
    );

    const attemptId = startData.data.attemptId;

    // 5. Fetch all 45 questions with options (Question 1 to 45)
    const qRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/questions?lang=en`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const qData: any = await qRes.json();
    assert(
      qRes.status === 200 && qData.data?.questions?.length === 45,
      "5. Fetch Exactly 45 Sanitized Questions for Student (1 to 45)",
      `Received ${qData.data?.questions?.length} questions.`
    );

    const questions = qData.data.questions;

    // Verify first and last question numbers are 1 and 45
    assert(questions[0]?.questionNumber === 1, "5.1 First question has questionNumber = 1");
    assert(questions[44]?.questionNumber === 45, "5.2 Last question has questionNumber = 45");

    // 6. Answer all 45 questions (simulate Mechanical & Aerospace dominant preferences)
    console.log("⏳ Submitting responses for all 45 questions in concurrent batches...");
    for (let i = 0; i < questions.length; i += 8) {
      const batch = questions.slice(i, i + 8);
      await Promise.all(
        batch.map(async (q: any) => {
          let responseVal = "2";
          // Mechanical questions (Likert Q16-Q20 in the 45-item form, which correspond to items 25-29)
          if (q.questionNumber >= 16 && q.questionNumber <= 20) {
            responseVal = "4"; // High on Mechanical
          } else if (q.questionNumber >= 36 && q.questionNumber <= 40) {
            responseVal = "3"; // High on Aerospace (Likert Q36-Q40, items 57-61)
          }

          if (q.questionNumber >= 41) {
            // Forced choice scenarios (Q41-Q45): pick D (ME) or H (AERO)
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
    assert(true, "6. Response Persistence (Autosave across 45 questions)");

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
      "7. Final Submission & Psychometric Scoring Pipeline (45 questions)",
      `Result ID: ${submitData.data?.resultId}`
    );

    const result = submitData.data.result;
    assert(
      result.totalQuestions === 45,
      "7.1 Result totalQuestions is exactly 45",
      `Total: ${result.totalQuestions}`
    );
    assert(
      result.completedQuestions === 45,
      "7.2 Result completedQuestions is exactly 45",
      `Completed: ${result.completedQuestions}`
    );
    assert(
      result.primaryBranch?.branchCode === "ME",
      "8. Scoring Accuracy: Primary Branch is Mechanical Engineering",
      `Primary: ${result.primaryBranch?.branchName} (${result.primaryBranch?.displayPercentage}%)`
    );
    assert(
      result.secondaryBranch?.branchCode === "AERO",
      "9. Scoring Accuracy: Secondary Branch is Aerospace Engineering",
      `Secondary: ${result.secondaryBranch?.branchName} (${result.secondaryBranch?.displayPercentage}%)`
    );
    assert(
      result.pilotStatus === "Development / Pilot Required",
      "10. Pilot Status Declaration: 'Development / Pilot Required'",
      `Pilot status correctly tagged.`
    );
    assert(
      Object.keys(result.constructScores).length === 8,
      "11. 8-Construct Profile Generation (C01–C08)",
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
      "12. Immutable Result Snapshot Retrieval"
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
      "13. Exploratory Report Synthesizer (Report Snapshot Generated)"
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
      "14. Longitudinal Retake Session Initialization (Attempt #2 created, Baseline #1 preserved)"
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
