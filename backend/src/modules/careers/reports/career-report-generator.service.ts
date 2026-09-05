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
} from "./career-report.types";

interface ReportGeneratorInput {
  user: User;
  participantProfile: ParticipantProfile | null;
  latestResultRow: any | null;
  recommendedPathways: CareerMatchDTO[];
  careersMap: Map<string, CareerEntity>;
  languageCode?: string;
}

export class CareerReportGeneratorService {
  /**
   * Generates a comprehensive 10-section career guidance report.
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

    // 3. Psychometric Profile
    const psychometricProfile = this.buildPsychometricProfileData(resultData);

    // 4. Strength Analysis (3-way impact)
    const strengthAnalysis = this.buildStrengthAnalysis(resultData);

    // 5. Career Match Results
    const careerMatches = this.buildCareerMatches(input.recommendedPathways);

    // 6. Career Exploration Details (Top 3 Careers Deep Dive)
    const careerDeepDives = this.buildCareerDeepDives(input.recommendedPathways.slice(0, 3), input.careersMap);

    // 7. Alternative Pathways (Rank 4 to 6)
    const alternativePathways = this.buildAlternativePathways(input.recommendedPathways.slice(3, 6));

    // 8. Development Plan
    const developmentPlan = this.buildDevelopmentPlan();

    // 9. Parent Guidance
    const parentGuidance = this.buildParentGuidance();

    // 10. Counsellor Insights (Protected)
    const counsellorInsights = this.buildCounsellorInsights(resultData);

    return {
      reportId,
      studentId: input.user.id,
      assessmentResultId: input.latestResultRow?.id || null,
      language: lang,
      templateVersion: "v1.0-comprehensive",
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
        title: "Comprehensive Psychometric & Career Exploration Report",
        subtitle: "Multidimensional Guidance for Educational & Career Pathway Discovery",
      },
      ml: {
        title: "സമഗ്ര സൈക്കോമെട്രിക് & തൊഴിൽ മാർഗ്ഗനിർദ്ദേശ റിപ്പോർട്ട്",
        subtitle: "വിദ്യാഭ്യാസ, തൊഴിൽ സാധ്യതകൾ കണ്ടെത്തുന്നതിനുള്ള ബഹുമുഖ മാർഗ്ഗരേഖ",
      },
      hi: {
        title: "व्यापक साइकोमेट्रिक एवं करियर मार्गदर्शन रिपोर्ट",
        subtitle: "शैक्षणिक और करियर अन्वेषण के लिए बहुआयामी मार्गदर्शन",
      },
      ar: {
        title: "التقرير الشامل للتوجيه المهني والقياس النفسي",
        subtitle: "دليل متعدد الأبعاد لاكتشاف المسارات الأكاديمية والمهنية",
      },
      ta: {
        title: "முழுமையான உளவியல் & தொழில் வழிகாட்டல் அறிக்கை",
        subtitle: "கல்வி மற்றும் தொழில் பாதைகளை கண்டறியும் வழிகாட்டி",
      },
      kn: {
        title: "ಸಮಗ್ರ ಸೈಕೋಮೆಟ್ರಿಕ್ ಮತ್ತು ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ ವರದಿ",
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
      gradeLevel: profile?.gradeLevel || "High School (Grade 9-12)",
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
      summary: "This report provides foundational psychometric and career orientation insights based on validated developmental benchmarks.",
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
      const match = scoredDimensions.find(
        (d) => d.code.toUpperCase() === cluster.code || d.name.toLowerCase().includes(cluster.key)
      );
      const percentage = match ? match.scalePositionPercentage : cluster.defaultScore;

      return {
        key: cluster.key,
        code: cluster.code,
        name: cluster.name,
        percentage,
        clusterTitle: cluster.clusterTitle,
        description: cluster.desc,
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
      summary: `The student's interest architecture highlights a prominent orientation toward ${sorted[0]?.clusterTitle.toLowerCase()}, complemented by ${sorted[1]?.clusterTitle.toLowerCase()}. This blend fosters strong problem-solving capabilities in structured yet innovative environments.`,
    };
  }

  private buildStrengthAnalysis(
    resultData: SkillFinderFullResultDTO | null
  ): ReportStrengthItem[] {
    const rawStrengths = [
      {
        name: "Analytical Problem Solving",
        score: 88,
        whatItMeans: "The cognitive capability to break down multifaceted problems into structured, solvable components through systematic deduction.",
        howItHelpsLearning: "Enables fast comprehension of abstract concepts, mathematics, scientific formulas, and algorithmic structures.",
        howItConnectsWithCareers: "Directly powers high-impact performance in software engineering, biomedical research, data science, and system design.",
      },
      {
        name: "Logical Reasoning & Critical Thinking",
        score: 85,
        whatItMeans: "The ability to evaluate evidence objectively, identify underlying patterns, and avoid emotional biases in decision-making.",
        howItHelpsLearning: "Strengthens essay argumentation, laboratory research evaluation, debate, and structured exam performance.",
        howItConnectsWithCareers: "Essential for legal analysis, strategic consulting, financial analysis, cyber forensics, and scientific investigation.",
      },
      {
        name: "Creative Synthesis & Design Thinking",
        score: 82,
        whatItMeans: "The capacity to connect seemingly unrelated ideas, envision novel solutions, and design intuitive user or product experiences.",
        howItHelpsLearning: "Fosters creative writing, innovative science fair projects, UI/UX prototyping, and interdisciplinary project work.",
        howItConnectsWithCareers: "Vital for product management, UX architecture, multimedia innovation, architectural engineering, and biotechnology.",
      },
      {
        name: "Systematic Research & Discovery",
        score: 86,
        whatItMeans: "A methodical drive to explore in-depth, verify facts, conduct rigorous investigations, and synthesize complex literature.",
        howItHelpsLearning: "Accelerates independent study, academic paper writing, honors projects, and complex project documentation.",
        howItConnectsWithCareers: "Core skill for academic research, medical diagnostics, AI machine learning research, and environmental analytics.",
      },
    ];

    if (resultData?.demonstratedAptitude?.dimensions) {
      // Map live dimensions if available
      return rawStrengths.map((st, idx) => {
        const liveDim = resultData.demonstratedAptitude.dimensions[idx] || resultData.developmentalStrengths?.topStrengths?.[idx];
        if (liveDim) {
          return {
            ...st,
            score: liveDim.scalePositionPercentage || st.score,
          };
        }
        return st;
      });
    }

    return rawStrengths;
  }

  private buildCareerMatches(recommendedPathways: CareerMatchDTO[]): ReportCareerMatchItem[] {
    return recommendedPathways.map((rec) => ({
      id: rec.id,
      slug: rec.slug,
      title: rec.title,
      category: rec.category,
      industry: rec.industry,
      matchPercentage: rec.matchPercentage,
      futureGrowth: rec.futureGrowth,
      whyThisMatches: {
        summary: rec.reasoning.summary,
        topMatchingFactors: rec.reasoning.topMatchingFactors,
        alignmentNote: rec.reasoning.alignmentNote,
      },
      requiredSkills: rec.keySkills || [],
    }));
  }

  private buildCareerDeepDives(
    topPathways: CareerMatchDTO[],
    careersMap: Map<string, CareerEntity>
  ): ReportCareerDeepDiveItem[] {
    return topPathways.map((pathway) => {
      const entity = careersMap.get(pathway.id) || careersMap.get(pathway.slug);

      const defaultRoadmap = [
        {
          stage: "High School (Grades 9-10)",
          title: "Foundational STEM & Critical Exploration",
          description: "Build strong fundamentals in mathematics, natural sciences, digital literacy, and logic-building puzzles.",
          focusAreas: ["Mathematics & Algebra", "Introductory Coding / Logic", "Science Club Projects", "English Communication"],
        },
        {
          stage: "Higher Secondary (Grades 11-12)",
          title: "Stream Specialization & Applied Projects",
          description: "Select suitable academic stream (e.g. Science/CS, Mathematics, Data Analytics) and undertake practical capstone projects.",
          focusAreas: ["Advanced Physics / Mathematics", "Computer Science / Biology", "Standardized Entrance Prep", "Portfolio Building"],
        },
        {
          stage: "Undergraduate (Years 1-4)",
          title: "Degree Program & Professional Internships",
          description: "Pursue Bachelor degree in relevant discipline (e.g., B.Tech, B.S., B.Des, MBBS) combined with industry internships.",
          focusAreas: ["Core Academic Curriculum", "Hands-on Lab Research", "Industry Summer Internships", "Open Source / Case Competitions"],
        },
        {
          stage: "Professional Specialization",
          title: "Career Entry & Continuous Mastery",
          description: "Transition into entry-level specialist roles, pursue certifications or Master/Ph.D. specialization as career expands.",
          focusAreas: ["Domain Certifications", "Cross-functional Collaboration", "Advanced Specialization", "Mentorship"],
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
        futureOpportunities: `High long-term demand projected over the next decade. Global digitalization and technical innovation continue to expand career horizons with strong compensation growth.`,
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

  private buildDevelopmentPlan(): ReportDevelopmentPlanData {
    return {
      summary: "This developmental plan outlines strategic focus areas to elevate your foundational cognitive abilities, practical skills, and future readiness over the next 12 to 24 months.",
      skillsToStrengthen: [
        {
          skillName: "Algorithmic & Computational Logic",
          currentLevel: "Emerging / Intermediate",
          howToImprove: [
            "Practice structured problem-solving puzzles like logic grids, Sudoku, and elementary code exercises.",
            "Participate in science & informatics competitions or coding hackathons.",
            "Break down daily routines and math problems into algorithmic step-by-step pseudo-code.",
          ],
          suggestedActivities: [
            "Enroll in beginner Python / Scratch logic modules.",
            "Solve 2 analytical logic puzzles weekly.",
            "Build an interactive calculator or simulation project.",
          ],
        },
        {
          skillName: "Verbal & Technical Communication",
          currentLevel: "Proficient",
          howToImprove: [
            "Practice summarizing complex technical or scientific articles in 3 concise bullet points.",
            "Participate actively in school group debates and model presentations.",
            "Engage in peer-to-peer teaching of difficult subject topics.",
          ],
          suggestedActivities: [
            "Join Model United Nations (MUN) or debate club.",
            "Maintain a monthly learning blog or journal.",
            "Present a 5-minute science topic to family or classmates.",
          ],
        },
        {
          skillName: "Project Stewardship & Time Management",
          currentLevel: "Moderate",
          howToImprove: [
            "Adopt the Pomodoro technique for focused 25-minute study intervals.",
            "Use Kanban-style task tracking (e.g., Trello or physical sticky notes) for homework and projects.",
            "Set explicit micro-milestones for long-term school assignments.",
          ],
          suggestedActivities: [
            "Plan school project milestones 2 weeks before deadlines.",
            "Conduct weekly 15-minute self-reviews on study habits.",
            "Coordinate a small-scale community or school club event.",
          ],
        },
      ],
    };
  }

  private buildParentGuidance(): ReportParentGuidanceData {
    return {
      nurturingMindset:
        "Every child's career trajectory is an evolving journey of exploration rather than a predetermined destination. Fostering a growth mindset, intellectual curiosity, and psychological safety allows students to discover their authentic passions without anxiety.",
      howParentsCanSupport: [
        "Encourage exploratory curiosity: Provide opportunities for your child to experiment with diverse hobbies, robotics kits, writing, and sciences without demanding immediate mastery.",
        "Celebrate effort over innate talent: Praise disciplined practice, resilience after mistakes, and systematic inquiry rather than raw scores.",
        "Facilitate real-world exposure: Arrange informal conversations with professionals in fields of your child's interest (e.g. engineers, healthcare workers, designers).",
        "Maintain open dialogue: Regularly ask open-ended questions about what topics energize them in school, rather than focusing solely on grades.",
      ],
      recommendedDiscussions: [
        "“What project or subject this term made you lose track of time because you enjoyed it so much?”",
        "“If you could solve one big real-world problem in our city or the world, what would it be?”",
        "“Which of the career pathways in this report surprised or excited you the most, and why?”",
        "“What kind of support or tools would help you explore your favorite interests more deeply this year?”",
      ],
      thingsToAvoid: [
        "Avoid early rigidity: Do not force a single narrow career choice too early; academic and career landscapes evolve rapidly.",
        "Avoid peer comparisons: Every student's cognitive timeline and talent cluster develop uniquely.",
        "Avoid imposing unfulfilled personal dreams: Allow your child to build an authentic life purpose aligned with their psychometric nature.",
        "Avoid treating assessment scores as permanent limits: Psychometric assessments capture current readiness and serve as exploration springboards, not permanent ceilings.",
      ],
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
      // Overlay actual scores if available
      const liveDimensions = [
        ...resultData.interestDiscovery.dimensions,
        ...(resultData.demonstratedAptitude?.dimensions || []),
      ];
      liveDimensions.forEach((dim) => {
        const existing = rawScores.find((r) => r.code.toUpperCase() === dim.code.toUpperCase());
        if (existing) {
          existing.score = dim.scalePositionPercentage;
          existing.band = dim.level || (dim.scalePositionPercentage >= 80 ? "High" : dim.scalePositionPercentage >= 60 ? "Proficient" : "Moderate");
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
