import { PoolClient } from "pg";
import { pool } from "../../../config/database";
import { logger } from "../../../common/utils/logger";
import {
  AI_JOB_RISK_FINDER_SECTION_TRANSLATIONS,
  AI_JOB_RISK_FINDER_DIMENSION_TRANSLATIONS,
  AI_JOB_RISK_FINDER_LIKERT_OPTIONS,
  AI_JOB_RISK_FINDER_QUESTION_TRANSLATIONS,
} from "./ai-job-risk-finder-translations.data";

export class AiJobRiskFinderTranslationsService {
  /**
   * Seeds official AI Job Risk Finder section, dimension, option, and question translations idempotently and ultra-fast
   * via PostgreSQL JSON batch operations across all 5 supported languages (ml, hi, ta, kn, ar).
   */
  async seedAiJobRiskFinderTranslations(client?: PoolClient): Promise<void> {
    const db = client || pool;

    // 1. Locate AI_JOB_RISK_FINDER assessment ID
    const assessRes = await db.query(
      `SELECT id FROM assessments WHERE code = 'AI_JOB_RISK_FINDER' LIMIT 1`
    );
    if (!assessRes.rows[0]) {
      logger.warn("AI_JOB_RISK_FINDER assessment not found, skipping translation seeding");
      return;
    }
    const assessmentId = assessRes.rows[0].id;

    logger.info("⏳ Seeding AI Job Risk Finder multilingual translations (ml, hi, ta, kn, ar)...");

    // 2. Batch upsert Section Translations
    const sectionPayload = AI_JOB_RISK_FINDER_SECTION_TRANSLATIONS.map((s) => ({
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
    const dimPayload = AI_JOB_RISK_FINDER_DIMENSION_TRANSLATIONS.map((d) => ({
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

    // 4. Batch upsert Likert 1-5 Option Translations across all 1-48 Likert questions
    const likertPayload = AI_JOB_RISK_FINDER_LIKERT_OPTIONS.map((l) => ({
      option_key: l.optionKey,
      language_code: l.languageCode,
      option_text: l.optionText,
    }));

    await db.query(
      `INSERT INTO option_translations (option_id, language_code, option_text, updated_at)
       SELECT o.id, t.language_code, t.option_text, NOW()
       FROM json_to_recordset($1) AS t(option_key varchar, language_code varchar, option_text text)
       JOIN question_options o ON o.option_key = t.option_key
       JOIN assessment_questions q ON q.id = o.question_id AND q.assessment_id = $2
       ON CONFLICT (option_id, language_code) DO UPDATE SET
         option_text = EXCLUDED.option_text,
         updated_at = NOW()`,
      [JSON.stringify(likertPayload), assessmentId]
    );

    // 5. Batch upsert Question Translations
    const qPayload = AI_JOB_RISK_FINDER_QUESTION_TRANSLATIONS.map((q) => {
      const qNum = parseInt(q.questionCode.replace("AIR_Q", ""), 10);
      return {
        question_number: qNum,
        language_code: q.languageCode,
        question_text: q.questionText,
      };
    });

    await db.query(
      `INSERT INTO question_translations (question_id, language_code, question_text, updated_at)
       SELECT q.id, t.language_code, t.question_text, NOW()
       FROM json_to_recordset($1) AS t(question_number int, language_code varchar, question_text text)
       JOIN assessment_questions q ON q.question_number = t.question_number AND q.assessment_id = $2
       ON CONFLICT (question_id, language_code) DO UPDATE SET
         question_text = EXCLUDED.question_text,
         updated_at = NOW()`,
      [JSON.stringify(qPayload), assessmentId]
    );

    logger.info("✨ AI Job Risk Finder translations seeded successfully for all 5 regional languages.");
  }
}

export const aiJobRiskFinderTranslationsService =
  new AiJobRiskFinderTranslationsService();
