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

async function runParentConnectPhase1TestSuite() {
  console.log("🧪 Starting Parent Connect Phase 1 Comprehensive Test Suite...\n");

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
    const defaultPassword = "Password123!";
    const defaultPasswordHash = await hashPassword(defaultPassword);

    // =========================================================================
    // SETUP: Seed Test Users
    // 1. Student 1 (Participant)
    // 2. Student 2 (Participant - Unrelated)
    // 3. Parent 1 (Parent/Guardian)
    // 4. Parent 2 (Parent/Guardian - Unrelated)
    // 5. Counsellor (Career Counsellor)
    // 6. Admin (Super Admin)
    // =========================================================================
    console.log("--- [SETUP: Creating Test Persona Accounts] ---");

    // 1. Student 1
    const student1Email = `test_student1_${timestamp}@3gmelife.com`;
    const student1Res = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Aarav', 'Sharma', 'ACTIVE', NOW())
       RETURNING id`,
      [student1Email, defaultPasswordHash]
    );
    const student1Id = student1Res.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'PARTICIPANT'`,
      [student1Id]
    );
    await pool.query(
      `INSERT INTO participant_profiles (user_id, education_stage, grade_level, school_name, is_onboarded)
       VALUES ($1, 'High School', 'Grade 10', 'Greenwood High', true)
       ON CONFLICT (user_id) DO NOTHING`,
      [student1Id]
    );

    // 2. Student 2 (Unrelated)
    const student2Email = `test_student2_${timestamp}@3gmelife.com`;
    const student2Res = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Diya', 'Patel', 'ACTIVE', NOW())
       RETURNING id`,
      [student2Email, defaultPasswordHash]
    );
    const student2Id = student2Res.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'PARTICIPANT'`,
      [student2Id]
    );
    await pool.query(
      `INSERT INTO participant_profiles (user_id, education_stage, grade_level, school_name, is_onboarded)
       VALUES ($1, 'Middle School', 'Grade 8', 'Delhi Public School', true)
       ON CONFLICT (user_id) DO NOTHING`,
      [student2Id]
    );

    // 3. Parent 1
    const parent1Email = `test_parent1_${timestamp}@3gmelife.com`;
    const parent1Res = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Rajesh', 'Sharma', 'ACTIVE', NOW())
       RETURNING id`,
      [parent1Email, defaultPasswordHash]
    );
    const parent1Id = parent1Res.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'PARENT_GUARDIAN'`,
      [parent1Id]
    );

    // 4. Parent 2
    const parent2Email = `test_parent2_${timestamp}@3gmelife.com`;
    const parent2Res = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Vikram', 'Mehta', 'ACTIVE', NOW())
       RETURNING id`,
      [parent2Email, defaultPasswordHash]
    );
    const parent2Id = parent2Res.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'PARENT_GUARDIAN'`,
      [parent2Id]
    );

    // 5. Counsellor
    const counsellorEmail = `test_counsellor_${timestamp}@3gmelife.com`;
    const counsellorRes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Priya', 'Kapoor', 'ACTIVE', NOW())
       RETURNING id`,
      [counsellorEmail, defaultPasswordHash]
    );
    const counsellorId = counsellorRes.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'CAREER_COUNSELLOR'`,
      [counsellorId]
    );

    // 6. Super Admin
    const adminEmail = `test_admin_${timestamp}@3gmelife.com`;
    const adminRes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Admin', 'Root', 'ACTIVE', NOW())
       RETURNING id`,
      [adminEmail, defaultPasswordHash]
    );
    const adminId = adminRes.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'SUPER_ADMIN'`,
      [adminId]
    );

    // Generate JWT Access Tokens for authenticated requests
    const student1Token = authTokenService.signAccessToken({
      userId: student1Id,
      sessionId: "00000000-0000-0000-0000-000000000001",
      role: "PARTICIPANT",
      permissions: ["assessment.take", "result.read_own"],
    });

    const parent1Token = authTokenService.signAccessToken({
      userId: parent1Id,
      sessionId: "00000000-0000-0000-0000-000000000002",
      role: "PARENT_GUARDIAN",
      permissions: ["student.read"],
    });

    const parent2Token = authTokenService.signAccessToken({
      userId: parent2Id,
      sessionId: "00000000-0000-0000-0000-000000000003",
      role: "PARENT_GUARDIAN",
      permissions: ["student.read"],
    });

    console.log("Personas initialized successfully.\n");

    // =========================================================================
    // TEST 1: Student Generates Invitation (MLP-XXXX-XXXX Format, 7 Days Expiry)
    // =========================================================================
    console.log("--- [TEST 1: Student generates invitation code] ---");
    const createInvRes = await fetch(`${baseUrl}/parent/invitations/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1Token}`,
      },
    });
    const createInvData = (await createInvRes.json()) as ApiResponse<{
      inviteCode: string;
      expiresAt: string;
      status: string;
    }>;

    assert(
      createInvRes.status === 201 && createInvData.success === true,
      "POST /parent/invitations/create returns 201 Created"
    );
    assert(
      typeof createInvData.data?.inviteCode === "string" &&
        /^MLP-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(createInvData.data.inviteCode),
      `Invitation code matches secure MLP-XXXX-XXXX format (Got: ${createInvData.data?.inviteCode})`
    );

    const generatedCode = createInvData.data?.inviteCode || "";
    const expiryDate = new Date(createInvData.data?.expiresAt || "");
    const now = new Date();
    const diffDays = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    assert(
      diffDays > 6.5 && diffDays <= 7.1,
      `Invitation code expiry is configured for 7 days (Calculated: ${diffDays.toFixed(2)} days)`
    );

    // =========================================================================
    // TEST 2: Verify Valid Invitation (Returns safe student info ONLY)
    // =========================================================================
    console.log("\n--- [TEST 2: Public verification of invitation code] ---");
    const verifyRes = await fetch(`${baseUrl}/parent/invitations/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteCode: generatedCode }),
    });
    const verifyData = (await verifyRes.json()) as ApiResponse<{
      valid: boolean;
      inviteCode: string;
      student: any;
    }>;

    assert(
      verifyRes.status === 200 && verifyData.success === true && verifyData.data?.valid === true,
      "POST /parent/invitations/verify returns 200 OK with valid: true"
    );
    assert(
      verifyData.data?.student?.firstName === "Aarav",
      "Student first name is correctly returned for preview"
    );
    assert(
      verifyData.data?.student?.gradeLevel === "Grade 10",
      "Student grade level is correctly returned for preview"
    );
    assert(
      verifyData.data?.student?.email === undefined &&
        verifyData.data?.student?.password === undefined &&
        verifyData.data?.student?.phone === undefined,
      "Private sensitive fields (email, phone, credentials) are strictly hidden"
    );

    // =========================================================================
    // TEST 3: Expired Invitation (Rejected with 400)
    // =========================================================================
    console.log("\n--- [TEST 3: Expired invitation rejection] ---");
    const expiredCode = `MLP-EXPD-${Math.floor(1000 + Math.random() * 9000)}`;
    await pool.query(
      `INSERT INTO parent_invitations (student_id, invite_code, status, expires_at, created_at)
       VALUES ($1, $2, 'ACTIVE', NOW() - INTERVAL '1 day', NOW() - INTERVAL '8 days')`,
      [student1Id, expiredCode]
    );

    const verifyExpiredRes = await fetch(`${baseUrl}/parent/invitations/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteCode: expiredCode }),
    });
    const verifyExpiredData = (await verifyExpiredRes.json()) as ApiResponse;
    assert(
      verifyExpiredRes.status === 400 &&
        verifyExpiredData.success === false &&
        verifyExpiredData.error?.code === "INVITATION_EXPIRED",
      "Expired invitation verification rejected with 400 INVITATION_EXPIRED"
    );

    const redeemExpiredRes = await fetch(`${baseUrl}/parent/invitations/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${parent1Token}`,
      },
      body: JSON.stringify({
        inviteCode: expiredCode,
        studentEmail: student1Email,
      }),
    });
    const redeemExpiredData = (await redeemExpiredRes.json()) as ApiResponse;
    assert(
      redeemExpiredRes.status === 400 &&
        redeemExpiredData.success === false &&
        redeemExpiredData.error?.code === "INVITATION_EXPIRED",
      "Expired invitation redemption rejected with 400 INVITATION_EXPIRED"
    );

    // =========================================================================
    // TEST 4 & 5: Redeem Invitation (Transaction creates link and marks USED)
    // =========================================================================
    console.log("\n--- [TEST 5: Redeem valid invitation code] ---");
    const redeemRes = await fetch(`${baseUrl}/parent/invitations/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${parent1Token}`,
      },
      body: JSON.stringify({
        inviteCode: generatedCode,
        studentEmail: student1Email,
        relationshipType: "FATHER",
      }),
    });
    const redeemData = (await redeemRes.json()) as ApiResponse<{
      link: any;
      student: any;
    }>;

    assert(
      redeemRes.status === 200 && redeemData.success === true,
      "POST /parent/invitations/redeem successfully establishes relationship"
    );
    assert(
      redeemData.data?.link?.link_status === "ACTIVE" &&
        redeemData.data?.link?.relationship_type === "FATHER",
      "student_parent_links record persisted with ACTIVE status and FATHER type"
    );

    // Verify in DB that invitation is now USED
    const invDbCheck = await pool.query(
      `SELECT status, used_at, used_by_parent_id FROM parent_invitations WHERE invite_code = $1`,
      [generatedCode]
    );
    assert(
      invDbCheck.rows[0]?.status === "USED" &&
        invDbCheck.rows[0]?.used_by_parent_id === parent1Id &&
        invDbCheck.rows[0]?.used_at !== null,
      "parent_invitations row updated to USED with used_by_parent_id and used_at timestamp"
    );

    // TEST 4: Attempting to reuse the redeemed invitation
    console.log("\n--- [TEST 4: Attempting to use already USED invitation] ---");
    const reuseRes = await fetch(`${baseUrl}/parent/invitations/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${parent2Token}`,
      },
      body: JSON.stringify({
        inviteCode: generatedCode,
        studentEmail: student1Email,
      }),
    });
    const reuseData = (await reuseRes.json()) as ApiResponse;
    assert(
      reuseRes.status === 400 &&
        reuseData.success === false &&
        reuseData.error?.code === "INVITATION_ALREADY_USED",
      "Reusing used invitation rejected with 400 INVITATION_ALREADY_USED"
    );

    // =========================================================================
    // TEST 6: Duplicate Relationship Prevention
    // =========================================================================
    console.log("\n--- [TEST 6: Duplicate relationship prevention] ---");
    // Generate fresh code for student1
    const freshCodeRes = await fetch(`${baseUrl}/parent/invitations/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${student1Token}`,
      },
    });
    const freshCodeData = (await freshCodeRes.json()) as ApiResponse<{ inviteCode: string }>;
    const secondCode = freshCodeData.data?.inviteCode || "";

    // Parent 1 tries to redeem again for same student1
    const duplicateRedeemRes = await fetch(`${baseUrl}/parent/invitations/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${parent1Token}`,
      },
      body: JSON.stringify({
        inviteCode: secondCode,
        studentEmail: student1Email,
      }),
    });
    const duplicateData = (await duplicateRedeemRes.json()) as ApiResponse;
    assert(
      duplicateRedeemRes.status === 409 &&
        duplicateData.success === false &&
        duplicateData.error?.code === "RELATIONSHIP_ALREADY_EXISTS",
      "Duplicate link attempt blocked with 409 RELATIONSHIP_ALREADY_EXISTS"
    );

    // =========================================================================
    // TEST 6b: Connected Children Listing for Parent 1
    // =========================================================================
    console.log("\n--- [TEST: GET /api/v1/parent/children] ---");
    const childrenRes = await fetch(`${baseUrl}/parent/children`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parent1Token}`,
      },
    });
    const childrenData = (await childrenRes.json()) as ApiResponse<any[]>;
    assert(
      childrenRes.status === 200 &&
        childrenData.success === true &&
        Array.isArray(childrenData.data) &&
        childrenData.data.length === 1 &&
        childrenData.data[0].studentId === student1Id &&
        childrenData.data[0].firstName === "Aarav",
      "GET /parent/children returns connected child roster for Parent 1"
    );

    // =========================================================================
    // TEST 6c: Student Views Linked Parents
    // =========================================================================
    console.log("\n--- [TEST: GET /api/v1/parent/linked-parents] ---");
    const linkedParentsRes = await fetch(`${baseUrl}/parent/linked-parents`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${student1Token}`,
      },
    });
    const linkedParentsData = (await linkedParentsRes.json()) as ApiResponse<any[]>;
    assert(
      linkedParentsRes.status === 200 &&
        linkedParentsData.success === true &&
        Array.isArray(linkedParentsData.data) &&
        linkedParentsData.data.length === 1 &&
        linkedParentsData.data[0].parentId === parent1Id &&
        linkedParentsData.data[0].relationshipType === "FATHER",
      "GET /parent/linked-parents returns linked parent list for Student 1"
    );

    // =========================================================================
    // TEST 6d: Parent Child Overview Endpoint & Guard
    // =========================================================================
    console.log("\n--- [TEST: GET /api/v1/parent/children/:studentId/overview] ---");
    const overviewRes = await fetch(`${baseUrl}/parent/children/${student1Id}/overview`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parent1Token}`,
      },
    });
    const overviewData = (await overviewRes.json()) as ApiResponse<any>;
    assert(
      overviewRes.status === 200 &&
        overviewData.success === true &&
        overviewData.data?.student?.firstName === "Aarav" &&
        Array.isArray(overviewData.data?.assessments),
      "GET /parent/children/:studentId/overview succeeds for verified linked parent"
    );

    // Unauthorized parent access to unrelated child
    const unauthOverviewRes = await fetch(`${baseUrl}/parent/children/${student2Id}/overview`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parent1Token}`,
      },
    });
    assert(
      unauthOverviewRes.status === 403,
      "GET /parent/children/:studentId/overview returns 403 Forbidden for unrelated student"
    );

    // =========================================================================
    // TEST 7: Parent Accessing Unrelated Student (requireParentOfStudent)
    // =========================================================================
    console.log("\n--- [TEST 7: Parent security boundary check] ---");
    // Parent 1 is connected to Student 1, but NOT Student 2
    // Parent 2 is NOT connected to Student 1
    const isParent1ToStudent1 = await parentRepository.isParentOfStudent(parent1Id, student1Id);
    const isParent1ToStudent2 = await parentRepository.isParentOfStudent(parent1Id, student2Id);
    const isParent2ToStudent1 = await parentRepository.isParentOfStudent(parent2Id, student1Id);

    assert(
      isParent1ToStudent1 === true,
      "Parent 1 has verified active link with Student 1"
    );
    assert(
      isParent1ToStudent2 === false,
      "Parent 1 is NOT linked with Student 2"
    );
    assert(
      isParent2ToStudent1 === false,
      "Parent 2 is NOT linked with Student 1"
    );


    // =========================================================================
    // TEST 8: Existing Flow Verification (Student, Counsellor, Admin Authentication)
    // =========================================================================
    console.log("\n--- [TEST 8: Existing Persona Authentication Intact] ---");
    // 8a. Student login
    const studentLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: student1Email, password: defaultPassword }),
    });
    const studentLoginData = (await studentLoginRes.json()) as ApiResponse;
    assert(
      studentLoginRes.status === 200 && studentLoginData.success === true,
      "Student authentication flow works cleanly without modification"
    );

    // 8b. Counsellor login
    const counsellorLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: counsellorEmail, password: defaultPassword }),
    });
    const counsellorLoginData = (await counsellorLoginRes.json()) as ApiResponse;
    assert(
      counsellorLoginRes.status === 200 && counsellorLoginData.success === true,
      "Counsellor authentication flow works cleanly without modification"
    );

    // 8c. Admin login
    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminEmail, password: defaultPassword }),
    });
    const adminLoginData = (await adminLoginRes.json()) as ApiResponse;
    assert(
      adminLoginRes.status === 200 && adminLoginData.success === true,
      "Admin authentication flow works cleanly without modification"
    );

  } catch (err) {
    console.error("❌ Test suite encountered unhandled exception:", err);
    failed++;
  } finally {
    server.close();
    await closeDatabasePool();
    console.log(`\n========================================`);
    console.log(`🏁 Parent Connect Phase 1 Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);
    if (failed > 0) {
      process.exit(1);
    }
  }
}

runParentConnectPhase1TestSuite();
