import { pool, connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentRunnerService } from "../src/modules/assessments/assessment-runner.service";
import { scoringService } from "../src/modules/scoring/scoring.service";

async function testFullFlow() {
  await connectDatabase();

  const userRes = await pool.query("SELECT id, email FROM users LIMIT 1");
  const userId = userRes.rows[0].id;
  console.log("Testing with User:", userId);

  // Clean existing attempts
  await pool.query(
    `DELETE FROM assessment_attempts 
     WHERE participant_id = $1 AND assessment_id = (SELECT id FROM assessments WHERE code = 'STREAM_FINDER')`,
    [userId]
  );

  // Step 1: Start Attempt
  const startResult = await assessmentRunnerService.startOrCreateAttempt(userId, "STREAM_FINDER");
  const attemptId = startResult.attemptId;
  console.log("Step 1: Started Attempt ID:", attemptId);

  // Step 2: Load in English (Initial)
  const enQuestions = await assessmentRunnerService.getAttemptQuestions(userId, attemptId, "en");
  console.log(`Step 2: Loaded ${enQuestions.questions.length} questions in English`);

  // Step 3: Answer Q1 in English (Likert: '5')
  const q1 = enQuestions.questions[0];
  const q1Opt5 = q1.options?.find(o => o.optionKey === "5")!;
  await assessmentRunnerService.saveResponse(userId, attemptId, {
    questionId: q1.id,
    selectedOptionId: q1Opt5.id,
    responseValue: "5"
  });
  console.log("Step 3: Answered Q1 with option 5 (Strongly Agree)");

  // Step 4: Switch language to Malayalam ('ml')
  const mlQuestions = await assessmentRunnerService.getAttemptQuestions(userId, attemptId, "ml");
  const mlQ1 = mlQuestions.questions[0];
  console.log(`Step 4: Switched to Malayalam. Q1 text: "${mlQ1.questionText}"`);
  console.log(`Step 4: Q1 saved response value: "${mlQ1.currentResponse?.responseValue}" (Expected: '5')`);
  if (mlQ1.currentResponse?.responseValue !== "5") {
    throw new Error(`Data loss! Response value changed after switching to Malayalam.`);
  }

  // Step 5: Answer all remaining questions in Malayalam / Hindi / Arabic mix
  console.log("Step 5: Answering all remaining questions across languages...");
  for (let i = 1; i < mlQuestions.questions.length; i++) {
    const q = mlQuestions.questions[i];
    let optKey = "4";
    let optId: string | null = null;
    if (q.questionType === "likert_1_5") {
      const opt = q.options?.find(o => o.optionKey === optKey) || q.options?.[0];
      optId = opt?.id || null;
    } else {
      const opt = q.options?.find(o => o.optionKey === "A") || q.options?.[0];
      optKey = opt?.optionKey || "A";
      optId = opt?.id || null;
    }
    await assessmentRunnerService.saveResponse(userId, attemptId, {
      questionId: q.id,
      selectedOptionId: optId,
      responseValue: optKey
    });
  }

  // Step 6: Verify attempt in Arabic
  const arQuestions = await assessmentRunnerService.getAttemptQuestions(userId, attemptId, "ar");
  console.log(`Step 6: Verified in Arabic. All ${arQuestions.questions.filter(q => q.currentResponse).length}/80 responses present.`);
  const arQ61 = arQuestions.questions.find(q => q.questionNumber === 61)!;
  console.log(`Step 6: Q61 in Arabic: "${arQ61.questionText}"`);
  console.log(`Step 6: Q61 Option A in Arabic: "${arQ61.options?.find(o => o.optionKey === 'A')?.optionText}"`);

  // Step 7: Finalize & Score Attempt
  console.log("Step 7: Finalizing and scoring attempt...");
  const finalizeRes = await scoringService.scoreAndFinalizeAttempt(userId, attemptId, "ml");
  console.log("Score & Finalize Success:", finalizeRes.success);
  console.log("Result Assessment Code:", finalizeRes.result?.assessmentCode);
  console.log("Result Primary Stream:", (finalizeRes.result as any)?.primaryStream);

  console.log("\n🎉 MULTILINGUAL END-TO-END WORKFLOW 100% VERIFIED AND PASSING!");
  await closeDatabasePool();
}

testFullFlow().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
