import { connectDatabase, closeDatabasePool, pool } from "../src/config/database";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { skillFinderQuestionSelectionService } from "../src/modules/assessments/services/skill-finder-question-selection.service";
import { createApp } from "../src/app";
import http from "http";
import { performance } from "perf_hooks";

export interface ConcurrencyMetrics {
  concurrency: number;
  totalRequests: number;
  successfulRequests: number;
  errorCount: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  minMs: number;
  maxMs: number;
  avgMs: number;
  duplicateRows: number;
  corruptedResponses: number;
}

export async function runAutosaveConcurrencyBenchmark(): Promise<ConcurrencyMetrics[]> {
  console.log("⚡ Starting Autosave Concurrency & Atomic Upsert Benchmark...\n");

  await connectDatabase();
  await authRepository.seedRolePermissions();
  await participantRepository.initSchema();
  await assessmentRepository.initSchema();
  await assessmentRepository.seedCatalog();
  await assessmentContentRepository.initSchema();
  await skillFinderQuestionSelectionService.seedSkillFinderVersions();

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as { port: number };
  const baseUrl = `http://localhost:${address.port}/api/v1`;

  const results: ConcurrencyMetrics[] = [];

  try {
    const timestamp = Date.now();

    // 1. Create a test participant
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `concurrency_${timestamp}@melife.app`,
        password: "Password123!",
        firstName: "ConcurrentTester",
        lastName: "ScaleTest",
        registrationPath: "STUDENT",
      }),
    });
    const regData = await regRes.json();
    const token = regData.data.accessToken;
    const userId = regData.data.user.id;

    await fetch(`${baseUrl}/participants/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        dateOfBirth: "2012-05-15",
        educationStage: "SCHOOL",
        gradeLevel: "7",
        schoolName: "National Public School",
        curriculumOrBoard: "CBSE",
        guardianName: "Jane Doe",
        guardianPhone: "9876543210",
      }),
    });

    const concurrencyTiers = [10, 50, 100];

    for (const concurrency of concurrencyTiers) {
      console.log(`\n--- Running Concurrency Tier: ${concurrency} simultaneous saves ---`);

      // Start a fresh attempt for this tier
      const startRes = await fetch(`${baseUrl}/assessments/SKILL_FINDER/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ versionCode: "STUDENT_STANDARD" }),
      });
      const startData = await startRes.json();
      const attemptId = startData.data.attemptId;

      // Fetch attempt questions
      const qRes = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/questions?lang=en`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const qData = await qRes.json();
      const questions = qData.data.questions;

      // Construct concurrent payload array
      // Target multiple questions with repeated rapid overwrites to stress atomic upserts
      const requests = Array.from({ length: concurrency }).map((_, idx) => {
        const questionIndex = idx % questions.length;
        const q = questions[questionIndex];
        const opt = q.options && q.options.length > 0 ? q.options[idx % q.options.length] : null;
        let val = "3";
        if (q.question_type === "likert_1_4") val = String((idx % 4) + 1);
        else if (q.question_type === "open_scored") val = `Concurrent stress note ${idx}`;
        else if (opt?.optionKey) val = opt.optionKey;
        else val = String((idx % 5) + 1);

        return {
          questionId: q.id,
          selectedOptionId: opt?.id || null,
          responseValue: val,
        };
      });

      const latencies: number[] = [];
      let errors = 0;

      // Fire concurrent requests simultaneously
      const promises = requests.map(async (payload) => {
        const t0 = performance.now();
        try {
          const res = await fetch(`${baseUrl}/assessments/attempts/${attemptId}/responses`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
          const t1 = performance.now();
          latencies.push(t1 - t0);
          if (!res.ok) {
            errors++;
          }
        } catch {
          const t1 = performance.now();
          latencies.push(t1 - t0);
          errors++;
        }
      });

      await Promise.all(promises);

      latencies.sort((a, b) => a - b);
      const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0;
      const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
      const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;
      const min = latencies[0] || 0;
      const max = latencies[latencies.length - 1] || 0;
      const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;

      // Database verification
      const dbCheck = await pool.query(
        `SELECT COUNT(*) as total_rows, COUNT(DISTINCT question_id) as distinct_questions
         FROM assessment_responses
         WHERE attempt_id = $1`,
        [attemptId]
      );
      const totalRows = parseInt(dbCheck.rows[0].total_rows, 10);
      const distinctQuestions = parseInt(dbCheck.rows[0].distinct_questions, 10);
      const duplicateRows = totalRows - distinctQuestions;

      const corruptCheck = await pool.query(
        `SELECT COUNT(*) as corrupt_count
         FROM assessment_responses
         WHERE attempt_id = $1 AND (score IS NULL OR response_value IS NULL OR question_id IS NULL)`,
        [attemptId]
      );
      const corruptedResponses = parseInt(corruptCheck.rows[0].corrupt_count, 10);

      const metrics: ConcurrencyMetrics = {
        concurrency,
        totalRequests: concurrency,
        successfulRequests: concurrency - errors,
        errorCount: errors,
        p50Ms: Number(p50.toFixed(2)),
        p95Ms: Number(p95.toFixed(2)),
        p99Ms: Number(p99.toFixed(2)),
        minMs: Number(min.toFixed(2)),
        maxMs: Number(max.toFixed(2)),
        avgMs: Number(avg.toFixed(2)),
        duplicateRows,
        corruptedResponses,
      };

      results.push(metrics);

      console.log(`Results for ${concurrency} concurrent requests:`);
      console.log(`  - p50: ${metrics.p50Ms} ms`);
      console.log(`  - p95: ${metrics.p95Ms} ms`);
      console.log(`  - p99: ${metrics.p99Ms} ms`);
      console.log(`  - Avg: ${metrics.avgMs} ms (Min: ${metrics.minMs} ms, Max: ${metrics.maxMs} ms)`);
      console.log(`  - Errors: ${metrics.errorCount}`);
      console.log(`  - Duplicate Rows: ${metrics.duplicateRows}`);
      console.log(`  - Corrupted Responses: ${metrics.corruptedResponses}`);
    }
  } catch (err) {
    console.error("Benchmark error:", err);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await closeDatabasePool();
  }

  return results;
}

if (require.main === module) {
  runAutosaveConcurrencyBenchmark()
    .then((metrics) => {
      console.log("\n✅ Benchmark Complete. Summary:");
      console.table(metrics);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
