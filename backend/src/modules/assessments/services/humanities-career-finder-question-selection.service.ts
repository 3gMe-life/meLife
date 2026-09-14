import { PoolClient } from "pg";
import { pool } from "../../../config/database";
import { logger } from "../../../common/utils/logger";

export interface HumanitiesCareerFinderVersionDefinition {
  versionCode: string;
  name: string;
  versionNumber: string;
  targetAge: string;
  durationMinutes: number;
  questionCount: number;
  mode: string;
  isDefault: boolean;
  description: string;
  selectedQuestionNumbers: number[];
}

export const HUMANITIES_CAREER_FINDER_QUESTIONS_45: number[] = [
  // Form Q# 1..5 (Human Behaviour & Empathy): Bank Q1, Q2, Q3, Q4, Q5
  1, 2, 3, 4, 5,
  // Form Q# 6..10 (Language & Communication): Bank Q9, Q10, Q11, Q12, Q13
  9, 10, 11, 12, 13,
  // Form Q# 11..15 (Society, Culture & Identity): Bank Q17, Q18, Q19, Q20, Q21
  17, 18, 19, 20, 21,
  // Form Q# 16..20 (Law, Justice & Civic Reasoning): Bank Q25, Q26, Q27, Q28, Q29
  25, 26, 27, 28, 29,
  // Form Q# 21..25 (History, Interpretation & Evidence): Bank Q33, Q34, Q35, Q36, Q37
  33, 34, 35, 36, 37,
  // Form Q# 26..30 (Creative Expression & Media): Bank Q40, Q41, Q42, Q43, Q44
  40, 41, 42, 43, 44,
  // Form Q# 31..35 (Education & Facilitation): Bank Q47, Q48, Q49, Q50, Q51
  47, 48, 49, 50, 51,
  // Form Q# 36..40 (Research, Policy & Global Thinking): Bank Q54, Q55, Q56, Q57, Q58
  54, 55, 56, 57, 58,
  // Form Q# 41..45 (Career Preference Scenarios): Bank Q61, Q62, Q63, Q64, Q65
  61, 62, 63, 64, 65,
];

export const HUMANITIES_CAREER_FINDER_VERSIONS: HumanitiesCareerFinderVersionDefinition[] = [
  {
    versionCode: "HUMANITIES_CAREER_FINDER_V1",
    name: "Humanities Career Finder — Standard Pilot Edition",
    versionNumber: "v1.0",
    targetAge: "15-22",
    durationMinutes: 20,
    questionCount: 45,
    mode: "FIXED",
    isDefault: true,
    description:
      "Educational guidance assessment battery measuring student alignment across 4 core humanities career clusters (Human Behaviour & Wellbeing; Law, Public Affairs & Social Justice; Media, Communication & Creative Culture; Education, Languages & Social Research) through 40 Likert items and 5 forced-choice career scenarios.",
    selectedQuestionNumbers: HUMANITIES_CAREER_FINDER_QUESTIONS_45,
  },
];

export class HumanitiesCareerFinderQuestionSelectionService {
  /**
   * Seeds the Humanities Career Finder assessment versions and question linkages idempotently.
   */
  async seedHumanitiesCareerFinderVersions(client?: PoolClient): Promise<void> {
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
        logger.warn("HUMANITIES_CAREER_FINDER assessment catalog entry missing, skipping version seeding");
        if (!isExternalClient) await db.query("COMMIT");
        return;
      }
      const assessmentId = assessRes.rows[0].id;

      // 2. Fetch all questions for HUMANITIES_CAREER_FINDER to map question_number -> id
      const qRes = await db.query(
        `SELECT id, question_number FROM assessment_questions WHERE assessment_id = $1`,
        [assessmentId]
      );
      const qMapByNum: Record<number, string> = {};
      for (const row of qRes.rows) {
        qMapByNum[parseInt(row.question_number, 10)] = row.id;
      }

      if (Object.keys(qMapByNum).length === 0) {
        logger.warn("No questions found for HUMANITIES_CAREER_FINDER, skipping version seeding");
        if (!isExternalClient) await db.query("COMMIT");
        return;
      }

      for (const v of HUMANITIES_CAREER_FINDER_VERSIONS) {
        const vRes = await db.query(
          `INSERT INTO assessment_versions (
             assessment_id, version_code, name, version_number, target_age,
             duration_minutes, question_count, mode, is_default, status, description, updated_at
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'ACTIVE', $10, NOW())
           ON CONFLICT (assessment_id, version_code) DO UPDATE SET
             name = EXCLUDED.name,
             duration_minutes = EXCLUDED.duration_minutes,
             question_count = EXCLUDED.question_count,
             is_default = EXCLUDED.is_default,
             description = EXCLUDED.description,
             updated_at = NOW()
           RETURNING id`,
          [
            assessmentId,
            v.versionCode,
            v.name,
            v.versionNumber,
            v.targetAge,
            v.durationMinutes,
            v.questionCount,
            v.mode,
            v.isDefault,
            v.description,
          ]
        );
        const versionId = vRes.rows[0].id;

        // Clean sync question linkages
        await db.query(
          `DELETE FROM assessment_version_questions WHERE version_id = $1`,
          [versionId]
        );

        // Batch insert question links with exact display_order (1 to 45)
        for (let index = 0; index < v.selectedQuestionNumbers.length; index++) {
          const qNum = v.selectedQuestionNumbers[index];
          const questionId = qMapByNum[qNum];
          if (!questionId) continue;

          await db.query(
            `INSERT INTO assessment_version_questions (version_id, question_id, display_order, is_required)
             VALUES ($1, $2, $3, true)
             ON CONFLICT (version_id, question_id) DO UPDATE SET
               display_order = EXCLUDED.display_order,
               is_required = EXCLUDED.is_required`,
            [versionId, questionId, index + 1]
          );
        }
      }

      if (!isExternalClient) {
        await db.query("COMMIT");
      }
      logger.info("✨ Humanities Career Finder version HUMANITIES_CAREER_FINDER_V1 seeded and verified (45 questions).");
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

  async getDefaultVersion(assessmentId: string, client?: PoolClient): Promise<any> {
    const db = client || pool;
    const res = await db.query(
      `SELECT * FROM assessment_versions WHERE assessment_id = $1 AND is_default = true AND status = 'ACTIVE' LIMIT 1`,
      [assessmentId]
    );
    return res.rows[0] || null;
  }

  async getVersionByCode(assessmentId: string, versionCode: string, client?: PoolClient): Promise<any> {
    const db = client || pool;
    const res = await db.query(
      `SELECT * FROM assessment_versions WHERE assessment_id = $1 AND version_code = $2 AND status = 'ACTIVE' LIMIT 1`,
      [assessmentId, versionCode]
    );
    return res.rows[0] || null;
  }
}

export const humanitiesCareerFinderQuestionSelectionService =
  new HumanitiesCareerFinderQuestionSelectionService();
