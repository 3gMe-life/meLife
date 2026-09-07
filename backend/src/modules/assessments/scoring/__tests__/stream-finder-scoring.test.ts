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

  console.log(`\n🎉 ALL ${passed}/${total} TESTS PASSED SUCCESSFULLY!`);
}

// Execute directly if run with ts-node or node
if (require.main === module) {
  runStreamFinderTests();
}
