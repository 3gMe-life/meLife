import { careerReportPdfGenerator } from "../src/modules/careers/reports/career-report-pdf.generator";
import { careerReportGeneratorService } from "../src/modules/careers/reports/career-report-generator.service";
import { resolveDimensionCode, diversifyCareerMatches, DEVELOPMENT_GUIDANCE } from "../src/modules/careers/reports/career-report.utils";
import { CareerReportDTO, EvidenceSource } from "../src/modules/careers/reports/career-report.types";
import { CareerMatchResult } from "../src/modules/careers/career.types";

async function runAuditFixesTests() {
  console.log("🧪 Starting Comprehensive Career Exploration Report Audit Fixes Test Suite...\n");

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
    // 1. TEST DIMENSION CODE NORMALIZATION & MISSING CODE CRASH RESILIENCE
    // ============================================================
    console.log("--- 1. Testing Dimension Code Normalization & Safety ---");
    assert(resolveDimensionCode({ code: "LOGICAL_REASONING" }) === "LOGICAL_REASONING", "Resolves code property");
    assert(resolveDimensionCode({ dimensionCode: "NUMERICAL_ANALYSIS" }) === "NUMERICAL_ANALYSIS", "Resolves dimensionCode property");
    assert(resolveDimensionCode({ constructCode: "ABSTRACT_LOGIC" }) === "ABSTRACT_LOGIC", "Resolves constructCode property");
    assert(resolveDimensionCode({ key: "CREATIVE_SYNTHESIS" }) === "CREATIVE_SYNTHESIS", "Resolves key property");
    assert(resolveDimensionCode({ dimension: "SPATIAL_REASONING" }) === "SPATIAL_REASONING", "Resolves dimension string");
    assert(resolveDimensionCode({ name: "Analytical Problem Solving" }) === "ANALYTICAL_PROBLEM_SOLVING", "Resolves normalized name");
    assert(resolveDimensionCode(null) === null, "Handles null safely without throwing");
    assert(resolveDimensionCode(undefined) === null, "Handles undefined safely without throwing");
    assert(resolveDimensionCode({}) === null, "Handles empty object safely without throwing");
    assert(resolveDimensionCode({ irrelevant: 123 }) === null, "Handles unrecognized shape safely without throwing");

    // ============================================================
    // 2. TEST CAREER SCORE PRESERVATION & DIVERSIFICATION
    // ============================================================
    console.log("\n--- 2. Testing Career Score Preservation & Diversification ---");
    const rawMatches: CareerMatchResult[] = [
      {
        careerId: "ai-1",
        title: "AI Architect",
        domain: "Engineering & Technology",
        clusterTitle: "AI & Data",
        family_code: "FAM_AI",
        overallScore: 92,
        futureGrowthOutlook: "Very High Growth",
        educationRequirement: "Bachelor of Science",
        riasecAlignment: { primaryCode: "I", secondaryCode: "R", matchScore: 94 },
        aptitudeAlignment: { requiredAptitudes: [], score: 90 },
        behaviourAlignment: { score: 91 },
        habitAlignment: { score: 92 },
        matchingStrengths: ["Logical Deduction"],
        reasoning: {
          summary: "Top AI career match",
          topMatchingFactors: ["Investigative orientation"],
          whyThisAppears: ["Top investigative alignment"],
          supportingEvidence: [{ source: "INTEREST_EVIDENCE", label: "Explorer", score: 94 }],
          developmentConsiderations: ["Coursework in machine learning"],
        },
      },
      {
        careerId: "ai-2",
        title: "ML Architect",
        domain: "Engineering & Technology",
        clusterTitle: "AI & Data",
        family_code: "FAM_AI",
        overallScore: 91,
        futureGrowthOutlook: "Very High Growth",
        educationRequirement: "Bachelor of Science",
        riasecAlignment: { primaryCode: "I", secondaryCode: "R", matchScore: 93 },
        aptitudeAlignment: { requiredAptitudes: [], score: 89 },
        behaviourAlignment: { score: 90 },
        habitAlignment: { score: 91 },
        matchingStrengths: ["Logical Deduction"],
        reasoning: {
          summary: "ML Architect match",
          topMatchingFactors: ["Investigative orientation"],
          whyThisAppears: ["ML alignment"],
          supportingEvidence: [],
        },
      },
      {
        careerId: "bio-1",
        title: "Bioinformatics Specialist",
        domain: "Healthcare & Life Sciences",
        clusterTitle: "Biotechnology",
        family_code: "FAM_BIO",
        overallScore: 89,
        futureGrowthOutlook: "High Growth",
        educationRequirement: "Bachelor of Science",
        riasecAlignment: { primaryCode: "I", secondaryCode: "A", matchScore: 90 },
        aptitudeAlignment: { requiredAptitudes: [], score: 88 },
        behaviourAlignment: { score: 89 },
        habitAlignment: { score: 89 },
        matchingStrengths: ["Analytical Problem Solving"],
        reasoning: {
          summary: "Bioinformatics match",
          topMatchingFactors: ["Life science inquiry"],
          whyThisAppears: ["Computational biology alignment"],
          supportingEvidence: [],
        },
      },
      {
        careerId: "des-1",
        title: "Interactive System Designer",
        domain: "Arts & Digital Media",
        clusterTitle: "Human-Centered Design",
        family_code: "FAM_DESIGN",
        overallScore: 87,
        futureGrowthOutlook: "Very High Growth",
        educationRequirement: "Bachelor of Design",
        riasecAlignment: { primaryCode: "A", secondaryCode: "I", matchScore: 88 },
        aptitudeAlignment: { requiredAptitudes: [], score: 86 },
        behaviourAlignment: { score: 88 },
        habitAlignment: { score: 87 },
        matchingStrengths: ["Creative Synthesis"],
        reasoning: {
          summary: "System design match",
          topMatchingFactors: ["Creative-analytical intersection"],
          whyThisAppears: ["Design logic alignment"],
          supportingEvidence: [],
        },
      },
      {
        careerId: "biz-1",
        title: "Strategic Quantitative Analyst",
        domain: "Business & Management",
        clusterTitle: "Financial Analytics",
        family_code: "FAM_FIN",
        overallScore: 86,
        futureGrowthOutlook: "High Growth",
        educationRequirement: "Bachelor of Economics",
        riasecAlignment: { primaryCode: "E", secondaryCode: "C", matchScore: 86 },
        aptitudeAlignment: { requiredAptitudes: [], score: 85 },
        behaviourAlignment: { score: 87 },
        habitAlignment: { score: 86 },
        matchingStrengths: ["Numerical Reasoning"],
        reasoning: {
          summary: "Financial analyst match",
          topMatchingFactors: ["Quantitative systems"],
          whyThisAppears: ["Analytical business modeling"],
          supportingEvidence: [],
        },
      },
    ];

    const { primaryMatches: diversified } = diversifyCareerMatches(rawMatches, 4);

    // Verify raw score preservation
    assert(diversified[0].overallScore === 92, "Raw score for top match #1 is preserved exactly (92)");
    assert(diversified[1].careerId === "bio-1" && diversified[1].overallScore === 89, "Second match is diversified family (Bioinformatics) preserving raw score 89");
    assert(diversified[2].careerId === "des-1" && diversified[2].overallScore === 87, "Third match is diversified family (Design) preserving raw score 87");
    assert(diversified[3].careerId === "biz-1" && diversified[3].overallScore === 86, "Fourth match is diversified family (Business) preserving raw score 86");

    // ============================================================
    // 3. TEST DYNAMIC ASSESSMENT-DERIVED DEVELOPMENT PLAN
    // ============================================================
    console.log("\n--- 3. Testing Dynamic Development Plan Guidance ---");
    assert(Boolean(DEVELOPMENT_GUIDANCE["NUMERICAL_REASONING"]), "Central DEVELOPMENT_GUIDANCE contains NUMERICAL_REASONING");
    assert(Boolean(DEVELOPMENT_GUIDANCE["NUMERICAL_REASONING"].suggestedPractice), "Guidance specifies actionable suggestedPractice");
    assert(Boolean(DEVELOPMENT_GUIDANCE["NUMERICAL_REASONING"].realWorldActivity), "Guidance specifies actionable realWorldActivity");
    assert(Boolean(DEVELOPMENT_GUIDANCE["SELF_MANAGEMENT"]), "Central DEVELOPMENT_GUIDANCE contains SELF_MANAGEMENT");

    // ============================================================
    // 4. TEST REPORT GENERATOR DTO BUILD & BACKWARD COMPATIBILITY
    // ============================================================
    console.log("\n--- 4. Testing Report Generator DTO Build & Scientific Terms ---");
    const mockUser: any = {
      id: "usr-123",
      email: "aarav@example.com",
      role: "PARTICIPANT",
    };

    const mockProfile: any = {
      id: "student-123",
      user_id: "usr-123",
      first_name: "Aarav",
      last_name: "Sharma",
      grade: "Grade 10",
      school_name: "Delhi Public School",
      age: 15,
      gender: "Male",
    };

    const mockResultData = {
      riasecScores: {
        realistic: 84,
        investigative: 88,
        artistic: 76,
        social: 79,
        enterprising: 72,
        conventional: 81,
      },
      demonstratedAptitude: {
        score: 86,
        dimensions: [
          { code: "LOGICAL_REASONING", name: "Logical Reasoning", score: 88 },
          { constructCode: "NUMERICAL_ANALYSIS", name: "Numerical Reasoning", score: 74 },
          { dimensionCode: "ABSTRACT_LOGIC", name: "Abstract Logic", score: 82 },
          { name: "Verbal Analysis", score: 78 },
        ],
      },
      skillBehaviour: {
        score: 82,
        dimensions: [
          { code: "CRITICAL_THINKING", name: "Critical Thinking", score: 85 },
          { code: "COLLABORATION", name: "Collaboration", score: 80 },
        ],
      },
      developmentalHabits: {
        score: 84,
        dimensions: [
          { code: "SELF_REGULATION", name: "Self Regulation", score: 76 },
          { code: "PERSISTENCE", name: "Persistence", score: 86 },
        ],
      },
      overallScore: 85,
    };

    const mockResultRow: any = {
      id: "res-456",
      assessment_id: "assess-skill-finder",
      assessment_code: "SKILL_FINDER",
      participant_id: "student-123",
      result_data: mockResultData,
      completed_at: new Date(),
    };

    const recommendedPathways: any[] = rawMatches.map((m) => ({
      careerId: m.careerId,
      title: m.title,
      category: m.domain,
      domain: m.domain,
      industry: m.clusterTitle,
      matchPercentage: m.overallScore,
      futureGrowth: m.futureGrowthOutlook,
      whyThisMatches: m.reasoning,
      requiredSkills: ["Problem Solving", "Logic"],
    }));

    const careersMap = new Map<string, any>();
    for (const m of rawMatches) {
      careersMap.set(m.careerId, {
        id: m.careerId,
        title: m.title,
        domain: m.domain,
        family_code: m.family_code,
        salary_entry_inr: 800000,
        salary_experienced_inr: 2500000,
        top_skills: ["Logic", "Math"],
        education_level: "Bachelor of Science",
        education_track: "Engineering",
        work_environment: "Collaborative research lab",
        core_tasks: ["Design algorithms", "Analyze performance"],
        riasec_code: "IR",
      });
    }

    const reportDto = careerReportGeneratorService.generateReport({
      user: mockUser,
      participantProfile: mockProfile,
      latestResultRow: mockResultRow,
      recommendedPathways,
      careersMap,
      languageCode: "en",
    });

    assert(reportDto.templateVersion === "v1.1-comprehensive", "Report template version upgraded to v1.1-comprehensive");
    assert(Boolean(reportDto.methodology), "Section 10 methodology data generated for student report");
    assert(Boolean(reportDto.methodology?.whatCareerAlignmentMeans), "Section 10 includes whatCareerAlignmentMeans explanation");
    assert(reportDto.methodology?.whatScoresDoNotMean?.length! > 0, "Section 10 includes whatScoresDoNotMean limitations");
    assert(reportDto.careerMatches[0].matchPercentage === 92, "First career match preserves score (92)");

    // Check evidence source taxonomy
    const firstMatch = reportDto.careerMatches[0];
    assert(Boolean(firstMatch.whyThisMatches?.whyThisAppears), "Career match has structured whyThisAppears");
    assert(Boolean(firstMatch.whyThisMatches?.supportingEvidence), "Career match has structured supportingEvidence");
    if (firstMatch.whyThisMatches?.supportingEvidence && firstMatch.whyThisMatches.supportingEvidence.length > 0) {
      const src = firstMatch.whyThisMatches.supportingEvidence[0].source;
      const validSources: EvidenceSource[] = [
        "INTEREST_EVIDENCE",
        "DEMONSTRATED_TASK_PERFORMANCE",
        "SELF_REPORTED_BEHAVIOUR",
        "DEVELOPMENTAL_HABIT",
        "PROFILE_SYNTHESIS",
        "CAREER_ALIGNMENT_SYNTHESIS",
      ];
      assert(validSources.includes(src), `Evidence source '${src}' belongs to typed EvidenceSource taxonomy`);
    }

    // Verify unassessed fallback leakage is absent
    const reportJson = JSON.stringify(reportDto);
    assert(!reportJson.includes("Complete a 3G MeLife assessment to calibrate"), "Zero unassessed placeholder leakage in assessed report");
    assert(!reportJson.includes("validated developmental career progression algorithms"), "Removed unsupported validated algorithm claim");
    assert(!reportJson.includes("Official Platform Assessment Certification"), "Replaced Certification wording with Assessment Record");

    // ============================================================
    // 5. TEST PDF GENERATION & GHOST-PAGE PREVENTION
    // ============================================================
    console.log("\n--- 5. Testing PDF Generation & Ghost-Page Prevention ---");
    const studentReportDto = { ...reportDto };
    delete studentReportDto.counsellorInsights;
    const pdfBuffer = await careerReportPdfGenerator.generate(studentReportDto, false);
    assert(pdfBuffer.byteLength > 10000, `Generated valid PDF binary buffer (${pdfBuffer.byteLength} bytes)`);

    // Verify PDF page count in PDF structure
    const pdfString = pdfBuffer.toString("latin1");
    const pageMatches = pdfString.match(/\/Type\s*\/Page\b/g);
    const pageCount = pageMatches ? pageMatches.length : 0;
    console.log(`📄 Physical PDF Page Count: ${pageCount}`);

    // Standard student report has 11 pages (Cover + 9 sections + Section 10 Methodology)
    // 10 content pages must NEVER become 28 pages!
    assert(pageCount === 11, `Physical page count is ${pageCount} (Expected exactly 11 pages, NO 28-page ghost page explosion)`);
    assert(pageCount !== 28, "Confirmed 28-page ghost page bug is completely eliminated");

    // Verify no mojibake corruption characters (like raw UTF-8 emoji bytes in single-byte fonts)
    const forbiddenGlyphs = ["🧠", "🎨", "💬", "🌱", "🚀", "✦", "✓", "✕", "💡", "🔍", "📈"];
    const hasForbiddenInReport = forbiddenGlyphs.some((glyph) => reportJson.includes(glyph));
    assert(!hasForbiddenInReport, "Report JSON contains zero unsupported emoji/glyph symbols");
    assert(!reportJson.includes("\uFFFD"), "Report JSON contains zero Unicode replacement characters (U+FFFD)");

    // Test with Counsellor Insights included
    console.log("\n--- 6. Testing Counsellor Appendix PDF Generation ---");
    const counsellorReportDto: CareerReportDTO = {
      ...reportDto,
      counsellorInsights: {
        detailedDimensionScores: [
          { dimensionCode: "LOGICAL_REASONING", dimensionName: "Logical Reasoning", rawScore: 88, normalizedScore: 88, percentileEstimate: 85, stanine: 7, band: "High" },
        ],
        assessmentObservations: ["Candidate demonstrates rapid deductive logic."],
        recommendedInterventions: ["Encourage participation in regional science Olympiads."],
        longitudinalNotes: "Schedule follow-up review in 12 months.",
      },
    };

    const counsellorPdfBuffer = await careerReportPdfGenerator.generate(counsellorReportDto, true);
    const counsellorPdfString = counsellorPdfBuffer.toString("latin1");
    const counsellorPages = counsellorPdfString.match(/\/Type\s*\/Page\b/g)?.length || 0;
    console.log(`📄 Counsellor PDF Page Count: ${counsellorPages}`);
    assert(counsellorPages === 12, `Counsellor PDF includes protected Section 11/Appendix resulting in exactly 12 pages`);

    // ============================================================
    // 7. TEST LEGACY REPORT BACKWARD COMPATIBILITY
    // ============================================================
    console.log("\n--- 7. Testing Legacy Report Backward Compatibility ---");
    const legacyReportDto: any = {
      reportId: "legacy-rep-001",
      language: "en",
      templateVersion: "v1.0-comprehensive",
      cover: reportDto.cover,
      executiveSummary: reportDto.executiveSummary,
      psychometricProfile: reportDto.psychometricProfile,
      strengthAnalysis: reportDto.strengthAnalysis,
      careerMatches: [
        {
          id: "legacy-career-1",
          title: "Robotics Engineer",
          category: "Engineering",
          matchPercentage: 88,
          whyThisMatches: {
            summary: "Legacy summary with only string format",
          },
        },
      ],
      careerDeepDives: reportDto.careerDeepDives,
      alternativePathways: reportDto.alternativePathways,
      developmentPlan: {
        summary: "Legacy development plan",
        skillsToStrengthen: [
          {
            skillName: "Algorithmic Logic",
            currentLevel: "Emerging",
            howToImprove: ["Practice coding puzzles"],
            suggestedActivities: ["Build small scripts"],
          },
        ],
      },
      parentGuidance: reportDto.parentGuidance,
    };

    const legacyPdfBuffer = await careerReportPdfGenerator.generate(legacyReportDto);
    assert(legacyPdfBuffer.byteLength > 10000, "Legacy report without new structured fields renders to PDF without crashing");

    console.log(`\n==================================================`);
    console.log(`📊 Audit Fixes Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`==================================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("💥 Unhandled exception during audit fixes test suite:", err);
    process.exit(1);
  }
}

runAuditFixesTests();
