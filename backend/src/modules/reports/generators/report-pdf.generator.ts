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
          .text("Skill Finder Psychometric Report", 40, 48);

        doc
          .font("Helvetica")
          .fontSize(8.5)
          .fillColor(colors.primaryTeal)
          .text("Multidimensional Construct Analytics & Learning Orientation", 40, 70);

        // 3. Student Profile Card
        const profY = 88;
        doc.roundedRect(40, profY, 515, 84, 6).fillAndStroke(colors.lightBg, colors.cardBorder);

        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(colors.mutedGray)
          .text("STUDENT PARTICIPANT PROFILE", 54, profY + 10);

        // Left Column (Student metadata)
        doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.mutedGray).text("Student Name:", 54, profY + 28);
        doc.font("Helvetica-Bold").fontSize(10).fillColor(colors.tealDark).text(report.studentProfile.studentName, 140, profY + 27);

        doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.mutedGray).text("Age / Grade:", 54, profY + 45);
        doc
          .font("Helvetica")
          .fontSize(8.5)
          .fillColor(colors.tealDark)
          .text(
            `${report.studentProfile.age ? report.studentProfile.age + " yrs" : "N/A"}  •  ${report.studentProfile.educationStage}`,
            140,
            profY + 45
          );

        doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.mutedGray).text("School / Academy:", 54, profY + 62);
        doc
          .font("Helvetica")
          .fontSize(8.5)
          .fillColor(colors.tealDark)
          .text(report.studentProfile.schoolName || "3G MeLife Learning Academy", 140, profY + 62);

        // Right Column (Assessment metadata)
        doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.mutedGray).text("Assessment:", 330, profY + 28);
        doc
          .font("Helvetica")
          .fontSize(8.5)
          .fillColor(colors.tealDark)
          .text(report.studentProfile.versionName || "Skill Finder — Student Edition", 415, profY + 28);

        doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.mutedGray).text("Evaluation Date:", 330, profY + 45);
        const evalDateStr = report.studentProfile.completedAt
          ? new Date(report.studentProfile.completedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        doc.font("Helvetica").fontSize(8.5).fillColor(colors.tealDark).text(evalDateStr, 415, profY + 45);

        doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.mutedGray).text("Report ID:", 330, profY + 62);
        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(colors.primaryTeal)
          .text(report.reportId.slice(0, 18) + "...", 415, profY + 62);

        // 4. Section 1: Executive Learning Profile Summary
        const execY = 186;
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor(colors.tealDark)
          .text("1. Executive Learning Profile Summary", 40, execY);

        // Hero Box
        const heroBoxY = execY + 16;
        const heroBoxH = 210;
        doc.roundedRect(40, heroBoxY, 515, heroBoxH, 8).fillAndStroke(colors.tealLightBg, "#B2DFDB");

        // Archetype Pill
        doc.roundedRect(54, heroBoxY + 14, 190, 24, 6).fill(colors.primaryTeal);
        doc
          .font("Helvetica-Bold")
          .fontSize(10.5)
          .fillColor(colors.white)
          .text(report.executiveSummary.archetypeTitle, 64, heroBoxY + 20);

        // Reliability Note
        if (report.executiveSummary.reliabilityNote) {
          doc.roundedRect(360, heroBoxY + 14, 180, 22, 5).fillAndStroke(colors.white, "#80CBC4");
          doc
            .font("Helvetica-Bold")
            .fontSize(7.5)
            .fillColor(colors.primaryTeal)
            .text(report.executiveSummary.reliabilityNote, 365, heroBoxY + 20, { width: 170, align: "center" });
        }

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

        // Exploratory Orientation Sub-box
        const orientBoxY = heroBoxY + 130;
        doc.roundedRect(54, orientBoxY, 487, 38, 5).fillAndStroke(colors.white, "#B2DFDB");
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(colors.primaryTeal)
          .text("Exploratory Orientation: ", 64, orientBoxY + 8, { continued: true })
          .font("Helvetica")
          .fillColor(colors.tealDark)
          .text(report.executiveSummary.explorationFraming, { width: 465, lineGap: 2 });

        // Primary Traits Pills
        doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.mutedGray).text("Primary Cognitive Traits:", 54, heroBoxY + 180);
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
        // PAGE 2: RIASEC INTERESTS & BEHAVIORAL SKILL INSTINCTS
        // ========================================================
        doc.addPage();

        // 1. Top Brand Accent Line
        doc.rect(40, 35, 515, 4).fill(colors.primaryTeal);

        // 2. Section 2: Vocational & Exploratory Interest Profile (Holland RIASEC)
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor(colors.tealDark)
          .text("2. Vocational & Exploratory Interest Profile (RIASEC)", 40, 48);

        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(colors.mutedGray)
          .text(
            report.interestProfile.summary || "Maps intrinsic occupational curiosity across 6 Holland RIASEC interest domains.",
            40,
            64,
            { width: 515 }
          );

        // Top 3 Clusters Cards
        const clusterCardY = 80;
        let clusterX = 40;
        for (let i = 0; i < Math.min(3, report.interestProfile.topClusters.length); i++) {
          const cluster = report.interestProfile.topClusters[i];
          doc.roundedRect(clusterX, clusterCardY, 165, 68, 6).fillAndStroke(colors.lightBg, colors.cardBorder);

          doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.primaryTeal).text(`TOP #${i + 1} AFFINITY`, clusterX + 10, clusterCardY + 10);
          doc.font("Helvetica-Bold").fontSize(11).fillColor(colors.tealDark).text(`${cluster.percentage}%`, clusterX + 120, clusterCardY + 8);
          doc.font("Helvetica-Bold").fontSize(9.5).fillColor(colors.tealDark).text(cluster.name, clusterX + 10, clusterCardY + 26);
          doc
            .font("Helvetica")
            .fontSize(7.5)
            .fillColor(colors.mutedGray)
            .text(cluster.clusterTitle, clusterX + 10, clusterCardY + 40, { width: 145, height: 22, ellipsis: true });

          clusterX += 175;
        }

        // 6 Holland Interest Domain Progress Bars
        let barY = clusterCardY + 76;
        for (const dim of report.interestProfile.dimensions.slice(0, 6)) {
          doc.font("Helvetica-Bold").fontSize(8).fillColor(colors.tealDark).text(dim.name, 40, barY + 1);
          doc
            .font("Helvetica-Bold")
            .fontSize(8)
            .fillColor(colors.primaryTeal)
            .text(`${Math.round(dim.scalePositionPercentage)}%`, 515, barY + 1, { align: "right" });

          // Track background
          doc.roundedRect(165, barY + 2, 310, 7, 3).fill(colors.trackBg);
          // Fill bar
          const fillW = Math.max(6, Math.min(310, (dim.scalePositionPercentage / 100) * 310));
          doc.roundedRect(165, barY + 2, fillW, 7, 3).fill(colors.primaryTeal);

          barY += 17;
        }

        // Divider
        doc.rect(40, barY + 8, 515, 0.8).fill(colors.cardBorder);

        // 3. Section 3: Behavioral Skill Instincts & Growth Opportunities
        const skillSecY = barY + 18;
        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .fillColor(colors.tealDark)
          .text("3. Behavioral Skill Instincts & Growth Opportunities", 40, skillSecY);

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
        const skillBoxY = skillSecY + 32;
        const skillBoxH = 175;

        // Left Card: Strongest Instincts
        doc.roundedRect(40, skillBoxY, 250, skillBoxH, 6).fillAndStroke(colors.emeraldBg, colors.emeraldGreen);
        doc
          .font("Helvetica-Bold")
          .fontSize(9)
          .fillColor("#007958")
          .text("★  STRONGEST BEHAVIOURAL INSTINCTS", 52, skillBoxY + 10);

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
          .fontSize(9)
          .fillColor("#B45309")
          .text("▲  HIGH-POTENTIAL GROWTH AREAS", 317, skillBoxY + 10);

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
        // PAGE 3: COGNITIVE APTITUDE, EXPLORATION & PARENT GUIDANCE
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
        doc.roundedRect(40, aptBannerY, 515, 26, 5).fillAndStroke("#EBF6FB", colors.accentCyan);
        doc.font("Helvetica-Bold").fontSize(8.5).fillColor(colors.tealDark).text("Overall Problem-Solving Accuracy Rate:", 54, aptBannerY + 8);
        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor(colors.accentCyan)
          .text(`${report.aptitudeInsights.overallAccuracyPercentage}%`, 480, aptBannerY + 7);

        // Aptitude Dimensions (2-column compact bars)
        let aptGridY = aptBannerY + 34;
        const halfCount = Math.ceil(report.aptitudeInsights.dimensions.length / 2);
        for (let i = 0; i < Math.min(3, halfCount); i++) {
          const leftDim = report.aptitudeInsights.dimensions[i];
          const rightDim = report.aptitudeInsights.dimensions[i + halfCount];

          if (leftDim) {
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.tealDark).text(leftDim.name, 40, aptGridY);
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.primaryTeal).text(`${Math.round(leftDim.scalePositionPercentage)}%`, 245, aptGridY);
            doc.roundedRect(135, aptGridY + 1, 95, 6, 3).fill(colors.trackBg);
            doc.roundedRect(135, aptGridY + 1, Math.max(4, (leftDim.scalePositionPercentage / 100) * 95), 6, 3).fill(colors.primaryTeal);
          }

          if (rightDim) {
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.tealDark).text(rightDim.name, 305, aptGridY);
            doc.font("Helvetica-Bold").fontSize(7.5).fillColor(colors.primaryTeal).text(`${Math.round(rightDim.scalePositionPercentage)}%`, 515, aptGridY);
            doc.roundedRect(405, aptGridY + 1, 95, 6, 3).fill(colors.trackBg);
            doc.roundedRect(405, aptGridY + 1, Math.max(4, (rightDim.scalePositionPercentage / 100) * 95), 6, 3).fill(colors.primaryTeal);
          }

          aptGridY += 16;
        }

        // 3. Section 5: Recommended Exploration Pathways
        const expSecY = aptGridY + 8;
        doc
          .font("Helvetica-Bold")
          .fontSize(11.5)
          .fillColor(colors.tealDark)
          .text("5. Recommended Academic & Career Exploration Pathways", 40, expSecY);

        let expCardY = expSecY + 16;
        for (const cl of report.explorationAreas.clusters.slice(0, 2)) {
          doc.roundedRect(40, expCardY, 515, 68, 6).fillAndStroke(colors.lightBg, colors.cardBorder);

          doc.font("Helvetica-Bold").fontSize(9.5).fillColor(colors.primaryTeal).text(cl.clusterTitle, 52, expCardY + 8);
          doc
            .font("Helvetica")
            .fontSize(7.5)
            .fillColor(colors.tealDark)
            .text(cl.description, 52, expCardY + 22, { width: 485, height: 20, ellipsis: true });

          doc.font("Helvetica-Bold").fontSize(7).fillColor(colors.mutedGray).text("Focus Areas:", 52, expCardY + 46);
          doc
            .font("Helvetica")
            .fontSize(7.5)
            .fillColor(colors.tealDark)
            .text(cl.sampleFocusAreas.slice(0, 4).join("   •   "), 110, expCardY + 46, { width: 420 });

          expCardY += 76;
        }

        // 4. Section 6: Parent & Educator Guidance Framework
        const parSecY = expCardY + 6;
        doc
          .font("Helvetica-Bold")
          .fontSize(11.5)
          .fillColor(colors.tealDark)
          .text("6. Parent & Educator Guidance Framework", 40, parSecY);

        // Nurturing Mindset Card
        const nurtY = parSecY + 16;
        doc.roundedRect(40, nurtY, 515, 34, 5).fillAndStroke("#FAF6EC", "#E5C158");
        doc
          .font("Helvetica-Oblique")
          .fontSize(7.5)
          .fillColor(colors.tealDark)
          .text(report.parentGuidance.nurturingMindsetSummary, 52, nurtY + 7, { width: 485, lineGap: 1.5, height: 22, ellipsis: true });

        // DOs vs DON'Ts Side-by-Side Cards
        const guideBoxY = nurtY + 42;
        const guideBoxH = 100;

        // DOs
        doc.roundedRect(40, guideBoxY, 250, guideBoxH, 6).fillAndStroke(colors.emeraldBg, colors.emeraldGreen);
        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor("#007958")
          .text("✔  " + (t.labels.dosHeader || "Recommended Nurturing Practices (DOs)"), 50, guideBoxY + 8);

        let doY = guideBoxY + 24;
        for (const d of report.parentGuidance.dos.slice(0, 3)) {
          doc.font("Helvetica").fontSize(7.5).fillColor(colors.tealDark).text(`•  ${d}`, 50, doY, { width: 230, height: 22, ellipsis: true });
          doY += 24;
        }

        // DON'Ts
        doc.roundedRect(305, guideBoxY, 250, guideBoxH, 6).fillAndStroke(colors.roseBg, colors.roseRed);
        doc
          .font("Helvetica-Bold")
          .fontSize(8.5)
          .fillColor("#DC2626")
          .text("✖  " + (t.labels.dontsHeader || "Practices to Avoid (DON'Ts)"), 315, guideBoxY + 8);

        let dontY = guideBoxY + 24;
        for (const dn of report.parentGuidance.donts.slice(0, 3)) {
          doc.font("Helvetica").fontSize(7.5).fillColor(colors.tealDark).text(`•  ${dn}`, 315, dontY, { width: 230, height: 22, ellipsis: true });
          dontY += 24;
        }

        // Empathetic Conversation Starters Box
        const discBoxY = guideBoxY + guideBoxH + 10;
        doc.roundedRect(40, discBoxY, 515, 42, 5).fillAndStroke("#EBF6FB", colors.accentCyan);
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(colors.primaryTeal)
          .text("💬 Empathetic Conversation Starters:", 52, discBoxY + 6);

        let discY = discBoxY + 19;
        for (const disc of report.parentGuidance.recommendedDiscussions.slice(0, 2)) {
          doc.font("Helvetica-Oblique").fontSize(7.5).fillColor(colors.tealDark).text(`"${disc}"`, 52, discY, { width: 485, height: 10, ellipsis: true });
          discY += 11;
        }

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
              `3G MeLife Skill Finder  •  Report Ref: ${report.reportId.slice(0, 8)}  •  ${t.confidentialNotice}`,
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
