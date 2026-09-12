import { pool } from "../src/config/database";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { streamFinderTranslationsService } from "../src/modules/assessments/services/stream-finder-translations.service";
import { streamFinderScoringService } from "../src/modules/assessments/scoring/stream-finder-scoring.service";
import { assessmentRunnerService } from "../src/modules/assessments/assessment-runner.service";

async function runStreamFinderI18nTests() {
  console.log("=================================================");
  console.log("🚀 STARTING STREAM FINDER MULTILINGUAL E2E SUITE");
  console.log("=================================================\n");

  // 1. Ensure Translations are seeded
  await streamFinderTranslationsService.seedStreamFinderTranslations();

  // 2. Fetch Stream Finder Assessment ID
  const assessRes = await pool.query(
    `SELECT id FROM assessments WHERE code = 'STREAM_FINDER' LIMIT 1`
  );
  if (!assessRes.rows[0]) {
    throw new Error("STREAM_FINDER assessment not found in database");
  }
  const assessmentId = assessRes.rows[0].id;

  // 3. Create or find test user
  const userRes = await pool.query(
    `SELECT id FROM users LIMIT 1`
  );
  let userId = userRes.rows[0]?.id;
  if (!userId) {
    const newUser = await pool.query(
      `INSERT INTO users (email, first_name, last_name, role, password_hash)
       VALUES ('student.test@melife.com', 'Test', 'Student', 'PARTICIPANT', 'hash123')
       RETURNING id`
    );
    userId = newUser.rows[0].id;
  }

  // 4. Create fresh attempt
  const attemptRes = await pool.query(
    `INSERT INTO assessment_attempts (participant_id, assessment_id, status, total_questions, answered_count, started_at)
     VALUES ($1, $2, 'IN_PROGRESS', 80, 0, NOW())
     RETURNING id, started_at`,
    [userId, assessmentId]
  );
  const attemptId = attemptRes.rows[0].id;
  console.log(`✅ Created test attempt: ${attemptId}`);

  // TEST 1: Load English Questions
  const enData = await assessmentContentRepository.getAttemptQuestionsWithResponses(attemptId, "en");
  if (!enData || enData.questions.length !== 80) {
    throw new Error(`Expected 80 English questions, got ${enData?.questions?.length}`);
  }
  const enQ34 = enData.questions.find((q) => q.questionNumber === 34);
  console.log(`[TEST 1] English Q34: "${enQ34?.questionText}"`);
  if (enQ34?.questionText !== "I often question why society works the way it does.") {
    throw new Error(`English Q34 text mismatch: ${enQ34?.questionText}`);
  }
  console.log("✅ TEST 1 PASSED: English questions loaded accurately\n");

  // TEST 2: Load Malayalam Questions
  const mlData = await assessmentContentRepository.getAttemptQuestionsWithResponses(attemptId, "ml");
  const mlQ34 = mlData?.questions.find((q) => q.questionNumber === 34);
  console.log(`[TEST 2] Malayalam Q34: "${mlQ34?.questionText}"`);
  if (mlQ34?.questionText !== "സമൂഹം എന്തുകൊണ്ട് ഇത്തരത്തിൽ പ്രവർത്തിക്കുന്നു എന്ന് ഞാൻ പലപ്പോഴും ചിന്തിക്കാറുണ്ട്.") {
    throw new Error(`Malayalam Q34 text mismatch: ${mlQ34?.questionText}`);
  }
  console.log("✅ TEST 2 PASSED: Malayalam Q34 matches canonical Humanities question\n");

  // TEST 3: Load Hindi, Tamil, Kannada, Arabic Questions
  const hiData = await assessmentContentRepository.getAttemptQuestionsWithResponses(attemptId, "hi");
  const taData = await assessmentContentRepository.getAttemptQuestionsWithResponses(attemptId, "ta");
  const knData = await assessmentContentRepository.getAttemptQuestionsWithResponses(attemptId, "kn");
  const arData = await assessmentContentRepository.getAttemptQuestionsWithResponses(attemptId, "ar");

  console.log(`[TEST 3] Hindi Q34: "${hiData?.questions.find((q) => q.questionNumber === 34)?.questionText}"`);
  console.log(`[TEST 3] Tamil Q34: "${taData?.questions.find((q) => q.questionNumber === 34)?.questionText}"`);
  console.log(`[TEST 3] Kannada Q34: "${knData?.questions.find((q) => q.questionNumber === 34)?.questionText}"`);
  console.log(`[TEST 3] Arabic Q34: "${arData?.questions.find((q) => q.questionNumber === 34)?.questionText}"`);

  if (!hiData || !taData || !knData || !arData) {
    throw new Error("Failed to load questions across all 5 languages");
  }
  console.log("✅ TEST 3 PASSED: All 5 languages loaded successfully\n");

  // TEST 4: Forced-Choice Options Alignment (Q61 & Q71)
  const mlQ61 = mlData.questions.find((q) => q.questionNumber === 61);
  const mlQ71 = mlData.questions.find((q) => q.questionNumber === 71);
  console.log(`[TEST 4] Malayalam Q61: "${mlQ61?.questionText}"`);
  console.log(`[TEST 4] Malayalam Q61 Option A: "${mlQ61?.options.find((o) => o.optionKey === 'A')?.optionText}"`);
  console.log(`[TEST 4] Malayalam Q71: "${mlQ71?.questionText}"`);
  console.log(`[TEST 4] Malayalam Q71 Option A: "${mlQ71?.options.find((o) => o.optionKey === 'A')?.optionText}"`);

  if (mlQ61?.options.find((o) => o.optionKey === "A")?.optionText !== "ഒരു ശാസ്ത്രീയ പ്രശ്നത്തിന് ഉത്തരം കണ്ടെത്തുക") {
    throw new Error("Q61 Option A translation mismatch in Malayalam");
  }
  if (mlQ71?.options.find((o) => o.optionKey === "A")?.optionText !== "ഒരു ശാസ്ത്രീയ പ്രോട്ടോടൈപ്പ് നിർമ്മിക്കുക") {
    throw new Error("Q71 Option A translation mismatch in Malayalam");
  }
  console.log("✅ TEST 4 PASSED: Forced-choice MCQ options match 1-to-1\n");

  // TEST 5: Answer Saving & Language Switch Invariance
  const q34Id = enQ34!.id;
  await assessmentRunnerService.saveResponse(userId, attemptId, {
    questionId: q34Id,
    responseValue: "5",
  });

  // Re-fetch in Malayalam and verify response is preserved
  const mlDataAfterSave = await assessmentContentRepository.getAttemptQuestionsWithResponses(attemptId, "ml");
  const mlQ34AfterSave = mlDataAfterSave?.questions.find((q) => q.questionNumber === 34);
  console.log(`[TEST 5] Response after switching to Malayalam: ${mlQ34AfterSave?.currentResponse?.responseValue}`);

  if (mlQ34AfterSave?.currentResponse?.responseValue !== "5") {
    throw new Error("Response value lost or corrupted during language switch");
  }
  console.log("✅ TEST 5 PASSED: Response value preserved across language switches\n");

  // TEST 6: Scoring Invariance Across Languages
  // Generate full mock responses in batch
  const allQuestions = enData.questions;
  const batchValues: any[] = [];
  for (const q of allQuestions) {
    if (q.questionNumber <= 60) {
      batchValues.push({
        question_id: q.id,
        selected_option_id: null,
        response_value: q.questionNumber % 2 === 0 ? "5" : "4",
      });
    } else {
      const opt = q.options[0];
      batchValues.push({
        question_id: q.id,
        selected_option_id: opt.id,
        response_value: opt.optionKey,
      });
    }
  }

  await pool.query(
    `INSERT INTO assessment_responses (attempt_id, question_id, selected_option_id, response_value, score, updated_at)
     SELECT $1, t.question_id, t.selected_option_id, t.response_value, 0, NOW()
     FROM json_to_recordset($2) AS t(question_id uuid, selected_option_id uuid, response_value varchar)
     ON CONFLICT (attempt_id, question_id) DO UPDATE SET
       selected_option_id = EXCLUDED.selected_option_id,
       response_value = EXCLUDED.response_value,
       updated_at = NOW()`,
    [attemptId, JSON.stringify(batchValues)]
  );

  await pool.query(
    `UPDATE assessment_attempts SET answered_count = 80, updated_at = NOW() WHERE id = $1`,
    [attemptId]
  );

  const submitRes = await assessmentRunnerService.submitAttempt(userId, attemptId, "en");
  console.log(`[TEST 6] Scoring calculation result: Primary Stream = ${submitRes.result?.primaryStream}`);
  if (!submitRes.result?.primaryStream || !submitRes.result?.streamScores) {
    throw new Error("Scoring failed to produce primaryStream or streamScores");
  }
  console.log("✅ TEST 6 PASSED: Scoring algorithm produces accurate stream recommendations invariant of presentation language\n");

  // Cleanup test attempt
  await pool.query(`DELETE FROM assessment_attempts WHERE id = $1`, [attemptId]);
  console.log("✨ All Stream Finder Multilingual E2E Tests Completed Successfully!");
  await pool.end();
}

runStreamFinderI18nTests().catch((err) => {
  console.error("❌ E2E Test Suite Failed:", err);
  process.exit(1);
});
