import { PoolClient } from "pg";
import { pool } from "../../config/database";
import { logger } from "../../common/utils/logger";
import {
  SKILL_FINDER_SECTIONS,
  SKILL_FINDER_QUESTIONS,
} from "./content/skill-finder-catalog.data";
import {
  SanitizedQuestionDTO,
  AssessmentSectionSummaryDTO,
  AssessmentAttemptQuestionsResponseDTO,
} from "./assessment-runner.types";

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

      -- 5. Assessment Attempts
      CREATE TABLE IF NOT EXISTS assessment_attempts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        participant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
        current_question_index INTEGER NOT NULL DEFAULT 0,
        total_questions INTEGER NOT NULL DEFAULT 104,
        answered_count INTEGER NOT NULL DEFAULT 0,
        started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- 6. Assessment Responses
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

      -- 7. Assessment Results
      CREATE TABLE IF NOT EXISTS assessment_results (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        attempt_id UUID NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE UNIQUE,
        participant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assessment_code VARCHAR(100) NOT NULL,
        result_data JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Indexes for fast query retrieval
      CREATE INDEX IF NOT EXISTS idx_questions_assessment_id ON assessment_questions(assessment_id);
      CREATE INDEX IF NOT EXISTS idx_questions_section_id ON assessment_questions(section_id);
      CREATE INDEX IF NOT EXISTS idx_question_options_qid ON question_options(question_id);
      CREATE INDEX IF NOT EXISTS idx_attempts_participant_status ON assessment_attempts(participant_id, status);
      CREATE INDEX IF NOT EXISTS idx_responses_attempt_id ON assessment_responses(attempt_id);
      CREATE INDEX IF NOT EXISTS idx_results_participant_code ON assessment_results(participant_id, assessment_code);
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
   * Finds attempt by ID.
   */
  async findAttemptById(attemptId: string, client?: PoolClient | import("pg").Pool): Promise<any> {
    const db = client || pool;
    const res = await db.query(
      `SELECT a.id, a.participant_id, a.assessment_id, a.status, a.current_question_index,
              a.total_questions, a.answered_count, a.started_at, a.completed_at,
              ass.code as assessment_code, ass.name as assessment_name
       FROM assessment_attempts a
       JOIN assessments ass ON a.assessment_id = ass.id
       WHERE a.id = $1
       LIMIT 1`,
      [attemptId]
    );
    return res.rows[0] || null;
  }

  /**
   * Creates a new attempt record.
   */
  async createAttempt(
    userId: string,
    assessmentId: string,
    totalQuestions = 104,
    client?: PoolClient
  ): Promise<any> {
    const db = client || pool;
    const res = await db.query(
      `INSERT INTO assessment_attempts (participant_id, assessment_id, status, total_questions, answered_count, started_at)
       VALUES ($1, $2, 'IN_PROGRESS', $3, 0, NOW())
       RETURNING id, participant_id, assessment_id, status, current_question_index, total_questions, answered_count, started_at`,
      [userId, assessmentId, totalQuestions]
    );
    return res.rows[0];
  }

  /**
   * Retrieves sanitized questions with participant's saved responses (without leaking correct keys/scoring).
   */
  async getAttemptQuestionsWithResponses(
    attemptId: string,
    client?: PoolClient
  ): Promise<AssessmentAttemptQuestionsResponseDTO | null> {
    const db = client || pool;

    const attempt = await this.findAttemptById(attemptId, db);
    if (!attempt) return null;

    // Load Sections
    const secRes = await db.query(
      `SELECT s.code, s.name, s.description,
              COUNT(q.id) as total_questions,
              COUNT(r.id) as answered_questions
       FROM assessment_sections s
       JOIN assessment_questions q ON s.id = q.section_id
       LEFT JOIN assessment_responses r ON q.id = r.question_id AND r.attempt_id = $1
       WHERE s.assessment_id = $2
       GROUP BY s.id, s.code, s.name, s.description, s.display_order
       ORDER BY s.display_order ASC`,
      [attemptId, attempt.assessment_id]
    );

    const sections: AssessmentSectionSummaryDTO[] = secRes.rows.map((row) => ({
      code: row.code,
      name: row.name,
      description: row.description || null,
      totalQuestions: parseInt(row.total_questions, 10) || 0,
      answeredQuestions: parseInt(row.answered_questions, 10) || 0,
    }));

    // Load Questions with Options and Responses (STRICTLY omitting correct_key and score_value)
    const qRes = await db.query(
      `SELECT
         q.id, q.question_number, q.question_text, q.question_type, q.image_url, q.is_required,
         s.code as section_code, s.name as section_name,
         d.code as dimension_code, d.name as dimension_name,
         r.selected_option_id as current_selected_option_id,
         r.response_value as current_response_value,
         COALESCE(
           json_agg(
             json_build_object(
               'id', o.id,
               'optionKey', o.option_key,
               'optionText', o.option_text,
               'displayOrder', o.display_order
             ) ORDER BY o.display_order ASC
           ) FILTER (WHERE o.id IS NOT NULL),
           '[]'
         ) as options
       FROM assessment_questions q
       JOIN assessment_sections s ON q.section_id = s.id
       LEFT JOIN assessment_dimensions d ON q.dimension_id = d.id
       LEFT JOIN question_options o ON q.id = o.question_id
       LEFT JOIN assessment_responses r ON q.id = r.question_id AND r.attempt_id = $1
       WHERE q.assessment_id = $2
       GROUP BY q.id, q.question_number, q.question_text, q.question_type, q.image_url, q.is_required,
                s.code, s.name, d.code, d.name, r.selected_option_id, r.response_value
       ORDER BY q.display_order ASC`,
      [attemptId, attempt.assessment_id]
    );

    const questions: SanitizedQuestionDTO[] = qRes.rows.map((row) => ({
      id: row.id,
      questionNumber: parseInt(row.question_number, 10),
      sectionCode: row.section_code,
      sectionName: row.section_name,
      dimensionCode: row.dimension_code || "GENERAL",
      dimensionName: row.dimension_name || "General",
      questionText: row.question_text,
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
      status: attempt.status,
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
   * Loads all raw responses, keys, and questions for scoring.
   */
  async loadAttemptResponsesForScoring(attemptId: string, client?: PoolClient): Promise<any[]> {
    const db = client || pool;
    const res = await db.query(
      `SELECT
         q.id as question_id,
         q.question_number,
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
       ORDER BY q.display_order ASC`,
      [attemptId]
    );
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

    const res = await db.query(
      `INSERT INTO assessment_results (attempt_id, participant_id, assessment_code, result_data, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (attempt_id) DO UPDATE SET
         result_data = EXCLUDED.result_data,
         updated_at = NOW()
       RETURNING id`,
      [attemptId, participantId, assessmentCode, JSON.stringify(resultData)]
    );

    return res.rows[0].id;
  }

  /**
   * Retrieves saved result by attempt ID.
   */
  async findResultByAttemptId(attemptId: string, client?: PoolClient): Promise<any | null> {
    const db = client || pool;
    const res = await db.query(
      `SELECT r.id, r.attempt_id, r.participant_id, r.assessment_code, r.result_data, r.created_at,
              a.started_at, a.completed_at,
              u.first_name, u.last_name, u.email
       FROM assessment_results r
       JOIN assessment_attempts a ON r.attempt_id = a.id
       JOIN users u ON r.participant_id = u.id
       WHERE r.attempt_id = $1
       LIMIT 1`,
      [attemptId]
    );
    return res.rows[0] || null;
  }
}

export const assessmentContentRepository = new AssessmentContentRepository();
