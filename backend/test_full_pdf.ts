import { reportPdfGenerator } from "./src/modules/reports/generators/report-pdf.generator";
import { SkillFinderReportDTO } from "./src/modules/reports/report.types";
import fs from "fs";

const mockReport: SkillFinderReportDTO = {
  reportId: "abfecb32-c937-4750-ad1a-9d071b581574",
  resultId: "05327213-ea6d-4fe4-a952-9cb53e266452",
  attemptId: "att-mock-12345",
  participantId: "498bf7cb-21fa-47e9-a37f-583833271c0e",
  assessmentCode: "SKILL_FINDER",
  language: "en",
  templateVersion: "v1.0",
  generatedAt: new Date().toISOString(),
  studentProfile: {
    studentName: "Aarav Sharma",
    firstName: "Aarav",
    lastName: "Sharma",
    email: "aarav@melife.org",
    age: 15,
    dateOfBirth: "2011-05-15",
    educationStage: "Grade 10",
    gradeLevel: "10",
    schoolName: "St. Xavier's International Academy",
    curriculumOrBoard: "CBSE",
    assessmentName: "Skill Finder — Student Edition",
    assessmentCode: "SKILL_FINDER",
    versionName: "Skill Finder — Student Standard Edition",
    versionCode: "STUDENT_STANDARD",
    completedAt: new Date().toISOString(),
    reportId: "abfecb32-c937-4750-ad1a-9d071b581574",
    generatedAt: new Date().toISOString(),
  },
  executiveSummary: {
    archetypeTitle: "Creative Maker & Designer",
    tagline: "Transforming imaginative concepts into tangible structures.",
    strengthSummary:
      "You combine visual and structural creativity with practical craftsmanship, enjoying both the aesthetic design and the physical construction of projects.",
    reliabilityNote: "High Consistency (Psychometrically Validated)",
    explorationFraming:
      "Your current profile shows stronger alignment with industrial design, architecture, game environments, and interactive product making.",
    primaryTraits: ["Spatial Design", "Material Craftsmanship", "Visual Realization"],
  },
  interestProfile: {
    summary: "Maps intrinsic occupational curiosity across 6 Holland RIASEC interest domains.",
    primaryOrientation: "Builder (Realistic)",
    secondaryOrientation: "Creator (Artistic)",
    topClusters: [
      { code: "R", name: "Builder (R)", percentage: 100, clusterTitle: "Engineering & Applied Technology", description: "Hands-on engineering" },
      { code: "A", name: "Creator (A)", percentage: 100, clusterTitle: "Creative Arts & Innovative Design", description: "Creative design" },
      { code: "I", name: "Explorer (I)", percentage: 92, clusterTitle: "Scientific Inquiry & Research", description: "Scientific research" },
    ],
    dimensions: [
      { code: "BUILDER_R", name: "Builder (R)", rawScore: 24, maxScore: 24, scalePositionPercentage: 100, level: "High" },
      { code: "EXPLORER_I", name: "Explorer (I)", rawScore: 22, maxScore: 24, scalePositionPercentage: 92, level: "High" },
      { code: "CREATOR_A", name: "Creator (A)", rawScore: 24, maxScore: 24, scalePositionPercentage: 100, level: "High" },
      { code: "HELPER_S", name: "Helper (S)", rawScore: 20, maxScore: 24, scalePositionPercentage: 83, level: "High" },
      { code: "LEADER_E", name: "Leader (E)", rawScore: 12, maxScore: 24, scalePositionPercentage: 50, level: "Proficient" },
      { code: "ORGANISER_C", name: "Organiser (C)", rawScore: 22, maxScore: 24, scalePositionPercentage: 92, level: "High" },
    ],
  },
  skillBehaviour: {
    summary: "Evaluates instinctive problem-solving and collaboration habits.",
    strongestIndicators: [
      { code: "COMM_EXP", name: "Communication & Expressive Articulation", rawScore: 24, maxScore: 24, scalePositionPercentage: 100, level: "High", description: "Articulates complex reasoning clearly through verbal, written, and graphical expressions." },
      { code: "CREATIVE_THINK", name: "Creative & Divergent Thinking", rawScore: 24, maxScore: 24, scalePositionPercentage: 100, level: "High", description: "Generates multiple unique pathways and unconventional angles to overcome complex obstacles." },
      { code: "VISUAL_SPATIAL", name: "Visual-Spatial Thinking", rawScore: 24, maxScore: 24, scalePositionPercentage: 100, level: "High", description: "Mentally visualizing layouts, objects, maps and spatial relationships." },
    ],
    developmentOpportunities: [
      { code: "SELF_MGMT", name: "Self-Management & Focus", rawScore: 14, maxScore: 24, scalePositionPercentage: 58, level: "Proficient", description: "Structuring focused study blocks and managing multiple project deadlines." },
      { code: "LEAD_INIT", name: "Leadership & Initiative", rawScore: 12, maxScore: 24, scalePositionPercentage: 50, level: "Proficient", description: "Stepping up to coordinate group direction and project milestones." },
    ],
    dimensions: [],
  },
  aptitudeInsights: {
    overallAccuracyPercentage: 92,
    summary: "Reflects performance across spatial, deductive, and quantitative problem-solving challenges.",
    cognitiveStrengthsText: "Demonstrates high spatial reasoning and logical deduction.",
    dimensions: [
      { code: "PATTERN_REC", name: "Pattern Recognition", scalePositionPercentage: 95, rawScore: 10, maxScore: 10, level: "High" },
      { code: "DEDUCTIVE_LOG", name: "Deductive Logic", scalePositionPercentage: 90, rawScore: 9, maxScore: 10, level: "High" },
      { code: "SPATIAL_VIZ", name: "Spatial Visualization", scalePositionPercentage: 100, rawScore: 10, maxScore: 10, level: "High" },
      { code: "QUANT_REASON", name: "Quantitative Reasoning", scalePositionPercentage: 85, rawScore: 8, maxScore: 10, level: "High" },
      { code: "SPEED_ACC", name: "Speed & Processing", scalePositionPercentage: 85, rawScore: 8, maxScore: 10, level: "High" },
      { code: "MEMORY_RECALL", name: "Working Memory", scalePositionPercentage: 80, rawScore: 8, maxScore: 10, level: "High" },
    ],
  },
  developmentalStrengths: {
    learningHabitsSummary: "Identifies baseline study routines and behavioral patterns.",
    topStrengths: [],
    dimensions: [],
    growthSuggestions: [
      "Engage in open-ended robotics or architecture design challenges where multiple physical solutions exist.",
      "Practice breaking down large weekly project milestones with time-boxed sprints.",
      "Collaborate in cross-functional design and technology competitions.",
    ],
  },
  explorationAreas: {
    framingDisclaimer: "These pathways are exploratory directions to inspire curiosity, not fixed career tracks.",
    clusters: [
      {
        domain: "Design & Technology",
        clusterTitle: "Robotics, Automation & Embedded Systems",
        description: "Focuses on designing and deploying electromechanical systems and automated hardware.",
        sampleFocusAreas: ["Mechatronics", "Sensor Systems", "Applied AI", "Microcontrollers"],
        suggestedProjectsAndActivities: ["Build Arduino sensor circuits", "Participate in First Robotics League"],
      },
      {
        domain: "Computing & Architecture",
        clusterTitle: "Computational Science & Spatial Architecture",
        description: "Explores structural digital modeling, interactive media, and algorithmic problem solving.",
        sampleFocusAreas: ["Algorithms", "3D Architecture", "Spatial UI/UX", "Data Analytics"],
        suggestedProjectsAndActivities: ["Contribute to open-source software", "Design 3D building models in CAD"],
      },
    ],
  },
  parentGuidance: {
    nurturingMindsetSummary: "Encourage natural curiosity through positive reinforcement, exploratory freedom, and supportive discussions.",
    supportiveActions: [
      "Provide access to DIY electronics kits, coding tools, and science laboratories.",
      "Praise iterative problem-solving effort rather than just final grades.",
    ],
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

async function run() {
  const pdfBuffer = await reportPdfGenerator.generatePdf(mockReport);
  const outPath = "./scratch_test_skill_finder_report.pdf";
  fs.writeFileSync(outPath, pdfBuffer);
  
  console.log("✅ PDF generated successfully! Bytes:", pdfBuffer.length);
  console.log("Saved to:", outPath);
}

run().catch((err) => {
  console.error("PDF generation failed:", err);
  process.exit(1);
});
