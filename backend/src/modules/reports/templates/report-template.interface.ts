/**
 * Generic Report Template Interface for 3G MeLife Assessment Suite
 */

import { SkillFinderFullResultDTO } from "../../scoring/scoring.types";

export interface IReportTemplate<TReportDTO> {
  readonly assessmentCode: string;
  readonly templateVersion: string;

  /**
   * Generates a fully populated, localized report document DTO from scored assessment results
   * and participant profile context.
   */
  generateReport(params: {
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
  }): Promise<TReportDTO>;
}
