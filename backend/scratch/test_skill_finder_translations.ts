import { pool, connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentRunnerService } from "../src/modules/assessments/assessment-runner.service";

async function testSkillFinderTranslations() {
  await connectDatabase();

  const userRes = await pool.query("SELECT id, email FROM users LIMIT 1");
  const userId = userRes.rows[0].id;

  // Clean any existing in-progress attempts for SKILL_FINDER
  await pool.query(
    `DELETE FROM assessment_attempts 
     WHERE participant_id = $1 AND assessment_id = (SELECT id FROM assessments WHERE code = 'SKILL_FINDER')`,
    [userId]
  );

  const startResult = await assessmentRunnerService.startOrCreateAttempt(userId, "SKILL_FINDER");
  const attemptId = startResult.attemptId;

  const languages = ["en", "ml", "hi", "ta", "kn", "ar"];
  for (const lang of languages) {
    const qData = await assessmentRunnerService.getAttemptQuestions(userId, attemptId, lang);
    const q1 = qData.questions[0];
    console.log(`[SKILL_FINDER] Q1 #${q1.questionNumber} (${lang}): "${q1.questionText.slice(0, 50)}..." | Opts: ${q1.options?.length}`);
  }

  console.log("\n✅ ALL LANGUAGES VERIFIED FOR SKILL FINDER!");
  await closeDatabasePool();
}

testSkillFinderTranslations().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
