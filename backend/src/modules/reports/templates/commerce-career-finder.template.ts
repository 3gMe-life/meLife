/**
 * 3G MeLife Commerce Career Finder Report Template Synthesizer
 * Generates structured exploratory report DTO for Commerce Career Finder.
 * Status: Standard Pilot Edition
 */

import { CommerceCareerFinderResultDTO } from "../../assessments/scoring/commerce-career-finder-scoring.service";

export interface CommerceCareerFinderReportDTO {
  reportId: string;
  assessmentCode: "COMMERCE_CAREER_FINDER";
  assessmentName: string;
  versionName: string;
  versionCode: string;
  completedAt: string;
  generatedAt: string;
  pilotStatus: "Standard Pilot Edition";
  pilotDisclaimer: string;

  studentProfile: {
    studentName: string;
    firstName: string;
    lastName: string;
    email: string;
    age: number | null;
    educationStage: string;
    gradeLevel: string | null;
    schoolName: string;
  };

  // Primary & Secondary Exploration Focus
  explorationFocus: {
    primaryFamilyName: string;
    primaryFamilyCode: string;
    primaryScore: number;
    primaryAlignment: string;
    primaryLikertPercentage: number;
    primaryChoicePercentage: number;
    primarySuggestedPathways: string;
    primaryExampleAreas: string;
    primaryCounsellingNote: string;

    secondaryFamilyName: string;
    secondaryFamilyCode: string;
    secondaryScore: number;
    secondaryAlignment: string;
    secondaryLikertPercentage: number;
    secondaryChoicePercentage: number;
    secondarySuggestedPathways: string;
    secondaryExampleAreas: string;
    secondaryCounsellingNote: string;

    scoreGap: number;
    clarity: string;
    isMixedProfile: boolean;
    interpretationSummary: string;
    careerExplorationDirection: string;
    finalDecisionPrinciple: string;
  };

  // Full 4-Family Compatibility Matrix
  allFamilies: Array<{
    familyCode: string;
    familyName: string;
    compatibilityScore: number;
    likertScore: number;
    choiceScore: number;
    alignment: string;
    suggestedPathways: string;
    exampleAreas: string;
    counsellingNote: string;
  }>;

  // Dimension Breakdown (6 Dimensions)
  dimensionProfile: Array<{
    code: string;
    name: string;
    description: string;
    rawScore: number;
    maxScore: number;
    normalizedScore: number;
    answeredCount: number;
  }>;

  // Counsellor Guide & Academic Review
  counsellorGuide: {
    doGuidelines: string[];
    avoidGuidelines: string[];
    academicSubjectGuidance: string[];
    counsellorPrinciples: Array<{
      area: string;
      interpretation: string;
      doText: string;
      avoidText: string;
    }>;
  };

  responseQuality: {
    isComplete: boolean;
    answeredCount: number;
    totalQuestions: number;
    straightLiningDetected: boolean;
    qualityFlag: string;
    pilotDisclaimer: string;
  };

  language: string;
}

export class CommerceCareerFinderReportTemplate {
  readonly assessmentCode = "COMMERCE_CAREER_FINDER";
  readonly templateVersion = "v1.0";

  async generateReport(params: {
    reportId: string;
    result: CommerceCareerFinderResultDTO;
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
  }): Promise<CommerceCareerFinderReportDTO> {
    const { reportId, result, studentProfile, languageCode } = params;

    const formattedStage =
      studentProfile.educationStage === "COLLEGE_UNIVERSITY"
        ? "College / University"
        : studentProfile.gradeLevel
        ? `Grade ${studentProfile.gradeLevel}`
        : "Senior Secondary (Grade 11-12)";

    const primary = result.primaryFamily;
    const secondary = result.secondaryFamily;

    return {
      reportId,
      assessmentCode: "COMMERCE_CAREER_FINDER",
      assessmentName: result.assessmentName || "Commerce Career Finder",
      versionName: result.versionName || "Commerce Career Finder — Standard Pilot Edition",
      versionCode: result.versionCode || "COMMERCE_CAREER_FINDER_V1",
      completedAt: result.scoredAt || new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      pilotStatus: "Standard Pilot Edition",
      pilotDisclaimer:
        "Professional Use Statement: This assessment is educational career guidance evidence. Results should be interpreted with academic records, eligibility requirements, student interests, career goals, current course requirements and professional counselling. The Standard Pilot Edition is not presented as a validated instrument.",

      studentProfile: {
        studentName:
          studentProfile.name ||
          `${studentProfile.firstName} ${studentProfile.lastName}`.trim() ||
          "Student Participant",
        firstName: studentProfile.firstName || "Student",
        lastName: studentProfile.lastName || "",
        email: studentProfile.email || "",
        age: studentProfile.age || null,
        educationStage: formattedStage,
        gradeLevel: studentProfile.gradeLevel || null,
        schoolName: studentProfile.schoolName || "3G MeLife Learning Academy",
      },

      explorationFocus: {
        primaryFamilyName: primary.familyName,
        primaryFamilyCode: primary.familyCode,
        primaryScore: primary.displayPercentage,
        primaryAlignment: primary.alignment,
        primaryLikertPercentage: primary.likertDisplayPercentage,
        primaryChoicePercentage: primary.choiceDisplayPercentage,
        primarySuggestedPathways: primary.suggestedPathways,
        primaryExampleAreas: primary.exampleAreas,
        primaryCounsellingNote: primary.counsellingNote,

        secondaryFamilyName: secondary.familyName,
        secondaryFamilyCode: secondary.familyCode,
        secondaryScore: secondary.displayPercentage,
        secondaryAlignment: secondary.alignment,
        secondaryLikertPercentage: secondary.likertDisplayPercentage,
        secondaryChoicePercentage: secondary.choiceDisplayPercentage,
        secondarySuggestedPathways: secondary.suggestedPathways,
        secondaryExampleAreas: secondary.exampleAreas,
        secondaryCounsellingNote: secondary.counsellingNote,

        scoreGap: result.scoreGapPercentage,
        clarity: result.clarity,
        isMixedProfile: result.isMixedProfile,
        interpretationSummary: result.guidance.interpretationSummary,
        careerExplorationDirection: result.guidance.careerExplorationDirection,
        finalDecisionPrinciple: result.guidance.finalDecisionPrinciple,
      },

      allFamilies: result.sortedFamilies.map((f) => ({
        familyCode: f.familyCode,
        familyName: f.familyName,
        compatibilityScore: f.displayPercentage,
        likertScore: f.likertDisplayPercentage,
        choiceScore: f.choiceDisplayPercentage,
        alignment: f.alignment,
        suggestedPathways: f.suggestedPathways,
        exampleAreas: f.exampleAreas,
        counsellingNote: f.counsellingNote,
      })),

      dimensionProfile: Object.values(result.dimensionScores).map((d) => ({
        code: d.dimensionCode,
        name: d.dimensionName,
        description: d.description,
        rawScore: d.rawScore,
        maxScore: d.maxScore,
        normalizedScore: d.normalizedScore,
        answeredCount: d.answeredCount,
      })),

      counsellorGuide: {
        doGuidelines: result.guidance.doGuidelines,
        avoidGuidelines: result.guidance.avoidGuidelines,
        academicSubjectGuidance: result.guidance.academicSubjectGuidance,
        counsellorPrinciples: result.guidance.counsellorPrinciples,
      },

      responseQuality: {
        isComplete: result.responseQuality.isComplete,
        answeredCount: result.responseQuality.answeredCount,
        totalQuestions: result.responseQuality.totalQuestions,
        straightLiningDetected: result.responseQuality.straightLiningDetected,
        qualityFlag: result.responseQuality.qualityFlag,
        pilotDisclaimer: result.responseQuality.pilotDisclaimer,
      },

      language: languageCode || "en",
    };
  }
}

export const commerceCareerFinderReportTemplate =
  new CommerceCareerFinderReportTemplate();
