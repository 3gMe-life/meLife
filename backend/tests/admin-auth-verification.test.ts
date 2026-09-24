import { connectDatabase, closeDatabasePool, pool } from "../src/config/database";
import { authRepository } from "../src/modules/auth/auth.repository";
import { createApp } from "../src/app";
import { hashPassword } from "../src/common/utils/crypto";
import http from "http";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code?: string;
    message?: string;
  };
}

async function runAdminAuthVerificationSuite() {
  console.log("🧪 Starting Admin Authentication Diagnostics & Verification Test Suite...\n");

  await connectDatabase();
  await authRepository.initSchema();
  await authRepository.seedRolePermissions();

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as { port: number };
  const baseUrl = `http://localhost:${address.port}/api/v1`;

  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string, detail?: string) => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}${detail ? ` -> ${detail}` : ""}`);
      failed++;
    }
  };

  try {
    const defaultPassword = "AdminTest123!";

    // =========================================================================
    // 1. Verify admin.test@geniusgroup.com in PostgreSQL database
    // =========================================================================
    console.log("--- [1. Database User & RBAC Verification] ---");
    const userRes = await pool.query(`
      SELECT
        u.id, u.email, u.first_name, u.last_name, u.status,
        u.password_hash IS NOT NULL as has_password,
        r.name as role_name,
        ur.is_primary,
        p.name as permission_name
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      WHERE LOWER(u.email) = 'admin.test@geniusgroup.com'
    `);

    assert(userRes.rows.length > 0, "admin.test@geniusgroup.com exists in the database");
    const firstRow = userRes.rows[0];
    assert(firstRow?.status === "ACTIVE", `Account status is ACTIVE (actual: ${firstRow?.status})`);
    assert(firstRow?.role_name === "SUPER_ADMIN", `Role is SUPER_ADMIN (actual: ${firstRow?.role_name})`);
    assert(firstRow?.is_primary === true, "Role is marked as primary in user_roles");
    assert(
      userRes.rows.some((r) => r.permission_name === "admin.all"),
      "Role resolves admin.all root permission"
    );

    // =========================================================================
    // 2. Normal Login Flow Test
    // =========================================================================
    console.log("\n--- [2. Normal Login Flow HTTP Test] ---");
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin.test@geniusgroup.com",
        password: defaultPassword,
      }),
    });

    const loginData = (await loginRes.json()) as ApiResponse<{
      user: { id: string; email: string; firstName: string; lastName: string; status: string };
      role: string;
      permissions: string[];
      accessToken: string;
    }>;

    assert(loginRes.status === 200, "Login returns HTTP 200 OK");
    assert(loginData.success === true, "Login response body has success: true");
    assert(loginData.data?.role === "SUPER_ADMIN", "Login response resolves role as SUPER_ADMIN");
    assert(
      loginData.data?.permissions.includes("admin.all") === true,
      "Login response resolves permissions including admin.all"
    );
    assert(Boolean(loginData.data?.accessToken), "Login response returns valid JWT accessToken");

    const adminToken = loginData.data?.accessToken || "";

    // =========================================================================
    // 3. Current-User (/auth/me) Verification
    // =========================================================================
    console.log("\n--- [3. Current User Session (/auth/me) Test] ---");
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const meData = (await meRes.json()) as ApiResponse<{
      user: { id: string; email: string; role: string; permissions: string[] };
      role: string;
      permissions: string[];
    }>;

    assert(meRes.status === 200, "GET /auth/me returns 200 OK");
    assert(meData.data?.role === "SUPER_ADMIN", "/auth/me returns role SUPER_ADMIN");
    assert(meData.data?.permissions.includes("admin.all") === true, "/auth/me returns permissions ['admin.all']");

    // =========================================================================
    // 4. Admin Protected Dashboard Endpoints Access
    // =========================================================================
    console.log("\n--- [4. Protected Admin Endpoints Access] ---");
    const overviewRes = await fetch(`${baseUrl}/admin/overview`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(overviewRes.status === 200, "GET /admin/overview is accessible with 200 OK");

    const usersRes = await fetch(`${baseUrl}/admin/users?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(usersRes.status === 200, "GET /admin/users is accessible with 200 OK");

    const rolesRes = await fetch(`${baseUrl}/admin/roles`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(rolesRes.status === 200, "GET /admin/roles is accessible with 200 OK");

    // =========================================================================
    // 5. Regression Check: Student and Counsellor Authentication
    // =========================================================================
    console.log("\n--- [5. Student & Counsellor Auth Regression Check] ---");
    const timestamp = Date.now();
    const testHash = await hashPassword("Password123!");

    // Seed student
    const studentEmail = `diag_student_${timestamp}@3gmelife.com`;
    const studentUser = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Student', 'Diag', 'ACTIVE', NOW()) RETURNING id`,
      [studentEmail, testHash]
    );
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'PARTICIPANT'`,
      [studentUser.rows[0].id]
    );

    const studentLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: studentEmail, password: "Password123!" }),
    });
    const studentLoginData = (await studentLoginRes.json()) as ApiResponse<{ role: string }>;
    assert(
      studentLoginRes.status === 200 && studentLoginData.data?.role === "PARTICIPANT",
      "Student login succeeds normally and resolves as PARTICIPANT"
    );

    console.log(`\n========================================`);
    console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Diagnostic test suite error:", error);
    process.exit(1);
  } finally {
    server.close();
    await closeDatabasePool();
  }
}

runAdminAuthVerificationSuite();
