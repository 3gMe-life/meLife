/**
 * 3G MeLife Career Finder Report Template Synthesizer
 * Generates structured vocational alignment report DTO for Career Finder (RIGHT_CAREER_FINDER).
 * Status: Standard Pilot Edition
 */

import { RightCareerFinderResultDTO } from "../../assessments/scoring/right-career-finder-scoring.service";

export interface RightCareerFinderReportDTO {
  reportId: string;
  assessmentCode: "RIGHT_CAREER_FINDER";
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

  // Explainability Layer
  primaryDriverConstructs: Array<{
    dimensionCode: string;
    dimensionName: string;
    normalizedScore: number;
    weight: number;
    rationale: string;
  }>;

  // Full 6-Family Compatibility Matrix
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

  // Dimension Breakdown (9 Construct Dimensions)
  dimensionProfile: Array<{
    code: string;
    name: string;
    description: string;
    rawScore: number;
    maxScore: number;
    normalizedScore: number;
    interpretation: string;
    answeredCount: number;
    strongestCareerLink: string;
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

export class RightCareerFinderReportTemplate {
  readonly assessmentCode = "RIGHT_CAREER_FINDER";
  readonly templateVersion = "v1.0";

  async generateReport(params: {
    reportId: string;
    result: RightCareerFinderResultDTO;
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
  }): Promise<RightCareerFinderReportDTO> {
    const { reportId, result, studentProfile, languageCode } = params;

    const formattedStage =
      studentProfile.educationStage === "COLLEGE_UNIVERSITY"
        ? "College / University"
        : studentProfile.educationStage === "WORKING_PROFESSIONAL"
        ? "Working Professional"
        : studentProfile.gradeLevel
        ? `Grade ${studentProfile.gradeLevel}`
        : "Higher Secondary (Grade 11-12)";

    const primary = result.primaryFamily;
    const secondary = result.secondaryFamily;

    return {
      reportId,
      assessmentCode: "RIGHT_CAREER_FINDER",
      assessmentName: result.assessmentName || "Career Finder",
      versionName: result.versionName || "Career Finder — Standard Pilot Edition",
      versionCode: result.versionCode || "RIGHT_CAREER_FINDER_V1",
      completedAt: result.scoredAt || new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      pilotStatus: "Standard Pilot Edition",
      pilotDisclaimer:
        "Professional Guidance Statement: This assessment is an educational and vocational guidance instrument. Results should be interpreted in conjunction with personal goals, academic background, aptitude records, work experiences, and professional counselling. The Standard Pilot Edition is designed for exploratory alignment and is not deterministic.",

      studentProfile: {
        studentName:
          studentProfile.name ||
          `${studentProfile.firstName} ${studentProfile.lastName}`.trim() ||
          "Career Explorer",
        firstName: studentProfile.firstName || "Explorer",
        lastName: studentProfile.lastName || "",
        email: studentProfile.email || "",
        age: studentProfile.age || null,
        educationStage: formattedStage,
        gradeLevel: studentProfile.gradeLevel || null,
        schoolName: studentProfile.schoolName || "3G MeLife Career Development",
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

      primaryDriverConstructs: result.primaryDriverConstructs || [],

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
        interpretation: d.interpretation,
        answeredCount: d.answeredCount,
        strongestCareerLink: d.strongestCareerLink,
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

export const rightCareerFinderReportTemplate = new RightCareerFinderReportTemplate();
