import { pool } from "../src/config/database";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { engineeringBranchFinderTranslationsService } from "../src/modules/assessments/services/engineering-branch-finder-translations.service";
import { engineeringBranchFinderQuestionSelectionService } from "../src/modules/assessments/services/engineering-branch-finder-question-selection.service";
import { scoringService } from "../src/modules/scoring/scoring.service";

async function runEngineeringBranchFinderI18nTests() {
  console.log("=========================================================");
  console.log("🚀 STARTING ENGINEERING BRANCH FINDER 45-QUESTION E2E SUITE");
  console.log("=========================================================\n");

  // 1. Ensure Translations & Versions are seeded
  await engineeringBranchFinderQuestionSelectionService.seedEngineeringBranchFinderVersions();
  await engineeringBranchFinderTranslationsService.seedEngineeringBranchFinderTranslations();

  // 2. Verify Master Item Bank in DB (Must remain 80 questions)
  const assessRes = await pool.query(
    `SELECT id, question_count FROM assessments WHERE code = 'ENGINEERING_BRANCH_FINDER' LIMIT 1`
  );
  if (!assessRes.rows[0]) {
    throw new Error("ENGINEERING_BRANCH_FINDER assessment not found in database");
  }
  const assessmentId = assessRes.rows[0].id;

  const totalBankQuestions = await pool.query(
    `SELECT COUNT(*) as count FROM assessment_questions WHERE assessment_id = $1`,
    [assessmentId]
  );
  const bankCount = parseInt(totalBankQuestions.rows[0]?.count, 10);
  console.log(`[TEST 0] Master Item Bank Count in DB: ${bankCount} questions`);
  if (bankCount !== 80) {
    throw new Error(`Master Item Bank must retain exactly 80 questions, found ${bankCount}`);
  }
  console.log("✅ TEST 0 PASSED: Master Item Bank retains all 80 questions in DB.\n");

  // 3. Verify Version Definition for Standard 45 Form
  const versionRes = await pool.query(
    `SELECT id, version_code, question_count FROM assessment_versions WHERE assessment_id = $1 AND version_code = 'ENGINEERING_BRANCH_FINDER_V2' LIMIT 1`,
    [assessmentId]
  );
  const versionId = versionRes.rows[0]?.id;
  const versionQCount = versionRes.rows[0]?.question_count;
  console.log(`[TEST 0.1] Standard Version (${versionRes.rows[0]?.version_code}) question_count: ${versionQCount}`);
  if (versionQCount !== 45) {
    throw new Error(`Expected version question_count to be 45, got ${versionQCount}`);
  }

  const linkedQRes = await pool.query(
    `SELECT COUNT(*) as count FROM assessment_version_questions WHERE version_id = $1`,
    [versionId]
  );
  const linkedCount = parseInt(linkedQRes.rows[0]?.count, 10);
  console.log(`[TEST 0.2] Linked Questions in assessment_version_questions: ${linkedCount}`);
  if (linkedCount !== 45) {
    throw new Error(`Expected exactly 45 linked version questions, found ${linkedCount}`);
  }
  console.log("✅ TEST 0.2 PASSED: Exactly 45 questions linked to standard student version.\n");

  // 4. Create test user
  const userRes = await pool.query(`SELECT id FROM users LIMIT 1`);
  let userId = userRes.rows[0]?.id;
  if (!userId) {
    const newUser = await pool.query(
      `INSERT INTO users (email, first_name, last_name, role, password_hash)
       VALUES ('student.test.eng@melife.com', 'Test', 'Student', 'PARTICIPANT', 'hash123')
       RETURNING id`
    );
    userId = newUser.rows[0].id;
  }

  // 5. Create fresh attempt for Standard 45 Form
  const attemptRes = await pool.query(
    `INSERT INTO assessment_attempts (participant_id, assessment_id, version_id, status, total_questions, answered_count, started_at)
     VALUES ($1, $2, $3, 'IN_PROGRESS', 45, 0, NOW())
     RETURNING id, started_at`,
    [userId, assessmentId, versionId]
  );
  const attemptId = attemptRes.rows[0].id;
  console.log(`✅ Created test attempt: ${attemptId}`);

  // TEST 1: Load English Questions (Must return 45 questions)
  const enData = await assessmentContentRepository.getAttemptQuestionsWithResponses(attemptId, "en");
  if (!enData || enData.questions.length !== 45) {
    throw new Error(`Expected 45 English questions for student attempt, got ${enData?.questions?.length}`);
  }
  const enQ1 = enData.questions.find((q) => q.questionNumber === 1);
  const enQ45 = enData.questions.find((q) => q.questionNumber === 45);
  console.log(`[TEST 1] English Q1: "${enQ1?.questionText}"`);
  console.log(`[TEST 1] English Q45: "${enQ45?.questionText}" (Type: ${enQ45?.questionType})`);
  if (!enQ1?.questionText.includes("software, algorithms, or digital systems")) {
    throw new Error(`English Q1 text mismatch: ${enQ1?.questionText}`);
  }
  if (!enQ1?.originalQuestionText || !enQ1.originalQuestionText.includes("software")) {
    throw new Error(`English Q1 originalQuestionText missing or incorrect`);
  }
  console.log("✅ TEST 1 PASSED: 45 English questions loaded with valid text & bilingual references.\n");

  // TEST 2: Load Malayalam Questions (ml)
  const mlData = await assessmentContentRepository.getAttemptQuestionsWithResponses(attemptId, "ml");
  if (!mlData || mlData.questions.length !== 45) {
    throw new Error(`Expected 45 Malayalam questions, got ${mlData?.questions?.length}`);
  }
  const mlQ1 = mlData.questions.find((q) => q.questionNumber === 1);
  console.log(`[TEST 2] Malayalam Q1: "${mlQ1?.questionText}"`);
  if (!mlQ1?.questionText.includes("സോഫ്റ്റ്‌വെയറുകൾ") && !mlQ1?.questionText.includes("പ്രശ്നങ്ങൾ")) {
    throw new Error(`Malayalam Q1 text was not translated: ${mlQ1?.questionText}`);
  }
  if (!mlQ1?.originalQuestionText || !mlQ1.originalQuestionText.includes("software")) {
    throw new Error(`Bilingual English reference was not preserved for Malayalam Q1`);
  }
  if (mlQ1.options[0].optionText !== "എന്നെപ്പോലെയല്ല") {
    throw new Error(`Malayalam Option 1 translation mismatch: ${mlQ1.options[0].optionText}`);
  }
  console.log("✅ TEST 2 PASSED: 45 Malayalam question translations & options verified\n");

  // TEST 3: Load Hindi Questions (hi)
  const hiData = await assessmentContentRepository.getAttemptQuestionsWithResponses(attemptId, "hi");
  const hiQ1 = hiData?.questions.find((q) => q.questionNumber === 1);
  console.log(`[TEST 3] Hindi Q1: "${hiQ1?.questionText}"`);
  if (!hiQ1?.questionText.includes("सॉफ्टवेयर")) {
    throw new Error(`Hindi Q1 text was not translated: ${hiQ1?.questionText}`);
  }
  console.log("✅ TEST 3 PASSED: Hindi question translations verified\n");

  // TEST 4: Load Tamil Questions (ta)
  const taData = await assessmentContentRepository.getAttemptQuestionsWithResponses(attemptId, "ta");
  const taQ1 = taData?.questions.find((q) => q.questionNumber === 1);
  console.log(`[TEST 4] Tamil Q1: "${taQ1?.questionText}"`);
  if (!taQ1?.questionText.includes("மென்பொருள்")) {
    throw new Error(`Tamil Q1 text was not translated: ${taQ1?.questionText}`);
  }
  console.log("✅ TEST 4 PASSED: Tamil question translations verified\n");

  // TEST 5: Load Kannada Questions (kn)
  const knData = await assessmentContentRepository.getAttemptQuestionsWithResponses(attemptId, "kn");
  const knQ1 = knData?.questions.find((q) => q.questionNumber === 1);
  console.log(`[TEST 5] Kannada Q1: "${knQ1?.questionText}"`);
  if (!knQ1?.questionText.includes("ಸಾಫ್ಟ್‌ವೇರ್")) {
    throw new Error(`Kannada Q1 text was not translated: ${knQ1?.questionText}`);
  }
  console.log("✅ TEST 5 PASSED: Kannada question translations verified\n");

  // TEST 6: Load Arabic Questions (ar)
  const arData = await assessmentContentRepository.getAttemptQuestionsWithResponses(attemptId, "ar");
  const arQ1 = arData?.questions.find((q) => q.questionNumber === 1);
  console.log(`[TEST 6] Arabic Q1: "${arQ1?.questionText}"`);
  if (!arQ1?.questionText.includes("البرمجيات")) {
    throw new Error(`Arabic Q1 text was not translated: ${arQ1?.questionText}`);
  }
  console.log("✅ TEST 6 PASSED: Arabic question translations verified\n");

  // TEST 7: Answer all 45 questions & Score Attempt
  console.log("[TEST 7] Saving synthetic student responses for all 45 administered questions...");
  const responseBatch = enData.questions.map((q) => {
    const chosenOption = q.questionType === "likert_1_4" ? q.options[3] : q.options[0]; // Rating 4 or Option A (CSE)
    return {
      question_id: q.id,
      selected_option_id: chosenOption.id,
      response_value: chosenOption.optionKey,
    };
  });

  await pool.query(
    `INSERT INTO assessment_responses (attempt_id, question_id, selected_option_id, response_value, score, updated_at)
     SELECT $1, t.question_id, t.selected_option_id, t.response_value, 0, NOW()
     FROM json_to_recordset($2) AS t(question_id uuid, selected_option_id uuid, response_value text)
     ON CONFLICT (attempt_id, question_id) DO UPDATE SET
       selected_option_id = EXCLUDED.selected_option_id,
       response_value = EXCLUDED.response_value,
       updated_at = NOW()`,
    [attemptId, JSON.stringify(responseBatch)]
  );

  // Update attempt to answered_count = 45
  await pool.query(
    `UPDATE assessment_attempts SET answered_count = 45 WHERE id = $1`,
    [attemptId]
  );

  const scoringResult = await scoringService.scoreAndFinalizeAttempt(userId, attemptId, "en");
  console.log("[TEST 7] Scoring Result Generated:");
  console.log(` - Assessment Name: ${scoringResult.result.assessmentName}`);
  console.log(` - Total Questions: ${scoringResult.result.totalQuestions}`);
  console.log(` - Completed Questions: ${scoringResult.result.completedQuestions}`);
  console.log(` - Primary Branch: ${(scoringResult.result as any).primaryBranch.branchName} (${(scoringResult.result as any).primaryBranch.displayPercentage}%)`);

  if (scoringResult.result.totalQuestions !== 45) {
    throw new Error(`Expected result totalQuestions to be 45, got ${scoringResult.result.totalQuestions}`);
  }
  if (scoringResult.result.completedQuestions !== 45) {
    throw new Error(`Expected result completedQuestions to be 45, got ${scoringResult.result.completedQuestions}`);
  }
  if (!(scoringResult.result as any).primaryBranch) {
    throw new Error("Missing primaryBranch in scoring output");
  }

  console.log("✅ TEST 7 PASSED: 45-question assessment answered, finalized, and scored successfully!\n");

  // Cleanup test attempt
  await pool.query(`DELETE FROM assessment_responses WHERE attempt_id = $1`, [attemptId]);
  await pool.query(`DELETE FROM assessment_results WHERE attempt_id = $1`, [attemptId]);
  await pool.query(`DELETE FROM assessment_attempts WHERE id = $1`, [attemptId]);

  console.log("=========================================================");
  console.log("🎉 ALL ENGINEERING BRANCH FINDER 45-Q TESTS PASSED (8/8)");
  console.log("=========================================================\n");
}

runEngineeringBranchFinderI18nTests()
  .then(() => {
    pool.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Test failed:", err);
    pool.end();
    process.exit(1);
  });
