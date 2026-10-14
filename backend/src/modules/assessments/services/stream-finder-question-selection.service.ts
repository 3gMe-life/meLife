import { PoolClient } from "pg";
import { pool } from "../../../config/database";
import { logger } from "../../../common/utils/logger";

import {
  STREAM_FINDER_CORE_QUESTION_NUMBERS,
  STREAM_FINDER_EXTENSION_QUESTION_NUMBERS,
} from "../content/stream-finder-catalog.data";

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
    versionCode: "STREAM_FINDER_V2_CORE",
    name: "Stream Finder — Core Edition (Class 9-10)",
    versionNumber: "v2.0-core",
    targetAge: "14-16",
    durationMinutes: 18,
    questionCount: 48,
    mode: "CORE",
    isDefault: true,
    description:
      "Balanced 48-item academic stream affinity diagnostic for Class 9-10 students assessing alignment with Science, Commerce, Humanities, and Applied / Technical streams.",
    selectedQuestionNumbers: STREAM_FINDER_CORE_QUESTION_NUMBERS,
  },
  {
    versionCode: "STREAM_FINDER_V2_EXTENDED",
    name: "Stream Finder — Extension Battery (+32 Items)",
    versionNumber: "v2.0-ext",
    targetAge: "14-16",
    durationMinutes: 12,
    questionCount: 32,
    mode: "EXTENDED",
    isDefault: false,
    description:
      "Complementary 32-item diagnostic battery expanding evidence to the full 80-question profile for students with mixed affinities or moderate clarity.",
    selectedQuestionNumbers: STREAM_FINDER_EXTENSION_QUESTION_NUMBERS,
  },
  {
    versionCode: "STREAM_FINDER_V1",
    name: "Stream Finder — Comprehensive Edition (80 Items)",
    versionNumber: "v1.0",
    targetAge: "14-16",
    durationMinutes: 25,
    questionCount: 80,
    mode: "FIXED",
    isDefault: false,
    description:
      "Comprehensive 80-item academic stream affinity and vocational discovery battery guiding Class 9-10 students toward optimal Senior Secondary stream choices (Science, Commerce, Humanities, Applied / Technical).",
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
           version_number = EXCLUDED.version_number,
           target_age = EXCLUDED.target_age,
           duration_minutes = EXCLUDED.duration_minutes,
           question_count = EXCLUDED.question_count,
           mode = EXCLUDED.mode,
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

      // Check if this version already has the correct number of questions linked
      const countCheck = await db.query(
        `SELECT COUNT(*) as count FROM assessment_version_questions WHERE version_id = $1`,
        [versionId]
      );
      const currentCount = parseInt(countCheck.rows[0]?.count, 10) || 0;

      if (currentCount !== v.selectedQuestionNumbers.length) {
        // Link question bank
        for (let index = 0; index < v.selectedQuestionNumbers.length; index++) {
          const qNum = v.selectedQuestionNumbers[index];
          const questionId = qMapByNum[qNum];
          if (!questionId) continue;

          await db.query(
            `INSERT INTO assessment_version_questions (version_id, question_id, display_order, is_required)
             VALUES ($1, $2, $3, true)
             ON CONFLICT (version_id, question_id) DO UPDATE SET
               display_order = EXCLUDED.display_order`,
            [versionId, questionId, index + 1]
          );
        }
      }
    }

    // Ensure only STREAM_FINDER_V2_CORE is marked default among active STREAM_FINDER versions
    await db.query(
      `UPDATE assessment_versions
       SET is_default = (version_code = 'STREAM_FINDER_V2_CORE')
       WHERE assessment_id = $1`,
      [assessmentId]
    );

    logger.info("✨ Stream Finder versions (V2 Core 48 items, V2 Extended 32 items, V1 80 items) seeded and verified.");
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
