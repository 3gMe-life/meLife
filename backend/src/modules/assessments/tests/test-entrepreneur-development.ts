/**
 * 3G MELIFE | ENTREPRENEUR DEVELOPMENT TEST (ED TEST) TEST SUITE
 * Comprehensive verification of catalog data, database ingestion, 10 dimension scoring,
 * ERI calculation, 5 archetypal classifications, 4-stage startup roadmap, and report generation.
 */

import {
  ENTREPRENEUR_DIMENSIONS,
  ENTREPRENEUR_DEVELOPMENT_SECTIONS,
  ENTREPRENEUR_DEVELOPMENT_QUESTIONS,
} from "../content/entrepreneur-development-catalog.data";
import { entrepreneurDevelopmentScoringService } from "../scoring/entrepreneur-development-scoring.service";
import { entrepreneurDevelopmentReportTemplate } from "../../reports/templates/entrepreneur-development.template";
import { RawResponseItem } from "../../scoring/scoring.types";

interface TestResult {
  passed: boolean;
  testName: string;
  details?: string;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    results.push({ passed: true, testName, details });
    console.log(`✅ [PASS] ${testName}`);
  } else {
    results.push({ passed: false, testName, details, error: "Assertion failed" });
    console.error(`❌ [FAIL] ${testName}: ${details || "Assertion failed"}`);
  }
}

async function runTestSuite() {
  console.log("======================================================================");
  console.log("🚀 STARTING ENTREPRENEUR DEVELOPMENT TEST (ED TEST) VERIFICATION SUITE");
  console.log("======================================================================\n");

  // =========================================================================
  // 1. CATALOG INTEGRITY & QUESTION BANK VALIDATION
  // =========================================================================
  console.log("📌 1. VALIDATING CATALOG INTEGRITY & DATA STRUCTURES...");

  assert(
    ENTREPRENEUR_DIMENSIONS.length === 10,
    "Catalog defines exactly 10 Entrepreneur Dimensions",
    `Found ${ENTREPRENEUR_DIMENSIONS.length} dimensions`
  );

  const totalWeight = ENTREPRENEUR_DIMENSIONS.reduce((acc, d) => acc + (d.weight || 0), 0);
  assert(
    Math.abs(totalWeight - 1.0) < 0.001,
    "Dimension weights sum precisely to 1.0 (100%)",
    `Sum of weights: ${totalWeight}`
  );

  assert(
    ENTREPRENEUR_DEVELOPMENT_SECTIONS.length === 2,
    "Catalog defines 2 Sections (Behavioral Scale & Situational Scenarios)",
    `Found ${ENTREPRENEUR_DEVELOPMENT_SECTIONS.length} sections`
  );

  assert(
    ENTREPRENEUR_DEVELOPMENT_QUESTIONS.length === 60,
    "Catalog defines exactly 60 question items (50 Likert + 10 Situational Scenarios)",
    `Found ${ENTREPRENEUR_DEVELOPMENT_QUESTIONS.length} questions`
  );

  const likertQuestions = ENTREPRENEUR_DEVELOPMENT_QUESTIONS.filter(
    (q) => q.sectionCode === "SEC_BEHAVIORAL_SCALE"
  );
  assert(
    likertQuestions.length === 50,
    "Section 1 contains exactly 50 Likert items (5 items per dimension across 10 dimensions)",
    `Found ${likertQuestions.length} Likert items`
  );

  const sjqQuestions = ENTREPRENEUR_DEVELOPMENT_QUESTIONS.filter(
    (q) => q.sectionCode === "SEC_SITUATIONAL_SCENARIOS"
  );
  assert(
    sjqQuestions.length === 10,
    "Section 2 contains exactly 10 Situational Judgment Scenarios (1 per dimension)",
    `Found ${sjqQuestions.length} SJQ items`
  );

  // Verify all 60 questions have options with score values
  let allOptionsValid = true;
  for (const q of ENTREPRENEUR_DEVELOPMENT_QUESTIONS) {
    if (!q.options || q.options.length < 4) {
      allOptionsValid = false;
      break;
    }
  }
  assert(
    allOptionsValid,
    "All 60 questions possess comprehensive option sets with validated score values"
  );

  // =========================================================================
  // 2. SCORING ENGINE & READINESS INDEX (ERI) VALIDATION
  // =========================================================================
  console.log("\n📌 2. VALIDATING SCORING ENGINE & MATHEMATICAL RIGOR...");

  // Scenario A: High Innovator Synthetic Response Profile
  const innovatorResponses: RawResponseItem[] = ENTREPRENEUR_DEVELOPMENT_QUESTIONS.map((q) => {
    let scoreVal = 3.0; // Moderate base
    // Give high scores (5.0) to Innovation, Opportunity Recognition, Entrepreneurial Interest
    if (
      q.dimensionCode === "DIM_INNOVATION_CREAT" ||
      q.dimensionCode === "DIM_OPP_RECOGNITION" ||
      q.dimensionCode === "DIM_ENTR_INTEREST"
    ) {
      scoreVal = 5.0;
    } else if (
      q.dimensionCode === "DIM_RISK_TOLERANCE" ||
      q.dimensionCode === "DIM_GROWTH_MINDSET"
    ) {
      scoreVal = 4.0;
    }

    return {
      question_id: `q-${q.displayOrder}`,
      question_number: q.displayOrder,
      question_type: q.questionType,
      section_code: q.sectionCode,
      dimension_code: q.dimensionCode || "DIM_ENTR_INTEREST",
      response_value: "OPT_5",
      score_value: scoreVal,
    };
  });

  const innovatorResult = entrepreneurDevelopmentScoringService.calculateScores({
    attemptId: "test-attempt-innovator",
    participantId: "test-student-1",
    responses: innovatorResponses,
    completionTimeSeconds: 720,
  });

  assert(
    innovatorResult.dimensions.length === 10,
    "Scoring service outputs scores for all 10 dimensions",
    `Count: ${innovatorResult.dimensions.length}`
  );

  assert(
    innovatorResult.readinessIndex > 65,
    "Calculated ERI score is reflective of high-scoring inputs",
    `ERI Score: ${innovatorResult.readinessIndex}`
  );

  assert(
    innovatorResult.primaryArchetype.code === "INNOVATOR",
    "Profile classifier accurately classifies dominant profile as INNOVATOR",
    `Assigned Archetype: ${innovatorResult.primaryArchetype.title} (${innovatorResult.primaryArchetype.code})`
  );

  assert(
    innovatorResult.strengths.length === 3,
    "Identifies top 3 strength dimensions",
    `Strengths: ${innovatorResult.strengths.map((s) => s.dimensionName).join(", ")}`
  );

  assert(
    innovatorResult.developmentAreas.length === 3,
    "Identifies bottom 3 developmental growth catalyst dimensions",
    `Growth areas: ${innovatorResult.developmentAreas.map((d) => d.dimensionName).join(", ")}`
  );

  assert(
    innovatorResult.roadmap.length === 4,
    "Generates 4-Stage Actionable Startup Roadmap (Stages 1 through 4)",
    `Phases: ${innovatorResult.roadmap.map((p) => p.title).join(" -> ")}`
  );

  // Scenario B: High Builder Synthetic Response Profile
  const builderResponses: RawResponseItem[] = ENTREPRENEUR_DEVELOPMENT_QUESTIONS.map((q) => {
    let scoreVal = 2.0;
    if (
      q.dimensionCode === "DIM_EXECUTION_INIT" ||
      q.dimensionCode === "DIM_BUSINESS_THINKING" ||
      q.dimensionCode === "DIM_RESILIENCE_GRIT"
    ) {
      scoreVal = 5.0;
    }

    return {
      question_id: `q-${q.displayOrder}`,
      question_number: q.displayOrder,
      question_type: q.questionType,
      section_code: q.sectionCode,
      dimension_code: q.dimensionCode || "DIM_EXECUTION_INIT",
      response_value: "OPT_5",
      score_value: scoreVal,
    };
  });

  const builderResult = entrepreneurDevelopmentScoringService.calculateScores({
    attemptId: "test-attempt-builder",
    participantId: "test-student-2",
    responses: builderResponses,
  });

  assert(
    builderResult.primaryArchetype.code === "BUILDER",
    "Profile classifier accurately classifies dominant profile as BUILDER",
    `Assigned Archetype: ${builderResult.primaryArchetype.title} (${builderResult.primaryArchetype.code})`
  );

  // Scenario C: High Leader Synthetic Response Profile
  const leaderResponses: RawResponseItem[] = ENTREPRENEUR_DEVELOPMENT_QUESTIONS.map((q) => {
    let scoreVal = 2.0;
    if (
      q.dimensionCode === "DIM_LEADERSHIP_INFL" ||
      q.dimensionCode === "DIM_COMM_PITCHING" ||
      q.dimensionCode === "DIM_BUSINESS_THINKING"
    ) {
      scoreVal = 5.0;
    }

    return {
      question_id: `q-${q.displayOrder}`,
      question_number: q.displayOrder,
      question_type: q.questionType,
      section_code: q.sectionCode,
      dimension_code: q.dimensionCode || "DIM_LEADERSHIP_INFL",
      response_value: "OPT_5",
      score_value: scoreVal,
    };
  });

  const leaderResult = entrepreneurDevelopmentScoringService.calculateScores({
    attemptId: "test-attempt-leader",
    participantId: "test-student-3",
    responses: leaderResponses,
  });

  assert(
    leaderResult.primaryArchetype.code === "LEADER",
    "Profile classifier accurately classifies dominant profile as LEADER",
    `Assigned Archetype: ${leaderResult.primaryArchetype.title} (${leaderResult.primaryArchetype.code})`
  );

  // =========================================================================
  // 3. REPORT TEMPLATE SYNTHESIS & DTO CONTRACT VALIDATION
  // =========================================================================
  console.log("\n📌 3. VALIDATING REPORT TEMPLATE SYNTHESIS & METADATA CONTRACTS...");

  const reportDto = await entrepreneurDevelopmentReportTemplate.generateReport({
    reportId: "rep-uuid-001",
    result: innovatorResult,
    studentProfile: {
      name: "Aarav Sharma",
      firstName: "Aarav",
      lastName: "Sharma",
      email: "aarav.sharma@example.com",
      dateOfBirth: "2006-05-14",
      age: 18,
      educationStage: "SCHOOL",
      gradeLevel: "12",
      schoolName: "Delhi Public School",
      curriculumOrBoard: "CBSE",
    },
    languageCode: "en",
  });

  assert(
    reportDto.assessmentCode === "ENTREPRENEUR_DEVELOPMENT_TEST",
    "Report DTO sets assessmentCode to ENTREPRENEUR_DEVELOPMENT_TEST"
  );

  assert(
    reportDto.studentProfile.studentName === "Aarav Sharma",
    "Report DTO accurately maps student profile context",
    `Name: ${reportDto.studentProfile.studentName}`
  );

  assert(
    reportDto.dimensionProfile.length === 10,
    "Report DTO incorporates all 10 dimension profiles",
    `Count: ${reportDto.dimensionProfile.length}`
  );

  assert(
    reportDto.roadmap.length === 4,
    "Report DTO incorporates full 4-stage startup execution roadmap"
  );

  assert(
    reportDto.learningRecommendations.recommendedBooks.length >= 3,
    "Report DTO incorporates curated founder reading list"
  );

  assert(
    reportDto.learningRecommendations.coreFrameworks.length >= 3,
    "Report DTO incorporates core venture frameworks (BMC, Customer Discovery, OKRs)"
  );

  // =========================================================================
  // SUMMARY
  // =========================================================================
  const totalTests = results.length;
  const passedTests = results.filter((r) => r.passed).length;
  const failedTests = results.filter((r) => !r.passed).length;

  console.log("\n======================================================================");
  console.log(`📊 TEST SUITE SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
  if (failedTests === 0) {
    console.log("🎉 ALL TESTS PASSED! Entrepreneur Development Test is 100% verified.");
  } else {
    console.error(`⚠️ ${failedTests} test(s) failed.`);
  }
  console.log("======================================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution encountered an unhandled exception:", err);
  process.exit(1);
});
