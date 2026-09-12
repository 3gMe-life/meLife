/**
 * 3G MeLife Engineering Branch Finder Report Template Synthesizer
 * Generates structured exploratory report DTO for Engineering Branch Finder.
 * Status: Development / Pilot Required
 */

import { EngineeringBranchFinderResultDTO } from "../../assessments/scoring/engineering-branch-finder-scoring.service";

export interface EngineeringBranchFinderReportDTO {
  reportId: string;
  assessmentCode: "ENGINEERING_BRANCH_FINDER";
  assessmentName: string;
  versionName: string;
  versionCode: string;
  completedAt: string;
  generatedAt: string;
  pilotStatus: "Development / Pilot Required";
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
    primaryBranchName: string;
    primaryBranchCode: string;
    primaryScore: number;
    primaryAlignment: string;
    primaryFocus: string;
    primaryWhy: string;
    primaryProjects: string[];
    primarySubjects: string[];

    secondaryBranchName: string;
    secondaryBranchCode: string;
    secondaryScore: number;
    secondaryAlignment: string;
    secondaryFocus: string;
    secondaryWhy: string;
    secondaryProjects: string[];
    secondarySubjects: string[];

    scoreGap: number;
    clarity: string;
    isMixedProfile: boolean;
    interdisciplinaryNote?: string;
  };

  // Full 8 Branch Matrix
  allBranches: Array<{
    branchCode: string;
    branchName: string;
    score: number;
    alignment: string;
    coreFocus: string;
    counsellingNote: string;
  }>;

  // Construct Breakdown (C01–C08)
  constructProfile: Array<{
    code: string;
    name: string;
    description: string;
    normalizedScore: number;
  }>;

  // Counsellor Guide
  counsellorGuide: {
    discussionQuestions: string[];
    recommendedNextSteps: string[];
    academicSubjectGuidance: string[];
  };

  language: string;
}

export class EngineeringBranchFinderReportTemplate {
  readonly assessmentCode = "ENGINEERING_BRANCH_FINDER";
  readonly templateVersion = "v2.0";

  async generateReport(params: {
    reportId: string;
    result: EngineeringBranchFinderResultDTO;
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
  }): Promise<EngineeringBranchFinderReportDTO> {
    const { reportId, result, studentProfile, languageCode } = params;

    const formattedStage =
      studentProfile.educationStage === "COLLEGE_UNIVERSITY"
        ? "College / University"
        : studentProfile.gradeLevel
        ? `Grade ${studentProfile.gradeLevel}`
        : "Senior Secondary (Grade 11-12)";

    const primary = result.primaryBranch;
    const secondary = result.secondaryBranch;

    return {
      reportId,
      assessmentCode: "ENGINEERING_BRANCH_FINDER",
      assessmentName: result.assessmentName || "Engineering Branch Finder",
      versionName: result.versionName || "Engineering Branch Finder — Standard Pilot Edition",
      versionCode: result.versionCode || "ENGINEERING_BRANCH_FINDER_V2",
      completedAt: result.createdAt || new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      pilotStatus: "Development / Pilot Required",
      pilotDisclaimer:
        "This psychometric report is generated under the 3G MeLife Engineering Branch Finder development specification. The results are exploratory and designed for educational counselling and self-discovery. Psychometric validation remains ongoing.",

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
        primaryBranchName: primary.branchName,
        primaryBranchCode: primary.branchCode,
        primaryScore: primary.displayPercentage,
        primaryAlignment: primary.alignment,
        primaryFocus: primary.coreFocus,
        primaryWhy: result.explorationRationale.primaryWhy,
        primaryProjects: primary.suggestedProjects,
        primarySubjects: primary.keySchoolSubjects,

        secondaryBranchName: secondary.branchName,
        secondaryBranchCode: secondary.branchCode,
        secondaryScore: secondary.displayPercentage,
        secondaryAlignment: secondary.alignment,
        secondaryFocus: secondary.coreFocus,
        secondaryWhy: result.explorationRationale.secondaryWhy,
        secondaryProjects: secondary.suggestedProjects,
        secondarySubjects: secondary.keySchoolSubjects,

        scoreGap: result.scoreGapPercentage,
        clarity: result.clarity,
        isMixedProfile: result.isMixedProfile,
        interdisciplinaryNote: result.explorationRationale.interdisciplinaryNote,
      },

      allBranches: result.sortedBranches.map((b) => ({
        branchCode: b.branchCode,
        branchName: b.branchName,
        score: b.displayPercentage,
        alignment: b.alignment,
        coreFocus: b.coreFocus,
        counsellingNote: b.counsellingNote,
      })),

      constructProfile: Object.values(result.constructScores).map((c) => ({
        code: c.constructCode,
        name: c.name,
        description: c.description,
        normalizedScore: c.normalizedScore,
      })),

      counsellorGuide: result.counsellorGuide,
      language: languageCode || "en",
    };
  }
}

export const engineeringBranchFinderReportTemplate =
  new EngineeringBranchFinderReportTemplate();
