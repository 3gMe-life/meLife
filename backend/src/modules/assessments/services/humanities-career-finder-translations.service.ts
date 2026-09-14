import { PoolClient } from "pg";
import { pool } from "../../../config/database";
import { logger } from "../../../common/utils/logger";
import {
  HUMANITIES_CAREER_FINDER_SECTION_TRANSLATIONS,
  HUMANITIES_CAREER_FINDER_DIMENSION_TRANSLATIONS,
  HUMANITIES_CAREER_FINDER_LIKERT_OPTIONS,
  HUMANITIES_CAREER_FINDER_MCQ_OPTIONS,
  HUMANITIES_CAREER_FINDER_QUESTION_TRANSLATIONS,
} from "./humanities-career-finder-translations.data";

export class HumanitiesCareerFinderTranslationsService {
  /**
   * Seeds official Humanities Career Finder section, dimension, option, and question translations idempotently and ultra-fast
   * via PostgreSQL JSON batch operations across all 5 supported languages (ml, hi, ta, kn, ar).
   */
  async seedHumanitiesCareerFinderTranslations(client?: PoolClient): Promise<void> {
    const db = client || pool;

    // 1. Locate HUMANITIES_CAREER_FINDER assessment ID
    const assessRes = await db.query(
      `SELECT id FROM assessments WHERE code = 'HUMANITIES_CAREER_FINDER' LIMIT 1`
    );
    if (!assessRes.rows[0]) {
      logger.warn("HUMANITIES_CAREER_FINDER assessment not found, skipping translation seeding");
      return;
    }
    const assessmentId = assessRes.rows[0].id;

    logger.info("⏳ Seeding Humanities Career Finder multilingual translations (ml, hi, ta, kn, ar)...");

    // 2. Batch upsert Section Translations
    const sectionPayload = HUMANITIES_CAREER_FINDER_SECTION_TRANSLATIONS.map((s) => ({
      section_code: s.sectionCode,
      language_code: s.languageCode,
      name: s.name,
      description: s.description,
    }));

    await db.query(
      `INSERT INTO section_translations (section_id, language_code, name, description, updated_at)
       SELECT s.id, t.language_code, t.name, t.description, NOW()
       FROM json_to_recordset($1) AS t(section_code varchar, language_code varchar, name varchar, description text)
       JOIN assessment_sections s ON s.code = t.section_code AND s.assessment_id = $2
       ON CONFLICT (section_id, language_code) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         updated_at = NOW()`,
      [JSON.stringify(sectionPayload), assessmentId]
    );

    // 3. Batch upsert Dimension Translations
    const dimPayload = HUMANITIES_CAREER_FINDER_DIMENSION_TRANSLATIONS.map((d) => ({
      dimension_code: d.dimensionCode,
      language_code: d.languageCode,
      name: d.name,
    }));

    await db.query(
      `INSERT INTO dimension_translations (dimension_id, language_code, name, updated_at)
       SELECT d.id, t.language_code, t.name, NOW()
       FROM json_to_recordset($1) AS t(dimension_code varchar, language_code varchar, name varchar)
       JOIN assessment_sections s ON s.assessment_id = $2
       JOIN assessment_dimensions d ON d.section_id = s.id AND d.code = t.dimension_code
       ON CONFLICT (dimension_id, language_code) DO UPDATE SET
         name = EXCLUDED.name,
         updated_at = NOW()`,
      [JSON.stringify(dimPayload), assessmentId]
    );

    // 4. Batch upsert Likert 1-5 Option Translations across all 1-60 Likert questions
    const likertPayload = HUMANITIES_CAREER_FINDER_LIKERT_OPTIONS.map((l) => ({
      option_key: l.optionKey,
      language_code: l.languageCode,
      option_text: l.optionText,
    }));

    await db.query(
      `INSERT INTO option_translations (option_id, language_code, option_text, updated_at)
       SELECT o.id, t.language_code, t.option_text, NOW()
       FROM json_to_recordset($1) AS t(option_key varchar, language_code varchar, option_text text)
       JOIN assessment_questions q ON q.assessment_id = $2 AND q.question_type = 'likert_1_5'
       JOIN question_options o ON o.question_id = q.id AND o.option_key = t.option_key
       ON CONFLICT (option_id, language_code) DO UPDATE SET
         option_text = EXCLUDED.option_text,
         updated_at = NOW()`,
      [JSON.stringify(likertPayload), assessmentId]
    );

    // 5. Batch upsert Scenario MCQ Option Translations (Q61 to Q80)
    const mcqPayload = HUMANITIES_CAREER_FINDER_MCQ_OPTIONS.map((m) => ({
      question_number: m.questionNumber,
      option_key: m.optionKey,
      language_code: m.languageCode,
      option_text: m.optionText,
    }));

    await db.query(
      `INSERT INTO option_translations (option_id, language_code, option_text, updated_at)
       SELECT o.id, t.language_code, t.option_text, NOW()
       FROM json_to_recordset($1) AS t(question_number integer, option_key varchar, language_code varchar, option_text text)
       JOIN assessment_questions q ON q.assessment_id = $2 AND q.question_number = t.question_number
       JOIN question_options o ON o.question_id = q.id AND o.option_key = t.option_key
       ON CONFLICT (option_id, language_code) DO UPDATE SET
         option_text = EXCLUDED.option_text,
         updated_at = NOW()`,
      [JSON.stringify(mcqPayload), assessmentId]
    );

    // 6. Batch upsert Question Translations (80 questions across 5 languages)
    const questionPayload = HUMANITIES_CAREER_FINDER_QUESTION_TRANSLATIONS.map((qt) => ({
      question_number: qt.questionNumber,
      language_code: qt.languageCode,
      question_text: qt.questionText,
    }));

    await db.query(
      `INSERT INTO question_translations (question_id, language_code, question_text, updated_at)
       SELECT q.id, t.language_code, t.question_text, NOW()
       FROM json_to_recordset($1) AS t(question_number integer, language_code varchar, question_text text)
       JOIN assessment_questions q ON q.assessment_id = $2 AND q.question_number = t.question_number
       ON CONFLICT (question_id, language_code) DO UPDATE SET
         question_text = EXCLUDED.question_text,
         updated_at = NOW()`,
      [JSON.stringify(questionPayload), assessmentId]
    );

    logger.info(
      `✨ Humanities Career Finder multilingual translations seeded successfully (${HUMANITIES_CAREER_FINDER_QUESTION_TRANSLATIONS.length} questions across ml, hi, ta, kn, ar).`
    );
  }
}

export const humanitiesCareerFinderTranslationsService = new HumanitiesCareerFinderTranslationsService();
