import { connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { aiJobRiskFinderQuestionSelectionService } from "../src/modules/assessments/services/ai-job-risk-finder-question-selection.service";
import { aiJobRiskFinderTranslationsService } from "../src/modules/assessments/services/ai-job-risk-finder-translations.service";
import { reportRepository } from "../src/modules/reports/report.repository";
import { careerRepository } from "../src/modules/careers/career.repository";
import { createApp } from "../src/app";
import http from "http";

async function runAiJobRiskFinderE2ETests() {
  console.log("🧪 Starting AI Job Risk Finder (`AI_JOB_RISK_FINDER`) E2E Test Suite...\n");

  await connectDatabase();
  await authRepository.seedRolePermissions();
  await participantRepository.initSchema();
  await assessmentRepository.initSchema();
  await assessmentRepository.seedCatalog();
  await assessmentContentRepository.initSchema();
  await assessmentContentRepository.seedAiJobRiskFinderContent();
  await aiJobRiskFinderQuestionSelectionService.seedAiJobRiskFinderVersions();
  await aiJobRiskFinderTranslationsService.seedAiJobRiskFinderTranslations();
  await reportRepository.initSchema();
  await careerRepository.initSchema();
  await careerRepository.seedCareers();

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
    const createParticipant = async (email: string, firstName: string, age = 17) => {
      const regRes = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "Password123!",
          firstName,
          lastName: "Student",
          registrationPath: "STUDENT",
        }),
      });
      const regData: any = await regRes.json();
      const token = regData.data?.accessToken;
      const userId = regData.data?.user?.id;

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
          gradeLevel: "11",
          schoolName: "Apex International School",
          curriculumOrBoard: "CBSE",
          guardianName: "Parent of " + firstName,
          guardianPhone: "+91 98765 43210",
        }),
      });

      return { token, user: regData.data?.user };
    };

    // -------------------------------------------------------------
    // Test 1: Assessment Catalog & Form Configuration
    // -------------------------------------------------------------
    console.log("\n--- Group 1: Assessment Catalog & Form Configuration ---");

    const student1 = await createParticipant(`ai_student_${timestamp}@melife.com`, "Arya", 17);

    const catalogRes = await fetch(`${baseUrl}/assessments`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const catalogData: any = await catalogRes.json();
    assert(catalogRes.status === 200, "Fetch assessments catalog returns 200");

    const aiAssessment = catalogData.data?.assessments?.find(
      (a: any) => a.code === "AI_JOB_RISK_FINDER"
    );
    assert(!!aiAssessment, "AI Job Risk Finder exists in assessment catalog");
    assert(aiAssessment?.name === "AI Job Risk Finder", "Assessment name is 'AI Job Risk Finder'");
    assert(aiAssessment?.questionCount === 30, "Assessment standard question count is 30");
    assert(aiAssessment?.estimatedMinutes === 20, "Assessment estimated duration is 20 minutes");

    // -------------------------------------------------------------
    // Test 2: Attempt Initialization & 30-Question Delivery
    // -------------------------------------------------------------
    console.log("\n--- Group 2: Attempt Initialization & 30-Question Delivery ---");

    const startRes = await fetch(`${baseUrl}/assessments/AI_JOB_RISK_FINDER/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1.token}`,
      },
      body: JSON.stringify({
        versionCode: "AI_JOB_RISK_FINDER_V1",
      }),
    });
    const startData: any = await startRes.json();
    assert(startRes.status === 200, "Start AI Job Risk Finder attempt returns 200");
    const attemptId = startData.data?.attemptId || startData.data?.attempt?.id;
    assert(!!attemptId, "Attempt ID generated successfully");
    const initialStatus = startData.data?.status || startData.data?.attempt?.status;
    assert(initialStatus === "IN_PROGRESS", "Attempt initial status is IN_PROGRESS");

    const qRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/questions?lang=en`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const qData: any = await qRes.json();
    assert(qRes.status === 200, "Fetch attempt questions returns 200");
    assert(qData.data?.questions?.length === 30, "Exactly 30 calibrated questions returned for standard form");

    // Verify Likert 1-5 scale for all questions
    const allLikert = qData.data?.questions?.every(
      (q: any) => q.questionType === "likert_1_5" && q.options?.length === 5
    );
    assert(allLikert, "All 30 administered questions feature standard 5-point Likert response scale");

    // -------------------------------------------------------------
    // Test 3: Multilingual Translations
    // -------------------------------------------------------------
    console.log("\n--- Group 3: Multilingual Translations (Malayalam & Hindi) ---");

    const mlQRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/questions?lang=ml`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const mlQData: any = await mlQRes.json();
    assert(mlQRes.status === 200, "Fetch Malayalam questions returns 200");
    const q1Malayalam = mlQData.data?.questions?.[0];
    assert(
      q1Malayalam?.questionText?.includes("ഡിജിറ്റൽ") || q1Malayalam?.questionText?.includes("ആപ്പ്"),
      "Malayalam translation loaded accurately for Question #1"
    );

    const hiQRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/questions?lang=hi`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const hiQData: any = await hiQRes.json();
    assert(hiQRes.status === 200, "Fetch Hindi questions returns 200");
    const q1Hindi = hiQData.data?.questions?.[0];
    assert(
      q1Hindi?.questionText?.includes("डिजिटल") || q1Hindi?.questionText?.includes("सॉफ़्टवेयर"),
      "Hindi translation loaded accurately for Question #1"
    );

    // -------------------------------------------------------------
    // Test 4: Autosave & Atomic Response Persistence
    // -------------------------------------------------------------
    console.log("\n--- Group 4: Autosave & Response Persistence ---");

    const questions = qData.data.questions;

    // Simulate high adaptability student answering (mostly 4s and 5s, with 1s for reverse items)
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const qNum = q.questionNumber;
      // Form reverse-keyed items are every 5th item (Q5, Q10, Q15, Q20, Q25, Q30 -> Bank Q5, Q13, Q21, Q29, Q37, Q45)
      const isReverse = (i + 1) % 5 === 0;
      const answerVal = isReverse ? "1" : "5";

      const saveRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${student1.token}`,
        },
        body: JSON.stringify({
          questionId: q.id,
          responseValue: answerVal,
          currentQuestionIndex: i,
        }),
      });
      assert(saveRes.status === 200, `Autosave response for Question #${qNum} (${i + 1}/30) returns 200`);
    }

    // -------------------------------------------------------------
    // Test 5: Submission & Deterministic Psychometric Scoring
    // -------------------------------------------------------------
    console.log("\n--- Group 5: Submission & Psychometric Scoring ---");

    const submitRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1.token}`,
      },
      body: JSON.stringify({ languageCode: "en" }),
    });
    const submitData: any = await submitRes.json();
    assert(submitRes.status === 200, "Submit attempt returns 200");

    const result = submitData.data?.result;
    assert(!!result, "Assessment result generated and returned");
    assert(result.assessmentCode === "AI_JOB_RISK_FINDER", "Result assessmentCode is AI_JOB_RISK_FINDER");
    assert(result.isComplete === true, "Assessment status marked as complete");
    assert(result.studentReadinessIndex >= 85, "Student readiness index reflects high readiness profile (>=85)");
    assert(
      result.studentReadinessTier === "Exceptional Readiness",
      "Student readiness tier correctly categorized as 'Exceptional Readiness'"
    );

    // Verify all 6 constructs scored (0-100 normalized)
    const constructs = result.constructScores;
    assert(!!constructs.DIM_TECH_ADAPTABILITY, "Technology Adaptability construct scored");
    assert(!!constructs.DIM_LEARNING_AGILITY, "Learning Agility construct scored");
    assert(!!constructs.DIM_CRITICAL_THINKING, "Critical Thinking construct scored");
    assert(!!constructs.DIM_HUMAN_COLLABORATION, "Human Collaboration construct scored");
    assert(!!constructs.DIM_CREATIVE_SYNTHESIS, "Creative Synthesis construct scored");
    assert(!!constructs.DIM_ETHICAL_AWARENESS, "Ethical Awareness construct scored");
    assert(
      constructs.DIM_TECH_ADAPTABILITY.normalizedScore === 100,
      "Reverse item scoring correctly transformed Q5 (Answer 1 -> Score 5 -> 100% normalized)"
    );

    // -------------------------------------------------------------
    // Test 6: Occupational AI Impact Profile & Dual-Evidence Synthesis
    // -------------------------------------------------------------
    console.log("\n--- Group 6: Occupational AI Impact Profile & Dual Evidence ---");

    const occProfile = result.targetCareerProfile;
    assert(!!occProfile, "Target career profile present in result");
    assert(occProfile.archetype === "AI_AUGMENTED_SYSTEMS", "Career archetype is AI_AUGMENTED_SYSTEMS");
    assert(occProfile.aiAugmentationPotential >= 80, "AI Augmentation potential is high (>=80%)");
    assert(occProfile.humanCriticalRequirement >= 80, "Human critical requirement is high (>=80%)");
    assert(occProfile.tasks?.length >= 3, "Task-level evidence items populated");

    const dualEvidence = result.dualEvidenceSynthesis;
    assert(!!dualEvidence, "Dual evidence synthesis generated");
    assert(dualEvidence.alignmentHighlights?.length >= 3, "Alignment highlights generated");
    assert(dualEvidence.skillsWorthDeveloping?.length > 0, "Future skills development recommendations generated");
    assert(dualEvidence.counsellorDiscussionPrompts?.length >= 3, "Counsellor discussion prompts generated");

    // -------------------------------------------------------------
    // Test 7: Retest & Historical Result Preservation
    // -------------------------------------------------------------
    console.log("\n--- Group 7: Retest & Historical Result Preservation ---");

    const retestRes = await fetch(`${baseUrl}/assessments/AI_JOB_RISK_FINDER/retake`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1.token}`,
      },
      body: JSON.stringify({
        versionCode: "AI_JOB_RISK_FINDER_V1",
      }),
    });
    const retestData: any = await retestRes.json();
    assert(retestRes.status === 200, "Retest call returns 200");
    const newAttemptId = retestData.data?.attemptId || retestData.data?.attempt?.id;
    assert(!!newAttemptId && newAttemptId !== attemptId, "Retest creates a NEW attempt ID rather than overwriting old attempt");

    // Fetch previous result by original attempt ID
    const prevResultRes = await fetch(`${baseUrl}/assessments/results/${attemptId}`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const prevResultData: any = await prevResultRes.json();
    assert(prevResultRes.status === 200, "Previous result remains accessible by original attempt ID");
    assert(prevResultData.data?.studentReadinessIndex >= 85, "Previous result snapshot data is intact");

    console.log(`\n🎉 AI Job Risk Finder Test Results: ${passed} Passed, ${failed} Failed`);
    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ E2E test execution error:", err);
    process.exit(1);
  } finally {
    server.close();
    await closeDatabasePool();
  }
}

runAiJobRiskFinderE2ETests();
