import { connectDatabase, closeDatabasePool, pool } from "../src/config/database";
import { hashPassword } from "../src/common/utils/crypto";
import { userRepository } from "../src/modules/users/user.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { authService } from "../src/modules/auth/auth.service";

const ADMIN_EMAIL = "admin.test@geniusgroup.com";
const DEFAULT_PASSWORD = process.env.ADMIN_TEST_PASSWORD || "AdminTest123!";

async function seedAdminUser() {
  console.log("=================================================");
  console.log("🛠️  MeLife Development Admin Account Provisioning");
  console.log("=================================================\n");

  await connectDatabase();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log(`1. Generating Argon2id password hash for ${ADMIN_EMAIL}...`);
    const passwordHash = await hashPassword(DEFAULT_PASSWORD);

    // 1. Check if user already exists
    const existingUser = await userRepository.findByEmail(ADMIN_EMAIL, client);
    let userId: string;

    if (existingUser) {
      console.log(`ℹ️  Existing account found (ID: ${existingUser.id}). Updating credentials & status...`);
      userId = existingUser.id;
      await client.query(
        `UPDATE users
         SET password_hash = $1,
             status = 'ACTIVE',
             email_verified_at = COALESCE(email_verified_at, NOW()),
             updated_at = NOW()
         WHERE id = $2`,
        [passwordHash, userId]
      );
    } else {
      console.log(`ℹ️  Creating new user record...`);
      const newUser = await userRepository.createUser(
        {
          email: ADMIN_EMAIL,
          passwordHash,
          firstName: "Admin",
          lastName: "Test",
          status: "ACTIVE",
          emailVerifiedAt: new Date(),
        },
        client
      );
      userId = newUser.id;
    }

    // 2. Ensure SUPER_ADMIN role is assigned as primary
    console.log(`2. Assigning primary SUPER_ADMIN role...`);
    // Remove conflicting non-primary user roles if any
    await client.query(`DELETE FROM user_roles WHERE user_id = $1`, [userId]);
    await userRepository.assignRole(userId, "SUPER_ADMIN", true, client);

    // 3. Ensure LOCAL auth identity exists
    console.log(`3. Synchronizing LOCAL auth identity...`);
    await authRepository.createAuthIdentity(
      { userId, provider: "LOCAL", providerAccountId: userId },
      client
    );

    await client.query("COMMIT");
    console.log("✅ Account provisioning committed to database successfully.\n");

    // =========================================================================
    // 4. Verification: Query complete RBAC chain
    // =========================================================================
    console.log("--- [RBAC Chain Verification] ---");
    const rbacQuery = `
      SELECT
        u.id as user_id,
        u.email,
        u.first_name,
        u.last_name,
        u.status,
        r.name as role_name,
        ur.is_primary,
        p.name as permission_name,
        p.category as permission_category
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE u.id = $1
    `;
    const rbacRes = await pool.query(rbacQuery, [userId]);
    console.log(`User ID:              ${userId}`);
    console.log(`Email:                ${rbacRes.rows[0]?.email}`);
    console.log(`Status:               ${rbacRes.rows[0]?.status}`);
    console.log(`Primary Role:         ${rbacRes.rows[0]?.role_name}`);
    console.log(`Is Primary:           ${rbacRes.rows[0]?.is_primary}`);
    console.log(`Assigned Permissions: ${rbacRes.rows.map((r) => r.permission_name).join(", ")}`);

    // =========================================================================
    // 5. Verification: Test authenticating through normal authService.login()
    // =========================================================================
    console.log("\n--- [Authentication & Session Verification] ---");
    const loginResult = await authService.login(
      { email: ADMIN_EMAIL, password: DEFAULT_PASSWORD },
      "127.0.0.1",
      "MeLife-Seed-Script/1.0"
    );

    console.log(`✅ Login Test Successful!`);
    console.log(`Resolved User Role:   ${loginResult.role}`);
    console.log(`Resolved Permissions: ${loginResult.permissions.join(", ")}`);
    console.log(`Access Token:         ${loginResult.accessToken.slice(0, 30)}...`);
    console.log(`Refresh Token:        ${loginResult.refreshToken.slice(0, 20)}...`);

    console.log("\n=================================================");
    console.log("🎉 Test Admin Account is Ready for Local/Staging!");
    console.log("=================================================");
    console.log(`Email:       ${ADMIN_EMAIL}`);
    console.log(`Password:    ${DEFAULT_PASSWORD}`);
    console.log(`Role:        SUPER_ADMIN`);
    console.log(`Permissions: ${loginResult.permissions.join(", ")}`);
    console.log(`Login URL:   http://localhost:3000/login`);
    console.log(`Redirect to: http://localhost:3000/admin/dashboard`);
    console.log("=================================================\n");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Failed to seed admin user:", error);
    process.exit(1);
  } finally {
    client.release();
    await closeDatabasePool();
  }
}

seedAdminUser();
