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

async function runDashboardFeatureRBACTestSuite() {
  console.log("🧪 Starting Dashboard Features Dynamic RBAC Test Suite...\n");

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
    const timestamp = Date.now();
    const defaultPasswordHash = await hashPassword("Password123!");

    // 1. Create Super Admin and Participant test users
    const superAdminEmail = `feat_superadmin_${timestamp}@3gmelife.com`;
    const superAdminRes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Feature', 'Admin', 'ACTIVE', NOW())
       RETURNING id`,
      [superAdminEmail, defaultPasswordHash]
    );
    const superAdminId = superAdminRes.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'SUPER_ADMIN'`,
      [superAdminId]
    );

    const participantEmail = `feat_participant_${timestamp}@3gmelife.com`;
    const participantRes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Feature', 'Student', 'ACTIVE', NOW())
       RETURNING id`,
      [participantEmail, defaultPasswordHash]
    );
    const participantId = participantRes.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'PARTICIPANT'`,
      [participantId]
    );

    // Also get PARTICIPANT role id
    const participantRoleRes = await pool.query(`SELECT id FROM roles WHERE name = 'PARTICIPANT'`);
    const participantRoleId = participantRoleRes.rows[0].id;

    // 2. Log in as Super Admin
    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: superAdminEmail, password: "Password123!" }),
    });
    const adminLoginData = (await adminLoginRes.json()) as ApiResponse<{ token: string }>;
    const adminToken = adminLoginData.data?.token || "";
    const adminCookie = adminLoginRes.headers.get("set-cookie") || "";

    // 3. Log in as Participant
    const participantLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: participantEmail, password: "Password123!" }),
    });
    const participantLoginData = (await participantLoginRes.json()) as ApiResponse<{
      token: string;
      dashboardFeatures: string[];
    }>;
    const participantToken = participantLoginData.data?.token || "";
    const participantCookie = participantLoginRes.headers.get("set-cookie") || "";

    // TEST 1: Super Admin disables "dashboard.counsellors" for PARTICIPANT
    console.log("\n--- [TEST 1: Super Admin disables Counsellors feature for PARTICIPANT] ---");
    const updateFeatRes = await fetch(`${baseUrl}/admin/roles/${participantRoleId}/dashboard-features`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        features: {
          "dashboard.counsellors": false,
        },
      }),
    });
    const updateFeatData = (await updateFeatRes.json()) as ApiResponse;
    assert(updateFeatRes.status === 200 && updateFeatData.success, "Admin updates PARTICIPANT feature flags (disable counsellors)");

    // TEST 2: Participant GET /auth/me reflects disabled feature
    console.log("\n--- [TEST 2: Participant GET /auth/me reflects dashboardFeatures] ---");
    const meRes1 = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${participantToken}`,
        Cookie: participantCookie,
      },
    });
    const meData1 = (await meRes1.json()) as ApiResponse<{ dashboardFeatures: string[] }>;
    const features1 = meData1.data?.dashboardFeatures || [];
    assert(
      !features1.includes("dashboard.counsellors"),
      "Participant auth/me does NOT contain dashboard.counsellors when disabled",
      `Features: ${JSON.stringify(features1)}`
    );

    // TEST 3: Participant access to /counsellors is blocked with 403 FEATURE_DISABLED
    console.log("\n--- [TEST 3: Participant blocked from counselling API routes when feature disabled] ---");
    const counsellorApiRes1 = await fetch(`${baseUrl}/counsellors`, {
      headers: {
        Authorization: `Bearer ${participantToken}`,
        Cookie: participantCookie,
      },
    });
    const counsellorApiData1 = (await counsellorApiRes1.json()) as ApiResponse;
    assert(
      counsellorApiRes1.status === 403 && counsellorApiData1.error?.code === "FEATURE_DISABLED",
      "Participant GET /counsellors returns 403 FEATURE_DISABLED when feature is disabled",
      `Status: ${counsellorApiRes1.status}, Code: ${counsellorApiData1.error?.code}`
    );

    // TEST 4: Super Admin can still access /counsellors (Super Admin bypass)
    console.log("\n--- [TEST 4: Super Admin bypasses feature restriction] ---");
    const adminCounsellorRes = await fetch(`${baseUrl}/counsellors`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        Cookie: adminCookie,
      },
    });
    assert(
      adminCounsellorRes.status === 200,
      "Super Admin can access /counsellors regardless of feature flag",
      `Status: ${adminCounsellorRes.status}`
    );

    // TEST 5: Super Admin enables "dashboard.counsellors" for PARTICIPANT
    console.log("\n--- [TEST 5: Super Admin enables Counsellors feature for PARTICIPANT] ---");
    const enableFeatRes = await fetch(`${baseUrl}/admin/roles/${participantRoleId}/dashboard-features`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        features: {
          "dashboard.counsellors": true,
        },
      }),
    });
    const enableFeatData = (await enableFeatRes.json()) as ApiResponse;
    assert(enableFeatRes.status === 200 && enableFeatData.success, "Admin updates PARTICIPANT feature flags (enable counsellors)");

    // TEST 6: Participant GET /auth/me now contains "dashboard.counsellors"
    console.log("\n--- [TEST 6: Participant GET /auth/me reflects newly enabled feature] ---");
    const meRes2 = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${participantToken}`,
        Cookie: participantCookie,
      },
    });
    const meData2 = (await meRes2.json()) as ApiResponse<{ dashboardFeatures: string[] }>;
    const features2 = meData2.data?.dashboardFeatures || [];
    assert(
      features2.includes("dashboard.counsellors"),
      "Participant auth/me now contains dashboard.counsellors after enabling",
      `Features: ${JSON.stringify(features2)}`
    );

    // TEST 7: Participant can now access /counsellors (200 OK)
    console.log("\n--- [TEST 7: Participant access restored to counselling API] ---");
    const counsellorApiRes2 = await fetch(`${baseUrl}/counsellors`, {
      headers: {
        Authorization: `Bearer ${participantToken}`,
        Cookie: participantCookie,
      },
    });
    assert(
      counsellorApiRes2.status === 200,
      "Participant GET /counsellors succeeds with 200 OK when feature is enabled",
      `Status: ${counsellorApiRes2.status}`
    );

    console.log(`\n========================================`);
    console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Test suite encountered unhandled error:", err);
    process.exit(1);
  } finally {
    server.close();
    await closeDatabasePool();
  }
}

runDashboardFeatureRBACTestSuite();
