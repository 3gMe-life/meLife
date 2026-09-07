import { reportPdfGenerator } from "./src/modules/reports/generators/report-pdf.generator";
import { SkillFinderReportDTO } from "./src/modules/reports/report.types";

const languages = ["en", "ml", "hi", "ar", "ta", "kn"];

async function verifyAllLanguages() {
  for (const lang of languages) {
    const mockReport: SkillFinderReportDTO = {
      reportId: `test-${lang}-12345678`,
      resultId: "05327213-ea6d-4fe4-a952-9cb53e266452",
      participantId: "498bf7cb-21fa-47e9-a37f-583833271c0e",
      language: lang,
      studentProfile: {
        studentName: "Harshad M T",
        age: 15,
        educationStage: "Grade 10",
        schoolName: "Delhi Public School",
        completedAt: new Date().toISOString(),
        versionName: "Skill Finder — Student Standard Edition",
      },
      executiveSummary: {
        archetypeTitle: "Practical Explorer",
        tagline: "Bridging analytical insight with tangible hands-on problem solving.",
        strengthSummary:
          "Demonstrates high natural curiosity in systemic problem solving, algorithmic diagnostics, and structural logic. Excels in understanding how moving parts interact in practical contexts.",
        reliabilityNote: "High Consistency (98%)",
        explorationFraming:
          "Well-suited for applied computational engineering, experimental sciences, robotics systems, and hands-on technological problem solving.",
        primaryTraits: ["Logical Reasoning", "System Diagnostics", "Applied Science"],
      },
      interestProfile: {
        summary: "Maps intrinsic occupational curiosity across 6 Holland RIASEC interest domains.",
        topClusters: [
          { code: "R", name: "Realistic", percentage: 88, clusterTitle: "Mechanical & Physical Systems" },
          { code: "I", name: "Investigative", percentage: 82, clusterTitle: "Scientific & Analytical Research" },
          { code: "C", name: "Conventional", percentage: 74, clusterTitle: "Structured Data & Organization" },
        ],
        dimensions: [
          { code: "R", name: "Realistic", rawScore: 22, maxScore: 25, scalePositionPercentage: 88, level: "High" },
          { code: "I", name: "Investigative", rawScore: 20, maxScore: 25, scalePositionPercentage: 80, level: "High" },
          { code: "A", name: "Artistic", rawScore: 14, maxScore: 25, scalePositionPercentage: 56, level: "Moderate" },
          { code: "S", name: "Social", rawScore: 12, maxScore: 25, scalePositionPercentage: 48, level: "Moderate" },
          { code: "E", name: "Enterprising", rawScore: 16, maxScore: 25, scalePositionPercentage: 64, level: "Moderate" },
          { code: "C", name: "Conventional", rawScore: 18, maxScore: 25, scalePositionPercentage: 72, level: "High" },
        ],
      },
      skillBehaviour: {
        summary: "Evaluates instinctive problem-solving and collaboration habits.",
        strongestIndicators: [
          { code: "CRIT_THINK", name: "Critical Thinking", level: "Advanced", description: "Evaluates multi-variable scenarios objectively." },
          { code: "RESILIENCE", name: "Grit & Persistence", level: "Proficient", description: "Remains composed when tackling difficult puzzles." },
          { code: "EXEC_FOCUS", name: "Execution Focus", level: "Proficient", description: "Maintains high attention to detail in structured tasks." },
        ],
        developmentOpportunities: [
          { code: "COMM_EXP", name: "Expressive Communication", level: "Developing", description: "Practice verbalizing analytical problem-solving steps to peers." },
          { code: "COLLAB_LEAD", name: "Collaborative Leadership", level: "Developing", description: "Seek opportunities to coordinate group projects." },
        ],
        dimensions: [],
      },
      aptitudeInsights: {
        overallAccuracyPercentage: 84,
        summary: "Reflects performance across spatial, deductive, and quantitative problem-solving challenges.",
        dimensions: [
          { code: "PATTERN_REC", name: "Pattern Recognition", scalePositionPercentage: 90, rawScore: 9, maxScore: 10, level: "Advanced" },
          { code: "DEDUCTIVE_LOG", name: "Deductive Logic", scalePositionPercentage: 85, rawScore: 8, maxScore: 10, level: "Advanced" },
          { code: "SPATIAL_VIZ", name: "Spatial Visualization", scalePositionPercentage: 80, rawScore: 8, maxScore: 10, level: "Proficient" },
          { code: "QUANT_REASON", name: "Quantitative Reasoning", scalePositionPercentage: 80, rawScore: 8, maxScore: 10, level: "Proficient" },
          { code: "SPEED_ACC", name: "Speed & Processing", scalePositionPercentage: 75, rawScore: 7, maxScore: 10, level: "Proficient" },
          { code: "MEMORY_RECALL", name: "Working Memory", scalePositionPercentage: 70, rawScore: 7, maxScore: 10, level: "Proficient" },
        ],
      },
      developmentalStrengths: {
        learningHabitsSummary: "Identifies baseline study routines and behavioral patterns.",
        topStrengths: [],
        growthSuggestions: [
          "Dedicate focused blocks for hands-on prototyping and scientific experimentation.",
          "Incorporate structured time-boxing during exam prep to optimize processing speed.",
          "Participate in science clubs, hackathons, and collaborative problem-solving forums.",
        ],
      },
      explorationAreas: {
        framingDisclaimer: "These pathways are exploratory directions to inspire curiosity, not fixed career tracks.",
        clusters: [
          {
            clusterTitle: "Robotics, Automation & Embedded Systems",
            description: "Focuses on designing and deploying electromechanical systems and automated hardware.",
            sampleFocusAreas: ["Mechatronics", "Sensor Systems", "Applied AI", "Microcontrollers"],
            suggestedProjectsAndActivities: ["Build Arduino sensor circuits", "Participate in First Robotics League"],
          },
          {
            clusterTitle: "Computational Science & System Architecture",
            description: "Explores structural software engineering, database design, and algorithmic problem solving.",
            sampleFocusAreas: ["Algorithms", "Cloud Computing", "Cybersecurity", "Data Analytics"],
            suggestedProjectsAndActivities: ["Contribute to open-source software", "Compete in algorithmic coding challenges"],
          },
        ],
      },
      parentGuidance: {
        nurturingMindsetSummary: "Encourage natural curiosity through positive reinforcement, exploratory freedom, and supportive discussions.",
        dos: [
          "Provide access to DIY electronics kits, coding tools, and science laboratories.",
          "Praise iterative problem-solving effort rather than just final grades.",
          "Encourage participation in inter-school science fairs and STEM competitions.",
        ],
        donts: [
          "Do not pigeonhole the student into a single career path prematurely.",
          "Avoid comparing current developmental habits with siblings or peers.",
          "Do not discourage experimental failure; treat mistakes as constructive learning data.",
        ],
        recommendedDiscussions: [
          "What was the most exciting puzzle or challenge you solved this week?",
          "How do you think your favorite gadget or app works under the hood?",
        ],
      },
    };

    const pdfBuffer = await reportPdfGenerator.generatePdf(mockReport);
    const str = pdfBuffer.toString("latin1");
    const countMatches = str.match(/\/Count\s+(\d+)/g);
    console.log(`Language [${lang.toUpperCase()}]: Count = ${countMatches}`);
  }
}

verifyAllLanguages();
