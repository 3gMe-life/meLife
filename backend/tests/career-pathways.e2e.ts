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

    console.log("--- 3. Testing Student A (Analytical / Technical Profile) ---");
    const studentA = await createParticipant(`studentA_${timestamp}@melife.org`, "Aarav_Tech", 16);

    // Start assessment for Student A
    const startResA = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentA.token}` },
    });
    const startDataA = await startResA.json();
    const attemptIdA = startDataA.data.attemptId;
    assert(Boolean(attemptIdA), "Student A: Assessment attempt started successfully");

    const qResA = await fetch(`${baseUrl}/attempts/${attemptIdA}/questions?limit=104`, {
      headers: { Authorization: `Bearer ${studentA.token}` },
    });
    const qDataA = await qResA.json();
    const questionsA: any[] = qDataA.data.questions;

    // Student A: strongly like Investigative (I) & Realistic (R)
    for (let i = 0; i < questionsA.length; i += 10) {
      const batch = questionsA.slice(i, i + 10);
      await Promise.all(
        batch.map((q) => {
          let optionId = q.options?.[0]?.id;
          if (q.sectionCode === "interest" && (q.dimensionCode === "I" || q.dimensionCode === "R")) {
            const stronglyLike = q.options?.find((o: any) => o.optionKey === "4" || o.optionKey === "D");
            if (stronglyLike) optionId = stronglyLike.id;
          } else if (q.sectionCode === "aptitude") {
            const highOpt = q.options?.[q.options.length - 1];
            if (highOpt) optionId = highOpt.id;
          }
          return fetch(`${baseUrl}/attempts/${attemptIdA}/responses`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${studentA.token}`,
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

    const submitResA = await fetch(`${baseUrl}/attempts/${attemptIdA}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentA.token}` },
    });
    const submitDataA = await submitResA.json();
    assert(submitResA.status === 200 && submitDataA.success === true, "Student A: Assessment submitted and scored");

    const recResA = await fetch(`${baseUrl}/careers/recommendations?lang=en`, {
      headers: { Authorization: `Bearer ${studentA.token}` },
    });
    const recDataA = await recResA.json();
    assert(recResA.status === 200, "Student A: Recommendations query returns 200 OK");
    assert(recDataA.data.isAssessed === true, "Student A: Flagged isAssessed=true");

    const recsA = recDataA.data.recommendations;
    assert(recsA.length >= 10, "Student A: Returns calibrated recommendations list");
    const topRecA = recsA[0];

    // Assert 4-Pillar Score Breakdown
    assert(Boolean(topRecA.matchBreakdown), "Student A: Recommendation contains 4-pillar matchBreakdown");
    assert(
      typeof topRecA.matchBreakdown.interestScore === "number" &&
      typeof topRecA.matchBreakdown.skillScore === "number" &&
      typeof topRecA.matchBreakdown.aptitudeScore === "number" &&
      typeof topRecA.matchBreakdown.personalityScore === "number",
      "Student A: matchBreakdown contains all 4 distinct pillar scores"
    );

    // Assert strengthAlignment and developmentAreas
    assert(Array.isArray(topRecA.strengthAlignment) && topRecA.strengthAlignment.length > 0, "Student A: Returns strengthAlignment factors");
    assert(Array.isArray(topRecA.developmentAreas) && topRecA.developmentAreas.length > 0, "Student A: Returns developmentAreas targets");

    // Assert Non-Deterministic Exploratory Guidance Tone
    assert(
      topRecA.reasoning.summary.includes("suitable exploration area") ||
      topRecA.reasoning.summary.includes("may explore") ||
      topRecA.reasoning.summary.includes("aligns well"),
      "Student A: Uses non-deterministic exploratory guidance phrasing"
    );
    assert(
      !topRecA.reasoning.summary.includes("You will become") &&
      !topRecA.reasoning.summary.includes("You must be"),
      "Student A: Avoids deterministic prescriptive statements"
    );

    console.log("--- 4. Testing Student B (Creative / Design Profile) ---");
    const studentB = await createParticipant(`studentB_${timestamp}@melife.org`, "Maya_Design", 15);

    const startResB = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentB.token}` },
    });
    const startDataB = await startResB.json();
    const attemptIdB = startDataB.data.attemptId;

    const qResB = await fetch(`${baseUrl}/attempts/${attemptIdB}/questions?limit=104`, {
      headers: { Authorization: `Bearer ${studentB.token}` },
    });
    const qDataB = await qResB.json();
    const questionsB: any[] = qDataB.data.questions;

    // Student B: strongly like Artistic (A) & Social (S)
    for (let i = 0; i < questionsB.length; i += 10) {
      const batch = questionsB.slice(i, i + 10);
      await Promise.all(
        batch.map((q) => {
          let optionId = q.options?.[0]?.id;
          if (q.sectionCode === "interest" && (q.dimensionCode === "A" || q.dimensionCode === "S")) {
            const stronglyLike = q.options?.find((o: any) => o.optionKey === "4" || o.optionKey === "D");
            if (stronglyLike) optionId = stronglyLike.id;
          }
          return fetch(`${baseUrl}/attempts/${attemptIdB}/responses`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${studentB.token}`,
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

    await fetch(`${baseUrl}/attempts/${attemptIdB}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentB.token}` },
    });

    const recResB = await fetch(`${baseUrl}/careers/recommendations?lang=en`, {
      headers: { Authorization: `Bearer ${studentB.token}` },
    });
    const recDataB = await recResB.json();
    assert(recResB.status === 200, "Student B: Recommendations query returns 200 OK");
    const recsB = recDataB.data.recommendations;
    assert(recsB.length > 0, "Student B: Returns recommendations list");
    assert(Boolean(recsB[0].matchBreakdown), "Student B: Top match contains 4-pillar breakdown");

    console.log("--- 5. Testing Student C (Social / Leadership Profile) ---");
    const studentC = await createParticipant(`studentC_${timestamp}@melife.org`, "Kabir_Lead", 17);

    const startResC = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentC.token}` },
    });
    const startDataC = await startResC.json();
    const attemptIdC = startDataC.data.attemptId;

    const qResC = await fetch(`${baseUrl}/attempts/${attemptIdC}/questions?limit=104`, {
      headers: { Authorization: `Bearer ${studentC.token}` },
    });
    const qDataC = await qResC.json();
    const questionsC: any[] = qDataC.data.questions;

    // Student C: strongly like Enterprising (E) & Social (S)
    for (let i = 0; i < questionsC.length; i += 10) {
      const batch = questionsC.slice(i, i + 10);
      await Promise.all(
        batch.map((q) => {
          let optionId = q.options?.[0]?.id;
          if (q.sectionCode === "interest" && (q.dimensionCode === "E" || q.dimensionCode === "S")) {
            const stronglyLike = q.options?.find((o: any) => o.optionKey === "4" || o.optionKey === "D");
            if (stronglyLike) optionId = stronglyLike.id;
          }
          return fetch(`${baseUrl}/attempts/${attemptIdC}/responses`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${studentC.token}`,
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

    await fetch(`${baseUrl}/attempts/${attemptIdC}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentC.token}` },
    });

    const recResC = await fetch(`${baseUrl}/careers/recommendations?lang=en`, {
      headers: { Authorization: `Bearer ${studentC.token}` },
    });
    const recDataC = await recResC.json();
    assert(recResC.status === 200, "Student C: Recommendations query returns 200 OK");
    const recsC = recDataC.data.recommendations;
    assert(recsC.length > 0, "Student C: Returns recommendations list");

    console.log("--- 6. Testing Career Detail View & Learning Roadmap ---");
    const detailRes = await fetch(`${baseUrl}/careers/machine-learning-neural-architecture?lang=en`, {
      headers: { Authorization: `Bearer ${studentA.token}` },
    });
    const detailData = await detailRes.json();
    assert(detailRes.status === 200, "Fetch career detail by slug returns 200 OK");
    const detail = detailData.data;
    assert(detail.slug === "machine-learning-neural-architecture", "Detail has correct slug");
    assert(Array.isArray(detail.learningRoadmap) && detail.learningRoadmap.length >= 3, "Learning roadmap contains 3 structured milestones");
    assert(Array.isArray(detail.educationPaths) && detail.educationPaths.length > 0, "Contains educational pathways");
    assert(Array.isArray(detail.recommendedSubjects) && detail.recommendedSubjects.length > 0, "Contains recommended high school & college subjects");
    assert(Array.isArray(detail.sampleRoles) && detail.sampleRoles.length > 0, "Contains sample job roles");
    assert(Array.isArray(detail.relatedCareers), "Contains related careers array");

    console.log("--- 7. Testing Multilingual Localization Across Supported Languages ---");
    const mlRes = await fetch(`${baseUrl}/careers/machine-learning-neural-architecture?lang=ml`, {
      headers: { Authorization: `Bearer ${studentA.token}` },
    });
    const mlData = await mlRes.json();
    assert(mlRes.status === 200, "Fetch Malayalam translation returns 200 OK");
    assert(Boolean(mlData.data.title), "Malayalam title translated correctly");

    const hiRes = await fetch(`${baseUrl}/careers/machine-learning-neural-architecture?lang=hi`, {
      headers: { Authorization: `Bearer ${studentA.token}` },
    });
    const hiData = await hiRes.json();
    assert(hiRes.status === 200, "Fetch Hindi translation returns 200 OK");
    assert(Boolean(hiData.data.title), "Hindi title translated correctly");

    const arRes = await fetch(`${baseUrl}/careers/machine-learning-neural-architecture?lang=ar`, {
      headers: { Authorization: `Bearer ${studentA.token}` },
    });
    const arData = await arRes.json();
    assert(arRes.status === 200, "Fetch Arabic translation returns 200 OK");
    assert(Boolean(arData.data.title), "Arabic title translated correctly");

    console.log("--- 8. Testing Edge Cases & Security ---");
    const notFoundRes = await fetch(`${baseUrl}/careers/non-existent-career-slug-1234`, {
      headers: { Authorization: `Bearer ${studentA.token}` },
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
