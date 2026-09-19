import puppeteer from "puppeteer-core";
import path from "path";
import { reportPdfGenerator } from "./src/modules/reports/generators/report-pdf.generator";
import { SkillFinderReportDTO } from "./src/modules/reports/report.types";

const ARTIFACT_DIR = "/Users/harshadmt/.gemini/antigravity-ide/brain/f5627755-4edf-479d-8c1f-8f351c0269f6";
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const mockReport: SkillFinderReportDTO = {
  reportId: "sf-rep-88349201",
  resultId: "res-05327213-ea6d",
  attemptId: "att-mock-99821",
  participantId: "usr-498bf7cb-21fa",
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
    completedAt: new Date("2026-09-19T09:00:00Z").toISOString(),
    reportId: "sf-rep-88349201",
    generatedAt: new Date().toISOString(),
  },
  executiveSummary: {
    archetypeTitle: "Creative Maker & Designer",
    tagline: "Transforming imaginative concepts into tangible structures.",
    strengthSummary:
      "You combine visual and structural creativity with practical craftsmanship, enjoying both the aesthetic design and the physical construction of projects. You demonstrate strong natural curiosity in spatial relationships and multi-angle problem solving.",
    reliabilityNote: "High Confidence (98% Parallel Consistency)",
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

async function runVisualValidation() {
  console.log("1. Generating PDF Buffer from reportPdfGenerator...");
  const pdfBuffer = await reportPdfGenerator.generatePdf(mockReport);
  const pdfBase64 = pdfBuffer.toString("base64");

  console.log("2. Launching Chrome with puppeteer-core...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });

  // Load PDF.js HTML renderer
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <title>PDF Visual Validation</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <style>
      body { margin: 0; background: #2f3542; display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 20px; }
      .page-container { background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
      canvas { display: block; }
    </style>
  </head>
  <body>
    <div id="viewer"></div>
    <script>
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const rawPdfData = atob("${pdfBase64}");
      const uint8Array = new Uint8Array(rawPdfData.length);
      for (let i = 0; i < rawPdfData.length; i++) {
        uint8Array[i] = rawPdfData.charCodeAt(i);
      }

      async function renderAllPages() {
        try {
          const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
          const viewer = document.getElementById('viewer');
          window.totalPdfPages = pdf.numPages;

          for (let num = 1; num <= pdf.numPages; num++) {
            const page = await pdf.getPage(num);
            const viewport = page.getViewport({ scale: 2.0 });
            
            const container = document.createElement('div');
            container.className = 'page-container';
            container.id = 'page-container-' + num;
            
            const canvas = document.createElement('canvas');
            canvas.id = 'canvas-page-' + num;
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            const ctx = canvas.getContext('2d');
            container.appendChild(canvas);
            viewer.appendChild(container);

            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
          }
          window.renderFinished = true;
        } catch (e) {
          console.error("PDF render error:", e);
          window.renderFinished = true;
        }
      }
      renderAllPages();
    </script>
  </body>
  </html>
  `;

  await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
  await page.waitForFunction("window.renderFinished === true", { timeout: 30000 });

  const numPages: number = await page.evaluate(() => (globalThis as any).totalPdfPages || 3);
  console.log(`PDF rendered in browser. Total Pages: ${numPages}`);

  for (let i = 1; i <= numPages; i++) {
    const el = await page.$(`#page-container-${i}`);
    if (el) {
      const outImgPath = path.join(ARTIFACT_DIR, `skill_finder_pdf_page_${i}.png`);
      await el.screenshot({ path: outImgPath });
      console.log(`📸 Saved Page ${i} screenshot: ${outImgPath}`);
    }
  }

  await browser.close();
  console.log("✅ Visual validation screenshots created!");
}

runVisualValidation().catch((err) => {
  console.error("Visual validation failed:", err);
  process.exit(1);
});
