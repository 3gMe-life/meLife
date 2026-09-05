import { connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { skillFinderQuestionSelectionService } from "../src/modules/assessments/services/skill-finder-question-selection.service";
import { skillFinderTranslationsService } from "../src/modules/assessments/services/skill-finder-translations.service";
import { createApp } from "../src/app";
import http from "http";

async function runProfileVectorE2ETests() {
  console.log("🧪 Starting 29-Dimension Profile Vector & Confidence Engine E2E Test Suite...\n");

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

    // Helper: Create participant and complete onboarding
    const createParticipant = async (email: string, firstName: string, age = 14) => {
      const regRes = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "Password123!",
          firstName,
          lastName: "ProfileTest",
          registrationPath: "STUDENT",
        }),
      });
      const regData = await regRes.json();
      const token = regData.data.accessToken;
      const userId = regData.data.user.id;

      const birthYear = new Date().getFullYear() - age;
      await fetch(`${baseUrl}/participant/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dateOfBirth: `${birthYear}-06-15`,
          educationStage: "SCHOOL",
          gradeLevel: "9",
          schoolName: "Apex International School",
          curriculumOrBoard: "CBSE",
          guardianName: "Parent of " + firstName,
          guardianPhone: "+91 98765 43210",
        }),
      });

      return { token, userId };
    };

    // =========================================================================
    // TEST 1: Student Profile 1 — Analytical Builder
    // =========================================================================
    console.log("--- 1. Testing Student Profile 1: Analytical Builder ---");
    const student1 = await createParticipant(`analytical_builder_${timestamp}@melife.org`, "Aarav_Builder", 14);

    const startRes1 = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const startData1 = await startRes1.json();
    const attemptId1 = startData1.data.attemptId;
    assert(Boolean(attemptId1), "Student 1: Attempt started successfully");

    const qRes1 = await fetch(`${baseUrl}/attempts/${attemptId1}/questions?limit=104`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const qData1 = await qRes1.json();
    const questions1: any[] = qData1.data.questions;
    assert(Array.isArray(questions1) && questions1.length > 0, "Student 1: Questions loaded");

    // Submit targeted answers for Analytical Builder: High Builder (R), High Explorer (I), High Logic
    for (let i = 0; i < questions1.length; i += 10) {
      const batch = questions1.slice(i, i + 10);
      await Promise.all(
        batch.map((q) => {
          let optionId = q.options?.[0]?.id;
          let val = "2";

          if (q.dimensionCode === "BUILDER_R" || q.dimensionCode === "EXPLORER_I" || q.dimensionCode === "LOGICAL_PROBLEM_SOLVING" || q.dimensionCode === "PERSISTENCE") {
            const highOpt = q.options?.find((o: any) => o.optionKey === "4" || o.scoreValue === 4 || o.score === 4);
            if (highOpt) {
              optionId = highOpt.id;
              val = "4";
            }
          } else if (q.sectionCode === "SECTION_C") {
            // Aptitude tasks
            if (q.dimensionCode === "PATTERN_LOGIC" || q.dimensionCode === "NUMERICAL_REASONING") {
              const correctOpt = q.options?.find((o: any) => o.optionKey === "C" || o.optionKey === "B");
              if (correctOpt) {
                optionId = correctOpt.id;
                val = correctOpt.optionKey;
              }
            }
          } else if (q.questionNumber === 104) {
            // Attention check: Select option 2
            const opt2 = q.options?.find((o: any) => o.optionKey === "2");
            if (opt2) {
              optionId = opt2.id;
              val = "2";
            }
          }

          return fetch(`${baseUrl}/attempts/${attemptId1}/responses`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${student1.token}`,
            },
            body: JSON.stringify({
              questionId: q.id,
              selectedOptionId: optionId,
              responseValue: val,
            }),
          });
        })
      );
    }

    const submitRes1 = await fetch(`${baseUrl}/attempts/${attemptId1}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const submitData1 = await submitRes1.json();
    assert(submitRes1.status === 200 && submitData1.success === true, "Student 1: Assessment submitted successfully");

    const result1 = submitData1.data?.result || submitData1.data;
    assert(Boolean(result1.profileVector), "Student 1: Result contains 29-dimension profileVector");
    const pv1 = result1.profileVector;

    // Verify 29 dimensions exist and are within 0-100 scale
    const expectedKeys = [
      "builder", "explorer", "creator", "helper", "leader", "organiser",
      "logical_problem_solving", "communication", "creative_thinking", "visual_spatial",
      "practical_technical", "social_teamwork", "leadership_initiative", "self_management",
      "pattern_logic", "numerical_reasoning", "verbal_reasoning", "spatial_reasoning",
      "practical_troubleshooting", "creative_performance", "social_judgment", "planning_estimation",
      "curiosity", "persistence", "adaptability", "initiative",
      "collaboration", "attention_to_detail", "learning_independence"
    ];

    const allKeysPresent = expectedKeys.every((k) => typeof pv1[k] === "number" && pv1[k] >= 0 && pv1[k] <= 100);
    assert(allKeysPresent, "Student 1: All 29 dimensions are present and normalized between 0-100");
    assert(pv1.builder >= 70, `Student 1: High Builder dimension score (${pv1.builder} >= 70)`);
    assert(pv1.explorer >= 70, `Student 1: High Explorer dimension score (${pv1.explorer} >= 70)`);
    assert(pv1.logical_problem_solving >= 70, `Student 1: High Logical Problem Solving (${pv1.logical_problem_solving} >= 70)`);

    // Verify Profile Confidence Engine outputs
    assert(Boolean(result1.profileConfidence), `Student 1: Profile confidence signal present (${result1.profileConfidence})`);
    assert(Boolean(result1.confidenceMetrics), "Student 1: Multi-factor confidenceMetrics present");
    assert(typeof result1.confidenceMetrics?.consistencyGap === "number", "Student 1: Consistency gap is numeric");
    assert(typeof result1.confidenceMetrics?.ratingBiasPercentage === "number", "Student 1: Rating bias percentage is numeric");
    assert(typeof result1.confidenceMetrics?.selfReportVsPerformanceGap === "number", "Student 1: Congruence gap is numeric");

    // =========================================================================
    // TEST 2: Student Profile 2 — Creative Explorer
    // =========================================================================
    console.log("--- 2. Testing Student Profile 2: Creative Explorer ---");
    const student2 = await createParticipant(`creative_explorer_${timestamp}@melife.org`, "Maya_Creative", 15);

    const startRes2 = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student2.token}` },
    });
    const startData2 = await startRes2.json();
    const attemptId2 = startData2.data.attemptId;

    const qRes2 = await fetch(`${baseUrl}/attempts/${attemptId2}/questions?limit=104`, {
      headers: { Authorization: `Bearer ${student2.token}` },
    });
    const qData2 = await qRes2.json();
    const questions2: any[] = qData2.data.questions;

    // Submit answers for Creative Explorer: High Creator (A), High Visual-Spatial, High Divergent Thinking
    for (let i = 0; i < questions2.length; i += 10) {
      const batch = questions2.slice(i, i + 10);
      await Promise.all(
        batch.map((q) => {
          let optionId = q.options?.[0]?.id;
          let val = "2";

          if (q.dimensionCode === "CREATOR_A" || q.dimensionCode === "EXPLORER_I" || q.dimensionCode === "CREATIVE_THINKING" || q.dimensionCode === "VISUAL_SPATIAL_THINKING" || q.dimensionCode === "CURIOSITY") {
            const highOpt = q.options?.find((o: any) => o.optionKey === "4" || o.scoreValue === 4 || o.score === 4);
            if (highOpt) {
              optionId = highOpt.id;
            }
            val = "4";
          }

          return fetch(`${baseUrl}/attempts/${attemptId2}/responses`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${student2.token}`,
            },
            body: JSON.stringify({
              questionId: q.id,
              selectedOptionId: optionId,
              responseValue: val,
            }),
          });
        })
      );
    }

    const submitRes2 = await fetch(`${baseUrl}/attempts/${attemptId2}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student2.token}` },
    });
    const submitData2 = await submitRes2.json();
    assert(submitRes2.status === 200 && submitData2.success === true, "Student 2: Submitted successfully");
    const result2 = submitData2.data?.result || submitData2.data;
    const pv2 = result2.profileVector;
    assert(pv2.creator >= 70, `Student 2: High Creator score (${pv2.creator} >= 70)`);
    assert(pv2.creative_thinking >= 70, `Student 2: High Creative Thinking score (${pv2.creative_thinking} >= 70)`);
    assert(
      result2.learningProfile?.archetypeTitle?.includes("Creator") ||
      result2.learningProfile?.archetypeTitle?.includes("Investigator") ||
      result2.learningProfile?.archetypeTitle?.includes("Explorer"),
      `Student 2: Learning profile archetype matches creative direction (${result2.learningProfile?.archetypeTitle})`
    );

    // =========================================================================
    // TEST 3: Student Profile 3 — Social Helper & Empathetic Leader
    // =========================================================================
    console.log("--- 3. Testing Student Profile 3: Social Helper / Empathetic Leader ---");
    const student3 = await createParticipant(`social_helper_${timestamp}@melife.org`, "Kabir_Helper", 14);

    const startRes3 = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student3.token}` },
    });
    const startData3 = await startRes3.json();
    const attemptId3 = startData3.data.attemptId;

    const qRes3 = await fetch(`${baseUrl}/attempts/${attemptId3}/questions?limit=104`, {
      headers: { Authorization: `Bearer ${student3.token}` },
    });
    const qData3 = await qRes3.json();
    const questions3: any[] = qData3.data.questions;

    // Submit answers for Social Helper: High Helper (S), High Leader (E), High Communication, High Teamwork
    for (let i = 0; i < questions3.length; i += 10) {
      const batch = questions3.slice(i, i + 10);
      await Promise.all(
        batch.map((q) => {
          let optionId = q.options?.[0]?.id;
          let val = "2";

          if (q.dimensionCode === "HELPER_S" || q.dimensionCode === "LEADER_E" || q.dimensionCode === "COMMUNICATION" || q.dimensionCode === "SOCIAL_TEAMWORK" || q.dimensionCode === "COLLABORATION") {
            const highOpt = q.options?.find((o: any) => o.optionKey === "4" || o.scoreValue === 4 || o.score === 4);
            if (highOpt) {
              optionId = highOpt.id;
            }
            val = "4";
          }

          return fetch(`${baseUrl}/attempts/${attemptId3}/responses`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${student3.token}`,
            },
            body: JSON.stringify({
              questionId: q.id,
              selectedOptionId: optionId,
              responseValue: val,
            }),
          });
        })
      );
    }

    const submitRes3 = await fetch(`${baseUrl}/attempts/${attemptId3}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student3.token}` },
    });
    const submitData3 = await submitRes3.json();
    assert(submitRes3.status === 200 && submitData3.success === true, "Student 3: Submitted successfully");
    const result3 = submitData3.data?.result || submitData3.data;
    const pv3 = result3.profileVector;
    assert(pv3.helper >= 70, `Student 3: High Helper score (${pv3.helper} >= 70)`);
    assert(pv3.communication >= 70, `Student 3: High Communication score (${pv3.communication} >= 70)`);
    assert(
      result3.learningProfile?.archetypeTitle?.includes("Catalyst") ||
      result3.learningProfile?.archetypeTitle?.includes("Leader") ||
      result3.learningProfile?.archetypeTitle?.includes("Human"),
      `Student 3: Learning profile archetype matches social/helper direction (${result3.learningProfile?.archetypeTitle})`
    );

    // =========================================================================
    // TEST 4: Database Snapshot Retrieval Verification
    // =========================================================================
    console.log("--- 4. Testing Database Snapshot Retrieval & Result API ---");
    const getRes = await fetch(`${baseUrl}/results/${attemptId1}`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const getData = await getRes.json();
    assert(getRes.status === 200, "Fetch attempt result by ID returns 200 OK");
    const retrievedResult = getData.data?.result || getData.data;
    assert(Boolean(retrievedResult.profileVector), "Retrieved database snapshot contains profileVector");
    assert(typeof retrievedResult.profileVector.builder === "number", "Retrieved profileVector.builder is numeric");
    assert(Boolean(retrievedResult.profileConfidence), "Retrieved database snapshot contains profileConfidence");

  } catch (error) {
    console.error("Test execution encountered an error:", error);
    failed++;
  } finally {
    server.close();
    await closeDatabasePool();
  }

  console.log(`\n==================================================`);
  console.log(`Profile Vector Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`==================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runProfileVectorE2ETests();
