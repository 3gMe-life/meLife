/**
 * 3G MeLife Entrepreneur Development Test Report Template Synthesizer
 * Generates structured exploratory report DTO for Entrepreneur Development Test.
 */

import {
  EntrepreneurDevelopmentResultDTO,
  EntrepreneurReadinessBand,
} from "../../assessments/scoring/entrepreneur-development-scoring.service";

export interface EntrepreneurDevelopmentReportDTO {
  reportId: string;
  assessmentCode: "ENTREPRENEUR_DEVELOPMENT_TEST";
  assessmentName: string;
  versionName: string;
  versionCode: string;
  completedAt: string;
  generatedAt: string;
  reportTitle: string;

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

  // Executive Readiness Summary
  readinessSummary: {
    readinessIndex: number;
    readinessBand: EntrepreneurReadinessBand;
    readinessTagline: string;
    readinessSummary: string;
  };

  // Archetype Classification
  primaryArchetype: {
    code: string;
    title: string;
    tagline: string;
    description: string;
    keySuperpowers: string[];
    leadershipStyle: string;
    blindSpots: string[];
    idealCoFounders: string[];
  };
  secondaryArchetype: {
    code: string;
    title: string;
    tagline: string;
    affinityScore: number;
  } | null;
  archetypeAffinities: Array<{
    archetypeCode: string;
    title: string;
    tagline: string;
    affinityScore: number;
    isPrimary: boolean;
    isSecondary: boolean;
  }>;

  // 10 Dimension Profile Breakdown
  dimensionProfile: Array<{
    code: string;
    name: string;
    description: string;
    weight: number;
    rawScore: number;
    maxScore: number;
    percentageScore: number;
    band: string;
    answeredCount: number;
    coreIndicators: string[];
    developmentalFocus: string;
  }>;

  // Strengths & Growth Areas
  strengths: Array<{
    dimensionCode: string;
    dimensionName: string;
    score: number;
    badgeText: string;
    description: string;
    leverageTip: string;
  }>;

  developmentAreas: Array<{
    dimensionCode: string;
    dimensionName: string;
    score: number;
    gapSummary: string;
    actionItem: string;
    suggestedExercise: string;
  }>;

  // Actionable 4-Stage Startup Roadmap
  roadmap: Array<{
    phaseNumber: number;
    title: string;
    duration: string;
    objectives: string[];
    milestones: string[];
    keyTools: string[];
  }>;

  // Curated Learning Recommendations
  learningRecommendations: {
    recommendedBooks: Array<{ title: string; author: string; rationale: string }>;
    coreFrameworks: Array<{ name: string; description: string; application: string }>;
    practicalProjects: Array<{ title: string; objective: string; deliverable: string }>;
  };

  // Response Quality
  responseQuality: {
    isComplete: boolean;
    answeredCount: number;
    totalExpected: number;
    completionPercentage: number;
  };
}

export class EntrepreneurDevelopmentReportTemplate {
  readonly assessmentCode = "ENTREPRENEUR_DEVELOPMENT_TEST";
  readonly templateVersion = "1.0.0";

  /**
   * Generates a fully populated, localized report document DTO from scored assessment results
   * and participant profile context.
   */
  async generateReport(params: {
    reportId: string;
    result: EntrepreneurDevelopmentResultDTO;
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
  }): Promise<EntrepreneurDevelopmentReportDTO> {
    const { reportId, result, studentProfile } = params;

    const studentName = studentProfile.name || "Student Participant";
    const reportTitle = `${studentName} — Entrepreneur Development & Venture Readiness Report`;

    return {
      reportId,
      assessmentCode: "ENTREPRENEUR_DEVELOPMENT_TEST",
      assessmentName: result.assessmentName || "Entrepreneur Development Test",
      versionName: result.versionName || "Standard Edition",
      versionCode: result.versionCode || "ENTREPRENEUR_DEVELOPMENT_V1",
      completedAt: result.completedAt || new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      reportTitle,

      studentProfile: {
        studentName,
        firstName: studentProfile.firstName || "Student",
        lastName: studentProfile.lastName || "Participant",
        email: studentProfile.email || "",
        age: studentProfile.age,
        educationStage: studentProfile.educationStage || "SCHOOL",
        gradeLevel: studentProfile.gradeLevel,
        schoolName: studentProfile.schoolName || "3G MeLife Learning Academy",
      },

      readinessSummary: {
        readinessIndex: result.readinessIndex ?? 75,
        readinessBand: result.readinessBand || "Strong Entrepreneurial Aptitude",
        readinessTagline:
          result.readinessTagline || "Strong Entrepreneurial Aptitude with High Execution Potential",
        readinessSummary: result.readinessSummary || "",
      },

      primaryArchetype: result.primaryArchetype,
      secondaryArchetype: result.secondaryArchetype,
      archetypeAffinities: result.archetypeAffinities || [],

      dimensionProfile: (result.dimensions || []).map((d) => ({
        code: d.dimensionCode,
        name: d.dimensionName,
        description: d.description,
        weight: d.weight,
        rawScore: d.rawScore,
        maxScore: d.maxPossibleRaw,
        percentageScore: d.percentageScore,
        band: d.band,
        answeredCount: d.answeredCount,
        coreIndicators: d.coreIndicators || [],
        developmentalFocus: d.developmentalFocus || "",
      })),

      strengths: result.strengths || [],
      developmentAreas: result.developmentAreas || [],
      roadmap: result.roadmap || [],
      learningRecommendations: result.learningRecommendations || {
        recommendedBooks: [],
        coreFrameworks: [],
        practicalProjects: [],
      },

      responseQuality: result.responseQuality || {
        isComplete: true,
        answeredCount: 60,
        totalExpected: 60,
        completionPercentage: 100,
      },
    };
  }
}

export const entrepreneurDevelopmentReportTemplate =
  new EntrepreneurDevelopmentReportTemplate();
