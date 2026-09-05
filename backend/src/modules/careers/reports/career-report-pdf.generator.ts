import PDFDocument from "pdfkit";
import { CareerReportDTO } from "./career-report.types";

export class CareerReportPdfGenerator {
  /**
   * Generates a high-fidelity vector PDF document buffer from a CareerReportDTO.
   * Features a modern 10-page visual storytelling flow (+ optional Page 11 for certified counsellors).
   */
  async generatePdf(report: CareerReportDTO, includeCounsellorInsights = false): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: "A4",
          margin: 40,
          bufferPages: true,
          info: {
            Title: `${report.cover.studentName} - 3G MeLife Career Exploration Report`,
            Author: "3G MeLife AI Assisted Career Guidance Platform",
            Subject: "Comprehensive Psychometric Career Exploration & Psychological Guidance Report",
            Keywords: "Career Guidance, Psychometrics, RIASEC, Skills, Education Pathway, 3G MeLife",
          },
        });

        const buffers: Buffer[] = [];
        doc.on("data", (chunk: Buffer) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", (err: Error) => reject(err));

        // Colors
        const colors = {
          primaryTeal: "#008F83",
          tealDark: "#0D5E56",
          darkNavy: "#111827",
          charcoal: "#1F2937",
          slateGray: "#4B5563",
          mutedGray: "#6B7280",
          lightBorder: "#E5E7EB",
          cardBorder: "#D1D5DB",
          lightBg: "#F9FAFB",
          subtleTealBg: "#E6F7F5",
          tealPillBg: "#CCFBF1",
          emeraldGreen: "#059669",
          emeraldBg: "#ECFDF5",
          amberWarning: "#D97706",
          amberBg: "#FEF3C7",
          roseRed: "#E11D48",
          roseBg: "#FFE4E6",
          purple: "#7C3AED",
          purpleBg: "#F5F3FF",
          white: "#FFFFFF",
        };

        // ========================================================
        // PAGE 1: COVER PAGE
        // ========================================================
        this.renderCoverPage(doc, report, colors);

        // ========================================================
        // PAGE 2: STUDENT PROFILE CARD & EXPLORATION BASELINE
        // ========================================================
        doc.addPage();
        this.renderStudentProfileDashboard(doc, report, colors);

        // ========================================================
        // PAGE 3: EXECUTIVE SUMMARY & LEARNING ORIENTATION
        // ========================================================
        doc.addPage();
        this.renderExecutiveSummaryCards(doc, report, colors);

        // ========================================================
        // PAGE 4: RIASEC PSYCHOMETRIC INTEREST PROFILE
        // ========================================================
        doc.addPage();
        this.renderInterestProfileVisuals(doc, report, colors);

        // ========================================================
        // PAGE 5: COGNITIVE & DEVELOPMENTAL STRENGTHS
        // ========================================================
        doc.addPage();
        this.renderCognitiveStrengths(doc, report, colors);

        // ========================================================
        // PAGE 6: TOP CAREER MATCHES
        // ========================================================
        doc.addPage();
        this.renderTopCareerMatches(doc, report, colors);

        // ========================================================
        // PAGE 7: IN-DEPTH CAREER EXPLORATION & ROADMAP
        // ========================================================
        doc.addPage();
        this.renderCareerDeepDiveRoadmaps(doc, report, colors);

        // ========================================================
        // PAGE 8: ACTIONABLE SKILL DEVELOPMENT PLAN
        // ========================================================
        doc.addPage();
        this.renderSkillDevelopmentPlan(doc, report, colors);

        // ========================================================
        // PAGE 9: PARENT & GUARDIAN GUIDANCE FRAMEWORK
        // ========================================================
        doc.addPage();
        this.renderParentGuidance(doc, report, colors);

        // ========================================================
        // PAGE 10: FINAL SUMMARY & COUNSELLOR CONNECT
        // ========================================================
        doc.addPage();
        this.renderClosingInspirationPage(doc, report, colors);

        // ========================================================
        // PAGE 11: CERTIFIED COUNSELLOR DIAGNOSTIC INSIGHTS (PROTECTED)
        // ========================================================
        if (includeCounsellorInsights && report.counsellorInsights) {
          doc.addPage();
          this.renderCounsellorInsights(doc, report, colors);
        }

        // ========================================================
        // GLOBAL HEADERS & FOOTERS ACROSS ALL PAGES
        // ========================================================
        this.renderGlobalFootersAndHeaders(doc, report, colors);

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  // --------------------------------------------------------------------------
  // PAGE 1: COVER PAGE
  // --------------------------------------------------------------------------
  private renderCoverPage(doc: PDFKit.PDFDocument, report: CareerReportDTO, _colors: any) {
    // Elegant Dark/Teal Gradient Background Block
    doc.rect(0, 0, 595.28, 841.89).fill("#0B1B19");

    // Decorative Vector Circles & Planetary Exploration Orbits
    doc.save();
    doc.lineWidth(1.2);
    doc.strokeColor("#008F83").circle(480, 160, 220).dash(4, { space: 4 }).stroke();
    doc.lineWidth(0.8);
    doc.strokeColor("#00C896").circle(480, 160, 150).dash(2, { space: 3 }).stroke();
    doc.strokeColor("#008F83").circle(480, 160, 80).undash().stroke();

    // Radiant nodes
    doc.circle(360, 240, 4).fill("#00C896");
    doc.circle(440, 300, 3).fill("#38BDF8");
    doc.circle(520, 100, 5).fill("#FBBF24");
    doc.restore();

    // Top Brand Pill
    doc.roundedRect(40, 48, 145, 26, 13).fill("#008F83");
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#FFFFFF").text("3G MeLife", 54, 56);
    doc.font("Helvetica").fontSize(7.5).fillColor("#CCFBF1").text("PSYCHOMETRICS", 112, 57);

    // Official Exploration Benchmark Stamp
    doc.roundedRect(410, 48, 145, 26, 13).fillAndStroke("#132A27", "#008F83");
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#00C896").text("OFFICIAL REPORT", 422, 57, { align: "center", width: 120 });

    // Center Hero Title Area
    doc.font("Helvetica-Bold").fontSize(28).fillColor("#FFFFFF").text("Career Exploration", 40, 210);
    doc.font("Helvetica-Bold").fontSize(28).fillColor("#00C896").text("Report", 40, 244);

    doc.font("Helvetica").fontSize(12).fillColor("#94A3B8").text(
      "Discovering Your Strengths, Interests & Future Possibilities",
      40,
      285,
      { width: 440, lineGap: 3 }
    );

    // Horizontal Accent Line
    doc.rect(40, 325, 60, 4).fill("#00C896");

    // Student Identification Card (Glassmorphism style on dark)
    const cardY = 360;
    doc.roundedRect(40, cardY, 515, 230, 12).fillAndStroke("#132A27", "#1E3E3A");

    // Student Name & Archetype Banner
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#00C896").text("PREPARED FOR", 64, cardY + 24);
    doc.font("Helvetica-Bold").fontSize(22).fillColor("#FFFFFF").text(report.cover.studentName, 64, cardY + 38);

    doc.font("Helvetica-Bold").fontSize(9).fillColor("#94A3B8").text("PROFILE ARCHETYPE", 64, cardY + 76);
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#38BDF8").text(report.cover.profileArchetype, 64, cardY + 90);

    // Archetype Tagline
    doc.font("Helvetica-Oblique").fontSize(9.5).fillColor("#CBD5E1").text(
      `“${report.cover.archetypeTagline}”`,
      64,
      cardY + 114,
      { width: 460 }
    );

    // 3 Credential Badges inside Card
    const badgeY = cardY + 150;

    // Badge 1: Grade / Stage
    doc.roundedRect(64, badgeY, 140, 52, 6).fill("#0B1B19");
    doc.font("Helvetica").fontSize(7.5).fillColor("#94A3B8").text("ACADEMIC STAGE", 74, badgeY + 10);
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#FFFFFF").text(
      `${report.cover.gradeLevel || "High School"}`,
      74,
      badgeY + 24,
      { width: 120 }
    );

    // Badge 2: Institution
    doc.roundedRect(218, badgeY, 160, 52, 6).fill("#0B1B19");
    doc.font("Helvetica").fontSize(7.5).fillColor("#94A3B8").text("INSTITUTION", 228, badgeY + 10);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#FFFFFF").text(
      report.cover.schoolName || "Academic Institution",
      228,
      badgeY + 24,
      { width: 140 }
    );

    // Badge 3: Assessment Date
    doc.roundedRect(392, badgeY, 135, 52, 6).fill("#0B1B19");
    doc.font("Helvetica").fontSize(7.5).fillColor("#94A3B8").text("EVALUATION DATE", 402, badgeY + 10);
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#FFFFFF").text(
      report.cover.assessmentDate,
      402,
      badgeY + 24,
      { width: 115 }
    );

    // Philosophy Footer Quote
    const quoteY = 640;
    doc.roundedRect(40, quoteY, 515, 60, 8).fill("#0D2220");
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#00C896").text("3G MeLife Guidance Philosophy", 56, quoteY + 14);
    doc.font("Helvetica").fontSize(8).fillColor("#CBD5E1").text(
      "Career discovery is an ongoing journey of exploration, continuous learning, and unlocking multidimensional potential—never a rigid limitation.",
      56,
      quoteY + 28,
      { width: 480, lineGap: 2 }
    );

    // Report Reference & Security at Bottom
    doc.font("Helvetica").fontSize(7.5).fillColor("#64748B").text(
      `Report Reference ID: ${report.reportId || "MELIFE-2026"} • Multi-Language Support Enabled`,
      40,
      760,
      { align: "center", width: 515 }
    );
  }

  // --------------------------------------------------------------------------
  // PAGE 2: STUDENT PROFILE CARD & EXPLORATION BASELINE
  // --------------------------------------------------------------------------
  private renderStudentProfileDashboard(doc: PDFKit.PDFDocument, report: CareerReportDTO, colors: any) {
    this.renderSectionHeader(doc, "1. Student Profile & Exploration Baseline", "Comprehensive student profile metrics and archetype overview", colors);

    // Student Hero Profile Dashboard Card
    const cardY = 100;
    doc.roundedRect(40, cardY, 515, 130, 8).fillAndStroke(colors.lightBg, colors.cardBorder);

    // Left Column: Student Details
    doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.mutedGray).text("STUDENT CANDIDATE", 56, cardY + 16);
    doc.font("Helvetica-Bold").fontSize(15).fillColor(colors.darkNavy).text(report.cover.studentName, 56, cardY + 28);

    doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.mutedGray).text("Grade / Academic Level:", 56, cardY + 54);
    doc.font("Helvetica").fontSize(9).fillColor(colors.charcoal).text(`${report.cover.gradeLevel || "Grade 10"} • ${report.cover.educationStage}`, 170, cardY + 54);

    doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.mutedGray).text("School / Institution:", 56, cardY + 72);
    doc.font("Helvetica").fontSize(9).fillColor(colors.charcoal).text(report.cover.schoolName || "Academic Institution", 170, cardY + 72, { width: 140 });

    doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.mutedGray).text("Assessment Date:", 56, cardY + 90);
    doc.font("Helvetica").fontSize(9).fillColor(colors.charcoal).text(report.cover.assessmentDate, 170, cardY + 90);

    // Right Column: Profile Archetype Hero
    doc.roundedRect(325, cardY + 12, 218, 106, 6).fillAndStroke(colors.subtleTealBg, "#CCEFEA");

    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.primaryTeal).text("PROFILE ARCHETYPE", 337, cardY + 22);
    doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.darkNavy).text(report.cover.profileArchetype, 337, cardY + 34, { width: 195 });

    doc.font("Helvetica-Oblique").fontSize(8).fillColor(colors.tealDark).text(
      `“${report.cover.archetypeTagline}”`,
      337,
      cardY + 66,
      { width: 195, lineGap: 1 }
    );

    if (report.cover.age) {
      doc.font("Helvetica").fontSize(7.5).fillColor(colors.slateGray).text(`Age: ${report.cover.age} Years`, 337, cardY + 98);
    }

    // Explanation Card: "What this archetype means"
    const expY = 246;
    doc.roundedRect(40, expY, 515, 115, 8).fillAndStroke("#F0FDF4", "#BBF7D0");

    doc.font("Helvetica-Bold").fontSize(10).fillColor("#166534").text("What This Profile Archetype Means", 56, expY + 14);
    doc.font("Helvetica").fontSize(8.5).fillColor("#14532D").text(
      `Students with the "${report.cover.profileArchetype}" archetype blend analytical reasoning with practical problem-solving. They thrive when exposed to multi-disciplinary challenges that require systematic inquiry, logical structuring, and real-world application.\n\nThis psychometric orientation indicates natural curiosity toward investigative disciplines, engineering principles, and technology-driven design.`,
      56,
      expY + 32,
      { width: 480, lineGap: 3 }
    );

    // 3 Exploration Baseline Pillars
    const pilY = 380;
    doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.darkNavy).text("Exploration Readiness Pillars", 40, pilY);

    const pillars = [
      {
        title: "Cognitive Agility",
        desc: "High capacity for structured analysis, abstract problem solving, and deductive reasoning across diverse scenarios.",
        tag: "Analytical",
        color: colors.primaryTeal,
        bg: colors.subtleTealBg,
      },
      {
        title: "Curiosity & Inquiry",
        desc: "Strong motivation to investigate underlying mechanisms, conduct experiments, and test innovative hypotheses.",
        tag: "Investigative",
        color: "#0284C7",
        bg: "#E0F2FE",
      },
      {
        title: "Practical Translation",
        desc: "Natural instinct to turn theoretical concepts into functional prototypes, actionable workflows, and tangible solutions.",
        tag: "Applied Creation",
        color: "#7C3AED",
        bg: "#F5F3FF",
      },
    ];

    const pWidth = 165;
    pillars.forEach((p, idx) => {
      const pX = 40 + idx * 175;
      const pY = pilY + 18;

      doc.roundedRect(pX, pY, pWidth, 140, 6).fillAndStroke(colors.white, colors.cardBorder);

      // Top Tag
      doc.roundedRect(pX + 10, pY + 10, 80, 16, 3).fill(p.bg);
      doc.font("Helvetica-Bold").fontSize(7).fillColor(p.color).text(p.tag, pX + 10, pY + 14, { align: "center", width: 80 });

      doc.font("Helvetica-Bold").fontSize(9.5).fillColor(colors.darkNavy).text(p.title, pX + 10, pY + 36, { width: pWidth - 20 });
      doc.font("Helvetica").fontSize(8).fillColor(colors.slateGray).text(p.desc, pX + 10, pY + 54, { width: pWidth - 20, lineGap: 2 });
    });

    // Bottom Guidance Philosophy Note
    const botY = 560;
    doc.roundedRect(40, botY, 515, 60, 6).fillAndStroke(colors.lightBg, colors.cardBorder);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.primaryTeal).text("Guidance Note on Archetype Dynamics", 54, botY + 12);
    doc.font("Helvetica").fontSize(7.5).fillColor(colors.slateGray).text(
      "Your archetype is a starting point for exploratory growth, not a fixed category. As you engage in new subjects, internships, and creative projects, your unique blend of talents will continue to evolve.",
      54,
      botY + 26,
      { width: 485, lineGap: 2 }
    );
  }

  // --------------------------------------------------------------------------
  // PAGE 3: EXECUTIVE SUMMARY & LEARNING ORIENTATION
  // --------------------------------------------------------------------------
  private renderExecutiveSummaryCards(doc: PDFKit.PDFDocument, report: CareerReportDTO, colors: any) {
    this.renderSectionHeader(doc, "2. Executive Summary & Learning Orientation", "Holistic synthesis of student cognitive tendencies and exploratory approach", colors);

    // Synthesis Narrative Hero Card
    const heroY = 100;
    doc.roundedRect(40, heroY, 515, 95, 8).fillAndStroke(colors.subtleTealBg, "#CCEFEA");

    doc.font("Helvetica-Bold").fontSize(9.5).fillColor(colors.primaryTeal).text("Holistic Cognitive Synthesis", 56, heroY + 14);
    doc.font("Helvetica").fontSize(8.5).fillColor(colors.charcoal).text(
      report.executiveSummary.summary,
      56,
      heroY + 30,
      { width: 480, lineGap: 3 }
    );

    // 4 Highlight Cards Grid (Analytical Thinking, Creative Problem Solving, Structured Communication, Adaptable Learning)
    const gridY = 210;
    doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.darkNavy).text("Core Psychological & Learning Pillars", 40, gridY);

    const cards = [
      {
        iconCode: "🧠",
        title: "Analytical Thinking & Key Strengths",
        subtitle: "Validated Cognitive Talents",
        content: report.executiveSummary.topStrengths.slice(0, 4).join("   •   "),
        color: colors.primaryTeal,
        bg: colors.white,
        borderColor: "#99F6E4",
      },
      {
        iconCode: "🎨",
        title: "Optimal Learning Style",
        subtitle: "How Student Learns Best",
        content: report.executiveSummary.learningStyle,
        color: "#0284C7",
        bg: colors.white,
        borderColor: "#BAE6FD",
      },
      {
        iconCode: "💬",
        title: "Interest Pattern Architecture",
        subtitle: "Resonance Across Domains",
        content: report.executiveSummary.interestPattern,
        color: "#D97706",
        bg: colors.white,
        borderColor: "#FDE68A",
      },
      {
        iconCode: "🌱",
        title: "Recommended Exploration Mindset",
        subtitle: "Growth & Horizon Broadening",
        content: report.executiveSummary.explorationMindset,
        color: "#059669",
        bg: colors.white,
        borderColor: "#A7F3D0",
      },
    ];

    const cardW = 250;
    const cardH = 115;

    cards.forEach((c, idx) => {
      const cX = idx % 2 === 0 ? 40 : 305;
      const cY = gridY + 18 + Math.floor(idx / 2) * (cardH + 14);

      doc.roundedRect(cX, cY, cardW, cardH, 6).fillAndStroke(c.bg, c.borderColor);

      // Icon & Title Header
      doc.font("Helvetica-Bold").fontSize(10).fillColor(c.color).text(c.title, cX + 14, cY + 14, { width: cardW - 28 });
      doc.font("Helvetica").fontSize(7.5).fillColor(colors.mutedGray).text(c.subtitle, cX + 14, cY + 28);

      // Content
      doc.font("Helvetica").fontSize(8).fillColor(colors.charcoal).text(c.content, cX + 14, cY + 44, { width: cardW - 28, lineGap: 2.5 });
    });

    // Summary Takeaway Card
    const botY = 485;
    doc.roundedRect(40, botY, 515, 80, 6).fillAndStroke(colors.lightBg, colors.cardBorder);
    doc.font("Helvetica-Bold").fontSize(9).fillColor(colors.darkNavy).text("Key Guidance Takeaway for Students & Parents", 54, botY + 12);
    doc.font("Helvetica").fontSize(8).fillColor(colors.slateGray).text(
      "The student demonstrates a balanced aptitude profile with notable readiness in scientific logic and experiential investigation. Optimal educational progression will combine rigorous academic streams with practical extracurricular projects and model-building.",
      54,
      botY + 28,
      { width: 485, lineGap: 2.5 }
    );
  }

  // --------------------------------------------------------------------------
  // PAGE 4: RIASEC PSYCHOMETRIC INTEREST PROFILE
  // --------------------------------------------------------------------------
  private renderInterestProfileVisuals(doc: PDFKit.PDFDocument, report: CareerReportDTO, colors: any) {
    this.renderSectionHeader(doc, "3. Psychometric Interest Architecture (RIASEC)", "Multidimensional interest scores across 6 core occupational domains", colors);

    // Dominant Orientations Banner
    const bannerY = 100;
    doc.roundedRect(40, bannerY, 515, 75, 8).fillAndStroke(colors.subtleTealBg, "#CCEFEA");

    doc.font("Helvetica-Bold").fontSize(9).fillColor(colors.primaryTeal).text("DOMINANT CAREER ORIENTATIONS", 56, bannerY + 12);
    doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.darkNavy).text(
      `Primary: ${report.psychometricProfile.primaryOrientation}   |   Secondary: ${report.psychometricProfile.secondaryOrientation}`,
      56,
      bannerY + 26
    );

    doc.font("Helvetica").fontSize(7.5).fillColor(colors.slateGray).text(
      report.psychometricProfile.summary,
      56,
      bannerY + 42,
      { width: 480, lineGap: 2 }
    );

    // 6 RIASEC Dimensions with Horizontal Progress Bars & Descriptions
    const gridY = 190;
    doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.darkNavy).text("6 RIASEC Occupational Interest Clusters", 40, gridY);

    const clusters = report.psychometricProfile.interestClusters || [];
    const colW = 250;
    const itemH = 88;

    clusters.forEach((cl, idx) => {
      const colX = idx % 2 === 0 ? 40 : 305;
      const rowY = gridY + 18 + Math.floor(idx / 2) * (itemH + 10);

      doc.roundedRect(colX, rowY, colW, itemH, 6).fillAndStroke(colors.white, colors.cardBorder);

      // Code Pill
      doc.roundedRect(colX + 10, rowY + 10, 20, 16, 3).fill(colors.primaryTeal);
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.white).text(cl.code, colX + 16, rowY + 14);

      // Dimension Name & Score
      doc.font("Helvetica-Bold").fontSize(9.5).fillColor(colors.darkNavy).text(cl.name, colX + 36, rowY + 10, { width: 160 });
      doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.primaryTeal).text(`${cl.percentage}%`, colX + 198, rowY + 10, { align: "right", width: 42 });

      // Horizontal Progress Bar
      const barY = rowY + 28;
      doc.roundedRect(colX + 36, barY, 204, 6, 3).fill("#E5E7EB");
      const fillW = Math.max(10, (cl.percentage / 100) * 204);
      doc.roundedRect(colX + 36, barY, fillW, 6, 3).fill(colors.emeraldGreen);

      // Cluster Subtitle & Description
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.slateGray).text(cl.clusterTitle, colX + 10, rowY + 40, { width: colW - 20 });
      doc.font("Helvetica").fontSize(7).fillColor(colors.mutedGray).text(cl.description, colX + 10, rowY + 52, { width: colW - 20, lineGap: 1.5 });
    });

    // Bottom Guidance Note
    const botY = 515;
    doc.roundedRect(40, botY, 515, 60, 6).fillAndStroke(colors.lightBg, colors.cardBorder);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.primaryTeal).text("Understanding Your RIASEC Profile", 54, botY + 12);
    doc.font("Helvetica").fontSize(7.5).fillColor(colors.slateGray).text(
      "The RIASEC model (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) categorizes professional environments. High-scoring clusters represent areas where you are most naturally engaged, energizing both your academic choices and future career satisfaction.",
      54,
      botY + 26,
      { width: 485, lineGap: 2 }
    );
  }

  // --------------------------------------------------------------------------
  // PAGE 5: COGNITIVE & DEVELOPMENTAL STRENGTHS
  // --------------------------------------------------------------------------
  private renderCognitiveStrengths(doc: PDFKit.PDFDocument, report: CareerReportDTO, colors: any) {
    this.renderSectionHeader(doc, "4. Cognitive & Developmental Strength Analysis", "Mapping student cognitive capabilities directly to learning mastery and career readiness", colors);

    const strengths = (report.strengthAnalysis || []).slice(0, 4);
    let stY = 100;

    strengths.forEach((st, idx) => {
      doc.roundedRect(40, stY, 515, 112, 6).fillAndStroke(colors.lightBg, colors.cardBorder);

      // Card Header: Rank, Name, Score & Progress Bar
      doc.roundedRect(52, stY + 10, 18, 16, 3).fill(colors.primaryTeal);
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.white).text(`0${idx + 1}`, 55, stY + 14);

      doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.darkNavy).text(st.name, 76, stY + 11);
      doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.primaryTeal).text(`${st.score}%`, 485, stY + 11, { align: "right", width: 55 });

      // Progress bar
      doc.roundedRect(76, stY + 25, 410, 4, 2).fill("#E5E7EB");
      doc.roundedRect(76, stY + 25, Math.max(10, (st.score / 100) * 410), 4, 2).fill(colors.emeraldGreen);

      // 3 Structured Breakdown Cards: What it means, How it helps, Career connection
      const subCardY = stY + 36;
      const subCardW = 158;

      // 1. What this means
      doc.roundedRect(52, subCardY, subCardW, 64, 4).fillAndStroke(colors.white, "#E2E8F0");
      doc.font("Helvetica-Bold").fontSize(7).fillColor(colors.primaryTeal).text("🔍 WHAT THIS MEANS", 58, subCardY + 6);
      doc.font("Helvetica").fontSize(6.5).fillColor(colors.slateGray).text(st.whatItMeans, 58, subCardY + 18, { width: subCardW - 12, lineGap: 1.5 });

      // 2. How it helps learning
      doc.roundedRect(218, subCardY, subCardW, 64, 4).fillAndStroke(colors.white, "#E2E8F0");
      doc.font("Helvetica-Bold").fontSize(7).fillColor("#0284C7").text("💡 HOW IT HELPS LEARNING", 224, subCardY + 6);
      doc.font("Helvetica").fontSize(6.5).fillColor(colors.slateGray).text(st.howItHelpsLearning, 224, subCardY + 18, { width: subCardW - 12, lineGap: 1.5 });

      // 3. Career connection
      doc.roundedRect(384, subCardY, subCardW, 64, 4).fillAndStroke(colors.white, "#E2E8F0");
      doc.font("Helvetica-Bold").fontSize(7).fillColor("#D97706").text("🚀 CAREER CONNECTION", 390, subCardY + 6);
      doc.font("Helvetica").fontSize(6.5).fillColor(colors.slateGray).text(st.howItConnectsWithCareers, 390, subCardY + 18, { width: subCardW - 12, lineGap: 1.5 });

      stY += 122;
    });

    // Bottom Summary Note
    const botY = stY + 4;
    doc.roundedRect(40, botY, 515, 48, 6).fillAndStroke("#F0FDF4", "#BBF7D0");
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#166534").text("Cognitive Growth Guidance", 54, botY + 10);
    doc.font("Helvetica").fontSize(7).fillColor("#14532D").text(
      "These cognitive dimensions indicate high aptitude for structured problem decomposition and scientific inquiry. We recommend challenging yourself with advanced coursework and extracurricular innovation challenges.",
      54,
      botY + 22,
      { width: 485, lineGap: 2 }
    );
  }

  // --------------------------------------------------------------------------
  // PAGE 6: TOP CAREER MATCHES
  // --------------------------------------------------------------------------
  private renderTopCareerMatches(doc: PDFKit.PDFDocument, report: CareerReportDTO, colors: any) {
    this.renderSectionHeader(doc, "5. Recommended Career Exploration Pathways", "Ranked career pathways mapped to student psychometric profile & demonstrated strengths", colors);

    const matches = (report.careerMatches || []).slice(0, 4);
    let mY = 100;

    matches.forEach((m, idx) => {
      doc.roundedRect(40, mY, 515, 114, 6).fillAndStroke(colors.white, colors.cardBorder);

      // Top Header: Number Pill, Title, Category Badge & Match Circle
      doc.roundedRect(52, mY + 12, 22, 18, 4).fill(colors.primaryTeal);
      doc.font("Helvetica-Bold").fontSize(9).fillColor(colors.white).text(`0${idx + 1}`, 56, mY + 16);

      doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.darkNavy).text(m.title, 82, mY + 12, { width: 330 });
      doc.font("Helvetica").fontSize(7.5).fillColor(colors.mutedGray).text(`${m.category}   •   ${m.industry}`, 82, mY + 26);

      // Match Affinity Circle / Pill
      doc.roundedRect(440, mY + 10, 100, 24, 12).fill(colors.subtleTealBg);
      doc.font("Helvetica-Bold").fontSize(9.5).fillColor(colors.primaryTeal).text(
        `${m.matchPercentage}% Match`,
        440,
        mY + 16,
        { align: "center", width: 100 }
      );

      // Alignment Summary
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.charcoal).text("Why this matches you:", 52, mY + 44);
      doc.font("Helvetica").fontSize(7.5).fillColor(colors.slateGray).text(
        m.whyThisMatches?.summary || m.whyThisMatches?.alignmentNote || "High affinity with your cognitive profile and problem-solving orientation.",
        145,
        mY + 44,
        { width: 395, lineGap: 1.5 }
      );

      // Alignment Factors / Bullet points
      if (m.whyThisMatches?.topMatchingFactors && m.whyThisMatches.topMatchingFactors.length > 0) {
        const factorsStr = m.whyThisMatches.topMatchingFactors.slice(0, 2).join("   •   ");
        doc.font("Helvetica-Bold").fontSize(7).fillColor(colors.primaryTeal).text("Key Alignment Factors:", 52, mY + 68);
        doc.font("Helvetica").fontSize(7).fillColor(colors.charcoal).text(factorsStr, 150, mY + 68, { width: 390 });
      }

      // Required Skill Tags (Pill tags)
      doc.font("Helvetica-Bold").fontSize(7).fillColor(colors.slateGray).text("Key Skills:", 52, mY + 88);
      const skills = (m.requiredSkills || []).slice(0, 4);
      let sX = 100;
      skills.forEach((skill) => {
        const tagW = Math.min(100, doc.fontSize(6.5).widthOfString(skill) + 14);
        doc.roundedRect(sX, mY + 85, tagW, 14, 3).fillAndStroke(colors.lightBg, "#E2E8F0");
        doc.font("Helvetica").fontSize(6.5).fillColor(colors.charcoal).text(skill, sX + 7, mY + 88);
        sX += tagW + 6;
      });

      // Growth Outlook Pill at far right
      doc.font("Helvetica-Bold").fontSize(6.5).fillColor(colors.emeraldGreen).text(
        `✦ Growth: ${m.futureGrowth}`,
        430,
        mY + 88,
        { align: "right", width: 110 }
      );

      mY += 124;
    });

    // Bottom Exploration philosophy note
    const botY = mY + 4;
    doc.roundedRect(40, botY, 515, 48, 6).fillAndStroke(colors.lightBg, colors.cardBorder);
    doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.primaryTeal).text("Multi-Pathway Exploration Approach", 54, botY + 10);
    doc.font("Helvetica").fontSize(7).fillColor(colors.slateGray).text(
      "Ranked matches reflect your highest statistical affinities based on assessment answers. We recommend exploring multiple adjacent pathways rather than narrowing down prematurely.",
      54,
      botY + 22,
      { width: 485, lineGap: 2 }
    );
  }

  // --------------------------------------------------------------------------
  // PAGE 7: IN-DEPTH CAREER EXPLORATION & ROADMAP
  // --------------------------------------------------------------------------
  private renderCareerDeepDiveRoadmaps(doc: PDFKit.PDFDocument, report: CareerReportDTO, colors: any) {
    this.renderSectionHeader(doc, "6. In-Depth Career Exploration Detail", "Detailed breakdown of day-to-day responsibilities, learning roadmaps, and subject choices", colors);

    const primaryDeepDive = (report.careerDeepDives || [])[0] || {
      title: "AI & Machine Learning Architect",
      category: "Computer Science & Engineering",
      overview: "Designs, trains, and deploys intelligent models and algorithmic systems that solve complex real-world challenges across industries.",
      whatProfessionalsDo: [
        "Analyze complex data structures and formulate machine learning models.",
        "Design scalable cloud-native architectures for AI system deployment.",
        "Collaborate with multidisciplinary engineering and design teams.",
        "Continuously evaluate model safety, ethics, and algorithmic precision.",
      ],
      importantSkills: ["Algorithm Design", "Python / C++", "Data Analytics", "Critical Problem Solving", "Cloud Systems"],
      suitableSubjects: ["Mathematics", "Computer Science", "Physics", "Statistics", "English"],
      learningRoadmap: [
        {
          stage: "Stage 1: Foundation",
          title: "High School (Grades 9-10)",
          description: "Build deep fundamentals in advanced mathematics, algebra, algorithmic logic, and elementary coding.",
          focusAreas: ["Mathematics & Logic", "Introductory Python / Scratch", "Science Club Projects"],
        },
        {
          stage: "Stage 2: Skill Development",
          title: "Higher Secondary (Grades 11-12)",
          description: "Select Science/Math stream, take advanced computer science coursework, and build practical software projects.",
          focusAreas: ["Calculus & Statistics", "Data Structures", "Competitive Coding"],
        },
        {
          stage: "Stage 3: Advanced Exploration",
          title: "Undergraduate Degree (Years 1-4)",
          description: "Pursue Bachelor of Technology (B.Tech / B.S.) in Computer Science, Data Science, or Artificial Intelligence.",
          focusAreas: ["Core Machine Learning", "Internships", "Open-Source Capstone"],
        },
        {
          stage: "Stage 4: Mastery",
          title: "Professional Specialization",
          description: "Transition into entry-level specialist roles or pursue Master/Ph.D. specialization in applied intelligent systems.",
          focusAreas: ["Industry Certifications", "Applied AI Research", "Mentorship"],
        },
      ],
      sampleRoles: ["Associate AI Engineer", "Data Scientist", "System Architect", "Machine Learning Researcher"],
    };

    // Hero Overview Card
    const heroY = 100;
    doc.roundedRect(40, heroY, 515, 85, 8).fillAndStroke(colors.subtleTealBg, "#CCEFEA");

    doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.primaryTeal).text(primaryDeepDive.category.toUpperCase(), 54, heroY + 12);
    doc.font("Helvetica-Bold").fontSize(13).fillColor(colors.darkNavy).text(primaryDeepDive.title, 54, heroY + 24);

    doc.font("Helvetica").fontSize(8).fillColor(colors.charcoal).text(
      primaryDeepDive.overview,
      54,
      heroY + 44,
      { width: 485, lineGap: 2 }
    );

    // 2-Column: What Professionals Do vs Recommended Subjects & Skills
    const midY = 195;
    const colW = 250;

    // Left: What Professionals Do
    doc.roundedRect(40, midY, colW, 115, 6).fillAndStroke(colors.white, colors.cardBorder);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.darkNavy).text("What Professionals in this Role Do", 52, midY + 12);

    let listY = midY + 28;
    (primaryDeepDive.whatProfessionalsDo || []).slice(0, 4).forEach((item) => {
      doc.circle(56, listY + 4, 2).fill(colors.primaryTeal);
      doc.font("Helvetica").fontSize(7).fillColor(colors.slateGray).text(item, 64, listY, { width: colW - 30, lineGap: 1.5 });
      listY += 20;
    });

    // Right: Recommended Subjects & Core Tools
    doc.roundedRect(305, midY, colW, 115, 6).fillAndStroke(colors.white, colors.cardBorder);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.darkNavy).text("Recommended High School Subjects", 317, midY + 12);

    const subStr = (primaryDeepDive.suitableSubjects || []).join("   •   ");
    doc.font("Helvetica").fontSize(7.5).fillColor(colors.charcoal).text(subStr, 317, midY + 28, { width: colW - 24 });

    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.darkNavy).text("Core Capabilities & Key Tools", 317, midY + 54);
    const skStr = (primaryDeepDive.importantSkills || []).join("   •   ");
    doc.font("Helvetica").fontSize(7.5).fillColor(colors.primaryTeal).text(skStr, 317, midY + 70, { width: colW - 24 });

    // 4-Stage Learning Timeline Roadmap
    const mapY = 325;
    doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.darkNavy).text("4-Stage Educational & Career Progression Roadmap", 40, mapY);

    const roadmap = primaryDeepDive.learningRoadmap || [];
    const stepW = 122;

    roadmap.slice(0, 4).forEach((step, sIdx) => {
      const stepX = 40 + sIdx * 131;
      const stepY = mapY + 18;

      doc.roundedRect(stepX, stepY, stepW, 175, 6).fillAndStroke(colors.white, colors.cardBorder);

      // Stage Pill
      doc.roundedRect(stepX + 8, stepY + 8, stepW - 16, 16, 3).fill(colors.subtleTealBg);
      doc.font("Helvetica-Bold").fontSize(7).fillColor(colors.primaryTeal).text(
        `STAGE 0${sIdx + 1}`,
        stepX + 8,
        stepY + 12,
        { align: "center", width: stepW - 16 }
      );

      doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.darkNavy).text(step.title, stepX + 8, stepY + 30, { width: stepW - 16 });

      doc.font("Helvetica").fontSize(6.5).fillColor(colors.slateGray).text(
        step.description,
        stepX + 8,
        stepY + 56,
        { width: stepW - 16, lineGap: 1.5 }
      );

      // Focus Areas
      if (step.focusAreas && step.focusAreas.length > 0) {
        doc.font("Helvetica-Bold").fontSize(6).fillColor(colors.primaryTeal).text("KEY FOCUS:", stepX + 8, stepY + 120);
        const focusStr = step.focusAreas.slice(0, 2).join("\n• ");
        doc.font("Helvetica").fontSize(6).fillColor(colors.charcoal).text(`• ${focusStr}`, stepX + 8, stepY + 130, { width: stepW - 16, lineGap: 1.5 });
      }
    });

    // Sample Roles Bar
    const rolesY = 530;
    doc.roundedRect(40, rolesY, 515, 36, 6).fillAndStroke(colors.lightBg, colors.cardBorder);
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.darkNavy).text("Sample Target Job Roles: ", 54, rolesY + 13);
    const rolesStr = (primaryDeepDive.sampleRoles || []).join("    |    ");
    doc.font("Helvetica").fontSize(7.5).fillColor(colors.primaryTeal).text(rolesStr, 165, rolesY + 13, { width: 380 });
  }

  // --------------------------------------------------------------------------
  // PAGE 8: ACTIONABLE SKILL DEVELOPMENT PLAN
  // --------------------------------------------------------------------------
  private renderSkillDevelopmentPlan(doc: PDFKit.PDFDocument, report: CareerReportDTO, colors: any) {
    this.renderSectionHeader(doc, "7. Actionable Skill Development Plan", "Targeted growth recommendations to elevate student capabilities over the next 12-24 months", colors);

    // Development Overview Banner
    const bannerY = 100;
    doc.roundedRect(40, bannerY, 515, 60, 8).fillAndStroke(colors.subtleTealBg, "#CCEFEA");
    doc.font("Helvetica-Bold").fontSize(9).fillColor(colors.primaryTeal).text("Developmental Growth Strategy", 54, bannerY + 12);
    doc.font("Helvetica").fontSize(8).fillColor(colors.charcoal).text(
      report.developmentPlan?.summary || "This development plan outlines high-leverage cognitive and practical skill focus areas to accelerate your readiness for advanced STEM and interdisciplinary careers.",
      54,
      bannerY + 26,
      { width: 485, lineGap: 2 }
    );

    // Before/After & Current vs Target Growth Cards for 3 Core Skills
    const planY = 175;
    doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.darkNavy).text("Targeted Skill Enhancement Profiles", 40, planY);

    const skills = (report.developmentPlan?.skillsToStrengthen || []).slice(0, 3);
    let sY = planY + 18;

    skills.forEach((sk) => {
      doc.roundedRect(40, sY, 515, 108, 6).fillAndStroke(colors.white, colors.cardBorder);

      // Skill Header & Current Stage Badge
      doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.darkNavy).text(sk.skillName, 54, sY + 12);

      doc.roundedRect(380, sY + 10, 160, 18, 4).fill(colors.amberBg);
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.amberWarning).text(
        `Current: ${sk.currentLevel}`,
        380,
        sY + 14,
        { align: "center", width: 160 }
      );

      // 2 Columns: Action Steps vs Suggested Real-World Activities
      const colY = sY + 36;

      // Left: Action Steps
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.primaryTeal).text("Action Steps & Practice Methods:", 54, colY);
      let actY = colY + 14;
      sk.howToImprove.slice(0, 2).forEach((step) => {
        doc.circle(58, actY + 4, 2).fill(colors.primaryTeal);
        doc.font("Helvetica").fontSize(7).fillColor(colors.charcoal).text(step, 66, actY, { width: 220, lineGap: 1.5 });
        actY += 24;
      });

      // Right: Suggested Activities
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#0284C7").text("Suggested Real-World Activities:", 305, colY);
      let sugY = colY + 14;
      sk.suggestedActivities.slice(0, 2).forEach((act) => {
        doc.circle(309, sugY + 4, 2).fill("#0284C7");
        doc.font("Helvetica").fontSize(7).fillColor(colors.charcoal).text(act, 317, sugY, { width: 220, lineGap: 1.5 });
        sugY += 24;
      });

      sY += 118;
    });

    // Bottom Growth Mindset Reminder
    const botY = sY + 2;
    doc.roundedRect(40, botY, 515, 48, 6).fillAndStroke("#F0FDF4", "#BBF7D0");
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#166534").text("Cultivating Deliberate Practice", 54, botY + 10);
    doc.font("Helvetica").fontSize(7).fillColor("#14532D").text(
      "Focusing on 2-3 specific micro-habits weekly (such as solving 2 algorithmic puzzles or participating in debate presentations) compounds dramatically over an academic year.",
      54,
      botY + 22,
      { width: 485, lineGap: 2 }
    );
  }

  // --------------------------------------------------------------------------
  // PAGE 9: PARENT & GUARDIAN GUIDANCE FRAMEWORK
  // --------------------------------------------------------------------------
  private renderParentGuidance(doc: PDFKit.PDFDocument, report: CareerReportDTO, colors: any) {
    this.renderSectionHeader(doc, "8. Parent & Guardian Guidance Framework", "Supportive recommendations to nurture your child's curiosity, resilience, and career exploration", colors);

    // Nurturing Mindset Hero Banner
    const heroY = 100;
    doc.roundedRect(40, heroY, 515, 78, 8).fillAndStroke(colors.emeraldBg, "#A7F3D0");

    doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#065F46").text("The Nurturing Mindset: Exploration Over Premature Pressure", 54, heroY + 12);
    doc.font("Helvetica").fontSize(8).fillColor("#047857").text(
      report.parentGuidance.nurturingMindset,
      54,
      heroY + 28,
      { width: 485, lineGap: 2.5 }
    );

    // 2-Column: Constructive Support vs Pitfalls to Avoid
    const midY = 190;
    const colW = 250;

    // Left: How Parents Can Support
    doc.roundedRect(40, midY, colW, 160, 6).fillAndStroke(colors.white, colors.cardBorder);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.primaryTeal).text("✓ Constructive Ways Parents Can Support", 52, midY + 12);

    let supY = midY + 28;
    (report.parentGuidance.howParentsCanSupport || []).slice(0, 3).forEach((item) => {
      doc.circle(56, supY + 4, 2).fill(colors.primaryTeal);
      doc.font("Helvetica").fontSize(7).fillColor(colors.charcoal).text(item, 64, supY, { width: colW - 30, lineGap: 2 });
      supY += 40;
    });

    // Right: Things to Avoid
    doc.roundedRect(305, midY, colW, 160, 6).fillAndStroke(colors.white, colors.cardBorder);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.roseRed).text("✕ Common Pitfalls & Things to Avoid", 317, midY + 12);

    let avY = midY + 28;
    (report.parentGuidance.thingsToAvoid || []).slice(0, 3).forEach((item) => {
      doc.circle(321, avY + 4, 2).fill(colors.roseRed);
      doc.font("Helvetica").fontSize(7).fillColor(colors.charcoal).text(item, 329, avY, { width: colW - 30, lineGap: 2 });
      avY += 40;
    });

    // Recommended Family Discussions Grid
    const discY = 365;
    doc.font("Helvetica-Bold").fontSize(10.5).fillColor(colors.darkNavy).text("Recommended Family Discussion Starters", 40, discY);

    const questions = (report.parentGuidance.recommendedDiscussions || []).slice(0, 4);
    const qW = 250;
    const qH = 68;

    questions.forEach((q, idx) => {
      const qX = idx % 2 === 0 ? 40 : 305;
      const qY = discY + 16 + Math.floor(idx / 2) * (qH + 10);

      doc.roundedRect(qX, qY, qW, qH, 6).fillAndStroke(colors.amberBg, "#FDE68A");
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.amberWarning).text(`CONVERSATION STARTER 0${idx + 1}`, qX + 12, qY + 10);
      doc.font("Helvetica-Oblique").fontSize(7.5).fillColor(colors.charcoal).text(
        q,
        qX + 12,
        qY + 24,
        { width: qW - 24, lineGap: 2 }
      );
    });

    // Bottom Reassurance Card
    const botY = 540;
    doc.roundedRect(40, botY, 515, 48, 6).fillAndStroke(colors.lightBg, colors.cardBorder);
    doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.primaryTeal).text("Empowering Long-Term Student Success", 54, botY + 10);
    doc.font("Helvetica").fontSize(7).fillColor(colors.slateGray).text(
      "The most successful career paths are built through supportive encouragement, psychological safety, and allowing students to explore their natural interests through hands-on learning.",
      54,
      botY + 22,
      { width: 485, lineGap: 2 }
    );
  }

  // --------------------------------------------------------------------------
  // PAGE 10: FINAL SUMMARY & COUNSELLOR CONNECT
  // --------------------------------------------------------------------------
  private renderClosingInspirationPage(doc: PDFKit.PDFDocument, report: CareerReportDTO, colors: any) {
    this.renderSectionHeader(doc, "9. Exploration Synthesis & Next Steps", "Consolidated guidance recommendations and certified counsellor connection", colors);

    // Inspiring Closing Banner
    const quoteY = 100;
    doc.roundedRect(40, quoteY, 515, 80, 8).fillAndStroke(colors.subtleTealBg, "#CCEFEA");

    doc.font("Helvetica-Bold").fontSize(13).fillColor(colors.primaryTeal).text(
      "“Your journey is about exploration, not limitation.”",
      54,
      quoteY + 18,
      { align: "center", width: 485 }
    );

    doc.font("Helvetica").fontSize(8).fillColor(colors.charcoal).text(
      "Use this report as a dynamic compass for choosing subjects, finding enriching hobbies, and building capabilities. As you grow and explore, new horizons will continue to open.",
      54,
      quoteY + 44,
      { align: "center", width: 485, lineGap: 2 }
    );

    // 4 Action Pillars: Explore, Learn, Experiment, Discuss
    const pilY = 195;
    doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.darkNavy).text("Your Immediate 4-Step Action Framework", 40, pilY);

    const pillars = [
      {
        num: "01",
        title: "Explore",
        desc: "Research recommended career pathways online, read domain articles, and watch professional documentaries.",
        color: colors.primaryTeal,
      },
      {
        num: "02",
        title: "Learn",
        desc: "Align your upcoming term subject choices and enroll in foundational logic, math, or coding tutorials.",
        color: "#0284C7",
      },
      {
        num: "03",
        title: "Experiment",
        desc: "Join school science clubs, enter hackathons or essay debates, and build practical portfolio projects.",
        color: "#7C3AED",
      },
      {
        num: "04",
        title: "Discuss",
        desc: "Review this report with family mentors and schedule a 1-on-1 session with a certified MeLife counsellor.",
        color: "#059669",
      },
    ];

    const pW = 122;
    pillars.forEach((p, idx) => {
      const pX = 40 + idx * 131;
      const pY = pilY + 18;

      doc.roundedRect(pX, pY, pW, 110, 6).fillAndStroke(colors.white, colors.cardBorder);

      doc.roundedRect(pX + 8, pY + 8, 22, 16, 3).fill(p.color);
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.white).text(p.num, pX + 8, pY + 12, { align: "center", width: 22 });

      doc.font("Helvetica-Bold").fontSize(9.5).fillColor(colors.darkNavy).text(p.title, pX + 8, pY + 30);
      doc.font("Helvetica").fontSize(7).fillColor(colors.slateGray).text(p.desc, pX + 8, pY + 46, { width: pW - 16, lineGap: 2 });
    });

    // Counsellor Connect Call to Action Card
    const ctaY = 340;
    doc.roundedRect(40, ctaY, 515, 140, 8).fillAndStroke("#0F2926", "#008F83");

    doc.font("Helvetica-Bold").fontSize(12).fillColor("#00C896").text("Connect with a Certified 3G MeLife Counsellor", 56, ctaY + 18);
    doc.font("Helvetica").fontSize(8.5).fillColor("#FFFFFF").text(
      "Transform these psychometric discoveries into an individualized educational roadmap. Our certified career counsellors offer tailored guidance on subject stream selection, university admission requirements, and career transition milestones.",
      56,
      ctaY + 36,
      { width: 480, lineGap: 2.5 }
    );

    // Booking Details Box
    doc.roundedRect(56, ctaY + 85, 480, 40, 6).fill("#091D1A");
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#38BDF8").text("HOW TO BOOK YOUR 1-ON-1 ADVISORY SESSION:", 70, ctaY + 94);
    doc.font("Helvetica").fontSize(7.5).fillColor("#CBD5E1").text(
      "Visit your 3G MeLife Student Portal at /participant/counsellors or contact your academic institution's guidance desk to schedule your session.",
      70,
      ctaY + 107,
      { width: 450 }
    );

    // Official Certification & Exploration Benchmark stamp
    const certY = 495;
    doc.roundedRect(40, certY, 515, 65, 6).fillAndStroke(colors.lightBg, colors.cardBorder);
    doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.primaryTeal).text("Official Platform Assessment Certification", 54, certY + 12);
    doc.font("Helvetica").fontSize(7).fillColor(colors.slateGray).text(
      `Candidate: ${report.cover.studentName} • Evaluation Code: ${report.reportId || "MELIFE-2026"} • Version: ${report.templateVersion}\nFormulated using multi-dimensional psychometric models and validated developmental career progression algorithms.`,
      54,
      certY + 26,
      { width: 485, lineGap: 2 }
    );
  }

  // --------------------------------------------------------------------------
  // PAGE 11: CERTIFIED COUNSELLOR DIAGNOSTIC INSIGHTS (PROTECTED)
  // --------------------------------------------------------------------------
  private renderCounsellorInsights(doc: PDFKit.PDFDocument, report: CareerReportDTO, colors: any) {
    this.renderSectionHeader(doc, "10. Certified Counsellor Diagnostic Insights", "Protected diagnostic observations, dimensional distributions, and structured intervention prompts", colors);

    const data = report.counsellorInsights!;

    // Confidentiality Notice
    const notY = 100;
    doc.roundedRect(40, notY, 515, 44, 6).fillAndStroke(colors.amberBg, "#FCD34D");
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#92400E").text("CONFIDENTIAL PROFESSIONAL BRIEFING — PRACTITIONER ACCESS ONLY", 52, notY + 10);
    doc.font("Helvetica").fontSize(7).fillColor("#78350F").text(
      "This section contains psychometric scale distributions, diagnostic observations, and structured intervention prompts intended exclusively for certified career guidance practitioners.",
      52,
      notY + 22,
      { width: 490 }
    );

    // Dimensional Assessment Breakdown Table
    let dtY = 155;
    doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.darkNavy).text("Granular Dimensional Assessment Breakdown", 40, dtY);

    dtY += 16;
    doc.rect(40, dtY, 515, 18).fill("#E2E8F0");
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.darkNavy).text("Scale Code", 50, dtY + 5);
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.darkNavy).text("Dimension Name", 120, dtY + 5);
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.darkNavy).text("Percentile Score", 410, dtY + 5);
    doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.darkNavy).text("Readiness Band", 480, dtY + 5);

    dtY += 18;
    (data.detailedDimensionScores || []).forEach((dim, idx) => {
      const rowY = dtY + idx * 16;
      if (idx % 2 === 0) {
        doc.rect(40, rowY, 515, 16).fill("#F8FAFC");
      }
      doc.font("Helvetica-Bold").fontSize(7).fillColor(colors.primaryTeal).text(dim.code, 50, rowY + 4);
      doc.font("Helvetica").fontSize(7).fillColor(colors.darkNavy).text(dim.name, 120, rowY + 4);
      doc.font("Helvetica-Bold").fontSize(7).fillColor(colors.primaryTeal).text(`${dim.score}%`, 410, rowY + 4);
      doc.font("Helvetica").fontSize(7).fillColor(colors.mutedGray).text(dim.band, 480, rowY + 4);
    });

    const tableBottomY = dtY + (data.detailedDimensionScores.length * 16) + 16;

    // 2-Column: Assessor Observations vs Intervention Prompts
    const colW = 250;

    // Observations
    doc.roundedRect(40, tableBottomY, colW, 145, 6).fillAndStroke(colors.white, colors.cardBorder);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.darkNavy).text("Assessor Observations", 52, tableBottomY + 12);
    let oY = tableBottomY + 28;
    data.assessmentObservations.slice(0, 4).forEach((obs) => {
      doc.circle(56, oY + 4, 2).fill(colors.primaryTeal);
      doc.font("Helvetica").fontSize(6.5).fillColor(colors.charcoal).text(obs, 64, oY, { width: colW - 30, lineGap: 1.5 });
      oY += 26;
    });

    // Interventions
    doc.roundedRect(305, tableBottomY, colW, 145, 6).fillAndStroke(colors.white, colors.cardBorder);
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.primaryTeal).text("Actionable Advisory Prompts", 317, tableBottomY + 12);
    let iY = tableBottomY + 28;
    (data.suggestedDiscussionPoints || data.recommendedInterventions || []).slice(0, 4).forEach((pt) => {
      doc.circle(321, iY + 4, 2).fill(colors.primaryTeal);
      doc.font("Helvetica").fontSize(6.5).fillColor(colors.charcoal).text(pt, 329, iY, { width: colW - 30, lineGap: 1.5 });
      iY += 26;
    });
  }

  // --------------------------------------------------------------------------
  // SECTION HEADER & GLOBAL NUMBERED FOOTERS
  // --------------------------------------------------------------------------
  private renderSectionHeader(doc: PDFKit.PDFDocument, title: string, subtitle: string, colors: any) {
    // Branded Top Bar
    doc.rect(40, 40, 515, 3.5).fill(colors.primaryTeal);

    // Section Title
    doc.font("Helvetica-Bold").fontSize(14).fillColor(colors.darkNavy).text(title, 40, 52);
    doc.font("Helvetica").fontSize(8).fillColor(colors.mutedGray).text(subtitle, 40, 70);

    // Subtle divider
    doc.rect(40, 84, 515, 0.5).fill(colors.lightBorder);
  }

  private renderGlobalFootersAndHeaders(doc: PDFKit.PDFDocument, _report: CareerReportDTO, colors: any) {
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);

      // Skip footer on Cover page (page 0) as it has its own custom dark footer
      if (i > 0) {
        doc.rect(40, 792, 515, 0.5).fill("#D1D5DB");

        doc.font("Helvetica").fontSize(7).fillColor(colors.mutedGray).text(
          "3G MeLife — AI Assisted Psychometric Career Guidance Platform • Non-prescriptive exploration benchmark",
          40,
          800,
          { width: 390 }
        );

        doc.font("Helvetica-Bold").fontSize(7).fillColor(colors.darkNavy).text(
          `Page ${i + 1} of ${range.count}`,
          440,
          800,
          { align: "right", width: 115 }
        );
      }
    }
  }
}

export const careerReportPdfGenerator = new CareerReportPdfGenerator();
