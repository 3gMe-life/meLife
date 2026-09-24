import { connectDatabase, closeDatabasePool, pool } from "../src/config/database";
import { authRepository } from "../src/modules/auth/auth.repository";
import { counsellingRepository } from "../src/modules/counselling/counselling.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { createApp } from "../src/app";
import { hashPassword } from "../src/common/utils/crypto";
import http from "http";

async function runCounsellorApprovalTestSuite() {
  console.log("🧪 Starting Counsellor Approval & Admin RBAC Workflow Test Suite...\n");

  await connectDatabase();
  await authRepository.initSchema();
  await authRepository.seedRolePermissions();
  await participantRepository.initSchema();
  await counsellingRepository.initSchema();

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

    // =========================================================================
    // SETUP: Seed Admin Accounts
    // =========================================================================
    console.log("--- [SETUP: Creating Super Admin and Platform Admin] ---");
    const superAdminEmail = `superadmin_${timestamp}@3gmelife.com`;
    const superAdminUserRes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Super', 'Admin', 'ACTIVE', NOW())
       RETURNING id`,
      [superAdminEmail, defaultPasswordHash]
    );
    const superAdminId = superAdminUserRes.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'SUPER_ADMIN'`,
      [superAdminId]
    );

    // Login as Super Admin
    const superAdminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: superAdminEmail, password: "Password123!" }),
    });
    const superAdminLoginData = await superAdminLoginRes.json();
    const superAdminToken = superAdminLoginData.data?.accessToken;
    assert(Boolean(superAdminToken), "Super Admin login generates valid accessToken");

    // =========================================================================
    // CASE 1: SECURITY & RBAC ENFORCEMENT
    // =========================================================================
    console.log("\n--- [CASE 1: Admin RBAC Protection on Approval Endpoints] ---");

    // 1.1 Unauthenticated request
    const unauthRes = await fetch(`${baseUrl}/admin/counsellor-applications`);
    assert(unauthRes.status === 401, "Unauthenticated request to /admin/counsellor-applications rejected with 401 Unauthorized");

    // 1.2 Student / Participant token
    const studentEmail = `student_${timestamp}@3gmelife.com`;
    const regStudentRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: studentEmail,
        password: "Password123!",
        firstName: "Student",
        lastName: "User",
        registrationPath: "STUDENT",
      }),
    });
    const regStudentData = await regStudentRes.json();
    const studentToken = regStudentData.data?.accessToken;

    const studentAdminRes = await fetch(`${baseUrl}/admin/counsellor-applications`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert(studentAdminRes.status === 403, "Participant token blocked from admin endpoints with 403 Forbidden");

    // =========================================================================
    // CASE 2: REGISTER PENDING COUNSELLOR APPLICANT
    // =========================================================================
    console.log("\n--- [CASE 2: Registering New Counsellor Applicant] ---");
    const applicantEmail = `counsellor_applicant_${timestamp}@3gmelife.com`;
    const regAppRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: applicantEmail,
        password: "Password123!",
        firstName: "Dr. Sunita",
        lastName: "Rao",
        registrationPath: "COUNSELLOR",
        qualification: "PhD in Career Guidance & Educational Counselling",
        organization: "Apex Career Institute",
      }),
    });
    const regAppData = await regAppRes.json();
    assert(regAppRes.status === 202, "Counsellor application submitted with 202 Accepted");
    assert(regAppData.data?.status === "PENDING", "Application status is PENDING");

    // Verify DB initial state
    const userDbRes = await pool.query(
      `SELECT u.id, u.status, r.name as role_name, ca.id as app_id, ca.status as app_status
       FROM users u
       JOIN user_roles ur ON u.id = ur.user_id AND ur.is_primary = true
       JOIN roles r ON ur.role_id = r.id
       JOIN counsellor_applications ca ON u.id = ca.user_id
       WHERE LOWER(u.email) = LOWER($1)`,
      [applicantEmail]
    );
    const initialDbRow = userDbRes.rows[0];
    assert(initialDbRow?.status === "PENDING_VERIFICATION", "Initial user.status is PENDING_VERIFICATION");
    assert(initialDbRow?.role_name === "PARTICIPANT", "Initial primary role is PARTICIPANT");
    assert(initialDbRow?.app_status === "PENDING", "Initial application status is PENDING");

    const applicationId = initialDbRow.app_id;
    const applicantUserId = initialDbRow.id;

    // Check no row exists in counsellors table yet
    const counsellorRowCheck = await pool.query("SELECT id FROM counsellors WHERE user_id = $1", [applicantUserId]);
    assert(counsellorRowCheck.rows.length === 0, "No row exists in counsellors table prior to approval");

    // =========================================================================
    // CASE 3: ADMIN LIST & GET APPLICATION
    // =========================================================================
    console.log("\n--- [CASE 3: Admin List and Fetch Application Details] ---");
    const listRes = await fetch(`${baseUrl}/admin/counsellor-applications?status=PENDING`, {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    const listData = await listRes.json();
    assert(listRes.status === 200, "Admin can list pending counsellor applications with 200 OK");
    const foundInList = listData.data?.some((a: any) => a.id === applicationId);
    assert(foundInList, "Submitted application is present in admin pending list");

    const getAppRes = await fetch(`${baseUrl}/admin/counsellor-applications/${applicationId}`, {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    const getAppData = await getAppRes.json();
    assert(getAppRes.status === 200, "Admin can fetch single application by ID with 200 OK");
    assert(getAppData.data?.applicantEmail === applicantEmail, "Application detail matches applicant email");
    assert(getAppData.data?.applicantName === "Dr. Sunita Rao", "Application detail matches applicant name");

    // =========================================================================
    // CASE 4: ATOMIC APPROVAL WORKFLOW
    // =========================================================================
    console.log("\n--- [CASE 4: Admin Atomic Approval Transaction] ---");
    const approveRes = await fetch(`${baseUrl}/admin/counsellor-applications/${applicationId}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${superAdminToken}`,
      },
      body: JSON.stringify({
        bio: "Senior Career Guidance Specialist with over 10 years of experience helping high school students.",
        experienceYears: 10,
        specialisations: ["School Career Guidance", "STEM & Technology Careers"],
        reviewNotes: "Credentials and PhD verified with UCLA records. Approved.",
      }),
    });
    const approveData = await approveRes.json();
    assert(approveRes.status === 200, "Admin approval endpoint succeeds with 200 OK");
    assert(approveData.data?.application?.status === "APPROVED", "Returned application status is APPROVED");
    assert(approveData.data?.user?.status === "ACTIVE", "Returned user status is ACTIVE");
    assert(approveData.data?.user?.role === "CAREER_COUNSELLOR", "Returned user role is CAREER_COUNSELLOR");
    assert(Boolean(approveData.data?.counsellor?.id), "Returned counsellor profile ID is present");

    // Verify DB State After Approval
    const afterUserRes = await pool.query(
      `SELECT u.id, u.status, r.name as role_name, ca.status as app_status, ca.reviewed_by, ca.reviewed_at, ca.review_notes
       FROM users u
       JOIN user_roles ur ON u.id = ur.user_id AND ur.is_primary = true
       JOIN roles r ON ur.role_id = r.id
       JOIN counsellor_applications ca ON u.id = ca.user_id
       WHERE u.id = $1`,
      [applicantUserId]
    );
    const afterDbRow = afterUserRes.rows[0];
    assert(afterDbRow?.status === "ACTIVE", "DB users.status transitioned to ACTIVE");
    assert(afterDbRow?.role_name === "CAREER_COUNSELLOR", "DB user primary role transitioned to CAREER_COUNSELLOR");
    assert(afterDbRow?.app_status === "APPROVED", "DB counsellor_applications.status transitioned to APPROVED");
    assert(afterDbRow?.reviewed_by === superAdminId, "DB reviewer audit ID matches Super Admin");
    assert(Boolean(afterDbRow?.reviewed_at), "DB reviewed_at timestamp is populated");

    // Verify no duplicate role entries
    const allRolesRes = await pool.query("SELECT role_id FROM user_roles WHERE user_id = $1", [applicantUserId]);
    assert(allRolesRes.rows.length === 1, "User has exactly 1 role assigned in user_roles (no duplicates/leftover PARTICIPANT)");

    // Verify counsellors profile in database
    const counsellorDbRes = await pool.query(
      "SELECT id, user_id, qualification, experience_years, bio, approval_status FROM counsellors WHERE user_id = $1",
      [applicantUserId]
    );
    const counsellorDbRow = counsellorDbRes.rows[0];
    assert(Boolean(counsellorDbRow), "Counsellor profile row exists in counsellors table");
    assert(counsellorDbRow?.approval_status === "APPROVED", "Counsellor approval_status is APPROVED");
    assert(counsellorDbRow?.experience_years === 10, "Counsellor experience_years is 10");

    // Verify Notification Created
    const notifRes = await pool.query("SELECT * FROM notifications WHERE user_id = $1", [applicantUserId]);
    assert(notifRes.rows.length > 0, "Notification emitted to the newly approved counsellor");

    // =========================================================================
    // CASE 5: APPROVED COUNSELLOR LOGIN & ACCESS VERIFICATION
    // =========================================================================
    console.log("\n--- [CASE 5: Approved Counsellor Sign-in & Portal Access] ---");
    const approvedLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: applicantEmail, password: "Password123!" }),
    });
    const approvedLoginData = await approvedLoginRes.json();
    assert(approvedLoginRes.status === 200, "Approved counsellor login succeeds with 200 OK");
    assert(approvedLoginData.data?.role === "CAREER_COUNSELLOR", "Login payload primary role is CAREER_COUNSELLOR");
    assert(approvedLoginData.data?.user?.status === "ACTIVE", "Login payload user status is ACTIVE");

    const approvedToken = approvedLoginData.data?.accessToken;

    // Verify GET /auth/me returns CAREER_COUNSELLOR
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${approvedToken}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200, "Approved counsellor /auth/me returns 200 OK");
    assert(meData.data?.role === "CAREER_COUNSELLOR", "/auth/me role is CAREER_COUNSELLOR");

    // Verify Approved Counsellor CAN access protected portal endpoints
    const portalOverviewRes = await fetch(`${baseUrl}/counselling/counsellor/overview`, {
      headers: { Authorization: `Bearer ${approvedToken}` },
    });
    assert(portalOverviewRes.status === 200, "Approved counsellor accesses /counselling/counsellor/overview with 200 OK");

    const portalSessionsRes = await fetch(`${baseUrl}/counselling/counsellor/sessions`, {
      headers: { Authorization: `Bearer ${approvedToken}` },
    });
    assert(portalSessionsRes.status === 200, "Approved counsellor accesses /counselling/counsellor/sessions with 200 OK");

    // =========================================================================
    // CASE 6: IDEMPOTENCY - PREVENT DUPLICATE APPROVAL
    // =========================================================================
    console.log("\n--- [CASE 6: Idempotency Protection on Re-Approval] ---");
    const duplicateApproveRes = await fetch(`${baseUrl}/admin/counsellor-applications/${applicationId}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${superAdminToken}`,
      },
      body: JSON.stringify({ reviewNotes: "Attempting duplicate approval" }),
    });
    assert(duplicateApproveRes.status === 400, "Re-approving an already approved application returns 400 Bad Request");
    const dupApproveData = await duplicateApproveRes.json();
    assert(
      dupApproveData.error?.code === "APPLICATION_ALREADY_PROCESSED",
      "Error code is APPLICATION_ALREADY_PROCESSED"
    );

    // Verify no duplicate counsellor profiles or roles created
    const countProfilesRes = await pool.query("SELECT COUNT(*)::int as count FROM counsellors WHERE user_id = $1", [applicantUserId]);
    assert(countProfilesRes.rows[0].count === 1, "Exactly 1 profile exists in counsellors table (no duplicates created)");

    // =========================================================================
    // CASE 7: REJECTION WORKFLOW
    // =========================================================================
    console.log("\n--- [CASE 7: Rejection Workflow] ---");
    const rejectApplicantEmail = `rejected_applicant_${timestamp}@3gmelife.com`;
    const regRejAppRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: rejectApplicantEmail,
        password: "Password123!",
        firstName: "Ramesh",
        lastName: "Kumar",
        registrationPath: "COUNSELLOR",
        qualification: "Undergraduate Student",
        organization: "Freelance",
      }),
    });
    const regRejAppData = await regRejAppRes.json();
    const rejUserDb = await pool.query(
      "SELECT ca.id as app_id, u.id as user_id FROM users u JOIN counsellor_applications ca ON u.id = ca.user_id WHERE u.email = $1",
      [rejectApplicantEmail]
    );
    const rejApplicationId = rejUserDb.rows[0].app_id;
    const rejUserId = rejUserDb.rows[0].user_id;

    const rejectRes = await fetch(`${baseUrl}/admin/counsellor-applications/${rejApplicationId}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${superAdminToken}`,
      },
      body: JSON.stringify({
        reason: "Applicant does not hold requisite certified postgraduate qualifications in counselling.",
      }),
    });
    const rejectData = await rejectRes.json();
    assert(rejectRes.status === 200, "Admin reject endpoint succeeds with 200 OK");
    assert(rejectData.data?.application?.status === "REJECTED", "Application status updated to REJECTED");

    // Verify DB state for rejected applicant
    const rejDbCheck = await pool.query(
      `SELECT u.status as u_status, r.name as role_name, ca.status as app_status
       FROM users u
       JOIN user_roles ur ON u.id = ur.user_id AND ur.is_primary = true
       JOIN roles r ON ur.role_id = r.id
       JOIN counsellor_applications ca ON u.id = ca.user_id
       WHERE u.id = $1`,
      [rejUserId]
    );
    assert(rejDbCheck.rows[0]?.u_status === "PENDING_VERIFICATION", "Rejected user status remains PENDING_VERIFICATION (not activated)");
    assert(rejDbCheck.rows[0]?.role_name === "PARTICIPANT", "Rejected user role remains PARTICIPANT (not promoted)");
    assert(rejDbCheck.rows[0]?.app_status === "REJECTED", "Rejected application status is REJECTED");

    // Verify NO counsellors row was created
    const noCounsellorRow = await pool.query("SELECT id FROM counsellors WHERE user_id = $1", [rejUserId]);
    assert(noCounsellorRow.rows.length === 0, "No counsellors row created for rejected applicant");

    // =========================================================================
    // CASE 8: REGRESSION CHECK - STUDENT DASHBOARD & PARTICIPANT FLOW
    // =========================================================================
    console.log("\n--- [CASE 8: Regression Check - Normal Student Flow] ---");
    const studentLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: studentEmail, password: "Password123!" }),
    });
    const studentLoginData = await studentLoginRes.json();
    assert(studentLoginRes.status === 200, "Student login returns 200 OK");
    assert(studentLoginData.data?.role === "PARTICIPANT", "Student role remains PARTICIPANT");
    assert(studentLoginData.data?.user?.status === "ACTIVE", "Student status remains ACTIVE");

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

runCounsellorApprovalTestSuite();
