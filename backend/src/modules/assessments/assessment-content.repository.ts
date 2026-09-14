import { PoolClient } from "pg";
import { pool } from "../../config/database";
import { logger } from "../../common/utils/logger";
import {
  SKILL_FINDER_SECTIONS,
  SKILL_FINDER_QUESTIONS,
} from "./content/skill-finder-catalog.data";
import {
  STREAM_FINDER_SECTIONS,
  STREAM_FINDER_QUESTIONS,
} from "./content/stream-finder-catalog.data";
import {
  ENGINEERING_SECTIONS,
  ENGINEERING_QUESTIONS,
} from "./content/engineering-branch-finder-catalog.data";
import {
  COMMERCE_CAREER_FINDER_SECTIONS,
  COMMERCE_CAREER_FINDER_DIMENSIONS,
  COMMERCE_CAREER_FINDER_QUESTIONS,
} from "./content/commerce-career-finder-catalog.data";
import {
  HUMANITIES_CAREER_FINDER_SECTIONS,
  HUMANITIES_CAREER_FINDER_DIMENSIONS,
  HUMANITIES_CAREER_FINDER_QUESTIONS,
} from "./content/humanities-career-finder-catalog.data";
import {
  SanitizedQuestionDTO,
  AssessmentSectionSummaryDTO,
  AssessmentAttemptQuestionsResponseDTO,
} from "./assessment-runner.types";
import { SUPPORTED_ASSESSMENT_LANGUAGES } from "./services/skill-finder-translations.service";

export class AssessmentContentRepository {
  /**
   * Initializes PostgreSQL DDL schema for assessment sections, dimensions, questions,
   * options, attempts, responses, and results.
   */
  async initSchema(client?: PoolClient): Promise<void> {
    const db = client || pool;
    const query = `
      -- 1. Assessment Sections
      CREATE TABLE IF NOT EXISTS assessment_sections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
        code VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(assessment_id, code)
      );

      -- 2. Assessment Dimensions
      CREATE TABLE IF NOT EXISTS assessment_dimensions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        section_id UUID NOT NULL REFERENCES assessment_sections(id) ON DELETE CASCADE,
        code VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(section_id, code)
      );

      -- 3. Assessment Questions
      CREATE TABLE IF NOT EXISTS assessment_questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
        section_id UUID NOT NULL REFERENCES assessment_sections(id) ON DELETE CASCADE,
        dimension_id UUID NULL REFERENCES assessment_dimensions(id) ON DELETE SET NULL,
        question_number INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        question_type VARCHAR(50) NOT NULL,
        image_url TEXT NULL,
        correct_key VARCHAR(100) NULL,
        max_points NUMERIC(5,2) NOT NULL DEFAULT 4.0,
        is_required BOOLEAN NOT NULL DEFAULT true,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(assessment_id, question_number)
      );

      -- 4. Question Options
      CREATE TABLE IF NOT EXISTS question_options (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id UUID NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
        option_key VARCHAR(50) NOT NULL,
        option_text TEXT NOT NULL,
        score_value NUMERIC(5,2) NOT NULL DEFAULT 0,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(question_id, option_key)
      );

      -- 5. Assessment Versions
      CREATE TABLE IF NOT EXISTS assessment_versions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
        version_code VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        version_number VARCHAR(50) NOT NULL DEFAULT 'v1.0',
        target_age VARCHAR(50) NOT NULL DEFAULT '10-13',
        duration_minutes INTEGER NOT NULL DEFAULT 30,
        question_count INTEGER NOT NULL DEFAULT 68,
        mode VARCHAR(50) NOT NULL DEFAULT 'FIXED',
        is_default BOOLEAN NOT NULL DEFAULT false,
        status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
        description TEXT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(assessment_id, version_code)
      );

      -- 6. Assessment Version Questions (Question Bank linkage)
      CREATE TABLE IF NOT EXISTS assessment_version_questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        version_id UUID NOT NULL REFERENCES assessment_versions(id) ON DELETE CASCADE,
        question_id UUID NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
        display_order INTEGER NOT NULL,
        is_required BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(version_id, question_id)
      );

      -- 7. Assessment Attempts
      CREATE TABLE IF NOT EXISTS assessment_attempts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        participant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
        version_id UUID NULL REFERENCES assessment_versions(id) ON DELETE SET NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
        current_question_index INTEGER NOT NULL DEFAULT 0,
        total_questions INTEGER NOT NULL DEFAULT 104,
        answered_count INTEGER NOT NULL DEFAULT 0,
        started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      ALTER TABLE assessment_attempts
      ADD COLUMN IF NOT EXISTS version_id UUID NULL REFERENCES assessment_versions(id) ON DELETE SET NULL;

      -- 8. Assessment Responses
      CREATE TABLE IF NOT EXISTS assessment_responses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        attempt_id UUID NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
        question_id UUID NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
        selected_option_id UUID NULL REFERENCES question_options(id) ON DELETE SET NULL,
        response_value TEXT NULL,
        score NUMERIC(5,2) NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(attempt_id, question_id)
      );

      -- 9. Assessment Results
      CREATE TABLE IF NOT EXISTS assessment_results (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        attempt_id UUID NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE UNIQUE,
        participant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assessment_code VARCHAR(100) NOT NULL,
        profile_type VARCHAR(100) NULL,
        summary TEXT NULL,
        dimension_scores JSONB NULL,
        profile_vector JSONB NULL,
        profile_confidence VARCHAR(50) NULL,
        confidence_metrics JSONB NULL,
        result_data JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      ALTER TABLE assessment_results ADD COLUMN IF NOT EXISTS profile_type VARCHAR(100) NULL;
      ALTER TABLE assessment_results ADD COLUMN IF NOT EXISTS summary TEXT NULL;
      ALTER TABLE assessment_results ADD COLUMN IF NOT EXISTS dimension_scores JSONB NULL;
      ALTER TABLE assessment_results ADD COLUMN IF NOT EXISTS profile_vector JSONB NULL;
      ALTER TABLE assessment_results ADD COLUMN IF NOT EXISTS profile_confidence VARCHAR(50) NULL;
      ALTER TABLE assessment_results ADD COLUMN IF NOT EXISTS confidence_metrics JSONB NULL;

      -- 10. Question Translations (Multilingual Engine)
      CREATE TABLE IF NOT EXISTS question_translations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id UUID NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
        language_code VARCHAR(10) NOT NULL,
        question_text TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(question_id, language_code)
      );

      -- 11. Option Translations (Multilingual Engine)
      CREATE TABLE IF NOT EXISTS option_translations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        option_id UUID NOT NULL REFERENCES question_options(id) ON DELETE CASCADE,
        language_code VARCHAR(10) NOT NULL,
        option_text TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(option_id, language_code)
      );

      -- 12. Section Translations (Multilingual Engine)
      CREATE TABLE IF NOT EXISTS section_translations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        section_id UUID NOT NULL REFERENCES assessment_sections(id) ON DELETE CASCADE,
        language_code VARCHAR(10) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(section_id, language_code)
      );

      -- 13. Dimension Translations (Multilingual Engine)
      CREATE TABLE IF NOT EXISTS dimension_translations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        dimension_id UUID NOT NULL REFERENCES assessment_dimensions(id) ON DELETE CASCADE,
        language_code VARCHAR(10) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(dimension_id, language_code)
      );

      -- 14. Assessment History Ledger (Retake & Milestone Tracking)
      CREATE TABLE IF NOT EXISTS assessment_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
        attempt_id UUID NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE UNIQUE,
        result_id UUID NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
        attempt_number INTEGER NOT NULL DEFAULT 1,
        profile_type VARCHAR(100) NULL,
        dimension_summary JSONB NULL,
        completed_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- 15. Assessment Longitudinal Comparisons
      CREATE TABLE IF NOT EXISTS assessment_comparisons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        old_result_id UUID NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
        new_result_id UUID NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
        days_between INTEGER NOT NULL DEFAULT 0,
        comparison_data JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(student_id, old_result_id, new_result_id)
      );

      -- Indexes for fast query retrieval & translations
      CREATE INDEX IF NOT EXISTS idx_questions_assessment_id ON assessment_questions(assessment_id);
      CREATE INDEX IF NOT EXISTS idx_questions_section_id ON assessment_questions(section_id);
      CREATE INDEX IF NOT EXISTS idx_question_options_qid ON question_options(question_id);
      CREATE INDEX IF NOT EXISTS idx_attempts_participant_status ON assessment_attempts(participant_id, status);
      CREATE INDEX IF NOT EXISTS idx_responses_attempt_id ON assessment_responses(attempt_id);
      CREATE INDEX IF NOT EXISTS idx_results_participant_code ON assessment_results(participant_id, assessment_code);
      CREATE INDEX IF NOT EXISTS idx_q_trans_lookup ON question_translations(question_id, language_code);
      CREATE INDEX IF NOT EXISTS idx_opt_trans_lookup ON option_translations(option_id, language_code);
      CREATE INDEX IF NOT EXISTS idx_sec_trans_lookup ON section_translations(section_id, language_code);
      CREATE INDEX IF NOT EXISTS idx_dim_trans_lookup ON dimension_translations(dimension_id, language_code);
      CREATE INDEX IF NOT EXISTS idx_history_student ON assessment_history(student_id, completed_date DESC);
      CREATE INDEX IF NOT EXISTS idx_history_assessment ON assessment_history(assessment_id);
      CREATE INDEX IF NOT EXISTS idx_comparisons_student ON assessment_comparisons(student_id);
    `;
    await db.query(query);
    logger.info("📦 Assessment runner database schema initialized and verified.");
  }

  /**
   * Seeds all 104 questions, sections, dimensions, and options for Skill Finder idempotently.
   */
  async seedSkillFinderContent(client?: PoolClient): Promise<void> {
    const db = client || pool;

    // 1. Find SKILL_FINDER assessment ID
    const assessRes = await db.query(
      `SELECT id FROM assessments WHERE code = 'SKILL_FINDER' LIMIT 1`
    );
    if (!assessRes.rows[0]) {
      logger.warn("SKILL_FINDER assessment catalog entry missing, skipping content seeding");
      return;
    }
    const assessmentId = assessRes.rows[0].id;

    // Fast check: if already seeded 104 items, return immediately
    const countCheck = await db.query(
      `SELECT COUNT(*) as count FROM assessment_questions WHERE assessment_id = $1`,
      [assessmentId]
    );
    if (parseInt(countCheck.rows[0]?.count, 10) === 104) {
      logger.info("✨ Skill Finder question bank already fully seeded (104 items).");
      return;
    }

    // 2. Upsert Sections
    const sectionMap: Record<string, string> = {};
    for (const sec of SKILL_FINDER_SECTIONS) {
      const sRes = await db.query(
        `INSERT INTO assessment_sections (assessment_id, code, name, description, display_order, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (assessment_id, code) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           display_order = EXCLUDED.display_order,
           updated_at = NOW()
         RETURNING id`,
        [assessmentId, sec.code, sec.name, sec.description, sec.displayOrder]
      );
      sectionMap[sec.code] = sRes.rows[0].id;
    }

    // 3. Upsert Dimensions & Questions
    const dimensionMap: Record<string, string> = {};

    for (const q of SKILL_FINDER_QUESTIONS) {
      const sectionId = sectionMap[q.sectionCode];
      if (!sectionId) continue;

      // Upsert Dimension if not yet in map
      const dimKey = `${q.sectionCode}_${q.dimensionCode}`;
      if (!dimensionMap[dimKey]) {
        const dRes = await db.query(
          `INSERT INTO assessment_dimensions (section_id, code, name, display_order, updated_at)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT (section_id, code) DO UPDATE SET
             name = EXCLUDED.name,
             updated_at = NOW()
           RETURNING id`,
          [sectionId, q.dimensionCode, q.dimensionName, q.questionNumber]
        );
        dimensionMap[dimKey] = dRes.rows[0].id;
      }
      const dimensionId = dimensionMap[dimKey];

      // Upsert Question
      const qRes = await db.query(
        `INSERT INTO assessment_questions (
           assessment_id, section_id, dimension_id, question_number, question_text,
           question_type, image_url, correct_key, max_points, is_required, display_order, updated_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
         ON CONFLICT (assessment_id, question_number) DO UPDATE SET
           section_id = EXCLUDED.section_id,
           dimension_id = EXCLUDED.dimension_id,
           question_text = EXCLUDED.question_text,
           question_type = EXCLUDED.question_type,
           image_url = EXCLUDED.image_url,
           correct_key = EXCLUDED.correct_key,
           max_points = EXCLUDED.max_points,
           display_order = EXCLUDED.display_order,
           updated_at = NOW()
         RETURNING id`,
        [
          assessmentId,
          sectionId,
          dimensionId,
          q.questionNumber,
          q.questionText,
          q.questionType,
          q.imageUrl || null,
          q.correctKey || null,
          q.maxPoints,
          true,
          q.questionNumber,
        ]
      );
      const questionId = qRes.rows[0].id;

      // Upsert Options
      if (q.options && q.options.length > 0) {
        let optOrder = 1;
        for (const opt of q.options) {
          await db.query(
            `INSERT INTO question_options (question_id, option_key, option_text, score_value, display_order, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW())
             ON CONFLICT (question_id, option_key) DO UPDATE SET
               option_text = EXCLUDED.option_text,
               score_value = EXCLUDED.score_value,
               display_order = EXCLUDED.display_order,
               updated_at = NOW()`,
            [questionId, opt.key, opt.text, opt.score || 0, optOrder++]
          );
        }
      }
    }

    logger.info("✨ Skill Finder 104-item question bank & options seeded successfully.");
  }

  /**
   * Seeds all 80 questions, sections, dimensions, and options for Stream Finder idempotently.
   */
  async seedStreamFinderContent(client?: PoolClient): Promise<void> {
    const db = client || pool;

    // 1. Find STREAM_FINDER assessment ID
    const assessRes = await db.query(
      `SELECT id FROM assessments WHERE code = 'STREAM_FINDER' LIMIT 1`
    );
    if (!assessRes.rows[0]) {
      logger.warn("STREAM_FINDER assessment catalog entry missing, skipping content seeding");
      return;
    }
    const assessmentId = assessRes.rows[0].id;

    // Fast check: if already seeded 80 items, return immediately
    const countCheck = await db.query(
      `SELECT COUNT(*) as count FROM assessment_questions WHERE assessment_id = $1`,
      [assessmentId]
    );
    if (parseInt(countCheck.rows[0]?.count, 10) === 80) {
      logger.info("✨ Stream Finder question bank already fully seeded (80 items).");
      return;
    }

    // 2. Upsert Sections
    const sectionMap: Record<string, string> = {};
    for (const sec of STREAM_FINDER_SECTIONS) {
      const sRes = await db.query(
        `INSERT INTO assessment_sections (assessment_id, code, name, description, display_order, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (assessment_id, code) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           display_order = EXCLUDED.display_order,
           updated_at = NOW()
         RETURNING id`,
        [assessmentId, sec.code, sec.name, sec.description, sec.displayOrder]
      );
      sectionMap[sec.code] = sRes.rows[0].id;
    }

    // 3. Upsert Dimensions & Questions
    const dimensionMap: Record<string, string> = {};

    for (const q of STREAM_FINDER_QUESTIONS) {
      const sectionId = sectionMap[q.sectionCode];
      if (!sectionId) continue;

      // Upsert Dimension if not yet in map
      const dimKey = `${q.sectionCode}_${q.dimensionCode}`;
      if (!dimensionMap[dimKey]) {
        const dRes = await db.query(
          `INSERT INTO assessment_dimensions (section_id, code, name, display_order, updated_at)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT (section_id, code) DO UPDATE SET
             name = EXCLUDED.name,
             updated_at = NOW()
           RETURNING id`,
          [sectionId, q.dimensionCode, q.dimensionName, q.questionNumber]
        );
        dimensionMap[dimKey] = dRes.rows[0].id;
      }
      const dimensionId = dimensionMap[dimKey];

      const maxPoints = q.questionType === "likert_1_5" ? 5.0 : 3.0;

      // Upsert Question
      const qRes = await db.query(
        `INSERT INTO assessment_questions (
           assessment_id, section_id, dimension_id, question_number, question_text,
           question_type, max_points, is_required, display_order, updated_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
         ON CONFLICT (assessment_id, question_number) DO UPDATE SET
           section_id = EXCLUDED.section_id,
           dimension_id = EXCLUDED.dimension_id,
           question_text = EXCLUDED.question_text,
           question_type = EXCLUDED.question_type,
           max_points = EXCLUDED.max_points,
           display_order = EXCLUDED.display_order,
           updated_at = NOW()
         RETURNING id`,
        [
          assessmentId,
          sectionId,
          dimensionId,
          q.questionNumber,
          q.questionText,
          q.questionType,
          maxPoints,
          true,
          q.questionNumber,
        ]
      );
      const questionId = qRes.rows[0].id;

      // Upsert Options
      if (q.options && q.options.length > 0) {
        for (const opt of q.options) {
          await db.query(
            `INSERT INTO question_options (question_id, option_key, option_text, score_value, display_order, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW())
             ON CONFLICT (question_id, option_key) DO UPDATE SET
               option_text = EXCLUDED.option_text,
               score_value = EXCLUDED.score_value,
               display_order = EXCLUDED.display_order,
               updated_at = NOW()`,
            [questionId, opt.optionKey, opt.optionText, opt.scoreValue || 0, opt.displayOrder]
          );
        }
      }
    }

    logger.info("✨ Stream Finder 80-item question bank & options seeded successfully.");
  }

  /**
   * Seeds all 80 questions, sections, dimensions, and options for Engineering Branch Finder idempotently.
   */
  async seedEngineeringBranchFinderContent(client?: PoolClient): Promise<void> {
    const db = client || pool;

    // 1. Find ENGINEERING_BRANCH_FINDER assessment ID
    const assessRes = await db.query(
      `SELECT id FROM assessments WHERE code = 'ENGINEERING_BRANCH_FINDER' LIMIT 1`
    );
    if (!assessRes.rows[0]) {
      logger.warn("ENGINEERING_BRANCH_FINDER assessment catalog entry missing, skipping content seeding");
      return;
    }
    const assessmentId = assessRes.rows[0].id;

    // Fast check: if already seeded 80 items, return immediately
    const countCheck = await db.query(
      `SELECT COUNT(*) as count FROM assessment_questions WHERE assessment_id = $1`,
      [assessmentId]
    );
    if (parseInt(countCheck.rows[0]?.count, 10) === 80) {
      logger.info("✨ Engineering Branch Finder question bank already fully seeded (80 items).");
      return;
    }

    // 2. Upsert Sections
    const sectionMap: Record<string, string> = {};
    for (const sec of ENGINEERING_SECTIONS) {
      const sRes = await db.query(
        `INSERT INTO assessment_sections (assessment_id, code, name, description, display_order, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (assessment_id, code) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           display_order = EXCLUDED.display_order,
           updated_at = NOW()
         RETURNING id`,
        [assessmentId, sec.code, sec.name, sec.description, sec.displayOrder]
      );
      sectionMap[sec.code] = sRes.rows[0].id;
    }

    // 3. Upsert Dimensions & Questions
    const dimensionMap: Record<string, string> = {};

    for (const q of ENGINEERING_QUESTIONS) {
      const sectionId = sectionMap[q.sectionCode];
      if (!sectionId) continue;

      // Upsert Dimension if not yet in map
      const dimKey = `${q.sectionCode}_${q.dimensionCode}`;
      if (!dimensionMap[dimKey]) {
        const dRes = await db.query(
          `INSERT INTO assessment_dimensions (section_id, code, name, display_order, updated_at)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT (section_id, code) DO UPDATE SET
             name = EXCLUDED.name,
             updated_at = NOW()
           RETURNING id`,
          [sectionId, q.dimensionCode, q.dimensionName, q.questionNumber]
        );
        dimensionMap[dimKey] = dRes.rows[0].id;
      }
      const dimensionId = dimensionMap[dimKey];

      const maxPoints = q.questionType === "likert_1_4" ? 4.0 : 1.0;

      // Upsert Question
      const qRes = await db.query(
        `INSERT INTO assessment_questions (
           assessment_id, section_id, dimension_id, question_number, question_text,
           question_type, max_points, is_required, display_order, updated_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
         ON CONFLICT (assessment_id, question_number) DO UPDATE SET
           section_id = EXCLUDED.section_id,
           dimension_id = EXCLUDED.dimension_id,
           question_text = EXCLUDED.question_text,
           question_type = EXCLUDED.question_type,
           max_points = EXCLUDED.max_points,
           display_order = EXCLUDED.display_order,
           updated_at = NOW()
         RETURNING id`,
        [
          assessmentId,
          sectionId,
          dimensionId,
          q.questionNumber,
          q.questionText,
          q.questionType,
          maxPoints,
          true,
          q.questionNumber,
        ]
      );
      const questionId = qRes.rows[0].id;

      // Upsert Options
      if (q.options && q.options.length > 0) {
        for (const opt of q.options) {
          await db.query(
            `INSERT INTO question_options (question_id, option_key, option_text, score_value, display_order, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW())
             ON CONFLICT (question_id, option_key) DO UPDATE SET
               option_text = EXCLUDED.option_text,
               score_value = EXCLUDED.score_value,
               display_order = EXCLUDED.display_order,
               updated_at = NOW()`,
            [questionId, opt.optionKey, opt.optionText, opt.scoreValue || 0, opt.displayOrder]
          );
        }
      }
    }

    logger.info("✨ Engineering Branch Finder 80-item question bank & options seeded successfully.");
  }

  /**
   * Seeds all 80 questions, sections, dimensions, and options for Commerce Career Finder idempotently.
   */
  async seedCommerceCareerFinderContent(client?: PoolClient): Promise<void> {
    const db = client || pool;

    // 1. Find COMMERCE_CAREER_FINDER assessment ID
    const assessRes = await db.query(
      `SELECT id FROM assessments WHERE code = 'COMMERCE_CAREER_FINDER' LIMIT 1`
    );
    if (!assessRes.rows[0]) {
      logger.warn("COMMERCE_CAREER_FINDER assessment catalog entry missing, skipping content seeding");
      return;
    }
    const assessmentId = assessRes.rows[0].id;

    // Fast check: if already seeded 80 items, return immediately
    const countCheck = await db.query(
      `SELECT COUNT(*) as count FROM assessment_questions WHERE assessment_id = $1`,
      [assessmentId]
    );
    if (parseInt(countCheck.rows[0]?.count, 10) === 80) {
      logger.info("✨ Commerce Career Finder question bank already fully seeded (80 items).");
      return;
    }

    // 2. Upsert Sections
    const sectionMap: Record<string, string> = {};
    for (const sec of COMMERCE_CAREER_FINDER_SECTIONS) {
      const sRes = await db.query(
        `INSERT INTO assessment_sections (assessment_id, code, name, description, display_order, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (assessment_id, code) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           display_order = EXCLUDED.display_order,
           updated_at = NOW()
         RETURNING id`,
        [assessmentId, sec.code, sec.name, sec.description, sec.displayOrder]
      );
      sectionMap[sec.code] = sRes.rows[0].id;
    }

    // 3. Upsert Dimensions
    const dimensionMap: Record<string, string> = {};
    for (const dim of COMMERCE_CAREER_FINDER_DIMENSIONS) {
      const sectionId = sectionMap[dim.sectionCode];
      if (!sectionId) continue;

      const dRes = await db.query(
        `INSERT INTO assessment_dimensions (section_id, code, name, description, display_order, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (section_id, code) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           display_order = EXCLUDED.display_order,
           updated_at = NOW()
         RETURNING id`,
        [sectionId, dim.code, dim.name, dim.description, dim.displayOrder]
      );
      dimensionMap[dim.code] = dRes.rows[0].id;
    }

    // 4. Upsert Questions & Options
    for (const q of COMMERCE_CAREER_FINDER_QUESTIONS) {
      const sectionId = sectionMap[q.sectionCode];
      if (!sectionId) continue;

      const dimensionId = q.dimensionCode ? dimensionMap[q.dimensionCode] || null : null;
      const questionNumber = q.displayOrder;
      const maxPoints = q.questionType === "likert_1_5" ? 5.0 : 1.0;

      const qRes = await db.query(
        `INSERT INTO assessment_questions (
           assessment_id, section_id, dimension_id, question_number, question_text,
           question_type, max_points, is_required, display_order, updated_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
         ON CONFLICT (assessment_id, question_number) DO UPDATE SET
           section_id = EXCLUDED.section_id,
           dimension_id = EXCLUDED.dimension_id,
           question_text = EXCLUDED.question_text,
           question_type = EXCLUDED.question_type,
           max_points = EXCLUDED.max_points,
           display_order = EXCLUDED.display_order,
           updated_at = NOW()
         RETURNING id`,
        [
          assessmentId,
          sectionId,
          dimensionId,
          questionNumber,
          q.questionText,
          q.questionType,
          maxPoints,
          true,
          questionNumber,
        ]
      );
      const questionId = qRes.rows[0].id;

      // Upsert Options
      if (q.options && q.options.length > 0) {
        for (const opt of q.options) {
          await db.query(
            `INSERT INTO question_options (question_id, option_key, option_text, score_value, display_order, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW())
             ON CONFLICT (question_id, option_key) DO UPDATE SET
               option_text = EXCLUDED.option_text,
               score_value = EXCLUDED.score_value,
               display_order = EXCLUDED.display_order,
               updated_at = NOW()`,
            [questionId, opt.optionKey, opt.optionText, opt.scoreValue || 0, opt.displayOrder]
          );
        }
      }
    }

    logger.info("✨ Commerce Career Finder 80-item question bank & options seeded successfully.");
  }

  /**
   * Seeds all 80 questions, sections, dimensions, and options for Humanities Career Finder idempotently.
   */
  async seedHumanitiesCareerFinderContent(client?: PoolClient): Promise<void> {
    const isExternalClient = Boolean(client);
    const db: PoolClient = client || (await pool.connect());

    try {
      if (!isExternalClient) {
        await db.query("BEGIN");
      }

      // 1. Find HUMANITIES_CAREER_FINDER assessment ID
      const assessRes = await db.query(
        `SELECT id FROM assessments WHERE code = 'HUMANITIES_CAREER_FINDER' LIMIT 1`
      );
      if (!assessRes.rows[0]) {
        logger.warn("HUMANITIES_CAREER_FINDER assessment catalog entry missing, skipping content seeding");
        if (!isExternalClient) await db.query("COMMIT");
        return;
      }
      const assessmentId = assessRes.rows[0].id;

      // Fast check: if already seeded 80 items, return immediately
      const countCheck = await db.query(
        `SELECT COUNT(*) as count FROM assessment_questions WHERE assessment_id = $1`,
        [assessmentId]
      );
      if (parseInt(countCheck.rows[0]?.count, 10) === 80) {
        logger.info("✨ Humanities Career Finder question bank already fully seeded (80 items).");
        if (!isExternalClient) await db.query("COMMIT");
        return;
      }

      // 2. Upsert Sections
      const sectionMap: Record<string, string> = {};
      for (const sec of HUMANITIES_CAREER_FINDER_SECTIONS) {
        const sRes = await db.query(
          `INSERT INTO assessment_sections (assessment_id, code, name, description, display_order, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW())
           ON CONFLICT (assessment_id, code) DO UPDATE SET
             name = EXCLUDED.name,
             description = EXCLUDED.description,
             display_order = EXCLUDED.display_order,
             updated_at = NOW()
           RETURNING id`,
          [assessmentId, sec.code, sec.name, sec.description, sec.displayOrder]
        );
        sectionMap[sec.code] = sRes.rows[0].id;
      }

      // 3. Upsert Dimensions
      const dimensionMap: Record<string, string> = {};
      for (const dim of HUMANITIES_CAREER_FINDER_DIMENSIONS) {
        const sectionId = sectionMap[dim.sectionCode];
        if (!sectionId) continue;

        const dRes = await db.query(
          `INSERT INTO assessment_dimensions (section_id, code, name, description, display_order, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW())
           ON CONFLICT (section_id, code) DO UPDATE SET
             name = EXCLUDED.name,
             description = EXCLUDED.description,
             display_order = EXCLUDED.display_order,
             updated_at = NOW()
           RETURNING id`,
          [sectionId, dim.code, dim.name, dim.description, dim.displayOrder]
        );
        dimensionMap[dim.code] = dRes.rows[0].id;
      }

      // 4. Upsert Questions & Options
      for (const q of HUMANITIES_CAREER_FINDER_QUESTIONS) {
        const sectionId = sectionMap[q.sectionCode];
        if (!sectionId) continue;

        const dimensionId = q.dimensionCode ? dimensionMap[q.dimensionCode] || null : null;
        const questionNumber = q.displayOrder;
        const maxPoints = q.questionType === "likert_1_5" ? 5.0 : 1.0;

        const qRes = await db.query(
          `INSERT INTO assessment_questions (
             assessment_id, section_id, dimension_id, question_number, question_text,
             question_type, max_points, is_required, display_order, updated_at
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
           ON CONFLICT (assessment_id, question_number) DO UPDATE SET
             section_id = EXCLUDED.section_id,
             dimension_id = EXCLUDED.dimension_id,
             question_text = EXCLUDED.question_text,
             question_type = EXCLUDED.question_type,
             max_points = EXCLUDED.max_points,
             display_order = EXCLUDED.display_order,
             updated_at = NOW()
           RETURNING id`,
          [
            assessmentId,
            sectionId,
            dimensionId,
            questionNumber,
            q.questionText,
            q.questionType,
            maxPoints,
            true,
            questionNumber,
          ]
        );
        const questionId = qRes.rows[0].id;

        // Upsert Options
        if (q.options && q.options.length > 0) {
          for (const opt of q.options) {
            await db.query(
              `INSERT INTO question_options (question_id, option_key, option_text, score_value, display_order, updated_at)
               VALUES ($1, $2, $3, $4, $5, NOW())
               ON CONFLICT (question_id, option_key) DO UPDATE SET
                 option_text = EXCLUDED.option_text,
                 score_value = EXCLUDED.score_value,
                 display_order = EXCLUDED.display_order,
                 updated_at = NOW()`,
              [questionId, opt.optionKey, opt.optionText, opt.scoreValue || 0, opt.displayOrder]
            );
          }
        }
      }

      if (!isExternalClient) {
        await db.query("COMMIT");
      }
      logger.info("✨ Humanities Career Finder 80-item question bank & options seeded successfully.");
    } catch (err) {
      if (!isExternalClient) {
        await db.query("ROLLBACK");
      }
      throw err;
    } finally {
      if (!isExternalClient) {
        db.release();
      }
    }
  }

  /**
   * Finds an existing active attempt for participant and assessment.
   */
  async findActiveAttempt(userId: string, assessmentId: string, client?: PoolClient): Promise<any> {
    const db = client || pool;
    const res = await db.query(
      `SELECT id, participant_id, assessment_id, status, current_question_index, total_questions, answered_count, started_at
       FROM assessment_attempts
       WHERE participant_id = $1 AND assessment_id = $2 AND status = 'IN_PROGRESS'
       ORDER BY started_at DESC
       LIMIT 1`,
      [userId, assessmentId]
    );
    return res.rows[0] || null;
  }

  /**
   * Finds the most recent active in-progress attempt for a participant across all assessments.
   */
  async findLatestActiveAttemptForUser(userId: string, client?: PoolClient): Promise<any> {
    const db = client || pool;
    const res = await db.query(
      `SELECT a.id, a.participant_id, a.assessment_id, a.version_id, a.status, a.current_question_index,
              a.total_questions, a.answered_count, a.started_at, a.completed_at,
              ass.code as assessment_code, ass.name as assessment_name,
              v.version_code, v.name as version_name, v.duration_minutes
       FROM assessment_attempts a
       JOIN assessments ass ON a.assessment_id = ass.id
       LEFT JOIN assessment_versions v ON a.version_id = v.id
       WHERE a.participant_id = $1 AND a.status = 'IN_PROGRESS'
       ORDER BY a.started_at DESC
       LIMIT 1`,
      [userId]
    );
    return res.rows[0] || null;
  }

  /**
   * Finds attempt by ID.
   */
  async findAttemptById(attemptId: string, client?: PoolClient | import("pg").Pool): Promise<any> {
    if (!attemptId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(attemptId)) {
      return null;
    }
    const db = client || pool;
    const res = await db.query(
      `SELECT a.id, a.participant_id, a.assessment_id, a.version_id, a.status, a.current_question_index,
              a.total_questions, a.answered_count, a.started_at, a.completed_at,
              ass.code as assessment_code, ass.name as assessment_name,
              v.version_code, v.name as version_name, v.duration_minutes
       FROM assessment_attempts a
       JOIN assessments ass ON a.assessment_id = ass.id
       LEFT JOIN assessment_versions v ON a.version_id = v.id
       WHERE a.id = $1
       LIMIT 1`,
      [attemptId]
    );
    return res.rows[0] || null;
  }

  /**
   * Finds question details by ID including type, section, and options.
   */
  async findQuestionById(questionId: string, client?: PoolClient | import("pg").Pool): Promise<any> {
    if (!questionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(questionId)) {
      return null;
    }
    const db = client || pool;
    const res = await db.query(
      `SELECT q.id, q.assessment_id, q.section_id, q.dimension_id, q.question_number,
              q.question_text, q.question_type, q.max_points,
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', o.id,
                    'optionKey', o.option_key,
                    'optionText', o.option_text,
                    'scoreValue', o.score_value
                  ) ORDER BY o.display_order ASC
                ) FILTER (WHERE o.id IS NOT NULL),
                '[]'
              ) as options
       FROM assessment_questions q
       LEFT JOIN question_options o ON q.id = o.question_id
       WHERE q.id = $1
       GROUP BY q.id`,
      [questionId]
    );
    return res.rows[0] || null;
  }

  /**
   * Creates a new attempt record.
   */
  async createAttempt(
    userId: string,
    assessmentId: string,
    versionId: string | null = null,
    totalQuestions = 68,
    client?: PoolClient
  ): Promise<any> {
    const db = client || pool;
    const res = await db.query(
      `INSERT INTO assessment_attempts (participant_id, assessment_id, version_id, status, total_questions, answered_count, started_at)
       VALUES ($1, $2, $3, 'IN_PROGRESS', $4, 0, NOW())
       RETURNING id, participant_id, assessment_id, version_id, status, current_question_index, total_questions, answered_count, started_at`,
      [userId, assessmentId, versionId, totalQuestions]
    );
    return res.rows[0];
  }

  /**
   * Retrieves sanitized questions with participant's saved responses in requested language
   * (gracefully falling back to English, strictly omitting correct keys/scoring).
   */
  async getAttemptQuestionsWithResponses(
    attemptId: string,
    languageCode = "en",
    client?: PoolClient
  ): Promise<AssessmentAttemptQuestionsResponseDTO | null> {
    const db = client || pool;

    const attempt = await this.findAttemptById(attemptId, db);
    if (!attempt) return null;

    const lang = (languageCode || "en").toLowerCase().trim();
    const hasVersion = Boolean(attempt.version_id);

    // Load Sections with Language Translation Fallback
    const secQuery = hasVersion
      ? `SELECT s.code,
                COALESCE(st.name, s.name) as name,
                COALESCE(st.description, s.description) as description,
                COUNT(vq.id) as total_questions,
                COUNT(r.id) as answered_questions
         FROM assessment_sections s
         LEFT JOIN section_translations st ON s.id = st.section_id AND st.language_code = $4
         JOIN assessment_questions q ON s.id = q.section_id
         JOIN assessment_version_questions vq ON q.id = vq.question_id AND vq.version_id = $1
         LEFT JOIN assessment_responses r ON q.id = r.question_id AND r.attempt_id = $2
         WHERE s.assessment_id = $3
         GROUP BY s.id, s.code, s.name, s.description, st.name, st.description, s.display_order
         ORDER BY s.display_order ASC`
      : `SELECT s.code,
                COALESCE(st.name, s.name) as name,
                COALESCE(st.description, s.description) as description,
                COUNT(q.id) as total_questions,
                COUNT(r.id) as answered_questions
         FROM assessment_sections s
         LEFT JOIN section_translations st ON s.id = st.section_id AND st.language_code = $3
         JOIN assessment_questions q ON s.id = q.section_id
         LEFT JOIN assessment_responses r ON q.id = r.question_id AND r.attempt_id = $1
         WHERE s.assessment_id = $2
         GROUP BY s.id, s.code, s.name, s.description, st.name, st.description, s.display_order
         ORDER BY s.display_order ASC`;

    const secParams = hasVersion
      ? [attempt.version_id, attemptId, attempt.assessment_id, lang]
      : [attemptId, attempt.assessment_id, lang];

    const secRes = await db.query(secQuery, secParams);

    const sections: AssessmentSectionSummaryDTO[] = secRes.rows.map((row) => ({
      code: row.code,
      name: row.name,
      description: row.description || null,
      totalQuestions: parseInt(row.total_questions, 10) || 0,
      answeredQuestions: parseInt(row.answered_questions, 10) || 0,
    }));

    // Load Questions with Options & Responses (STRICTLY omitting correct_key and score_value)
    const qQuery = hasVersion
      ? `SELECT
           q.id,
           vq.display_order as question_number,
           COALESCE(qt.question_text, q.question_text) as question_text,
           q.question_text as original_question_text,
           q.question_type, q.image_url, vq.is_required,
           s.code as section_code,
           COALESCE(st.name, s.name) as section_name,
           d.code as dimension_code,
           COALESCE(dt.name, d.name) as dimension_name,
           r.selected_option_id as current_selected_option_id,
           r.response_value as current_response_value,
           COALESCE(
             json_agg(
               json_build_object(
                 'id', o.id,
                 'optionKey', o.option_key,
                 'optionText', COALESCE(ot.option_text, o.option_text),
                 'originalOptionText', o.option_text,
                 'displayOrder', o.display_order
               ) ORDER BY o.display_order ASC
             ) FILTER (WHERE o.id IS NOT NULL),
             '[]'
           ) as options
         FROM assessment_version_questions vq
         JOIN assessment_questions q ON vq.question_id = q.id
         LEFT JOIN question_translations qt ON q.id = qt.question_id AND qt.language_code = $3
         JOIN assessment_sections s ON q.section_id = s.id
         LEFT JOIN section_translations st ON s.id = st.section_id AND st.language_code = $3
         LEFT JOIN assessment_dimensions d ON q.dimension_id = d.id
         LEFT JOIN dimension_translations dt ON d.id = dt.dimension_id AND dt.language_code = $3
         LEFT JOIN question_options o ON q.id = o.question_id
         LEFT JOIN option_translations ot ON o.id = ot.option_id AND ot.language_code = $3
         LEFT JOIN assessment_responses r ON q.id = r.question_id AND r.attempt_id = $1
         WHERE vq.version_id = $2
         GROUP BY q.id, vq.display_order, q.question_text, qt.question_text, q.question_type, q.image_url, vq.is_required,
                  s.code, s.name, st.name, d.code, d.name, dt.name, r.selected_option_id, r.response_value
         ORDER BY vq.display_order ASC`
      : `SELECT
           q.id, q.question_number,
           COALESCE(qt.question_text, q.question_text) as question_text,
           q.question_text as original_question_text,
           q.question_type, q.image_url, q.is_required,
           s.code as section_code,
           COALESCE(st.name, s.name) as section_name,
           d.code as dimension_code,
           COALESCE(dt.name, d.name) as dimension_name,
           r.selected_option_id as current_selected_option_id,
           r.response_value as current_response_value,
           COALESCE(
             json_agg(
               json_build_object(
                 'id', o.id,
                 'optionKey', o.option_key,
                 'optionText', COALESCE(ot.option_text, o.option_text),
                 'originalOptionText', o.option_text,
                 'displayOrder', o.display_order
               ) ORDER BY o.display_order ASC
             ) FILTER (WHERE o.id IS NOT NULL),
             '[]'
           ) as options
         FROM assessment_questions q
         LEFT JOIN question_translations qt ON q.id = qt.question_id AND qt.language_code = $3
         JOIN assessment_sections s ON q.section_id = s.id
         LEFT JOIN section_translations st ON s.id = st.section_id AND st.language_code = $3
         LEFT JOIN assessment_dimensions d ON q.dimension_id = d.id
         LEFT JOIN dimension_translations dt ON d.id = dt.dimension_id AND dt.language_code = $3
         LEFT JOIN question_options o ON q.id = o.question_id
         LEFT JOIN option_translations ot ON o.id = ot.option_id AND ot.language_code = $3
         LEFT JOIN assessment_responses r ON q.id = r.question_id AND r.attempt_id = $1
         WHERE q.assessment_id = $2
         GROUP BY q.id, q.question_number, q.question_text, qt.question_text, q.question_type, q.image_url, q.is_required,
                  s.code, s.name, st.name, d.code, d.name, dt.name, r.selected_option_id, r.response_value
         ORDER BY q.display_order ASC`;

    const qParams = hasVersion
      ? [attemptId, attempt.version_id, lang]
      : [attemptId, attempt.assessment_id, lang];

    const qRes = await db.query(qQuery, qParams);

    const questions: SanitizedQuestionDTO[] = qRes.rows.map((row) => ({
      id: row.id,
      questionNumber: parseInt(row.question_number, 10),
      sectionCode: row.section_code,
      sectionName: row.section_name,
      dimensionCode: row.dimension_code || "GENERAL",
      dimensionName: row.dimension_name || "General",
      questionText: row.question_text,
      originalQuestionText: row.original_question_text || null,
      questionType: row.question_type,
      imageUrl: row.image_url || null,
      isRequired: Boolean(row.is_required),
      options: row.options || [],
      currentResponse: row.current_response_value !== null || row.current_selected_option_id !== null
        ? {
            selectedOptionId: row.current_selected_option_id,
            responseValue: row.current_response_value,
          }
        : null,
    }));

    return {
      attemptId: attempt.id,
      assessmentCode: attempt.assessment_code,
      assessmentName: attempt.assessment_name,
      versionId: attempt.version_id || null,
      versionCode: attempt.version_code || null,
      versionName: attempt.version_name || null,
      durationMinutes: attempt.duration_minutes || 30,
      currentLanguage: lang,
      supportedLanguages: SUPPORTED_ASSESSMENT_LANGUAGES,
      status: attempt.status,
      startedAt: attempt.started_at ? new Date(attempt.started_at).toISOString() : null,
      serverTime: new Date().toISOString(),
      totalQuestions: parseInt(attempt.total_questions, 10) || questions.length,
      answeredCount: parseInt(attempt.answered_count, 10) || 0,
      currentQuestionIndex: parseInt(attempt.current_question_index, 10) || 0,
      sections,
      questions,
    };
  }

  /**
   * Saves a participant's response to a question idempotently.
   */
  async saveResponse(
    attemptId: string,
    questionId: string,
    selectedOptionId: string | null,
    responseValue: string,
    score = 0,
    client?: PoolClient
  ): Promise<void> {
    const db = client || pool;

    await db.query(
      `INSERT INTO assessment_responses (attempt_id, question_id, selected_option_id, response_value, score, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (attempt_id, question_id) DO UPDATE SET
         selected_option_id = EXCLUDED.selected_option_id,
         response_value = EXCLUDED.response_value,
         score = EXCLUDED.score,
         updated_at = NOW()`,
      [attemptId, questionId, selectedOptionId || null, responseValue, score]
    );

    // Update answered count on attempt
    await db.query(
      `UPDATE assessment_attempts
       SET answered_count = (
         SELECT COUNT(*) FROM assessment_responses WHERE attempt_id = $1
       ),
       updated_at = NOW()
       WHERE id = $1`,
      [attemptId]
    );
  }

  /**
   * Updates the participant's current question index cursor.
   */
  async updateAttemptCursor(attemptId: string, currentIndex: number, client?: PoolClient): Promise<void> {
    const db = client || pool;
    await db.query(
      `UPDATE assessment_attempts
       SET current_question_index = $2, updated_at = NOW()
       WHERE id = $1`,
      [attemptId, currentIndex]
    );
  }

  /**
   * Loads raw responses, keys, and questions for scoring scoped to the active version.
   */
  async loadAttemptResponsesForScoring(attemptId: string, client?: PoolClient): Promise<any[]> {
    const db = client || pool;
    const attempt = await this.findAttemptById(attemptId, db);
    const hasVersion = Boolean(attempt?.version_id);

    const query = hasVersion
      ? `SELECT
           q.id as question_id,
           q.question_number,
           vq.display_order as version_display_order,
           q.question_type,
           q.correct_key,
           q.max_points,
           s.code as section_code,
           s.name as section_name,
           d.code as dimension_code,
           d.name as dimension_name,
           r.selected_option_id,
           r.response_value,
           o.option_key,
           o.score_value
         FROM assessment_version_questions vq
         JOIN assessment_questions q ON vq.question_id = q.id
         JOIN assessment_sections s ON q.section_id = s.id
         LEFT JOIN assessment_dimensions d ON q.dimension_id = d.id
         LEFT JOIN assessment_responses r ON q.id = r.question_id AND r.attempt_id = $1
         LEFT JOIN question_options o ON r.selected_option_id = o.id
         WHERE vq.version_id = $2
         ORDER BY vq.display_order ASC`
      : `SELECT
           q.id as question_id,
           q.question_number,
           q.display_order as version_display_order,
           q.question_type,
           q.correct_key,
           q.max_points,
           s.code as section_code,
           s.name as section_name,
           d.code as dimension_code,
           d.name as dimension_name,
           r.selected_option_id,
           r.response_value,
           o.option_key,
           o.score_value
         FROM assessment_questions q
         JOIN assessment_sections s ON q.section_id = s.id
         LEFT JOIN assessment_dimensions d ON q.dimension_id = d.id
         LEFT JOIN assessment_responses r ON q.id = r.question_id AND r.attempt_id = $1
         LEFT JOIN question_options o ON r.selected_option_id = o.id
         WHERE q.assessment_id = $2
         ORDER BY q.display_order ASC`;

    const params = hasVersion
      ? [attemptId, attempt.version_id]
      : [attemptId, attempt?.assessment_id];

    const res = await db.query(query, params);
    return res.rows;
  }

  /**
   * Marks attempt as COMPLETED and persists final result.
   */
  async finalizeAttemptAndSaveResult(
    attemptId: string,
    participantId: string,
    assessmentCode: string,
    resultData: any,
    client?: PoolClient
  ): Promise<string> {
    const db = client || pool;

    await db.query(
      `UPDATE assessment_attempts
       SET status = 'COMPLETED', completed_at = NOW(), updated_at = NOW()
       WHERE id = $1`,
      [attemptId]
    );

    const profileType =
      resultData?.learningProfile?.archetypeTitle ||
      (resultData?.primaryStream ? `${resultData.primaryStream} Stream` : null) ||
      resultData?.profileType ||
      null;

    const summary =
      resultData?.learningProfile?.strengthSummary ||
      resultData?.counsellingSummary ||
      resultData?.summary ||
      null;

    const profileVector = resultData?.profileVector || null;
    const profileConfidence =
      resultData?.profileConfidence ||
      resultData?.confidence?.level ||
      resultData?.clarity ||
      resultData?.responseQuality?.consistencySignal ||
      null;

    const confidenceMetrics =
      resultData?.confidenceMetrics ||
      resultData?.confidence ||
      resultData?.responseQuality ||
      (resultData?.scoreGap != null ? { scoreGap: resultData.scoreGap, clarity: resultData.clarity } : null) ||
      null;

    const dimensionScores = resultData?.streamScores
      ? { streamScores: resultData.streamScores, sectionBreakdown: resultData.sectionBreakdown }
      : {
          interest: resultData?.interestDiscovery?.dimensions || [],
          skills: resultData?.skillBehaviour?.dimensions || [],
          aptitude: resultData?.demonstratedAptitude?.dimensions || [],
          strengths: resultData?.developmentalStrengths?.dimensions || [],
        };

    const res = await db.query(
      `INSERT INTO assessment_results (attempt_id, participant_id, assessment_code, profile_type, summary, dimension_scores, profile_vector, profile_confidence, confidence_metrics, result_data, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       ON CONFLICT (attempt_id) DO UPDATE SET
         profile_type = EXCLUDED.profile_type,
         summary = EXCLUDED.summary,
         dimension_scores = EXCLUDED.dimension_scores,
         profile_vector = EXCLUDED.profile_vector,
         profile_confidence = EXCLUDED.profile_confidence,
         confidence_metrics = EXCLUDED.confidence_metrics,
         result_data = EXCLUDED.result_data,
         updated_at = NOW()
       RETURNING id`,
      [
        attemptId,
        participantId,
        assessmentCode,
        profileType,
        summary,
        JSON.stringify(dimensionScores),
        profileVector ? JSON.stringify(profileVector) : null,
        profileConfidence,
        confidenceMetrics ? JSON.stringify(confidenceMetrics) : null,
        JSON.stringify(resultData),
      ]
    );

    const resultId = res.rows[0].id;

    // Record into assessment history ledger
    try {
      const attemptRow = await db.query(
        `SELECT assessment_id, completed_at FROM assessment_attempts WHERE id = $1`,
        [attemptId]
      );
      if (attemptRow.rows[0]) {
        const assessmentId = attemptRow.rows[0].assessment_id;
        const completedDate = attemptRow.rows[0].completed_at || new Date();
        await this.recordAssessmentHistory(
          participantId,
          assessmentId,
          attemptId,
          resultId,
          profileType,
          dimensionScores,
          completedDate,
          db
        );
      }
    } catch (err) {
      logger.error({ err, attemptId, participantId }, "Error recording assessment history ledger");
    }

    return resultId;
  }

  /**
   * Records completed attempt into assessment_history ledger idempotently.
   */
  async recordAssessmentHistory(
    studentId: string,
    assessmentId: string,
    attemptId: string,
    resultId: string,
    profileType: string | null,
    dimensionSummary: any,
    completedDate: Date | string = new Date(),
    client?: PoolClient | import("pg").Pool
  ): Promise<void> {
    const db = client || pool;

    // Determine sequential attempt number
    const countRes = await db.query(
      `SELECT COUNT(*) as total_attempts FROM assessment_history
       WHERE student_id = $1 AND assessment_id = $2 AND attempt_id != $3`,
      [studentId, assessmentId, attemptId]
    );
    const attemptNumber = (parseInt(countRes.rows[0]?.total_attempts, 10) || 0) + 1;

    await db.query(
      `INSERT INTO assessment_history (
         student_id, assessment_id, attempt_id, result_id, attempt_number,
         profile_type, dimension_summary, completed_date, created_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (attempt_id) DO UPDATE SET
         result_id = EXCLUDED.result_id,
         profile_type = EXCLUDED.profile_type,
         dimension_summary = EXCLUDED.dimension_summary,
         completed_date = EXCLUDED.completed_date`,
      [
        studentId,
        assessmentId,
        attemptId,
        resultId,
        attemptNumber,
        profileType,
        dimensionSummary ? JSON.stringify(dimensionSummary) : null,
        completedDate,
      ]
    );
  }

  /**
   * Retrieves chronological assessment history ledger for a student.
   */
  async getAssessmentHistoryByStudent(
    studentId: string,
    assessmentCode = "SKILL_FINDER",
    client?: PoolClient
  ): Promise<any[]> {
    const db = client || pool;
    const res = await db.query(
      `SELECT h.id, h.student_id, h.assessment_id, h.attempt_id, h.result_id,
              h.attempt_number, h.profile_type, h.dimension_summary, h.completed_date, h.created_at,
              a.code as assessment_code, a.name as assessment_name,
              att.started_at, att.total_questions, att.answered_count,
              r.summary, r.profile_vector, r.profile_confidence, r.confidence_metrics, r.result_data
       FROM assessment_history h
       JOIN assessments a ON h.assessment_id = a.id
       JOIN assessment_attempts att ON h.attempt_id = att.id
       JOIN assessment_results r ON h.result_id = r.id
       WHERE h.student_id = $1 AND (a.code = $2 OR UPPER(REPLACE(a.code, '-', '_')) = UPPER(REPLACE($2, '-', '_')))
       ORDER BY h.attempt_number DESC, h.created_at DESC`,
      [studentId, assessmentCode]
    );

    // If history table has no entries but assessment_results has entries (migration fallback), sync and return
    if (res.rows.length === 0) {
      const allResults = await db.query(
        `SELECT r.id as result_id, r.attempt_id, r.participant_id as student_id, r.assessment_code,
                r.profile_type, r.dimension_scores as dimension_summary, r.summary, r.profile_vector,
                r.profile_confidence, r.confidence_metrics, r.result_data, r.created_at,
                a.id as assessment_id, a.name as assessment_name,
                att.started_at, att.completed_at, att.total_questions, att.answered_count
         FROM assessment_results r
         JOIN assessment_attempts att ON r.attempt_id = att.id
         JOIN assessments a ON att.assessment_id = a.id
         WHERE r.participant_id = $1 AND (a.code = $2 OR UPPER(REPLACE(a.code, '-', '_')) = UPPER(REPLACE($2, '-', '_')))
         ORDER BY att.started_at ASC`,
        [studentId, assessmentCode]
      );

      for (let i = 0; i < allResults.rows.length; i++) {
        const row = allResults.rows[i];
        await this.recordAssessmentHistory(
          studentId,
          row.assessment_id,
          row.attempt_id,
          row.result_id,
          row.profile_type,
          row.dimension_summary,
          row.completed_at || row.created_at,
          db
        );
      }

      if (allResults.rows.length > 0) {
        return this.getAssessmentHistoryByStudent(studentId, assessmentCode, client);
      }
    }

    return res.rows;
  }

  /**
   * Retrieves top 2 latest completed assessment results for longitudinal comparison.
   */
  async findLatestTwoResultsForUser(
    studentId: string,
    assessmentCode = "SKILL_FINDER",
    client?: PoolClient
  ): Promise<any[]> {
    const db = client || pool;
    const res = await db.query(
      `SELECT r.id, r.attempt_id, r.participant_id, r.assessment_code, r.profile_type, r.summary,
              r.dimension_scores, r.profile_vector, r.profile_confidence, r.confidence_metrics,
              r.result_data, r.created_at,
              a.started_at, a.completed_at
       FROM assessment_results r
       JOIN assessment_attempts a ON r.attempt_id = a.id
       WHERE r.participant_id = $1 AND (r.assessment_code = $2 OR UPPER(REPLACE(r.assessment_code, '-', '_')) = UPPER(REPLACE($2, '-', '_')))
       ORDER BY a.completed_at DESC NULLS LAST, r.created_at DESC
       LIMIT 2`,
      [studentId, assessmentCode]
    );
    return res.rows;
  }


  /**
   * Saves or updates a cached longitudinal growth comparison.
   */
  async saveComparison(
    studentId: string,
    oldResultId: string,
    newResultId: string,
    daysBetween: number,
    comparisonData: any,
    client?: PoolClient
  ): Promise<string> {
    const db = client || pool;
    const res = await db.query(
      `INSERT INTO assessment_comparisons (student_id, old_result_id, new_result_id, days_between, comparison_data, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (student_id, old_result_id, new_result_id) DO UPDATE SET
         days_between = EXCLUDED.days_between,
         comparison_data = EXCLUDED.comparison_data
       RETURNING id`,
      [studentId, oldResultId, newResultId, daysBetween, JSON.stringify(comparisonData)]
    );
    return res.rows[0].id;
  }

  /**
   * Retrieves a cached comparison if present.
   */
  async findComparison(
    studentId: string,
    oldResultId: string,
    newResultId: string,
    client?: PoolClient
  ): Promise<any | null> {
    const db = client || pool;
    const res = await db.query(
      `SELECT id, student_id, old_result_id, new_result_id, days_between, comparison_data, created_at
       FROM assessment_comparisons
       WHERE student_id = $1 AND old_result_id = $2 AND new_result_id = $3
       LIMIT 1`,
      [studentId, oldResultId, newResultId]
    );
    return res.rows[0] || null;
  }

  /**
   * Retrieves saved result by result ID or attempt ID.
   */
  async findResultById(resultId: string, client?: PoolClient): Promise<any | null> {
    if (!resultId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resultId)) {
      return null;
    }
    const db = client || pool;
    const res = await db.query(
      `SELECT r.id, r.attempt_id, r.participant_id, r.assessment_code, r.profile_type, r.summary,
              r.dimension_scores, r.profile_vector, r.profile_confidence, r.confidence_metrics,
              r.result_data, r.created_at,
              a.started_at, a.completed_at,
              u.first_name, u.last_name, u.email
       FROM assessment_results r
       JOIN assessment_attempts a ON r.attempt_id = a.id
       JOIN users u ON r.participant_id = u.id
       WHERE r.id = $1 OR r.attempt_id = $1`,
      [resultId]
    );
    return res.rows[0] || null;
  }

  /**
   * Retrieves saved result by attempt ID or result ID.
   */
  async findResultByAttemptId(attemptId: string, client?: PoolClient): Promise<any | null> {
    if (!attemptId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(attemptId)) {
      return null;
    }
    const db = client || pool;
    const res = await db.query(
      `SELECT r.id, r.attempt_id, r.participant_id, r.assessment_code, r.profile_type, r.summary,
              r.dimension_scores, r.result_data, r.created_at,
              a.started_at, a.completed_at,
              u.first_name, u.last_name, u.email
       FROM assessment_results r
       JOIN assessment_attempts a ON r.attempt_id = a.id
       JOIN users u ON r.participant_id = u.id
       WHERE (r.attempt_id = $1 OR r.id = $1)
       LIMIT 1`,
      [attemptId]
    );
    return res.rows[0] || null;
  }

  /**
   * Retrieves the latest completed assessment result for a participant.
   */
  async findLatestResultByUserId(participantId: string, client?: PoolClient): Promise<any | null> {
    if (!participantId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(participantId)) {
      return null;
    }
    const db = client || pool;
    const res = await db.query(
      `SELECT r.id, r.attempt_id, r.participant_id, r.assessment_code, r.result_data, r.created_at,
              a.started_at, a.completed_at,
              u.first_name, u.last_name, u.email
       FROM assessment_results r
       JOIN assessment_attempts a ON r.attempt_id = a.id
       JOIN users u ON r.participant_id = u.id
       WHERE r.participant_id = $1
       ORDER BY r.created_at DESC
       LIMIT 1`,
      [participantId]
    );
    return res.rows[0] || null;
  }

  /**
   * Retrieves all completed assessment results for a participant.
   */
  async findAllResultsByUserId(participantId: string, client?: PoolClient): Promise<any[]> {
    if (!participantId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(participantId)) {
      return [];
    }
    const db = client || pool;
    const res = await db.query(
      `SELECT r.id, r.attempt_id, r.participant_id, r.assessment_code, r.result_data, r.created_at,
              a.started_at, a.completed_at
       FROM assessment_results r
       JOIN assessment_attempts a ON r.attempt_id = a.id
       WHERE r.participant_id = $1
       ORDER BY r.created_at DESC`,
      [participantId]
    );
    return res.rows;
  }
}

export const assessmentContentRepository = new AssessmentContentRepository();
