import { streamFinderScoringService } from "../stream-finder-scoring.service";
import { STREAM_ITEM_KEY_MAP } from "../../content/stream-finder-catalog.data";
import { RawResponseItem } from "../../../scoring/scoring.types";

function createMockResponse(qNum: number, value: string | number): RawResponseItem {
  return {
    question_id: `q-${qNum}`,
    question_number: qNum,
    question_type: qNum <= 60 ? "likert_1_5" : "forced_choice_4",
    section_code: qNum <= 20 ? "ACADEMIC_INTEREST" : "SECTION",
    dimension_code: "DIM",
    response_value: String(value),
    selected_option_id: `opt-${value}`,
  };
}

export function runStreamFinderTests() {
  console.log("=== RUNNING STREAM FINDER SCORING TESTS ===");
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      throw new Error(`Test failed: ${testName}`);
    }
  }

  // TEST 1: All Science Strongly Favoured
  {
    const responses: RawResponseItem[] = [];
    for (let q = 1; q <= 60; q++) {
      const stream = STREAM_ITEM_KEY_MAP[q];
      responses.push(createMockResponse(q, stream === "Science" ? 5 : 1));
    }
    for (let q = 61; q <= 80; q++) {
      responses.push(createMockResponse(q, "A")); // A = Science
    }
    const result = streamFinderScoringService.computeStreamFinderResult(
      "att-1",
      "user-1",
      responses
    );
    assert(result.primaryStream === "Science", "Test 1: Primary Stream is Science");
    assert(
      result.streamScores.Science.compatibilityPercentage === 1.0,
      "Test 1: Science has 100% compatibility"
    );
    assert(result.recommendationConfidence === "High Clarity", "Test 1: High Clarity Confidence");
  }

  // TEST 2: All Commerce Strongly Favoured
  {
    const responses: RawResponseItem[] = [];
    for (let q = 1; q <= 60; q++) {
      const stream = STREAM_ITEM_KEY_MAP[q];
      responses.push(createMockResponse(q, stream === "Commerce" ? 5 : 1));
    }
    for (let q = 61; q <= 80; q++) {
      responses.push(createMockResponse(q, "B")); // B = Commerce
    }
    const result = streamFinderScoringService.computeStreamFinderResult(
      "att-2",
      "user-1",
      responses
    );
    assert(result.primaryStream === "Commerce", "Test 2: Primary Stream is Commerce");
    assert(
      result.streamScores.Commerce.compatibilityPercentage === 1.0,
      "Test 2: Commerce has 100% compatibility"
    );
  }

  // TEST 3: All Humanities Strongly Favoured
  {
    const responses: RawResponseItem[] = [];
    for (let q = 1; q <= 60; q++) {
      const stream = STREAM_ITEM_KEY_MAP[q];
      responses.push(createMockResponse(q, stream === "Humanities" ? 5 : 1));
    }
    for (let q = 61; q <= 80; q++) {
      responses.push(createMockResponse(q, "C")); // C = Humanities
    }
    const result = streamFinderScoringService.computeStreamFinderResult(
      "att-3",
      "user-1",
      responses
    );
    assert(result.primaryStream === "Humanities", "Test 3: Primary Stream is Humanities");
    assert(
      result.streamScores.Humanities.compatibilityPercentage === 1.0,
      "Test 3: Humanities has 100% compatibility"
    );
  }

  // TEST 4: All Applied / Technical Strongly Favoured
  {
    const responses: RawResponseItem[] = [];
    for (let q = 1; q <= 60; q++) {
      const stream = STREAM_ITEM_KEY_MAP[q];
      responses.push(createMockResponse(q, stream === "Applied / Technical" ? 5 : 1));
    }
    for (let q = 61; q <= 80; q++) {
      responses.push(createMockResponse(q, "D")); // D = Applied
    }
    const result = streamFinderScoringService.computeStreamFinderResult(
      "att-4",
      "user-1",
      responses
    );
    assert(
      result.primaryStream === "Applied / Technical",
      "Test 4: Primary Stream is Applied / Technical"
    );
    assert(
      result.streamScores["Applied / Technical"].compatibilityPercentage === 1.0,
      "Test 4: Applied has 100% compatibility"
    );
  }

  // TEST 5: Close Science + Commerce (Mixed Profile)
  {
    const responses: RawResponseItem[] = [];
    // Give Likert 4 to both Science and Commerce, 2 to others
    for (let q = 1; q <= 60; q++) {
      const stream = STREAM_ITEM_KEY_MAP[q];
      if (stream === "Science" || stream === "Commerce") {
        responses.push(createMockResponse(q, 4));
      } else {
        responses.push(createMockResponse(q, 2));
      }
    }
    // 10 A (Science) and 10 B (Commerce)
    for (let q = 61; q <= 70; q++) {
      responses.push(createMockResponse(q, "A"));
    }
    for (let q = 71; q <= 80; q++) {
      responses.push(createMockResponse(q, "B"));
    }
    const result = streamFinderScoringService.computeStreamFinderResult(
      "att-5",
      "user-1",
      responses
    );
    assert(
      result.scoreGap < 0.08,
      `Test 5: Score gap is ${result.scoreGap.toFixed(4)} (< 0.08)`
    );
    assert(
      result.recommendationConfidence === "Mixed Profile / Further Exploration",
      "Test 5: Recommendation is Mixed Profile"
    );
    assert(result.isMixedProfile === true, "Test 5: isMixedProfile flag is true");
    assert(
      result.mixedProfileCluster !== undefined,
      "Test 5: Combination career cluster resolved"
    );
  }

  // TEST 8: Incomplete Assessment (79 questions answered)
  {
    const responses: RawResponseItem[] = [];
    for (let q = 1; q <= 79; q++) {
      responses.push(createMockResponse(q, 3));
    }
    let threwError = false;
    try {
      streamFinderScoringService.computeStreamFinderResult("att-8", "user-1", responses);
    } catch (err: any) {
      threwError = true;
      assert(
        err.message.includes("Complete all 80 responses"),
        "Test 8: Error message indicates incomplete responses"
      );
    }
    assert(threwError, "Test 8: Incomplete assessment throws error on final score");
  }

  // TEST 9: 80 Questions Completed
  {
    const responses: RawResponseItem[] = [];
    for (let q = 1; q <= 60; q++) responses.push(createMockResponse(q, 3));
    for (let q = 61; q <= 80; q++) responses.push(createMockResponse(q, "A"));
    const result = streamFinderScoringService.computeStreamFinderResult(
      "att-9",
      "user-1",
      responses
    );
    assert(result.isComplete === true, "Test 9: 80 responses marked complete");
    assert(result.sectionBreakdown.length === 6, "Test 9: 6 section breakdowns generated");
  }

  // TEST 10: Set Partitioning & Mathematical Balance Assertions
  {
    const {
      STREAM_FINDER_CORE_QUESTION_NUMBERS,
      STREAM_FINDER_EXTENSION_QUESTION_NUMBERS,
      STREAM_MAX_POINTS_V2_CORE,
      STREAM_ITEM_KEY_MAP,
    } = require("../../content/stream-finder-catalog.data");

    assert(STREAM_FINDER_CORE_QUESTION_NUMBERS.length === 48, "Test 10: Core bank has exactly 48 items");
    assert(STREAM_FINDER_EXTENSION_QUESTION_NUMBERS.length === 32, "Test 10: Extension bank has exactly 32 items");

    const coreSet = new Set(STREAM_FINDER_CORE_QUESTION_NUMBERS);
    const extSet = new Set(STREAM_FINDER_EXTENSION_QUESTION_NUMBERS);

    let intersectionCount = 0;
    for (const q of coreSet) {
      if (extSet.has(q)) intersectionCount++;
    }
    assert(intersectionCount === 0, "Test 10: Core and Extension sets are completely disjoint (intersection = 0)");

    const unionSet = new Set([...STREAM_FINDER_CORE_QUESTION_NUMBERS, ...STREAM_FINDER_EXTENSION_QUESTION_NUMBERS]);
    assert(unionSet.size === 80, "Test 10: Union of Core and Extension is exactly 80 items");

    // Count Likert distribution per stream in Core
    const coreLikertCounts: Record<string, number> = { Science: 0, Commerce: 0, Humanities: 0, "Applied / Technical": 0 };
    for (const q of STREAM_FINDER_CORE_QUESTION_NUMBERS) {
      if (q <= 60) {
        const stream = STREAM_ITEM_KEY_MAP[q];
        coreLikertCounts[stream]++;
      }
    }
    assert(coreLikertCounts.Science === 8, "Test 10: Core Science Likert count is 8");
    assert(coreLikertCounts.Commerce === 8, "Test 10: Core Commerce Likert count is 8");
    assert(coreLikertCounts.Humanities === 8, "Test 10: Core Humanities Likert count is 8");
    assert(coreLikertCounts["Applied / Technical"] === 8, "Test 10: Core Applied Likert count is 8");

    // Forced-choice items in Core (Q61..80)
    let coreFcCount = 0;
    for (const q of STREAM_FINDER_CORE_QUESTION_NUMBERS) {
      if (q >= 61) coreFcCount++;
    }
    assert(coreFcCount === 16, "Test 10: Core Forced Choice count is 16");

    // Verify perfect max points symmetry: 8 * 5 = 40 Likert + 16 * 3 = 48 FC = 88 pts for all 4 streams
    assert(STREAM_MAX_POINTS_V2_CORE.Science === 88, "Test 10: Core max points Science is 88");
    assert(STREAM_MAX_POINTS_V2_CORE.Commerce === 88, "Test 10: Core max points Commerce is 88");
    assert(STREAM_MAX_POINTS_V2_CORE.Humanities === 88, "Test 10: Core max points Humanities is 88");
    assert(STREAM_MAX_POINTS_V2_CORE["Applied / Technical"] === 88, "Test 10: Core max points Applied is 88");
  }

  // TEST 11: Stage 1 Core Form Scoring (48 questions, all Science favoured)
  {
    const { STREAM_FINDER_CORE_QUESTION_NUMBERS, STREAM_ITEM_KEY_MAP } = require("../../content/stream-finder-catalog.data");
    const responses: RawResponseItem[] = [];

    for (const q of STREAM_FINDER_CORE_QUESTION_NUMBERS) {
      if (q <= 60) {
        const stream = STREAM_ITEM_KEY_MAP[q];
        responses.push(createMockResponse(q, stream === "Science" ? 5 : 1));
      } else {
        responses.push(createMockResponse(q, "A")); // A = Science
      }
    }

    const result = streamFinderScoringService.computeStreamFinderResult("att-core-1", "user-1", responses, {
      versionCode: "STREAM_FINDER_V2_CORE",
    });

    assert(result.primaryStream === "Science", "Test 11: Core primary stream is Science");
    assert(result.streamScores.Science.totalRaw === 88, "Test 11: Core Science raw score is 88/88");
    assert(result.streamScores.Science.maxTotal === 88, "Test 11: Core Science maxTotal is 88");
    assert(result.streamScores.Science.compatibilityPercentage === 1.0, "Test 11: Core Science is 100%");
    assert(result.totalQuestions === 48, "Test 11: Core totalQuestions is 48");
    assert(result.assessmentMode === "CORE", "Test 11: Core assessmentMode is CORE");
    assert(result.isExtensionAvailable === true, "Test 11: Core has isExtensionAvailable true");
  }

  // TEST 12: Stage 1 Core Form Incomplete check (47 responses throws error)
  {
    const { STREAM_FINDER_CORE_QUESTION_NUMBERS } = require("../../content/stream-finder-catalog.data");
    const responses: RawResponseItem[] = [];
    for (let i = 0; i < 47; i++) {
      responses.push(createMockResponse(STREAM_FINDER_CORE_QUESTION_NUMBERS[i], 3));
    }
    let threwError = false;
    try {
      streamFinderScoringService.computeStreamFinderResult("att-core-inc", "user-1", responses, {
        versionCode: "STREAM_FINDER_V2_CORE",
      });
    } catch (err: any) {
      threwError = true;
      assert(err.message.includes("Complete all 48 responses"), "Test 12: Error specifies 48 required responses");
    }
    assert(threwError, "Test 12: Incomplete Core throws error");
  }

  // TEST 13: Stage 1 Core Form Mixed Profile Recommending Extension
  {
    const { STREAM_FINDER_CORE_QUESTION_NUMBERS, STREAM_ITEM_KEY_MAP } = require("../../content/stream-finder-catalog.data");
    const responses: RawResponseItem[] = [];
    for (const q of STREAM_FINDER_CORE_QUESTION_NUMBERS) {
      if (q <= 60) {
        const stream = STREAM_ITEM_KEY_MAP[q];
        if (stream === "Science" || stream === "Commerce") {
          responses.push(createMockResponse(q, 4));
        } else {
          responses.push(createMockResponse(q, 2));
        }
      } else {
        // Alternate between Science (A) and Commerce (B)
        responses.push(createMockResponse(q, responses.length % 2 === 0 ? "A" : "B"));
      }
    }
    const result = streamFinderScoringService.computeStreamFinderResult("att-core-mixed", "user-1", responses, {
      versionCode: "STREAM_FINDER_V2_CORE",
    });
    assert(result.isMixedProfile === true, "Test 13: Core detects mixed profile");
    assert(result.extensionRecommended === true, "Test 13: Core recommends extension when profile is mixed");
  }

  // TEST 14: Stage 2 Extended Form Scoring (Combined 80 responses)
  {
    const responses: RawResponseItem[] = [];
    for (let q = 1; q <= 60; q++) {
      responses.push(createMockResponse(q, 3));
    }
    for (let q = 61; q <= 80; q++) {
      responses.push(createMockResponse(q, "A"));
    }
    const result = streamFinderScoringService.computeStreamFinderResult("att-ext-1", "user-1", responses, {
      versionCode: "STREAM_FINDER_V2_EXTENDED",
      coreAttemptId: "att-core-1",
      assessmentMode: "EXTENDED",
    });
    assert(result.assessmentMode === "EXTENDED", "Test 14: Result assessmentMode is EXTENDED");
    assert(result.totalQuestions === 80, "Test 14: Extended totalQuestions is 80");
    assert(result.coreAttemptId === "att-core-1", "Test 14: coreAttemptId preserved");
    assert(result.isExtensionAvailable === false, "Test 14: Extended mode has isExtensionAvailable false");
    assert(result.totalEvidenceQuestions === 80, "Test 14: totalEvidenceQuestions is 80");
  }

  // TEST 15: V1 Legacy Scoring Regression
  {
    const responses: RawResponseItem[] = [];
    for (let q = 1; q <= 60; q++) responses.push(createMockResponse(q, 5));
    for (let q = 61; q <= 80; q++) responses.push(createMockResponse(q, "A"));
    const result = streamFinderScoringService.computeStreamFinderResult("att-v1-1", "user-1", responses, {
      versionCode: "STREAM_FINDER_V1",
    });
    assert(result.streamScores.Science.maxTotal === 145, "Test 15: V1 Science maxTotal is 145");
    assert(result.streamScores.Commerce.maxTotal === 135, "Test 15: V1 Commerce maxTotal is 135");
    assert(result.streamScores.Humanities.maxTotal === 140, "Test 15: V1 Humanities maxTotal is 140");
    assert(result.streamScores["Applied / Technical"].maxTotal === 120, "Test 15: V1 Applied maxTotal is 120");
    assert(result.assessmentMode === "V1_LEGACY", "Test 15: V1 assessmentMode is V1_LEGACY");
  }

  console.log(`\n🎉 ALL ${passed}/${total} TESTS PASSED SUCCESSFULLY!`);
}

// Execute directly if run with ts-node or node
if (require.main === module) {
  runStreamFinderTests();
}
