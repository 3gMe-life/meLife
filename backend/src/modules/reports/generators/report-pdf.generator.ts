/**
 * 3G MeLife Psychometric Report PDF Generator
 * Renders crisp, professional vector PDF reports using PDFKit with balanced 3-page storytelling.
 */

import PDFDocument from "pdfkit";
import { SkillFinderReportDTO } from "../report.types";
import { getReportTranslation } from "../i18n/report.translations";

export class ReportPdfGenerator {
  /**
   * Generates a balanced 3-page PDF document buffer from a SkillFinderReportDTO.
   */
  async generatePdf(report: SkillFinderReportDTO): Promise<Buffer> {
    const t = getReportTranslation(report.language || "en");

    return new Promise<Buffer>((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: "A4",
          margins: { top: 30, bottom: 20, left: 40, right: 40 },
          bufferPages: true,
          info: {
            Title: `${report.studentProfile.studentName} - 3G MeLife Skill Finder Report`,
            Author: "3G MeLife Psychometric Engine",
            Subject: "Skill Finder Psychometric Assessment Report",
            Keywords: "Skill Finder, Psychometric, Career Guidance, Learning Profile",
          },
        });

        const buffers: Buffer[] = [];
        doc.on("data", (chunk: Buffer) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", (err: Error) => reject(err));

        // Color Palette
        const colors = {
          primaryTeal: "#008F83",
          tealDark: "#172B2A",
          tealLightBg: "#E6F7F5",
          accentCyan: "#00B8D4",
          emeraldGreen: "#00C896",
          emeraldBg: "#E8F8F5",
          amberWarn: "#D97706",
          amberBg: "#FEF8E7",
          roseRed: "#EF4444",
          roseBg: "#FDF0F0",
          mutedGray: "#526866",
          lightBg: "#F4F8F7",
          cardBorder: "#E3ECEA",
          trackBg: "#E8ECEB",
          white: "#FFFFFF",
        };

        // ========================================================
        // PAGE 1: COVER, STUDENT PROFILE & EXECUTIVE ARCHETYPE
        // ========================================================

        // 1. Top Brand Accent Line
        doc.rect(40, 35, 515, 4).fill(colors.primaryTeal);

        // 2. Report Header Titles
        doc
          .font("Helvetica-Bold")
          .fontSize(18)
          .fillColor(colors.tealDark)
          .text("Skill Finder — Student Edition", 40, 48);

        doc
          .font("Helvetica")
          .fontSize(8.5)
          .fillColor(colors.primaryTeal)
          .text("Official Psychometric Assessment Report  •  29-Dimension Construct Model", 40, 70);

        // 3. Student Profile Card (High-Contrast Presentation)
        const profY = 88;
        doc.roundedRect(40, profY, 515, 84, 6).fillAndStroke(colors.lightBg, colors.cardBorder);

        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(colors.mutedGray)
          .text("STUDENT PARTICIPANT PROFILE", 54, profY + 10);

        // Left Column (Student metadata)
        doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.mutedGray).text("STUDENT NAME:", 54, profY + 28);
        doc.font("Helvetica-Bold").fontSize(9.5).fillColor(colors.tealDark).text(report.studentProfile.studentName, 140, profY + 27);

        doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.mutedGray).text("AGE / STAGE:", 54, profY + 45);
        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor(colors.tealDark)
          .text(
            `${report.studentProfile.age ? report.studentProfile.age + " yrs" : "N/A"}  •  ${report.studentProfile.educationStage}`,
            140,
            profY + 45
          );

        doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.mutedGray).text("SCHOOL / ACADEMY:", 54, profY + 62);
        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor(colors.tealDark)
          .text(report.studentProfile.schoolName || "3G MeLife Learning Academy", 140, profY + 62);

        // Right Column (Assessment metadata)
        doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.mutedGray).text("ASSESSMENT:", 330, profY + 28);
        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor(colors.tealDark)
          .text(report.studentProfile.versionName || "Skill Finder — Student Edition", 415, profY + 28);

        doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.mutedGray).text("COMPLETED DATE:", 330, profY + 45);
        const evalDateStr = report.studentProfile.completedAt
          ? new Date(report.studentProfile.completedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.tealDark).text(evalDateStr, 415, profY + 45);

        doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.mutedGray).text("REPORT ID:", 330, profY + 62);
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(colors.primaryTeal)
          .text(report.reportId.slice(0, 18) + "...", 415, profY + 62);

        // 4. Section 1: Executive Learning Profile Summary
        const execY = 186;
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor(colors.tealDark)
          .text("1. Your Psychometric Learning Profile", 40, execY);

        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(colors.mutedGray)
          .text("Non-Prescriptive Synthesis & Exploratory Alignment", 295, execY + 2);

        // Hero Box
        const heroBoxY = execY + 16;
        const heroBoxH = 210;
        doc.roundedRect(40, heroBoxY, 515, heroBoxH, 8).fillAndStroke(colors.tealLightBg, "#B2DFDB");

        // Archetype Pill
        doc.roundedRect(54, heroBoxY + 14, 210, 24, 6).fill(colors.primaryTeal);
        doc
          .font("Helvetica-Bold")
          .fontSize(10.5)
          .fillColor(colors.white)
          .text(report.executiveSummary.archetypeTitle, 64, heroBoxY + 20);

        // Reliability / Confidence Note
        doc.roundedRect(360, heroBoxY + 14, 180, 22, 5).fillAndStroke(colors.white, "#80CBC4");
        doc
          .font("Helvetica-Bold")
          .fontSize(7.5)
          .fillColor(colors.primaryTeal)
          .text(report.executiveSummary.reliabilityNote || "High Confidence (Calibrated)", 365, heroBoxY + 20, {
            width: 170,
            align: "center",
          });

        // Tagline
        doc
          .font("Helvetica-Oblique")
          .fontSize(9.5)
          .fillColor(colors.primaryTeal)
          .text(`"${report.executiveSummary.tagline}"`, 54, heroBoxY + 46, { width: 485 });

        // Strength Summary Paragraph
        doc
          .font("Helvetica")
          .fontSize(8.5)
          .fillColor(colors.tealDark)
          .text(report.executiveSummary.strengthSummary, 54, heroBoxY + 66, {
            width: 485,
            lineGap: 3,
            height: 60,
            ellipsis: true,
          });

        // Exploratory Alignment Sub-box
        const orientBoxY = heroBoxY + 130;
        doc.roundedRect(54, orientBoxY, 487, 38, 5).fillAndStroke(colors.white, "#B2DFDB");
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(colors.primaryTeal)
          .text("Exploratory Alignment: ", 64, orientBoxY + 8, { continued: true })
          .font("Helvetica")
          .fillColor(colors.tealDark)
          .text(report.executiveSummary.explorationFraming, { width: 465, lineGap: 2 });

        // Primary Traits Pills
        doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.mutedGray).text("Key Profile Themes:", 54, heroBoxY + 180);
        let traitX = 175;
        for (const trait of report.executiveSummary.primaryTraits.slice(0, 3)) {
          doc.roundedRect(traitX, heroBoxY + 175, 110, 18, 4).fillAndStroke(colors.white, colors.primaryTeal);
          doc
            .font("Helvetica-Bold")
            .fontSize(7.5)
            .fillColor(colors.primaryTeal)
            .text(trait, traitX + 2, heroBoxY + 180, { width: 106, align: "center" });
          traitX += 116;
        }

        // 5. Executive Takeaway & Foundation Note
        const noteY = heroBoxY + heroBoxH + 12;
        doc.roundedRect(40, noteY, 515, 66, 6).fillAndStroke(colors.lightBg, colors.cardBorder);

        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor(colors.tealDark)
          .text("Key Educational & Exploratory Guidance Note", 54, noteY + 10);

        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(colors.mutedGray)
          .text(
            "This assessment provides an exploratory baseline of the student's current interests, self-reported behaviours, developmental indicators, and task performance. Continued practice, academic evidence, and real-world experience can provide stronger evidence over time.",
            54,
            noteY + 24,
            { width: 485, lineGap: 2.5 }
          );

        // 6. Compact "How to Read This Report" (Four Distinct Evidence Pillars)
        const howToReadY = noteY + 74;
        doc.roundedRect(40, howToReadY, 515, 118, 6).fillAndStroke(colors.white, colors.cardBorder);

        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor(colors.tealDark)
          .text("HOW TO READ THIS REPORT — FOUR DISTINCT EVIDENCE PILLARS", 54, howToReadY + 10);

        doc
          .font("Helvetica")
          .fontSize(7.5)
          .fillColor(colors.mutedGray)
          .text(
            "These evidence sources measure different constructs and should not be directly compared as equivalent.",
            54,
            howToReadY + 23,
            { width: 485 }
          );

        // 4 Horizontal Pillar Boxes
        const pillars = [
          {
            title: "INTEREST EVIDENCE",
            desc: "What types of activities and environments currently attract you.",
            color: colors.primaryTeal,
            bg: colors.tealLightBg,
          },
          {
            title: "SELF-REPORTED BEHAVIOUR",
            desc: "How you describe your typical way of working and solving problems.",
            color: colors.emeraldGreen,
            bg: colors.emeraldBg,
          },
          {
            title: "TASK PERFORMANCE",
            desc: "How you performed on objective tasks during this assessment session.",
            color: colors.accentCyan,
            bg: "#EBF6FB",
          },
          {
            title: "DEVELOPMENTAL HABITS",
            desc: "Learning patterns and study habits that strengthen with practice.",
            color: colors.amberWarn,
            bg: colors.amberBg,
          },
        ];

        let pilX = 52;
        const pilW = 115;
        const pilH = 54;
        const pilY = howToReadY + 36;
        for (const p of pillars) {
          doc.roundedRect(pilX, pilY, pilW, pilH, 4).fillAndStroke(p.bg, p.color);
          doc.font("Helvetica-Bold").fontSize(7).fillColor(p.color).text(p.title, pilX + 6, pilY + 6, { width: pilW - 12 });
          doc.font("Helvetica").fontSize(6.5).fillColor(colors.tealDark).text(p.desc, pilX + 6, pilY + 18, { width: pilW - 12, lineGap: 1.5 });
          pilX += 123;
        }

        doc
          .font("Helvetica-Oblique")
          .fontSize(6.5)
          .fillColor(colors.mutedGray)
          .text(
            "* Self-reported interest and confidence can differ from session-specific task performance. This divergence provides valuable developmental guidance.",
            54,
            howToReadY + 98,
            { width: 485 }
          );

        // ========================================================
        // PAGE 2: RIASEC 6-CLUSTER INTERESTS & BEHAVIORAL SKILLS
        // ========================================================
        doc.addPage();

        // 1. Top Brand Accent Line
        doc.rect(40, 35, 515, 4).fill(colors.primaryTeal);

        // 2. Section 2: Vocational & Exploratory Interest Profile (Holland RIASEC)
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor(colors.tealDark)
          .text("2. RIASEC 6-Cluster Interest Distribution", 40, 48);

        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(colors.mutedGray)
          .text(
            report.interestProfile.summary || "Relative attraction across practical, investigative, artistic, social, enterprising, and structured domains.",
            40,
            64,
            { width: 515 }
          );

        // 3x2 Unified Matrix Cards (Strictly 6 RIASEC Dimensions)
        const riasecKeys = [
          { code: "R", name: "Builder (R)", label: "Builder", desc: "Hands-on making & engineering" },
          { code: "I", name: "Explorer (I)", label: "Explorer", desc: "Scientific inquiry & analytics" },
          { code: "A", name: "Creator (A)", label: "Creator", desc: "Visual arts & innovative design" },
          { code: "S", name: "Helper (S)", label: "Helper", desc: "Community empathy & counseling" },
          { code: "E", name: "Leader (E)", label: "Leader", desc: "Enterprise initiative & strategy" },
          { code: "C", name: "Organiser (C)", label: "Organiser", desc: "Operations & financial systems" },
        ];

        // Match scores from report.interestProfile.dimensions
        const riasecGridData = riasecKeys.map((item) => {
          const dimMatch = report.interestProfile.dimensions?.find(
            (d) => d.code.toUpperCase().includes(item.code) || d.name.toLowerCase().includes(item.label.toLowerCase())
          );
          const pct = dimMatch ? Math.round(dimMatch.scalePositionPercentage) : 50;
          return { ...item, score: pct };
        });

        // Render 3x2 Grid (3 cards per row, 2 rows)
        let gridY = Math.max(88, doc.y + 8);
        for (let row = 0; row < 2; row++) {
          let cardX = 40;
          for (let col = 0; col < 3; col++) {
            const itemIdx = row * 3 + col;
            const item = riasecGridData[itemIdx];
            if (!item) continue;

            const cardW = 165;
            const cardH = 58;
            doc.roundedRect(cardX, gridY, cardW, cardH, 6).fillAndStroke(colors.lightBg, colors.cardBorder);

            // Card Header: Code & Score
            doc.font("Helvetica-Bold").fontSize(9).fillColor(colors.tealDark).text(item.name, cardX + 10, gridY + 8);
            doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.primaryTeal).text(`${item.score}%`, cardX + 120, gridY + 7, {
              width: 35,
              align: "right",
            });

            // Progress Bar
            doc.roundedRect(cardX + 10, gridY + 24, 145, 5, 2.5).fill(colors.trackBg);
            const fillW = Math.max(4, Math.min(145, (item.score / 100) * 145));
            doc.roundedRect(cardX + 10, gridY + 24, fillW, 5, 2.5).fill(colors.primaryTeal);

            // Card Description
            doc.font("Helvetica").fontSize(7).fillColor(colors.mutedGray).text(item.desc, cardX + 10, gridY + 34, {
              width: 145,
              height: 18,
              ellipsis: true,
            });

            cardX += 175;
          }
          gridY += 66;
        }

        // Dominant & Supporting Patterns Sub-block / Broad Interest Pattern
        const patternY = gridY + 4;
        const sortedRiasec = [...riasecGridData].sort((a, b) => b.score - a.score);
        const topScore = sortedRiasec[0]?.score ?? 0;
        const tiedTop = sortedRiasec.filter((d) => d.score === topScore);
        const isBroad = report.interestProfile.isBroadInterestPattern || tiedTop.length >= 3;

        if (isBroad) {
          // Broad Interest Pattern (Full-width box)
          const tiedNames = report.interestProfile.tiedTopDomains?.join(", ") || tiedTop.map((d) => d.label).join(", ");
          const broadBoxH = 50;
          doc.roundedRect(40, patternY, 515, broadBoxH, 5).fillAndStroke(colors.tealLightBg, colors.primaryTeal);
          doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.primaryTeal).text("BROAD INTEREST PATTERN (DISTRIBUTED ORIENTATION)", 50, patternY + 6);
          doc
            .font("Helvetica-Bold")
            .fontSize(7.5)
            .fillColor(colors.tealDark)
            .text(`${tiedNames} currently show similarly elevated interest scores (${topScore}%).`, 50, patternY + 17, { width: 495 });
          const subY = Math.max(doc.y + 2, patternY + 35);
          doc
            .font("Helvetica")
            .fontSize(7)
            .fillColor(colors.mutedGray)
            .text("These results suggest broad exploratory interest rather than a sharply dominant RIASEC pattern.", 50, subY, { width: 495 });
        } else {
          const dom1 = sortedRiasec[0];
          const dom2 = sortedRiasec[1];
          const sup1 = sortedRiasec[2];
          const sup2 = sortedRiasec[3];

          // Dominant Box (Left)
          doc.roundedRect(40, patternY, 250, 32, 5).fillAndStroke(colors.emeraldBg, colors.emeraldGreen);
          doc.font("Helvetica-Bold").fontSize(7.5).fillColor("#007958").text("DOMINANT INTEREST PATTERN", 50, patternY + 6);
          doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.tealDark).text(`${dom1?.label} (${dom1?.score}%) + ${dom2?.label} (${dom2?.score}%)`, 50, patternY + 18);

          // Supporting Box (Right)
          doc.roundedRect(305, patternY, 250, 32, 5).fillAndStroke(colors.tealLightBg, colors.primaryTeal);
          doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.primaryTeal).text("SUPPORTING INTEREST PATTERN", 315, patternY + 6);
          doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.tealDark).text(`${sup1?.label} (${sup1?.score}%) + ${sup2?.label} (${sup2?.score}%)`, 315, patternY + 18);
        }

        // Divider
        const dividerY = isBroad ? patternY + 58 : patternY + 42;
        doc.rect(40, dividerY, 515, 0.8).fill(colors.cardBorder);

        // 3. Section 3: Strongly Reported Skill Behaviours & Emerging Growth Opportunities
        const skillSecY = dividerY + 10;
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor(colors.tealDark)
          .text("3. Strongly Reported Skill Behaviours & Growth Opportunities", 40, skillSecY);

        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(colors.mutedGray)
          .text(
            report.skillBehaviour.summary || "Evaluates self-reported problem-solving and collaboration habits (Evidence Source: Self-Reported Behaviour).",
            40,
            skillSecY + 16,
            { width: 515 }
          );

        // Side-by-Side Cards
        const skillBoxY = skillSecY + 30;
        const skillBoxH = 175;

        // Left Card: Strongly Reported Skill Behaviours
        doc.roundedRect(40, skillBoxY, 250, skillBoxH, 6).fillAndStroke(colors.emeraldBg, colors.emeraldGreen);
        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor("#007958")
          .text("STRONGLY REPORTED BEHAVIOURS", 52, skillBoxY + 8);
        doc
          .font("Helvetica")
          .fontSize(6.5)
          .fillColor("#007958")
          .text("Evidence Source: Self-Reported Behaviour", 52, skillBoxY + 18);

        let strongItemY = skillBoxY + 30;
        for (const str of report.skillBehaviour.strongestIndicators.slice(0, 3)) {
          doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.tealDark).text(`•  ${str.name}`, 54, strongItemY);
          doc
            .font("Helvetica")
            .fontSize(7.5)
            .fillColor(colors.mutedGray)
            .text(str.description || "Consistently demonstrates proactive problem-solving execution.", 66, strongItemY + 11, {
              width: 215,
              height: 30,
              ellipsis: true,
            });
          strongItemY += 46;
        }

        // Right Card: High-Potential Growth Opportunities
        doc.roundedRect(305, skillBoxY, 250, skillBoxH, 6).fillAndStroke(colors.amberBg, colors.amberWarn);
        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor("#B45309")
          .text("EMERGING GROWTH OPPORTUNITIES", 317, skillBoxY + 8);
        doc
          .font("Helvetica")
          .fontSize(6.5)
          .fillColor("#B45309")
          .text("Evidence Source: Self-Reported Behaviour", 317, skillBoxY + 18);

        let growItemY = skillBoxY + 30;
        for (const grw of report.skillBehaviour.developmentOpportunities.slice(0, 3)) {
          doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.tealDark).text(`•  ${grw.name}`, 319, growItemY);
          doc
            .font("Helvetica")
            .fontSize(7.5)
            .fillColor(colors.mutedGray)
            .text(grw.description || "Opportunity to nurture and strengthen through guided practice.", 331, growItemY + 11, {
              width: 215,
              height: 30,
              ellipsis: true,
            });
          growItemY += 46;
        }

        // ========================================================
        // PAGE 3: APTITUDE, FRAMEWORK & FINAL TAKEAWAY
        // ========================================================
        doc.addPage();

        // 1. Top Brand Accent Line
        doc.rect(40, 35, 515, 4).fill(colors.primaryTeal);

        // 2. Section 4: Demonstrated Task Performance & Problem Solving
        doc
          .font("Helvetica-Bold")
          .fontSize(11.5)
          .fillColor(colors.tealDark)
          .text("4. Demonstrated Task Performance & Problem Solving", 40, 48);

        // Current Task Performance Banner
        const aptBannerY = 64;
        const bannerH = 36;
        doc.roundedRect(40, aptBannerY, 515, bannerH, 5).fillAndStroke("#EBF6FB", colors.accentCyan);

        const rawPointsStr =
          report.aptitudeInsights.rawScore !== undefined && report.aptitudeInsights.maxScore !== undefined
            ? ` (${report.aptitudeInsights.rawScore} / ${report.aptitudeInsights.maxScore} scored points)`
            : "";

        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(colors.tealDark)
          .text("CURRENT TASK PERFORMANCE (OBJECTIVE SESSION TASKS):", 52, aptBannerY + 7);

        doc
          .font("Helvetica-Bold")
          .fontSize(9.5)
          .fillColor(colors.accentCyan)
          .text(
            `${report.aptitudeInsights.overallAccuracyPercentage}% of available points${rawPointsStr}`,
            52,
            aptBannerY + 20,
            { width: 495 }
          );

        // Context Note beneath banner
        doc
          .font("Helvetica-Oblique")
          .fontSize(6.5)
          .fillColor(colors.mutedGray)
          .text(
            "* This reflects performance on the objective tasks completed during this assessment session. It is not a fixed measure of intelligence or future potential.",
            40,
            aptBannerY + bannerH + 4,
            { width: 515 }
          );

        // Aptitude Dimensions (2-column stacked layout with full-width bars to avoid text clipping)
        let aptGridY = aptBannerY + bannerH + 16;
        const halfCount = Math.ceil(report.aptitudeInsights.dimensions.length / 2);
        for (let i = 0; i < Math.min(3, halfCount); i++) {
          const leftDim = report.aptitudeInsights.dimensions[i];
          const rightDim = report.aptitudeInsights.dimensions[i + halfCount];

          if (leftDim) {
            const leftPct = Math.round(leftDim.scalePositionPercentage);
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.tealDark).text(leftDim.name, 40, aptGridY, { width: 195, height: 10, ellipsis: true });
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.primaryTeal).text(`${leftPct}%`, 235, aptGridY, { width: 45, align: "right" });
            doc.roundedRect(40, aptGridY + 11, 240, 4, 2).fill(colors.trackBg);
            doc.roundedRect(40, aptGridY + 11, Math.max(4, (leftPct / 100) * 240), 4, 2).fill(colors.primaryTeal);
          }

          if (rightDim) {
            const rightPct = Math.round(rightDim.scalePositionPercentage);
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.tealDark).text(rightDim.name, 315, aptGridY, { width: 195, height: 10, ellipsis: true });
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.primaryTeal).text(`${rightPct}%`, 510, aptGridY, { width: 45, align: "right" });
            doc.roundedRect(315, aptGridY + 11, 240, 4, 2).fill(colors.trackBg);
            doc.roundedRect(315, aptGridY + 11, Math.max(4, (rightPct / 100) * 240), 4, 2).fill(colors.primaryTeal);
          }

          aptGridY += 21;
        }

        // 3. Section 5: Assessment Framework (29-Dimension Construct Model)
        const frameSecY = aptGridY + 6;
        doc
          .font("Helvetica-Bold")
          .fontSize(11.5)
          .fillColor(colors.tealDark)
          .text("5. Assessment Framework (29 Evaluated Dimensions)", 40, frameSecY);

        const frameBoxY = frameSecY + 14;
        const framePillars = [
          { title: "Interest Profile", weight: "25%", count: "6 Dim", color: colors.primaryTeal },
          { title: "Skill Behaviours", weight: "30%", count: "8 Dim", color: colors.emeraldGreen },
          { title: "Cognitive Aptitude", weight: "25%", count: "8 Dim", color: colors.accentCyan },
          { title: "Developmental Habits", weight: "20%", count: "7 Dim", color: colors.amberWarn },
        ];

        let pX = 40;
        for (const p of framePillars) {
          doc.roundedRect(pX, frameBoxY, 122, 42, 5).fillAndStroke(colors.lightBg, colors.cardBorder);
          doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.tealDark).text(p.title, pX + 8, frameBoxY + 6);
          doc.font("Helvetica-Bold").fontSize(10).fillColor(p.color).text(p.weight, pX + 8, frameBoxY + 18);
          doc.font("Helvetica").fontSize(7).fillColor(colors.mutedGray).text(p.count, pX + 75, frameBoxY + 20, { align: "right", width: 40 });
          pX += 131;
        }

        // Model Weight Clarification Note
        doc
          .font("Helvetica-Oblique")
          .fontSize(6.5)
          .fillColor(colors.mutedGray)
          .text(
            "* Note: These percentages represent ME LIFE model weights used in profile synthesis; they are not the student's individual scores.",
            40,
            frameBoxY + 46,
            { width: 515 }
          );

        // 4. Section 6: What This Profile Suggests (Cross-Evidence Synthesis)
        const takeSecY = frameBoxY + 58;
        doc
          .font("Helvetica-Bold")
          .fontSize(11.5)
          .fillColor(colors.tealDark)
          .text("6. What This Profile Suggests (Cross-Evidence Synthesis)", 40, takeSecY);

        const takeBoxY = takeSecY + 14;
        const takeBoxH = 162;
        doc.roundedRect(40, takeBoxY, 515, takeBoxH, 6).fillAndStroke(colors.tealLightBg, "#B2DFDB");

        let curY = takeBoxY + 8;
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(colors.primaryTeal)
          .text("01. Current Alignment & Interests:", 54, curY);
        curY = doc.y + 2;
        doc
          .font("Helvetica")
          .fontSize(7.5)
          .fillColor(colors.tealDark)
          .text(
            `Your present profile suggests alignment with ${report.executiveSummary.archetypeTitle} patterns, reflecting exploratory interest across practical and investigative domains.`,
            54,
            curY,
            { width: 485 }
          );
        curY = doc.y + 6;

        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(colors.primaryTeal)
          .text("02. Current Profile Highlights (Self-Report vs Task Performance):", 54, curY);
        curY = doc.y + 2;
        doc
          .font("Helvetica")
          .fontSize(7.5)
          .fillColor(colors.tealDark)
          .text(
            `You report strong confidence in practical and leadership behaviours (${report.executiveSummary.primaryTraits.join(", ")}), while objective session tasks show emerging foundational performance (${report.aptitudeInsights.overallAccuracyPercentage}%). Hands-on practice and future reassessment will help calibrate these indicators.`,
            54,
            curY,
            { width: 485 }
          );
        curY = doc.y + 6;

        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(colors.primaryTeal)
          .text("03. Actionable Next Steps (Targeted Growth):", 54, curY);
        curY = doc.y + 3;

        for (const sug of (report.developmentalStrengths.growthSuggestions || []).slice(0, 3)) {
          doc.font("Helvetica").fontSize(7.5).fillColor(colors.tealDark).text(`•  ${sug}`, 54, curY, { width: 485, height: 14, ellipsis: true });
          curY += 14;
        }

        // Disclaimer Note
        doc
          .font("Helvetica-Oblique")
          .fontSize(6.5)
          .fillColor(colors.mutedGray)
          .text(
            "* This report provides exploratory guidance for student development, not deterministic career predictions. Use as a starting point for inquiry.",
            54,
            takeBoxY + takeBoxH - 14,
            { width: 485 }
          );

        // ========================================================
        // GLOBAL HEADERS & FOOTERS ACROSS ALL PAGES
        // ========================================================
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
          doc.switchToPage(i);
          const prevBottom = doc.page.margins.bottom;
          doc.page.margins.bottom = 0;

          // Subtle footer separator line
          doc.rect(40, 795, 515, 0.5).fill(colors.cardBorder);

          doc
            .font("Helvetica")
            .fontSize(7)
            .fillColor(colors.mutedGray)
            .text(
              `3G MeLife • Skill Finder  •  ${t.confidentialNotice || "CONFIDENTIAL — Intended for the student, parent/guardian, and authorized educational counsellor."}  •  Report Ref: ${report.reportId.slice(0, 8)}`,
              40,
              802,
              { width: 420, lineBreak: false }
            );

          doc
            .font("Helvetica-Bold")
            .fontSize(7.5)
            .fillColor(colors.tealDark)
            .text(`Page ${i + 1} of ${range.count}`, 465, 802, { width: 90, align: "right", lineBreak: false });

          doc.page.margins.bottom = prevBottom;
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const reportPdfGenerator = new ReportPdfGenerator();
