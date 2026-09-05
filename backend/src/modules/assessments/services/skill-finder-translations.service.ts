import { PoolClient } from "pg";
import { pool } from "../../../config/database";
import { logger } from "../../../common/utils/logger";
import { SupportedLanguageDTO } from "../assessment-runner.types";
import {
  SectionTranslationSeed,
  OptionTranslationSeed,
  QuestionTranslationSeed,
  DimensionTranslationSeed,
  McqOptionTranslationSeed,
  SECTION_TRANSLATIONS,
  LIKERT_OPTION_TRANSLATIONS,
  MCQ_OPTION_TRANSLATIONS,
  DIMENSION_TRANSLATIONS,
  QUESTION_TRANSLATIONS,
} from "./skill-finder-translations.data";

export {
  SectionTranslationSeed,
  OptionTranslationSeed,
  QuestionTranslationSeed,
  DimensionTranslationSeed,
  McqOptionTranslationSeed,
  SECTION_TRANSLATIONS,
  LIKERT_OPTION_TRANSLATIONS,
  MCQ_OPTION_TRANSLATIONS,
  DIMENSION_TRANSLATIONS,
  QUESTION_TRANSLATIONS,
};

export const SUPPORTED_ASSESSMENT_LANGUAGES: SupportedLanguageDTO[] = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", dir: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", dir: "ltr" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
];

export class SkillFinderTranslationsService {
  /**
   * Seeds official section, dimension, option, and question translations idempotently and ultra-fast
   * via PostgreSQL JSON batch operations across all 5 supported languages (ml, hi, ta, kn, ar).
   */
  async seedSkillFinderTranslations(client?: PoolClient): Promise<void> {
    const db = client || pool;

    // 1. Locate SKILL_FINDER assessment ID
    const assessRes = await db.query(
      `SELECT id FROM assessments WHERE code = 'SKILL_FINDER' LIMIT 1`
    );
    if (!assessRes.rows[0]) {
      logger.warn("SKILL_FINDER assessment not found, skipping translation seeding");
      return;
    }
    const assessmentId = assessRes.rows[0].id;

    // Fast check: verify if all question translations already exist
    const countRes = await db.query(
      `SELECT COUNT(*) as count FROM question_translations WHERE language_code IN ('ml', 'hi', 'ta', 'kn', 'ar')`
    );
    const existingCount = parseInt(countRes.rows[0]?.count, 10) || 0;
    if (existingCount >= QUESTION_TRANSLATIONS.length) {
      logger.info(
        `✨ Skill Finder multilingual translations already seeded (${existingCount} items).`
      );
      return;
    }

    logger.info("⏳ Seeding Skill Finder multilingual translations (ml, hi, ta, kn, ar)...");

    // 2. Batch upsert Section Translations
    const sectionPayload = SECTION_TRANSLATIONS.map((s) => ({
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
    const dimPayload = DIMENSION_TRANSLATIONS.map((d) => ({
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

    // 4. Batch upsert Likert Option Translations across all 1-4 Likert questions
    const likertPayload = LIKERT_OPTION_TRANSLATIONS.map((l) => ({
      option_key: l.optionKey,
      language_code: l.languageCode,
      option_text: l.optionText,
    }));

    await db.query(
      `INSERT INTO option_translations (option_id, language_code, option_text, updated_at)
       SELECT o.id, t.language_code, t.option_text, NOW()
       FROM json_to_recordset($1) AS t(option_key varchar, language_code varchar, option_text text)
       JOIN assessment_questions q ON q.assessment_id = $2 AND q.question_type = 'likert_1_4'
       JOIN question_options o ON o.question_id = q.id AND o.option_key = t.option_key
       ON CONFLICT (option_id, language_code) DO UPDATE SET
         option_text = EXCLUDED.option_text,
         updated_at = NOW()`,
      [JSON.stringify(likertPayload), assessmentId]
    );

    // 5. Batch upsert MCQ Option Translations
    const mcqPayload = MCQ_OPTION_TRANSLATIONS.map((m) => ({
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

    // 6. Batch upsert Question Translations (520 items across 5 languages)
    const questionPayload = QUESTION_TRANSLATIONS.map((qt) => ({
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
      `✨ Skill Finder multilingual translations seeded successfully (${QUESTION_TRANSLATIONS.length} questions across ml, hi, ta, kn, ar).`
    );
  }
}

export const skillFinderTranslationsService = new SkillFinderTranslationsService();
