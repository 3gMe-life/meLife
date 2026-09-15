import { PoolClient } from "pg";
import { pool } from "../../config/database";
import { logger } from "../../common/utils/logger";
import {
  CareerEntity,
  CareerMatchReasoning,
  MatchPillarBreakdown,
  CareerTier,
} from "./career.types";
import {
  TAXONOMY_DOMAINS,
  TAXONOMY_FAMILIES,
  TAXONOMY_CLUSTERS,
  GLOBAL_CAREER_SEEDS,
} from "./taxonomy/global-career-taxonomy.data";

export interface FindAllCareersOptions {
  languageCode?: string;
  domainCode?: string;
  familyCode?: string;
  clusterCode?: string;
  search?: string;
  category?: string;
  isEmerging?: boolean;
  page?: number;
  limit?: number;
}

export class CareerRepository {
  /**
   * Initializes global career taxonomy database schema idempotently.
   */
  async initSchema(client?: PoolClient): Promise<void> {
    const db = client || pool;
    const query = `
      -- 1. Career Domains
      CREATE TABLE IF NOT EXISTS career_domains (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(80) NOT NULL UNIQUE,
        name VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        icon_name VARCHAR(60) NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- 2. Career Families
      CREATE TABLE IF NOT EXISTS career_families (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        domain_id UUID NOT NULL REFERENCES career_domains(id) ON DELETE CASCADE,
        code VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- 3. Career Clusters
      CREATE TABLE IF NOT EXISTS career_clusters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        family_id UUID NOT NULL REFERENCES career_families(id) ON DELETE CASCADE,
        code VARCHAR(120) NOT NULL UNIQUE,
        name VARCHAR(220) NOT NULL,
        description TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- 4. Skills Taxonomy
      CREATE TABLE IF NOT EXISTS skills (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(200) NOT NULL,
        category VARCHAR(80) NOT NULL DEFAULT 'TECHNICAL',
        description TEXT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- 5. Careers / Occupations Table (Base Library)
      CREATE TABLE IF NOT EXISTS careers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(150) NOT NULL UNIQUE,
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

      -- Non-breaking Column Extensions for Taxonomy & Deep Profile
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS career_code VARCHAR(100);
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS short_title VARCHAR(150);
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS domain_id UUID REFERENCES career_domains(id) ON DELETE SET NULL;
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES career_families(id) ON DELETE SET NULL;
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS cluster_id UUID REFERENCES career_clusters(id) ON DELETE SET NULL;
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS specialization VARCHAR(255);
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS growth_category VARCHAR(80) DEFAULT 'High Expansion';
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS education_level VARCHAR(150);
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS core_skills JSONB DEFAULT '[]';
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS supporting_skills JSONB DEFAULT '[]';
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS knowledge_areas JSONB DEFAULT '[]';
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS work_activities JSONB DEFAULT '[]';
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS interest_areas JSONB DEFAULT '[]';
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS work_styles JSONB DEFAULT '[]';
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS academic_subjects JSONB DEFAULT '[]';
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS recommended_streams JSONB DEFAULT '[]';
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS recommended_degrees JSONB DEFAULT '[]';
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS typical_qualifications JSONB DEFAULT '[]';
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS career_entry_path JSONB DEFAULT '[]';
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS related_occupations JSONB DEFAULT '[]';
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS work_environment JSONB DEFAULT '[]';
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS technology_areas JSONB DEFAULT '[]';
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS career_tags JSONB DEFAULT '[]';
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS is_emerging BOOLEAN DEFAULT false;
      ALTER TABLE careers ADD COLUMN IF NOT EXISTS version VARCHAR(20) DEFAULT 'V1';

      -- 6. Career Matches Table (Recorded Psychometric Matches per Student & Result)
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

      ALTER TABLE career_matches ADD COLUMN IF NOT EXISTS tier VARCHAR(40) DEFAULT 'PRIMARY';
      ALTER TABLE career_matches ADD COLUMN IF NOT EXISTS confidence VARCHAR(60) DEFAULT 'Moderate Confidence';
      ALTER TABLE career_matches ADD COLUMN IF NOT EXISTS assessment_coverage VARCHAR(120) DEFAULT 'Skill Finder Calibrated';
      ALTER TABLE career_matches ADD COLUMN IF NOT EXISTS pillar_breakdown JSONB DEFAULT '{}';

      -- 7. Career Multilingual Translations
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

      ALTER TABLE career_translations ADD COLUMN IF NOT EXISTS specialization VARCHAR(255);

      -- Create Optimal Indexes
      CREATE INDEX IF NOT EXISTS idx_careers_slug ON careers(slug);
      CREATE INDEX IF NOT EXISTS idx_careers_career_code ON careers(career_code);
      CREATE INDEX IF NOT EXISTS idx_careers_domain_id ON careers(domain_id);
      CREATE INDEX IF NOT EXISTS idx_careers_family_id ON careers(family_id);
      CREATE INDEX IF NOT EXISTS idx_careers_cluster_id ON careers(cluster_id);
      CREATE INDEX IF NOT EXISTS idx_careers_category ON careers(category);
      CREATE INDEX IF NOT EXISTS idx_careers_is_active ON careers(is_active);
      CREATE INDEX IF NOT EXISTS idx_career_domains_code ON career_domains(code);
      CREATE INDEX IF NOT EXISTS idx_career_families_code ON career_families(code);
      CREATE INDEX IF NOT EXISTS idx_career_clusters_code ON career_clusters(code);
      CREATE INDEX IF NOT EXISTS idx_career_matches_student ON career_matches(student_id);
      CREATE INDEX IF NOT EXISTS idx_career_translations_lang ON career_translations(career_id, language_code);
    `;
    await db.query(query);
    logger.info("📦 Global career taxonomy database schema initialized and verified.");
  }

  /**
   * Seeds the comprehensive global career taxonomy (Domains, Families, Clusters, Occupations, and Translations).
   */
  async seedCareers(client?: PoolClient): Promise<void> {
    const db = client || pool;

    const countRes = await db.query("SELECT COUNT(*) FROM careers");
    if (parseInt(countRes.rows[0].count, 10) >= GLOBAL_CAREER_SEEDS.length) {
      logger.info(
        `✨ Global career taxonomy already fully seeded (${countRes.rows[0].count} master occupations).`
      );
      return;
    }

    // 1. Seed Domains
    const domainMap: Record<string, string> = {};
    for (const d of TAXONOMY_DOMAINS) {
      const dRes = await db.query(
        `INSERT INTO career_domains (code, name, description, display_order, icon_name)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (code) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           display_order = EXCLUDED.display_order,
           icon_name = EXCLUDED.icon_name
         RETURNING id, code`,
        [d.code, d.name, d.description, d.display_order, d.icon_name || null]
      );
      domainMap[d.code] = dRes.rows[0].id;
    }

    // 2. Seed Families
    const familyMap: Record<string, string> = {};
    for (const f of TAXONOMY_FAMILIES) {
      const domainId = f.domain_code ? domainMap[f.domain_code] : undefined;
      if (!domainId) continue;
      const fRes = await db.query(
        `INSERT INTO career_families (domain_id, code, name, description, display_order)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (code) DO UPDATE SET
           domain_id = EXCLUDED.domain_id,
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           display_order = EXCLUDED.display_order
         RETURNING id, code`,
        [domainId, f.code, f.name, f.description, f.display_order]
      );
      familyMap[f.code] = fRes.rows[0].id;
    }

    // 3. Seed Clusters
    const clusterMap: Record<string, string> = {};
    for (const c of TAXONOMY_CLUSTERS) {
      const familyId = c.family_code ? familyMap[c.family_code] : undefined;
      if (!familyId) continue;
      const cRes = await db.query(
        `INSERT INTO career_clusters (family_id, code, name, description, display_order)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (code) DO UPDATE SET
           family_id = EXCLUDED.family_id,
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           display_order = EXCLUDED.display_order
         RETURNING id, code`,
        [familyId, c.code, c.name, c.description, c.display_order]
      );
      clusterMap[c.code] = cRes.rows[0].id;
    }

    // 4. Seed Master Occupations
    for (const seed of GLOBAL_CAREER_SEEDS) {
      const domainId = domainMap[seed.domain_code] || null;
      const familyId = familyMap[seed.family_code] || null;
      const clusterId = clusterMap[seed.cluster_code] || null;

      const careerRes = await db.query(
        `INSERT INTO careers (
           career_code, slug, title, short_title, category, industry, domain_id, family_id, cluster_id,
           specialization, growth_category, education_level, description, overview, future_growth,
           education_paths, required_skills, core_skills, supporting_skills, knowledge_areas,
           work_activities, interest_areas, work_styles, academic_subjects, recommended_subjects,
           recommended_streams, recommended_degrees, typical_qualifications, career_entry_path,
           related_occupations, work_environment, technology_areas, career_tags, is_emerging,
           learning_roadmap, sample_roles, related_dimensions, display_order, is_active, updated_at
         )
         VALUES (
           $1, $2, $3, $4, $5, $6, $7, $8, $9,
           $10, $11, $12, $13, $14, $15,
           $16, $17, $18, $19, $20,
           $21, $22, $23, $24, $25,
           $26, $27, $28, $29,
           $30, $31, $32, $33, $34,
           $35, $36, $37, $38, true, NOW()
         )
         ON CONFLICT (slug) DO UPDATE SET
           career_code = EXCLUDED.career_code,
           title = EXCLUDED.title,
           short_title = EXCLUDED.short_title,
           category = EXCLUDED.category,
           industry = EXCLUDED.industry,
           domain_id = EXCLUDED.domain_id,
           family_id = EXCLUDED.family_id,
           cluster_id = EXCLUDED.cluster_id,
           specialization = EXCLUDED.specialization,
           growth_category = EXCLUDED.growth_category,
           education_level = EXCLUDED.education_level,
           description = EXCLUDED.description,
           overview = EXCLUDED.overview,
           future_growth = EXCLUDED.future_growth,
           education_paths = EXCLUDED.education_paths,
           required_skills = EXCLUDED.required_skills,
           core_skills = EXCLUDED.core_skills,
           supporting_skills = EXCLUDED.supporting_skills,
           knowledge_areas = EXCLUDED.knowledge_areas,
           work_activities = EXCLUDED.work_activities,
           interest_areas = EXCLUDED.interest_areas,
           work_styles = EXCLUDED.work_styles,
           academic_subjects = EXCLUDED.academic_subjects,
           recommended_subjects = EXCLUDED.recommended_subjects,
           recommended_streams = EXCLUDED.recommended_streams,
           recommended_degrees = EXCLUDED.recommended_degrees,
           typical_qualifications = EXCLUDED.typical_qualifications,
           career_entry_path = EXCLUDED.career_entry_path,
           related_occupations = EXCLUDED.related_occupations,
           work_environment = EXCLUDED.work_environment,
           technology_areas = EXCLUDED.technology_areas,
           career_tags = EXCLUDED.career_tags,
           is_emerging = EXCLUDED.is_emerging,
           learning_roadmap = EXCLUDED.learning_roadmap,
           sample_roles = EXCLUDED.sample_roles,
           related_dimensions = EXCLUDED.related_dimensions,
           display_order = EXCLUDED.display_order,
           updated_at = NOW()
         RETURNING id`,
        [
          seed.career_code,
          seed.slug,
          seed.title,
          seed.short_title,
          seed.category,
          seed.industry,
          domainId,
          familyId,
          clusterId,
          seed.specialization,
          seed.growth_category,
          seed.education_level,
          seed.description,
          seed.overview,
          seed.future_growth,
          JSON.stringify(seed.education_paths),
          JSON.stringify(seed.required_skills),
          JSON.stringify(seed.core_skills),
          JSON.stringify(seed.supporting_skills),
          JSON.stringify(seed.knowledge_areas),
          JSON.stringify(seed.work_activities),
          JSON.stringify(seed.interest_areas),
          JSON.stringify(seed.work_styles),
          JSON.stringify(seed.academic_subjects),
          JSON.stringify(seed.recommended_subjects),
          JSON.stringify(seed.recommended_streams),
          JSON.stringify(seed.recommended_degrees),
          JSON.stringify(seed.typical_qualifications),
          JSON.stringify(seed.career_entry_path),
          JSON.stringify(seed.related_occupations),
          JSON.stringify(seed.work_environment),
          JSON.stringify(seed.technology_areas),
          JSON.stringify(seed.career_tags),
          seed.is_emerging,
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
               career_id, language_code, title, category, industry, specialization, description, overview,
               education_paths, required_skills, recommended_subjects, learning_roadmap, sample_roles
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             ON CONFLICT (career_id, language_code) DO UPDATE SET
               title = EXCLUDED.title,
               category = EXCLUDED.category,
               industry = EXCLUDED.industry,
               specialization = EXCLUDED.specialization,
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
              trans.specialization || seed.specialization,
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

    logger.info(
      `✨ Successfully seeded global career taxonomy: ${TAXONOMY_DOMAINS.length} domains, ${TAXONOMY_FAMILIES.length} families, ${TAXONOMY_CLUSTERS.length} clusters, and ${GLOBAL_CAREER_SEEDS.length} master occupations.`
    );
  }

  /**
   * Retrieves all active careers with language localization, hierarchy joins, and optional filters.
   */
  async findAllCareers(
    optionsOrLang: FindAllCareersOptions | string = "en",
    client?: PoolClient
  ): Promise<CareerEntity[]> {
    const db = client || pool;
    const options: FindAllCareersOptions =
      typeof optionsOrLang === "string" ? { languageCode: optionsOrLang } : optionsOrLang;

    const lang = (options.languageCode || "en").toLowerCase().trim();
    const values: any[] = [lang];
    const whereClauses: string[] = ["c.is_active = true"];

    if (options.domainCode) {
      values.push(options.domainCode);
      whereClauses.push(`cd.code = $${values.length}`);
    }

    if (options.familyCode) {
      values.push(options.familyCode);
      whereClauses.push(`cf.code = $${values.length}`);
    }

    if (options.clusterCode) {
      values.push(options.clusterCode);
      whereClauses.push(`cc.code = $${values.length}`);
    }

    if (options.category && options.category !== "ALL") {
      values.push(`%${options.category}%`);
      whereClauses.push(`c.category ILIKE $${values.length}`);
    }

    if (typeof options.isEmerging === "boolean") {
      values.push(options.isEmerging);
      whereClauses.push(`c.is_emerging = $${values.length}`);
    }

    if (options.search) {
      values.push(`%${options.search.trim()}%`);
      const sIdx = values.length;
      whereClauses.push(`(
        c.title ILIKE $${sIdx} OR
        c.slug ILIKE $${sIdx} OR
        c.category ILIKE $${sIdx} OR
        c.industry ILIKE $${sIdx} OR
        c.specialization ILIKE $${sIdx} OR
        c.description ILIKE $${sIdx} OR
        c.required_skills::text ILIKE $${sIdx} OR
        c.core_skills::text ILIKE $${sIdx} OR
        c.career_tags::text ILIKE $${sIdx}
      )`);
    }

    let paginationClause = "";
    if (options.limit && options.limit > 0) {
      const page = Math.max(1, options.page || 1);
      const offset = (page - 1) * options.limit;
      values.push(options.limit);
      values.push(offset);
      paginationClause = `LIMIT $${values.length - 1} OFFSET $${values.length}`;
    }

    const query = `
      SELECT
        c.id, c.career_code, c.slug,
        COALESCE(ct.title, c.title) as title,
        COALESCE(c.short_title, c.title) as short_title,
        COALESCE(ct.category, c.category) as category,
        COALESCE(ct.industry, c.industry) as industry,
        c.domain_id,
        cd.code as domain_code,
        cd.name as domain_name,
        c.family_id,
        cf.code as family_code,
        cf.name as family_name,
        c.cluster_id,
        cc.code as cluster_code,
        cc.name as cluster_name,
        COALESCE(ct.specialization, c.specialization) as specialization,
        c.growth_category,
        c.education_level,
        COALESCE(ct.description, c.description) as description,
        COALESCE(ct.overview, c.overview) as overview,
        c.future_growth,
        COALESCE(ct.education_paths, c.education_paths) as education_paths,
        COALESCE(ct.required_skills, c.required_skills) as required_skills,
        c.core_skills,
        c.supporting_skills,
        c.knowledge_areas,
        c.work_activities,
        c.interest_areas,
        c.work_styles,
        c.academic_subjects,
        COALESCE(ct.recommended_subjects, c.recommended_subjects) as recommended_subjects,
        c.recommended_streams,
        c.recommended_degrees,
        c.typical_qualifications,
        c.career_entry_path,
        c.related_occupations,
        c.work_environment,
        c.technology_areas,
        c.career_tags,
        c.is_emerging,
        c.version,
        COALESCE(ct.learning_roadmap, c.learning_roadmap) as learning_roadmap,
        COALESCE(ct.sample_roles, c.sample_roles) as sample_roles,
        c.related_dimensions,
        c.is_active,
        c.display_order,
        c.created_at,
        c.updated_at
      FROM careers c
      LEFT JOIN career_domains cd ON c.domain_id = cd.id
      LEFT JOIN career_families cf ON c.family_id = cf.id
      LEFT JOIN career_clusters cc ON c.cluster_id = cc.id
      LEFT JOIN career_translations ct ON c.id = ct.career_id AND ct.language_code = $1
      WHERE ${whereClauses.join(" AND ")}
      ORDER BY c.display_order ASC, c.title ASC
      ${paginationClause}
    `;

    const res = await db.query(query, values);
    return res.rows.map((r) => this.mapRowToEntity(r));
  }

  /**
   * Retrieves a single career by its UUID or slug with full taxonomy hierarchy and translations.
   */
  async findCareerByIdOrSlug(
    idOrSlug: string,
    languageCode = "en",
    client?: PoolClient
  ): Promise<CareerEntity | null> {
    if (!idOrSlug) return null;
    const db = client || pool;
    const lang = (languageCode || "en").toLowerCase().trim();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    const query = `
      SELECT
        c.id, c.career_code, c.slug,
        COALESCE(ct.title, c.title) as title,
        COALESCE(c.short_title, c.title) as short_title,
        COALESCE(ct.category, c.category) as category,
        COALESCE(ct.industry, c.industry) as industry,
        c.domain_id,
        cd.code as domain_code,
        cd.name as domain_name,
        c.family_id,
        cf.code as family_code,
        cf.name as family_name,
        c.cluster_id,
        cc.code as cluster_code,
        cc.name as cluster_name,
        COALESCE(ct.specialization, c.specialization) as specialization,
        c.growth_category,
        c.education_level,
        COALESCE(ct.description, c.description) as description,
        COALESCE(ct.overview, c.overview) as overview,
        c.future_growth,
        COALESCE(ct.education_paths, c.education_paths) as education_paths,
        COALESCE(ct.required_skills, c.required_skills) as required_skills,
        c.core_skills,
        c.supporting_skills,
        c.knowledge_areas,
        c.work_activities,
        c.interest_areas,
        c.work_styles,
        c.academic_subjects,
        COALESCE(ct.recommended_subjects, c.recommended_subjects) as recommended_subjects,
        c.recommended_streams,
        c.recommended_degrees,
        c.typical_qualifications,
        c.career_entry_path,
        c.related_occupations,
        c.work_environment,
        c.technology_areas,
        c.career_tags,
        c.is_emerging,
        c.version,
        COALESCE(ct.learning_roadmap, c.learning_roadmap) as learning_roadmap,
        COALESCE(ct.sample_roles, c.sample_roles) as sample_roles,
        c.related_dimensions,
        c.is_active,
        c.display_order,
        c.created_at,
        c.updated_at
      FROM careers c
      LEFT JOIN career_domains cd ON c.domain_id = cd.id
      LEFT JOIN career_families cf ON c.family_id = cf.id
      LEFT JOIN career_clusters cc ON c.cluster_id = cc.id
      LEFT JOIN career_translations ct ON c.id = ct.career_id AND ct.language_code = $1
      WHERE ${isUuid ? "c.id = $2" : "c.slug = $2"} AND c.is_active = true
      LIMIT 1
    `;

    const res = await db.query(query, [lang, idOrSlug]);
    if (!res.rows[0]) return null;
    return this.mapRowToEntity(res.rows[0]);
  }

  /**
   * Saves or updates calculated career matches with tiering and pillar breakdown.
   */
  async saveCareerMatches(
    studentId: string,
    matches: Array<{
      careerId: string;
      matchPercentage: number;
      tier?: CareerTier;
      confidence?: string;
      assessmentCoverage?: string;
      reasoning: CareerMatchReasoning;
      pillarBreakdown?: MatchPillarBreakdown;
      assessmentResultId?: string | null;
    }>,
    client?: PoolClient
  ): Promise<void> {
    if (!matches.length) return;
    const db = client || pool;

    const values: any[] = [studentId];
    const rowClauses: string[] = [];

    for (let i = 0; i < matches.length; i++) {
      const m = matches[i];
      const offset = values.length;
      values.push(
        m.assessmentResultId || null,
        m.careerId,
        m.matchPercentage,
        m.tier || "PRIMARY",
        m.confidence || "Moderate Confidence",
        m.assessmentCoverage || "Skill Finder Calibrated",
        JSON.stringify(m.reasoning),
        JSON.stringify(m.pillarBreakdown || {})
      );
      rowClauses.push(
        `($1, $${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, NOW())`
      );
    }

    const query = `
      INSERT INTO career_matches (
        student_id, assessment_result_id, career_id, match_percentage, tier, confidence,
        assessment_coverage, reasoning, pillar_breakdown, created_at
      )
      VALUES ${rowClauses.join(", ")}
      ON CONFLICT (student_id, career_id) DO UPDATE SET
        assessment_result_id = EXCLUDED.assessment_result_id,
        match_percentage = EXCLUDED.match_percentage,
        tier = EXCLUDED.tier,
        confidence = EXCLUDED.confidence,
        assessment_coverage = EXCLUDED.assessment_coverage,
        reasoning = EXCLUDED.reasoning,
        pillar_breakdown = EXCLUDED.pillar_breakdown,
        created_at = NOW()
    `;

    await db.query(query, values);
  }

  private mapRowToEntity(row: any): CareerEntity {
    return {
      id: row.id,
      career_code: row.career_code || undefined,
      slug: row.slug,
      title: row.title,
      short_title: row.short_title || row.title,
      category: row.category,
      industry: row.industry,
      domain_id: row.domain_id || null,
      domain_code: row.domain_code || undefined,
      domain_name: row.domain_name || undefined,
      family_id: row.family_id || null,
      family_code: row.family_code || undefined,
      family_name: row.family_name || undefined,
      cluster_id: row.cluster_id || null,
      cluster_code: row.cluster_code || undefined,
      cluster_name: row.cluster_name || undefined,
      specialization: row.specialization || undefined,
      growth_category: row.growth_category || "High Expansion",
      education_level: row.education_level || "Bachelor's Degree",
      description: row.description,
      overview: row.overview,
      future_growth: row.future_growth,
      education_paths: typeof row.education_paths === "string" ? JSON.parse(row.education_paths) : row.education_paths || [],
      required_skills: typeof row.required_skills === "string" ? JSON.parse(row.required_skills) : row.required_skills || [],
      core_skills: typeof row.core_skills === "string" ? JSON.parse(row.core_skills) : row.core_skills || row.required_skills || [],
      supporting_skills: typeof row.supporting_skills === "string" ? JSON.parse(row.supporting_skills) : row.supporting_skills || [],
      knowledge_areas: typeof row.knowledge_areas === "string" ? JSON.parse(row.knowledge_areas) : row.knowledge_areas || [],
      work_activities: typeof row.work_activities === "string" ? JSON.parse(row.work_activities) : row.work_activities || [],
      interest_areas: typeof row.interest_areas === "string" ? JSON.parse(row.interest_areas) : row.interest_areas || [],
      work_styles: typeof row.work_styles === "string" ? JSON.parse(row.work_styles) : row.work_styles || [],
      academic_subjects: typeof row.academic_subjects === "string" ? JSON.parse(row.academic_subjects) : row.academic_subjects || [],
      recommended_subjects: typeof row.recommended_subjects === "string" ? JSON.parse(row.recommended_subjects) : row.recommended_subjects || [],
      recommended_streams: typeof row.recommended_streams === "string" ? JSON.parse(row.recommended_streams) : row.recommended_streams || [],
      recommended_degrees: typeof row.recommended_degrees === "string" ? JSON.parse(row.recommended_degrees) : row.recommended_degrees || [],
      typical_qualifications: typeof row.typical_qualifications === "string" ? JSON.parse(row.typical_qualifications) : row.typical_qualifications || [],
      career_entry_path: typeof row.career_entry_path === "string" ? JSON.parse(row.career_entry_path) : row.career_entry_path || [],
      related_occupations: typeof row.related_occupations === "string" ? JSON.parse(row.related_occupations) : row.related_occupations || [],
      work_environment: typeof row.work_environment === "string" ? JSON.parse(row.work_environment) : row.work_environment || [],
      technology_areas: typeof row.technology_areas === "string" ? JSON.parse(row.technology_areas) : row.technology_areas || [],
      career_tags: typeof row.career_tags === "string" ? JSON.parse(row.career_tags) : row.career_tags || [],
      is_emerging: Boolean(row.is_emerging),
      version: row.version || "V1",
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
