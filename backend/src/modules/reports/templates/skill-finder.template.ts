/**
 * 3G MeLife Skill Finder Report Template Synthesizer
 */

import { IReportTemplate } from "./report-template.interface";
import {
  SkillFinderReportDTO,
  ReportStudentProfile,
  ReportExecutiveSummary,
  ReportInterestProfile,
  ReportSkillBehaviourProfile,
  ReportAptitudeInsights,
  ReportDevelopmentalStrengths,
  ReportExplorationAreas,
  ReportParentGuidance,
} from "../report.types";
import { SkillFinderFullResultDTO } from "../../scoring/scoring.types";
import { getReportTranslation } from "../i18n/report.translations";

export class SkillFinderReportTemplate implements IReportTemplate<SkillFinderReportDTO> {
  readonly assessmentCode = "SKILL_FINDER";
  readonly templateVersion = "v1.0";

  async generateReport(params: {
    reportId: string;
    result: SkillFinderFullResultDTO;
    studentProfile: {
      name: string;
      firstName: string;
      lastName: string;
      email: string;
      dateOfBirth: string | null;
      age: number | null;
      educationStage: string;
      gradeLevel: string | null;
      schoolName: string;
      curriculumOrBoard: string | null;
    };
    languageCode: string;
  }): Promise<SkillFinderReportDTO> {
    const { reportId, result, studentProfile, languageCode } = params;
    const t = getReportTranslation(languageCode);

    // 1. Format Student Profile
    const formattedStage = studentProfile.educationStage === "COLLEGE_UNIVERSITY"
      ? "College / University"
      : studentProfile.gradeLevel
      ? `Grade ${studentProfile.gradeLevel}`
      : "Middle / Secondary School";

    const reportStudentProfile: ReportStudentProfile = {
      studentName: studentProfile.name || `${studentProfile.firstName} ${studentProfile.lastName}`.trim() || "Student Participant",
      firstName: studentProfile.firstName || "Student",
      lastName: studentProfile.lastName || "",
      email: studentProfile.email || "",
      age: studentProfile.age || null,
      dateOfBirth: studentProfile.dateOfBirth || null,
      educationStage: formattedStage,
      gradeLevel: studentProfile.gradeLevel || null,
      schoolName: studentProfile.schoolName || "3G MeLife Learning Academy",
      curriculumOrBoard: studentProfile.curriculumOrBoard || null,
      assessmentName: result.assessmentName || "Skill Finder — Cognitive Aptitude & Core Skills",
      assessmentCode: result.assessmentCode || "SKILL_FINDER",
      versionName: result.versionName || "Student Standard Edition",
      versionCode: result.versionCode || "STUDENT_STANDARD",
      completedAt: result.completedAt || new Date().toISOString(),
      reportId,
      generatedAt: new Date().toISOString(),
    };

    // 2. Executive Summary (Learning Profile Archetype)
    const signal = result.responseQuality?.consistencySignal || "High Consistency";
    let formattedReliability = "Adequate for Exploratory Guidance";
    if (signal === "High Consistency") {
      formattedReliability = "High Consistency (Exploratory Reliability Validated)";
    } else if (signal === "Adequate Consistency") {
      formattedReliability = "Adequate for Exploratory Guidance";
    } else {
      formattedReliability = "Review Suggested (Variable Consistency Observed)";
    }

    const executiveSummary: ReportExecutiveSummary = {
      archetypeTitle: result.learningProfile?.archetypeTitle || "Practical Explorer",
      tagline: result.learningProfile?.tagline || "Bridging scientific curiosity with hands-on technical creation",
      strengthSummary: result.learningProfile?.strengthSummary || "Your profile reflects curiosity across practical problem-solving and structured technical inquiry.",
      explorationFraming: result.learningProfile?.explorationFraming || "Your profile shows stronger alignment with engineering, applied science, and practical technology exploration areas.",
      primaryTraits: result.learningProfile?.primaryTraits || ["Analytical Inquiry", "Hands-on Building", "Spatial Reasoning"],
      reliabilityNote: formattedReliability,
    };

    // 3. Interest Profile (RIASEC)
    const topClusters = (result.interestDiscovery?.topClusters || []).map((c) => ({
      code: c.code,
      name: c.name,
      percentage: Math.round(c.scalePositionPercentage || 0),
      clusterTitle: c.clusterTitle,
      description: `Reflects engagement in ${c.name.toLowerCase()} environments and activities.`,
    }));

    const rawDims = result.interestDiscovery?.dimensions || [];
    const maxScore = Math.max(...rawDims.map((d) => Math.round(d.scalePositionPercentage || 0)), 50);
    const tiedAtTop = rawDims.filter(
      (d) => Math.round(d.scalePositionPercentage || 0) === maxScore
    );
    const isBroad = Boolean(result.interestDiscovery?.isBroadInterestPattern) || tiedAtTop.length >= 3;
    const tiedNames = tiedAtTop.map((d) => d.name.split(" ")[0]).join(", ");

    let interestSummary: string;
    let primaryOrientation: string;
    let secondaryOrientation: string;

    if (isBroad) {
      interestSummary = `${tiedNames} currently show similarly elevated interest scores (${maxScore}/100). These results suggest broad exploratory interest across multiple domains rather than a sharply dominant RIASEC orientation.`;
      primaryOrientation = "Broad Interest Pattern";
      secondaryOrientation = tiedNames;
    } else {
      primaryOrientation = result.interestDiscovery?.primaryOrientation || topClusters[0]?.name || "Builder (Realistic)";
      secondaryOrientation = result.interestDiscovery?.secondaryOrientation || topClusters[1]?.name || "Explorer (Investigative)";
      const topNames = topClusters.map((c) => c.name).slice(0, 2).join(" and ");
      interestSummary = `Your current interest orientations highlight ${topNames}. Your responses indicate stronger engagement in environments where you can investigate problems, test ideas, and create tangible solutions.`;
    }

    const interestProfile: ReportInterestProfile = {
      topClusters,
      dimensions: rawDims,
      primaryOrientation,
      secondaryOrientation,
      summary: interestSummary,
      isBroadInterestPattern: isBroad,
      tiedTopDomains: isBroad ? tiedAtTop.map((d) => d.name) : undefined,
    };

    // 4. Skill Behaviour Profile
    const skillBehaviour: ReportSkillBehaviourProfile = {
      strongestIndicators: result.skillBehaviour?.strongestIndicators || [],
      developmentOpportunities: result.skillBehaviour?.developmentOpportunities || [],
      dimensions: result.skillBehaviour?.dimensions || [],
      summary: "Evaluates self-reported problem solving, collaboration, initiative, and structured execution indicators in learning scenarios.",
    };

    // 5. Demonstrated Aptitude Insights
    const aptDims = result.demonstratedAptitude?.dimensions || [];
    const rawAptScore =
      result.demonstratedAptitude?.rawScore ??
      aptDims.reduce((acc, d) => acc + (d.rawScore || 0), 0);
    const maxAptScore =
      result.demonstratedAptitude?.maxScore ??
      aptDims.reduce((acc, d) => acc + (d.maxScore || 0), 0);

    const aptitudeInsights: ReportAptitudeInsights = {
      overallAccuracyPercentage: Math.round(result.demonstratedAptitude?.overallAccuracyPercentage || 0),
      rawScore: maxAptScore > 0 ? rawAptScore : undefined,
      maxScore: maxAptScore > 0 ? maxAptScore : undefined,
      dimensions: aptDims,
      summary: "Measures performance on objective tasks completed during this assessment session across spatial reasoning, numerical deduction, linguistic logic, pattern recognition, and creative ideation. It is not a fixed measure of intelligence or future potential.",
      cognitiveStrengthsText: "Reflects demonstrated performance in identifying logical patterns, decomposing multi-step spatial challenges, and generating multi-angle solutions during this assessment session.",
    };

    // 6. Developmental Strengths & Learning Habits
    const developmentalStrengths: ReportDevelopmentalStrengths = {
      topStrengths: result.developmentalStrengths?.topStrengths || [],
      dimensions: result.developmentalStrengths?.dimensions || [],
      learningHabitsSummary: "Assesses durable learning habits including persistence through difficulty, curiosity, adaptability to novel rules, and learning independence.",
      growthSuggestions: result.growthSuggestions || [
        "Engage in open-ended engineering or coding challenges where multiple solution paths exist.",
        "Practice articulating your thought process out loud when solving complex logical puzzles.",
        "Collaborate with peers on interdisciplinary team science and design competitions.",
      ],
    };

    // 7. Exploration Areas & Future Pathways
    const explorationAreas: ReportExplorationAreas = {
      clusters: (result.explorationDirections || []).map((dir) => ({
        domain: dir.domain,
        clusterTitle: dir.clusterTitle,
        description: dir.description,
        sampleFocusAreas: dir.sampleExplorationAreas || [],
        suggestedProjectsAndActivities: dir.suggestedActivities || [],
      })),
      framingDisclaimer: t.labels.explorationDisclaimer,
    };

    // 8. Parent & Educator Guidance
    const parentGuidance: ReportParentGuidance = {
      nurturingMindsetSummary: t.parentGuidance.summary,
      supportiveActions: t.parentGuidance.supportActions,
      recommendedDiscussions: t.parentGuidance.conversations,
      dos: t.parentGuidance.dos,
      donts: t.parentGuidance.donts,
    };

    return {
      reportId,
      resultId: result.resultId,
      attemptId: result.attemptId,
      participantId: result.participantId,
      assessmentCode: this.assessmentCode,
      language: languageCode.toLowerCase().trim(),
      templateVersion: this.templateVersion,
      generatedAt: new Date().toISOString(),
      studentProfile: reportStudentProfile,
      executiveSummary,
      interestProfile,
      skillBehaviour,
      aptitudeInsights,
      developmentalStrengths,
      explorationAreas,
      parentGuidance,
    };
  }
}

export const skillFinderReportTemplate = new SkillFinderReportTemplate();
