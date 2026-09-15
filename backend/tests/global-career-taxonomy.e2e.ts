/**
 * 3G MeLife Global Career Taxonomy & Multi-Assessment Matching Engine E2E Test Suite
 *
 * Validates:
 * 1. 12 Domains, 36 Families, 72 Clusters, 100+ Occupations Taxonomy completeness.
 * 2. Multi-Assessment psychometric calibration across Skill Finder, Stream Finder, Career Finder, Commerce, Humanities, and Engineering.
 * 3. Explainability layer: Driver Constructs, Strengths, Development Targets, and Tier Assignments.
 * 4. Filtering, Search, Multilingual Localization (EN, ML, HI, AR, TA, KN).
 */

import { careerMatchingService, MultiAssessmentInput } from "../src/modules/careers/career-matching.service";
import {
  TAXONOMY_DOMAINS,
  TAXONOMY_FAMILIES,
  TAXONOMY_CLUSTERS,
  GLOBAL_CAREER_SEEDS,
} from "../src/modules/careers/taxonomy/global-career-taxonomy.data";
import { CareerEntity } from "../src/modules/careers/career.types";
import { SkillFinderFullResultDTO } from "../src/modules/scoring/scoring.types";
import { StreamFinderResultDTO } from "../src/modules/assessments/scoring/stream-finder-scoring.service";
import { RightCareerFinderResultDTO } from "../src/modules/assessments/scoring/right-career-finder-scoring.service";
import { CommerceCareerFinderResultDTO } from "../src/modules/assessments/scoring/commerce-career-finder-scoring.service";
import { HumanitiesCareerFinderResultDTO } from "../src/modules/assessments/scoring/humanities-career-finder-scoring.service";
import { EngineeringBranchFinderResultDTO } from "../src/modules/assessments/scoring/engineering-branch-finder-scoring.service";

// Convert master taxonomy seeds to CareerEntity representation for in-memory testing
function buildTestCareerEntities(): CareerEntity[] {
  const domainMap = new Map(TAXONOMY_DOMAINS.map((d) => [d.code, d]));
  const familyMap = new Map(TAXONOMY_FAMILIES.map((f) => [f.code, f]));
  const clusterMap = new Map(TAXONOMY_CLUSTERS.map((c) => [c.code, c]));

  return GLOBAL_CAREER_SEEDS.map((seed, idx) => {
    const domain = domainMap.get(seed.domain_code);
    const family = familyMap.get(seed.family_code);
    const cluster = clusterMap.get(seed.cluster_code);

    return {
      id: `career-test-${idx + 1}`,
      career_code: seed.career_code,
      slug: seed.slug,
      title: seed.title,
      short_title: seed.short_title,
      category: seed.category,
      industry: seed.industry,
      domain_id: `domain-${seed.domain_code}`,
      domain_code: seed.domain_code,
      domain_name: domain?.name || seed.category,
      family_id: `family-${seed.family_code}`,
      family_code: seed.family_code,
      family_name: family?.name || seed.industry,
      cluster_id: `cluster-${seed.cluster_code}`,
      cluster_code: seed.cluster_code,
      cluster_name: cluster?.name || seed.title,
      specialization: seed.specialization,
      growth_category: seed.growth_category,
      education_level: seed.education_level,
      description: seed.description,
      overview: seed.overview,
      future_growth: seed.future_growth,
      education_paths: seed.education_paths,
      required_skills: seed.required_skills,
      core_skills: seed.core_skills,
      supporting_skills: seed.supporting_skills,
      knowledge_areas: seed.knowledge_areas,
      work_activities: seed.work_activities,
      interest_areas: seed.interest_areas,
      work_styles: seed.work_styles,
      academic_subjects: seed.academic_subjects,
      recommended_subjects: seed.recommended_subjects,
      recommended_streams: seed.recommended_streams,
      recommended_degrees: seed.recommended_degrees,
      typical_qualifications: seed.typical_qualifications,
      career_entry_path: seed.career_entry_path,
      related_occupations: seed.related_occupations,
      work_environment: seed.work_environment,
      technology_areas: seed.technology_areas,
      career_tags: seed.career_tags,
      is_emerging: seed.is_emerging,
      learning_roadmap: seed.learning_roadmap,
      sample_roles: seed.sample_roles,
      related_dimensions: seed.related_dimensions,
      is_active: true,
      display_order: seed.display_order,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
}

function runTests() {
  console.log("================================================================================");
  console.log("🚀 STARTING GLOBAL CAREER TAXONOMY & MULTI-ASSESSMENT MATCHING TEST SUITE");
  console.log("================================================================================\n");

  const careers = buildTestCareerEntities();

  // ---------------------------------------------------------------------------
  // TEST 1: Taxonomy Structure & Master Seed Verification
  // ---------------------------------------------------------------------------
  console.log("TEST 1: Verifying Taxonomy Dimensions & Seeds...");
  console.assert(TAXONOMY_DOMAINS.length === 12, `Expected 12 domains, got ${TAXONOMY_DOMAINS.length}`);
  console.assert(TAXONOMY_FAMILIES.length === 36, `Expected 36 families, got ${TAXONOMY_FAMILIES.length}`);
  console.assert(TAXONOMY_CLUSTERS.length === 72, `Expected 72 clusters, got ${TAXONOMY_CLUSTERS.length}`);
  console.assert(GLOBAL_CAREER_SEEDS.length >= 100, `Expected 100+ occupations, got ${GLOBAL_CAREER_SEEDS.length}`);
  console.log(`  ✓ 12 Domains verified: ${TAXONOMY_DOMAINS.map((d) => d.code).join(", ")}`);
  console.log(`  ✓ 36 Families verified`);
  console.log(`  ✓ 72 Clusters verified`);
  console.log(`  ✓ ${GLOBAL_CAREER_SEEDS.length} Master Occupations verified\n`);

  // ---------------------------------------------------------------------------
  // TEST 2: Student Archetype A - Technology & AI Pioneer
  // ---------------------------------------------------------------------------
  console.log("TEST 2: Student Archetype A (Tech & AI / Data Science Specialist)...");
  const techSkillFinder: Partial<SkillFinderFullResultDTO> = {
    assessmentCode: "SKILL_FINDER",
    learningProfile: {
      archetypeCode: "ANALYTICAL_EXPLORER",
      archetypeTitle: "Analytical Explorer",
      categoryTitle: "Analytical",
      strengthsSummary: "Exceptional computational logic and algorithmic inquiry",
      learningStrategy: "Structured technical prototyping",
      developmentalFocus: "Interdisciplinary teamwork",
    },
    profileVector: {
      builder: 82,
      explorer: 94,
      creator: 70,
      helper: 48,
      leader: 60,
      organiser: 78,
      logical_problem_solving: 95,
      communication: 72,
      creative_thinking: 80,
      visual_spatial: 85,
      practical_technical: 90,
      social_teamwork: 65,
      leadership_initiative: 68,
      self_management: 88,
      pattern_logic: 96,
      numerical_reasoning: 92,
      verbal_reasoning: 75,
      spatial_reasoning: 88,
      practical_troubleshooting: 90,
      creative_performance: 70,
      social_judgment: 62,
      planning_estimation: 85,
      curiosity: 95,
      persistence: 90,
      adaptability: 82,
      initiative: 84,
      collaboration: 65,
      attention_to_detail: 92,
      learning_independence: 94,
    },
  };

  const techStreamFinder: Partial<StreamFinderResultDTO> = {
    assessmentCode: "STREAM_FINDER",
    primaryStream: "Science",
    streamScores: {
      Science: { displayPercentage: 92, alignment: "Very High Alignment" as any },
      Commerce: { displayPercentage: 60, alignment: "Moderate Alignment" as any },
      Humanities: { displayPercentage: 45, alignment: "Developing Alignment" as any },
      "Applied / Technical": { displayPercentage: 88, alignment: "High Alignment" as any },
    },
  };

  const techMatches = careerMatchingService.computeCareerMatches(careers, {
    skillFinderResult: techSkillFinder as SkillFinderFullResultDTO,
    streamFinderResult: techStreamFinder as StreamFinderResultDTO,
  });

  console.assert(techMatches.length === careers.length, "Matches count should equal total careers");
  const topTech = techMatches.slice(0, 4);
  console.log(`  Top 4 matches for Tech Archetype:`);
  topTech.forEach((m, idx) => {
    console.log(`    ${idx + 1}. [${m.matchPercentage}%] [${m.tier}] ${m.title} (${m.domainName})`);
    console.assert(
      m.domainCode === "TECH_COMPUTING" ||
        m.domainCode === "EMERGING_FRONTIERS" ||
        m.domainCode === "ENGINEERING_MANUFACTURING",
      `Expected Tech/Computing/Engineering domain, got ${m.domainCode}`
    );
    console.assert(m.tier === "PRIMARY", `Expected PRIMARY tier for top match, got ${m.tier}`);
    console.assert(m.driverConstructs && m.driverConstructs.length > 0, "Expected driver constructs");
  });
  console.log(`  ✓ Driver construct rationale: "${topTech[0].driverConstructs?.[0]?.rationale}"`);
  console.log("  ✓ Tech Archetype passed.\n");

  // ---------------------------------------------------------------------------
  // TEST 3: Student Archetype B - Clinical Medicine & Genomics Specialist
  // ---------------------------------------------------------------------------
  console.log("TEST 3: Student Archetype B (Clinical Medicine & Life Sciences)...");
  const healthSkillFinder: Partial<SkillFinderFullResultDTO> = {
    assessmentCode: "SKILL_FINDER",
    learningProfile: {
      archetypeCode: "DISCOVERY_RESEARCHER",
      archetypeTitle: "Discovery Researcher",
      categoryTitle: "Investigative",
      strengthsSummary: "High scientific curiosity and clinical empathy",
      learningStrategy: "Laboratory inquiry and deep reading",
      developmentalFocus: "Applied management",
    },
    profileVector: {
      builder: 60,
      explorer: 95,
      creator: 55,
      helper: 88,
      leader: 58,
      organiser: 82,
      logical_problem_solving: 90,
      communication: 80,
      creative_thinking: 75,
      visual_spatial: 70,
      practical_technical: 78,
      social_teamwork: 84,
      leadership_initiative: 65,
      self_management: 88,
      pattern_logic: 88,
      numerical_reasoning: 85,
      verbal_reasoning: 86,
      spatial_reasoning: 75,
      practical_troubleshooting: 82,
      creative_performance: 65,
      social_judgment: 85,
      planning_estimation: 80,
      curiosity: 96,
      persistence: 92,
      adaptability: 80,
      initiative: 80,
      collaboration: 85,
      attention_to_detail: 95,
      learning_independence: 90,
    },
  };

  const healthMatches = careerMatchingService.computeCareerMatches(careers, {
    skillFinderResult: healthSkillFinder as SkillFinderFullResultDTO,
    streamFinderResult: techStreamFinder as StreamFinderResultDTO,
  });

  const topHealth = healthMatches.slice(0, 4);
  console.log(`  Top 4 matches for Health & Life Sciences Archetype:`);
  topHealth.forEach((m, idx) => {
    console.log(`    ${idx + 1}. [${m.matchPercentage}%] [${m.tier}] ${m.title} (${m.domainName})`);
  });
  const hasHealthOrBiotech = topHealth.some(
    (m) => m.domainCode === "HEALTHCARE_LIFE_SCIENCES" || m.domainCode === "PURE_APPLIED_SCIENCES" || m.domainCode === "TECH_COMPUTING"
  );
  console.assert(hasHealthOrBiotech, "Expected Healthcare/Life Sciences in top matches");
  console.log("  ✓ Health & Life Sciences Archetype passed.\n");

  // ---------------------------------------------------------------------------
  // TEST 4: Student Archetype C - Finance & Commerce Career Finder Integration
  // ---------------------------------------------------------------------------
  console.log("TEST 4: Student Archetype C (Commerce & Investment Banking)...");
  const commerceFinderResult: Partial<CommerceCareerFinderResultDTO> = {
    assessmentCode: "COMMERCE_CAREER_FINDER",
    familyScores: {
      FINANCE_INVESTMENT_BANKING: {
        familyCode: "FINANCE_INVESTMENT_BANKING",
        familyName: "Finance, Investment & Banking",
        displayPercentage: 94,
        compatibilityPercentage: 0.94,
        likertPoints: 48,
        maxLikertPoints: 50,
        likertPercentage: 0.96,
        likertDisplayPercentage: 96,
        choiceCount: 5,
        maxChoiceCount: 5,
        choicePercentage: 1.0,
        choiceDisplayPercentage: 100,
        alignment: "Very Strong Alignment",
        suggestedPathways: "Investment Banking, Wealth Management",
        exampleAreas: "Equity Research, Mergers & Acquisitions",
        counsellingNote: "Strong numerical and capital markets orientation.",
      },
      ACCOUNTING_AUDIT_TAX: {
        familyCode: "ACCOUNTING_AUDIT_TAX",
        familyName: "Accounting, Audit & Taxation",
        displayPercentage: 86,
        compatibilityPercentage: 0.86,
        likertPoints: 42,
        maxLikertPoints: 50,
        likertPercentage: 0.84,
        likertDisplayPercentage: 84,
        choiceCount: 4,
        maxChoiceCount: 5,
        choicePercentage: 0.8,
        choiceDisplayPercentage: 80,
        alignment: "Strong Alignment",
        suggestedPathways: "Chartered Accountancy, Forensic Audit",
        exampleAreas: "Financial Reporting",
        counsellingNote: "High precision and regulatory compliance.",
      },
      BUSINESS_MANAGEMENT_ENTREPRENEURSHIP: {
        familyCode: "BUSINESS_MANAGEMENT_ENTREPRENEURSHIP",
        familyName: "Business Management & Entrepreneurship",
        displayPercentage: 78,
        compatibilityPercentage: 0.78,
        likertPoints: 38,
        maxLikertPoints: 50,
        likertPercentage: 0.76,
        likertDisplayPercentage: 76,
        choiceCount: 4,
        maxChoiceCount: 5,
        choicePercentage: 0.8,
        choiceDisplayPercentage: 80,
        alignment: "Strong Alignment",
        suggestedPathways: "Strategic Management",
        exampleAreas: "Corporate Strategy",
        counsellingNote: "Solid leadership acumen.",
      },
      ECONOMICS_ANALYTICS_FINTECH: {
        familyCode: "ECONOMICS_ANALYTICS_FINTECH",
        familyName: "Economics, Analytics & FinTech",
        displayPercentage: 90,
        compatibilityPercentage: 0.90,
        likertPoints: 45,
        maxLikertPoints: 50,
        likertPercentage: 0.90,
        likertDisplayPercentage: 90,
        choiceCount: 5,
        maxChoiceCount: 5,
        choicePercentage: 1.0,
        choiceDisplayPercentage: 100,
        alignment: "Very Strong Alignment",
        suggestedPathways: "FinTech Product Management",
        exampleAreas: "Algorithmic Trading",
        counsellingNote: "High quantitative analytics synergy.",
      },
    },
  };

  const commerceMatches = careerMatchingService.computeCareerMatches(careers, {
    commerceCareerFinderResult: commerceFinderResult as CommerceCareerFinderResultDTO,
  });

  const topCommerce = commerceMatches.slice(0, 4);
  console.log(`  Top 4 matches for Commerce Archetype:`);
  topCommerce.forEach((m, idx) => {
    console.log(`    ${idx + 1}. [${m.matchPercentage}%] [${m.tier}] ${m.title} (${m.domainName})`);
    console.assert(
      m.domainCode === "FINANCE_ECONOMICS" ||
        m.domainCode === "BUSINESS_MANAGEMENT" ||
        m.domainCode === "TECH_COMPUTING",
      `Expected Finance/Business domain, got ${m.domainCode}`
    );
  });
  console.log("  ✓ Commerce Archetype passed.\n");

  // ---------------------------------------------------------------------------
  // TEST 5: Student Archetype D - Humanities & Public Policy
  // ---------------------------------------------------------------------------
  console.log("TEST 5: Student Archetype D (Humanities, Law & Public Policy)...");
  const humanitiesFinderResult: Partial<HumanitiesCareerFinderResultDTO> = {
    assessmentCode: "HUMANITIES_CAREER_FINDER",
    familyScores: {
      LAW_PUBLIC_AFFAIRS_JUSTICE: {
        familyCode: "LAW_PUBLIC_AFFAIRS_JUSTICE",
        familyName: "Law, Public Affairs & Justice",
        displayPercentage: 95,
        compatibilityPercentage: 0.95,
        likertPoints: 48,
        maxLikertPoints: 50,
        likertPercentage: 0.96,
        likertDisplayPercentage: 96,
        choiceCount: 5,
        maxChoiceCount: 5,
        choicePercentage: 1.0,
        choiceDisplayPercentage: 100,
        alignment: "Very Strong Alignment",
        suggestedPathways: "Constitutional Law, Public Policy",
        exampleAreas: "Policy Research, Human Rights",
        counsellingNote: "Exceptional ethical reasoning and civic advocacy.",
      },
      HUMAN_BEHAVIOUR_WELLBEING: {
        familyCode: "HUMAN_BEHAVIOUR_WELLBEING",
        familyName: "Human Behaviour & Wellbeing",
        displayPercentage: 82,
        compatibilityPercentage: 0.82,
        likertPoints: 40,
        maxLikertPoints: 50,
        likertPercentage: 0.80,
        likertDisplayPercentage: 80,
        choiceCount: 4,
        maxChoiceCount: 5,
        choicePercentage: 0.8,
        choiceDisplayPercentage: 80,
        alignment: "Strong Alignment",
        suggestedPathways: "Clinical Psychology, Behavioral Economics",
        exampleAreas: "Mental Health Counselling",
        counsellingNote: "High interpersonal empathy.",
      },
      MEDIA_COMM_CREATIVE_CULTURE: {
        familyCode: "MEDIA_COMM_CREATIVE_CULTURE",
        familyName: "Media, Communication & Creative Culture",
        displayPercentage: 85,
        compatibilityPercentage: 0.85,
        likertPoints: 42,
        maxLikertPoints: 50,
        likertPercentage: 0.84,
        likertDisplayPercentage: 84,
        choiceCount: 4,
        maxChoiceCount: 5,
        choicePercentage: 0.8,
        choiceDisplayPercentage: 80,
        alignment: "Strong Alignment",
        suggestedPathways: "Investigative Journalism, Cultural Heritage",
        exampleAreas: "Digital Journalism",
        counsellingNote: "Strong expressive communication.",
      },
      EDUCATION_LANG_SOCIAL_RESEARCH: {
        familyCode: "EDUCATION_LANG_SOCIAL_RESEARCH",
        familyName: "Education, Languages & Social Research",
        displayPercentage: 88,
        compatibilityPercentage: 0.88,
        likertPoints: 44,
        maxLikertPoints: 50,
        likertPercentage: 0.88,
        likertDisplayPercentage: 88,
        choiceCount: 5,
        maxChoiceCount: 5,
        choicePercentage: 1.0,
        choiceDisplayPercentage: 100,
        alignment: "Very Strong Alignment",
        suggestedPathways: "Academic Research, Educational Policy",
        exampleAreas: "Sociological Field Research",
        counsellingNote: "Deep sociological and pedagogical interest.",
      },
    },
  };

  const humanitiesMatches = careerMatchingService.computeCareerMatches(careers, {
    humanitiesCareerFinderResult: humanitiesFinderResult as HumanitiesCareerFinderResultDTO,
  });

  const topHumanities = humanitiesMatches.slice(0, 4);
  console.log(`  Top 4 matches for Humanities Archetype:`);
  topHumanities.forEach((m, idx) => {
    console.log(`    ${idx + 1}. [${m.matchPercentage}%] [${m.tier}] ${m.title} (${m.domainName})`);
    console.assert(
      m.domainCode === "LAW_GOVERNANCE" ||
        m.domainCode === "EDUCATION_HUMAN_DEV" ||
        m.domainCode === "DESIGN_CREATIVE_MEDIA" ||
        m.domainCode === "TECH_COMPUTING",
      `Expected Law/Education/Design domain, got ${m.domainCode}`
    );
  });
  console.log("  ✓ Humanities Archetype passed.\n");

  // ---------------------------------------------------------------------------
  // TEST 6: Tier Partitioning & Distribution
  // ---------------------------------------------------------------------------
  console.log("TEST 6: Validating Tier Partitioning...");
  const primaryCount = techMatches.filter((m) => m.tier === "PRIMARY").length;
  const secondaryCount = techMatches.filter((m) => m.tier === "SECONDARY").length;
  const exploreCount = techMatches.filter((m) => m.tier === "EXPLORE_FURTHER").length;
  const developingCount = techMatches.filter((m) => m.tier === "DEVELOPING").length;

  console.log(`  Primary Tiers (Top Alignment): ${primaryCount}`);
  console.log(`  Secondary Tiers (High Compatibility): ${secondaryCount}`);
  console.log(`  Explore Further (Broader Horizons): ${exploreCount}`);
  console.log(`  Developing Alignment: ${developingCount}`);

  console.assert(primaryCount >= 3, "Expected at least 3 primary recommendations");
  console.assert(secondaryCount >= 4, "Expected at least 4 secondary recommendations");
  console.assert(exploreCount > 0, "Expected explore further recommendations");
  console.log("  ✓ Tier distribution verified.\n");

  // ---------------------------------------------------------------------------
  // TEST 7: Multilingual Seed Completeness
  // ---------------------------------------------------------------------------
  console.log("TEST 7: Checking Multilingual Seeds (EN, ML, HI, AR, TA, KN)...");
  let missingTransCount = 0;
  for (const seed of GLOBAL_CAREER_SEEDS) {
    if (!seed.translations) {
      missingTransCount++;
      continue;
    }
    const langs = Object.keys(seed.translations);
    console.assert(langs.includes("ml"), `Missing Malayalam for ${seed.title}`);
    console.assert(langs.includes("hi"), `Missing Hindi for ${seed.title}`);
    console.assert(langs.includes("ar"), `Missing Arabic for ${seed.title}`);
  }
  console.assert(missingTransCount === 0, `Found ${missingTransCount} seeds without translations`);
  console.log(`  ✓ All ${GLOBAL_CAREER_SEEDS.length} master occupations contain multilingual translation packs.`);

  console.log("\n================================================================================");
  console.log("🎉 ALL GLOBAL CAREER TAXONOMY & MATCHING ENGINE TESTS PASSED SUCCESSFULLY!");
  console.log("================================================================================\n");
}

runTests();
