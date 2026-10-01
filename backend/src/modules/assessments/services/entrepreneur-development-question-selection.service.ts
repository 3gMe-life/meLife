import { PoolClient } from "pg";
import { pool } from "../../../config/database";
import { logger } from "../../../common/utils/logger";

export interface EntrepreneurDevelopmentVersionDefinition {
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

export const ENTREPRENEUR_DEVELOPMENT_QUESTIONS_60: number[] = Array.from(
  { length: 60 },
  (_, i) => i + 1
);

export const ENTREPRENEUR_DEVELOPMENT_VERSIONS: EntrepreneurDevelopmentVersionDefinition[] = [
  {
    versionCode: "ENTREPRENEUR_DEVELOPMENT_V1",
    name: "Entrepreneur Development Test — Standard Edition",
    versionNumber: "v1.0",
    targetAge: "14+",
    durationMinutes: 25,
    questionCount: 60,
    mode: "FIXED",
    isDefault: true,
    description:
      "Comprehensive psychometric assessment evaluating entrepreneurial mindset, opportunity recognition, innovation, business acumen, team orchestration, communication, execution, risk tolerance, resilience, and growth orientation through 50 Likert items and 10 situational judgment scenarios.",
    selectedQuestionNumbers: ENTREPRENEUR_DEVELOPMENT_QUESTIONS_60,
  },
];

export class EntrepreneurDevelopmentQuestionSelectionService {
  /**
   * Seeds the Entrepreneur Development Test assessment versions and question linkages idempotently.
   */
  async seedEntrepreneurDevelopmentVersions(client?: PoolClient): Promise<void> {
    const db = client || pool;

    const assessRes = await db.query(
      `SELECT id FROM assessments WHERE code = 'ENTREPRENEUR_DEVELOPMENT_TEST' LIMIT 1`
    );
    if (!assessRes.rows[0]) {
      logger.warn("ENTREPRENEUR_DEVELOPMENT_TEST assessment catalog entry missing, skipping version seeding");
      return;
    }
    const assessmentId = assessRes.rows[0].id;

    // Query all questions for ENTREPRENEUR_DEVELOPMENT_TEST
    const qRes = await db.query(
      `SELECT id, question_number FROM assessment_questions WHERE assessment_id = $1`,
      [assessmentId]
    );
    const qMapByNum: Record<number, string> = {};
    for (const row of qRes.rows) {
      qMapByNum[parseInt(row.question_number, 10)] = row.id;
    }

    if (Object.keys(qMapByNum).length === 0) {
      logger.warn("No questions found for ENTREPRENEUR_DEVELOPMENT_TEST, skipping version seeding");
      return;
    }

    for (const v of ENTREPRENEUR_DEVELOPMENT_VERSIONS) {
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

      // Batch insert question links with exact display_order (1 to 60)
      for (let order = 0; order < v.selectedQuestionNumbers.length; order++) {
        const qNum = v.selectedQuestionNumbers[order];
        const questionId = qMapByNum[qNum];
        if (!questionId) continue;

        await db.query(
          `INSERT INTO assessment_version_questions (version_id, question_id, display_order, is_required)
           VALUES ($1, $2, $3, true)`,
          [versionId, questionId, order + 1]
        );
      }
    }

    logger.info("✨ Entrepreneur Development Test versions & question linkages seeded successfully.");
  }

  /**
   * Fetches the default active version for an assessment.
   */
  async getDefaultVersion(assessmentId: string, client?: PoolClient): Promise<any> {
    const db = client || pool;
    const res = await db.query(
      `SELECT * FROM assessment_versions 
       WHERE assessment_id = $1 AND is_default = true AND status = 'ACTIVE' 
       LIMIT 1`,
      [assessmentId]
    );
    return res.rows[0] || null;
  }

  /**
   * Fetches a version by version code.
   */
  async getVersionByCode(assessmentId: string, versionCode: string, client?: PoolClient): Promise<any> {
    const db = client || pool;
    const res = await db.query(
      `SELECT * FROM assessment_versions 
       WHERE assessment_id = $1 AND version_code = $2 AND status = 'ACTIVE' 
       LIMIT 1`,
      [assessmentId, versionCode]
    );
    return res.rows[0] || null;
  }
}

export const entrepreneurDevelopmentQuestionSelectionService =
  new EntrepreneurDevelopmentQuestionSelectionService();
