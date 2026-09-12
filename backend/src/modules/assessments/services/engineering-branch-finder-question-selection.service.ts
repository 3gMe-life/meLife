import { PoolClient } from "pg";
import { pool } from "../../../config/database";
import { logger } from "../../../common/utils/logger";

export interface EngineeringBranchFinderVersionDefinition {
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

export const ENGINEERING_BRANCH_FINDER_QUESTIONS_V2: number[] = Array.from(
  { length: 80 },
  (_, i) => i + 1
);

export const ENGINEERING_BRANCH_FINDER_VERSIONS: EngineeringBranchFinderVersionDefinition[] = [
  {
    versionCode: "ENGINEERING_BRANCH_FINDER_V2",
    name: "Engineering Branch Finder — Standard Pilot Edition",
    versionNumber: "v2.0",
    targetAge: "16-18+",
    durationMinutes: 25,
    questionCount: 80,
    mode: "FIXED",
    isDefault: true,
    description:
      "Exploratory psychometric battery evaluating interest and affinities across 8 core engineering disciplines (Computer Science, ECE, Electrical, Mechanical, Civil, Chemical, Biomedical, Aerospace) via 64 Likert preferences and 16 practical engineering scenarios.",
    selectedQuestionNumbers: ENGINEERING_BRANCH_FINDER_QUESTIONS_V2,
  },
];

export class EngineeringBranchFinderQuestionSelectionService {
  /**
   * Seeds the Engineering Branch Finder assessment versions and question linkages idempotently.
   */
  async seedEngineeringBranchFinderVersions(client?: PoolClient): Promise<void> {
    const db = client || pool;

    const assessRes = await db.query(
      `SELECT id FROM assessments WHERE code = 'ENGINEERING_BRANCH_FINDER' LIMIT 1`
    );
    if (!assessRes.rows[0]) {
      logger.warn("ENGINEERING_BRANCH_FINDER assessment catalog entry missing, skipping version seeding");
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
      logger.info("✨ Engineering Branch Finder version questions already fully seeded (80 items).");
      return;
    }

    // Query all questions for ENGINEERING_BRANCH_FINDER
    const qRes = await db.query(
      `SELECT id, question_number FROM assessment_questions WHERE assessment_id = $1`,
      [assessmentId]
    );
    const qMapByNum: Record<number, string> = {};
    for (const row of qRes.rows) {
      qMapByNum[parseInt(row.question_number, 10)] = row.id;
    }

    if (Object.keys(qMapByNum).length === 0) {
      logger.warn("No questions found for ENGINEERING_BRANCH_FINDER, skipping version seeding");
      return;
    }

    for (const v of ENGINEERING_BRANCH_FINDER_VERSIONS) {
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
      const versionId = vRes.rows[0]?.id;
      if (!versionId) continue;

      let displayOrder = 1;
      for (const qNum of v.selectedQuestionNumbers) {
        const questionId = qMapByNum[qNum];
        if (questionId) {
          await db.query(
            `INSERT INTO assessment_version_questions (version_id, question_id, display_order, is_required)
             VALUES ($1, $2, $3, true)
             ON CONFLICT (version_id, question_id) DO UPDATE SET
               display_order = EXCLUDED.display_order`,
            [versionId, questionId, displayOrder++]
          );
        }
      }
    }

    logger.info("✨ Engineering Branch Finder versions and question linkages seeded successfully.");
  }

  /**
   * Resolves target version definition by version code.
   */
  async getVersionByCode(assessmentId: string, versionCode: string): Promise<any | null> {
    const res = await pool.query(
      `SELECT * FROM assessment_versions WHERE assessment_id = $1 AND version_code = $2 LIMIT 1`,
      [assessmentId, versionCode]
    );
    return res.rows[0] || null;
  }

  /**
   * Resolves default version for Engineering Branch Finder.
   */
  async getDefaultVersion(assessmentId: string): Promise<any | null> {
    const res = await pool.query(
      `SELECT * FROM assessment_versions WHERE assessment_id = $1 AND is_default = true LIMIT 1`,
      [assessmentId]
    );
    return res.rows[0] || null;
  }
}

export const engineeringBranchFinderQuestionSelectionService =
  new EngineeringBranchFinderQuestionSelectionService();
