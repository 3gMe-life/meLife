import { pool } from "../../../config/database";
import { assessmentEligibilityService } from "../assessment-eligibility.service";
import { assessmentRunnerService } from "../assessment-runner.service";

async function runPersonalizedJourneyValidation() {
  console.log("===============================================================");
  console.log("🧪 RUNNING COMPREHENSIVE ASSESSMENT UNLOCKED ACCESS SUITE");
  console.log("===============================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: any) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      if (detail) console.error("   Details:", detail);
    }
  }

  try {
    // -------------------------------------------------------------
    // SCENARIO 1: Class 10 Student (e.g. shanib)
    // -------------------------------------------------------------
    console.log("--- Scenario 1: Class 10 Student (All Assessments Unlocked) ---");

    const emailG10 = `test_g10_${Date.now()}@example.com`;
    const userG10Res = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, 'hash', 'Class10', 'Student', 'ACTIVE', NOW())
       RETURNING id`,
      [emailG10]
    );
    const userIdG10 = userG10Res.rows[0].id;

    await pool.query(
      `INSERT INTO participant_profiles (user_id, education_stage, grade_level, date_of_birth, is_onboarded)
       VALUES ($1, 'grade_10', '10', '2011-04-15', true)`,
      [userIdG10]
    );

    // Initial state: All active catalog assessments are AVAILABLE, Stream Finder is primary recommendation
    const journeyG10Initial = await assessmentEligibilityService.getAvailableAssessmentsForParticipant(userIdG10);
    assert(journeyG10Initial.primaryAssessmentCode === "STREAM_FINDER", "TEST 1.1: Class 10 primary is STREAM_FINDER");
    
    const streamInitial = journeyG10Initial.assessments.find((a) => a.code === "STREAM_FINDER");
    assert(streamInitial?.status === "AVAILABLE" && streamInitial?.isRecommended === true, "TEST 1.2: Stream Finder is AVAILABLE & Recommended for Class 10");
    assert(streamInitial?.canStart === true, "TEST 1.3: Stream Finder canStart is TRUE");

    const engInitial = journeyG10Initial.assessments.find((a) => a.code === "ENGINEERING_BRANCH_FINDER");
    assert(engInitial?.status === "AVAILABLE" && engInitial?.canStart === true, "TEST 2: Class 10 Engineering Branch Finder is AVAILABLE & canStart: true");

    const commInitial = journeyG10Initial.assessments.find((a) => a.code === "COMMERCE_CAREER_FINDER");
    assert(commInitial?.status === "AVAILABLE" && commInitial?.canStart === true, "TEST 3: Class 10 Commerce Career Finder is AVAILABLE & canStart: true");

    const skillInitial = journeyG10Initial.assessments.find((a) => a.code === "SKILL_FINDER");
    assert(skillInitial?.status === "AVAILABLE" && skillInitial?.canStart === true, "TEST 3.1: Class 10 Skill Finder is AVAILABLE & canStart: true");

    // Start Stream Finder
    const startStream = await assessmentRunnerService.startOrCreateAttempt(userIdG10, "STREAM_FINDER");
    assert(!!startStream.attemptId, "TEST 4: Stream Finder starts successfully");

    // Resume In-Progress test
    const resumeStream = await assessmentRunnerService.startOrCreateAttempt(userIdG10, "STREAM_FINDER");
    assert(resumeStream.attemptId === startStream.attemptId, "TEST 5: Resuming in-progress assessment returns identical attempt ID without duplicates");

    // Start another assessment (Engineering Branch Finder) directly - open access
    const startEng = await assessmentRunnerService.startOrCreateAttempt(userIdG10, "ENGINEERING_BRANCH_FINDER");
    assert(!!startEng.attemptId && startEng.status === "IN_PROGRESS", "TEST 6: Direct start of Engineering Branch Finder succeeds without locks");

    // Complete Stream Finder
    await pool.query(
      `UPDATE assessment_attempts
       SET status = 'COMPLETED', completed_at = NOW(), answered_count = total_questions
       WHERE id = $1`,
      [startStream.attemptId]
    );

    // Re-evaluate Class 10 after Stream Finder completion
    const journeyG10Completed = await assessmentEligibilityService.getAvailableAssessmentsForParticipant(userIdG10);
    const streamCompleted = journeyG10Completed.assessments.find((a) => a.code === "STREAM_FINDER");
    assert(streamCompleted?.status === "COMPLETED" && streamCompleted?.canViewResult === true, "TEST 7: Stream Finder is COMPLETED & canViewResult is true");
    assert(streamCompleted?.canRetake === true, "TEST 7.1: Stream Finder has canRetake: true");

    const completedCountG10 = journeyG10Completed.assessments.filter((a) => a.status === "COMPLETED").length;
    const lockedCountG10 = journeyG10Completed.assessments.filter((a) => a.status === "LOCKED").length;

    assert(completedCountG10 === 1, "TEST 8: Class 10 Completed count is 1");
    assert(lockedCountG10 === 0, "TEST 8.1: Class 10 Locked count is 0 (all modules unlocked)");

    // -------------------------------------------------------------
    // SCENARIO 2: Middle School Student (Class 7 / Age 12)
    // -------------------------------------------------------------
    console.log("\n--- Scenario 2: Middle School Student (Class 7 / Age 12) ---");

    const emailG7 = `test_g7_${Date.now()}@example.com`;
    const userG7Res = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, 'hash', 'Class7', 'Student', 'ACTIVE', NOW())
       RETURNING id`,
      [emailG7]
    );
    const userIdG7 = userG7Res.rows[0].id;

    await pool.query(
      `INSERT INTO participant_profiles (user_id, education_stage, grade_level, date_of_birth, is_onboarded)
       VALUES ($1, 'GRADE_7', '7', '2014-06-10', true)`,
      [userIdG7]
    );

    const journeyG7 = await assessmentEligibilityService.getAvailableAssessmentsForParticipant(userIdG7);
    const skillG7 = journeyG7.assessments.find((a) => a.code === "SKILL_FINDER");
    assert(skillG7?.status === "AVAILABLE" && skillG7?.isRecommended === true, "TEST 9: Class 7 Skill Finder is AVAILABLE & Recommended");

    const streamG7 = journeyG7.assessments.find((a) => a.code === "STREAM_FINDER");
    assert(streamG7?.status === "AVAILABLE" && streamG7?.canStart === true, "TEST 10: Class 7 Stream Finder is AVAILABLE & canStart: true");

    const startSkillG7 = await assessmentRunnerService.startOrCreateAttempt(userIdG7, "SKILL_FINDER");
    assert(!!startSkillG7.attemptId, "TEST 10.1: Class 7 Skill Finder starts cleanly");

    // -------------------------------------------------------------
    // SCENARIO 3: Higher Secondary Student (Class 11 / Age 16)
    // -------------------------------------------------------------
    console.log("\n--- Scenario 3: Higher Secondary Student (Class 11 / Age 16) ---");

    const emailG11 = `test_g11_${Date.now()}@example.com`;
    const userG11Res = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, 'hash', 'Class11', 'Student', 'ACTIVE', NOW())
       RETURNING id`,
      [emailG11]
    );
    const userIdG11 = userG11Res.rows[0].id;

    await pool.query(
      `INSERT INTO participant_profiles (user_id, education_stage, grade_level, date_of_birth, is_onboarded)
       VALUES ($1, 'grade_11', '11', '2010-02-20', true)`,
      [userIdG11]
    );

    const journeyG11 = await assessmentEligibilityService.getAvailableAssessmentsForParticipant(userIdG11);
    const streamG11 = journeyG11.assessments.find((a) => a.code === "STREAM_FINDER");
    const engG11 = journeyG11.assessments.find((a) => a.code === "ENGINEERING_BRANCH_FINDER");
    const commG11 = journeyG11.assessments.find((a) => a.code === "COMMERCE_CAREER_FINDER");

    assert(streamG11?.status === "AVAILABLE", "TEST 11: Class 11 Stream Finder is AVAILABLE");
    assert(engG11?.status === "AVAILABLE" && engG11?.canStart === true, "TEST 11.1: Class 11 Engineering is AVAILABLE & canStart is TRUE");
    assert(commG11?.status === "AVAILABLE" && commG11?.canStart === true, "TEST 11.2: Class 11 Commerce is AVAILABLE & canStart is TRUE");

    // -------------------------------------------------------------
    // SCENARIO 4: College / Adult Student (Age 20)
    // -------------------------------------------------------------
    console.log("\n--- Scenario 4: College / Adult Student (Age 20) ---");

    const emailCollege = `test_college_${Date.now()}@example.com`;
    const userCollegeRes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, 'hash', 'College', 'Student', 'ACTIVE', NOW())
       RETURNING id`,
      [emailCollege]
    );
    const userIdCollege = userCollegeRes.rows[0].id;

    await pool.query(
      `INSERT INTO participant_profiles (user_id, education_stage, date_of_birth, is_onboarded)
       VALUES ($1, 'COLLEGE_UNIVERSITY', '2006-05-15', true)`,
      [userIdCollege]
    );

    const journeyCollege = await assessmentEligibilityService.getAvailableAssessmentsForParticipant(userIdCollege);
    const rightCareer = journeyCollege.assessments.find((a) => a.code === "RIGHT_CAREER_FINDER");
    const aiJobRisk = journeyCollege.assessments.find((a) => a.code === "AI_JOB_RISK_FINDER");
    const skillCollege = journeyCollege.assessments.find((a) => a.code === "SKILL_FINDER");

    assert(rightCareer?.status === "AVAILABLE" && rightCareer?.isRecommended === true, "TEST 12: College Right Career Finder is AVAILABLE & Recommended");
    assert(aiJobRisk?.status === "AVAILABLE" && aiJobRisk?.canStart === true, "TEST 12.1: AI Job Risk Finder is AVAILABLE & canStart is TRUE");
    assert(skillCollege?.status === "AVAILABLE" && skillCollege?.canStart === true, "TEST 12.2: Skill Finder is AVAILABLE for College learners");

    // -------------------------------------------------------------
    // SCENARIO 5: Retest & History Preservation
    // -------------------------------------------------------------
    console.log("\n--- Scenario 5: Retest & History Preservation ---");

    const retakeAttempt = await assessmentRunnerService.startRetakeAttempt(userIdG10, "STREAM_FINDER");
    assert(!!retakeAttempt.attemptId && retakeAttempt.attemptId !== startStream.attemptId, "TEST 13: Retake initializes a fresh attempt ID");

    // Verify historical completed attempt is still in DB
    const histAttemptsRes = await pool.query(
      `SELECT id, status FROM assessment_attempts WHERE participant_id = $1 AND assessment_id = (SELECT id FROM assessments WHERE code = 'STREAM_FINDER') ORDER BY created_at ASC`,
      [userIdG10]
    );
    assert(histAttemptsRes.rows.length >= 2, "TEST 13.1: Historical and retake attempts coexist in DB");
    assert(histAttemptsRes.rows[0].status === "COMPLETED", "TEST 13.2: Initial attempt remains COMPLETED (unaltered)");

    // Cleanup test records
    await pool.query(`DELETE FROM users WHERE id IN ($1, $2, $3, $4)`, [
      userIdG10,
      userIdG7,
      userIdG11,
      userIdCollege,
    ]);

    console.log("\n===============================================================");
    console.log(`🏁 TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
    console.log("===============================================================");

    if (passedTests === totalTests) {
      console.log("🎉 ALL CRITICAL ASSESSMENT UNLOCKED ACCESS TESTS PASSED WITH 100% SUCCESS!");
    } else {
      process.exitCode = 1;
    }
  } catch (err) {
    console.error("Fatal test error:", err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

runPersonalizedJourneyValidation();
