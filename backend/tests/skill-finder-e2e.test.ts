import { pool, connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { createApp } from "../src/app";
import http from "http";

async function runSkillFinderE2ETests() {
  console.log("🧪 Starting 3G MeLife Skill Finder Digital Assessment E2E Test Suite...\n");

  await connectDatabase();
  await authRepository.seedRolePermissions();
  await participantRepository.initSchema();
  await assessmentRepository.initSchema();
  await assessmentRepository.seedCatalog();
  await assessmentContentRepository.initSchema();
  await assessmentContentRepository.seedSkillFinderContent();

  const app = createApp();
  const server = http.createServer(app);

  const port = 5055;
  await new Promise<void>((resolve) => server.listen(port, resolve));
  const baseUrl = `http://localhost:${port}/api/v1`;

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
          lastName: "TestStudent",
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

    // 1. TEST: Database Catalog & Seed Verification
    const countRes = await pool.query(
      `SELECT COUNT(*) as count FROM assessment_questions WHERE assessment_id = (SELECT id FROM assessments WHERE code = 'SKILL_FINDER')`
    );
    assert(
      parseInt(countRes.rows[0].count, 10) === 104,
      "Question Bank: Exactly 104 questions seeded for SKILL_FINDER"
    );

    const imageCountRes = await pool.query(
      `SELECT COUNT(*) as count FROM assessment_questions WHERE image_url IS NOT NULL AND assessment_id = (SELECT id FROM assessments WHERE code = 'SKILL_FINDER')`
    );
    assert(
      parseInt(imageCountRes.rows[0].count, 10) === 4,
      "Visual Questions: Exactly 4 visual/image questions configured with metadata"
    );

    // 2. TEST: Create Student Participant & Start Attempt
    const student1 = await createParticipant(`student_${timestamp}@example.com`, "Rohan", 12);

    const startRes = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const startData = await startRes.json();
    assert(
      startRes.status === 200 && startData.data?.attemptId && startData.data?.status === "IN_PROGRESS",
      "Assessment Lifecycle: POST /assessments/SKILL_FINDER/start creates active attempt"
    );
    const attemptId = startData.data.attemptId;

    // 3. TEST: Load Questions & Verify Sanitization / Privacy
    const qRes = await fetch(`${baseUrl}/attempts/${attemptId}/questions`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const qData = await qRes.json();
    assert(
      qRes.status === 200 && qData.data?.questions?.length === 104,
      "Questions Engine: GET /attempts/:id/questions returns all 104 items"
    );

    // Check that answers/keys are NOT leaked
    const hasLeakedKeys = JSON.stringify(qData.data).includes("correct_key") ||
                          JSON.stringify(qData.data).includes("score_value");
    assert(
      !hasLeakedKeys,
      "Security: Questions payload strictly omits scoring keys and raw weights"
    );

    // Verify sections structure
    assert(
      qData.data?.sections?.length === 5,
      "Section Model: Assessment contains all 5 official sections (A, B, C, D, E)"
    );

    // 4. TEST: Save Responses Across Different Question Types
    const q1 = qData.data.questions[0]; // Likert
    const q57 = qData.data.questions.find((q: any) => q.questionNumber === 57); // Visual MCQ
    const q73 = qData.data.questions.find((q: any) => q.questionNumber === 73); // Creative open

    // Save Q1 (Likert: 4 = Very much like me)
    const save1 = await fetch(`${baseUrl}/attempts/${attemptId}/responses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${student1.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId: q1.id,
        selectedOptionId: q1.options.find((o: any) => o.optionKey === "4")?.id,
        responseValue: "4",
      }),
    });
    assert(save1.status === 200, "Response Engine: Successfully saved Likert response");

    // Save Q57 (Visual MCQ: Option B)
    const save57 = await fetch(`${baseUrl}/attempts/${attemptId}/responses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${student1.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId: q57.id,
        selectedOptionId: q57.options.find((o: any) => o.optionKey === "B")?.id,
        responseValue: "B",
      }),
    });
    assert(save57.status === 200, "Response Engine: Successfully saved Visual MCQ response");

    // Save Q73 (Open creative prompt)
    const save73 = await fetch(`${baseUrl}/attempts/${attemptId}/responses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${student1.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId: q73.id,
        responseValue: "Pencil holder, mini planter for seedlings, sound amplifier for phone, paper cup telephone, painting water pot, desktop stationery organizer.",
      }),
    });
    assert(save73.status === 200, "Response Engine: Successfully saved Open Creative response");

    // 5. TEST: Answer All Remaining Items for Full Scoring (Concurrent batch saves)
    const savePromises = qData.data.questions.map((q: any) => {
      if (q.questionNumber === 1 || q.questionNumber === 57 || q.questionNumber === 73) {
        return Promise.resolve();
      }

      let ansVal = "3";
      let optId = q.options[0]?.id;

      if (q.questionType === "likert_1_4") {
        if (q.questionNumber === 104) {
          ansVal = "2"; // Attention check
        } else if (q.questionNumber === 100 || q.questionNumber === 53) {
          ansVal = "4"; // Parallel leadership check
        } else if (q.questionNumber === 101 || q.questionNumber === 80) {
          ansVal = "4"; // Parallel persistence check
        } else if (q.questionNumber === 102 || q.questionNumber === 2) {
          ansVal = "4"; // Parallel explorer check
        } else if (q.questionNumber === 103 || q.questionNumber === 38) {
          ansVal = "4"; // Parallel planning check
        } else {
          ansVal = "3";
        }
        optId = q.options.find((o: any) => o.optionKey === ansVal)?.id;
      } else if (q.questionType === "mcq_text" || q.questionType === "mcq_image") {
        ansVal = "B";
        optId = q.options.find((o: any) => o.optionKey === ansVal)?.id;
      } else if (q.questionType === "open_scored") {
        ansVal = "Cardboard desk organizer, toy car garage, modular drawer dividers, shadow puppet theater, bird feeder, gift packaging box.";
      }

      return fetch(`${baseUrl}/attempts/${attemptId}/responses`, {
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
    });

    await Promise.all(savePromises);

    // 6. TEST: Resume Verification
    const resumeRes = await fetch(`${baseUrl}/attempts/${attemptId}/questions`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const resumeData = await resumeRes.json();
    assert(
      resumeData.data?.answeredCount === 104,
      "Resume Engine: All 104 responses preserved and restored upon refresh"
    );

    // 7. TEST: Submit Assessment & Score Computation
    const submitRes = await fetch(`${baseUrl}/attempts/${attemptId}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const submitData = await submitRes.json();
    assert(
      submitRes.status === 200 && submitData.success && submitData.data?.result,
      "Submission Engine: POST /attempts/:id/submit finalizes attempt and calculates report"
    );

    const result = submitData.data.result;
    assert(
      result.interestDiscovery?.topClusters?.length === 3,
      "Scoring Engine: Generates Top 3 Holland RIASEC Interest Clusters"
    );
    assert(
      result.skillBehaviour?.dimensions?.length === 8,
      "Scoring Engine: Calculates all 8 Skill Behaviour dimensions"
    );
    assert(
      result.demonstratedAptitude?.dimensions?.length === 8,
      "Scoring Engine: Evaluates all 8 Demonstrated Aptitude areas"
    );
    assert(
      result.responseQuality?.consistencySignal === "High Consistency" &&
      result.responseQuality?.attentionCheckPassed === true,
      "Validity Engine: Response Consistency & Attention Check evaluated correctly"
    );
    assert(
      result.explorationDirections?.length === 3,
      "Guidance Engine: Non-prescriptive Career & Project Exploration Directions mapped"
    );

    // 8. TEST: Query Result Snapshot from Database
    const fetchResultRes = await fetch(`${baseUrl}/results/${attemptId}`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const fetchResultData = await fetchResultRes.json();
    assert(
      fetchResultRes.status === 200 && fetchResultData.data?.assessmentCode === "SKILL_FINDER",
      "Results Database: GET /results/:id loads persisted psychometric result snapshot"
    );

    // 9. TEST: Security Isolation & Access Control
    const student2 = await createParticipant(`student2_${timestamp}@example.com`, "Ananya", 12);
    const crossAccessRes = await fetch(`${baseUrl}/attempts/${attemptId}/questions`, {
      headers: { Authorization: `Bearer ${student2.token}` },
    });
    assert(
      crossAccessRes.status === 403,
      "Security: Cross-participant attempt tampering blocked (403 Forbidden)"
    );

    const unauthRes = await fetch(`${baseUrl}/results/${attemptId}`);
    assert(
      unauthRes.status === 401,
      "Security: Unauthenticated result access blocked (401 Unauthorized)"
    );

  } catch (err) {
    console.error("Test execution error:", err);
    failed++;
  } finally {
    server.close();
    await closeDatabasePool();
  }

  console.log("\n========================================");
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log("========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runSkillFinderE2ETests();
