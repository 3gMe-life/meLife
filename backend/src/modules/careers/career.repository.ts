import { PoolClient } from "pg";
import { pool } from "../../config/database";
import { logger } from "../../common/utils/logger";
import { CareerEntity, CareerMatchReasoning } from "./career.types";
import { SEED_CAREERS } from "./career.seed-data";

export class CareerRepository {
  /**
   * Initializes careers database schema idempotently.
   */
  async initSchema(client?: PoolClient): Promise<void> {
    const db = client || pool;
    const query = `
      -- 1. Careers Library Table
      CREATE TABLE IF NOT EXISTS careers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(120) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(150) NOT NULL,
        industry VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        overview TEXT NOT NULL,
        future_growth VARCHAR(50) NOT NULL DEFAULT 'High',
        education_paths JSONB NOT NULL DEFAULT '[]',
        required_skills JSONB NOT NULL DEFAULT '[]',
        recommended_subjects JSONB NOT NULL DEFAULT '[]',
        learning_roadmap JSONB NOT NULL DEFAULT '[]',
        sample_roles JSONB NOT NULL DEFAULT '[]',
        related_dimensions JSONB NOT NULL DEFAULT '{}',
        is_active BOOLEAN NOT NULL DEFAULT true,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- 2. Career Matches (Recorded Psychometric Matches per Student & Result)
      CREATE TABLE IF NOT EXISTS career_matches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assessment_result_id UUID NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
        career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
        match_percentage NUMERIC(5,2) NOT NULL,
        reasoning JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(student_id, career_id)
      );

      -- 3. Career Multilingual Translations
      CREATE TABLE IF NOT EXISTS career_translations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
        language_code VARCHAR(10) NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(150) NOT NULL,
        industry VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        overview TEXT NOT NULL,
        education_paths JSONB NOT NULL DEFAULT '[]',
        required_skills JSONB NOT NULL DEFAULT '[]',
        recommended_subjects JSONB NOT NULL DEFAULT '[]',
        learning_roadmap JSONB NOT NULL DEFAULT '[]',
        sample_roles JSONB NOT NULL DEFAULT '[]',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(career_id, language_code)
      );

      CREATE INDEX IF NOT EXISTS idx_careers_slug ON careers(slug);
      CREATE INDEX IF NOT EXISTS idx_careers_category ON careers(category);
      CREATE INDEX IF NOT EXISTS idx_career_matches_student ON career_matches(student_id);
      CREATE INDEX IF NOT EXISTS idx_career_translations_lang ON career_translations(career_id, language_code);
    `;
    await db.query(query);
    logger.info("📦 Career pathways database schema initialized and verified.");
  }

  /**
   * Seeds the official curated career library and multilingual translations.
   */
  async seedCareers(client?: PoolClient): Promise<void> {
    const db = client || pool;

    for (const seed of SEED_CAREERS) {
      const careerRes = await db.query(
        `INSERT INTO careers (
           slug, title, category, industry, description, overview, future_growth,
           education_paths, required_skills, recommended_subjects, learning_roadmap,
           sample_roles, related_dimensions, display_order, is_active, updated_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true, NOW())
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           category = EXCLUDED.category,
           industry = EXCLUDED.industry,
           description = EXCLUDED.description,
           overview = EXCLUDED.overview,
           future_growth = EXCLUDED.future_growth,
           education_paths = EXCLUDED.education_paths,
           required_skills = EXCLUDED.required_skills,
           recommended_subjects = EXCLUDED.recommended_subjects,
           learning_roadmap = EXCLUDED.learning_roadmap,
           sample_roles = EXCLUDED.sample_roles,
           related_dimensions = EXCLUDED.related_dimensions,
           display_order = EXCLUDED.display_order,
           updated_at = NOW()
         RETURNING id`,
        [
          seed.slug,
          seed.title,
          seed.category,
          seed.industry,
          seed.description,
          seed.overview,
          seed.future_growth,
          JSON.stringify(seed.education_paths),
          JSON.stringify(seed.required_skills),
          JSON.stringify(seed.recommended_subjects),
          JSON.stringify(seed.learning_roadmap),
          JSON.stringify(seed.sample_roles),
          JSON.stringify(seed.related_dimensions),
          seed.display_order,
        ]
      );

      const careerId = careerRes.rows[0].id;

      // Seed translations
      if (seed.translations) {
        for (const [langCode, trans] of Object.entries(seed.translations)) {
          await db.query(
            `INSERT INTO career_translations (
               career_id, language_code, title, category, industry, description, overview,
               education_paths, required_skills, recommended_subjects, learning_roadmap, sample_roles
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             ON CONFLICT (career_id, language_code) DO UPDATE SET
               title = EXCLUDED.title,
               category = EXCLUDED.category,
               industry = EXCLUDED.industry,
               description = EXCLUDED.description,
               overview = EXCLUDED.overview,
               required_skills = EXCLUDED.required_skills,
               recommended_subjects = EXCLUDED.recommended_subjects`,
            [
              careerId,
              langCode.toLowerCase().trim(),
              trans.title,
              trans.category,
              trans.industry,
              trans.description,
              trans.overview,
              JSON.stringify(seed.education_paths),
              JSON.stringify(trans.required_skills || seed.required_skills),
              JSON.stringify(trans.recommended_subjects || seed.recommended_subjects),
              JSON.stringify(seed.learning_roadmap),
              JSON.stringify(seed.sample_roles),
            ]
          );
        }
      }
    }

    logger.info(`✨ Successfully seeded ${SEED_CAREERS.length} curated career exploration pathways.`);
  }

  /**
   * Retrieves all active careers with language localization.
   */
  async findAllCareers(languageCode = "en", client?: PoolClient): Promise<CareerEntity[]> {
    const db = client || pool;
    const lang = (languageCode || "en").toLowerCase().trim();

    const query = `
      SELECT
        c.id, c.slug,
        COALESCE(ct.title, c.title) as title,
        COALESCE(ct.category, c.category) as category,
        COALESCE(ct.industry, c.industry) as industry,
        COALESCE(ct.description, c.description) as description,
        COALESCE(ct.overview, c.overview) as overview,
        c.future_growth,
        COALESCE(ct.education_paths, c.education_paths) as education_paths,
        COALESCE(ct.required_skills, c.required_skills) as required_skills,
        COALESCE(ct.recommended_subjects, c.recommended_subjects) as recommended_subjects,
        COALESCE(ct.learning_roadmap, c.learning_roadmap) as learning_roadmap,
        COALESCE(ct.sample_roles, c.sample_roles) as sample_roles,
        c.related_dimensions,
        c.is_active,
        c.display_order,
        c.created_at,
        c.updated_at
      FROM careers c
      LEFT JOIN career_translations ct ON c.id = ct.career_id AND ct.language_code = $1
      WHERE c.is_active = true
      ORDER BY c.display_order ASC, c.title ASC
    `;

    const res = await db.query(query, [lang]);
    return res.rows.map((r) => this.mapRowToEntity(r));
  }

  /**
   * Retrieves a single career by its UUID or slug with language localization.
   */
  async findCareerByIdOrSlug(idOrSlug: string, languageCode = "en", client?: PoolClient): Promise<CareerEntity | null> {
    if (!idOrSlug) return null;
    const db = client || pool;
    const lang = (languageCode || "en").toLowerCase().trim();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    const query = `
      SELECT
        c.id, c.slug,
        COALESCE(ct.title, c.title) as title,
        COALESCE(ct.category, c.category) as category,
        COALESCE(ct.industry, c.industry) as industry,
        COALESCE(ct.description, c.description) as description,
        COALESCE(ct.overview, c.overview) as overview,
        c.future_growth,
        COALESCE(ct.education_paths, c.education_paths) as education_paths,
        COALESCE(ct.required_skills, c.required_skills) as required_skills,
        COALESCE(ct.recommended_subjects, c.recommended_subjects) as recommended_subjects,
        COALESCE(ct.learning_roadmap, c.learning_roadmap) as learning_roadmap,
        COALESCE(ct.sample_roles, c.sample_roles) as sample_roles,
        c.related_dimensions,
        c.is_active,
        c.display_order,
        c.created_at,
        c.updated_at
      FROM careers c
      LEFT JOIN career_translations ct ON c.id = ct.career_id AND ct.language_code = $1
      WHERE ${isUuid ? "c.id = $2" : "c.slug = $2"} AND c.is_active = true
      LIMIT 1
    `;

    const res = await db.query(query, [lang, idOrSlug]);
    if (!res.rows[0]) return null;
    return this.mapRowToEntity(res.rows[0]);
  }

  /**
   * Saves or updates calculated career matches for a student.
   */
  async saveCareerMatches(
    studentId: string,
    matches: Array<{
      careerId: string;
      matchPercentage: number;
      reasoning: CareerMatchReasoning;
      assessmentResultId?: string | null;
    }>,
    client?: PoolClient
  ): Promise<void> {
    if (!matches.length) return;
    const db = client || pool;

    for (const match of matches) {
      await db.query(
        `INSERT INTO career_matches (
           student_id, assessment_result_id, career_id, match_percentage, reasoning, created_at
         )
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (student_id, career_id) DO UPDATE SET
           assessment_result_id = EXCLUDED.assessment_result_id,
           match_percentage = EXCLUDED.match_percentage,
           reasoning = EXCLUDED.reasoning,
           created_at = NOW()`,
        [
          studentId,
          match.assessmentResultId || null,
          match.careerId,
          match.matchPercentage,
          JSON.stringify(match.reasoning),
        ]
      );
    }
  }

  private mapRowToEntity(row: any): CareerEntity {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category,
      industry: row.industry,
      description: row.description,
      overview: row.overview,
      future_growth: row.future_growth,
      education_paths: typeof row.education_paths === "string" ? JSON.parse(row.education_paths) : row.education_paths || [],
      required_skills: typeof row.required_skills === "string" ? JSON.parse(row.required_skills) : row.required_skills || [],
      recommended_subjects: typeof row.recommended_subjects === "string" ? JSON.parse(row.recommended_subjects) : row.recommended_subjects || [],
      learning_roadmap: typeof row.learning_roadmap === "string" ? JSON.parse(row.learning_roadmap) : row.learning_roadmap || [],
      sample_roles: typeof row.sample_roles === "string" ? JSON.parse(row.sample_roles) : row.sample_roles || [],
      related_dimensions: typeof row.related_dimensions === "string" ? JSON.parse(row.related_dimensions) : row.related_dimensions || {},
      is_active: Boolean(row.is_active),
      display_order: parseInt(row.display_order, 10) || 0,
      created_at: new Date(row.created_at).toISOString(),
      updated_at: new Date(row.updated_at).toISOString(),
    };
  }
}

export const careerRepository = new CareerRepository();
