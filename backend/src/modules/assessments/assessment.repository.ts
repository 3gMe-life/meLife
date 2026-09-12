import { PoolClient } from "pg";
import { pool } from "../../config/database";
import { logger } from "../../common/utils/logger";
import {
  AssessmentCatalogEntity,
  AssessmentCode,
} from "./assessment.types";

export class AssessmentRepository {
  /**
   * Initializes PostgreSQL assessments schema and indexes idempotently.
   */
  async initSchema(client?: PoolClient): Promise<void> {
    const db = client || pool;
    const query = `
      CREATE TABLE IF NOT EXISTS assessments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        estimated_minutes INTEGER NOT NULL DEFAULT 20,
        question_count INTEGER NOT NULL DEFAULT 30,
        min_age INTEGER NULL,
        max_age INTEGER NULL,
        allowed_stages TEXT[] NULL,
        allowed_grades TEXT[] NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
      CREATE INDEX IF NOT EXISTS idx_assessments_code ON assessments(code);
      CREATE INDEX IF NOT EXISTS idx_assessments_display_order ON assessments(display_order);

      -- Assessment Prerequisites Table
      CREATE TABLE IF NOT EXISTS assessment_prerequisites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
        prerequisite_assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
        required_status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(assessment_id, prerequisite_assessment_id)
      );

      CREATE INDEX IF NOT EXISTS idx_prereq_assessment ON assessment_prerequisites(assessment_id);
      CREATE INDEX IF NOT EXISTS idx_prereq_required ON assessment_prerequisites(prerequisite_assessment_id);
    `;
    await db.query(query);
    logger.info("📦 Assessment catalog and prerequisite schema initialized and verified.");
  }

  /**
   * Seeds the official 7 3G MeLife assessment catalog items idempotently.
   */
  async seedCatalog(client?: PoolClient): Promise<void> {
    const db = client || pool;

    const catalogItems = [
      {
        code: "SKILL_FINDER" as AssessmentCode,
        name: "Skill Finder",
        category: "Cognitive Aptitude & Core Skills",
        description: "Evaluates foundational cognitive reasoning, numerical aptitude, spatial visualization, and exploratory learning patterns for middle school students.",
        estimatedMinutes: 20,
        questionCount: 35,
        minAge: 10,
        maxAge: 14,
        allowedStages: ["SCHOOL"],
        allowedGrades: ["5", "6", "7", "8"],
        status: "ACTIVE",
        displayOrder: 1,
      },
      {
        code: "STREAM_FINDER" as AssessmentCode,
        name: "Stream Finder",
        category: "Academic Streams & Subject Affinity",
        description: "Comprehensive subject affinity, problem-solving, and vocational interests battery guiding Class 9-10 students toward optimal Senior Secondary stream choices (Science, Commerce, Humanities, Applied / Technical).",
        estimatedMinutes: 25,
        questionCount: 80,
        minAge: 14,
        maxAge: 16,
        allowedStages: ["SCHOOL"],
        allowedGrades: ["9", "10"],
        status: "ACTIVE",
        displayOrder: 2,
      },
      {
        code: "ENGINEERING_BRANCH_FINDER" as AssessmentCode,
        name: "Engineering Branch Finder",
        category: "STEM & Technical Specializations",
        description: "Assesses interests and aptitudes across 8 core engineering disciplines (Computer Science, ECE, Electrical, Mechanical, Civil, Chemical, Biomedical, Aerospace) through 64 Likert preferences and 16 forced-choice engineering scenarios.",
        estimatedMinutes: 25,
        questionCount: 80,
        minAge: 16,
        maxAge: 18,
        allowedStages: ["SCHOOL", "COLLEGE_UNIVERSITY"],
        allowedGrades: ["11", "12"],
        status: "ACTIVE",
        displayOrder: 3,
      },
      {
        code: "COMMERCE_CAREER_FINDER" as AssessmentCode,
        name: "Commerce Career Finder",
        category: "Business, Finance & Economic Fields",
        description: "Maps quantitative finance skills, econometric instincts, commercial acumen, and entrepreneurial interests for CA, CFA, Investment Banking, Fintech, and Management.",
        estimatedMinutes: 25,
        questionCount: 40,
        minAge: 16,
        maxAge: 18,
        allowedStages: ["SCHOOL"],
        allowedGrades: ["11", "12"],
        status: "ACTIVE",
        displayOrder: 4,
      },
      {
        code: "HUMANITIES_CAREER_FINDER" as AssessmentCode,
        name: "Humanities Career Finder",
        category: "Liberal Arts, Law & Social Sciences",
        description: "Measures critical inquiry, linguistic expression, social empathy, creative synthesis, and conceptual problem solving for Law, Journalism, Psychology, Design, and Public Policy.",
        estimatedMinutes: 25,
        questionCount: 40,
        minAge: 16,
        maxAge: 18,
        allowedStages: ["SCHOOL"],
        allowedGrades: ["11", "12"],
        status: "ACTIVE",
        displayOrder: 5,
      },
      {
        code: "RIGHT_CAREER_FINDER" as AssessmentCode,
        name: "Right Career Finder",
        category: "Vocational Alignment & Career Fit",
        description: "Advanced psychometric profiling integrating RIASEC career interests, Big Five personality dynamics, and workplace strengths for undergraduates and working adults.",
        estimatedMinutes: 30,
        questionCount: 50,
        minAge: 18,
        maxAge: null,
        allowedStages: ["COLLEGE_UNIVERSITY", "WORKING_PROFESSIONAL", "OTHER"],
        allowedGrades: null,
        status: "ACTIVE",
        displayOrder: 6,
      },
      {
        code: "AI_JOB_RISK_FINDER" as AssessmentCode,
        name: "AI Job Risk Finder",
        category: "Workforce Future & AI Impact Assessment",
        description: "Assesses automation vulnerability for target careers and maps critical non-automatable human traits (complex negotiations, ethical heuristics, novel synthesis).",
        estimatedMinutes: 20,
        questionCount: 30,
        minAge: 18,
        maxAge: null,
        allowedStages: ["COLLEGE_UNIVERSITY", "WORKING_PROFESSIONAL", "OTHER"],
        allowedGrades: null,
        status: "ACTIVE",
        displayOrder: 7,
      },
    ];

    for (const item of catalogItems) {
      const query = `
        INSERT INTO assessments (
          code, name, category, description, estimated_minutes, question_count,
          min_age, max_age, allowed_stages, allowed_grades, status, display_order, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
        ON CONFLICT (code) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          description = EXCLUDED.description,
          estimated_minutes = EXCLUDED.estimated_minutes,
          question_count = EXCLUDED.question_count,
          min_age = EXCLUDED.min_age,
          max_age = EXCLUDED.max_age,
          allowed_stages = EXCLUDED.allowed_stages,
          allowed_grades = EXCLUDED.allowed_grades,
          display_order = EXCLUDED.display_order,
          updated_at = NOW()
      `;
      await db.query(query, [
        item.code,
        item.name,
        item.category,
        item.description,
        item.estimatedMinutes,
        item.questionCount,
        item.minAge,
        item.maxAge,
        item.allowedStages,
        item.allowedGrades,
        item.status,
        item.displayOrder,
      ]);
    }

    // Seed official assessment prerequisites
    const prerequisiteLinks: Array<{ targetCode: AssessmentCode; requiredCode: AssessmentCode }> = [
      { targetCode: "STREAM_FINDER", requiredCode: "SKILL_FINDER" },
      { targetCode: "ENGINEERING_BRANCH_FINDER", requiredCode: "STREAM_FINDER" },
      { targetCode: "COMMERCE_CAREER_FINDER", requiredCode: "STREAM_FINDER" },
      { targetCode: "HUMANITIES_CAREER_FINDER", requiredCode: "STREAM_FINDER" },
      { targetCode: "RIGHT_CAREER_FINDER", requiredCode: "STREAM_FINDER" },
      { targetCode: "AI_JOB_RISK_FINDER", requiredCode: "RIGHT_CAREER_FINDER" },
    ];

    for (const link of prerequisiteLinks) {
      const insertPrereqQuery = `
        INSERT INTO assessment_prerequisites (assessment_id, prerequisite_assessment_id, required_status)
        SELECT a.id, p.id, 'COMPLETED'
        FROM assessments a, assessments p
        WHERE a.code = $1 AND p.code = $2
        ON CONFLICT (assessment_id, prerequisite_assessment_id) DO NOTHING
      `;
      await db.query(insertPrereqQuery, [link.targetCode, link.requiredCode]);
    }

    logger.info("✨ 3G MeLife official assessment catalog and prerequisites seeded successfully.");
  }

  /**
   * Retrieves all defined prerequisite mappings across the catalog.
   */
  async findAllPrerequisites(client?: PoolClient): Promise<
    Array<{
      assessmentId: string;
      assessmentCode: AssessmentCode;
      prerequisiteAssessmentId: string;
      prerequisiteCode: AssessmentCode;
      prerequisiteName: string;
      requiredStatus: string;
    }>
  > {
    const db = client || pool;
    const query = `
      SELECT
        ap.assessment_id AS "assessmentId",
        a.code AS "assessmentCode",
        ap.prerequisite_assessment_id AS "prerequisiteAssessmentId",
        p.code AS "prerequisiteCode",
        p.name AS "prerequisiteName",
        ap.required_status AS "requiredStatus"
      FROM assessment_prerequisites ap
      JOIN assessments a ON a.id = ap.assessment_id
      JOIN assessments p ON p.id = ap.prerequisite_assessment_id
      ORDER BY a.display_order ASC
    `;
    const res = await db.query(query);
    return res.rows;
  }

  /**
   * Retrieves all active assessment catalog entities.
   */
  async findActiveAssessments(client?: PoolClient): Promise<AssessmentCatalogEntity[]> {
    const db = client || pool;
    const query = `
      SELECT
        id, code, name, category, description, estimated_minutes, question_count,
        min_age, max_age, allowed_stages, allowed_grades, status, display_order,
        created_at, updated_at
      FROM assessments
      WHERE status = 'ACTIVE'
      ORDER BY display_order ASC
    `;
    const res = await db.query(query);
    return res.rows.map((row) => this.mapRowToEntity(row));
  }

  /**
   * Retrieves an assessment catalog entity by its machine-readable code or UUID.
   */
  async findByIdOrCode(idOrCode: string, client?: PoolClient): Promise<AssessmentCatalogEntity | null> {
    const db = client || pool;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrCode);
    const normalizedCode = idOrCode ? idOrCode.toUpperCase().replace(/-/g, "_") : "";
    const query = isUuid
      ? `SELECT * FROM assessments WHERE id = $1 LIMIT 1`
      : `SELECT * FROM assessments WHERE code = $1 OR code = $2 LIMIT 1`;
    const res = await db.query(query, isUuid ? [idOrCode] : [idOrCode, normalizedCode]);
    if (!res.rows[0]) return null;
    return this.mapRowToEntity(res.rows[0]);
  }

  /**
   * Retrieves an assessment catalog entity by its machine-readable code.
   */
  async findByCode(code: string, client?: PoolClient): Promise<AssessmentCatalogEntity | null> {
    const db = client || pool;
    const normalizedCode = code ? code.toUpperCase().replace(/-/g, "_") : "";
    const query = `
      SELECT
        id, code, name, category, description, estimated_minutes, question_count,
        min_age, max_age, allowed_stages, allowed_grades, status, display_order,
        created_at, updated_at
      FROM assessments
      WHERE code = $1 OR code = $2
      LIMIT 1
    `;
    const res = await db.query(query, [code, normalizedCode]);
    if (!res.rows[0]) return null;
    return this.mapRowToEntity(res.rows[0]);
  }

  private mapRowToEntity(row: any): AssessmentCatalogEntity {
    return {
      id: row.id,
      code: row.code,
      name: row.name,
      category: row.category,
      description: row.description,
      estimatedMinutes: parseInt(row.estimated_minutes, 10) || 20,
      questionCount: parseInt(row.question_count, 10) || 30,
      minAge: row.min_age !== null ? parseInt(row.min_age, 10) : null,
      maxAge: row.max_age !== null ? parseInt(row.max_age, 10) : null,
      allowedStages: row.allowed_stages || null,
      allowedGrades: row.allowed_grades || null,
      status: row.status,
      displayOrder: parseInt(row.display_order, 10) || 0,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    };
  }
}

export const assessmentRepository = new AssessmentRepository();
