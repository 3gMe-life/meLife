import { randomUUID } from "crypto";
import { User } from "../../users/user.types";
import { ParticipantProfile } from "../../participants/participant.types";
import { CareerEntity, CareerMatchDTO } from "../career.types";
import { SkillFinderFullResultDTO } from "../../scoring/scoring.types";
import {
  CareerReportDTO,
  ReportCoverData,
  ReportExecutiveSummaryData,
  ReportPsychometricProfileData,
  ReportStrengthItem,
  ReportCareerMatchItem,
  ReportCareerDeepDiveItem,
  ReportAlternativePathwayItem,
  ReportDevelopmentPlanData,
  ReportParentGuidanceData,
  ReportCounsellorInsightsData,
  ReportInterestClusterData,
  ReportDevelopmentSkillItem,
  ReportMethodologyData,
  ReportCrossEvidenceSynthesisData,
  EvidenceSource,
} from "./career-report.types";
import {
  resolveDimensionCode,
  DEVELOPMENT_GUIDANCE,
  diversifyCareerMatches,
} from "./career-report.utils";

interface ReportGeneratorInput {
  user: User;
  participantProfile: ParticipantProfile | null;
  latestResultRow: { id?: string; result_data?: SkillFinderFullResultDTO | null; [key: string]: unknown } | null;
  recommendedPathways: CareerMatchDTO[];
  careersMap: Map<string, CareerEntity>;
  languageCode?: string;
}

export class CareerReportGeneratorService {
  /**
   * Generates a comprehensive 10-section career guidance report (+ protected counsellor appendix).
   */
  generateReport(input: ReportGeneratorInput): CareerReportDTO {
    const lang = (input.languageCode || "en").toLowerCase().trim();
    const resultData: SkillFinderFullResultDTO | null = input.latestResultRow?.result_data || null;
    const isAssessed = Boolean(resultData);
    const reportId = randomUUID();

    // 1. Cover Data
    const cover = this.buildCoverData(input.user, input.participantProfile, resultData, lang);

    // 2. Executive Summary
    const executiveSummary = this.buildExecutiveSummaryData(resultData);

    // 3. Psychometric Profile (RIASEC)
    const psychometricProfile = this.buildPsychometricProfileData(resultData);

    // 4. Strength Analysis (Cognitive & Analytical Indicators)
    const strengthAnalysis = this.buildStrengthAnalysis(resultData);

    // 5. Career Match Results (Diversified UX exploration set + raw score preservation)
    const careerMatches = this.buildCareerMatches(input.recommendedPathways);

    // 6. Career Exploration Details (Top 3 Careers Deep Dive)
    const topPathwaysForDeepDive = careerMatches.slice(0, 3).map((m) => {
      const match = input.recommendedPathways.find((r) => r.id === m.id || r.slug === m.slug);
      return match || input.recommendedPathways[0];
    }).filter(Boolean);

    const careerDeepDives = this.buildCareerDeepDives(topPathwaysForDeepDive, input.careersMap);

    // 7. Alternative Pathways (Adjacent exploration options)
    const alternativePathways = this.buildAlternativePathways(input.recommendedPathways.slice(3, 7));

    // 8. Development Plan (Personalized based on actual assessment evidence)
    const developmentPlan = this.buildDevelopmentPlan(resultData);

    // 9. Parent Guidance (Developmental growth mindset)
    const parentGuidance = this.buildParentGuidance();

    // Cross-Evidence Synthesis (Putting your results together)
    const crossEvidenceSynthesis = this.buildCrossEvidenceSynthesisData(resultData, psychometricProfile);

    // 10. Understanding Your Results & Methodology (Dedicated Section 10 for all students/parents)
    const methodology = this.buildMethodologyData(input.latestResultRow?.id || null);

    // 11. Counsellor Diagnostic Appendix (Protected for licensed guidance professionals)
    const counsellorInsights = this.buildCounsellorInsights(resultData);

    return {
      reportId,
      studentId: input.user.id,
      assessmentResultId: input.latestResultRow?.id || null,
      language: lang,
      templateVersion: "v1.1-comprehensive",
      generatedAt: new Date().toISOString(),
      isAssessed,
      cover,
      executiveSummary,
      psychometricProfile,
      strengthAnalysis,
      careerMatches,
      careerDeepDives,
      alternativePathways,
      developmentPlan,
      parentGuidance,
      crossEvidenceSynthesis,
      methodology,
      counsellorInsights,
    };
  }

  private calculateAge(dobStr?: string | null): number | null {
    if (!dobStr) return null;
    const dob = new Date(dobStr);
    if (isNaN(dob.getTime())) return null;
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  }

  private buildCoverData(
    user: User,
    profile: ParticipantProfile | null,
    resultData: SkillFinderFullResultDTO | null,
    lang: string
  ): ReportCoverData {
    const titlesByLang: Record<string, { title: string; subtitle: string }> = {
      en: {
        title: "Comprehensive Career Exploration & Guidance Report",
        subtitle: "Multidimensional Guidance for Educational & Career Pathway Discovery",
      },
      ml: {
        title: "സമഗ്ര കരിയർ മാർഗ്ഗനിർദ്ദേശ റിപ്പോർട്ട്",
        subtitle: "വിദ്യാഭ്യാസ, തൊഴിൽ സാധ്യതകൾ കണ്ടെത്തുന്നതിനുള്ള ബഹുമുഖ മാർഗ്ഗരേഖ",
      },
      hi: {
        title: "व्यापक करियर अन्वेषण एवं मार्गदर्शन रिपोर्ट",
        subtitle: "शैक्षणिक और करियर अन्वेषण के लिए बहुआयामी मार्गदर्शन",
      },
      ar: {
        title: "التقرير الشامل للتوجيه المهني واستكشاف المسارات",
        subtitle: "دليل متعدد الأبعاد لاكتشاف المسارات الأكاديمية والمهنية",
      },
      ta: {
        title: "முழுமையான தொழில் தேடல் & வழிகாட்டல் அறிக்கை",
        subtitle: "கல்வி மற்றும் தொழில் பாதைகளை கண்டறியும் வழிகாட்டி",
      },
      kn: {
        title: "ಸಮಗ್ರ ವೃತ್ತಿ ಪರಿಶೋಧನೆ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ ವರದಿ",
        subtitle: "ಶೈಕ್ಷಣಿಕ ಮತ್ತು ವೃತ್ತಿ ಪರಿಶೋಧನೆಗಾಗಿ ಬಹುಆಯಾಮದ ಮಾರ್ಗದರ್ಶಿ",
      },
    };

    const strings = titlesByLang[lang] || titlesByLang.en;
    const archetype = resultData?.learningProfile?.archetypeTitle || "Analytical Explorer & Builder Profile";
    const tagline = resultData?.learningProfile?.tagline || "Curious Problem Solver & Practical Thinker";

    const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Student Participant";

    return {
      reportTitle: strings.title,
      reportSubtitle: strings.subtitle,
      studentName: name,
      age: this.calculateAge(profile?.dateOfBirth),
      educationStage: profile?.educationStage || "Secondary / High School",
      gradeLevel: profile?.gradeLevel || "Grade 10",
      schoolName: profile?.schoolName || "Academic Institution",
      assessmentDate: resultData?.completedAt
        ? new Date(resultData.completedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      profileArchetype: archetype,
      archetypeTagline: tagline,
    };
  }

  private buildExecutiveSummaryData(
    resultData: SkillFinderFullResultDTO | null
  ): ReportExecutiveSummaryData {
    if (resultData?.learningProfile) {
      return {
        summary: resultData.learningProfile.strengthSummary ||
          "Demonstrates strong analytical thinking, structured investigation abilities, and natural curiosity towards real-world applications.",
        topStrengths: resultData.developmentalStrengths?.topStrengths?.map((s) => s.name) || [
          "Logical Reasoning & Problem Solving",
          "Structured Investigation",
          "Conceptual Synthesis",
          "Collaborative Communication",
        ],
        learningStyle: "Applied Conceptual & Experiential Problem Solving",
        interestPattern: "High resonance with investigative analysis, technology design, and impactful human systems.",
        explorationMindset: "Focus on multi-disciplinary horizons, experiential learning, and cultivating adaptable cognitive skills.",
      };
    }

    return {
      summary: "This report provides foundational psychometric and career orientation insights based on the 3G MeLife multidimensional developmental framework.",
      topStrengths: [
        "Analytical Thinking",
        "Creative Problem Solving",
        "Structured Communication",
        "Adaptable Learning",
      ],
      learningStyle: "Active Conceptual & Hands-on Exploration",
      interestPattern: "Balanced multidisciplinary curiosity across STEM, human systems, and creative design.",
      explorationMindset: "Embrace open-ended discovery, continuous skill development, and diverse subject exposure.",
    };
  }

  private buildPsychometricProfileData(
    resultData: SkillFinderFullResultDTO | null
  ): ReportPsychometricProfileData {
    // Standard 6 RIASEC Clusters
    const defaultClusters: Array<{ key: ReportInterestClusterData["key"]; code: string; name: string; clusterTitle: string; desc: string; defaultScore: number }> = [
      {
        key: "builder",
        code: "R",
        name: "Builder (Realistic)",
        clusterTitle: "Hands-on, Engineering & Practical Creation",
        desc: "Preference for tangible outcomes, engineering principles, physical & digital systems, and practical tools.",
        defaultScore: 84,
      },
      {
        key: "explorer",
        code: "I",
        name: "Explorer (Investigative)",
        clusterTitle: "Scientific Inquiry, Research & Analytical Thinking",
        desc: "Enjoys observing, investigating, analyzing complex data, solving intellectual challenges, and uncovering core principles.",
        defaultScore: 88,
      },
      {
        key: "creator",
        code: "A",
        name: "Creator (Artistic)",
        clusterTitle: "Design, Innovation, Expression & Aesthetics",
        desc: "Thrives in expressive, open-ended environments, designing novel ideas, visual aesthetics, and creative problem solving.",
        defaultScore: 76,
      },
      {
        key: "helper",
        code: "S",
        name: "Helper (Social)",
        clusterTitle: "Empathy, Mentorship, Collaboration & Human Well-being",
        desc: "Drawn to supporting others, mentoring, interpersonal communication, healthcare, counseling, and social enrichment.",
        defaultScore: 79,
      },
      {
        key: "leader",
        code: "E",
        name: "Leader (Enterprising)",
        clusterTitle: "Initiative, Strategic Influence & Stewardship",
        desc: "Energized by leading initiatives, pitching ideas, driving projects to completion, and navigating organizational goals.",
        defaultScore: 72,
      },
      {
        key: "organizer",
        code: "C",
        name: "Organizer (Conventional)",
        clusterTitle: "Systematic Precision, Process & Data Integrity",
        desc: "Excels at organizing details, establishing efficient routines, managing structured workflows, and ensuring quality standard.",
        defaultScore: 81,
      },
    ];

    const scoredDimensions = resultData?.interestDiscovery?.dimensions || [];
    const interestClusters: ReportInterestClusterData[] = defaultClusters.map((cluster) => {
      const match = scoredDimensions.find((d) => {
        const code = resolveDimensionCode(d);
        return code === cluster.code;
      });
      const percentage = match ? match.scalePositionPercentage : cluster.defaultScore;

      return {
        key: cluster.key,
        code: cluster.code,
        name: cluster.name,
        percentage,
        clusterTitle: cluster.clusterTitle,
        description: cluster.desc,
        evidenceSource: "INTEREST_EVIDENCE",
      };
    });

    // Sort to find top orientations
    const sorted = [...interestClusters].sort((a, b) => b.percentage - a.percentage);
    const primaryOrientation = `${sorted[0]?.name || "Explorer"} & ${sorted[1]?.name || "Builder"}`;
    const secondaryOrientation = sorted[2]?.name || "Creator (Artistic)";

    return {
      interestClusters,
      primaryOrientation,
      secondaryOrientation,
      summary: `The student's interest architecture highlights comparatively stronger reported interest in ${sorted[0]?.clusterTitle.toLowerCase()}, complemented by ${sorted[1]?.clusterTitle.toLowerCase()}. This pattern fosters curiosity and engagement in structured yet innovative environments.`,
      evidenceSource: "INTEREST_EVIDENCE",
    };
  }

  private buildStrengthAnalysis(
    resultData: SkillFinderFullResultDTO | null
  ): ReportStrengthItem[] {
    const canonicalDimensions = [
      {
        code: "PATTERN_LOGIC",
        name: "Pattern Deduction & Analytical Logic",
        defaultScore: 88,
        whatItMeans: "The cognitive capability to break down multifaceted problems into structured, solvable components through systematic deduction.",
        howItHelpsLearning: "Enables fast comprehension of abstract concepts, mathematics, scientific formulas, and algorithmic structures.",
        howItConnectsWithCareers: "Directly powers high-impact performance in software engineering, biomedical research, data science, and system design.",
      },
      {
        code: "NUMERICAL_REASONING",
        name: "Quantitative & Proportional Reasoning",
        defaultScore: 85,
        whatItMeans: "The ability to evaluate quantitative relationships, identify trends in data, and apply proportional logic accurately.",
        howItHelpsLearning: "Strengthens numerical problem solving, laboratory calculations, financial literacy, and data-driven analysis.",
        howItConnectsWithCareers: "Essential for financial analytics, engineering modeling, cyber systems, and scientific experimentation.",
      },
      {
        code: "VERBAL_REASONING",
        name: "Logical Reasoning & Evidence Evaluation",
        defaultScore: 85,
        whatItMeans: "The ability to evaluate evidence objectively, identify underlying assertions, and structure reasoned arguments.",
        howItHelpsLearning: "Strengthens essay argumentation, laboratory research evaluation, debate, and structured exam performance.",
        howItConnectsWithCareers: "Essential for legal analysis, strategic consulting, policy evaluation, cyber forensics, and scientific communication.",
      },
      {
        code: "SPATIAL_REASONING",
        name: "Spatial Visualization & Mental Synthesis",
        defaultScore: 82,
        whatItMeans: "The capacity to visualize spatial transformations, connect distinct geometric concepts, and design intuitive mental models.",
        howItHelpsLearning: "Fosters 3D comprehension in geometry, physics diagrams, architectural drawings, and mechanical assemblies.",
        howItConnectsWithCareers: "Vital for mechanical robotics, product design, multimedia innovation, architectural engineering, and spatial computing.",
      },
    ];

    const liveDimensions = resultData?.demonstratedAptitude?.dimensions || [];

    return canonicalDimensions.map((canonical) => {
      // Find matching live dimension by safe construct code
      const liveDim = liveDimensions.find((d) => {
        const code = resolveDimensionCode(d);
        return code === canonical.code;
      });

      const dimRecord = liveDim as Record<string, unknown> | undefined;
      const rawScore = liveDim
        ? (liveDim.scalePositionPercentage ??
          (typeof dimRecord?.score === "number" ? dimRecord.score : undefined) ??
          liveDim.rawScore ??
          (typeof dimRecord?.normalizedScore === "number" ? dimRecord.normalizedScore : undefined))
        : undefined;
      const score = typeof rawScore === "number" && !isNaN(rawScore) ? rawScore : canonical.defaultScore;

      return {
        code: canonical.code,
        name: canonical.name,
        score,
        whatItMeans: canonical.whatItMeans,
        howItHelpsLearning: canonical.howItHelpsLearning,
        howItConnectsWithCareers: canonical.howItConnectsWithCareers,
        evidenceSource: "DEMONSTRATED_TASK_PERFORMANCE",
      };
    });
  }

  private buildCareerMatches(recommendedPathways: CareerMatchDTO[]): ReportCareerMatchItem[] {
    // Apply display diversification layer across families for Top 4 display
    const { primaryMatches } = diversifyCareerMatches(recommendedPathways, 4);

    return primaryMatches.map((rec): ReportCareerMatchItem => {
      const recRecord = rec as unknown as Record<string, unknown>;
      const rawReasoning = rec.reasoning || recRecord.whyThisMatches;
      const reasoning =
        typeof rawReasoning === "object" && rawReasoning !== null
          ? (rawReasoning as unknown as Record<string, unknown>)
          : {};
      const summary =
        (typeof reasoning.summary === "string" ? reasoning.summary : undefined) ||
        (typeof recRecord.description === "string" ? recRecord.description : undefined) ||
        (typeof recRecord.overview === "string" ? recRecord.overview : undefined) ||
        `Strong multi-dimensional alignment between your profile and ${rec.category || "this pathway"}.`;

      const id = String(rec.id || (typeof recRecord.careerId === "string" ? recRecord.careerId : ""));
      const slug = String(rec.slug || "");
      const title = String(rec.title || "");
      const category = String(rec.category || "");
      const industry = String(rec.industry || "");
      const familyCode = rec.familyCode || (typeof recRecord.family_code === "string" ? recRecord.family_code : undefined);
      const familyName = rec.familyName || (typeof recRecord.family_name === "string" ? recRecord.family_name : undefined);
      const rawMatch = typeof rec.matchPercentage === "number" ? rec.matchPercentage : typeof recRecord.overallScore === "number" ? recRecord.overallScore : 85;
      const futureGrowth = rec.futureGrowth || "MODERATE";

      const whyThisAppears = Array.isArray(reasoning.whyThisAppears)
        ? (reasoning.whyThisAppears as string[])
        : Array.isArray(reasoning.topMatchingFactors)
        ? (reasoning.topMatchingFactors as string[])
        : [
            `Strong affinity with your primary profile archetype and cognitive strengths.`,
            `Aligned with reported interests in ${rec.category || "this"} activities.`,
          ];

      const supportingEvidence = Array.isArray(reasoning.supportingEvidence)
        ? (reasoning.supportingEvidence as Array<{ source: EvidenceSource; label: string; score?: number }>)
        : [
            {
              source: "INTEREST_EVIDENCE" as const,
              label: "Dominant Career Interest Orientation",
              score: 85,
            },
            {
              source: "DEMONSTRATED_TASK_PERFORMANCE" as const,
              label: "Analytical & Logic Task Performance",
              score: 88,
            },
          ];

      const developmentConsiderations = Array.isArray(reasoning.developmentConsiderations)
        ? (reasoning.developmentConsiderations as string[])
        : [
            "Explore foundational coursework and hands-on projects to evaluate day-to-day engagement.",
            "Discuss potential subject streams with teachers and guidance mentors.",
          ];

      const areasToValidate = Array.isArray(reasoning.areasToValidate)
        ? (reasoning.areasToValidate as string[])
        : undefined;

      const topMatchingFactors = Array.isArray(reasoning.topMatchingFactors)
        ? (reasoning.topMatchingFactors as string[])
        : undefined;

      const alignmentNote = typeof reasoning.alignmentNote === "string"
        ? reasoning.alignmentNote
        : undefined;

      const requiredSkills = Array.isArray(rec.keySkills)
        ? rec.keySkills
        : Array.isArray(recRecord.requiredSkills)
        ? (recRecord.requiredSkills as string[])
        : [];

      return {
        id,
        slug,
        title,
        category,
        industry,
        familyCode,
        familyName,
        matchPercentage: rawMatch,
        futureGrowth,
        whyThisMatches: {
          summary,
          whyThisAppears,
          supportingEvidence,
          developmentConsiderations,
          areasToValidate,
          topMatchingFactors,
          alignmentNote,
        },
        requiredSkills,
        evidenceSource: "CAREER_ALIGNMENT_SYNTHESIS" as const,
      };
    });
  }

  private buildCareerDeepDives(
    topPathways: CareerMatchDTO[],
    careersMap: Map<string, CareerEntity>
  ): ReportCareerDeepDiveItem[] {
    return topPathways.map((pathway) => {
      const entity = careersMap.get(pathway.id) || careersMap.get(pathway.slug);

      const defaultRoadmap = [
        {
          stage: "Stage 1: Explore",
          title: "Foundations & Exploration (Grades 9-10)",
          description: "Build strong fundamentals in mathematics, natural sciences, digital literacy, and logic-building puzzles through open experimentation.",
          focusAreas: ["Mathematics & Logic", "Introductory Coding / Scratch", "Science Club Projects", "Hands-on Discovery"],
        },
        {
          stage: "Stage 2: Test & Validate",
          title: "Stream Alignment & Validation (Grades 11-12)",
          description: "Select suitable academic streams (e.g. Science/CS, Mathematics) and test commitment through clubs, hackathons, and small practical projects.",
          focusAreas: ["Advanced Physics / Mathematics", "Computer Science Coursework", "Capstone Projects", "Peer Collaboration"],
        },
        {
          stage: "Stage 3: Choose Direction",
          title: "Higher Education & Applied Exploration (Years 1-4)",
          description: "Pursue a broad Bachelor's degree (B.Tech, B.S., B.Des, or related) while engaging in summer internships and multi-disciplinary labs.",
          focusAreas: ["Core University Curriculum", "Laboratory Research", "Industry Internships", "Open-Source Contributions"],
        },
        {
          stage: "Stage 4: Specialize",
          title: "Professional Entry & Mastery",
          description: "Transition into entry-level specialist roles or pursue focused certifications/graduate studies after accumulated evidence.",
          focusAreas: ["Domain Certifications", "Cross-Functional Collaboration", "Advanced Specialization", "Mentorship"],
        },
      ];

      return {
        id: pathway.id,
        slug: pathway.slug,
        title: entity?.title || pathway.title,
        category: entity?.category || pathway.category,
        overview: entity?.overview || entity?.description || pathway.description,
        whatProfessionalsDo: entity?.learning_roadmap && entity.learning_roadmap.length > 0
          ? [
              "Conduct rigorous diagnostic and analytical investigations on domain problems.",
              "Design, model, and deploy scalable solutions using modern industry methodologies.",
              "Collaborate with multi-disciplinary stakeholders to translate requirements into actionable outcomes.",
              "Continually research emerging technological and methodological advancements.",
            ]
          : [
              "Analyze domain requirements and develop structured solution architectures.",
              "Apply empirical methods to optimize performance and usability.",
              "Maintain high quality standards through rigorous testing and iterative development.",
            ],
        importantSkills: entity?.required_skills || pathway.keySkills || ["Critical Thinking", "Domain Expertise", "Team Collaboration"],
        suitableSubjects: entity?.recommended_subjects || ["Mathematics", "Computer Science", "Physics", "English"],
        learningRoadmap: entity?.learning_roadmap && entity.learning_roadmap.length > 0
          ? entity.learning_roadmap
          : defaultRoadmap,
        futureOpportunities: `Positive long-term demand projected over the next decade. Continuous technological innovation expands career possibilities across diverse global sectors.`,
        sampleRoles: entity?.sample_roles || ["Associate Specialist", "System Architect", "Lead Researcher", "Principal Consultant"],
      };
    });
  }

  private buildAlternativePathways(
    secondaryPathways: CareerMatchDTO[]
  ): ReportAlternativePathwayItem[] {
    return secondaryPathways.map((rec) => ({
      id: rec.id,
      slug: rec.slug,
      title: rec.title,
      category: rec.category,
      matchPercentage: rec.matchPercentage,
      relationNote: `Shares core cognitive traits with your top choices—specifically analytical problem solving and structured design—offering high flexibility if you wish to pivot or combine disciplines.`,
      skills: rec.keySkills || [],
    }));
  }

  private buildDevelopmentPlan(resultData: SkillFinderFullResultDTO | null): ReportDevelopmentPlanData {
    // Dynamically derive focus areas from actual assessment scores
    const candidateSkills: ReportDevelopmentSkillItem[] = [];

    if (resultData) {
      // Collect scored dimensions from aptitude, skill behaviour, and developmental habits
      const allScoredDims = [
        ...(resultData.demonstratedAptitude?.dimensions || []),
        ...(resultData.skillBehaviour?.dimensions || []),
        ...(resultData.developmentalStrengths?.dimensions || []),
      ];

      // Sort by score ascending (lowest scores indicate areas with greatest developmental growth opportunity)
      const sortedByNeed = [...allScoredDims].sort(
        (a, b) => (a.scalePositionPercentage || 50) - (b.scalePositionPercentage || 50)
      );

      const seenCodes = new Set<string>();

      for (const dim of sortedByNeed) {
        const code = resolveDimensionCode(dim);
        if (code && DEVELOPMENT_GUIDANCE[code] && !seenCodes.has(code)) {
          seenCodes.add(code);
          const tpl = DEVELOPMENT_GUIDANCE[code];
          const score = dim.scalePositionPercentage || 50;
          const currentLevel =
            score < 60
              ? `Emerging (${score} / 100)`
              : score < 80
              ? `Developing (${score} / 100)`
              : `Proficient (${score} / 100)`;

          candidateSkills.push({
            skillName: tpl.displayName || "Targeted Capability",
            dimensionCode: tpl.dimensionCode,
            evidenceSource: tpl.evidenceSource,
            currentLevel,
            currentScore: score,
            whySelected: tpl.focusRationale || "Targeted focus area identified from assessment indicators.",
            developmentDirection: tpl.focusRationale,
            suggestedPractice: tpl.suggestedPractice,
            realWorldActivity: tpl.realWorldActivity,
            howToImprove: tpl.howToImprove,
            suggestedActivities: tpl.suggestedActivities,
          });

          if (candidateSkills.length >= 3) break;
        }
      }
    }

    // Fallback to foundational templates if insufficient live dimensions matched
    if (candidateSkills.length < 3) {
      const fallbackKeys = ["PATTERN_LOGIC", "VERBAL_REASONING", "SELF_MANAGEMENT"];
      for (const k of fallbackKeys) {
        if (!candidateSkills.some((c) => c.dimensionCode === k) && DEVELOPMENT_GUIDANCE[k]) {
          const tpl = DEVELOPMENT_GUIDANCE[k];
          candidateSkills.push({
            skillName: tpl.displayName || "Targeted Capability",
            dimensionCode: tpl.dimensionCode,
            evidenceSource: tpl.evidenceSource,
            currentLevel: "Developing (75 / 100)",
            currentScore: 75,
            whySelected: tpl.focusRationale || "Targeted focus area to build foundational competency.",
            developmentDirection: tpl.focusRationale,
            suggestedPractice: tpl.suggestedPractice,
            realWorldActivity: tpl.realWorldActivity,
            howToImprove: tpl.howToImprove,
            suggestedActivities: tpl.suggestedActivities,
          });
          if (candidateSkills.length >= 3) break;
        }
      }
    }

    return {
      summary: "This developmental plan outlines personalized growth recommendations to elevate foundational cognitive capabilities, practical problem-solving habits, and future career readiness over the next 12 to 24 months.",
      skillsToStrengthen: candidateSkills.slice(0, 3),
    };
  }

  private buildParentGuidance(): ReportParentGuidanceData {
    return {
      nurturingMindset:
        "Every child's career trajectory is an evolving journey of exploration rather than a predetermined destination. Fostering a growth mindset, intellectual curiosity, and psychological safety allows students to discover their authentic interests without premature pressure.",
      howParentsCanSupport: [
        "Encourage exploratory curiosity: Provide opportunities for your child to experiment with diverse hobbies, robotics kits, writing, and sciences without demanding immediate mastery.",
        "Celebrate effort over innate talent: Praise disciplined practice, resilience after mistakes, and systematic inquiry rather than raw scores.",
        "Facilitate real-world exposure: Arrange informal conversations with professionals in fields of your child's interest (e.g. engineers, healthcare workers, designers).",
        "Maintain open dialogue: Regularly ask open-ended questions about what topics energize them in school, rather than focusing solely on exam marks.",
      ],
      recommendedDiscussions: [
        "“What project or subject this term made you lose track of time because you enjoyed it so much?”",
        "“If you could solve one big real-world problem in our community or the world, what would it be?”",
        "“Which of the career pathways in this report surprised or excited you the most, and why?”",
        "“What kind of support or tools would help you explore your favorite interests more deeply this year?”",
      ],
      thingsToAvoid: [
        "Avoid early rigidity: Do not force a single narrow career choice too early; academic and career landscapes evolve rapidly.",
        "Avoid peer comparisons: Every student's learning timeline and capability profile develop uniquely.",
        "Avoid imposing unfulfilled personal ambitions: Allow your child to build an authentic pathway aligned with their current interests, emerging strengths, and personal values.",
        "Avoid treating assessment scores as permanent limits: Psychometric assessments capture current readiness and serve as exploration springboards, not permanent ceilings.",
      ],
    };
  }

  private buildCrossEvidenceSynthesisData(
    resultData: SkillFinderFullResultDTO | null,
    profile: ReportPsychometricProfileData
  ): ReportCrossEvidenceSynthesisData {
    const topInterest = profile.interestClusters[0]?.name || "Investigative";
    const secondInterest = profile.interestClusters[1]?.name || "Realistic";

    return {
      whatYouAreDrawnToward: `Strongest interest pull toward ${topInterest} and ${secondInterest} activities, indicating natural motivation for inquiry and practical creation.`,
      whatYouReportStrongly: resultData?.learningProfile?.strengthSummary ||
        "Self-reported preferences highlight systematic problem-solving, intellectual curiosity, and collaborative learning.",
      whatYouDemonstrated: "Task-based performance confirms strong analytical deduction and quantitative problem-solving readiness.",
      whereEvidenceAgrees: "Your reported investigative interests and demonstrated analytical performance mutually reinforce strong readiness for STEM and technical exploration.",
      areasToValidateAndDevelop: "While analytical orientation is strong, computational implementation and time-management habits remain prime opportunities for deliberate practice.",
      nextExplorationSteps: [
        "Engage with introductory hands-on projects or exploratory coursework to test sustained interest.",
        "Discuss academic stream options (e.g. Science/CS, Mathematics) with teachers and certified counsellors.",
        "Select 1-2 focused micro-habits from the development plan to cultivate weekly.",
      ],
    };
  }

  private buildMethodologyData(_resultId: string | null): ReportMethodologyData {
    return {
      assessmentCode: "SKILL_FINDER",
      assessmentName: "3G MeLife Career Exploration & Guidance Assessment",
      scoringVersion: "v2.4-multi-pillar",
      careerTaxonomyVersion: "v2.1-global-taxonomy",
      reportTemplateVersion: "v1.1-comprehensive",
      frameworkSummary:
        "The 3G MeLife assessment framework evaluates students across multiple complementary dimensions: occupational interest orientation (Holland RIASEC model), cognitive and behavioural competencies, demonstrated task performance, and developmental learning habits.",
      whatThisMeasures:
        "The 3G MeLife assessment framework evaluates students across multiple complementary dimensions: occupational interest orientation (Holland RIASEC model), cognitive and behavioural competencies, demonstrated task performance, and developmental learning habits.",
      scoreInterpretationGuide:
        "Scores are presented on a standardized 0–100 scale representing current relative indicator levels within the assessment framework. They reflect developmental snapshots at the time of evaluation.",
      howScoresArePresented:
        "Scores are presented on a standardized 0–100 scale representing current relative indicator levels within the assessment framework. They reflect developmental snapshots at the time of evaluation.",
      alignmentScoreDefinition:
        "Career Alignment Scores compare the student's current profile against reference profiles in the ME LIFE career taxonomy. They are designed for exploration and ranking, not as statistical probabilities of future career success.",
      whatCareerAlignmentMeans:
        "Career Alignment Scores compare the student's current profile against reference profiles in the ME LIFE career taxonomy. They are designed for exploration and ranking, not as statistical probabilities of future career success.",
      whatScoresDoNotMean: [
        "Scores are NOT a permanent measure of intelligence or fixed ability.",
        "Scores are NOT a guarantee or prediction of future career success.",
        "Scores are NOT a clinical or diagnostic assessment.",
        "Scores do NOT replace academic transcripts, teacher evaluations, or personal motivation.",
      ],
      evidenceTaxonomy: [
        {
          source: "INTEREST_EVIDENCE",
          label: "Interest Evidence (RIASEC)",
          description: "Captures environments, tasks, and occupational fields that currently attract and energize the student.",
        },
        {
          source: "SELF_REPORTED_BEHAVIOUR",
          label: "Self-Reported Behaviour",
          description: "Reflects how the student perceives and describes their usual study habits, collaboration, and approach to challenges.",
        },
        {
          source: "DEMONSTRATED_TASK_PERFORMANCE",
          label: "Demonstrated Task Performance",
          description: "Measures performance on objective, timed or scored problem-solving tasks completed during the assessment.",
        },
        {
          source: "DEVELOPMENTAL_HABIT",
          label: "Developmental Habit",
          description: "Identifies dynamic learning habits such as persistence, curiosity, and adaptability that compound over time.",
        },
        {
          source: "PROFILE_SYNTHESIS",
          label: "Profile Synthesis",
          description: "Algorithmic synthesis across multiple evidence streams to identify representative archetypes and learning styles.",
        },
        {
          source: "CAREER_ALIGNMENT_SYNTHESIS",
          label: "Career Alignment Synthesis",
          description: "Multi-pillar distance comparison between student vectors and career profile benchmarks.",
        },
      ],
      interpretationBoundaries: [
        "Assessment results should always be interpreted holistically alongside school grades, extracurricular passions, and family values.",
        "High alignment indicates promising fields to explore, not rigid career prescriptions.",
        "Reassessment is recommended every 12 to 18 months as academic exposure and maturity evolve.",
      ],
      reassessmentGuidance:
        "Because cognitive agility and career interests evolve rapidly during secondary education, periodic reassessment (annually or at major transition points like Grade 10 to 11) is encouraged.",
    };
  }

  private buildCounsellorInsights(
    resultData: SkillFinderFullResultDTO | null
  ): ReportCounsellorInsightsData {
    const rawScores = [
      { code: "COG_PRB", name: "Problem Solving & Deduction", score: 88, band: "High" },
      { code: "COG_LOG", name: "Logical & Spatial Reasoning", score: 85, band: "High" },
      { code: "COG_CRE", name: "Creative Synthesis & Design", score: 82, band: "Proficient" },
      { code: "COG_RES", name: "Research & Fact Verification", score: 86, band: "High" },
      { code: "INT_BLD", name: "Builder (Realistic) Interest", score: 84, band: "High" },
      { code: "INT_EXP", name: "Explorer (Investigative) Interest", score: 88, band: "High" },
      { code: "INT_CRE", name: "Creator (Artistic) Interest", score: 76, band: "Proficient" },
      { code: "INT_SOC", name: "Helper (Social) Interest", score: 79, band: "Proficient" },
      { code: "INT_ENT", name: "Leader (Enterprising) Interest", score: 72, band: "Moderate" },
      { code: "INT_CON", name: "Organizer (Conventional) Interest", score: 81, band: "Proficient" },
    ];

    if (resultData?.interestDiscovery?.dimensions) {
      // Overlay actual scores safely using resolveDimensionCode
      const liveDimensions = [
        ...resultData.interestDiscovery.dimensions,
        ...(resultData.demonstratedAptitude?.dimensions || []),
      ];

      liveDimensions.forEach((dim) => {
        const dimCode = resolveDimensionCode(dim);
        if (!dimCode) return;

        const existing = rawScores.find((r) => {
          const rCode = resolveDimensionCode(r);
          return rCode === dimCode || r.code.toUpperCase() === dimCode;
        });

        if (existing) {
          existing.score = dim.scalePositionPercentage || existing.score;
          existing.band =
            dim.level ||
            (existing.score >= 80 ? "High" : existing.score >= 60 ? "Proficient" : "Moderate");
        }
      });
    }

    return {
      detailedDimensionScores: rawScores,
      assessmentObservations: [
        "High cognitive readiness in analytical abstraction and investigative problem formulation.",
        "Well-balanced interest profile with strongest peaks in STEM and investigative exploration.",
        "Response quality indicators show strong internal consistency and thoughtful completion.",
        "Demonstrates high potential for dual-track interdisciplinary pathways (e.g., Computer Science + Design, Bio-informatics).",
      ],
      suggestedDiscussionPoints: [
        "Explore student's intrinsic excitement around technology and hands-on engineering vs theoretical research.",
        "Discuss balancing rigorous academic preparation with extracurricular leadership and communication projects.",
        "Review stream selection options (e.g. Science + Math vs Science + Computer Science) based on long-term flexibility.",
        "Address any potential test anxiety or pressure related to university entrance exams.",
      ],
      recommendedInterventions: [
        "Schedule a 45-minute 1-on-1 counseling session to synthesize report findings with student's academic performance.",
        "Provide a curated shortlist of summer immersion programs, robotics bootcamps, and science research competitions.",
        "Facilitate a joint 15-minute family alignment discussion to establish shared supportive goals.",
      ],
    };
  }
}

export const careerReportGeneratorService = new CareerReportGeneratorService();
