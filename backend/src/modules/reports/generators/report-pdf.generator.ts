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
        doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.mutedGray).text("Primary Cognitive Drivers:", 54, heroBoxY + 180);
        let traitX = 185;
        for (const trait of report.executiveSummary.primaryTraits.slice(0, 3)) {
          doc.roundedRect(traitX, heroBoxY + 175, 105, 18, 4).fillAndStroke(colors.white, colors.primaryTeal);
          doc
            .font("Helvetica-Bold")
            .fontSize(7.5)
            .fillColor(colors.primaryTeal)
            .text(trait, traitX + 2, heroBoxY + 180, { width: 101, align: "center" });
          traitX += 114;
        }

        // 5. Executive Takeaway & Foundation Note
        const noteY = heroBoxY + heroBoxH + 16;
        doc.roundedRect(40, noteY, 515, 78, 6).fillAndStroke(colors.lightBg, colors.cardBorder);

        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor(colors.tealDark)
          .text("Key Educational & Exploratory Guidance Note", 54, noteY + 12);

        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(colors.mutedGray)
          .text(
            "This assessment represents a foundational exploratory baseline. The student demonstrates clear natural inquisitiveness and cognitive potential. Optimal learning combines academic theory with practical, self-directed experiential exploration.",
            54,
            noteY + 28,
            { width: 485, lineGap: 2.5 }
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
        let gridY = 80;
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

        // Dominant & Supporting Patterns Sub-block
        const patternY = gridY + 4;
        const sortedRiasec = [...riasecGridData].sort((a, b) => b.score - a.score);
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

        // Divider
        doc.rect(40, patternY + 42, 515, 0.8).fill(colors.cardBorder);

        // 3. Section 3: Behavioral Skill Instincts & Growth Opportunities
        const skillSecY = patternY + 52;
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor(colors.tealDark)
          .text("3. Top Skill Strengths & Emerging Growth Opportunities", 40, skillSecY);

        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(colors.mutedGray)
          .text(
            report.skillBehaviour.summary || "Evaluates instinctive problem-solving and collaboration habits.",
            40,
            skillSecY + 16,
            { width: 515 }
          );

        // Side-by-Side Cards
        const skillBoxY = skillSecY + 30;
        const skillBoxH = 175;

        // Left Card: Top Skill Strengths
        doc.roundedRect(40, skillBoxY, 250, skillBoxH, 6).fillAndStroke(colors.emeraldBg, colors.emeraldGreen);
        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor("#007958")
          .text("TOP SKILL STRENGTHS", 52, skillBoxY + 10);

        let strongItemY = skillBoxY + 28;
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
          .text("EMERGING GROWTH OPPORTUNITIES", 317, skillBoxY + 10);

        let growItemY = skillBoxY + 28;
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

        // 2. Section 4: Demonstrated Cognitive Aptitude
        doc
          .font("Helvetica-Bold")
          .fontSize(11.5)
          .fillColor(colors.tealDark)
          .text("4. Demonstrated Cognitive Aptitude & Problem Solving", 40, 48);

        // Overall Accuracy Badge
        const aptBannerY = 64;
        doc.roundedRect(40, aptBannerY, 515, 24, 5).fillAndStroke("#EBF6FB", colors.accentCyan);
        doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.tealDark).text("Overall Problem-Solving Accuracy Rate:", 54, aptBannerY + 7);
        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor(colors.accentCyan)
          .text(`${report.aptitudeInsights.overallAccuracyPercentage}%`, 480, aptBannerY + 6);

        // Aptitude Dimensions (2-column compact bars)
        let aptGridY = aptBannerY + 30;
        const halfCount = Math.ceil(report.aptitudeInsights.dimensions.length / 2);
        for (let i = 0; i < Math.min(3, halfCount); i++) {
          const leftDim = report.aptitudeInsights.dimensions[i];
          const rightDim = report.aptitudeInsights.dimensions[i + halfCount];

          if (leftDim) {
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.tealDark).text(leftDim.name, 40, aptGridY);
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.primaryTeal).text(`${Math.round(leftDim.scalePositionPercentage)}%`, 245, aptGridY);
            doc.roundedRect(135, aptGridY + 1, 95, 5, 2.5).fill(colors.trackBg);
            doc.roundedRect(135, aptGridY + 1, Math.max(4, (leftDim.scalePositionPercentage / 100) * 95), 5, 2.5).fill(colors.primaryTeal);
          }

          if (rightDim) {
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.tealDark).text(rightDim.name, 305, aptGridY);
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.primaryTeal).text(`${Math.round(rightDim.scalePositionPercentage)}%`, 515, aptGridY);
            doc.roundedRect(405, aptGridY + 1, 95, 5, 2.5).fill(colors.trackBg);
            doc.roundedRect(405, aptGridY + 1, Math.max(4, (rightDim.scalePositionPercentage / 100) * 95), 5, 2.5).fill(colors.primaryTeal);
          }

          aptGridY += 15;
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

        // 4. Section 6: What This Profile Suggests (Clear Takeaway)
        const takeSecY = frameBoxY + 50;
        doc
          .font("Helvetica-Bold")
          .fontSize(11.5)
          .fillColor(colors.tealDark)
          .text("6. What This Profile Suggests", 40, takeSecY);

        const takeBoxY = takeSecY + 14;
        const takeBoxH = 150;
        doc.roundedRect(40, takeBoxY, 515, takeBoxH, 6).fillAndStroke(colors.tealLightBg, "#B2DFDB");

        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor(colors.primaryTeal)
          .text("01. Current Alignment:", 54, takeBoxY + 10);
        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(colors.tealDark)
          .text(
            `Your current profile indicates strong natural resonance with ${report.executiveSummary.archetypeTitle} patterns, especially across hands-on creation and analytical inquiry.`,
            54,
            takeBoxY + 22,
            { width: 485 }
          );

        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor(colors.primaryTeal)
          .text("02. Strongest Vectors:", 54, takeBoxY + 44);
        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(colors.tealDark)
          .text(
            `Your highest performing dimensions show standout capability in ${report.executiveSummary.primaryTraits.join(", ")}, providing a solid foundation for multidisciplinary problem solving.`,
            54,
            takeBoxY + 56,
            { width: 485 }
          );

        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor(colors.primaryTeal)
          .text("03. Actionable Next Steps:", 54, takeBoxY + 78);

        let sugY = takeBoxY + 90;
        for (const sug of (report.developmentalStrengths.growthSuggestions || []).slice(0, 3)) {
          doc.font("Helvetica").fontSize(7.5).fillColor(colors.tealDark).text(`•  ${sug}`, 54, sugY, { width: 485, height: 14, ellipsis: true });
          sugY += 15;
        }

        // Disclaimer Note
        doc
          .font("Helvetica-Oblique")
          .fontSize(7)
          .fillColor(colors.mutedGray)
          .text(
            "* This report provides exploratory guidance for student development, not deterministic career predictions. Use as a starting point for inquiry.",
            54,
            takeBoxY + 135,
            { width: 485 }
          );

        // ========================================================
        // GLOBAL HEADERS & FOOTERS ACROSS ALL PAGES
        // ========================================================
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
          doc.switchToPage(i);

          // Subtle footer separator line
          doc.rect(40, 795, 515, 0.5).fill(colors.cardBorder);

          doc
            .font("Helvetica")
            .fontSize(7)
            .fillColor(colors.mutedGray)
            .text(
              `3G MeLife • Skill Finder  •  ${t.confidentialNotice || "Confidential Student Report"}  •  Report Ref: ${report.reportId.slice(0, 8)}`,
              40,
              802,
              { width: 420, lineBreak: false }
            );

          doc
            .font("Helvetica-Bold")
            .fontSize(7.5)
            .fillColor(colors.tealDark)
            .text(`Page ${i + 1} of ${range.count}`, 465, 802, { width: 90, align: "right", lineBreak: false });
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const reportPdfGenerator = new ReportPdfGenerator();
