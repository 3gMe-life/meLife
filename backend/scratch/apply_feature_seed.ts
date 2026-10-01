import { authRepository } from "../src/modules/auth/auth.repository";
import { pool, connectDatabase, closeDatabasePool } from "../src/config/database";

async function run() {
  console.log("Applying Dashboard Features and Role Mappings...");
  await connectDatabase();
  await authRepository.seedDashboardFeatures();

  // Verify PARENT_GUARDIAN features
  const parentRoleRes = await pool.query(`SELECT id FROM roles WHERE name = 'PARENT_GUARDIAN'`);
  if (parentRoleRes.rows.length > 0) {
    const parentRoleId = parentRoleRes.rows[0].id;
    const parentFeatures = await pool.query(
      `SELECT df.key, df.name, rdf.is_enabled 
       FROM role_dashboard_features rdf 
       JOIN dashboard_features df ON rdf.feature_id = df.id 
       WHERE rdf.role_id = $1
       ORDER BY df.sort_order ASC`,
      [parentRoleId]
    );
    console.log("PARENT_GUARDIAN Features count:", parentFeatures.rows.length);
    console.table(parentFeatures.rows);
  }

  await closeDatabasePool();
  console.log("Done!");
}

run().catch(console.error);
