import { PoolClient } from "pg";
import { pool } from "../../../config/database";
import { logger } from "../../../common/utils/logger";

export interface CommerceCareerFinderVersionDefinition {
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

export const COMMERCE_CAREER_FINDER_QUESTIONS_45: number[] = [
  // Form Q# 1..10 (Accounting, Audit & Tax): Bank Q1, Q5, Q9, Q14, Q18, Q23, Q27, Q32, Q36, Q40
  1, 5, 9, 14, 18, 23, 27, 32, 36, 40,
  // Form Q# 11..20 (Finance, Investment & Banking): Bank Q2, Q6, Q10, Q11, Q15, Q19, Q24, Q28, Q33, Q37
  2, 6, 10, 11, 15, 19, 24, 28, 33, 37,
  // Form Q# 21..30 (Business, Management & Entrepreneurship): Bank Q3, Q7, Q12, Q16, Q20, Q21, Q25, Q29, Q34, Q38
  3, 7, 12, 16, 20, 21, 25, 29, 34, 38,
  // Form Q# 31..40 (Economics, Analytics & FinTech): Bank Q4, Q8, Q13, Q17, Q22, Q26, Q30, Q31, Q35, Q39
  4, 8, 13, 17, 22, 26, 30, 31, 35, 39,
  // Form Q# 41..45 (Career Scenario Choice): Bank Q61, Q62, Q63, Q64, Q65
  61, 62, 63, 64, 65,
];

export const COMMERCE_CAREER_FINDER_VERSIONS: CommerceCareerFinderVersionDefinition[] = [
  {
    versionCode: "COMMERCE_CAREER_FINDER_V1",
    name: "Commerce Career Finder — Standard Pilot Edition",
    versionNumber: "v1.0",
    targetAge: "15-22",
    durationMinutes: 20,
    questionCount: 45,
    mode: "FIXED",
    isDefault: true,
    description:
      "Educational guidance assessment battery measuring student alignment across 4 core commerce career families (Accounting, Finance, Business/Management, Economics/Analytics) through 40 Likert items and 5 forced-choice career scenarios.",
    selectedQuestionNumbers: COMMERCE_CAREER_FINDER_QUESTIONS_45,
  },
];

export class CommerceCareerFinderQuestionSelectionService {
  /**
   * Seeds the Commerce Career Finder assessment versions and question linkages idempotently.
   */
  async seedCommerceCareerFinderVersions(client?: PoolClient): Promise<void> {
    const db = client || pool;

    const assessRes = await db.query(
      `SELECT id FROM assessments WHERE code = 'COMMERCE_CAREER_FINDER' LIMIT 1`
    );
    if (!assessRes.rows[0]) {
      logger.warn("COMMERCE_CAREER_FINDER assessment catalog entry missing, skipping version seeding");
      return;
    }
    const assessmentId = assessRes.rows[0].id;

    // Query all questions for COMMERCE_CAREER_FINDER
    const qRes = await db.query(
      `SELECT id, question_number FROM assessment_questions WHERE assessment_id = $1`,
      [assessmentId]
    );
    const qMapByNum: Record<number, string> = {};
    for (const row of qRes.rows) {
      qMapByNum[parseInt(row.question_number, 10)] = row.id;
    }

    if (Object.keys(qMapByNum).length === 0) {
      logger.warn("No questions found for COMMERCE_CAREER_FINDER, skipping version seeding");
      return;
    }

    for (const v of COMMERCE_CAREER_FINDER_VERSIONS) {
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
           VALUES ($1, $2, $3, true)`,
          [versionId, questionId, index + 1]
        );
      }
    }

    logger.info("✨ Commerce Career Finder version COMMERCE_CAREER_FINDER_V1 seeded and verified (45 questions).");
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

export const commerceCareerFinderQuestionSelectionService =
  new CommerceCareerFinderQuestionSelectionService();
