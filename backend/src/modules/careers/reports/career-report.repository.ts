import { PoolClient } from "pg";
import { pool } from "../../../config/database";
import { logger } from "../../../common/utils/logger";
import { CareerReportDTO, CareerReportEntity } from "./career-report.types";

export class CareerReportRepository {
  /**
   * Initializes database schema for Career Reports and Templates idempotently.
   */
  async initSchema(client?: PoolClient): Promise<void> {
    const db = client || pool;
    const query = `
      -- 1. Career Reports Table
      CREATE TABLE IF NOT EXISTS career_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assessment_result_id UUID NULL REFERENCES assessment_results(id) ON DELETE SET NULL,
        language_code VARCHAR(10) NOT NULL DEFAULT 'en',
        report_type VARCHAR(60) NOT NULL DEFAULT 'COMPREHENSIVE_CAREER_GUIDANCE',
        report_title VARCHAR(255) NOT NULL,
        profile_archetype VARCHAR(150) NULL,
        report_data JSONB NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
        file_path TEXT NULL,
        generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_student_result_lang UNIQUE (student_id, assessment_result_id, language_code)
      );

      -- 2. Career Report Templates Table
      CREATE TABLE IF NOT EXISTS career_report_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        version VARCHAR(30) NOT NULL,
        language_code VARCHAR(10) NOT NULL DEFAULT 'en',
        template_data JSONB NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(version, language_code)
      );

      CREATE INDEX IF NOT EXISTS idx_career_reports_student ON career_reports(student_id);
      CREATE INDEX IF NOT EXISTS idx_career_reports_result ON career_reports(assessment_result_id);
      CREATE INDEX IF NOT EXISTS idx_career_reports_status ON career_reports(status);
      CREATE INDEX IF NOT EXISTS idx_career_reports_lang ON career_reports(language_code);
    `;
    await db.query(query);
    logger.info("📦 Career reports database schema initialized and verified.");
  }

  /**
   * Saves or updates a generated career report.
   */
  async saveReport(
    reportDto: CareerReportDTO,
    filePath?: string | null,
    client?: PoolClient
  ): Promise<CareerReportEntity> {
    const db = client || pool;
    const query = `
      INSERT INTO career_reports (
        id, student_id, assessment_result_id, language_code, report_type,
        report_title, profile_archetype, report_data, status, file_path,
        generated_at, created_at, updated_at
      )
      VALUES (
        $1, $2, $3, $4, 'COMPREHENSIVE_CAREER_GUIDANCE',
        $5, $6, $7, 'COMPLETED', $8,
        NOW(), NOW(), NOW()
      )
      ON CONFLICT (student_id, assessment_result_id, language_code) DO UPDATE SET
        report_title = EXCLUDED.report_title,
        profile_archetype = EXCLUDED.profile_archetype,
        report_data = EXCLUDED.report_data,
        status = 'COMPLETED',
        file_path = COALESCE(EXCLUDED.file_path, career_reports.file_path),
        generated_at = NOW(),
        updated_at = NOW()
      RETURNING *;
    `;

    const res = await db.query(query, [
      reportDto.reportId,
      reportDto.studentId,
      reportDto.assessmentResultId || null,
      (reportDto.language || "en").toLowerCase().trim(),
      reportDto.cover.reportTitle,
      reportDto.cover.profileArchetype,
      JSON.stringify(reportDto),
      filePath || null,
    ]);

    return this.mapRowToEntity(res.rows[0]);
  }

  /**
   * Finds a career report by its unique ID.
   */
  async findReportById(reportId: string, client?: PoolClient): Promise<CareerReportEntity | null> {
    if (!reportId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(reportId)) {
      return null;
    }
    const db = client || pool;
    const res = await db.query(
      `SELECT * FROM career_reports WHERE id = $1 LIMIT 1`,
      [reportId]
    );
    if (!res.rows[0]) return null;
    return this.mapRowToEntity(res.rows[0]);
  }

  /**
   * Finds the latest career report for a student, optionally filtered by language.
   */
  async findLatestReportByStudentId(
    studentId: string,
    languageCode?: string,
    client?: PoolClient
  ): Promise<CareerReportEntity | null> {
    if (!studentId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentId)) {
      return null;
    }
    const db = client || pool;
    let query = `
      SELECT * FROM career_reports
      WHERE student_id = $1
    `;
    const params: any[] = [studentId];

    if (languageCode) {
      query += ` AND language_code = $2`;
      params.push(languageCode.toLowerCase().trim());
    }

    query += ` ORDER BY generated_at DESC LIMIT 1`;

    const res = await db.query(query, params);
    if (!res.rows[0]) return null;
    return this.mapRowToEntity(res.rows[0]);
  }

  /**
   * Finds an existing report by studentId, assessmentResultId, and languageCode.
   */
  async findReportByStudentAndResult(
    studentId: string,
    resultId: string | null,
    languageCode = "en",
    client?: PoolClient
  ): Promise<CareerReportEntity | null> {
    const db = client || pool;
    const lang = (languageCode || "en").toLowerCase().trim();

    let query: string;
    let params: any[];

    if (resultId) {
      query = `SELECT * FROM career_reports WHERE student_id = $1 AND assessment_result_id = $2 AND language_code = $3 LIMIT 1`;
      params = [studentId, resultId, lang];
    } else {
      query = `SELECT * FROM career_reports WHERE student_id = $1 AND assessment_result_id IS NULL AND language_code = $2 LIMIT 1`;
      params = [studentId, lang];
    }

    const res = await db.query(query, params);
    if (!res.rows[0]) return null;
    return this.mapRowToEntity(res.rows[0]);
  }

  /**
   * Finds all reports for a student.
   */
  async findAllReportsByStudentId(studentId: string, client?: PoolClient): Promise<CareerReportEntity[]> {
    if (!studentId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentId)) {
      return [];
    }
    const db = client || pool;
    const res = await db.query(
      `SELECT * FROM career_reports WHERE student_id = $1 ORDER BY generated_at DESC`,
      [studentId]
    );
    return res.rows.map((r) => this.mapRowToEntity(r));
  }

  private mapRowToEntity(row: any): CareerReportEntity {
    return {
      id: row.id,
      student_id: row.student_id,
      assessment_result_id: row.assessment_result_id,
      language_code: row.language_code,
      report_type: row.report_type,
      report_title: row.report_title,
      profile_archetype: row.profile_archetype,
      report_data: typeof row.report_data === "string" ? JSON.parse(row.report_data) : row.report_data,
      status: row.status,
      file_path: row.file_path,
      generated_at: new Date(row.generated_at).toISOString(),
      created_at: new Date(row.created_at).toISOString(),
      updated_at: new Date(row.updated_at).toISOString(),
    };
  }
}

export const careerReportRepository = new CareerReportRepository();
