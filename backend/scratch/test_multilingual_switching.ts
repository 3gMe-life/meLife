import { pool, connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentRunnerService } from "../src/modules/assessments/assessment-runner.service";

async function testMultilingualSwitching() {
  await connectDatabase();

  const userRes = await pool.query("SELECT id, email FROM users LIMIT 1");
  if (!userRes.rows[0]) {
    console.error("No user found");
    await closeDatabasePool();
    return;
  }
  const userId = userRes.rows[0].id;
  console.log("Testing with User:", userId);

  // Ensure participant profile exists for demographic eligibility
  await pool.query(
    `INSERT INTO participant_profiles (user_id, education_stage, grade_level, date_of_birth, is_onboarded)
     VALUES ($1, 'SCHOOL', '10', '2011-04-15', true)
     ON CONFLICT (user_id) DO UPDATE
     SET education_stage = 'SCHOOL', grade_level = '10', date_of_birth = '2011-04-15', is_onboarded = true`,
    [userId]
  );

  // Clean any existing in-progress attempts for STREAM_FINDER
  await pool.query(
    `DELETE FROM assessment_attempts 
     WHERE participant_id = $1 AND assessment_id = (SELECT id FROM assessments WHERE code = 'STREAM_FINDER')`,
    [userId]
  );

  const startResult = await assessmentRunnerService.startOrCreateAttempt(userId, "STREAM_FINDER");
  const attemptId = startResult.attemptId;
  console.log("Started Attempt ID:", attemptId);

  const languages = ["en", "ml", "hi", "ta", "kn", "ar"];

  for (const lang of languages) {
    const qData = await assessmentRunnerService.getAttemptQuestions(userId, attemptId, lang);
    console.log(`\n================== LANGUAGE: [${lang.toUpperCase()}] ==================`);
    console.log(`Loaded ${qData.questions.length} questions, ${qData.sections.length} sections`);

    // Check Section 1
    const s1 = qData.sections[0];
    console.log(`Section 1 Name (${lang}): "${s1.name}"`);

    // Check Question 1 (Likert)
    const q1 = qData.questions[0];
    console.log(`Q1 #${q1.questionNumber} (${lang}): "${q1.questionText}"`);
    console.log(`Q1 Dimension: ${q1.dimensionName}`);
    console.log(`Q1 Options (${lang}):`);
    q1.options?.forEach(opt => {
      console.log(`   [${opt.optionKey}] (${opt.id.slice(0, 8)}...): "${opt.optionText}"`);
    });

    // Check Question 61 (Forced choice)
    const q61 = qData.questions.find(q => q.questionNumber === 61);
    if (q61) {
      console.log(`Q61 #${q61.questionNumber} (${lang}): "${q61.questionText}"`);
      console.log(`Q61 Options (${lang}):`);
      q61.options?.forEach(opt => {
        console.log(`   [${opt.optionKey}] (${opt.id.slice(0, 8)}...): "${opt.optionText}"`);
      });
    }

    // Sanity checks
    if (!q1.questionText || q1.questionText.trim() === "") {
      throw new Error(`Empty question text for Q1 in ${lang}`);
    }
    if (lang !== "en" && q1.questionText === "I enjoy understanding how machines, gadgets, or natural systems work.") {
      throw new Error(`Translation missing for Q1 in ${lang}! Still returned English text.`);
    }
    if (lang !== "en" && q61 && q61.options?.[0].optionText?.includes("Conducting scientific research")) {
      throw new Error(`Translation missing for Q61 Option A in ${lang}! Still returned English text.`);
    }
  }

  console.log("\n✅ ALL LANGUAGES VERIFIED FOR STREAM FINDER (EN, ML, HI, TA, KN, AR)!");
  await closeDatabasePool();
}

testMultilingualSwitching().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
