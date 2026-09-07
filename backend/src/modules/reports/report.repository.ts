import { PoolClient } from "pg";
import { pool } from "../../config/database";
import { logger } from "../../common/utils/logger";
import {
  AssessmentReportEntity,
  SkillFinderReportDTO,
  ReportStatus,
} from "./report.types";

export class ReportRepository {
  /**
   * Initializes assessment_reports schema and indexes idempotently.
   */
  async initSchema(client?: PoolClient): Promise<void> {
    const db = client || pool;
    const query = `
      CREATE TABLE IF NOT EXISTS assessment_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        assessment_result_id UUID NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
        participant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assessment_code VARCHAR(100) NOT NULL,
        template_version VARCHAR(50) NOT NULL DEFAULT 'v1.0',
        language_code VARCHAR(10) NOT NULL DEFAULT 'en',
        status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
        report_title VARCHAR(255) NOT NULL,
        profile_archetype VARCHAR(100) NULL,
        report_data JSONB NOT NULL,
        file_path TEXT NULL,
        generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(assessment_result_id, language_code)
      );

      CREATE INDEX IF NOT EXISTS idx_assessment_reports_result ON assessment_reports(assessment_result_id);
      CREATE INDEX IF NOT EXISTS idx_assessment_reports_participant ON assessment_reports(participant_id);
      CREATE INDEX IF NOT EXISTS idx_assessment_reports_status ON assessment_reports(status);
      CREATE INDEX IF NOT EXISTS idx_assessment_reports_code ON assessment_reports(assessment_code);
    `;
    await db.query(query);
    logger.info("📦 Assessment reports schema initialized and verified.");
  }

  /**
   * Upserts an assessment report record.
   */
  async saveReport(
    params: {
      resultId: string;
      participantId: string;
      assessmentCode: string;
      templateVersion: string;
      languageCode: string;
      status: ReportStatus;
      reportTitle: string;
      profileArchetype: string | null;
      reportData: SkillFinderReportDTO;
      filePath?: string | null;
    },
    client?: PoolClient
  ): Promise<AssessmentReportEntity> {
    const db = client || pool;
    const query = `
      INSERT INTO assessment_reports (
        assessment_result_id, participant_id, assessment_code, template_version,
        language_code, status, report_title, profile_archetype, report_data,
        file_path, generated_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      ON CONFLICT (assessment_result_id, language_code) DO UPDATE SET
        template_version = EXCLUDED.template_version,
        status = EXCLUDED.status,
        report_title = EXCLUDED.report_title,
        profile_archetype = EXCLUDED.profile_archetype,
        report_data = EXCLUDED.report_data,
        file_path = EXCLUDED.file_path,
        generated_at = NOW(),
        updated_at = NOW()
      RETURNING *
    `;
    const res = await db.query(query, [
      params.resultId,
      params.participantId,
      params.assessmentCode,
      params.templateVersion,
      params.languageCode.toLowerCase().trim(),
      params.status,
      params.reportTitle,
      params.profileArchetype,
      JSON.stringify(params.reportData),
      params.filePath || null,
    ]);
    return this.mapRowToEntity(res.rows[0]);
  }

  /**
   * Finds a report by its UUID (supporting report ID, inner JSON reportId, result ID, or attempt ID).
   */
  async findReportById(reportId: string, client?: PoolClient): Promise<AssessmentReportEntity | null> {
    if (!reportId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(reportId)) {
      return null;
    }
    const db = client || pool;

    // 1. Direct match on assessment_reports.id
    const query = `SELECT * FROM assessment_reports WHERE id = $1 LIMIT 1`;
    let res = await db.query(query, [reportId]);
    if (res.rows[0]) return this.mapRowToEntity(res.rows[0]);

    // 2. Match on embedded JSON reportId
    const queryJson = `SELECT * FROM assessment_reports WHERE report_data->>'reportId' = $1 ORDER BY generated_at DESC LIMIT 1`;
    res = await db.query(queryJson, [reportId]);
    if (res.rows[0]) return this.mapRowToEntity(res.rows[0]);

    // 3. Match on assessment_result_id
    const queryResult = `SELECT * FROM assessment_reports WHERE assessment_result_id = $1 ORDER BY generated_at DESC LIMIT 1`;
    res = await db.query(queryResult, [reportId]);
    if (res.rows[0]) return this.mapRowToEntity(res.rows[0]);

    // 4. Match on attempt_id
    const queryAttempt = `
      SELECT rpt.* FROM assessment_reports rpt
      JOIN assessment_results res ON rpt.assessment_result_id = res.id
      WHERE res.attempt_id = $1
      ORDER BY rpt.generated_at DESC
      LIMIT 1
    `;
    res = await db.query(queryAttempt, [reportId]);
    if (res.rows[0]) return this.mapRowToEntity(res.rows[0]);

    return null;
  }

  /**
   * Finds a report by assessment result ID and language code.
   */
  async findReportByResultId(
    resultId: string,
    languageCode = "en",
    client?: PoolClient
  ): Promise<AssessmentReportEntity | null> {
    if (!resultId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resultId)) {
      return null;
    }
    const db = client || pool;
    const query = `
      SELECT * FROM assessment_reports
      WHERE assessment_result_id = $1 AND language_code = $2
      LIMIT 1
    `;
    const res = await db.query(query, [resultId, languageCode.toLowerCase().trim()]);
    if (!res.rows[0]) return null;
    return this.mapRowToEntity(res.rows[0]);
  }

  /**
   * Finds the latest report for a participant and assessment code in the requested language.
   */
  async findLatestReportByParticipantId(
    participantId: string,
    assessmentCode = "SKILL_FINDER",
    languageCode = "en",
    client?: PoolClient
  ): Promise<AssessmentReportEntity | null> {
    if (!participantId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(participantId)) {
      return null;
    }
    const db = client || pool;
    const query = `
      SELECT * FROM assessment_reports
      WHERE participant_id = $1 AND (assessment_code = $2 OR UPPER(REPLACE(assessment_code, '-', '_')) = UPPER(REPLACE($2, '-', '_'))) AND language_code = $3
      ORDER BY generated_at DESC
      LIMIT 1
    `;

    const res = await db.query(query, [
      participantId,
      assessmentCode,
      languageCode.toLowerCase().trim(),
    ]);
    if (!res.rows[0]) return null;
    return this.mapRowToEntity(res.rows[0]);
  }

  /**
   * Retrieves participant and user profile details required for report header.
   */
  async getParticipantProfileForReport(
    participantId: string,
    client?: PoolClient
  ): Promise<{
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
  } | null> {
    if (!participantId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(participantId)) {
      return null;
    }
    const db = client || pool;
    const query = `
      SELECT
        u.first_name,
        u.last_name,
        u.email,
        TO_CHAR(COALESCE(p.date_of_birth, s.date_of_birth), 'YYYY-MM-DD') as date_of_birth,
        EXTRACT(YEAR FROM AGE(COALESCE(p.date_of_birth, s.date_of_birth)))::INT as derived_age,
        COALESCE(p.education_stage, s.education_stage, 'SCHOOL') as education_stage,
        COALESCE(p.grade_level, s.grade_level) as grade_level,
        COALESCE(p.school_name, s.school_name, '3G MeLife Learning Academy') as school_name,
        COALESCE(p.curriculum_or_board, s.curriculum_or_board) as curriculum_or_board
      FROM users u
      LEFT JOIN participant_profiles p ON u.id = p.user_id
      LEFT JOIN student_profiles s ON u.id = s.user_id
      WHERE u.id = $1
      LIMIT 1
    `;
    const res = await db.query(query, [participantId]);
    if (!res.rows[0]) return null;
    const row = res.rows[0];
    return {
      name: `${row.first_name} ${row.last_name}`.trim(),
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      dateOfBirth: row.date_of_birth || null,
      age: row.derived_age !== null ? parseInt(row.derived_age, 10) : null,
      educationStage: row.education_stage || "SCHOOL",
      gradeLevel: row.grade_level || null,
      schoolName: row.school_name || "3G MeLife Learning Academy",
      curriculumOrBoard: row.curriculum_or_board || null,
    };
  }

  private mapRowToEntity(row: any): AssessmentReportEntity {
    return {
      id: row.id,
      assessment_result_id: row.assessment_result_id,
      participant_id: row.participant_id,
      assessment_code: row.assessment_code,
      template_version: row.template_version,
      language_code: row.language_code,
      status: row.status as ReportStatus,
      report_title: row.report_title,
      profile_archetype: row.profile_archetype,
      report_data: typeof row.report_data === "string" ? JSON.parse(row.report_data) : row.report_data,
      file_path: row.file_path,
      generated_at: new Date(row.generated_at).toISOString(),
      created_at: new Date(row.created_at).toISOString(),
      updated_at: new Date(row.updated_at).toISOString(),
    };
  }
}

export const reportRepository = new ReportRepository();
