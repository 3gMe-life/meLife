import { connectDatabase, closeDatabasePool, pool } from "../src/config/database";
import { authRepository } from "../src/modules/auth/auth.repository";
import { userRepository } from "../src/modules/users/user.repository";
import { createApp } from "../src/app";
import { hashPassword } from "../src/common/utils/crypto";
import { authTokenService } from "../src/modules/auth/auth.token.service";
import http from "http";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code?: string;
    message?: string;
  };
}

async function runParentDashboardDynamicRBACTestSuite() {
  console.log("🧭 Running Parent Dynamic Dashboard & RBAC Feature Test Suite...\n");

  await connectDatabase();
  await authRepository.initSchema();
  await authRepository.seedRolePermissions();
  await authRepository.seedDashboardFeatures();

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
    const timestamp = Date.now();
    const defaultPassword = "Password123!";
    const defaultPasswordHash = await hashPassword(defaultPassword);

    // =========================================================================
    // 1. Setup Parent Persona
    // =========================================================================
    const parentEmail = `dynamic_parent_${timestamp}@3gmelife.com`;
    const parentRes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Dynamic', 'Parent', 'ACTIVE', NOW())
       RETURNING id`,
      [parentEmail, defaultPasswordHash]
    );
    const parentId = parentRes.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'PARENT_GUARDIAN'`,
      [parentId]
    );

    // =========================================================================
    // TEST 1: Parent Login Returns dashboardFeatures in Response Data
    // =========================================================================
    console.log("--- [TEST 1: Parent Login Payload Verification] ---");
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: parentEmail, password: defaultPassword }),
    });
    const loginData = (await loginRes.json()) as ApiResponse<{
      user: any;
      role: string;
      permissions: string[];
      dashboardFeatures?: string[];
      accessToken: string;
    }>;

    assert(
      loginRes.status === 200 && loginData.success === true,
      "POST /api/v1/auth/login returns 200 OK"
    );
    assert(
      loginData.data?.role === "PARENT_GUARDIAN",
      "Logged in user role is PARENT_GUARDIAN"
    );
    assert(
      Array.isArray(loginData.data?.dashboardFeatures),
      "login response data includes dashboardFeatures array"
    );
    assert(
      Boolean(loginData.data?.dashboardFeatures?.includes("dashboard.overview")),
      "dashboardFeatures includes 'dashboard.overview'"
    );
    assert(
      Boolean(loginData.data?.dashboardFeatures?.includes("dashboard.children")),
      "dashboardFeatures includes 'dashboard.children'"
    );
    assert(
      Boolean(loginData.data?.dashboardFeatures?.includes("dashboard.reports")),
      "dashboardFeatures includes 'dashboard.reports'"
    );

    const accessToken = loginData.data?.accessToken;

    // =========================================================================
    // TEST 2: GET /api/v1/auth/me Returns dashboardFeatures
    // =========================================================================
    console.log("\n--- [TEST 2: GET /auth/me Profile and Features] ---");
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const meData = (await meRes.json()) as ApiResponse<{
      user: any;
      role: string;
      permissions: string[];
      dashboardFeatures: string[];
    }>;

    assert(
      meRes.status === 200 && meData.success === true,
      "GET /api/v1/auth/me returns 200 OK"
    );
    assert(
      Array.isArray(meData.data?.dashboardFeatures),
      "GET /auth/me returns dashboardFeatures array"
    );
    assert(
      Boolean(meData.data?.dashboardFeatures?.includes("dashboard.overview")),
      "GET /auth/me includes 'dashboard.overview'"
    );
    assert(
      Boolean(meData.data?.dashboardFeatures?.includes("dashboard.children")),
      "GET /auth/me includes 'dashboard.children'"
    );
    assert(
      Boolean(meData.data?.dashboardFeatures?.includes("dashboard.reports")),
      "GET /auth/me includes 'dashboard.reports'"
    );

    // =========================================================================
    // TEST 3: Database Role Feature Mapping Integrity
    // =========================================================================
    console.log("\n--- [TEST 3: Database Role Feature Mapping Integrity] ---");
    const parentRoleQuery = await pool.query(`SELECT id FROM roles WHERE name = 'PARENT_GUARDIAN'`);
    const parentRoleId = parentRoleQuery.rows[0].id;

    const dbFeaturesRes = await pool.query(
      `SELECT df.key, rdf.is_enabled
       FROM role_dashboard_features rdf
       JOIN dashboard_features df ON rdf.feature_id = df.id
       WHERE rdf.role_id = $1 AND df.key IN ('dashboard.overview', 'dashboard.children', 'dashboard.reports')`,
      [parentRoleId]
    );

    const dbMap: Record<string, boolean> = {};
    dbFeaturesRes.rows.forEach((r) => {
      dbMap[r.key] = r.is_enabled;
    });

    assert(
      dbMap["dashboard.overview"] === true,
      "DB confirms 'dashboard.overview' is enabled for PARENT_GUARDIAN"
    );
    assert(
      dbMap["dashboard.children"] === true,
      "DB confirms 'dashboard.children' is enabled for PARENT_GUARDIAN"
    );
    assert(
      dbMap["dashboard.reports"] === true,
      "DB confirms 'dashboard.reports' is enabled for PARENT_GUARDIAN"
    );

    // =========================================================================
    // TEST 4: Parent Permissions Check
    // =========================================================================
    console.log("\n--- [TEST 4: Parent Permissions Check] ---");
    const parentPerms = await pool.query(
      `SELECT p.name FROM role_permissions rp JOIN permissions p ON rp.permission_id = p.id WHERE rp.role_id = $1`,
      [parentRoleId]
    );
    const permNames = parentPerms.rows.map((r) => r.name);
    assert(
      permNames.includes("student.read"),
      "PARENT_GUARDIAN has 'student.read' permission for children profile access"
    );
    assert(
      permNames.includes("result.read_own"),
      "PARENT_GUARDIAN has 'result.read_own' permission for report access"
    );

  } catch (err) {
    console.error("❌ Test suite encountered unhandled exception:", err);
    failed++;
  } finally {
    server.close();
    await closeDatabasePool();
    console.log(`\n======================================================`);
    console.log(`🏁 Parent Dynamic RBAC Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`======================================================\n`);
    if (failed > 0) {
      process.exit(1);
    }
  }
}

runParentDashboardDynamicRBACTestSuite();
