import { pool, connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { skillFinderQuestionSelectionService } from "../src/modules/assessments/services/skill-finder-question-selection.service";
import { skillFinderTranslationsService } from "../src/modules/assessments/services/skill-finder-translations.service";
import { createApp } from "../src/app";
import http from "http";

async function runSkillFinderI18nE2ETests() {
  console.log("🧪 Starting Skill Finder Multilingual Language Switching E2E Test Suite...\n");

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
    // 1. Register test participant
    const email = `i18n.tester.${Date.now()}@example.com`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password: "Password123!",
        firstName: "Anjali",
        lastName: "Menon",
        registrationPath: "STUDENT",
      }),
    });
    const regJson = await regRes.json();
    assert(regRes.status === 201, "Registration: Successfully created participant account (201)");
    const token = regJson.data.accessToken;

    // 2. Complete Onboarding
    const birthYear = new Date().getFullYear() - 12;
    const onbRes = await fetch(`${baseUrl}/participant/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        dateOfBirth: `${birthYear}-05-15`,
        educationStage: "SCHOOL",
        gradeLevel: "7",
        guardianName: "Suresh Menon",
        guardianPhone: "+91 98765 43210",
      }),
    });
    assert(onbRes.status === 200, "Onboarding: Participant onboarded successfully (200)");

    // 3. Start Assessment Attempt
    const startRes = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const startJson = await startRes.json();
    assert(startRes.status === 200, "Attempt: Started Skill Finder assessment attempt");
    const attemptId = startJson.data.attemptId;

    // 4. Fetch Questions in English ('en')
    const enRes = await fetch(`${baseUrl}/attempts/${attemptId}/questions?language=en`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const enJson = await enRes.json();
    assert(enRes.status === 200, "English: Successfully retrieved questions with ?language=en");
    assert(enJson.data.currentLanguage === "en", "Metadata: currentLanguage is 'en'");
    assert(enJson.data.supportedLanguages.length >= 6, "Metadata: Contains all 6 supported languages");

    const q1En = enJson.data.questions[0];
    const opt4En = q1En.options.find((o: any) => o.optionKey === "4");
    assert(
      q1En.questionText.includes("building") || q1En.questionText.includes("fixing"),
      "English Content: Q1 contains English question prompt ('I enjoy building...')"
    );
    assert(
      opt4En.optionText.includes("Very much like me"),
      "English Content: Option 4 contains 'Very much like me'"
    );

    // 5. Answer Q1 in English
    const ans1Res = await fetch(`${baseUrl}/attempts/${attemptId}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questionId: q1En.id,
        selectedOptionId: opt4En.id,
        responseValue: "4",
      }),
    });
    assert(ans1Res.status === 200, "Answer Engine: Saved Q1 answer with option 4 in English");

    // 6. Switch Language to Malayalam ('ml') and Verify Content & Preserved State
    const mlRes = await fetch(`${baseUrl}/attempts/${attemptId}/questions?language=ml`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const mlJson = await mlRes.json();
    assert(mlRes.status === 200, "Malayalam: Successfully retrieved questions with ?language=ml");
    assert(mlJson.data.currentLanguage === "ml", "Metadata: currentLanguage switched to 'ml'");

    const q1Ml = mlJson.data.questions[0];
    assert(q1Ml.id === q1En.id, "Integrity: Question ID is identical across languages");
    assert(
      q1Ml.questionText.includes("നിർമ്മിക്കാനും") || q1Ml.questionText.includes("വസ്തുക്കൾ"),
      "Malayalam Content: Q1 question text is translated to Malayalam"
    );

    const opt4Ml = q1Ml.options.find((o: any) => o.optionKey === "4");
    assert(opt4Ml.id === opt4En.id, "Integrity: Option ID is identical across languages");
    assert(
      opt4Ml.optionText.includes("തികച്ചും ബാധകം"),
      "Malayalam Content: Option 4 translated to 'തികച്ചും ബാധകം'"
    );

    assert(
      q1Ml.currentResponse?.responseValue === "4",
      "State Preservation: Selected response '4' preserved in Malayalam"
    );
    assert(
      q1Ml.currentResponse?.selectedOptionId === opt4En.id,
      "State Preservation: Selected option ID preserved in Malayalam"
    );

    // 7. Answer Q2 while viewing in Malayalam
    const q2Ml = mlJson.data.questions[1];
    const opt3Ml = q2Ml.options.find((o: any) => o.optionKey === "3");
    const ans2Res = await fetch(`${baseUrl}/attempts/${attemptId}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questionId: q2Ml.id,
        selectedOptionId: opt3Ml.id,
        responseValue: "3",
      }),
    });
    assert(ans2Res.status === 200, "Answer Engine: Saved Q2 answer while viewing in Malayalam");

    // 8. Switch to Hindi ('hi') and Verify
    const hiRes = await fetch(`${baseUrl}/attempts/${attemptId}/questions?language=hi`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const hiJson = await hiRes.json();
    assert(hiRes.status === 200, "Hindi: Successfully retrieved questions with ?language=hi");
    const q1Hi = hiJson.data.questions[0];
    const q2Hi = hiJson.data.questions[1];
    assert(
      q1Hi.questionText.includes("मशीनों") || q1Hi.questionText.includes("उपकरणों"),
      "Hindi Content: Q1 question text is in Devanagari Hindi"
    );
    assert(
      q1Hi.currentResponse?.responseValue === "4" && q2Hi.currentResponse?.responseValue === "3",
      "State Preservation: Q1 and Q2 responses preserved when viewing in Hindi"
    );

    // 9. Switch to Arabic ('ar') and Verify Sections and Direction
    const arRes = await fetch(`${baseUrl}/attempts/${attemptId}/questions?language=ar`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const arJson = await arRes.json();
    assert(arRes.status === 200, "Arabic: Successfully retrieved questions with ?language=ar");
    const q1Ar = arJson.data.questions[0];
    assert(
      q1Ar.questionText.includes("الميكانيكية") || q1Ar.questionText.includes("الأجهزة"),
      "Arabic Content: Q1 question text is in Arabic"
    );
    assert(
      arJson.data.sections[0].name.includes("القسم"),
      "Arabic Content: Section title translated into Arabic"
    );

    // 10. Fallback Testing: Query with unknown language code
    const fallbackRes = await fetch(`${baseUrl}/attempts/${attemptId}/questions?language=es`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const fallbackJson = await fallbackRes.json();
    assert(fallbackRes.status === 200, "Fallback: Unsupported language code returns 200 gracefully");
    assert(
      fallbackJson.data.questions[0].questionText.length > 0,
      "Fallback: Returns valid fallback question text without crashing"
    );

    // 11. Security Audit: Check that no scoring rubrics or answer keys are exposed
    const allQuestions = arJson.data.questions;
    let leakedSecrets = false;
    for (const q of allQuestions) {
      if ((q as any).correctKey !== undefined || (q as any).scoreValue !== undefined) {
        leakedSecrets = true;
      }
      for (const opt of q.options) {
        if ((opt as any).scoreValue !== undefined) {
          leakedSecrets = true;
        }
      }
    }
    assert(!leakedSecrets, "Security: Zero scoring rubrics, correct keys, or option scores leaked");

    // 12. Complete and Submit Assessment Attempt
    for (let i = 2; i < enJson.data.questions.length; i++) {
      const q = enJson.data.questions[i];
      const opt = q.options[0];
      await fetch(`${baseUrl}/attempts/${attemptId}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: q.id,
          selectedOptionId: opt ? opt.id : null,
          responseValue: opt ? opt.optionKey : "Sample response",
        }),
      });
    }

    const submitRes = await fetch(`${baseUrl}/attempts/${attemptId}/submit`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const submitJson = await submitRes.json();
    assert(submitRes.status === 200, "Submission: Successfully finalized and scored attempt");
    const result = submitJson.data.result;
    assert(
      result.interestDiscovery?.dimensions?.length === 6,
      "Psychometric Scoring: All 6 RIASEC domains evaluated accurately"
    );
    assert(
      result.interestDiscovery?.topClusters?.length === 3,
      "Psychometric Scoring: Top 3 interest clusters identified"
    );
    assert(
      Array.isArray(result.growthSuggestions) && result.growthSuggestions.length >= 2,
      "Psychometric Scoring: Growth suggestions populated"
    );

    console.log(`\n========================================`);
    console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } finally {
    server.close();
    await closeDatabasePool();
  }
}

runSkillFinderI18nE2ETests().catch((err) => {
  console.error("Unhandled test suite error:", err);
  process.exit(1);
});
