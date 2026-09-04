import { connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { skillFinderQuestionSelectionService } from "../src/modules/assessments/services/skill-finder-question-selection.service";
import { skillFinderTranslationsService } from "../src/modules/assessments/services/skill-finder-translations.service";
import { reportRepository } from "../src/modules/reports/report.repository";
import { createApp } from "../src/app";
import http from "http";

async function runSkillFinderReportE2ETests() {
  console.log("🧪 Starting Skill Finder Report Generation System E2E Test Suite...\n");

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
    const createParticipant = async (email: string, firstName: string, age = 13) => {
      const regRes = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "Password123!",
          firstName,
          lastName: "ReportStudent",
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
          dateOfBirth: `${birthYear}-05-15`,
          educationStage: "SCHOOL",
          gradeLevel: "8",
          schoolName: "St. Xavier's International Academy",
          curriculumOrBoard: "CBSE",
          guardianName: "Parent of " + firstName,
          guardianPhone: "+91 98765 00000",
        }),
      });

      return { token, userId };
    };

    // 1. Setup Student 1 & Complete Assessment
    console.log("--- 1. Setting up Participant & Completing Skill Finder Assessment ---");
    const student1 = await createParticipant(`student1_${timestamp}@melife.org`, "Aarav", 13);
    const student2 = await createParticipant(`student2_${timestamp}@melife.org`, "Meera", 14);

    // Start assessment
    const startRes = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const startData = await startRes.json();
    assert(startRes.status === 201 || startRes.status === 200, "Student 1 starts Skill Finder attempt");
    const attemptId = startData.data.attemptId;

    // Fetch questions
    const qRes = await fetch(`${baseUrl}/attempts/${attemptId}/questions?limit=104`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const qData = await qRes.json();
    const questions: any[] = qData.data.questions;
    assert(questions.length > 0, "Retrieved attempt questions for submission");

    // Submit responses (simulate high technical/builder interest)
    for (const q of questions) {
      let optionId = q.options?.[0]?.id;
      if (q.sectionCode === "interest" && q.dimensionCode === "R") {
        const stronglyLike = q.options?.find((o: any) => o.optionKey === "4" || o.optionKey === "D");
        if (stronglyLike) optionId = stronglyLike.id;
      } else if (q.questionType.startsWith("mcq_")) {
        optionId = q.options?.[0]?.id;
      }
      await fetch(`${baseUrl}/attempts/${attemptId}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${student1.token}`,
        },
        body: JSON.stringify({
          questionId: q.id,
          selectedOptionId: optionId,
          responseValue: optionId ? "4" : "A",
        }),
      });
    }

    // Submit attempt to generate result
    const submitRes = await fetch(`${baseUrl}/attempts/${attemptId}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const submitData = await submitRes.json();
    assert(submitRes.status === 200 && submitData.success === true, "Student 1 attempt submitted & scored");
    const resultId = submitData.data.result.resultId;
    assert(Boolean(resultId), `Assessment result created with ID: ${resultId}`);

    // =========================================================================
    // 2. Report Generation via POST /api/v1/reports/generate/:resultId
    // =========================================================================
    console.log("\n--- 2. Testing Psychometric Report Synthesis & 8 Sections ---");
    const genRes = await fetch(`${baseUrl}/reports/generate/${resultId}?language=en`, {
      method: "POST",
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const genData = await genRes.json();
    assert(genRes.status === 201 || genRes.status === 200, "POST /reports/generate/:resultId returns 201/200");
    const reportDto = genData.data.report;
    const reportId = genData.data.reportId;
    assert(Boolean(reportId), `Report successfully synthesized with reportId: ${reportId}`);

    // Section 1: Student Profile Validation
    const profile = reportDto.studentProfile;
    assert(profile.studentName === "Aarav ReportStudent", "Section 1: Student profile contains student name");
    assert(profile.age === 13, "Section 1: Student profile contains derived age (13 yrs)");
    assert(profile.educationStage.includes("Grade 8") || profile.gradeLevel === "8", "Section 1: Profile contains Grade 8");
    assert(profile.schoolName === "St. Xavier's International Academy", "Section 1: Profile contains School Name");
    assert(Boolean(profile.completedAt), "Section 1: Profile contains evaluation completion timestamp");

    // Section 2: Executive Learning Profile Summary
    const execSummary = reportDto.executiveSummary;
    assert(Boolean(execSummary.archetypeTitle), `Section 2: Archetype generated: "${execSummary.archetypeTitle}"`);
    assert(Boolean(execSummary.tagline), `Section 2: Tagline present: "${execSummary.tagline}"`);
    assert(Boolean(execSummary.strengthSummary), "Section 2: Strength summary present");
    assert(
      !execSummary.explorationFraming.includes("You must be an engineer") &&
      !execSummary.explorationFraming.includes("You are an engineer"),
      "Section 2: Exploration framing uses non-prescriptive, exploration-based language"
    );
    assert(execSummary.primaryTraits?.length >= 3, "Section 2: Primary cognitive traits present");

    // Section 3: Interest Profile (Holland RIASEC)
    const interest = reportDto.interestProfile;
    assert(interest.topClusters?.length >= 3, "Section 3: Top 3 RIASEC affinity clusters present");
    assert(interest.dimensions?.length === 6, "Section 3: All 6 RIASEC dimensions scored");
    assert(interest.dimensions.every((d: any) => typeof d.scalePositionPercentage === "number"), "Section 3: RIASEC percentage scales computed");

    // Section 4: Skill Behaviour Profile
    const skills = reportDto.skillBehaviour;
    assert(skills.strongestIndicators?.length === 3, "Section 4: Top 3 strongest behavioural indicators present");
    assert(skills.developmentOpportunities?.length === 2, "Section 4: 2 high-potential growth opportunities present");
    assert(skills.dimensions?.length === 8, "Section 4: All 8 skill behaviour dimensions scored");

    // Section 5: Demonstrated Cognitive Aptitude
    const aptitude = reportDto.aptitudeInsights;
    assert(typeof aptitude.overallAccuracyPercentage === "number", `Section 5: Demonstrated accuracy: ${aptitude.overallAccuracyPercentage}%`);
    assert(aptitude.dimensions?.length === 8, "Section 5: All 8 cognitive task domains present");

    // Section 6: Developmental Strengths & Learning Habits
    const dev = reportDto.developmentalStrengths;
    assert(dev.dimensions?.length === 7, "Section 6: All 7 learning habits dimensions present");
    assert(dev.growthSuggestions?.length >= 3, "Section 6: Actionable growth suggestions present");

    // Section 7: Recommended Exploration Pathways
    const exploration = reportDto.explorationAreas;
    assert(exploration.clusters?.length >= 2, "Section 7: Curated exploration pathways present");
    assert(exploration.clusters.every((c: any) => c.sampleFocusAreas?.length > 0 && c.suggestedProjectsAndActivities?.length > 0), "Section 7: Focus areas and hands-on activities present for each pathway");
    assert(Boolean(exploration.framingDisclaimer), "Section 7: Non-prescriptive exploration disclaimer present");

    // Section 8: Parent & Educator Guidance
    const parentGuidance = reportDto.parentGuidance;
    assert(Boolean(parentGuidance.nurturingMindsetSummary), "Section 8: Nurturing mindset summary present");
    assert(parentGuidance.dos?.length >= 3, "Section 8: Constructive DOs present");
    assert(parentGuidance.donts?.length >= 3, "Section 8: Non-judgmental DON'Ts present");
    assert(parentGuidance.recommendedDiscussions?.length >= 2, "Section 8: Empathetic conversation starters present");

    // =========================================================================
    // 3. Multilingual Localization & Language Switching
    // =========================================================================
    console.log("\n--- 3. Testing Multilingual Report Generation & Switching ---");
    const languagesToTest = [
      { code: "ml", expectedHeaderWord: "സ്കിൽ" },
      { code: "hi", expectedHeaderWord: "स्किल" },
      { code: "ar", expectedHeaderWord: "التقييم" },
      { code: "ta", expectedHeaderWord: "ஸ்கில்" },
      { code: "kn", expectedHeaderWord: "ಸ್ಕಿಲ್" },
    ];

    for (const lang of languagesToTest) {
      const langRes = await fetch(`${baseUrl}/reports/generate/${resultId}?language=${lang.code}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${student1.token}` },
      });
      const langData = await langRes.json();
      assert(langRes.status === 201 || langRes.status === 200, `Generated localized report in [${lang.code.toUpperCase()}]`);
      assert(langData.data.language === lang.code, `Report language tagged as [${lang.code}]`);
      assert(langData.data.report.parentGuidance?.dos?.length > 0, `Localized parent guidance populated for [${lang.code}]`);
    }

    // =========================================================================
    // 4. Report Retrieval Endpoints
    // =========================================================================
    console.log("\n--- 4. Testing Report Retrieval Endpoints ---");
    // GET by reportId
    const getReportRes = await fetch(`${baseUrl}/reports/${reportId}`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const getReportData = await getReportRes.json();
    assert(getReportRes.status === 200 && getReportData.data.reportId === reportId, "GET /reports/:reportId returns report");

    // GET by resultId
    const getResultReportRes = await fetch(`${baseUrl}/reports/result/${resultId}`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const getResultReportData = await getResultReportRes.json();
    assert(getResultReportRes.status === 200 && getResultReportData.data.resultId === resultId, "GET /reports/result/:resultId returns report");

    // GET latest report for participant
    const getLatestRes = await fetch(`${baseUrl}/reports/participant/latest?assessmentCode=SKILL_FINDER`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    const getLatestData = await getLatestRes.json();
    assert(getLatestRes.status === 200 && getLatestData.data.resultId === resultId, "GET /reports/participant/latest returns latest report");

    // =========================================================================
    // 5. Secure PDF Generation & Streaming Download
    // =========================================================================
    console.log("\n--- 5. Testing Secure PDF Generation & Binary Streaming ---");
    const downloadRes = await fetch(`${baseUrl}/reports/${reportId}/download?language=en`, {
      headers: { Authorization: `Bearer ${student1.token}` },
    });
    assert(downloadRes.status === 200, "GET /reports/:reportId/download returns 200 OK");
    assert(downloadRes.headers.get("content-type") === "application/pdf", "Content-Type header is application/pdf");
    assert(Boolean(downloadRes.headers.get("content-disposition")), "Content-Disposition header is set for file download");

    const pdfArrayBuffer = await downloadRes.arrayBuffer();
    const pdfBuffer = Buffer.from(pdfArrayBuffer);
    assert(pdfBuffer.length > 500, `PDF generated with binary size: ${pdfBuffer.length} bytes`);
    assert(pdfBuffer.toString("utf8", 0, 5) === "%PDF-", "PDF file header has valid '%PDF-' magic bytes");

    // =========================================================================
    // 6. Security & Permission Isolation
    // =========================================================================
    console.log("\n--- 6. Testing Role Guarding & Ownership Isolation ---");
    // Unauthenticated
    const unauthRes = await fetch(`${baseUrl}/reports/${reportId}`);
    assert(unauthRes.status === 401, "Unauthenticated request returns 401 Unauthorized");

    // Cross-participant unauthorized access (Student 2 trying to access Student 1's report)
    const crossAccessRes = await fetch(`${baseUrl}/reports/${reportId}`, {
      headers: { Authorization: `Bearer ${student2.token}` },
    });
    assert(crossAccessRes.status === 403, "Student 2 accessing Student 1's report returns 403 Forbidden");

    const crossDownloadRes = await fetch(`${baseUrl}/reports/${reportId}/download`, {
      headers: { Authorization: `Bearer ${student2.token}` },
    });
    assert(crossDownloadRes.status === 403, "Student 2 downloading Student 1's PDF returns 403 Forbidden");

  } catch (error) {
    console.error("❌ Unexpected error during E2E test execution:", error);
    failed++;
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await closeDatabasePool();

    console.log("\n==================================================");
    console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log("==================================================");

    if (failed > 0) {
      process.exit(1);
    }
  }
}

runSkillFinderReportE2ETests();
