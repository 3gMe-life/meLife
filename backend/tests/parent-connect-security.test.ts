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

async function runParentConnectSecurityTestSuite() {
  console.log("🔒 Running Parent ↔ Student Secure Connection Security Test Suite...\n");

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
    // SEEDING TEST PERSONAS
    // =========================================================================
    // Student A (Target Student)
    const studentAEmail = `student_alpha_${timestamp}@3gmelife.com`;
    const studentARes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Alpha', 'Student', 'ACTIVE', NOW())
       RETURNING id`,
      [studentAEmail, defaultPasswordHash]
    );
    const studentAId = studentARes.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'PARTICIPANT'`,
      [studentAId]
    );
    await pool.query(
      `INSERT INTO participant_profiles (user_id, education_stage, grade_level, school_name, is_onboarded)
       VALUES ($1, 'High School', 'Grade 11', 'Cambridge International', true)
       ON CONFLICT (user_id) DO NOTHING`,
      [studentAId]
    );

    // Student B (Unrelated Student)
    const studentBEmail = `student_beta_${timestamp}@3gmelife.com`;
    const studentBRes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Beta', 'Student', 'ACTIVE', NOW())
       RETURNING id`,
      [studentBEmail, defaultPasswordHash]
    );
    const studentBId = studentBRes.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'PARTICIPANT'`,
      [studentBId]
    );

    // Parent A
    const parentAEmail = `parent_alpha_${timestamp}@3gmelife.com`;
    const parentARes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Parent', 'Alpha', 'ACTIVE', NOW())
       RETURNING id`,
      [parentAEmail, defaultPasswordHash]
    );
    const parentAId = parentARes.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'PARENT_GUARDIAN'`,
      [parentAId]
    );

    // Parent B (Unrelated Parent)
    const parentBEmail = `parent_beta_${timestamp}@3gmelife.com`;
    const parentBRes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Parent', 'Beta', 'ACTIVE', NOW())
       RETURNING id`,
      [parentBEmail, defaultPasswordHash]
    );
    const parentBId = parentBRes.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'PARENT_GUARDIAN'`,
      [parentBId]
    );

    const studentAToken = authTokenService.signAccessToken({
      userId: studentAId,
      sessionId: "11111111-1111-1111-1111-111111111111",
      role: "PARTICIPANT",
      permissions: ["assessment.take", "result.read_own"],
    });

    const parentAToken = authTokenService.signAccessToken({
      userId: parentAId,
      sessionId: "22222222-2222-2222-2222-222222222222",
      role: "PARENT_GUARDIAN",
      permissions: ["student.read"],
    });

    const parentBToken = authTokenService.signAccessToken({
      userId: parentBId,
      sessionId: "33333333-3333-3333-3333-333333333333",
      role: "PARENT_GUARDIAN",
      permissions: ["student.read"],
    });

    // =========================================================================
    // CASE 2: Valid voucher + Wrong email -> Rejected, No relationship created, voucher stays active
    // =========================================================================
    console.log("--- [SECURITY TEST - CASE 2: Valid Voucher + Wrong Email] ---");
    // Generate valid voucher for Student A
    const genRes1 = await fetch(`${baseUrl}/parent/invitations/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentAToken}`,
      },
    });
    const genData1 = (await genRes1.json()) as ApiResponse<{ inviteCode: string }>;
    const voucher1 = genData1.data?.inviteCode || "";
    assert(voucher1.length > 0, "Student A generated valid voucher code: " + voucher1);

    // Parent A attempts redemption with incorrect student email
    const wrongEmailRes = await fetch(`${baseUrl}/parent/invitations/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${parentAToken}`,
      },
      body: JSON.stringify({
        inviteCode: voucher1,
        studentEmail: "wrong_impostor_email@example.com",
        relationshipType: "MOTHER",
      }),
    });
    const wrongEmailData = (await wrongEmailRes.json()) as ApiResponse;

    assert(
      wrongEmailRes.status === 400,
      "CASE 2: HTTP status is 400 Bad Request on student email mismatch"
    );
    assert(
      wrongEmailData.error?.code === "STUDENT_EMAIL_MISMATCH",
      "CASE 2: Error code is 'STUDENT_EMAIL_MISMATCH'"
    );
    assert(
      wrongEmailData.error?.message === "The student email does not match the registered account.",
      "CASE 2: Exact error message returned: 'The student email does not match the registered account.'"
    );

    // Check DB: No relationship was created
    const linkCheckAfterWrongEmail = await pool.query(
      `SELECT * FROM student_parent_links WHERE parent_user_id = $1 AND student_user_id = $2`,
      [parentAId, studentAId]
    );
    assert(
      linkCheckAfterWrongEmail.rowCount === 0,
      "CASE 2: Database confirms NO link record was created"
    );

    // Check DB: Voucher remains ACTIVE
    const voucherStatusCheck = await pool.query(
      `SELECT status FROM parent_invitations WHERE invite_code = $1`,
      [voucher1]
    );
    assert(
      voucherStatusCheck.rows[0]?.status === "ACTIVE",
      "CASE 2: Database confirms voucher remains 'ACTIVE' after failed attempt"
    );

    // =========================================================================
    // CASE 1: Valid voucher + Correct email -> Relationship created
    // =========================================================================
    console.log("\n--- [SECURITY TEST - CASE 1: Valid Voucher + Correct Email] ---");
    // Parent A redeems voucher1 using the correct email (testing case-insensitivity and trim)
    const validEmailWithSpacesAndUpper = `   ${studentAEmail.toUpperCase()}   `;
    const validRedeemRes = await fetch(`${baseUrl}/parent/invitations/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${parentAToken}`,
      },
      body: JSON.stringify({
        inviteCode: voucher1,
        studentEmail: validEmailWithSpacesAndUpper,
        relationshipType: "MOTHER",
      }),
    });
    const validRedeemData = (await validRedeemRes.json()) as ApiResponse<{ link: any; student: any }>;

    assert(
      validRedeemRes.status === 200 && validRedeemData.success === true,
      "CASE 1: HTTP status is 200 OK and redemption succeeds"
    );
    assert(
      validRedeemData.data?.student?.firstName === "Alpha",
      "CASE 1: Returned student is Alpha"
    );
    assert(
      validRedeemData.data?.link?.link_status === "ACTIVE" &&
        validRedeemData.data?.link?.relationship_type === "MOTHER",
      "CASE 1: Link is ACTIVE with relationship type MOTHER"
    );

    // Verify DB: Link exists with invitation_id populated
    const linkDbCheck = await pool.query(
      `SELECT spl.*, pi.invite_code 
       FROM student_parent_links spl
       JOIN parent_invitations pi ON spl.invitation_id = pi.id
       WHERE spl.parent_user_id = $1 AND spl.student_user_id = $2`,
      [parentAId, studentAId]
    );
    assert(
      linkDbCheck.rowCount === 1 && linkDbCheck.rows[0]?.invite_code === voucher1,
      "CASE 1: DB confirms link references invitation_id foreign key correctly"
    );

    // Verify DB: Voucher is now USED
    const voucherUsedCheck = await pool.query(
      `SELECT status, used_by_parent_id, used_at FROM parent_invitations WHERE invite_code = $1`,
      [voucher1]
    );
    assert(
      voucherUsedCheck.rows[0]?.status === "USED" &&
        voucherUsedCheck.rows[0]?.used_by_parent_id === parentAId &&
        voucherUsedCheck.rows[0]?.used_at !== null,
      "CASE 1: DB confirms voucher status is 'USED' and linked to Parent A"
    );

    // =========================================================================
    // CASE 3: Expired voucher -> Rejected
    // =========================================================================
    console.log("\n--- [SECURITY TEST - CASE 3: Expired Voucher] ---");
    const expiredCode = `MLP-EXPD-${Math.floor(1000 + Math.random() * 9000)}`;
    await pool.query(
      `INSERT INTO parent_invitations (student_id, invite_code, status, expires_at, created_at)
       VALUES ($1, $2, 'ACTIVE', NOW() - INTERVAL '2 days', NOW() - INTERVAL '9 days')`,
      [studentAId, expiredCode]
    );

    const expiredRedeemRes = await fetch(`${baseUrl}/parent/invitations/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${parentBToken}`,
      },
      body: JSON.stringify({
        inviteCode: expiredCode,
        studentEmail: studentAEmail,
        relationshipType: "FATHER",
      }),
    });
    const expiredRedeemData = (await expiredRedeemRes.json()) as ApiResponse;

    assert(
      expiredRedeemRes.status === 400,
      "CASE 3: HTTP status is 400 Bad Request on expired voucher"
    );
    assert(
      expiredRedeemData.error?.code === "INVITATION_EXPIRED",
      "CASE 3: Error code is 'INVITATION_EXPIRED'"
    );

    // =========================================================================
    // CASE 4: Used voucher -> Rejected
    // =========================================================================
    console.log("\n--- [SECURITY TEST - CASE 4: Used Voucher] ---");
    // Parent B attempts to use voucher1 which was already USED by Parent A
    const usedRedeemRes = await fetch(`${baseUrl}/parent/invitations/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${parentBToken}`,
      },
      body: JSON.stringify({
        inviteCode: voucher1,
        studentEmail: studentAEmail,
        relationshipType: "GUARDIAN",
      }),
    });
    const usedRedeemData = (await usedRedeemRes.json()) as ApiResponse;

    assert(
      usedRedeemRes.status === 400,
      "CASE 4: HTTP status is 400 Bad Request on already used voucher"
    );
    assert(
      usedRedeemData.error?.code === "INVITATION_ALREADY_USED",
      "CASE 4: Error code is 'INVITATION_ALREADY_USED'"
    );

    // Check DB: Parent B is NOT linked to Student A
    const parentBLinkCheck = await pool.query(
      `SELECT * FROM student_parent_links WHERE parent_user_id = $1 AND student_user_id = $2`,
      [parentBId, studentAId]
    );
    assert(
      parentBLinkCheck.rowCount === 0,
      "CASE 4: Parent B was NOT linked"
    );

    // =========================================================================
    // CASE 5: Parent accesses unrelated student -> 403 Forbidden
    // =========================================================================
    console.log("\n--- [SECURITY TEST - CASE 5: Parent Accesses Unrelated Student] ---");
    // 5a. Parent A attempts to access Student B (unrelated child)
    const unauthChildRes1 = await fetch(`${baseUrl}/parent/children/${studentBId}/overview`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parentAToken}`,
      },
    });
    assert(
      unauthChildRes1.status === 403,
      "CASE 5: Parent A accessing unrelated Student B overview returns 403 Forbidden"
    );

    // 5b. Parent B attempts to access Student A (unrelated child)
    const unauthChildRes2 = await fetch(`${baseUrl}/parent/children/${studentAId}/overview`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parentBToken}`,
      },
    });
    assert(
      unauthChildRes2.status === 403,
      "CASE 5: Parent B accessing unrelated Student A overview returns 403 Forbidden"
    );

    // 5c. Parent A accessing linked Student A succeeds with 200
    const authChildRes = await fetch(`${baseUrl}/parent/children/${studentAId}/overview`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${parentAToken}`,
      },
    });
    assert(
      authChildRes.status === 200,
      "CASE 5: Parent A accessing verified connected Student A returns 200 OK"
    );

  } catch (err) {
    console.error("❌ Test suite encountered unhandled exception:", err);
    failed++;
  } finally {
    server.close();
    await closeDatabasePool();
    console.log(`\n======================================================`);
    console.log(`🏁 Security Test Cases Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`======================================================\n`);
    if (failed > 0) {
      process.exit(1);
    }
  }
}

runParentConnectSecurityTestSuite();
