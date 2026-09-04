import { PoolClient } from "pg";
import { pool } from "../../../config/database";
import { logger } from "../../../common/utils/logger";

export interface VersionDefinition {
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

export const SKILL_FINDER_STUDENT_QUESTIONS: number[] = [
  // SECTION A: Interest Discovery (24 items - 4 per RIASEC domain)
  1, 7, 13, 19,    // Builder (R)
  2, 8, 14, 20,    // Explorer (I)
  3, 9, 15, 21,    // Creator (A)
  4, 10, 16, 22,   // Helper (S)
  5, 11, 17, 23,   // Leader (E)
  6, 12, 18, 24,   // Organiser (C)

  // SECTION B: Skill Behaviour (16 items - 2 per dimension)
  31, 39,          // Logical & Problem-Solving
  32, 40,          // Communication & Expression
  33, 41,          // Creative Thinking
  34, 42,          // Visual-Spatial Thinking
  35, 43,          // Practical & Technical Skill
  36, 44,          // Social & Teamwork
  37, 45,          // Leadership & Initiative
  38, 46,          // Self-Management & Focus

  // SECTION C: Demonstrated Aptitude (16 items across 8 areas)
  55, 57,          // Pattern & Deductive Logic (Includes Visual Diagram Q57)
  59, 60,          // Numerical Reasoning & Proportions
  63, 64,          // Verbal Analogies & Evidence
  67, 68,          // Spatial Visualization (Includes Visual Diagram Q68)
  71, 72,          // Practical Problem Solving
  73, 74,          // Creative Thinking Tasks (Open divergence challenges)
  75, 76,          // Situational Social Judgment
  77, 78,          // Planning, Estimation & Scheduling

  // SECTION D: Developmental Strengths (10 items across 7 habits)
  79, 86,          // Curiosity & Inquisitiveness
  80,              // Persistence & Resilience
  81, 88,          // Adaptability & Openness to Feedback
  82,              // Initiative & Self-Drive
  83, 90,          // Collaborative Learning
  84,              // Attention to Detail
  85,              // Learning Independence

  // SECTION E: Response Quality & Validity (2 items)
  102,             // Parallel Explorer consistency item (matches Q2)
  104,             // Direct attention check item
];

export const SKILL_FINDER_ADVANCED_QUESTIONS: number[] = Array.from(
  { length: 104 },
  (_, i) => i + 1
);

export const SKILL_FINDER_VERSIONS: VersionDefinition[] = [
  {
    versionCode: "STUDENT_STANDARD",
    name: "Skill Finder — Student Edition",
    versionNumber: "v1.0",
    targetAge: "10-13",
    durationMinutes: 30,
    questionCount: SKILL_FINDER_STUDENT_QUESTIONS.length, // Exactly 68 questions
    mode: "FIXED",
    isDefault: true,
    description:
      "Calibrated for middle school students (Ages 10–13). Measures career interests, skill behaviours, cognitive aptitudes, and learning habits with minimal cognitive fatigue.",
    selectedQuestionNumbers: SKILL_FINDER_STUDENT_QUESTIONS,
  },
  {
    versionCode: "ADVANCED_COMPREHENSIVE",
    name: "Skill Finder — Advanced Comprehensive Edition",
    versionNumber: "v1.0",
    targetAge: "10-14",
    durationMinutes: 50,
    questionCount: SKILL_FINDER_ADVANCED_QUESTIONS.length, // Exactly 104 questions
    mode: "FIXED",
    isDefault: false,
    description:
      "Comprehensive diagnostic battery for institutional evaluations and in-depth counselor career guidance.",
    selectedQuestionNumbers: SKILL_FINDER_ADVANCED_QUESTIONS,
  },
];

export class SkillFinderQuestionSelectionService {
  /**
   * Seeds the Skill Finder assessment versions and question linkages idempotently.
   */
  async seedSkillFinderVersions(client?: PoolClient): Promise<void> {
    const db = client || pool;

    // 1. Locate SKILL_FINDER assessment ID
    const assessRes = await db.query(
      `SELECT id FROM assessments WHERE code = 'SKILL_FINDER' LIMIT 1`
    );
    if (!assessRes.rows[0]) {
      logger.warn("SKILL_FINDER catalog entry missing, skipping version seeding");
      return;
    }
    const assessmentId = assessRes.rows[0].id;

    // Fast check: if both versions already have 172 question links, return immediately
    const countCheck = await db.query(
      `SELECT COUNT(*) as count FROM assessment_version_questions WHERE version_id IN (
         SELECT id FROM assessment_versions WHERE assessment_id = $1
       )`,
      [assessmentId]
    );
    if (parseInt(countCheck.rows[0]?.count, 10) === 172) {
      logger.info("✨ Skill Finder Question Bank versions already fully seeded.");
      return;
    }

    // 2. Query all question mapping by question_number
    const qRes = await db.query(
      `SELECT id, question_number FROM assessment_questions WHERE assessment_id = $1`,
      [assessmentId]
    );
    const qMapByNum: Record<number, string> = {};
    for (const row of qRes.rows) {
      qMapByNum[parseInt(row.question_number, 10)] = row.id;
    }

    if (Object.keys(qMapByNum).length === 0) {
      logger.warn("No questions found for SKILL_FINDER, skipping version seeding");
      return;
    }

    // 3. Upsert each Version and batch insert its question links
    for (const v of SKILL_FINDER_VERSIONS) {
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

    logger.info(
      "✨ Skill Finder Question Bank Versions (Student Edition & Advanced Edition) seeded successfully."
    );
  }

  /**
   * Retrieves version definition by code.
   */
  async getVersionByCode(
    assessmentId: string,
    versionCode: string,
    client?: PoolClient
  ): Promise<any | null> {
    const db = client || pool;
    const res = await db.query(
      `SELECT id, assessment_id, version_code, name, version_number, target_age, duration_minutes, question_count, is_default, mode
       FROM assessment_versions
       WHERE assessment_id = $1 AND version_code = $2 AND status = 'ACTIVE'
       LIMIT 1`,
      [assessmentId, versionCode]
    );
    return res.rows[0] || null;
  }

  /**
   * Retrieves the default active version for an assessment.
   */
  async getDefaultVersion(
    assessmentId: string,
    client?: PoolClient
  ): Promise<any | null> {
    const db = client || pool;
    const res = await db.query(
      `SELECT id, assessment_id, version_code, name, version_number, target_age, duration_minutes, question_count, is_default, mode
       FROM assessment_versions
       WHERE assessment_id = $1 AND is_default = true AND status = 'ACTIVE'
       LIMIT 1`,
      [assessmentId]
    );
    return res.rows[0] || null;
  }
}

export const skillFinderQuestionSelectionService =
  new SkillFinderQuestionSelectionService();
