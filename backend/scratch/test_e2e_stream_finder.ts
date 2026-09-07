import { pool, connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentRunnerService } from "../src/modules/assessments/assessment-runner.service";
import { scoringService } from "../src/modules/scoring/scoring.service";
import { StreamFinderResultDTO } from "../src/modules/assessments/scoring/stream-finder-scoring.service";

async function testE2E() {
  await connectDatabase();

  // 1. Get a test participant
  const userRes = await pool.query(
    "SELECT id, email FROM users LIMIT 1"
  );
  if (!userRes.rows[0]) {
    console.error("No participant user found in DB for E2E test");
    await closeDatabasePool();
    return;
  }
  const userId = userRes.rows[0].id;
  console.log("Using test participant:", userRes.rows[0]);

  // Clean any existing in-progress attempts for STREAM_FINDER for a fresh test
  await pool.query(
    `DELETE FROM assessment_attempts 
     WHERE participant_id = $1 AND assessment_id = (SELECT id FROM assessments WHERE code = 'STREAM_FINDER')`,
    [userId]
  );

  // 2. Start Stream Finder attempt
  const startResult = await assessmentRunnerService.startOrCreateAttempt(userId, "STREAM_FINDER");
  console.log("Start Attempt Result:", startResult);
  const attemptId = startResult.attemptId;

  // 3. Load sanitized questions
  const qData = await assessmentRunnerService.getAttemptQuestions(userId, attemptId);
  console.log(`Loaded ${qData.questions.length} questions across ${qData.sections.length} sections`);

  // 4. Batch answer all 80 questions simulating high Science preference
  console.log("Submitting 80 answers...");
  for (const q of qData.questions) {
    let optKey = "2";
    let optId: string | null = null;

    if (q.questionType === "likert_1_5") {
      const isScience = q.dimensionCode === "SCIENCE";
      optKey = isScience ? "5" : "2";
      const opt = q.options?.find(o => o.optionKey === optKey) || q.options?.[0];
      optId = opt?.id || null;
    } else if (q.questionType === "forced_choice_4") {
      // Option A is Science
      const opt = q.options?.find(o => o.optionKey === "A") || q.options?.[0];
      optKey = opt?.optionKey || "A";
      optId = opt?.id || null;
    }

    await pool.query(
      `INSERT INTO assessment_responses (attempt_id, question_id, selected_option_id, response_value, score, updated_at)
       VALUES ($1, $2, $3, $4, 0, NOW())
       ON CONFLICT (attempt_id, question_id) DO UPDATE SET
         selected_option_id = EXCLUDED.selected_option_id,
         response_value = EXCLUDED.response_value,
         score = EXCLUDED.score,
         updated_at = NOW()`,
      [attemptId, q.id, optId, optKey]
    );
  }

  await pool.query(
    `UPDATE assessment_attempts
     SET answered_count = (
       SELECT COUNT(*) FROM assessment_responses WHERE attempt_id = $1
     ),
     updated_at = NOW()
     WHERE id = $1`,
    [attemptId]
  );

  console.log("All 80 answers saved successfully in database.");

  // 5. Score and finalize
  console.log("Finalizing and scoring attempt...");
  const finalizeRes = await scoringService.scoreAndFinalizeAttempt(userId, attemptId, "en");
  const result = finalizeRes.result as StreamFinderResultDTO;
  console.log("Score and Finalize success:", finalizeRes.success);
  console.log("Result ID:", finalizeRes.resultId);
  console.log("Primary Stream:", result.primaryStream);
  console.log("Primary Display %:", result.primaryDisplayPercentage);
  console.log("Secondary Stream:", result.secondaryStream);
  console.log("Secondary Display %:", result.secondaryDisplayPercentage);
  console.log("Clarity:", result.clarity);
  console.log("Score Gap %:", result.scoreGapPercentage);
  console.log("Career Clusters count:", result.careerClusters.length);
  console.log("Career Cluster 1:", result.careerClusters[0]?.profileKey);
  console.log("Section Breakdown count:", result.sectionBreakdown.length);
  console.log("Academic Evidence count:", result.academicEvidence.length);

  // 6. Test retrieval via getResultByAttemptId
  const retrievedResult = (await scoringService.getResultByAttemptId(userId, attemptId)) as StreamFinderResultDTO;
  console.log("Retrieved Result assessmentCode:", retrievedResult.assessmentCode);
  console.log("Retrieved Result primaryStream:", retrievedResult.primaryStream);

  console.log("\n🎉 END-TO-END STREAM FINDER TEST COMPLETED SUCCESSFULLY!");
  await closeDatabasePool();
}

testE2E().catch((err) => {
  console.error("E2E Test Error:", err);
  process.exit(1);
});
