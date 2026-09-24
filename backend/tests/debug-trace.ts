import { connectDatabase, closeDatabasePool, pool } from "../src/config/database";
import { userRepository } from "../src/modules/users/user.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { authService } from "../src/modules/auth/auth.service";

async function main() {
  await connectDatabase();

  const testEmails = [
    "anjali.menon@melife.org",
    "ramesh.counsellor@example.com",
    "adminconsellur1235@gmail.com",
    "consellur123@gmail.com",
    "test.counsellor.apply@3gmelife.com",
    "seeakkhnajndljwlmm@gmail.com"
  ];

  for (const email of testEmails) {
    console.log(`\n==================================================`);
    console.log(`🔍 INSPECTING ACCOUNT: ${email}`);
    console.log(`==================================================`);
    const user = await userRepository.findByEmail(email);
    if (!user) {
      console.log("Account not found in users table.");
      continue;
    }

    const { roles, permissions } = await userRepository.getUserRolesAndPermissions(user.id);
    const primaryRole = roles[0] || "PARTICIPANT";
    const app = await authRepository.findCounsellorApplicationByUserId(user.id);
    const counsellorRes = await pool.query(
      `SELECT id, approval_status, qualification, experience_years FROM counsellors WHERE user_id = $1`,
      [user.id]
    );

    console.log("1. user.id:", user.id);
    console.log("2. user.status:", user.status);
    console.log("3. primaryRole:", primaryRole);
    console.log("4. roles in user_roles:", roles);
    console.log("5. counsellorApplication in DB:", app);
    console.log("6. counsellorProfile in counsellors table:", counsellorRes.rows[0] || null);

    try {
      const me = await authService.getMe(user.id);
      console.log("7. /auth/me response payload:", JSON.stringify(me, null, 2));
    } catch (e: any) {
      console.log("7. /auth/me threw error:", e.message);
    }
  }

  await closeDatabasePool();
}

main().catch(console.error);
