import { pool, connectDatabase, closeDatabasePool } from "../../../config/database";
import { assessmentRunnerService } from "../assessment-runner.service";
import { scoringService } from "../../scoring/scoring.service";
import { reportService } from "../../reports/report.service";

async function runE2EFlow() {
  console.log("======================================================================");
  console.log("🚀 TESTING END-TO-END FLOW: ENTREPRENEUR DEVELOPMENT TEST");
  console.log("======================================================================\n");

  try {
    await connectDatabase();

    // 1. Get or create a test student user
    const userRes = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name 
       FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       WHERE r.name = 'PARTICIPANT' LIMIT 1`
    );
    let testUser = userRes.rows[0];

    if (!testUser) {
      const anyUserRes = await pool.query(`SELECT id, email, first_name, last_name FROM users LIMIT 1`);
      testUser = anyUserRes.rows[0];
    }
    console.log(`👤 Using test participant: ${testUser.first_name} ${testUser.last_name} (${testUser.id})`);

    // Clean up any existing active/incomplete attempts for clean test run
    await pool.query(
      `DELETE FROM assessment_attempts WHERE participant_id = $1 AND assessment_id IN (
         SELECT id FROM assessments WHERE code = 'ENTREPRENEUR_DEVELOPMENT_TEST'
       )`,
      [testUser.id]
    );

    // 2. Start Assessment Attempt
    console.log("\n2. Starting assessment attempt for ENTREPRENEUR_DEVELOPMENT_TEST...");
    const startResult = await assessmentRunnerService.startOrCreateAttempt(
      testUser.id,
      "ENTREPRENEUR_DEVELOPMENT_TEST"
    );
    console.log("Start Attempt Result:", startResult);

    if (!startResult.attemptId) {
      throw new Error("Failed to create assessment attempt");
    }
    const attemptId = startResult.attemptId;

    // 3. Fetch Attempt Questions (Sanitized)
    console.log("\n3. Loading attempt questions...");
    const questionsPayload = await assessmentRunnerService.getAttemptQuestions(
      testUser.id,
      attemptId,
      "en"
    );
    console.log(`Loaded ${questionsPayload.questions.length} questions across ${questionsPayload.sections.length} sections.`);

    if (questionsPayload.questions.length !== 60) {
      throw new Error(`Expected 60 questions, got ${questionsPayload.questions.length}`);
    }

    // 4. Save Responses for all 60 questions
    console.log("\n4. Simulating student answering all 60 questions...");
    for (const q of questionsPayload.questions) {
      const selectedOpt = q.options[q.options.length - 1]; // Pick high scoring option
      let val = selectedOpt.optionKey;
      if (q.questionType === "likert_1_5") {
        val = selectedOpt.optionKey.replace(/[^0-9]/g, "") || "5";
      }

      await assessmentRunnerService.saveResponse(
        testUser.id,
        attemptId,
        {
          questionId: q.id,
          selectedOptionId: selectedOpt.id,
          responseValue: val,
        }
      );
    }
    console.log("✓ Saved 60 answers successfully.");

    // 5. Finalize and Score Attempt
    console.log("\n5. Scoring and finalizing attempt...");
    const finalizeRes = await scoringService.scoreAndFinalizeAttempt(
      testUser.id,
      attemptId,
      "en"
    );

    console.log("Finalize Response Success:", finalizeRes.success);
    console.log("Result ID:", finalizeRes.resultId);
    const scoreResult: any = finalizeRes.result;
    console.log("Readiness Index (ERI):", scoreResult.readinessIndex, `/ 100 (${scoreResult.readinessBand})`);
    console.log("Primary Archetype:", scoreResult.primaryArchetype?.title);
    console.log("Secondary Archetype:", scoreResult.secondaryArchetype?.title || "None");
    console.log("Strengths:", scoreResult.strengths?.map((s: any) => `${s.dimensionName} (${s.score}%)`).join(", "));
    console.log("Growth Areas:", scoreResult.developmentAreas?.map((d: any) => `${d.dimensionName} (${d.score}%)`).join(", "));
    console.log("4-Stage Startup Roadmap phases count:", scoreResult.roadmap?.length);

    // 6. Generate Psychometric Report Snapshot
    console.log("\n6. Synthesizing psychometric report DTO...");
    const reportData = await reportService.generateOrGetReport(
      finalizeRes.resultId,
      testUser.id,
      "PARTICIPANT",
      "en"
    );

    console.log("Generated Report Title:", reportData.report.report_title);
    console.log("Report Archetype:", reportData.report.profile_archetype);
    console.log("Report Language:", reportData.report.language_code);

    // 7. Verify Idempotent Resumption / Retrieval
    console.log("\n7. Testing report retrieval by ID...");
    const fetchedReport = await reportService.getReportById(
      reportData.report.id,
      testUser.id,
      "PARTICIPANT",
      "en"
    );
    console.log("✓ Successfully retrieved cached report DTO by ID. Report ID:", fetchedReport.report.id);

    console.log("\n🎉 ALL LIVE END-TO-END FLOW TESTS PASSED FLAWLESSLY!");
  } catch (err) {
    console.error("❌ E2E Flow test failed:", err);
    process.exit(1);
  } finally {
    await closeDatabasePool();
  }
}

runE2EFlow();
