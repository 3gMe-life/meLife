import { PoolClient } from "pg";
import { pool } from "../../../config/database";
import { logger } from "../../../common/utils/logger";

export interface AiJobRiskFinderVersionDefinition {
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

export const AI_JOB_RISK_FINDER_QUESTIONS_30: number[] = [
  // Construct 1: Technology Adaptability (5 items, Bank Q1..Q5)
  1, 2, 3, 4, 5,
  // Construct 2: Learning Agility (5 items, Bank Q9..Q13)
  9, 10, 11, 12, 13,
  // Construct 3: Critical Thinking (5 items, Bank Q17..Q21)
  17, 18, 19, 20, 21,
  // Construct 4: Human Collaboration (5 items, Bank Q25..Q29)
  25, 26, 27, 28, 29,
  // Construct 5: Creative Synthesis (5 items, Bank Q33..Q37)
  33, 34, 35, 36, 37,
  // Construct 6: Ethical Awareness (5 items, Bank Q41..Q45)
  41, 42, 43, 44, 45,
];

export const AI_JOB_RISK_FINDER_VERSIONS: AiJobRiskFinderVersionDefinition[] = [
  {
    versionCode: "AI_JOB_RISK_FINDER_V1",
    name: "AI Job Risk Finder — Standard Pilot Edition",
    versionNumber: "v1.0",
    targetAge: "14-25",
    durationMinutes: 20,
    questionCount: 30,
    mode: "FIXED",
    isDefault: true,
    description:
      "Psychometric & occupational impact assessment battery measuring student AI readiness orientation across 6 core constructs (Technology Adaptability, Learning Agility, Critical Thinking, Human Collaboration, Creative Synthesis, Ethical Awareness) and synthesizing dual-evidence occupational AI task exposure.",
    selectedQuestionNumbers: AI_JOB_RISK_FINDER_QUESTIONS_30,
  },
];

export class AiJobRiskFinderQuestionSelectionService {
  /**
   * Seeds the AI Job Risk Finder assessment versions and question linkages idempotently.
   */
  async seedAiJobRiskFinderVersions(client?: PoolClient): Promise<void> {
    const db = client || pool;

    const assessRes = await db.query(
      `SELECT id FROM assessments WHERE code = 'AI_JOB_RISK_FINDER' LIMIT 1`
    );
    if (!assessRes.rows[0]) {
      logger.warn("AI_JOB_RISK_FINDER assessment catalog entry missing, skipping version seeding");
      return;
    }
    const assessmentId = assessRes.rows[0].id;

    // Query all questions for AI_JOB_RISK_FINDER
    const qRes = await db.query(
      `SELECT id, question_number FROM assessment_questions WHERE assessment_id = $1`,
      [assessmentId]
    );
    const qMapByNum: Record<number, string> = {};
    for (const row of qRes.rows) {
      qMapByNum[parseInt(row.question_number, 10)] = row.id;
    }

    if (Object.keys(qMapByNum).length === 0) {
      logger.warn("No questions found for AI_JOB_RISK_FINDER, skipping version seeding");
      return;
    }

    for (const v of AI_JOB_RISK_FINDER_VERSIONS) {
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

      // Clear old question links if re-seeding
      await db.query(
        `DELETE FROM assessment_version_questions WHERE version_id = $1`,
        [versionId]
      );

      // Link standard 30 questions
      let orderIndex = 1;
      for (const qNum of v.selectedQuestionNumbers) {
        const questionId = qMapByNum[qNum];
        if (!questionId) {
          logger.warn(`Question #${qNum} not found for AI_JOB_RISK_FINDER, skipping linkage`);
          continue;
        }

        await db.query(
          `INSERT INTO assessment_version_questions (version_id, question_id, display_order, is_required)
           VALUES ($1, $2, $3, true)
           ON CONFLICT (version_id, question_id) DO UPDATE SET
             display_order = EXCLUDED.display_order,
             is_required = EXCLUDED.is_required`,
          [versionId, questionId, orderIndex]
        );
        orderIndex++;
      }
    }

    logger.info("✨ AI Job Risk Finder assessment versions and standard 30-item form seeded successfully.");
  }
}

export const aiJobRiskFinderQuestionSelectionService =
  new AiJobRiskFinderQuestionSelectionService();
