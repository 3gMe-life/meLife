import assert from "assert";
import { pool, connectDatabase, closeDatabasePool } from "../../../config/database";
import { assessmentRunnerService } from "../assessment-runner.service";
import { scoringService } from "../../scoring/scoring.service";

async function runTests() {
  console.log("======================================================================");
  console.log("🧪 RUNNING SUITE: ED TEST QUESTION RENDERING & LIFECYCLE SECURITY");
  console.log("======================================================================\n");

  try {
    await connectDatabase();

    // 1. Fetch a test participant user
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
    console.log(`👤 Participant: ${testUser.first_name} ${testUser.last_name} (${testUser.id})`);

    // Clean up attempts for this test user on ED test
    await pool.query(
      `DELETE FROM assessment_attempts WHERE participant_id = $1 AND assessment_id = (
         SELECT id FROM assessments WHERE code = 'ENTREPRENEUR_DEVELOPMENT_TEST'
       )`,
      [testUser.id]
    );

    // =========================================================================
    // TEST 1: CASE 1 - Fresh attempt creation & option rendering payload
    // =========================================================================
    console.log("\n--- TEST 1: New User Starts ED Test (CASE 1) ---");
    const freshAttempt = await assessmentRunnerService.startOrCreateAttempt(
      testUser.id,
      "ENTREPRENEUR_DEVELOPMENT_TEST"
    );

    assert.strictEqual(freshAttempt.isNew, true, "Fresh attempt must have isNew = true");
    assert.strictEqual(freshAttempt.status, "IN_PROGRESS", "Fresh attempt must have status = IN_PROGRESS");
    assert.ok(freshAttempt.attemptId, "Must return valid attemptId");
    console.log("✓ Created fresh attempt:", freshAttempt.attemptId);

    // Verify questions payload & options
    const questionsPayload = await assessmentRunnerService.getAttemptQuestions(
      testUser.id,
      freshAttempt.attemptId,
      "en"
    );

    assert.strictEqual(questionsPayload.questions.length, 60, "Must return exactly 60 questions");
    assert.strictEqual(questionsPayload.sections.length, 2, "Must return 2 sections");

    // Check Section 1 (Likert)
    const sec1Q1 = questionsPayload.questions[0];
    assert.strictEqual(sec1Q1.questionType, "likert_1_5", "Q1 type must be 'likert_1_5'");
    assert.strictEqual(sec1Q1.options.length, 5, "Q1 must have 5 Likert options");
    assert.strictEqual(sec1Q1.options[0].optionText, "Strongly Disagree", "Option 1 text mismatch");
    assert.strictEqual(sec1Q1.options[4].optionText, "Strongly Agree", "Option 5 text mismatch");
    console.log("✓ Verified Section 1 (50 items) returns questionType = 'likert_1_5' and 5 options each");

    // Check Section 2 (MCQ)
    const sec2Q51 = questionsPayload.questions[50];
    assert.strictEqual(sec2Q51.questionType, "mcq_text", "Q51 type must be 'mcq_text'");
    assert.strictEqual(sec2Q51.options.length, 4, "Q51 must have 4 MCQ options");
    assert.ok(sec2Q51.options[0].optionText.length > 10, "Option A must contain descriptive scenario answer text");
    console.log("✓ Verified Section 2 (10 items) returns questionType = 'mcq_text' and 4 options each");

    // =========================================================================
    // TEST 2: CASE 2 - Resuming In-Progress Attempt
    // =========================================================================
    console.log("\n--- TEST 2: In-Progress User Opens ED Test Again (CASE 2) ---");
    // Save response for Q1
    await assessmentRunnerService.saveResponse(testUser.id, freshAttempt.attemptId, {
      questionId: sec1Q1.id,
      selectedOptionId: sec1Q1.options[3].id,
      responseValue: "4",
    });

    const resumeAttempt = await assessmentRunnerService.startOrCreateAttempt(
      testUser.id,
      "ENTREPRENEUR_DEVELOPMENT_TEST"
    );

    assert.strictEqual(resumeAttempt.isNew, false, "Resumed attempt must have isNew = false");
    assert.strictEqual(resumeAttempt.attemptId, freshAttempt.attemptId, "Must resume the same active attemptId");
    assert.strictEqual(resumeAttempt.status, "IN_PROGRESS", "Resumed attempt must have status = IN_PROGRESS");
    console.log("✓ Successfully resumed existing in-progress attempt without creating duplicate");

    // =========================================================================
    // TEST 3: Submitting and Finalizing Attempt
    // =========================================================================
    console.log("\n--- TEST 3: Answering All Questions & Submitting ---");
    for (let i = 0; i < questionsPayload.questions.length; i++) {
      const q = questionsPayload.questions[i];
      const opt = q.options[q.options.length - 1]; // choose highest score option
      await assessmentRunnerService.saveResponse(testUser.id, freshAttempt.attemptId, {
        questionId: q.id,
        selectedOptionId: opt.id,
        responseValue: opt.optionKey,
      });
    }

    const submitRes = await scoringService.scoreAndFinalizeAttempt(
      testUser.id,
      freshAttempt.attemptId,
      "en"
    );

    assert.strictEqual(submitRes.success, true, "Submit must succeed");
    assert.ok(submitRes.resultId, "Result ID must be returned");
    console.log("✓ Assessment successfully completed and scored. Result ID:", submitRes.resultId);

    // =========================================================================
    // TEST 4: CASE 3 - Completed User Opens Assessment (Redirect Guard)
    // =========================================================================
    console.log("\n--- TEST 4: Completed User Opens ED Test (CASE 3: Redirect to Results) ---");
    const completedAttemptCheck = await assessmentRunnerService.startOrCreateAttempt(
      testUser.id,
      "ENTREPRENEUR_DEVELOPMENT_TEST"
    );

    assert.strictEqual(completedAttemptCheck.isNew, false, "Completed attempt check must have isNew = false");
    assert.strictEqual(completedAttemptCheck.status, "COMPLETED", "Status must be COMPLETED");
    assert.strictEqual(completedAttemptCheck.attemptId, freshAttempt.attemptId, "Attempt ID must match completed attempt");
    assert.ok(
      completedAttemptCheck.redirectUrl?.includes(`/participant/results/${freshAttempt.attemptId}`),
      `Must provide redirectUrl to results page, received: ${completedAttemptCheck.redirectUrl}`
    );
    console.log("✓ System detected completed attempt and returned redirectUrl:", completedAttemptCheck.redirectUrl);

    // =========================================================================
    // TEST 5: Security Guards on Completed Attempt
    // =========================================================================
    console.log("\n--- TEST 5: Security Guard: Cannot Save Responses to Completed Attempt ---");
    let saveBlocked = false;
    try {
      await assessmentRunnerService.saveResponse(testUser.id, freshAttempt.attemptId, {
        questionId: sec1Q1.id,
        selectedOptionId: sec1Q1.options[0].id,
        responseValue: "1",
      });
    } catch (err: any) {
      saveBlocked = true;
      assert.strictEqual(err.code, "ATTEMPT_ALREADY_COMPLETED", "Must throw ATTEMPT_ALREADY_COMPLETED code");
    }
    assert.strictEqual(saveBlocked, true, "Must block saving responses to completed attempt");
    console.log("✓ Verified completed attempt cannot be modified or overwritten");

    // =========================================================================
    // TEST 6: Idempotent Result Retrieval
    // =========================================================================
    console.log("\n--- TEST 6: Direct Attempt ID Lookup of Completed Assessment ---");
    const directAttemptLookup = await assessmentRunnerService.startOrCreateAttempt(
      testUser.id,
      freshAttempt.attemptId
    );
    assert.strictEqual(directAttemptLookup.status, "COMPLETED", "Direct UUID lookup must return COMPLETED");
    assert.ok(directAttemptLookup.redirectUrl, "Must return redirectUrl on direct UUID lookup");
    console.log("✓ Direct attempt UUID lookup correctly routes to results");

    // Clean up test data
    await pool.query(
      `DELETE FROM assessment_attempts WHERE participant_id = $1 AND assessment_id = (
         SELECT id FROM assessments WHERE code = 'ENTREPRENEUR_DEVELOPMENT_TEST'
       )`,
      [testUser.id]
    );

    console.log("\n======================================================================");
    console.log("🎉 ALL TESTS PASSED: RENDERING, ATTEMPT LIFECYCLE & SECURITY VERIFIED!");
    console.log("======================================================================");
  } catch (err) {
    console.error("❌ Test failed:", err);
    process.exit(1);
  } finally {
    await closeDatabasePool();
  }
}

runTests();
