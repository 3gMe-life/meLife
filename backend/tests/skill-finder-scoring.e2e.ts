import { pool, connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { skillFinderQuestionSelectionService } from "../src/modules/assessments/services/skill-finder-question-selection.service";
import { skillFinderTranslationsService } from "../src/modules/assessments/services/skill-finder-translations.service";
import { createApp } from "../src/app";
import http from "http";

async function runSkillFinderScoringE2ETests() {
  console.log("🧪 Starting Skill Finder Scoring Engine & Result Generation E2E Test Suite...\n");

  await connectDatabase();
  await authRepository.seedRolePermissions();
  await participantRepository.initSchema();
  await assessmentRepository.initSchema();
  await assessmentRepository.seedCatalog();
  await assessmentContentRepository.initSchema();
  await assessmentContentRepository.seedSkillFinderContent();
  await skillFinderQuestionSelectionService.seedSkillFinderVersions();
  await skillFinderTranslationsService.seedSkillFinderTranslations();

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as { port: number };
  const baseUrl = `http://localhost:${address.port}/api/v1`;

  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string) => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    const timestamp = Date.now();

    // Helper to register participant & complete onboarding
    const createParticipant = async (email: string, firstName: string, age = 12) => {
      const regRes = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "Password123!",
          firstName,
          lastName: "ScoringStudent",
          registrationPath: "STUDENT",
        }),
      });
      const regData = await regRes.json();
      const token = regData.data.accessToken;
      const userId = regData.data.user.id;

      // Onboard
      const birthYear = new Date().getFullYear() - age;
      await fetch(`${baseUrl}/participant/onboarding`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateOfBirth: `${birthYear}-05-15`,
          educationStage: "SCHOOL",
          gradeLevel: "7",
          guardianName: "Parent of " + firstName,
          guardianPhone: "+91 98765 00000",
        }),
      });

      return { userId, token, email };
    };

    // =========================================================================
    // 1. TEST: Student Edition (68 Questions) Scoring Lifecycle
    // =========================================================================
    console.log("\n--- TEST 1: Student Edition (68 Questions) Scoring Lifecycle ---");
    const student1 = await createParticipant(`student.scoring.${timestamp}@example.com`, "Aarav");

    // Start Student Edition attempt
    const startRes = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const startData = await startRes.json();
    assert(startRes.status === 200, "Start: Successfully initiated Student Edition attempt");
    const attemptId = startData.data.attemptId;

    // Load questions
    const qRes = await fetch(`${baseUrl}/attempts/${attemptId}/questions`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const qData = await qRes.json();
    assert(qData.data.questions.length === 68, "Student Edition contains exactly 68 questions");

    // Submit answers designed to simulate a Practical Explorer profile (High Builder & Explorer)
    for (const q of qData.data.questions) {
      let ansVal = "3";
      let optId = q.options[0]?.id;

      if (q.sectionCode === "SECTION_A") {
        if (q.dimensionCode === "BUILDER_R" || q.dimensionCode === "EXPLORER_I") {
          ansVal = "4"; // Very much like me
        } else {
          ansVal = "2"; // A little like me
        }
        optId = q.options.find((o: any) => o.optionKey === ansVal)?.id;
      } else if (q.sectionCode === "SECTION_B") {
        ansVal = "3"; // Mostly like me
        optId = q.options.find((o: any) => o.optionKey === ansVal)?.id;
      } else if (q.sectionCode === "SECTION_C") {
        if (q.questionType === "mcq_text" || q.questionType === "mcq_image") {
          ansVal = "B";
          optId = q.options.find((o: any) => o.optionKey === ansVal)?.id;
        } else if (q.questionType === "open_scored") {
          ansVal = "Desk organizer, pencil stand, bird feeder, plant watering pot, speaker amplifier.";
        }
      } else if (q.sectionCode === "SECTION_D") {
        ansVal = "3";
        optId = q.options.find((o: any) => o.optionKey === ansVal)?.id;
      } else if (q.sectionCode === "SECTION_E") {
        ansVal = "2";
        optId = q.options.find((o: any) => o.optionKey === ansVal)?.id;
      }

      await fetch(`${baseUrl}/attempts/${attemptId}/responses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${student1.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: q.id,
          selectedOptionId: optId,
          responseValue: ansVal,
        }),
      });
    }

    // Submit attempt for scoring
    const submitRes = await fetch(`${baseUrl}/attempts/${attemptId}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const submitData = await submitRes.json();
    assert(submitRes.status === 200, "Submission: Successfully finalized and scored attempt (200)");
    const result = submitData.data.result;
    const resultId = submitData.data.resultId;

    // Verify Construct Separation: Interest Discovery
    assert(
      result.interestDiscovery?.dimensions?.length === 6,
      "Psychometrics: Section A evaluates all 6 RIASEC domains distinctly"
    );
    assert(
      result.interestDiscovery?.topClusters?.length === 3,
      "Psychometrics: Top 3 interest affinity clusters identified"
    );
    const topInterestCodes = result.interestDiscovery.topClusters.map((c: any) => c.code);
    assert(
      topInterestCodes.includes("BUILDER_R") && topInterestCodes.includes("EXPLORER_I"),
      "Psychometrics: Builder and Explorer accurately identified as top interest clusters"
    );

    // Verify Construct Separation: Skill Behaviour
    assert(
      result.skillBehaviour?.dimensions?.length === 8,
      "Psychometrics: Section B evaluates all 8 skill behaviour dimensions distinctly"
    );
    assert(
      result.skillBehaviour?.strongestIndicators?.length === 3,
      "Psychometrics: 3 strongest skill behaviour indicators identified"
    );
    assert(
      result.skillBehaviour?.developmentOpportunities?.length === 2,
      "Psychometrics: 2 constructive developmental opportunities identified"
    );

    // Verify Construct Separation: Demonstrated Aptitude
    assert(
      result.demonstratedAptitude?.dimensions?.length === 8,
      "Psychometrics: Section C evaluates all 8 cognitive aptitude domains distinctly"
    );
    assert(
      typeof result.demonstratedAptitude?.overallAccuracyPercentage === "number",
      "Psychometrics: Overall task accuracy percentage computed cleanly"
    );

    // Verify Construct Separation: Developmental Strengths & Validity
    assert(
      result.developmentalStrengths?.dimensions?.length === 7,
      "Psychometrics: Section D evaluates all 7 developmental habits distinctly"
    );
    assert(
      Boolean(result.responseQuality?.consistencySignal),
      "Psychometrics: Section E response quality consistency signal computed"
    );

    // Verify Learning Profile Synthesis & Non-Prescriptive Framing
    assert(
      result.learningProfile?.archetypeTitle.includes("Practical Explorer"),
      "Synthesis: Learning Profile Archetype correctly mapped to 'Practical Explorer'"
    );
    assert(
      result.learningProfile?.explorationFraming.includes("alignment with") ||
      result.learningProfile?.explorationFraming.includes("engineering"),
      "Non-Prescriptive Framing: Career output uses exploratory wording, not rigid prescriptions"
    );
    assert(
      result.explorationDirections?.length === 3,
      "Exploration Pathways: 3 structured exploration direction cards generated"
    );
    assert(
      result.growthSuggestions?.length >= 3,
      "Actionable Guidance: Actionable next steps provided for student and parents"
    );

    // =========================================================================
    // 2. TEST: Database Result Storage & Retrieval APIs
    // =========================================================================
    console.log("\n--- TEST 2: Database Result Storage & Retrieval APIs ---");
    const dbRes = await pool.query(
      `SELECT id, attempt_id, participant_id, profile_type, summary, dimension_scores, result_data
       FROM assessment_results WHERE attempt_id = $1`,
      [attemptId]
    );
    assert(dbRes.rows.length === 1, "Database: Result snapshot persisted in assessment_results table");
    assert(
      dbRes.rows[0].profile_type.includes("Practical Explorer"),
      "Database: profile_type column populated accurately"
    );
    assert(
      dbRes.rows[0].summary.length > 10,
      "Database: summary column populated accurately"
    );

    // Query via GET /api/v1/results/:resultId
    const getRes = await fetch(`${baseUrl}/results/${resultId}`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const getJson = await getRes.json();
    assert(getRes.status === 200, "API: GET /api/v1/results/:resultId returns 200 with result data");
    assert(
      getJson.data.learningProfile.archetypeTitle.includes("Practical Explorer"),
      "API: Result retrieved via resultId matches persisted profile"
    );

    // Query via GET /api/v1/assessments/results/latest
    const latestRes = await fetch(`${baseUrl}/assessments/results/latest`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const latestJson = await latestRes.json();
    assert(latestRes.status === 200, "API: GET /api/v1/assessments/results/latest returns 200");
    assert(
      latestJson.data.attemptId === attemptId,
      "API: Latest result returns most recent attempt ID"
    );

    // Query via GET /api/v1/results/latest directly
    const directLatestRes = await fetch(`${baseUrl}/results/latest`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const directLatestJson = await directLatestRes.json();
    assert(directLatestRes.status === 200, "API: GET /api/v1/results/latest returns 200");
    assert(
      directLatestJson.data.attemptId === attemptId,
      "API: Direct GET /results/latest returns most recent attempt ID"
    );

    // Query via GET /api/v1/results/latest for fresh user with NO completed results
    const freshUser = await createParticipant(`fresh.scoring.${timestamp}@example.com`, "Rohan");
    const freshLatestRes = await fetch(`${baseUrl}/results/latest`, {
      headers: { Authorization: `Bearer ${freshUser.token}` },
    });
    const freshLatestJson = await freshLatestRes.json();
    assert(freshLatestRes.status === 200 && freshLatestJson.data === null, "API: GET /results/latest for user without results returns 200 with data: null (no 500 error)");

    // Query via GET /api/v1/results/non-uuid-string
    const invalidIdRes = await fetch(`${baseUrl}/results/invalid-uuid-string`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    assert(invalidIdRes.status === 404, "API: GET /results/invalid-uuid-string safely returns 404 (no 500 Postgres crash)");

    // Query via GET /api/v1/assessments/results/:attemptId
    const attemptResultRes = await fetch(`${baseUrl}/assessments/results/${attemptId}`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const attemptResultJson = await attemptResultRes.json();
    assert(attemptResultRes.status === 200, "API: GET /api/v1/assessments/results/:attemptId returns 200");

    // =========================================================================
    // 3. TEST: Multilingual Result Translation & Dynamic Localized Output
    // =========================================================================
    console.log("\n--- TEST 3: Multilingual Result Translation & Localization ---");

    // Query in Malayalam ('ml')
    const mlResultRes = await fetch(`${baseUrl}/results/${resultId}?language=ml`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const mlResultJson = await mlResultRes.json();
    assert(mlResultRes.status === 200, "Multilingual: GET /results/:id?language=ml returns 200");
    assert(
      mlResultJson.data.learningProfile.archetypeTitle.includes("പ്രാക്ടിക്കൽ എക്സ്പ്ലോറർ"),
      "Multilingual: Learning profile archetype translated to Malayalam"
    );

    // Query in Hindi ('hi')
    const hiResultRes = await fetch(`${baseUrl}/results/${resultId}?language=hi`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const hiResultJson = await hiResultRes.json();
    assert(hiResultRes.status === 200, "Multilingual: GET /results/:id?language=hi returns 200");
    assert(
      hiResultJson.data.learningProfile.archetypeTitle.includes("प्रैक्टिकल एक्सप्लोरर"),
      "Multilingual: Learning profile archetype translated to Devanagari Hindi"
    );

    // Query in Arabic ('ar')
    const arResultRes = await fetch(`${baseUrl}/results/${resultId}?language=ar`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const arResultJson = await arResultRes.json();
    assert(arResultRes.status === 200, "Multilingual: GET /results/:id?language=ar returns 200");
    assert(
      arResultJson.data.learningProfile.archetypeTitle.includes("المستكشف العملي"),
      "Multilingual: Learning profile archetype translated to Arabic"
    );

    // =========================================================================
    // 4. TEST: Dynamic Version Support (Advanced Edition - 104 Questions)
    // =========================================================================
    console.log("\n--- TEST 4: Advanced Edition (104 Questions) Dynamic Normalization ---");
    const student2 = await createParticipant(`advanced.scoring.${timestamp}@example.com`, "Devika", 13);

    const advStartRes = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${student2.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        versionCode: "ADVANCED_COMPREHENSIVE",
      }),
    });
    const advStartData = await advStartRes.json();
    const advAttemptId = advStartData.data.attemptId;

    const advQRes = await fetch(`${baseUrl}/attempts/${advAttemptId}/questions`, {
      headers: { Authorization: `Bearer ${student2.token}` },
    });
    const advQData = await advQRes.json();
    assert(advQData.data.questions.length === 104, "Advanced Edition loads all 104 questions");

    // Answer all 104 questions
    for (const q of advQData.data.questions) {
      await fetch(`${baseUrl}/attempts/${advAttemptId}/responses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${student2.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: q.id,
          selectedOptionId: q.options[0]?.id || null,
          responseValue: q.options[0]?.optionKey || "Sample open response with multiple words for testing",
        }),
      });
    }

    // Score via POST /api/v1/attempts/:attemptId/score
    const scoreRes = await fetch(`${baseUrl}/attempts/${advAttemptId}/score`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student2.token}` },
    });
    const scoreJson = await scoreRes.json();
    assert(scoreRes.status === 200 && scoreJson.success, "Scoring API: POST /attempts/:id/score successfully scores 104 questions");
    assert(
      scoreJson.data.result.interestDiscovery.dimensions.length === 6,
      "Dynamic Normalization: 104 questions normalized cleanly without division errors"
    );

    // =========================================================================
    // 5. TEST: Security, Guardrails & Authorization
    // =========================================================================
    console.log("\n--- TEST 5: Security & Authorization ---");

    // Unauthenticated request
    const unauthRes = await fetch(`${baseUrl}/results/${resultId}`);
    assert(unauthRes.status === 401, "Security: Unauthenticated request rejected (401 Unauthorized)");

    // Cross-participant attempt inspection
    const crossRes = await fetch(`${baseUrl}/results/${resultId}`, {
      headers: { Authorization: `Bearer ${student2.token}` },
    });
    assert(crossRes.status === 403, "Security: Cross-participant result inspection blocked (403 Forbidden)");

    // Verify no internal rubric formulas or correct keys are exposed in result DTOs
    let leakedKeys = false;
    for (const dim of result.interestDiscovery.dimensions) {
      if ((dim as any).formula !== undefined || (dim as any).weight !== undefined) {
        leakedKeys = true;
      }
    }
    for (const dim of result.demonstratedAptitude.dimensions) {
      if ((dim as any).correctKey !== undefined || (dim as any).internalRubric !== undefined) {
        leakedKeys = true;
      }
    }
    assert(!leakedKeys, "Security: Zero formulas, correct keys, or private weights leaked in result DTOs");

    console.log(`\n========================================`);
    console.log(`Scoring Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } finally {
    server.close();
    await closeDatabasePool();
  }
}

runSkillFinderScoringE2ETests().catch((err) => {
  console.error("Unhandled scoring test error:", err);
  process.exit(1);
});
