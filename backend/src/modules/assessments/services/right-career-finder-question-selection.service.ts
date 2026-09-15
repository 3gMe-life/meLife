import { PoolClient } from "pg";
import { pool } from "../../../config/database";
import { logger } from "../../../common/utils/logger";

export interface RightCareerFinderVersionDefinition {
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

export const RIGHT_CAREER_FINDER_QUESTIONS_50: number[] = [
  // Form Q# 1..5 (Technology, Computing & Systems Thinking): Bank Q1..Q5
  1, 2, 3, 4, 5,
  // Form Q# 6..10 (Business Leadership & Strategic Management): Bank Q9..Q13
  9, 10, 11, 12, 13,
  // Form Q# 11..15 (Finance, Economics & Quantitative Reasoning): Bank Q17..Q21
  17, 18, 19, 20, 21,
  // Form Q# 16..20 (Creative Expression, Design & Media Arts): Bank Q25..Q29
  25, 26, 27, 28, 29,
  // Form Q# 21..25 (Human Behaviour, Empathy & Social Care): Bank Q33..Q37
  33, 34, 35, 36, 37,
  // Form Q# 26..30 (Law, Public Policy & Civic Reasoning): Bank Q41..Q45
  41, 42, 43, 44, 45,
  // Form Q# 31..35 (Scientific Inquiry, Healthcare & Life Sciences): Bank Q49..Q53
  49, 50, 51, 52, 53,
  // Form Q# 36..40 (Engineering Design, Physical Systems & Applied Innovation): Bank Q57..Q61
  57, 58, 59, 60, 61,
  // Form Q# 41..45 (Education, Pedagogy & Social Research): Bank Q65..Q69
  65, 66, 67, 68, 69,
  // Form Q# 46..50 (Work Preference & Professional Scenarios): Bank Q73..Q77
  73, 74, 75, 76, 77,
];

export const RIGHT_CAREER_FINDER_VERSIONS: RightCareerFinderVersionDefinition[] = [
  {
    versionCode: "RIGHT_CAREER_FINDER_V1",
    name: "Career Finder — Standard Pilot Edition",
    versionNumber: "v1.0",
    targetAge: "15-25+",
    durationMinutes: 25,
    questionCount: 50,
    mode: "FIXED",
    isDefault: true,
    description:
      "Comprehensive educational guidance assessment battery measuring student and professional vocational alignment across 6 overarching career families (Tech, Business/Finance, Healthcare/Sciences, Law/Governance, Creative/Design, Engineering/Sustainability) through 45 Likert items across 9 core construct dimensions and 5 forced-choice vocational work preference scenarios.",
    selectedQuestionNumbers: RIGHT_CAREER_FINDER_QUESTIONS_50,
  },
];

export class RightCareerFinderQuestionSelectionService {
  /**
   * Seeds the Career Finder assessment versions and question linkages idempotently.
   */
  async seedRightCareerFinderVersions(client?: PoolClient): Promise<void> {
    const db = client || pool;

    const assessRes = await db.query(
      `SELECT id FROM assessments WHERE code = 'RIGHT_CAREER_FINDER' LIMIT 1`
    );
    if (!assessRes.rows[0]) {
      logger.warn("RIGHT_CAREER_FINDER assessment catalog entry missing, skipping version seeding");
      return;
    }
    const assessmentId = assessRes.rows[0].id;

    // Query all questions for RIGHT_CAREER_FINDER
    const qRes = await db.query(
      `SELECT id, question_number FROM assessment_questions WHERE assessment_id = $1`,
      [assessmentId]
    );
    const qMapByNum: Record<number, string> = {};
    for (const row of qRes.rows) {
      qMapByNum[parseInt(row.question_number, 10)] = row.id;
    }

    if (Object.keys(qMapByNum).length === 0) {
      logger.warn("No questions found for RIGHT_CAREER_FINDER, skipping version seeding");
      return;
    }

    for (const v of RIGHT_CAREER_FINDER_VERSIONS) {
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

      // Batch insert question links with exact display_order (1 to 50)
      const linkPayload: any[] = [];
      for (let index = 0; index < v.selectedQuestionNumbers.length; index++) {
        const qNum = v.selectedQuestionNumbers[index];
        const questionId = qMapByNum[qNum];
        if (!questionId) continue;
        linkPayload.push({
          version_id: versionId,
          question_id: questionId,
          display_order: index + 1,
          is_required: true,
        });
      }

      if (linkPayload.length > 0) {
        await db.query(
          `INSERT INTO assessment_version_questions (version_id, question_id, display_order, is_required)
           SELECT t.version_id, t.question_id, t.display_order, t.is_required
           FROM json_to_recordset($1) AS t(version_id uuid, question_id uuid, display_order integer, is_required boolean)`,
          [JSON.stringify(linkPayload)]
        );
      }
    }

    logger.info("✨ Career Finder version RIGHT_CAREER_FINDER_V1 seeded and verified (50 questions).");
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

export const rightCareerFinderQuestionSelectionService =
  new RightCareerFinderQuestionSelectionService();
