import * as zlib from "zlib";
import * as fs from "fs";
import { interestScoringEngine } from "../src/modules/scoring/skill-finder/interest.scoring";
import { aptitudeScoringEngine } from "../src/modules/scoring/skill-finder/aptitude.scoring";
import { profileGenerator } from "../src/modules/scoring/skill-finder/profile.generator";
import { skillFinderReportTemplate } from "../src/modules/reports/templates/skill-finder.template";
import { reportPdfGenerator } from "../src/modules/reports/generators/report-pdf.generator";
import { REPORT_TRANSLATIONS } from "../src/modules/reports/i18n/report.translations";
import { SkillFinderReportDTO } from "../src/modules/reports/report.types";

async function runSkillFinderAuditTests() {
  console.log("🧪 Starting Comprehensive Skill Finder Production Readiness Test Suite...\n");

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
    // ============================================================
    // 1. RIASEC TIE INTERPRETATION (5 DIMENSIONS TIED AT 67%)
    // ============================================================
    console.log("--- 1. Testing RIASEC Tie Interpretation (Broad Pattern) ---");
    // Builder 67, Explorer 67, Creator 67, Helper 50, Leader 67, Organiser 67
    const tiedResponses = [
      // Builder: 4 items (score ~67%)
      { questionId: "q_r1", dimensionCode: "BUILDER", responseValue: 3 },
      { questionId: "q_r2", dimensionCode: "BUILDER", responseValue: 3 },
      { questionId: "q_r3", dimensionCode: "BUILDER", responseValue: 3 },
      // Explorer: 4 items (score ~67%)
      { questionId: "q_i1", dimensionCode: "EXPLORER", responseValue: 3 },
      { questionId: "q_i2", dimensionCode: "EXPLORER", responseValue: 3 },
      { questionId: "q_i3", dimensionCode: "EXPLORER", responseValue: 3 },
      // Creator: 4 items (score ~67%)
      { questionId: "q_a1", dimensionCode: "CREATOR", responseValue: 3 },
      { questionId: "q_a2", dimensionCode: "CREATOR", responseValue: 3 },
      { questionId: "q_a3", dimensionCode: "CREATOR", responseValue: 3 },
      // Helper: 4 items (score 50%)
      { questionId: "q_s1", dimensionCode: "HELPER", responseValue: 2 },
      { questionId: "q_s2", dimensionCode: "HELPER", responseValue: 2 },
      // Leader: 4 items (score ~67%)
      { questionId: "q_e1", dimensionCode: "LEADER", responseValue: 3 },
      { questionId: "q_e2", dimensionCode: "LEADER", responseValue: 3 },
      { questionId: "q_e3", dimensionCode: "LEADER", responseValue: 3 },
      // Organiser: 4 items (score ~67%)
      { questionId: "q_c1", dimensionCode: "ORGANISER", responseValue: 3 },
      { questionId: "q_c2", dimensionCode: "ORGANISER", responseValue: 3 },
      { questionId: "q_c3", dimensionCode: "ORGANISER", responseValue: 3 },
    ];

    const interestResult = interestScoringEngine.calculate(tiedResponses, "en");
    assert(interestResult.isBroadInterestPattern === true, "Marks isBroadInterestPattern as true when 5 domains tie");
    assert(
      Array.isArray(interestResult.tiedTopDomains) && interestResult.tiedTopDomains.length >= 5,
      "Populates tiedTopDomains with all 5 tied domains"
    );
    assert(
      interestResult.primaryOrientation === "Broad Interest Pattern",
      "Sets primaryOrientation to Broad Interest Pattern instead of arbitrary dominant pair"
    );
    assert(
      interestResult.secondaryOrientation === undefined,
      "Leaves secondaryOrientation undefined to avoid fabricating an unsupported supporting pair"
    );

    // ============================================================
    // 2. PROFILE ARCHETYPE GENERATION UNDER TIE
    // ============================================================
    console.log("\n--- 2. Testing Profile Archetype Generation for Broad Ties ---");
    const learningProfile = profileGenerator.generateLearningProfile(interestResult, {
      strongestIndicators: [{ code: "PRACTICAL_TECHNICAL_SKILL", name: "Practical Dexterity", scalePositionPercentage: 85, scalePositionNormalized: 85, stanine: 8, sten: 9, tScore: 65, percentile: 85 }],
      developmentOpportunities: [{ code: "VISUAL_SPATIAL_THINKING", name: "Visual-Spatial Thinking", scalePositionPercentage: 40, scalePositionNormalized: 40, stanine: 4, sten: 4, tScore: 45, percentile: 35 }],
      dimensions: [],
      summary: "High practical style",
    }, "en");

    assert(
      learningProfile.archetypeTitle === "Multidisciplinary Explorer",
      "Assigns Multidisciplinary Explorer archetype when broad tie occurs"
    );
    assert(
      !learningProfile.strengthSummary.includes("natural instinct") &&
      !learningProfile.strengthSummary.includes("naturally"),
      "Archetype strength summary contains zero fixed-trait wording"
    );

    // ============================================================
    // 3. APTITUDE SCORING & RAW SCORE EXPORT (6 / 36 = 17%)
    // ============================================================
    console.log("\n--- 3. Testing Aptitude Scoring & Raw Score Exposure ---");
    const makeItem = (id: string, isCorrect: boolean, max = 2) => ({
      questionId: id,
      response_value: isCorrect ? "A" : "B",
      correct_key: "A",
      max_points: max,
      question_type: "mcq_text",
    });

    // 18 items with 2 points each = 36 max points across 8 domains.
    // 3 items correct = 6 points earned out of 36 (6 / 36 = 16.67% -> 17%)
    const mockAptitudeMap: Record<string, any[]> = {
      PATTERN_LOGIC: [makeItem("apt_1", true), makeItem("apt_2", false)],
      NUMERICAL_REASONING: [makeItem("apt_3", true), makeItem("apt_4", false)],
      SPATIAL_REASONING: [makeItem("apt_5", true), makeItem("apt_6", false)],
      VERBAL_REASONING: [makeItem("apt_7", false), makeItem("apt_8", false)],
      PRACTICAL_PROBLEM_SOLVING: [makeItem("apt_9", false), makeItem("apt_10", false)],
      CREATIVE_THINKING_TASKS: [makeItem("apt_11", false), makeItem("apt_12", false)],
      SITUATIONAL_JUDGMENT: [makeItem("apt_13", false), makeItem("apt_14", false), makeItem("apt_15", false)],
      PLANNING_ESTIMATION: [makeItem("apt_16", false), makeItem("apt_17", false), makeItem("apt_18", false)],
    };

    const aptitudeResult = aptitudeScoringEngine.calculate(mockAptitudeMap);
    assert(aptitudeResult.rawScore !== undefined, "Aptitude engine exports rawScore");
    assert(aptitudeResult.maxScore !== undefined, "Aptitude engine exports maxScore");
    assert(aptitudeResult.maxScore === 36, `Aptitude engine maxScore equals 36 total points (got ${aptitudeResult.maxScore})`);
    assert(aptitudeResult.rawScore === 6, `Aptitude engine rawScore equals 6 earned points (got ${aptitudeResult.rawScore})`);
    assert(aptitudeResult.overallAccuracyPercentage === 17, `Aptitude overall accuracy calculates to 17% (got ${aptitudeResult.overallAccuracyPercentage}%)`);

    // ============================================================
    // 4. CONSTRUCT-ALIGNED DEVELOPMENT RECOMMENDATIONS (VISUAL-SPATIAL)
    // ============================================================
    console.log("\n--- 4. Testing Visual-Spatial Construct-Aligned Recommendations ---");
    const mockSkillResult = {
      strongestIndicators: [
        { code: "PRACTICAL_TECHNICAL_SKILL", name: "Practical & Technical Dexterity", scalePositionPercentage: 85, scalePositionNormalized: 85, stanine: 8, sten: 9, tScore: 65, percentile: 85 },
      ],
      developmentOpportunities: [
        { code: "VISUAL_SPATIAL_THINKING", name: "Visual-Spatial Thinking", scalePositionPercentage: 35, scalePositionNormalized: 35, stanine: 3, sten: 4, tScore: 42, percentile: 25 },
      ],
      dimensions: [],
      summary: "Self-reported practical style",
    };

    const growthSuggestions = profileGenerator.generateGrowthSuggestions(interestResult, mockSkillResult, "en");

    assert(growthSuggestions.length > 0, "Generates growth suggestions");
    const vsSuggestion = growthSuggestions.find((s) => s.toLowerCase().includes("spatial")) || growthSuggestions[0];
    assert(
      vsSuggestion.toLowerCase().includes("spatial") ||
      vsSuggestion.toLowerCase().includes("mental rotation") ||
      vsSuggestion.toLowerCase().includes("3d"),
      "Visual-Spatial recommendation targets spatial reasoning, mental rotation, or 3D modeling"
    );
    assert(
      !vsSuggestion.toLowerCase().includes("group discussions and presentations"),
      "Visual-Spatial recommendation does not contain generic group presentation text"
    );

    // ============================================================
    // 5. REPORT TEMPLATE SYNTHESIS & METADATA CHECKS
    // ============================================================
    console.log("\n--- 5. Testing Skill Finder Template Synthesis ---");
    const mockAssessmentResult = {
      attemptId: "test-att-123",
      assessmentCode: "skill-finder",
      participantId: "part-456",
      completedAt: new Date().toISOString(),
      interestDiscovery: interestResult,
      skillBehaviour: {
        strongestIndicators: [
          { code: "PRACTICAL_TECHNICAL_SKILL", name: "Practical & Technical Dexterity", scalePositionPercentage: 85, scalePositionNormalized: 85, stanine: 8, sten: 9, tScore: 65, percentile: 85, description: "Strong practical troubleshooting." },
          { code: "LEADERSHIP_INITIATIVE", name: "Leadership & Enterprise Initiative", scalePositionPercentage: 80, scalePositionNormalized: 80, stanine: 8, sten: 8, tScore: 62, percentile: 80, description: "Proactive project leadership." },
        ],
        developmentOpportunities: [
          { code: "VISUAL_SPATIAL_THINKING", name: "Visual-Spatial Thinking", scalePositionPercentage: 35, scalePositionNormalized: 35, stanine: 3, sten: 4, tScore: 42, percentile: 25, description: "Opportunity to practice spatial reasoning." },
        ],
        dimensions: [],
        summary: "Self-reported working style indicates strong practical confidence.",
      },
      demonstratedAptitude: aptitudeResult,
      developmentalStrengths: {
        topStrengths: [
          { code: "ADAPTABILITY", name: "Adaptability & Agility", scalePositionPercentage: 75, scalePositionNormalized: 75, stanine: 7, sten: 7, tScore: 58, percentile: 75 },
        ],
        dimensions: [],
        learningHabitsSummary: "Strong adaptability habits observed.",
        growthSuggestions,
      },
      learningProfile,
      growthSuggestions,
      profileConfidence: "Adequate for Exploratory Guidance",
      responseQuality: {
        consistencySignal: "High Consistency",
        attentionCheckPassed: true,
        interpretation: "Standard exploratory baseline.",
      },
      explorationDirections: [],
    };

    const studentProfile = {
      name: "Aditya Sharma",
      firstName: "Aditya",
      lastName: "Sharma",
      email: "aditya@example.com",
      dateOfBirth: null,
      age: 16,
      educationStage: "Grade 10",
      gradeLevel: "10",
      schoolName: "Delhi Public School",
      curriculumOrBoard: "CBSE",
    };

    const reportData: SkillFinderReportDTO = await skillFinderReportTemplate.generateReport({
      reportId: "rep-audit-12345",
      result: mockAssessmentResult as any,
      studentProfile,
      languageCode: "en",
    });

    // Verify broad pattern representation
    assert(reportData.interestProfile.isBroadInterestPattern === true, "Report DTO carries isBroadInterestPattern");
    assert(
      reportData.interestProfile.summary.includes("broad exploratory interest"),
      "Interest summary clarifies broad multi-domain pattern"
    );

    // Verify aptitude raw points
    assert(reportData.aptitudeInsights.overallAccuracyPercentage === 17, "Aptitude percentage preserved as 17%");
    assert(reportData.aptitudeInsights.rawScore === 6, "Aptitude raw score preserved as 6");
    assert(reportData.aptitudeInsights.maxScore === 36, "Aptitude max score preserved as 36");

    // Verify confidentiality wording in translations
    const enTrans = REPORT_TRANSLATIONS.en;
    assert(
      !enTrans.confidentialNotice.toLowerCase().includes("calibrated strictly"),
      "Footer notice does not contain 'Calibrated strictly'"
    );
    assert(
      enTrans.confidentialNotice.includes("CONFIDENTIAL — Intended for the student, parent/guardian, and authorized educational counsellor."),
      "Footer notice contains standard confidentiality wording"
    );

    // ============================================================
    // 6. REAL PDF GENERATION & STRICT 3-PAGE VALIDATION
    // ============================================================
    console.log("\n--- 6. Testing Real PDF Generation & Page Count ---");
    const pdfBuffer = await reportPdfGenerator.generatePdf(reportData, "en");
    fs.writeFileSync("/Users/harshadmt/Downloads/3gme-life/skill_finder_validated_report.pdf", pdfBuffer);
    assert(Buffer.isBuffer(pdfBuffer) && pdfBuffer.length > 5000, "Generates valid PDF binary Buffer");

    // Count physical pages by scanning PDF object structure
    const pdfStr = pdfBuffer.toString("binary");
    const pageMatches = pdfStr.match(/\/Type\s*\/Page\b/g);
    const pageCount = pageMatches ? pageMatches.length : 0;
    console.log(`   Physical Page Count in generated PDF: ${pageCount}`);
    assert(pageCount === 3, `PDF has EXACTLY 3 physical pages (got ${pageCount})`);

    // Decompress all FlateDecode streams and decode PDFKit TJ text arrays
    let allDecompressedText = "";
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
    let match: RegExpExecArray | null;
    while ((match = streamRegex.exec(pdfStr)) !== null) {
      try {
        const dec = zlib.inflateSync(Buffer.from(match[1], "binary")).toString("latin1");
        const tjArrays = dec.match(/\[([\s\S]*?)\]\s*TJ/g) || [];
        for (const tj of tjArrays) {
          const hexChunks = tj.match(/<([0-9a-fA-F]+)>/g) || [];
          let line = "";
          for (const h of hexChunks) {
            line += Buffer.from(h.slice(1, -1), "hex").toString("latin1");
          }
          allDecompressedText += line + " ";
        }
      } catch {}
    }

    // Verify no forbidden fixed-trait terminology in PDF text
    assert(!allDecompressedText.includes("natural instinct"), "PDF contains zero occurrences of 'natural instinct'");
    assert(!allDecompressedText.includes("natural resonance"), "PDF contains zero occurrences of 'natural resonance'");
    assert(!allDecompressedText.includes("cognitive potential"), "PDF contains zero occurrences of 'cognitive potential'");
    assert(!allDecompressedText.includes("Primary Cognitive Drivers"), "PDF contains zero occurrences of 'Primary Cognitive Drivers'");
    assert(allDecompressedText.includes("Key Profile Themes"), "PDF contains 'Key Profile Themes'");
    assert(allDecompressedText.includes("HOW TO READ THIS REPORT"), "PDF contains 'HOW TO READ THIS REPORT' section");
    assert(allDecompressedText.includes("BROAD INTEREST PATTERN"), "PDF contains 'BROAD INTEREST PATTERN'");
    assert(allDecompressedText.includes("6 / 36 scored points"), "PDF renders raw score points (6 / 36)");
    assert(allDecompressedText.includes("CONFIDENTIAL"), "PDF footer contains CONFIDENTIAL");

    console.log(`\n============================================================`);
    console.log(`TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
    console.log(`============================================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Test execution error:", error);
    process.exit(1);
  }
}

runSkillFinderAuditTests();
