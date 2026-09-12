import { pool } from "../src/config/database";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { engineeringBranchFinderTranslationsService } from "../src/modules/assessments/services/engineering-branch-finder-translations.service";
import { engineeringBranchFinderQuestionSelectionService } from "../src/modules/assessments/services/engineering-branch-finder-question-selection.service";

async function runEngineeringBranchFinderI18nTests() {
  console.log("=========================================================");
  console.log("🚀 STARTING ENGINEERING BRANCH FINDER MULTILINGUAL E2E");
  console.log("=========================================================\n");

  // 1. Ensure Translations & Versions are seeded
  await engineeringBranchFinderQuestionSelectionService.seedEngineeringBranchFinderVersions();
  await engineeringBranchFinderTranslationsService.seedEngineeringBranchFinderTranslations();

  // 2. Fetch Assessment ID & Version ID
  const assessRes = await pool.query(
    `SELECT id FROM assessments WHERE code = 'ENGINEERING_BRANCH_FINDER' LIMIT 1`
  );
  if (!assessRes.rows[0]) {
    throw new Error("ENGINEERING_BRANCH_FINDER assessment not found in database");
  }
  const assessmentId = assessRes.rows[0].id;

  const versionRes = await pool.query(
    `SELECT id FROM assessment_versions WHERE assessment_id = $1 AND version_code = 'ENGINEERING_BRANCH_FINDER_V2' LIMIT 1`,
    [assessmentId]
  );
  const versionId = versionRes.rows[0]?.id || null;

  // 3. Create or find test user
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

  // 4. Create fresh attempt
  const attemptRes = await pool.query(
    `INSERT INTO assessment_attempts (participant_id, assessment_id, version_id, status, total_questions, answered_count, started_at)
     VALUES ($1, $2, $3, 'IN_PROGRESS', 80, 0, NOW())
     RETURNING id, started_at`,
    [userId, assessmentId, versionId]
  );
  const attemptId = attemptRes.rows[0].id;
  console.log(`✅ Created test attempt: ${attemptId}`);

  // TEST 1: Load English Questions
  const enData = await assessmentContentRepository.getAttemptQuestionsWithResponses(attemptId, "en");
  if (!enData || enData.questions.length !== 80) {
    throw new Error(`Expected 80 English questions, got ${enData?.questions?.length}`);
  }
  const enQ1 = enData.questions.find((q) => q.questionNumber === 1);
  console.log(`[TEST 1] English Q1: "${enQ1?.questionText}"`);
  if (!enQ1?.questionText.includes("software, algorithms, or digital systems")) {
    throw new Error(`English Q1 text mismatch: ${enQ1?.questionText}`);
  }
  if (!enQ1?.originalQuestionText || !enQ1.originalQuestionText.includes("software")) {
    throw new Error(`English Q1 originalQuestionText missing or incorrect`);
  }
  console.log("✅ TEST 1 PASSED: English questions and originalQuestionText verified\n");

  // TEST 2: Load Malayalam Questions (ml)
  const mlData = await assessmentContentRepository.getAttemptQuestionsWithResponses(attemptId, "ml");
  if (!mlData || mlData.questions.length !== 80) {
    throw new Error(`Expected 80 Malayalam questions, got ${mlData?.questions?.length}`);
  }
  const mlQ1 = mlData.questions.find((q) => q.questionNumber === 1);
  console.log(`[TEST 2] Malayalam Q1: "${mlQ1?.questionText}"`);
  console.log(`[TEST 2] Malayalam Q1 Original: "${mlQ1?.originalQuestionText}"`);
  
  if (!mlQ1?.questionText.includes("സോഫ്റ്റ്‌വെയറുകൾ") && !mlQ1?.questionText.includes("പ്രശ്നങ്ങൾ")) {
    throw new Error(`Malayalam Q1 text was not translated: ${mlQ1?.questionText}`);
  }
  if (!mlQ1?.originalQuestionText || !mlQ1.originalQuestionText.includes("software")) {
    throw new Error(`Bilingual English reference was not preserved for Malayalam Q1`);
  }
  if (mlQ1.options[0].optionText !== "എന്നെപ്പോലെയല്ല") {
    throw new Error(`Malayalam Option 1 translation mismatch: ${mlQ1.options[0].optionText}`);
  }
  console.log("✅ TEST 2 PASSED: Malayalam question translations, options & bilingual English reference verified\n");

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

  // Cleanup test attempt
  await pool.query(`DELETE FROM assessment_attempts WHERE id = $1`, [attemptId]);

  console.log("=========================================================");
  console.log("🎉 ALL ENGINEERING BRANCH FINDER I18N TESTS PASSED (6/6)");
  console.log("=========================================================\n");
}

runEngineeringBranchFinderI18nTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Test failed:", err);
    process.exit(1);
  });
