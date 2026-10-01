import { pool } from "../src/config/database";
import { userRepository } from "../src/modules/users/user.repository";

async function main() {
  const parentUsers = await pool.query(
    `SELECT u.id, u.email FROM users u JOIN user_roles ur ON u.id = ur.user_id JOIN roles r ON ur.role_id = r.id WHERE r.name = 'PARENT_GUARDIAN' LIMIT 5`
  );
  console.log("PARENT USERS:", parentUsers.rows);
  if (parentUsers.rows.length > 0) {
    const parentId = parentUsers.rows[0].id;
    const features = await userRepository.getUserDashboardFeatures(parentId);
    console.log("getUserDashboardFeatures for parent:", features);

    const userWithRoles = await userRepository.getUserRolesAndPermissions(parentId);
    console.log("getUserRolesAndPermissions for parent:", userWithRoles);
  }
  await pool.end();
}

main().catch(console.error);
