import { PoolClient } from "pg";
import { pool } from "../../../config/database";
import { logger } from "../../../common/utils/logger";

export interface StreamFinderVersionDefinition {
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

export const STREAM_FINDER_QUESTIONS_V1: number[] = Array.from(
  { length: 80 },
  (_, i) => i + 1
);

export const STREAM_FINDER_VERSIONS: StreamFinderVersionDefinition[] = [
  {
    versionCode: "STREAM_FINDER_V1",
    name: "Stream Finder — Secondary Edition (Class 9-10)",
    versionNumber: "v1.0",
    targetAge: "14-16",
    durationMinutes: 25,
    questionCount: 80,
    mode: "FIXED",
    isDefault: true,
    description:
      "Comprehensive academic stream affinity and vocational discovery battery guiding Class 9-10 students toward optimal Senior Secondary stream choices (Science, Commerce, Humanities, Applied / Technical).",
    selectedQuestionNumbers: STREAM_FINDER_QUESTIONS_V1,
  },
];

export class StreamFinderQuestionSelectionService {
  /**
   * Seeds the Stream Finder assessment versions and question linkages idempotently.
   */
  async seedStreamFinderVersions(client?: PoolClient): Promise<void> {
    const db = client || pool;

    const assessRes = await db.query(
      `SELECT id FROM assessments WHERE code = 'STREAM_FINDER' LIMIT 1`
    );
    if (!assessRes.rows[0]) {
      logger.warn("STREAM_FINDER assessment catalog entry missing, skipping version seeding");
      return;
    }
    const assessmentId = assessRes.rows[0].id;

    // Fast check: if already seeded 80 linked questions
    const countCheck = await db.query(
      `SELECT COUNT(*) as count FROM assessment_version_questions WHERE version_id IN (
         SELECT id FROM assessment_versions WHERE assessment_id = $1
       )`,
      [assessmentId]
    );
    if (parseInt(countCheck.rows[0]?.count, 10) === 80) {
      logger.info("✨ Stream Finder version questions already fully seeded (80 items).");
      return;
    }

    // Query all questions for STREAM_FINDER
    const qRes = await db.query(
      `SELECT id, question_number FROM assessment_questions WHERE assessment_id = $1`,
      [assessmentId]
    );
    const qMapByNum: Record<number, string> = {};
    for (const row of qRes.rows) {
      qMapByNum[parseInt(row.question_number, 10)] = row.id;
    }

    if (Object.keys(qMapByNum).length === 0) {
      logger.warn("No questions found for STREAM_FINDER, skipping version seeding");
      return;
    }

    for (const v of STREAM_FINDER_VERSIONS) {
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

      // Batch insert question links
      const linkPromises = v.selectedQuestionNumbers.map((qNum, index) => {
        const questionId = qMapByNum[qNum];
        if (!questionId) return Promise.resolve();

        return db.query(
          `INSERT INTO assessment_version_questions (version_id, question_id, display_order, is_required)
           VALUES ($1, $2, $3, true)
           ON CONFLICT (version_id, question_id) DO UPDATE SET
             display_order = EXCLUDED.display_order`,
          [versionId, questionId, index + 1]
        );
      });

      await Promise.all(linkPromises);
    }

    logger.info("✨ Stream Finder version STREAM_FINDER_V1 seeded and verified.");
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

export const streamFinderQuestionSelectionService = new StreamFinderQuestionSelectionService();
