import { pool, connectDatabase, closeDatabasePool } from "../src/config/database";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import { assessmentContentRepository } from "../src/modules/assessments/assessment-content.repository";
import { streamFinderQuestionSelectionService } from "../src/modules/assessments/services/stream-finder-question-selection.service";

async function verify() {
  await connectDatabase();
  await assessmentRepository.initSchema();
  await assessmentRepository.seedCatalog();
  await assessmentContentRepository.initSchema();
  await assessmentContentRepository.seedStreamFinderContent();
  await streamFinderQuestionSelectionService.seedStreamFinderVersions();

  const assessRes = await pool.query(
    "SELECT id, code, name, question_count FROM assessments WHERE code = 'STREAM_FINDER'"
  );
  console.log("STREAM_FINDER Assessment:", assessRes.rows[0]);

  const assessmentId = assessRes.rows[0]?.id;

  const sectionsRes = await pool.query(
    "SELECT code, name, display_order FROM assessment_sections WHERE assessment_id = $1 ORDER BY display_order ASC",
    [assessmentId]
  );
  console.log("Sections count:", sectionsRes.rowCount);
  sectionsRes.rows.forEach(r => console.log(`  - [${r.display_order}] ${r.code}: ${r.name}`));

  const qCountRes = await pool.query(
    "SELECT COUNT(*) as count FROM assessment_questions WHERE assessment_id = $1",
    [assessmentId]
  );
  console.log("Total Questions count in DB:", qCountRes.rows[0].count);

  const optCountRes = await pool.query(
    `SELECT COUNT(o.id) as count 
     FROM question_options o 
     JOIN assessment_questions q ON o.question_id = q.id 
     WHERE q.assessment_id = $1`,
    [assessmentId]
  );
  console.log("Total Question Options in DB:", optCountRes.rows[0].count);

  const vqCountRes = await pool.query(
    `SELECT COUNT(vq.id) as count 
     FROM assessment_version_questions vq 
     JOIN assessment_versions v ON vq.version_id = v.id 
     WHERE v.assessment_id = $1`,
    [assessmentId]
  );
  console.log("Linked Version Questions count in DB:", vqCountRes.rows[0].count);

  await closeDatabasePool();
}

verify().catch(console.error);
