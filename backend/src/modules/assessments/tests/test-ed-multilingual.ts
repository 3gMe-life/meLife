import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../../../../backend/.env") });
dotenv.config({ path: path.resolve(process.cwd(), "backend/.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { pool } from "../../../config/database";
import { assessmentContentRepository } from "../assessment-content.repository";
import { entrepreneurDevelopmentQuestionSelectionService } from "../services/entrepreneur-development-question-selection.service";
import { entrepreneurDevelopmentTranslationsService } from "../services/entrepreneur-development-translations.service";
import { assessmentRunnerService } from "../assessment-runner.service";
import { streamFinderTranslationsService } from "../services/stream-finder-translations.service";
import { skillFinderTranslationsService } from "../services/skill-finder-translations.service";

async function runMultilingualTests() {
  console.log("================================================================================");
  console.log("🚀 STARTING ENTREPRENEUR DEVELOPMENT TEST MULTILINGUAL VERIFICATION TEST SUITE");
  console.log("================================================================================");

  try {
    // 1. Run schema and seedings
    console.log("\n[1] Running Assessment & Translation Seeds...");
    await assessmentContentRepository.initSchema();
    await assessmentContentRepository.seedEntrepreneurDevelopmentContent();
    await entrepreneurDevelopmentQuestionSelectionService.seedEntrepreneurDevelopmentVersions();
    await entrepreneurDevelopmentTranslationsService.seedEntrepreneurDevelopmentTranslations();

    // 2. Ensure a test participant user exists
    const userRes = await pool.query(
      `SELECT u.id, u.email, u.first_name, u.last_name 
       FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       WHERE r.name = 'PARTICIPANT' LIMIT 1`
    );
    let testUserId = userRes.rows[0]?.id;
    if (!testUserId) {
      const anyUser = await pool.query(`SELECT id FROM users LIMIT 1`);
      testUserId = anyUser.rows[0]?.id;
    }
    console.log(`✓ Test user verified: ${testUserId}`);

    // Clean up any existing active attempts for clean test run
    await pool.query(
      `DELETE FROM assessment_attempts WHERE participant_id = $1 AND assessment_id IN (
         SELECT id FROM assessments WHERE code = 'ENTREPRENEUR_DEVELOPMENT_TEST'
       )`,
      [testUserId]
    );

    // 3. Start or resume attempt for ENTREPRENEUR_DEVELOPMENT_TEST
    console.log("\n[2] Starting / Resuming ED Test Attempt...");
    const startData = await assessmentRunnerService.startOrCreateAttempt(testUserId, "ENTREPRENEUR_DEVELOPMENT_TEST");
    const attemptId = startData.attemptId;
    console.log(`✓ Attempt initialized: ${attemptId} (status: ${startData.status})`);

    // 4. Fetch English Questions
    console.log("\n[3] Fetching Questions in English ('en')...");
    const enData = await assessmentRunnerService.getAttemptQuestions(testUserId, attemptId, "en");
    console.log(`✓ Total questions returned: ${enData.questions.length}`);
    console.log(`✓ Total sections: ${enData.sections.length}`);
    console.log(`  - Section 1 Name: "${enData.sections[0].name}"`);
    console.log(`  - Section 2 Name: "${enData.sections[1].name}"`);
    console.log(`  - Q1 English Text: "${enData.questions[0].questionText}"`);
    console.log(`  - Q1 Dimension: "${enData.questions[0].dimensionName}"`);
    console.log(`  - Q1 Options count: ${enData.questions[0].options.length}`);
    console.log(`  - Q1 Option 1: "${enData.questions[0].options[0].optionText}" (key: ${enData.questions[0].options[0].optionKey})`);
    console.log(`  - Q51 English Text: "${enData.questions[50].questionText.substring(0, 60)}..."`);
    console.log(`  - Q51 Option A: "${enData.questions[50].options[0].optionText.substring(0, 50)}..."`);

    if (!enData.questions[0].questionText.includes("starting my own business")) {
      throw new Error(`Q1 English text mismatch! Got: ${enData.questions[0].questionText}`);
    }

    // 5. Fetch Hindi Questions
    console.log("\n[4] Fetching Questions in Hindi ('hi')...");
    const hiData = await assessmentRunnerService.getAttemptQuestions(testUserId, attemptId, "hi");
    console.log(`✓ Total Hindi questions returned: ${hiData.questions.length}`);
    console.log(`✓ Total Hindi sections: ${hiData.sections.length}`);
    console.log(`  - Section 1 Hindi: "${hiData.sections[0].name}"`);
    console.log(`  - Section 2 Hindi: "${hiData.sections[1].name}"`);
    console.log(`  - Q1 Hindi Text: "${hiData.questions[0].questionText}"`);
    console.log(`  - Q1 Hindi Dimension: "${hiData.questions[0].dimensionName}"`);
    console.log(`  - Q1 Original Reference: "${hiData.questions[0].originalQuestionText}"`);
    console.log(`  - Q1 Option 1 (Hindi): "${hiData.questions[0].options[0].optionText}" (Original: "${hiData.questions[0].options[0].originalOptionText}")`);
    console.log(`  - Q1 Option 5 (Hindi): "${hiData.questions[0].options[4].optionText}"`);
    console.log(`  - Q51 Hindi Scenario: "${hiData.questions[50].questionText.substring(0, 60)}..."`);
    console.log(`  - Q51 Option A (Hindi): "${hiData.questions[50].options[0].optionText.substring(0, 50)}..."`);

    // Verify all 60 questions in Hindi
    let translatedCount = 0;
    for (let i = 0; i < 60; i++) {
      const q = hiData.questions[i];
      if (q.questionText && q.questionText !== enData.questions[i].questionText) {
        translatedCount++;
      }
    }
    console.log(`\n✓ Hindi Question Translation Coverage: ${translatedCount} / 60 questions`);
    if (translatedCount !== 60) {
      throw new Error(`Expected all 60 questions to be translated in Hindi! Only got ${translatedCount}`);
    }

    // 6. Verify ID Stability and Option Equivalence
    console.log("\n[5] Verifying ID Stability and Scoring Equivalence between EN and HI...");
    for (let i = 0; i < 60; i++) {
      const enQ = enData.questions[i];
      const hiQ = hiData.questions[i];

      if (enQ.id !== hiQ.id) {
        throw new Error(`Question ID mismatch at question ${i + 1}: ${enQ.id} vs ${hiQ.id}`);
      }
      if (enQ.options.length !== hiQ.options.length) {
        throw new Error(`Options count mismatch at question ${i + 1}`);
      }
      for (let j = 0; j < enQ.options.length; j++) {
        const enOpt = enQ.options[j];
        const hiOpt = hiQ.options[j];
        if (enOpt.id !== hiOpt.id) {
          throw new Error(`Option ID mismatch at Q${i + 1} Opt${j + 1}`);
        }
        if (enOpt.optionKey !== hiOpt.optionKey) {
          throw new Error(`Option Key mismatch at Q${i + 1} Opt${j + 1}`);
        }
      }
    }
    console.log("✓ 100% of Question IDs and Option IDs are IDENTICAL between English and Hindi.");

    // 7. Test saving a response in Hindi
    console.log("\n[6] Testing Response Submission in Hindi...");
    const q1 = hiData.questions[0];
    const opt5 = q1.options[4]; // Strongly Agree (5)
    await assessmentRunnerService.saveResponse(testUserId, attemptId, {
      questionId: q1.id,
      selectedOptionId: opt5.id,
      responseValue: opt5.optionKey,
    });
    console.log(`✓ Saved response for Q1 in Hindi (optionKey: "${opt5.optionKey}", optionId: ${opt5.id})`);

    // Verify response persistence when reading in English
    const enDataAfterSave = await assessmentRunnerService.getAttemptQuestions(testUserId, attemptId, "en");
    const q1AfterSave = enDataAfterSave.questions[0];
    console.log(`✓ Q1 response when fetched in English:`, q1AfterSave.currentResponse);
    if (q1AfterSave.currentResponse?.selectedOptionId !== opt5.id || q1AfterSave.currentResponse?.responseValue !== "5") {
      throw new Error(`Response was not preserved across language switch!`);
    }
    console.log("✓ Response is 100% preserved when switching language from Hindi -> English!");

    // 8. Regression Test: Verify Stream Finder & Skill Finder Translations
    console.log("\n[7] Regression Testing: Checking other assessments (Stream Finder & Skill Finder)...");
    await streamFinderTranslationsService.seedStreamFinderTranslations();
    await skillFinderTranslationsService.seedSkillFinderTranslations();
    console.log("✓ Stream Finder & Skill Finder translation seedings executed without regression.");

    console.log("\n================================================================================");
    console.log("🎉 ALL MULTILINGUAL VERIFICATION TESTS PASSED SUCCESSFULLY WITH ZERO ERRORS!");
    console.log("================================================================================");

    process.exit(0);
  } catch (err) {
    console.error("❌ Multilingual verification test failed:", err);
    process.exit(1);
  }
}

runMultilingualTests();
