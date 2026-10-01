import { pool, connectDatabase, closeDatabasePool } from "../../../config/database";
import { assessmentRepository } from "../assessment.repository";
import { assessmentContentRepository } from "../assessment-content.repository";
import { entrepreneurDevelopmentQuestionSelectionService } from "../services/entrepreneur-development-question-selection.service";

async function verifyDatabase() {
  console.log("======================================================================");
  console.log("🔍 TESTING POSTGRESQL DATABASE SEEDING FOR ENTREPRENEUR DEVELOPMENT TEST");
  console.log("======================================================================\n");

  try {
    await connectDatabase();

    // 1. Seed catalog
    console.log("1. Seeding Assessment Catalog...");
    await assessmentRepository.seedCatalog();

    // 2. Seed ED Content
    console.log("2. Seeding ED Content (Sections, Dimensions, Questions, Options)...");
    await assessmentContentRepository.seedEntrepreneurDevelopmentContent();

    // 3. Seed ED Version & Linkages
    console.log("3. Seeding ED Version & Linkages...");
    await entrepreneurDevelopmentQuestionSelectionService.seedEntrepreneurDevelopmentVersions();

    // 4. Query DB & Verify counts
    console.log("\n4. Verifying DB Records...");
    const assessRes = await pool.query(
      `SELECT id, code, name, question_count, estimated_minutes, status 
       FROM assessments WHERE code = 'ENTREPRENEUR_DEVELOPMENT_TEST'`
    );
    console.log("Assessments row:", assessRes.rows[0]);

    if (!assessRes.rows[0]) {
      throw new Error("Assessment entry not found in assessments table!");
    }
    const assessmentId = assessRes.rows[0].id;

    const secRes = await pool.query(
      `SELECT id, code, name FROM assessment_sections WHERE assessment_id = $1 ORDER BY display_order`,
      [assessmentId]
    );
    console.log(`Sections count: ${secRes.rows.length}`);
    for (const s of secRes.rows) {
      console.log(` - Section: ${s.code} (${s.name})`);
    }

    const dimRes = await pool.query(
      `SELECT d.id, d.code, d.name FROM assessment_dimensions d
       JOIN assessment_sections s ON d.section_id = s.id
       WHERE s.assessment_id = $1 ORDER BY d.display_order`,
      [assessmentId]
    );
    console.log(`Dimensions count: ${dimRes.rows.length}`);

    const qRes = await pool.query(
      `SELECT COUNT(*) as count FROM assessment_questions WHERE assessment_id = $1`,
      [assessmentId]
    );
    const qCount = parseInt(qRes.rows[0].count, 10);
    console.log(`Questions count in DB: ${qCount} (Expected: 60)`);

    const optRes = await pool.query(
      `SELECT COUNT(*) as count FROM question_options o
       JOIN assessment_questions q ON o.question_id = q.id
       WHERE q.assessment_id = $1`,
      [assessmentId]
    );
    const optCount = parseInt(optRes.rows[0].count, 10);
    console.log(`Options count in DB: ${optCount} (Expected: >= 290)`);

    const verRes = await pool.query(
      `SELECT v.id, v.version_code, COUNT(vq.id) as linked_questions
       FROM assessment_versions v
       LEFT JOIN assessment_version_questions vq ON v.id = vq.version_id
       WHERE v.assessment_id = $1
       GROUP BY v.id, v.version_code`,
      [assessmentId]
    );
    console.log(`Versions count: ${verRes.rows.length}`);
    for (const v of verRes.rows) {
      console.log(` - Version: ${v.version_code} with ${v.linked_questions} linked questions`);
    }

    if (qCount === 60 && dimRes.rows.length === 10 && secRes.rows.length === 2) {
      console.log("\n🎉 POSTGRESQL DATABASE SEEDING VERIFIED PERFECTLY!");
    } else {
      throw new Error(`Counts mismatch: Q=${qCount}, Dim=${dimRes.rows.length}, Sec=${secRes.rows.length}`);
    }
  } catch (err) {
    console.error("Database verification failed:", err);
    process.exit(1);
  } finally {
    await closeDatabasePool();
  }
}

verifyDatabase();
