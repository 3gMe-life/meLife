import { connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { skillFinderQuestionSelectionService } from "../src/modules/assessments/services/skill-finder-question-selection.service";
import { skillFinderTranslationsService } from "../src/modules/assessments/services/skill-finder-translations.service";
import { reportRepository } from "../src/modules/reports/report.repository";
import { careerRepository } from "../src/modules/careers/career.repository";
import { createApp } from "../src/app";
import http from "http";

async function runCareerPathwaysE2ETests() {
  console.log("🧪 Starting Career Pathways & Psychometric Mapping E2E Test Suite...\n");

  await connectDatabase();
  await authRepository.seedRolePermissions();
  await participantRepository.initSchema();
  await assessmentRepository.initSchema();
  await assessmentRepository.seedCatalog();
  await assessmentContentRepository.initSchema();
  await assessmentContentRepository.seedSkillFinderContent();
  await skillFinderQuestionSelectionService.seedSkillFinderVersions();
  await skillFinderTranslationsService.seedSkillFinderTranslations();
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
    const createParticipant = async (email: string, firstName: string, age = 14) => {
      const regRes = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "Password123!",
          firstName,
          lastName: "PathwaysStudent",
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
          curriculumOrBoard: "ICSE",
          guardianName: "Parent of " + firstName,
          guardianPhone: "+91 98765 43210",
        }),
      });

      return { token, userId };
    };

    console.log("--- 1. Testing Career Catalog Discovery & Seed Library ---");
    const unassessedStudent = await createParticipant(`unassessed_${timestamp}@melife.org`, "Rohan", 14);

    const allCareersRes = await fetch(`${baseUrl}/careers?lang=en`, {
      headers: { Authorization: `Bearer ${unassessedStudent.token}` },
    });
    const allCareersData = await allCareersRes.json();
    assert(allCareersRes.status === 200, "Fetch all careers returns 200 OK");
    assert(Array.isArray(allCareersData.data) && allCareersData.data.length >= 12, "Curated library contains at least 12 career pathways");

    console.log("--- 2. Testing Unassessed Participant Recommendations ---");
    const unassessedRecRes = await fetch(`${baseUrl}/careers/recommendations?lang=en`, {
      headers: { Authorization: `Bearer ${unassessedStudent.token}` },
    });
    const unassessedRecData = await unassessedRecRes.json();
    assert(unassessedRecRes.status === 200, "Fetch recommendations for unassessed returns 200 OK");
    assert(unassessedRecData.data.isAssessed === false, "Unassessed participant correctly flagged isAssessed=false");
    assert(unassessedRecData.data.recommendations.length > 0, "Returns exploratory career pathways for unassessed participant");

    console.log("--- 3. Completing Skill Finder Assessment for Student ---");
    const assessedStudent = await createParticipant(`assessed_${timestamp}@melife.org`, "Ananya", 15);

    // Start assessment
    const startRes = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${assessedStudent.token}` },
    });
    const startData = await startRes.json();
    const attemptId = startData.data.attemptId;
    assert(Boolean(attemptId), "Assessment attempt started successfully");

    // Fetch questions
    const qRes = await fetch(`${baseUrl}/attempts/${attemptId}/questions?limit=104`, {
      headers: { Authorization: `Bearer ${assessedStudent.token}` },
    });
    const qData = await qRes.json();
    const questions: any[] = qData.data.questions;
    assert(Array.isArray(questions) && questions.length > 0, "Attempt questions loaded");

    // Submit responses concurrently in batches of 10
    const batchSize = 10;
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      await Promise.all(
        batch.map((q) => {
          let optionId = q.options?.[0]?.id;
          if (q.sectionCode === "interest" && (q.dimensionCode === "I" || q.dimensionCode === "R")) {
            const stronglyLike = q.options?.find((o: any) => o.optionKey === "4" || o.optionKey === "D");
            if (stronglyLike) optionId = stronglyLike.id;
          }
          return fetch(`${baseUrl}/attempts/${attemptId}/responses`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${assessedStudent.token}`,
            },
            body: JSON.stringify({
              questionId: q.id,
              selectedOptionId: optionId,
              responseValue: optionId ? "4" : "A",
            }),
          });
        })
      );
    }

    // Submit attempt to calculate score and results
    const submitRes = await fetch(`${baseUrl}/attempts/${attemptId}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${assessedStudent.token}` },
    });
    const submitData = await submitRes.json();
    assert(submitRes.status === 200 && submitData.success === true, "Assessment submitted and scored successfully");

    console.log("--- 4. Testing Personalized Psychometric Career Matching ---");
    const assessedRecRes = await fetch(`${baseUrl}/careers/recommendations?lang=en`, {
      headers: { Authorization: `Bearer ${assessedStudent.token}` },
    });
    const assessedRecData = await assessedRecRes.json();
    assert(assessedRecRes.status === 200, "Recommendations query returns 200 OK");
    assert(assessedRecData.data.isAssessed === true, "Assessed participant flagged isAssessed=true");

    const recs = assessedRecData.data.recommendations;
    assert(recs.length >= 10, "Returns calibrated recommendations list");
    assert(recs[0].matchPercentage >= recs[1].matchPercentage, "Recommendations are sorted by matchPercentage descending");

    // Check dynamic AI explanation layer
    const topRec = recs[0];
    assert(Boolean(topRec.reasoning), "Top recommendation contains reasoning object");
    assert(typeof topRec.reasoning.summary === "string" && topRec.reasoning.summary.length > 20, "Reasoning summary is descriptive and non-predictive");
    assert(Array.isArray(topRec.reasoning.topMatchingFactors) && topRec.reasoning.topMatchingFactors.length > 0, "Reasoning includes top matching factor breakdown");
    assert(typeof topRec.reasoning.alignmentNote === "string", "Reasoning includes psychometric alignment note");

    console.log("--- 5. Testing Career Detail View & Learning Roadmap ---");
    const detailRes = await fetch(`${baseUrl}/careers/ai-machine-learning-architect?lang=en`, {
      headers: { Authorization: `Bearer ${assessedStudent.token}` },
    });
    const detailData = await detailRes.json();
    assert(detailRes.status === 200, "Fetch career detail by slug returns 200 OK");
    const detail = detailData.data;
    assert(detail.slug === "ai-machine-learning-architect", "Detail has correct slug");
    assert(Array.isArray(detail.learningRoadmap) && detail.learningRoadmap.length >= 3, "Learning roadmap contains 3 structured milestones");
    assert(Array.isArray(detail.educationPaths) && detail.educationPaths.length > 0, "Contains educational pathways");
    assert(Array.isArray(detail.recommendedSubjects) && detail.recommendedSubjects.length > 0, "Contains recommended high school & college subjects");
    assert(Array.isArray(detail.sampleRoles) && detail.sampleRoles.length > 0, "Contains sample job roles");
    assert(Array.isArray(detail.relatedCareers) && detail.relatedCareers.length > 0, "Contains related careers");

    console.log("--- 6. Testing Multilingual Localization Across Supported Languages ---");
    const mlRes = await fetch(`${baseUrl}/careers/ai-machine-learning-architect?lang=ml`, {
      headers: { Authorization: `Bearer ${assessedStudent.token}` },
    });
    const mlData = await mlRes.json();
    assert(mlRes.status === 200, "Fetch Malayalam translation returns 200 OK");
    assert(mlData.data.title.includes("എഐ") || mlData.data.title.includes("മെഷീൻ ലേണിംഗ്") || mlData.data.title.includes("ആർക്കിടെക്റ്റ്"), "Malayalam title translated correctly");

    const hiRes = await fetch(`${baseUrl}/careers/ai-machine-learning-architect?lang=hi`, {
      headers: { Authorization: `Bearer ${assessedStudent.token}` },
    });
    const hiData = await hiRes.json();
    assert(hiRes.status === 200, "Fetch Hindi translation returns 200 OK");
    assert(hiData.data.title.includes("एआई") || hiData.data.title.includes("आर्किटेक्ट"), "Hindi title translated correctly");

    const arRes = await fetch(`${baseUrl}/careers/ai-machine-learning-architect?lang=ar`, {
      headers: { Authorization: `Bearer ${assessedStudent.token}` },
    });
    const arData = await arRes.json();
    assert(arRes.status === 200, "Fetch Arabic translation returns 200 OK");
    assert(arData.data.title.includes("مهندس") || arData.data.title.includes("الاصطناعي") || arData.data.title.includes("معماري"), "Arabic title translated correctly");

    console.log("--- 7. Testing Edge Cases & Security ---");
    const notFoundRes = await fetch(`${baseUrl}/careers/non-existent-career-slug-1234`, {
      headers: { Authorization: `Bearer ${assessedStudent.token}` },
    });
    assert(notFoundRes.status === 404, "Non-existent career returns 404 Not Found");

    const unauthRes = await fetch(`${baseUrl}/careers/recommendations`, {
      headers: {},
    });
    assert(unauthRes.status === 401, "Unauthenticated recommendations request returns 401 Unauthorized");

  } catch (error) {
    console.error("Test execution encountered an error:", error);
    failed++;
  } finally {
    server.close();
    await closeDatabasePool();
  }

  console.log(`\n==================================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`==================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runCareerPathwaysE2ETests();
