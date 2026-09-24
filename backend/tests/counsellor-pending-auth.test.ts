import { connectDatabase, closeDatabasePool, pool } from "../src/config/database";
import { authRepository } from "../src/modules/auth/auth.repository";
import { counsellingRepository } from "../src/modules/counselling/counselling.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { createApp } from "../src/app";
import { hashPassword } from "../src/common/utils/crypto";
import http from "http";

async function runPendingCounsellorAuthTestSuite() {
  console.log("🧪 Starting Counsellor Pending Verification & RBAC Authorization Test Suite...\n");

  await connectDatabase();
  await authRepository.initSchema();
  await authRepository.seedRolePermissions();
  await participantRepository.initSchema();
  await counsellingRepository.initSchema();
  await counsellingRepository.seedCounsellors();

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

    // =========================================================================
    // CASE 1: ACTIVE PARTICIPANT (Normal Student)
    // =========================================================================
    console.log("\n--- [CASE 1: Active Student / Participant Flow] ---");
    const studentEmail = `student_${timestamp}@3gmelife.com`;
    const regStudentRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: studentEmail,
        password: "Password123!",
        firstName: "Aarav",
        lastName: "Sharma",
        registrationPath: "STUDENT",
      }),
    });
    const regStudentData = await regStudentRes.json();
    assert(regStudentRes.status === 201, "Student registration succeeds with 201 Created");
    assert(regStudentData.data?.role === "PARTICIPANT", "Student role is PARTICIPANT");
    assert(regStudentData.data?.user?.status === "ACTIVE", "Student user status is ACTIVE");

    const studentToken = regStudentData.data.accessToken;

    // Verify GET /auth/me for student
    const studentMeRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const studentMeData = await studentMeRes.json();
    assert(studentMeRes.status === 200, "Student /auth/me succeeds with 200 OK");
    assert(studentMeData.data?.role === "PARTICIPANT", "Student /auth/me role is PARTICIPANT");
    assert(studentMeData.data?.counsellorApplication === null, "Student counsellorApplication is null");

    // Verify student cannot access counsellor portal APIs
    const studentPortalRes = await fetch(`${baseUrl}/counselling/counsellor/overview`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(
      studentPortalRes.status === 403,
      "Student blocked from counsellor portal endpoints with 403 Forbidden"
    );

    // =========================================================================
    // CASE 2: ACTIVE APPROVED CAREER_COUNSELLOR
    // =========================================================================
    console.log("\n--- [CASE 2: Approved Career Counsellor Flow] ---");
    const counsellorLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "anjali.menon@melife.org",
        password: "Password123!",
      }),
    });
    const counsellorLoginData = await counsellorLoginRes.json();
    assert(counsellorLoginRes.status === 200, "Approved counsellor login succeeds with 200 OK");
    assert(counsellorLoginData.data?.role === "CAREER_COUNSELLOR", "Approved counsellor role is CAREER_COUNSELLOR");
    assert(counsellorLoginData.data?.user?.status === "ACTIVE", "Approved counsellor status is ACTIVE");

    const counsellorToken = counsellorLoginData.data.accessToken;

    // Verify GET /auth/me for counsellor
    const counsellorMeRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${counsellorToken}` },
    });
    const counsellorMeData = await counsellorMeRes.json();
    assert(counsellorMeRes.status === 200, "Approved counsellor /auth/me returns 200 OK");
    assert(counsellorMeData.data?.role === "CAREER_COUNSELLOR", "Counsellor role in /auth/me is CAREER_COUNSELLOR");

    // Verify counsellor CAN access counsellor portal APIs
    const counsellorPortalRes = await fetch(`${baseUrl}/counselling/counsellor/overview`, {
      headers: { Authorization: `Bearer ${counsellorToken}` },
    });
    assert(
      counsellorPortalRes.status === 200,
      "Approved counsellor accesses counsellor overview endpoint with 200 OK"
    );

    // =========================================================================
    // CASE 3: PENDING COUNSELLOR APPLICANT
    // =========================================================================
    console.log("\n--- [CASE 3: Pending Counsellor Applicant Flow] ---");
    const pendingEmail = `pending_counsellor_${timestamp}@3gmelife.com`;
    const pendingRegRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: pendingEmail,
        password: "Password123!",
        firstName: "Priya",
        lastName: "Deshmukh",
        registrationPath: "COUNSELLOR",
        qualification: "M.A. in Clinical & Educational Psychology",
        organization: "National Career Guidance Bureau",
      }),
    });
    const pendingRegData = await pendingRegRes.json();
    assert(pendingRegRes.status === 202, "Counsellor registration submitted with 202 Accepted");
    assert(pendingRegData.data?.applicationType === "COUNSELLOR", "Application type is COUNSELLOR");
    assert(pendingRegData.data?.status === "PENDING", "Application submission status is PENDING");

    // Pending counsellor signs in with their credentials
    const pendingLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: pendingEmail,
        password: "Password123!",
      }),
    });
    const pendingLoginData = await pendingLoginRes.json();
    assert(pendingLoginRes.status === 200, "Pending counsellor login succeeds with 200 OK");
    assert(
      pendingLoginData.data?.user?.status === "PENDING_VERIFICATION",
      "Pending counsellor user status is PENDING_VERIFICATION"
    );
    assert(
      pendingLoginData.data?.counsellorApplication?.status === "PENDING",
      "Pending counsellor login returns counsellorApplication with status PENDING"
    );
    assert(
      pendingLoginData.data?.counsellorApplication?.qualification === "M.A. in Clinical & Educational Psychology",
      "Pending counsellor login returns submitted qualification"
    );
    assert(
      pendingLoginData.data?.counsellorApplication?.organization === "National Career Guidance Bureau",
      "Pending counsellor login returns submitted organization"
    );
    assert(
      pendingLoginData.data?.requiresOnboarding === false,
      "Pending counsellor requiresOnboarding is false (does not force student onboarding)"
    );

    const pendingToken = pendingLoginData.data.accessToken;

    // Verify GET /auth/me for pending counsellor
    const pendingMeRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${pendingToken}` },
    });
    const pendingMeData = await pendingMeRes.json();
    assert(pendingMeRes.status === 200, "Pending counsellor /auth/me returns 200 OK");
    assert(
      pendingMeData.data?.counsellorApplication?.status === "PENDING",
      "Pending counsellor /auth/me exposes counsellorApplication status PENDING"
    );
    assert(
      pendingMeData.data?.user?.status === "PENDING_VERIFICATION",
      "Pending counsellor /auth/me user status is PENDING_VERIFICATION"
    );

    // Verify pending counsellor CANNOT access protected counsellor portal endpoints
    const pendingPortalRes = await fetch(`${baseUrl}/counselling/counsellor/overview`, {
      headers: { Authorization: `Bearer ${pendingToken}` },
    });
    assert(
      pendingPortalRes.status === 403,
      "Pending counsellor blocked from counsellor portal endpoints with 403 Forbidden"
    );

    // =========================================================================
    // CASE 4: REJECTED COUNSELLOR APPLICANT
    // =========================================================================
    console.log("\n--- [CASE 4: Rejected Counsellor Flow] ---");
    const rejectedEmail = `rejected_counsellor_${timestamp}@3gmelife.com`;
    const pwdHash = await hashPassword("Password123!");

    // Create user and rejected application directly in db
    const rejUserRes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status)
       VALUES ($1, $2, 'Vikram', 'Rathore', 'PENDING_VERIFICATION')
       RETURNING id`,
      [rejectedEmail, pwdHash]
    );
    const rejUserId = rejUserRes.rows[0].id;
    await authRepository.seedRolePermissions();
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'PARTICIPANT'`,
      [rejUserId]
    );
    await pool.query(
      `INSERT INTO counsellor_applications (user_id, qualification, organization, status)
       VALUES ($1, 'Incomplete Diploma', 'Private Clinic', 'REJECTED')`,
      [rejUserId]
    );

    const rejLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: rejectedEmail,
        password: "Password123!",
      }),
    });
    const rejLoginData = await rejLoginRes.json();
    assert(rejLoginRes.status === 200, "Rejected counsellor login returns 200 OK");
    assert(
      rejLoginData.data?.counsellorApplication?.status === "REJECTED",
      "Rejected counsellor login returns counsellorApplication status REJECTED"
    );

    const rejToken = rejLoginData.data.accessToken;
    const rejPortalRes = await fetch(`${baseUrl}/counselling/counsellor/overview`, {
      headers: { Authorization: `Bearer ${rejToken}` },
    });
    assert(
      rejPortalRes.status === 403,
      "Rejected counsellor blocked from counsellor portal endpoints with 403 Forbidden"
    );

    // =========================================================================
    // CASE 5: SUSPENDED USER
    // =========================================================================
    console.log("\n--- [CASE 5: Suspended User Flow] ---");
    const suspendedEmail = `suspended_${timestamp}@3gmelife.com`;
    await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status)
       VALUES ($1, $2, 'Suspended', 'Account', 'SUSPENDED')`,
      [suspendedEmail, pwdHash]
    );

    const suspendedLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: suspendedEmail,
        password: "Password123!",
      }),
    });
    const suspendedLoginData = await suspendedLoginRes.json();
    assert(
      suspendedLoginRes.status === 403,
      "Suspended user login rejected with 403 Forbidden"
    );
    assert(
      suspendedLoginData.error?.code === "AUTH_ACCOUNT_SUSPENDED",
      "Suspended user receives AUTH_ACCOUNT_SUSPENDED error code"
    );

    console.log("\n=======================================================");
    console.log(`📊 Test Results: ${passed} PASSED, ${failed} FAILED`);
    console.log("=======================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("💥 Unhandled exception in test suite:", error);
    process.exit(1);
  } finally {
    server.close();
    await closeDatabasePool();
  }
}

runPendingCounsellorAuthTestSuite();
