import { connectDatabase, closeDatabasePool, pool } from "../src/config/database";
import { authRepository } from "../src/modules/auth/auth.repository";
import { parentRepository } from "../src/modules/parent/parent.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
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

async function runBugfixVerificationSuite() {
  console.log("🧪 Starting Participant Parent Connect Bugfix Verification Suite...\n");

  await connectDatabase();
  await authRepository.initSchema();
  await authRepository.seedRolePermissions();
  await participantRepository.initSchema();
  await parentRepository.initSchema();

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

    // Seed test student
    const studentEmail = `test_student_inv_${timestamp}@3gmelife.com`;
    const studentRes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Karan', 'Verma', 'ACTIVE', NOW())
       RETURNING id`,
      [studentEmail, defaultPasswordHash]
    );
    const studentId = studentRes.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'PARTICIPANT'`,
      [studentId]
    );

    const studentToken = authTokenService.signAccessToken({
      userId: studentId,
      sessionId: "00000000-0000-0000-0000-000000000099",
      role: "PARTICIPANT",
      permissions: ["assessment.take", "result.read_own"],
    });

    // -----------------------------------------------------------------------
    // Case 1: New student with no invitation
    // Expected: GET /parent/invitations/active returns 200 with data: null
    // -----------------------------------------------------------------------
    console.log("--- [Case 1: New student with no invitation] ---");
    const activeInvRes1 = await fetch(`${baseUrl}/parent/invitations/active`, {
      method: "GET",
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const activeInvData1 = (await activeInvRes1.json()) as ApiResponse;

    assert(
      activeInvRes1.status === 200 && activeInvData1.success === true,
      "GET /parent/invitations/active returns 200 OK"
    );
    assert(
      activeInvData1.data === null,
      "Active invitation data is null for student without invitation"
    );

    // -----------------------------------------------------------------------
    // Case 2: Student generates invitation
    // Expected: Code is generated and returned with inviteCode in camelCase
    // -----------------------------------------------------------------------
    console.log("\n--- [Case 2: Student generates invitation] ---");
    const createRes = await fetch(`${baseUrl}/parent/invitations/create`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const createData = (await createRes.json()) as ApiResponse<{
      inviteCode: string;
      expiresAt: string;
      status: string;
    }>;

    assert(
      createRes.status === 201 && createData.success === true,
      "POST /parent/invitations/create returns 201 Created"
    );
    assert(
      typeof createData.data?.inviteCode === "string" &&
        createData.data.inviteCode.startsWith("MLP-"),
      `Generated code is valid string (Got: ${createData.data?.inviteCode})`
    );
    const generatedCode = createData.data?.inviteCode || "";

    // -----------------------------------------------------------------------
    // Case 3: Refresh page (GET active invitation after generation)
    // Expected: Active invitation loads with inviteCode and expiresAt (NOT undefined)
    // -----------------------------------------------------------------------
    console.log("\n--- [Case 3: Refresh page / fetch active invitation] ---");
    const activeInvRes2 = await fetch(`${baseUrl}/parent/invitations/active`, {
      method: "GET",
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const activeInvData2 = (await activeInvRes2.json()) as ApiResponse<{
      inviteCode: string;
      expiresAt: string;
      status: string;
    }>;

    assert(
      activeInvRes2.status === 200 && activeInvData2.success === true,
      "GET /parent/invitations/active returns 200 OK"
    );
    assert(
      activeInvData2.data?.inviteCode === generatedCode,
      `Active invitation contains correct inviteCode: ${activeInvData2.data?.inviteCode}`
    );
    assert(
      activeInvData2.data?.expiresAt !== undefined &&
        !isNaN(new Date(activeInvData2.data?.expiresAt || "").getTime()),
      `Active invitation contains valid expiresAt: ${activeInvData2.data?.expiresAt}`
    );
    assert(
      activeInvData2.data?.status === "ACTIVE",
      "Active invitation status is ACTIVE"
    );

    // -----------------------------------------------------------------------
    // Case 4: Expired invitation
    // Expected: If invitation is expired, active endpoint returns null
    // -----------------------------------------------------------------------
    console.log("\n--- [Case 4: Expired invitation returns null / empty state] ---");
    // Manually expire the invitation
    await pool.query(
      `UPDATE parent_invitations
       SET expires_at = NOW() - INTERVAL '1 hour'
       WHERE student_id = $1`,
      [studentId]
    );

    const activeInvRes3 = await fetch(`${baseUrl}/parent/invitations/active`, {
      method: "GET",
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const activeInvData3 = (await activeInvRes3.json()) as ApiResponse;

    assert(
      activeInvRes3.status === 200 && activeInvData3.success === true,
      "GET /parent/invitations/active returns 200 OK for expired code"
    );
    assert(
      activeInvData3.data === null,
      "Expired invitation is excluded from active query (returns null so UI shows empty state)"
    );

    // Student can generate a new code after expiration
    const recreateRes = await fetch(`${baseUrl}/parent/invitations/create`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const recreateData = (await recreateRes.json()) as ApiResponse<{ inviteCode: string }>;
    assert(
      recreateRes.status === 201 && recreateData.success === true,
      `Student can generate a new code after expiration (New: ${recreateData.data?.inviteCode})`
    );

  } catch (err) {
    console.error("❌ Verification failed with unhandled exception:", err);
    failed++;
  } finally {
    server.close();
    await closeDatabasePool();
    console.log(`\n========================================`);
    console.log(`🏁 Bugfix Verification Results: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);
    if (failed > 0) {
      process.exit(1);
    }
  }
}

runBugfixVerificationSuite();
