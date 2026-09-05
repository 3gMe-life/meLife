import { connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { skillFinderQuestionSelectionService } from "../src/modules/assessments/services/skill-finder-question-selection.service";
import { skillFinderTranslationsService } from "../src/modules/assessments/services/skill-finder-translations.service";
import { reportRepository } from "../src/modules/reports/report.repository";
import { careerRepository } from "../src/modules/careers/career.repository";
import { counsellingRepository } from "../src/modules/counselling/counselling.repository";
import { careerReportRepository } from "../src/modules/careers/reports/career-report.repository";
import { createApp } from "../src/app";
import http from "http";

async function runCareerReportsE2ETests() {
  console.log("🧪 Starting Career Guidance Report Module E2E Test Suite...\n");

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
  await careerReportRepository.initSchema();
  await counsellingRepository.initSchema();
  await counsellingRepository.seedCounsellors();

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

    // 1. Helper: Register user and onboard
    const createParticipant = async (email: string, firstName: string, age = 15) => {
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
      const regData = await regRes.json();
      const token = regData.data.accessToken;
      const userId = regData.data.user.id;

      // Onboard
      const birthYear = new Date().getFullYear() - age;
      await fetch(`${baseUrl}/participant/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dateOfBirth: `${birthYear}-05-15`,
          educationStage: "SCHOOL",
          gradeLevel: "10",
          schoolName: "St. Thomas Academy",
          curriculumOrBoard: "CBSE",
          guardianName: "Parent of " + firstName,
          guardianPhone: "+91 98765 43210",
        }),
      });

      return { token, userId, email };
    };

    // 2. Helper: Complete assessment for a student
    const completeAssessment = async (token: string) => {
      const startRes = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const startData = await startRes.json();
      const attemptId = startData.data.attemptId;

      const qRes = await fetch(`${baseUrl}/attempts/${attemptId}/questions?limit=104`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const qData = await qRes.json();
      const questions: any[] = qData.data.questions || [];

      // Answer questions in batches
      const batchSize = 10;
      for (let i = 0; i < questions.length; i += batchSize) {
        const batch = questions.slice(i, i + batchSize);
        await Promise.all(
          batch.map((q) => {
            let optionId = q.options?.[0]?.id;
            let responseValue = "5";
            if (q.options && q.options.length > 0) {
              const opt = q.options[0];
              optionId = opt.id;
              responseValue = opt.optionKey || opt.option_key || "A";
            }
            return fetch(`${baseUrl}/attempts/${attemptId}/responses`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                questionId: q.id,
                responseValue,
                selectedOptionId: optionId,
              }),
            });
          })
        );
      }

      const submitRes = await fetch(`${baseUrl}/attempts/${attemptId}/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const submitData = await submitRes.json();
      return { attemptId, resultId: submitData.data?.resultId };
    };

    // ============================================================
    // TEST 1: Report Generation for Assessed Student (10 Sections)
    // ============================================================
    console.log("--- 1. Testing Career Report Generation for Assessed Student ---");
    const student1 = await createParticipant(`student_rep1_${timestamp}@melife.test`, "Aarav", 15);
    await completeAssessment(student1.token);

    const genRes = await fetch(`${baseUrl}/career-reports/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1.token}`,
      },
      body: JSON.stringify({ languageCode: "en" }),
    });

    const genData = await genRes.json();
    assert(genRes.status === 200 && genData.success === true, "POST /api/v1/career-reports/generate returns 200 OK");
    const rep = genData.data;

    // Cover Page Validation
    assert(Boolean(rep.cover?.studentName.includes("Aarav")), "Section 1: Cover contains student name");
    assert(Boolean(rep.cover?.profileArchetype), "Section 1: Cover contains profile archetype");
    assert(Boolean(rep.cover?.gradeLevel), "Section 1: Cover contains grade level");

    // Executive Summary Validation
    assert(Boolean(rep.executiveSummary?.summary), "Section 2: Executive summary synthesis generated");
    assert(Array.isArray(rep.executiveSummary?.topStrengths) && rep.executiveSummary.topStrengths.length > 0, "Section 2: Executive summary top strengths present");

    // RIASEC Psychometric Profile Validation
    assert(Array.isArray(rep.psychometricProfile?.interestClusters) && rep.psychometricProfile.interestClusters.length === 6, "Section 3: RIASEC 6 interest clusters generated");
    assert(Boolean(rep.psychometricProfile?.primaryOrientation), "Section 3: Primary orientation identified");

    // Strength Analysis (3-way impact) Validation
    assert(Array.isArray(rep.strengthAnalysis) && rep.strengthAnalysis.length >= 4, "Section 4: 4 cognitive strengths analyzed");
    assert(
      Boolean(rep.strengthAnalysis[0]?.whatItMeans) &&
      Boolean(rep.strengthAnalysis[0]?.howItHelpsLearning) &&
      Boolean(rep.strengthAnalysis[0]?.howItConnectsWithCareers),
      "Section 4: 3-way exploration impact breakdown complete"
    );

    // Career Matches Validation
    assert(Array.isArray(rep.careerMatches) && rep.careerMatches.length >= 3, "Section 5: Ranked career pathway matches generated");
    assert(Boolean(rep.careerMatches[0]?.whyThisMatches?.summary), "Section 5: Alignment reasoning provided");

    // Top 3 Deep Dives Validation
    assert(Array.isArray(rep.careerDeepDives) && rep.careerDeepDives.length === 3, "Section 6: Top 3 focus pathways deep dives present");
    assert(Array.isArray(rep.careerDeepDives[0]?.learningRoadmap) && rep.careerDeepDives[0].learningRoadmap.length >= 3, "Section 6: 4-stage educational roadmap present");

    // Alternative Pathways & Development Plan Validation
    assert(Array.isArray(rep.alternativePathways) && rep.alternativePathways.length > 0, "Section 7: Alternative pathways populated");
    assert(Array.isArray(rep.developmentPlan?.skillsToStrengthen) && rep.developmentPlan.skillsToStrengthen.length > 0, "Section 8: Actionable development plan populated");

    // Parent Guidance Framework Validation
    assert(Boolean(rep.parentGuidance?.nurturingMindset), "Section 9: Parent nurturing mindset guidance present");
    assert(Array.isArray(rep.parentGuidance?.recommendedDiscussions) && rep.parentGuidance.recommendedDiscussions.length > 0, "Section 9: Discussion starters present");

    // ============================================================
    // TEST 2: Student Privacy Firewall (Section 10 Hidden)
    // ============================================================
    console.log("\n--- 2. Testing Privacy Firewall for Student View ---");
    assert(rep.counsellorInsights === undefined, "Privacy Firewall: Section 10 (Counsellor Insights) is stripped from Student payload");

    // ============================================================
    // TEST 3: Counsellor View (Section 10 Visible)
    // ============================================================
    console.log("\n--- 3. Testing Counsellor Access with Section 10 Insights ---");
    // Login as default seed counsellor
    const counsLogin = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "anjali.menon@melife.org",
        password: "Password123!",
      }),
    });
    const counsData = await counsLogin.json();
    const counsToken = counsData.data?.accessToken;

    assert(Boolean(counsToken), "Counsellor authenticated successfully");

    const counsRepRes = await fetch(`${baseUrl}/career-reports/student/${student1.userId}`, {
      headers: { Authorization: `Bearer ${counsToken}` },
    });
    const counsRepData = await counsRepRes.json();

    assert(counsRepRes.status === 200, "GET /api/v1/career-reports/student/:studentId returns 200 OK for Counsellor");
    assert(Boolean(counsRepData.data?.counsellorInsights), "Counsellor View: Section 10 (Counsellor Insights) is included");
    assert(
      Array.isArray(counsRepData.data?.counsellorInsights?.detailedDimensionScores) &&
      counsRepData.data.counsellorInsights.detailedDimensionScores.length > 0,
      "Section 10: Dimensional scale distribution scores present"
    );
    assert(
      Array.isArray(counsRepData.data?.counsellorInsights?.assessmentObservations) &&
      counsRepData.data.counsellorInsights.assessmentObservations.length > 0,
      "Section 10: Assessor diagnostic observations present"
    );

    // ============================================================
    // TEST 4: Multilingual Support (Malayalam & Hindi)
    // ============================================================
    console.log("\n--- 4. Testing Multilingual Career Report Generation ---");
    const mlRepRes = await fetch(`${baseUrl}/career-reports/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1.token}`,
      },
      body: JSON.stringify({ languageCode: "ml", forceRegenerate: true }),
    });
    const mlData = await mlRepRes.json();
    assert(mlRepRes.status === 200, "POST /career-reports/generate (Malayalam) returns 200 OK");
    assert(
      mlData.data?.cover?.reportTitle?.includes("സൈക്കോമെട്രിക്"),
      "Malayalam Report: Localized title rendered correctly"
    );

    // ============================================================
    // TEST 5: Unassessed Student Exploration Preview
    // ============================================================
    console.log("\n--- 5. Testing Unassessed Student Exploration Fallback ---");
    const unassessed = await createParticipant(`unassessed_${timestamp}@melife.test`, "Kavya", 14);
    const unassessedRes = await fetch(`${baseUrl}/career-reports/latest`, {
      headers: { Authorization: `Bearer ${unassessed.token}` },
    });
    const unassessedData = await unassessedRes.json();

    assert(unassessedRes.status === 200, "GET /career-reports/latest for unassessed student returns 200 OK");
    assert(unassessedData.data?.isAssessed === false, "Unassessed Student: isAssessed flagged false with foundational exploration preview");

    // ============================================================
    // TEST 6: Vector PDF Streaming Endpoint
    // ============================================================
    console.log("\n--- 6. Testing Vector PDF Streaming Endpoint ---");
    const pdfRes = await fetch(`${baseUrl}/career-reports/${rep.reportId}/pdf`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });

    assert(pdfRes.status === 200, "GET /career-reports/:id/pdf returns 200 OK");
    assert(
      pdfRes.headers.get("content-type")?.includes("application/pdf") || false,
      "PDF Streaming: Content-Type is application/pdf"
    );

    const pdfBuffer = await pdfRes.arrayBuffer();
    assert(pdfBuffer.byteLength > 1000, `PDF Streaming: Received valid binary buffer (${pdfBuffer.byteLength} bytes)`);

    console.log(`\n==================================================`);
    console.log(`📊 Career Reports Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`==================================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("💥 Unhandled exception during Career Reports test suite:", err);
    process.exit(1);
  } finally {
    server.close();
    await closeDatabasePool();
  }
}

runCareerReportsE2ETests();
