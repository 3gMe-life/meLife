/**
 * 3G MeLife Psychometric Report PDF Generator
 * Renders vector PDF reports using PDFKit.
 */

import PDFDocument from "pdfkit";
import { SkillFinderReportDTO } from "../report.types";
import { getReportTranslation } from "../i18n/report.translations";

export class ReportPdfGenerator {
  /**
   * Generates a multi-page PDF document buffer from a SkillFinderReportDTO.
   */
  async generatePdf(report: SkillFinderReportDTO): Promise<Buffer> {
    const t = getReportTranslation(report.language || "en");

    return new Promise<Buffer>((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: "A4",
          margin: 40,
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

        // Colors
        const primaryTeal = "#008F83";
        const darkTeal = "#172B2A";
        const accentCyan = "#00B8D4";
        const emeraldGreen = "#00C896";
        const mutedGray = "#526866";
        const lightBg = "#F4F8F7";
        const cardBorder = "#E3ECEA";

        // ==========================================
        // PAGE 1: COVER & EXECUTIVE LEARNING PROFILE
        // ==========================================

        // Header Brand Bar
        doc.rect(40, 40, 515, 6).fill(primaryTeal);

        // Header Title
        doc.moveDown(0.8);
        doc
          .font("Helvetica-Bold")
          .fontSize(20)
          .fillColor(darkTeal)
          .text(t.reportTitle, 40, 56);

        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor(primaryTeal)
          .text(t.reportSubtitle, 40, 82);

        // Student Profile Header Card
        const profY = 104;
        doc.roundedRect(40, profY, 515, 95, 8).fillAndStroke(lightBg, cardBorder);

        doc
          .font("Helvetica-Bold")
          .fontSize(11)
          .fillColor(darkTeal)
          .text("STUDENT PARTICIPANT PROFILE", 55, profY + 12);

        // Grid of details
        doc.font("Helvetica-Bold").fontSize(9).fillColor(mutedGray).text("Student Name:", 55, profY + 32);
        doc.font("Helvetica-Bold").fontSize(10).fillColor(darkTeal).text(report.studentProfile.studentName, 145, profY + 31);

        doc.font("Helvetica-Bold").fontSize(9).fillColor(mutedGray).text("Age / Grade:", 55, profY + 50);
        doc.font("Helvetica").fontSize(9).fillColor(darkTeal).text(`${report.studentProfile.age ? report.studentProfile.age + " yrs" : "N/A"}  •  ${report.studentProfile.educationStage}`, 145, profY + 50);

        doc.font("Helvetica-Bold").fontSize(9).fillColor(mutedGray).text("School / Institution:", 55, profY + 68);
        doc.font("Helvetica").fontSize(9).fillColor(darkTeal).text(report.studentProfile.schoolName, 145, profY + 68);

        // Right column
        doc.font("Helvetica-Bold").fontSize(9).fillColor(mutedGray).text("Assessment:", 330, profY + 32);
        doc.font("Helvetica").fontSize(9).fillColor(darkTeal).text(report.studentProfile.assessmentName, 410, profY + 32);

        doc.font("Helvetica-Bold").fontSize(9).fillColor(mutedGray).text("Evaluation Date:", 330, profY + 50);
        doc.font("Helvetica").fontSize(9).fillColor(darkTeal).text(new Date(report.studentProfile.completedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }), 410, profY + 50);

        doc.font("Helvetica-Bold").fontSize(9).fillColor(mutedGray).text("Report ID:", 330, profY + 68);
        doc.font("Helvetica").fontSize(8).fillColor(primaryTeal).text(report.reportId.slice(0, 16) + "...", 410, profY + 68);

        // Section 1: Executive Learning Profile Summary
        const execY = 215;
        doc
          .font("Helvetica-Bold")
          .fontSize(13)
          .fillColor(darkTeal)
          .text(t.sections.profileSummary, 40, execY);

        // Executive Hero Box
        doc.roundedRect(40, execY + 20, 515, 185, 8).fillAndStroke("#E6F7F5", primaryTeal);

        // Archetype Badge
        doc.roundedRect(55, execY + 35, 200, 26, 6).fill(primaryTeal);
        doc.font("Helvetica-Bold").fontSize(12).fillColor("#FFFFFF").text(report.executiveSummary.archetypeTitle, 65, execY + 42);

        doc
          .font("Helvetica-Oblique")
          .fontSize(10)
          .fillColor(darkTeal)
          .text(`"${report.executiveSummary.tagline}"`, 265, execY + 42, { width: 275 });

        // Strength Summary
        doc
          .font("Helvetica")
          .fontSize(9.5)
          .fillColor(darkTeal)
          .text(report.executiveSummary.strengthSummary, 55, execY + 75, { width: 485, lineGap: 3 });

        // Exploration Framing
        doc
          .font("Helvetica-Bold")
          .fontSize(9.5)
          .fillColor(primaryTeal)
          .text("Exploratory Orientation: ", 55, execY + 115, { continued: true })
          .font("Helvetica")
          .fillColor(darkTeal)
          .text(report.executiveSummary.explorationFraming, { width: 485, lineGap: 2 });

        // Primary Traits Pills
        doc.font("Helvetica-Bold").fontSize(8.5).fillColor(mutedGray).text("Primary Cognitive & Learning Traits:", 55, execY + 155);
        let traitX = 230;
        for (const trait of report.executiveSummary.primaryTraits.slice(0, 3)) {
          doc.roundedRect(traitX, execY + 150, 95, 18, 4).fillAndStroke("#FFFFFF", primaryTeal);
          doc.font("Helvetica-Bold").fontSize(8).fillColor(primaryTeal).text(trait, traitX + 4, execY + 155, { width: 87, align: "center" });
          traitX += 102;
        }

        // Section 2 Preview: Interest Discovery
        const riasecY = 420;
        doc
          .font("Helvetica-Bold")
          .fontSize(13)
          .fillColor(darkTeal)
          .text(t.sections.interestProfile, 40, riasecY);

        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor(mutedGray)
          .text("Evaluates Holland RIASEC interest domains to map intrinsic curiosity and vocational affinity.", 40, riasecY + 18);

        // Top 3 Clusters Cards
        let clusterX = 40;
        for (let i = 0; i < Math.min(3, report.interestProfile.topClusters.length); i++) {
          const cluster = report.interestProfile.topClusters[i];
          doc.roundedRect(clusterX, riasecY + 36, 165, 80, 6).fillAndStroke(lightBg, cardBorder);

          doc.font("Helvetica-Bold").fontSize(8).fillColor(primaryTeal).text(`TOP #${i + 1} AFFINITY`, clusterX + 10, riasecY + 46);
          doc.font("Helvetica-Bold").fontSize(12).fillColor(darkTeal).text(`${cluster.percentage}%`, clusterX + 115, riasecY + 44);
          doc.font("Helvetica-Bold").fontSize(11).fillColor(darkTeal).text(cluster.name, clusterX + 10, riasecY + 62);
          doc.font("Helvetica").fontSize(8).fillColor(mutedGray).text(cluster.clusterTitle, clusterX + 10, riasecY + 78, { width: 145 });

          clusterX += 175;
        }

        // Horizontal Interest Domain Bars
        let barY = riasecY + 128;
        for (const dim of report.interestProfile.dimensions) {
          doc.font("Helvetica-Bold").fontSize(9).fillColor(darkTeal).text(dim.name, 40, barY);
          doc.font("Helvetica-Bold").fontSize(9).fillColor(primaryTeal).text(`${Math.round(dim.scalePositionPercentage)}%`, 495, barY, { align: "right" });

          // Background track
          doc.roundedRect(155, barY + 1, 320, 9, 4).fill("#E8ECEB");
          // Fill bar
          const fillWidth = Math.max(8, Math.min(320, (dim.scalePositionPercentage / 100) * 320));
          doc.roundedRect(155, barY + 1, fillWidth, 9, 4).fill(primaryTeal);

          barY += 21;
        }

        // ==========================================
        // PAGE 2: SKILLS & COGNITIVE APTITUDE
        // ==========================================
        doc.addPage();

        // Header Bar
        doc.rect(40, 40, 515, 4).fill(accentCyan);
        doc.font("Helvetica-Bold").fontSize(14).fillColor(darkTeal).text(t.sections.skillBehaviour, 40, 54);
        doc.font("Helvetica").fontSize(8.5).fillColor(mutedGray).text(report.skillBehaviour.summary, 40, 72);

        // Strongest vs Growth side-by-side
        const skillY = 90;
        // Strongest Box
        doc.roundedRect(40, skillY, 250, 165, 6).fillAndStroke("#E8F8F5", emeraldGreen);
        doc.font("Helvetica-Bold").fontSize(10).fillColor("#008F6B").text("★  STRONGEST BEHAVIOURAL INSTINCTS", 52, skillY + 12);

        let strongY = skillY + 34;
        for (const str of report.skillBehaviour.strongestIndicators.slice(0, 3)) {
          doc.font("Helvetica-Bold").fontSize(9.5).fillColor(darkTeal).text(`•  ${str.name}`, 55, strongY);
          doc.font("Helvetica").fontSize(8).fillColor(mutedGray).text(str.description || "Consistently demonstrates strong behavioral aptitude.", 67, strongY + 13, { width: 215 });
          strongY += 40;
        }

        // Growth Box
        doc.roundedRect(305, skillY, 250, 165, 6).fillAndStroke("#FDF8E8", "#D4A017");
        doc.font("Helvetica-Bold").fontSize(10).fillColor("#996B00").text("▲  HIGH-POTENTIAL GROWTH AREAS", 317, skillY + 12);

        let growY = skillY + 34;
        for (const grw of report.skillBehaviour.developmentOpportunities.slice(0, 2)) {
          doc.font("Helvetica-Bold").fontSize(9.5).fillColor(darkTeal).text(`•  ${grw.name}`, 320, growY);
          doc.font("Helvetica").fontSize(8).fillColor(mutedGray).text(grw.description || "Opportunity to nurture and strengthen through practice.", 332, growY + 13, { width: 215 });
          growY += 40;
        }

        // Section 4: Demonstrated Cognitive Aptitude
        const aptY = 275;
        doc.font("Helvetica-Bold").fontSize(14).fillColor(darkTeal).text(t.sections.aptitudeInsights, 40, aptY);
        doc.font("Helvetica").fontSize(8.5).fillColor(mutedGray).text(report.aptitudeInsights.summary, 40, aptY + 18);

        // Overall Accuracy Badge
        doc.roundedRect(40, aptY + 34, 515, 34, 6).fillAndStroke("#EBF6FB", accentCyan);
        doc.font("Helvetica-Bold").fontSize(9.5).fillColor(darkTeal).text("Demonstrated Problem-Solving Task Accuracy:", 55, aptY + 45);
        doc.font("Helvetica-Bold").fontSize(12).fillColor(accentCyan).text(`${report.aptitudeInsights.overallAccuracyPercentage}%`, 480, aptY + 44);

        // Aptitude Dimensions 2-column Grid
        let aptGridY = aptY + 78;
        const halfCount = Math.ceil(report.aptitudeInsights.dimensions.length / 2);
        for (let i = 0; i < halfCount; i++) {
          const leftDim = report.aptitudeInsights.dimensions[i];
          const rightDim = report.aptitudeInsights.dimensions[i + halfCount];

          if (leftDim) {
            doc.font("Helvetica-Bold").fontSize(8.5).fillColor(darkTeal).text(leftDim.name, 40, aptGridY);
            doc.font("Helvetica-Bold").fontSize(8.5).fillColor(primaryTeal).text(`${Math.round(leftDim.scalePositionPercentage)}%`, 250, aptGridY);
            doc.roundedRect(140, aptGridY + 1, 100, 7, 3).fill("#E8ECEB");
            doc.roundedRect(140, aptGridY + 1, Math.max(5, (leftDim.scalePositionPercentage / 100) * 100), 7, 3).fill(primaryTeal);
          }

          if (rightDim) {
            doc.font("Helvetica-Bold").fontSize(8.5).fillColor(darkTeal).text(rightDim.name, 305, aptGridY);
            doc.font("Helvetica-Bold").fontSize(8.5).fillColor(primaryTeal).text(`${Math.round(rightDim.scalePositionPercentage)}%`, 515, aptGridY);
            doc.roundedRect(405, aptGridY + 1, 100, 7, 3).fill("#E8ECEB");
            doc.roundedRect(405, aptGridY + 1, Math.max(5, (rightDim.scalePositionPercentage / 100) * 100), 7, 3).fill(primaryTeal);
          }

          aptGridY += 20;
        }

        // Section 5: Developmental Strengths & Learning Habits
        const devY = 490;
        doc.font("Helvetica-Bold").fontSize(14).fillColor(darkTeal).text(t.sections.developmentalStrengths, 40, devY);
        doc.font("Helvetica").fontSize(8.5).fillColor(mutedGray).text(report.developmentalStrengths.learningHabitsSummary, 40, devY + 18);

        // Learning Habits list
        let habY = devY + 36;
        for (const sug of report.developmentalStrengths.growthSuggestions.slice(0, 3)) {
          doc.roundedRect(40, habY, 515, 34, 4).fillAndStroke(lightBg, cardBorder);
          doc.font("Helvetica-Bold").fontSize(9).fillColor(primaryTeal).text("✔", 52, habY + 11);
          doc.font("Helvetica").fontSize(8.5).fillColor(darkTeal).text(sug, 70, habY + 10, { width: 470, lineGap: 2 });
          habY += 40;
        }

        // ==========================================
        // PAGE 3: EXPLORATION PATHWAYS & PARENT GUIDANCE
        // ==========================================
        doc.addPage();

        // Header Bar
        doc.rect(40, 40, 515, 4).fill(emeraldGreen);
        doc.font("Helvetica-Bold").fontSize(14).fillColor(darkTeal).text(t.sections.explorationAreas, 40, 54);
        doc.font("Helvetica-Oblique").fontSize(8).fillColor(mutedGray).text(report.explorationAreas.framingDisclaimer, 40, 72, { width: 515 });

        // Exploration Pathway Cards
        let expY = 92;
        for (const cl of report.explorationAreas.clusters.slice(0, 2)) {
          doc.roundedRect(40, expY, 515, 95, 6).fillAndStroke(lightBg, cardBorder);

          doc.font("Helvetica-Bold").fontSize(11).fillColor(primaryTeal).text(cl.clusterTitle, 55, expY + 12);
          doc.font("Helvetica").fontSize(8.5).fillColor(darkTeal).text(cl.description, 55, expY + 28, { width: 485 });

          doc.font("Helvetica-Bold").fontSize(8).fillColor(mutedGray).text("Sample Focus Areas:", 55, expY + 54);
          doc.font("Helvetica").fontSize(8).fillColor(darkTeal).text(cl.sampleFocusAreas.slice(0, 4).join("  •  "), 155, expY + 54);

          doc.font("Helvetica-Bold").fontSize(8).fillColor(mutedGray).text("Suggested Projects:", 55, expY + 70);
          doc.font("Helvetica").fontSize(8).fillColor(darkTeal).text(cl.suggestedProjectsAndActivities.slice(0, 2).join("  •  "), 155, expY + 70);

          expY += 105;
        }

        // Section 7: Parent & Educator Guidance
        const parY = expY + 10;
        doc.font("Helvetica-Bold").fontSize(14).fillColor(darkTeal).text(t.sections.parentGuidance, 40, parY);

        // Guidance Summary Card
        doc.roundedRect(40, parY + 18, 515, 42, 6).fillAndStroke("#FAF6EC", "#E5C158");
        doc.font("Helvetica-Oblique").fontSize(8.5).fillColor(darkTeal).text(report.parentGuidance.nurturingMindsetSummary, 55, parY + 26, { width: 485, lineGap: 2 });

        // DOs vs DON'Ts Boxes
        const doY = parY + 70;
        // DOs
        doc.roundedRect(40, doY, 250, 160, 6).fillAndStroke("#E8F8F5", emeraldGreen);
        doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#008F6B").text("✔  " + t.labels.dosHeader, 52, doY + 10);

        let doItemY = doY + 28;
        for (const d of report.parentGuidance.dos.slice(0, 3)) {
          doc.font("Helvetica").fontSize(8).fillColor(darkTeal).text(`•  ${d}`, 52, doItemY, { width: 226, lineGap: 2 });
          doItemY += 40;
        }

        // DON'Ts
        doc.roundedRect(305, doY, 250, 160, 6).fillAndStroke("#FDF0F0", "#E57373");
        doc.font("Helvetica-Bold").fontSize(9.5).fillColor("#C62828").text("✖  " + t.labels.dontsHeader, 317, doY + 10);

        let dontItemY = doY + 28;
        for (const dn of report.parentGuidance.donts.slice(0, 3)) {
          doc.font("Helvetica").fontSize(8).fillColor(darkTeal).text(`•  ${dn}`, 317, dontItemY, { width: 226, lineGap: 2 });
          dontItemY += 40;
        }

        // Recommended Discussions & Check-in Starters
        const discY = doY + 172;
        doc.roundedRect(40, discY, 515, 60, 6).fillAndStroke("#EBF6FB", accentCyan);
        doc.font("Helvetica-Bold").fontSize(9).fillColor(darkTeal).text(t.labels.conversationStartersHeader + ":", 52, discY + 8);

        let discItemY = discY + 24;
        for (const disc of report.parentGuidance.recommendedDiscussions.slice(0, 2)) {
          doc.font("Helvetica").fontSize(8).fillColor(darkTeal).text(`💬 "${disc}"`, 55, discItemY, { width: 485 });
          discItemY += 16;
        }

        // ==========================================
        // GLOBAL FOOTER ON ALL PAGES
        // ==========================================
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
          doc.switchToPage(i);
          doc
            .font("Helvetica")
            .fontSize(7.5)
            .fillColor(mutedGray)
            .text(
              `3G MeLife Skill Finder  •  Report ID: ${report.reportId.slice(0, 8)}  •  ${t.confidentialNotice}`,
              40,
              800,
              { width: 440 }
            );

          doc
            .font("Helvetica-Bold")
            .fontSize(8)
            .fillColor(darkTeal)
            .text(`Page ${i + 1} of ${range.count}`, 490, 800, { width: 65, align: "right" });
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const reportPdfGenerator = new ReportPdfGenerator();
