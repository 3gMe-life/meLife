/**
 * 3G MELIFE | ENGINEERING BRANCH FINDER TEST SUITE
 * Comprehensive verification of catalog integrity, scoring algorithms, construct mapping,
 * branch compatibility, response quality, golden profiles, cross-contamination, and multilingual equivalence.
 */

import {
  ENGINEERING_QUESTIONS,
  ENGINEERING_CONSTRUCTS,
  ENGINEERING_BRANCH_CLUSTERS,
} from "../content/engineering-branch-finder-catalog.data";
import {
  engineeringBranchFinderScoringService,
} from "../scoring/engineering-branch-finder-scoring.service";
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

// Helper to create synthetic raw responses
function createSyntheticResponses(
  likertMap: (qNum: number) => number,
  choiceMap: (qNum: number) => string
): RawResponseItem[] {
  const responses: RawResponseItem[] = [];

  for (let q = 1; q <= 64; q++) {
    const val = likertMap(q);
    responses.push({
      question_id: `q-${q}`,
      question_number: q,
      question_type: "likert_1_4",
      section_code: "BRANCH_PREFERENCE_LIKERT",
      dimension_code: `DIM_${q}`,
      response_value: String(val),
    });
  }

  for (let q = 65; q <= 80; q++) {
    const choice = choiceMap(q);
    responses.push({
      question_id: `q-${q}`,
      question_number: q,
      question_type: "forced_choice_8",
      section_code: "FORCED_CHOICE_SCENARIOS",
      dimension_code: "FORCED_CHOICE",
      response_value: choice,
    });
  }

  return responses;
}

export async function runEngineeringBranchFinderTests(): Promise<{
  total: number;
  passed: number;
  failed: number;
  results: TestResult[];
}> {
  console.log("================================================================================");
  console.log("🚀 STARTING 3G MELIFE ENGINEERING BRANCH FINDER TEST SUITE (80 QUESTIONS)");
  console.log("================================================================================\n");

  // TEST 1: Total Question Count
  assert(
    ENGINEERING_QUESTIONS.length === 80,
    "Catalog Item Count Integrity",
    `Expected exactly 80 questions, found ${ENGINEERING_QUESTIONS.length}`
  );

  // TEST 2: Item ID Sequence (E01 to E80)
  const itemIds = ENGINEERING_QUESTIONS.map((q) => q.itemId);
  const expectedItemIds = Array.from({ length: 80 }, (_, i) => `E${String(i + 1).padStart(2, "0")}`);
  const idsMatch = JSON.stringify(itemIds) === JSON.stringify(expectedItemIds);
  assert(idsMatch, "Item ID Sequence Verification (E01–E80)", `Item IDs match expected 1-80 contiguous sequence.`);

  // TEST 3: Likert Items Count (1–64) and Scale (1–4)
  const likertQuestions = ENGINEERING_QUESTIONS.slice(0, 64);
  const allLikertType = likertQuestions.every((q) => q.questionType === "likert_1_4");
  const allLikertOptions = likertQuestions.every((q) => q.options.length === 4);
  assert(
    allLikertType && allLikertOptions,
    "Likert Items Format (E01–E64 4-point scale)",
    `All 64 items have questionType 'likert_1_4' with 4 options.`
  );

  // TEST 4: Forced Choice Items Count (65–80) and 8 Options (A–H)
  const forcedChoiceQuestions = ENGINEERING_QUESTIONS.slice(64, 80);
  const allForcedType = forcedChoiceQuestions.every((q) => q.questionType === "forced_choice_8");
  const allForcedOptions = forcedChoiceQuestions.every(
    (q) => q.options.length === 8 && q.options.map((o) => o.optionKey).join("") === "ABCDEFGH"
  );
  assert(
    allForcedType && allForcedOptions,
    "Forced Choice Format (E65–E80 8-choice A–H)",
    `All 16 scenario items have questionType 'forced_choice_8' with options A through H.`
  );

  // TEST 5: 8 Constructs Definitions (C01–C08)
  const constructKeys = Object.keys(ENGINEERING_CONSTRUCTS).sort();
  const expectedConstructs = ["C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08"];
  assert(
    JSON.stringify(constructKeys) === JSON.stringify(expectedConstructs),
    "Construct Model Integrity (C01–C08)",
    `Found constructs: ${constructKeys.join(", ")}`
  );

  // TEST 6: 8 Engineering Branches
  const branchKeys = Object.keys(ENGINEERING_BRANCH_CLUSTERS).sort();
  const expectedBranches = ["AERO", "BME", "CE", "CHE", "CSE", "ECE", "EEE", "ME"];
  assert(
    JSON.stringify(branchKeys) === JSON.stringify(expectedBranches),
    "Engineering Disciplines Model Integrity (8 Branches)",
    `Found branches: ${branchKeys.join(", ")}`
  );

  // TEST 7: Golden Test — All Minimum (Likert = 1, uniform choice)
  const allMinResponses = createSyntheticResponses(
    () => 1,
    (q) => ["A", "B", "C", "D", "E", "F", "G", "H"][q % 8]
  );
  const minResult = engineeringBranchFinderScoringService.computeEngineeringBranchFinderResult(
    "att-min",
    "user-1",
    allMinResponses
  );
  assert(
    minResult.completedQuestions === 80 && minResult.isComplete,
    "Golden Test: ALL MINIMUM Completion",
    `Completed all 80 questions with valid data.`
  );

  // TEST 8: Golden Test — All Maximum (Likert = 4, uniform choice)
  const allMaxResponses = createSyntheticResponses(
    () => 4,
    (q) => ["A", "B", "C", "D", "E", "F", "G", "H"][q % 8]
  );
  const maxResult = engineeringBranchFinderScoringService.computeEngineeringBranchFinderResult(
    "att-max",
    "user-2",
    allMaxResponses
  );
  assert(
    maxResult.sortedBranches.every((b) => b.totalRaw > 30),
    "Golden Test: ALL MAXIMUM High Raw Totals",
    `All branches achieved high raw scores.`
  );

  // TEST 9: Golden Profile — Computer Science & Engineering Dominant
  const cseResponses = createSyntheticResponses(
    (q) => (q >= 1 && q <= 8 ? 4 : 1), // Max rating on CSE items (Q1-Q8)
    () => "A" // All choice A (CSE)
  );
  const cseResult = engineeringBranchFinderScoringService.computeEngineeringBranchFinderResult(
    "att-cse",
    "user-3",
    cseResponses
  );
  assert(
    cseResult.primaryBranch.branchCode === "CSE",
    "Golden Profile: Computer Science & Engineering Dominant",
    `Primary branch: ${cseResult.primaryBranch.branchName} (${cseResult.primaryBranch.displayPercentage}%)`
  );

  // TEST 10: Golden Profile — Mechanical Engineering Dominant
  const meResponses = createSyntheticResponses(
    (q) => (q >= 25 && q <= 32 ? 4 : 1), // Max rating on ME items (Q25-Q32)
    () => "D" // All choice D (ME)
  );
  const meResult = engineeringBranchFinderScoringService.computeEngineeringBranchFinderResult(
    "att-me",
    "user-4",
    meResponses
  );
  assert(
    meResult.primaryBranch.branchCode === "ME",
    "Golden Profile: Mechanical Engineering Dominant",
    `Primary branch: ${meResult.primaryBranch.branchName} (${meResult.primaryBranch.displayPercentage}%)`
  );

  // TEST 11: Golden Profile — Aerospace Engineering Dominant
  const aeroResponses = createSyntheticResponses(
    (q) => (q >= 57 && q <= 64 ? 4 : 1), // Max rating on AERO items (Q57-Q64)
    () => "H" // All choice H (AERO)
  );
  const aeroResult = engineeringBranchFinderScoringService.computeEngineeringBranchFinderResult(
    "att-aero",
    "user-5",
    aeroResponses
  );
  assert(
    aeroResult.primaryBranch.branchCode === "AERO",
    "Golden Profile: Aerospace Engineering Dominant",
    `Primary branch: ${aeroResult.primaryBranch.branchName} (${aeroResult.primaryBranch.displayPercentage}%)`
  );

  // TEST 12: Golden Profile — Civil Engineering Dominant
  const ceResponses = createSyntheticResponses(
    (q) => (q >= 33 && q <= 40 ? 4 : 1), // Max rating on CE items (Q33-Q40)
    () => "E" // All choice E (CE)
  );
  const ceResult = engineeringBranchFinderScoringService.computeEngineeringBranchFinderResult(
    "att-ce",
    "user-6",
    ceResponses
  );
  assert(
    ceResult.primaryBranch.branchCode === "CE",
    "Golden Profile: Civil Engineering Dominant",
    `Primary branch: ${ceResult.primaryBranch.branchName} (${ceResult.primaryBranch.displayPercentage}%)`
  );

  // TEST 13: Golden Profile — Chemical Engineering Dominant
  const cheResponses = createSyntheticResponses(
    (q) => (q >= 41 && q <= 48 ? 4 : 1), // Max rating on CHE items (Q41-Q48)
    () => "F" // All choice F (CHE)
  );
  const cheResult = engineeringBranchFinderScoringService.computeEngineeringBranchFinderResult(
    "att-che",
    "user-7",
    cheResponses
  );
  assert(
    cheResult.primaryBranch.branchCode === "CHE",
    "Golden Profile: Chemical Engineering Dominant",
    `Primary branch: ${cheResult.primaryBranch.branchName} (${cheResult.primaryBranch.displayPercentage}%)`
  );

  // TEST 14: Golden Profile — Biomedical Engineering Dominant
  const bmeResponses = createSyntheticResponses(
    (q) => (q >= 49 && q <= 56 ? 4 : 1), // Max rating on BME items (Q49-Q56)
    () => "G" // All choice G (BME)
  );
  const bmeResult = engineeringBranchFinderScoringService.computeEngineeringBranchFinderResult(
    "att-bme",
    "user-8",
    bmeResponses
  );
  assert(
    bmeResult.primaryBranch.branchCode === "BME",
    "Golden Profile: Biomedical Engineering Dominant",
    `Primary branch: ${bmeResult.primaryBranch.branchName} (${bmeResult.primaryBranch.displayPercentage}%)`
  );

  // TEST 15: Golden Profile — Electronics & Communication Dominant
  const eceResponses = createSyntheticResponses(
    (q) => (q >= 9 && q <= 16 ? 4 : 1), // Max rating on ECE items (Q9-Q16)
    () => "B" // All choice B (ECE)
  );
  const eceResult = engineeringBranchFinderScoringService.computeEngineeringBranchFinderResult(
    "att-ece",
    "user-9",
    eceResponses
  );
  assert(
    eceResult.primaryBranch.branchCode === "ECE",
    "Golden Profile: Electronics & Communication Engineering Dominant",
    `Primary branch: ${eceResult.primaryBranch.branchName} (${eceResult.primaryBranch.displayPercentage}%)`
  );

  // TEST 16: Golden Profile — Electrical Engineering Dominant
  const eeeResponses = createSyntheticResponses(
    (q) => (q >= 17 && q <= 24 ? 4 : 1), // Max rating on EEE items (Q17-Q24)
    () => "C" // All choice C (EEE)
  );
  const eeeResult = engineeringBranchFinderScoringService.computeEngineeringBranchFinderResult(
    "att-eee",
    "user-10",
    eeeResponses
  );
  assert(
    eeeResult.primaryBranch.branchCode === "EEE",
    "Golden Profile: Electrical Engineering Dominant",
    `Primary branch: ${eeeResult.primaryBranch.branchName} (${eeeResult.primaryBranch.displayPercentage}%)`
  );

  // TEST 17: Mixed Profile / Close-score Detection
  const mixedResponses = createSyntheticResponses(
    () => 3, // All Likert = 3
    (q) => ["A", "B", "C", "D", "E", "F", "G", "H"][q % 8] // Balanced choices
  );
  const mixedResult = engineeringBranchFinderScoringService.computeEngineeringBranchFinderResult(
    "att-mixed",
    "user-11",
    mixedResponses
  );
  assert(
    mixedResult.isMixedProfile && mixedResult.clarity === "Mixed Profile / Further Exploration",
    "Close-score Handling: Mixed Profile Detection",
    `Correctly identified balanced profile with score gap ${mixedResult.scoreGapPercentage}% (< 8%).`
  );

  // TEST 18: Construct Isolation / Cross-Contamination Resistance
  assert(
    meResult.constructScores["C04"].normalizedScore > meResult.constructScores["C08"].normalizedScore,
    "Construct Isolation & Cross-Contamination Resistance",
    `C04 score (${meResult.constructScores["C04"].normalizedScore}) > C08 score (${meResult.constructScores["C08"].normalizedScore})`
  );

  // TEST 19: Multilingual Scoring Invariance
  const langEn = engineeringBranchFinderScoringService.computeEngineeringBranchFinderResult(
    "att-en",
    "user-12",
    cseResponses,
    { languageCode: "en" }
  );
  const langMl = engineeringBranchFinderScoringService.computeEngineeringBranchFinderResult(
    "att-ml",
    "user-12",
    cseResponses,
    { languageCode: "ml" }
  );
  const langAr = engineeringBranchFinderScoringService.computeEngineeringBranchFinderResult(
    "att-ar",
    "user-12",
    cseResponses,
    { languageCode: "ar" }
  );
  assert(
    langEn.primaryBranch.displayPercentage === langMl.primaryBranch.displayPercentage &&
      langMl.primaryBranch.displayPercentage === langAr.primaryBranch.displayPercentage &&
      langEn.primaryBranch.branchCode === langAr.primaryBranch.branchCode,
    "Multilingual Invariance (en, ml, ar identical scores)",
    `Language switching preserves deterministic psychometric scores.`
  );

  // TEST 20: Missing Questions Defensive Guard
  let errorCaught = false;
  try {
    const incompleteResponses = cseResponses.slice(0, 50); // Only 50 of 80
    engineeringBranchFinderScoringService.computeEngineeringBranchFinderResult(
      "att-inc",
      "user-13",
      incompleteResponses
    );
  } catch (_err) {
    errorCaught = true;
  }
  assert(
    errorCaught,
    "Defensive Guard: Incomplete Assessment Rejection",
    `Throws error when responses < 80.`
  );

  console.log("\n================================================================================");
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`📊 TEST SUITE SUMMARY: ${passedCount} / ${results.length} PASSED (${failedCount} failed)`);
  console.log("================================================================================\n");

  return {
    total: results.length,
    passed: passedCount,
    failed: failedCount,
    results,
  };
}

// Execute immediately if run directly
if (require.main === module) {
  runEngineeringBranchFinderTests().then((res) => {
    if (res.failed > 0) {
      process.exit(1);
    }
  });
}
