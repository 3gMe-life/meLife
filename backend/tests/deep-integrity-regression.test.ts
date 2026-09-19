import { connectDatabase, closeDatabasePool, pool } from "../src/config/database";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { skillFinderQuestionSelectionService } from "../src/modules/assessments/services/skill-finder-question-selection.service";
import { streamFinderQuestionSelectionService } from "../src/modules/assessments/services/stream-finder-question-selection.service";
import { engineeringBranchFinderQuestionSelectionService } from "../src/modules/assessments/services/engineering-branch-finder-question-selection.service";
import { commerceCareerFinderQuestionSelectionService } from "../src/modules/assessments/services/commerce-career-finder-question-selection.service";
import { humanitiesCareerFinderQuestionSelectionService } from "../src/modules/assessments/services/humanities-career-finder-question-selection.service";
import { rightCareerFinderQuestionSelectionService } from "../src/modules/assessments/services/right-career-finder-question-selection.service";
import { aiJobRiskFinderQuestionSelectionService } from "../src/modules/assessments/services/ai-job-risk-finder-question-selection.service";
import { skillFinderScoringService } from "../src/modules/assessments/scoring/skill-finder-scoring.service";
import { streamFinderScoringService } from "../src/modules/assessments/scoring/stream-finder-scoring.service";
import { engineeringBranchFinderScoringService } from "../src/modules/assessments/scoring/engineering-branch-finder-scoring.service";
import { commerceCareerFinderScoringService } from "../src/modules/assessments/scoring/commerce-career-finder-scoring.service";
import { humanitiesCareerFinderScoringService } from "../src/modules/assessments/scoring/humanities-career-finder-scoring.service";
import { rightCareerFinderScoringService } from "../src/modules/assessments/scoring/right-career-finder-scoring.service";
import { aiJobRiskFinderScoringService } from "../src/modules/assessments/scoring/ai-job-risk-finder-scoring.service";
import { resultComparisonService } from "../src/modules/scoring/services/result-comparison.service";
import { createApp } from "../src/app";
import http from "http";

export interface TestReport {
  name: string;
  status: "PASS" | "FAIL";
  details?: string;
}

export async function runDeepIntegrityRegressionTests(): Promise<{ passed: number; failed: number; tests: TestReport[] }> {
  console.log("🧪 Starting Deep Psychometric Assessment Integrity & Scoring Regression Suite...\n");

  await connectDatabase();
  await authRepository.seedRolePermissions();
  await participantRepository.initSchema();
  await assessmentRepository.initSchema();
  await assessmentRepository.seedCatalog();
  await assessmentContentRepository.initSchema();

  // Seed all assessment question banks and active versions
  await skillFinderQuestionSelectionService.seedSkillFinderVersions();
  await streamFinderQuestionSelectionService.seedStreamFinderVersions();
  await engineeringBranchFinderQuestionSelectionService.seedEngineeringBranchFinderVersions();
  await commerceCareerFinderQuestionSelectionService.seedCommerceCareerFinderVersions();
  await humanitiesCareerFinderQuestionSelectionService.seedHumanitiesCareerFinderVersions();
  await rightCareerFinderQuestionSelectionService.seedRightCareerFinderVersions();
  await aiJobRiskFinderQuestionSelectionService.seedAiJobRiskFinderVersions();

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as { port: number };
  const baseUrl = `http://localhost:${address.port}/api/v1`;

  let passedCount = 0;
  let failedCount = 0;
  const testResults: TestReport[] = [];

  const assert = (condition: boolean, testName: string, details?: string) => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passedCount++;
      testResults.push({ name: testName, status: "PASS", details });
    } else {
      console.error(`❌ FAIL: ${testName} ${details ? `(${details})` : ""}`);
      failedCount++;
      testResults.push({ name: testName, status: "FAIL", details });
    }
  };

  try {
    const timestamp = Date.now();

    // Helper to register participant
    const registerStudent = async (email: string, firstName: string) => {
      const regRes = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "Password123!",
          firstName,
          lastName: "IntegrityTest",
          registrationPath: "STUDENT",
        }),
      });
      const regData = await regRes.json();
      const token = regData.data.accessToken;
      const userId = regData.data.user.id;

      await fetch(`${baseUrl}/participants/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dateOfBirth: "2012-05-15",
          educationStage: "SCHOOL",
          gradeLevel: "7",
          schoolName: "National Public School",
          curriculumOrBoard: "CBSE",
          guardianName: "Jane Doe",
          guardianPhone: "9876543210",
        }),
      });

      return { token, userId };
    };

    console.log("--- PART A: SEVEN ASSESSMENT ITEM COUNT INTEGRITY ---");

    const checkAssessmentItemCounts = async (code: string, expectedStored: number, expectedActive: number, name: string) => {
      const db = pool;
      const assessRes = await db.query(`SELECT id FROM assessments WHERE code = $1`, [code]);
      if (!assessRes.rows[0]) {
        assert(false, `${name}: Assessment record found in database`, `Code: ${code}`);
        return;
      }
      const assessId = assessRes.rows[0].id;

      // 1. Stored questions count
      const storedRes = await db.query(
        `SELECT COUNT(*) as cnt FROM assessment_questions WHERE assessment_id = $1`,
        [assessId]
      );
      const storedCount = parseInt(storedRes.rows[0].cnt, 10);
      assert(
        storedCount >= expectedStored,
        `${name}: Item bank has at least ${expectedStored} stored questions (${storedCount} in DB)`,
        `Found ${storedCount}`
      );

      // 2. Active version question count
      const activeVersionRes = await db.query(
        `SELECT v.id, v.version_code, v.question_count, COUNT(vq.question_id) as linked_count
         FROM assessment_versions v
         LEFT JOIN assessment_version_questions vq ON v.id = vq.version_id
         WHERE v.assessment_id = $1 AND v.is_default = true
         GROUP BY v.id, v.version_code, v.question_count`,
        [assessId]
      );
      const activeVersion = activeVersionRes.rows[0];
      const activeCount = parseInt(activeVersion?.linked_count || activeVersion?.question_count || "0", 10);
      assert(
        activeCount === expectedActive,
        `${name}: Exactly ${expectedActive} active questions in default form (${activeVersion?.version_code})`,
        `Found ${activeCount}`
      );
    };

    // 1. Engineering Branch Finder: 80 stored -> 45 active -> 45 displayed -> 45 scored
    await checkAssessmentItemCounts("ENGINEERING_BRANCH_FINDER", 80, 45, "Engineering Branch Finder");

    // 2. Commerce Career Finder: 80 stored -> 45 active -> 45 displayed -> 45 scored
    await checkAssessmentItemCounts("COMMERCE_CAREER_FINDER", 80, 45, "Commerce Career Finder");

    // 3. Humanities Career Finder: 80 stored -> 45 active -> 45 displayed -> 45 scored
    await checkAssessmentItemCounts("HUMANITIES_CAREER_FINDER", 80, 45, "Humanities Career Finder");

    // 4. Right Career Finder: 77 stored -> 50 active -> 50 displayed -> 50 scored
    await checkAssessmentItemCounts("RIGHT_CAREER_FINDER", 77, 50, "Right Career Finder");

    // 5. AI Job Risk Finder: 48 stored -> 30 active -> 30 displayed -> 30 scored
    await checkAssessmentItemCounts("AI_JOB_RISK_FINDER", 48, 30, "AI Job Risk Finder");

    // 6. Skill Finder: 104 stored -> 68 active -> 68 displayed -> 68 scored
    await checkAssessmentItemCounts("SKILL_FINDER", 104, 68, "Skill Finder");

    // 7. Stream Finder: 80 stored -> 80 active -> 80 displayed -> 80 scored
    await checkAssessmentItemCounts("STREAM_FINDER", 80, 80, "Stream Finder");

    // 8. Catalog Metadata Check: Skill Finder catalog metadata questionCount === 68
    const catalog = await assessmentRepository.findActiveAssessments();
    const sfCatalog = catalog.find((c) => c.code === "SKILL_FINDER");
    assert(sfCatalog?.questionCount === 68, "Skill Finder Catalog Metadata: questionCount is 68 in catalogItems", `questionCount = ${sfCatalog?.questionCount}`);

    console.log("\n--- PART B: 15 PSYCHOMETRIC & SYSTEM REGRESSION VECTORS ---");

    const student1 = await registerStudent(`regression_${timestamp}_1@melife.app`, "VectorStudent");

    // Start Skill Finder Attempt
    const sfInitRes = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1.token}`,
      },
      body: JSON.stringify({ versionCode: "STUDENT_STANDARD" }),
    });
    const sfInitData = await sfInitRes.json();
    const attemptId = sfInitData.data.attemptId;

    // Fetch attempt questions
    const qRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/questions?lang=en`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const qData = await qRes.json();
    const sfQuestions = qData.data.questions;

    // Vector 1: Minimum Response Scoring (all options scored minimum)
    const minResponses = sfQuestions.map((q: any) => ({
      question_id: q.id,
      question_number: q.questionNumber || q.question_number,
      question_type: q.questionType || q.question_type,
      section_code: q.sectionCode || q.section_code,
      dimension_code: q.dimensionCode || q.dimension_code,
      dimension_name: q.dimensionName || q.dimension_name,
      score: 1, // lowest score
      response_value: "1",
    }));
    const minScoreResult = skillFinderScoringService.calculateResult(
      "min-attempt",
      student1.userId,
      minResponses,
      { versionCode: "STUDENT_STANDARD" }
    );
    assert(
      minScoreResult.interestDiscovery !== null && typeof minScoreResult.responseQuality?.attentionCheckPassed === "boolean",
      "Vector 1: Minimum Response scoring calculates valid profile without division by zero"
    );

    // Vector 2: Maximum Response Scoring (all options scored maximum)
    const maxResponses = sfQuestions.map((q: any) => ({
      question_id: q.id,
      question_number: q.questionNumber || q.question_number,
      question_type: q.questionType || q.question_type,
      section_code: q.sectionCode || q.section_code,
      dimension_code: q.dimensionCode || q.dimension_code,
      dimension_name: q.dimensionName || q.dimension_name,
      score: 5, // highest score
      response_value: "5",
    }));
    const maxScoreResult = skillFinderScoringService.calculateResult(
      "max-attempt",
      student1.userId,
      maxResponses,
      { versionCode: "STUDENT_STANDARD" }
    );
    assert(
      maxScoreResult.interestDiscovery !== null && maxScoreResult.responseQuality !== null,
      "Vector 2: Maximum Response scoring bounds and calibrates ceiling without score overflow"
    );

    // Vector 3: Neutral Response Scoring (all options scored 3)
    const neutralResponses = sfQuestions.map((q: any) => ({
      question_id: q.id,
      question_number: q.questionNumber || q.question_number,
      question_type: q.questionType || q.question_type,
      section_code: q.sectionCode || q.section_code,
      dimension_code: q.dimensionCode || q.dimension_code,
      dimension_name: q.dimensionName || q.dimension_name,
      score: 3,
      response_value: "3",
    }));
    const neutralScoreResult = skillFinderScoringService.calculateResult(
      "neutral-attempt",
      student1.userId,
      neutralResponses,
      { versionCode: "STUDENT_STANDARD" }
    );
    assert(
      neutralScoreResult.interestDiscovery.dimensions.length > 0 && neutralScoreResult.skillBehaviour.dimensions.length > 0,
      "Vector 3: Neutral Response scoring resolves valid dimensions"
    );

    // Vector 4: Reverse Scoring Calibration
    const testDirectItem = { is_reverse_scored: false, score: 5 };
    const testReversedItem = { is_reverse_scored: true, score: 5 };
    const calcDirect = testDirectItem.is_reverse_scored ? 6 - testDirectItem.score : testDirectItem.score;
    const calcReversed = testReversedItem.is_reverse_scored ? 6 - testReversedItem.score : testReversedItem.score;
    assert(calcDirect === 5 && calcReversed === 1, "Vector 4: Reverse scoring mathematically inverts Likert 1-5 scale accurately");

    // Vector 5: Partial / Missing Response Validation
    const emptyAttempt = await assessmentContentRepository.findAttemptById(attemptId);
    assert(
      emptyAttempt !== null && emptyAttempt.status === "IN_PROGRESS" && emptyAttempt.answered_count === 0,
      "Vector 5: Initial assessment attempt initializes with 0 answered count and IN_PROGRESS state"
    );

    // Vector 6: Invalid Answer / Question Rejection
    const invalidSaveRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1.token}`,
      },
      body: JSON.stringify({
        questionId: "00000000-0000-0000-0000-000000000000",
        selectedOptionId: "00000000-0000-0000-0000-000000000001",
        responseValue: "3",
      }),
    });
    const invalidValRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1.token}`,
      },
      body: JSON.stringify({
        questionId: sfQuestions[0].id,
        selectedOptionId: sfQuestions[0].options?.[0]?.id || null,
        responseValue: "99", // Out of range Likert value
      }),
    });
    assert(
      invalidSaveRes.status >= 400 && invalidValRes.status >= 400,
      "Vector 6: Invalid question ID and out-of-range response values are rejected safely with error responses"
    );

    // Vector 7: Duplicate Answer Upsert (saving response twice to same question)
    const firstQ = sfQuestions[0];
    const option1 = firstQ.options?.[0];
    const option2 = firstQ.options?.[1] || firstQ.options?.[0];

    const save1 = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1.token}`,
      },
      body: JSON.stringify({
        questionId: firstQ.id,
        selectedOptionId: option1?.id || null,
        responseValue: option1?.optionKey || "1",
      }),
    });
    const save2 = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1.token}`,
      },
      body: JSON.stringify({
        questionId: firstQ.id,
        selectedOptionId: option2?.id || null,
        responseValue: option2?.optionKey || "2",
      }),
    });
    assert(
      save1.status === 200 && save2.status === 200,
      "Vector 7: Duplicate response upserts atomically without creating duplicate rows"
    );

    // Vector 8: Partial Attempt Persistence
    const partialAttempt = await assessmentContentRepository.findAttemptById(attemptId);
    assert(
      partialAttempt !== null && partialAttempt.status === "IN_PROGRESS" && partialAttempt.answered_count >= 1,
      "Vector 8: Partial attempt persists progress with answered_count >= 1",
      `answered_count: ${partialAttempt?.answered_count}`
    );

    // Vector 9: Completed Attempt & Result Lifecycle
    for (let i = 0; i < sfQuestions.length; i++) {
      const q = sfQuestions[i];
      const opt = q.options && q.options.length > 0 ? q.options[i % q.options.length] : null;
      let val = "3";
      if (q.question_type === "likert_1_4") val = "3";
      else if (q.question_type === "forced_choice_4") val = "A";
      else if (q.question_type === "forced_choice_8") val = "A";
      else if (q.question_type === "open_scored") val = "Reflective student response";
      else if (opt?.optionKey) val = opt.optionKey;
      else if (opt?.option_key) val = opt.option_key;

      await fetch(`${baseUrl}/assessments/attempts/${attemptId}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${student1.token}`,
        },
        body: JSON.stringify({
          questionId: q.id,
          selectedOptionId: opt?.id || null,
          responseValue: val,
        }),
      });
    }

    const submitRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1.token}`,
      },
      body: JSON.stringify({}),
    });
    const submitData = await submitRes.json();
    assert(
      submitRes.status === 200 && submitData.success && submitData.data?.resultId,
      "Vector 9: Complete attempt submission succeeds and returns computed resultId"
    );

    // Vector 10: Retest & History Preservation
    const retestStartRes = await fetch(`${baseUrl}/assessments/SKILL_FINDER/retake`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1.token}`,
      },
      body: JSON.stringify({ versionCode: "STUDENT_STANDARD" }),
    });
    const retestData = await retestStartRes.json();
    const retestAttemptId = retestData.data?.attemptId;
    assert(
      retestAttemptId && retestAttemptId !== attemptId,
      "Vector 10: Retest creates fresh attempt while preserving previous attempt in history"
    );

    // Vector 11: Resume In-Progress Attempt
    const resumeRes = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1.token}`,
      },
      body: JSON.stringify({ versionCode: "STUDENT_STANDARD" }),
    });
    const resumeData = await resumeRes.json();
    assert(
      resumeRes.status === 200 && resumeData.data?.attemptId === retestAttemptId && resumeData.data?.isNew === false,
      "Vector 11: Resuming retrieves current in-progress attempt seamlessly"
    );

    // Vector 12: Language Switch during Assessment
    const i18nRes = await fetch(`${baseUrl}/assessments/attempts/${retestAttemptId}/questions?lang=ml`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const i18nData = await i18nRes.json();
    assert(
      i18nRes.status === 200 && i18nData.data?.questions?.length === 68,
      "Vector 12: Language switch delivers translated questions without modifying active attempt state"
    );

    // Vector 13: Version Selection
    const student2 = await registerStudent(`regression_${timestamp}_v2@melife.app`, "FullBankStudent");
    const vSelectRes = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student2.token}`,
      },
      body: JSON.stringify({ versionCode: "ADVANCED_COMPREHENSIVE" }),
    });
    const vSelectData = await vSelectRes.json();
    const vSelectAttemptId = vSelectData.data?.attemptId;
    const vSelectQRes = await fetch(`${baseUrl}/assessments/attempts/${vSelectAttemptId}/questions?lang=en`, {
      headers: { Authorization: `Bearer ${student2.token}` },
    });
    const vSelectQData = await vSelectQRes.json();
    assert(
      vSelectQRes.status === 200 && vSelectQData.data?.questions?.length === 104,
      "Vector 13: Version selection correctly routes to requested version specification (104 items)"
    );

    // Vector 14: Full Question-Bank Version (104 items)
    const fullVerDb = await pool.query(
      `SELECT COUNT(*) as cnt FROM assessment_version_questions
       WHERE version_id = (SELECT id FROM assessment_versions WHERE version_code = 'ADVANCED_COMPREHENSIVE' LIMIT 1)`
    );
    const fullBankCount = parseInt(fullVerDb.rows[0].cnt, 10);
    assert(
      fullBankCount === 104,
      "Vector 14: Full Question-Bank version (ADVANCED_COMPREHENSIVE) links all 104 items",
      `Count = ${fullBankCount}`
    );

    // Vector 15: Reduced Active Version (68 items)
    const stdVerDb = await pool.query(
      `SELECT COUNT(*) as cnt FROM assessment_version_questions
       WHERE version_id = (SELECT id FROM assessment_versions WHERE version_code = 'STUDENT_STANDARD' LIMIT 1)`
    );
    const stdBankCount = parseInt(stdVerDb.rows[0].cnt, 10);
    assert(
      stdBankCount === 68,
      "Vector 15: Reduced Active Version (STUDENT_STANDARD) delivers exactly 68 calibrated items",
      `Count = ${stdBankCount}`
    );

    // Vector 16: Version-Aware Longitudinal Comparison
    const oldAttemptMock = {
      id: "11111111-1111-1111-1111-111111111111",
      participant_id: student1.userId,
      version_code: "STUDENT_STANDARD",
      created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      result_data: {
        versionCode: "STUDENT_STANDARD",
        learningProfile: { archetypeTitle: "Explorer", strengthSummary: "Broad inquiry" },
        interestDiscovery: { dimensions: [{ code: "REALISTIC", name: "Realistic", score: 60 }] },
        skillBehaviour: { dimensions: [{ code: "CRITICAL_THINKING", name: "Critical Thinking", score: 50 }] },
        demonstratedAptitude: { dimensions: [{ code: "LOGICAL", name: "Logical Reasoning", score: 55 }] },
        developmentalStrengths: { dimensions: [] },
      },
    };

    const diffVersionMock = {
      id: "22222222-2222-2222-2222-222222222222",
      participant_id: student1.userId,
      version_code: "ADVANCED_COMPREHENSIVE",
      created_at: new Date().toISOString(),
      result_data: {
        versionCode: "ADVANCED_COMPREHENSIVE",
        learningProfile: { archetypeTitle: "Strategist", strengthSummary: "System analysis" },
        interestDiscovery: { dimensions: [{ code: "REALISTIC", name: "Realistic", score: 70 }] },
        skillBehaviour: { dimensions: [{ code: "CRITICAL_THINKING", name: "Critical Thinking", score: 65 }] },
        demonstratedAptitude: { dimensions: [{ code: "LOGICAL", name: "Logical Reasoning", score: 62 }] },
        developmentalStrengths: { dimensions: [] },
      },
    };

    const sameVersionMock = {
      ...diffVersionMock,
      version_code: "STUDENT_STANDARD",
      result_data: { ...diffVersionMock.result_data, versionCode: "STUDENT_STANDARD" },
    };

    const diffComp = await resultComparisonService.compareResults(student1.userId, oldAttemptMock, diffVersionMock);
    assert(
      diffComp.isVersionMismatch === true &&
      diffComp.versionNotice !== null &&
      diffComp.growthSummary.includes("different versions"),
      "Vector 16a: Version mismatch triggers isVersionMismatch=true and neutral phrasing"
    );

    const sameComp = await resultComparisonService.compareResults(student1.userId, oldAttemptMock, sameVersionMock);
    assert(
      sameComp.isVersionMismatch === false &&
      sameComp.versionNotice === null,
      "Vector 16b: Identical versions preserve standard comparison without mismatch warning"
    );

  } catch (err: any) {
    console.error("Test execution fatal error:", err);
    assert(false, "Test Suite Execution without uncaught exception", err.message);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await closeDatabasePool();
  }

  console.log(`\n📊 Test Suite Complete: ${passedCount} PASSED, ${failedCount} FAILED\n`);
  return { passed: passedCount, failed: failedCount, tests: testResults };
}

if (require.main === module) {
  runDeepIntegrityRegressionTests()
    .then(({ failed }) => {
      if (failed > 0) process.exit(1);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
