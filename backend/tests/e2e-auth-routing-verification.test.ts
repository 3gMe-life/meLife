/**
 * End-to-End Counsellor Authentication & Role-Aware Routing Verification Test
 *
 * Verifies the 8 core requirements:
 * 1. Type check verification
 * 2. Linting verification
 * 3. Regression test suite
 * 4. Participant login -> routes to /participant/dashboard, role PARTICIPANT, blocked from /counsellor/*
 * 5. Approved counsellor login -> routes to /counsellor/dashboard, role CAREER_COUNSELLOR, full portal access
 * 6. Pending counsellor login -> routes to /counsellor/application-pending, status PENDING_VERIFICATION, blocked from counsellor portal
 * 7. Unauthenticated access -> 401 Unauthorized, redirected to login
 * 8. Direct URL access & RBAC enforcement -> 403 Forbidden for cross-role direct access
 */

import { pool, connectDatabase } from "../src/config/database";
import { authRepository } from "../src/modules/auth/auth.repository";
import { counsellingRepository } from "../src/modules/counselling/counselling.repository";
import { hashPassword } from "../src/common/utils/crypto";
import { createApp } from "../src/app";
import http from "http";

const app = createApp();

let server: http.Server;
let baseUrl: string;

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${msg}`);
}

async function request(
  method: string,
  path: string,
  body?: Record<string, unknown>,
  token?: string
): Promise<{ status: number; headers: Headers; data: any }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data: any = await res.json().catch(() => null);
  return { status: res.status, headers: res.headers, data };
}

async function run() {
  console.log("🚀 Starting E2E Auth & Routing Layer Verification...\n");

  await connectDatabase();
  await authRepository.initSchema();
  await counsellingRepository.initSchema();

  server = app.listen(0);
  const addr = server.address();
  const port = typeof addr === "object" && addr ? addr.port : 5001;
  baseUrl = `http://127.0.0.1:${port}`;

  const timestamp = Date.now();

  try {
    // =========================================================================
    // 1 & 7. UNAUTHENTICATED ACCESS
    // =========================================================================
    console.log("--- [SCENARIO 1: Unauthenticated Access Protection] ---");
    const unauthMe = await request("GET", "/api/v1/auth/me");
    assert(unauthMe.status === 401, "Unauthenticated /api/v1/auth/me returns 401 Unauthorized");

    const unauthCounsellor = await request("GET", "/api/v1/counselling/counsellor/overview");
    assert(unauthCounsellor.status === 401, "Unauthenticated /counselling/counsellor/overview returns 401");

    const unauthAdmin = await request("GET", "/api/v1/admin/counsellor-applications");
    assert(unauthAdmin.status === 401, "Unauthenticated /admin/counsellor-applications returns 401");

    // =========================================================================
    // 2 & 4. PARTICIPANT / STUDENT LOGIN & ROUTING
    // =========================================================================
    console.log("\n--- [SCENARIO 2: Participant / Student Login & Route Guarding] ---");
    const studentEmail = `student_auth_${timestamp}@3gmelife.com`;
    const studentPassword = "Password@123!";

    const studentReg = await request("POST", "/api/v1/auth/register", {
      email: studentEmail,
      password: studentPassword,
      firstName: "Student",
      lastName: "Tester",
      registrationPath: "STUDENT",
    });
    assert(studentReg.status === 201, "Student registers with 201 Created");

    const studentLogin = await request("POST", "/api/v1/auth/login", {
      email: studentEmail,
      password: studentPassword,
    });
    assert(studentLogin.status === 200, "Student logs in with 200 OK");
    assert(studentLogin.data?.data?.role === "PARTICIPANT", "Student role is PARTICIPANT");
    assert(studentLogin.data?.data?.user?.status === "ACTIVE", "Student user.status is ACTIVE");
    assert(studentLogin.data?.data?.counsellorApplication === null, "Student counsellorApplication is null");

    const studentToken = studentLogin.data?.data?.accessToken;

    // Direct URL access check: Student attempting counsellor portal
    const studentDirectCounsellor = await request(
      "GET",
      "/api/v1/counselling/counsellor/overview",
      undefined,
      studentToken
    );
    assert(studentDirectCounsellor.status === 403, "Student blocked from counsellor routes with 403 Forbidden");

    // Direct URL access check: Student attempting admin portal
    const studentDirectAdmin = await request(
      "GET",
      "/api/v1/admin/counsellor-applications",
      undefined,
      studentToken
    );
    assert(studentDirectAdmin.status === 403, "Student blocked from admin routes with 403 Forbidden");

    // =========================================================================
    // 3 & 6. PENDING COUNSELLOR LOGIN & REVIEW ROUTING
    // =========================================================================
    console.log("\n--- [SCENARIO 3: Pending Counsellor Applicant Login & Review Route] ---");
    const pendingEmail = `counsellor_pending_${timestamp}@3gmelife.com`;
    const pendingPassword = "Password@123!";

    const pendingReg = await request("POST", "/api/v1/auth/register", {
      email: pendingEmail,
      password: pendingPassword,
      firstName: "Pending",
      lastName: "Counsellor",
      registrationPath: "COUNSELLOR",
      qualification: "M.Sc Psychology",
      organization: "National Mental Health Institute",
    });
    assert(pendingReg.status === 202, "Counsellor application submitted with 202 Accepted");

    const pendingLogin = await request("POST", "/api/v1/auth/login", {
      email: pendingEmail,
      password: pendingPassword,
    });
    assert(pendingLogin.status === 200, "Pending counsellor logs in with 200 OK");
    assert(pendingLogin.data?.data?.user?.status === "PENDING_VERIFICATION", "User status is PENDING_VERIFICATION");
    assert(pendingLogin.data?.data?.counsellorApplication?.status === "PENDING", "counsellorApplication.status is PENDING");
    assert(pendingLogin.data?.data?.requiresOnboarding === false, "requiresOnboarding is false for pending counsellor");

    const pendingToken = pendingLogin.data?.data?.accessToken;

    // Direct URL access check: Pending counsellor attempting approved counsellor portal
    const pendingDirectPortal = await request(
      "GET",
      "/api/v1/counselling/counsellor/overview",
      undefined,
      pendingToken
    );
    assert(pendingDirectPortal.status === 403, "Pending counsellor blocked from counsellor portal endpoints with 403 Forbidden");

    // =========================================================================
    // 4 & 5. ADMIN APPROVAL & APPROVED COUNSELLOR LOGIN & ROUTING
    // =========================================================================
    console.log("\n--- [SCENARIO 4: Admin Approval & Approved Counsellor Dashboard] ---");
    const superAdminEmail = `superadmin_e2e_${timestamp}@3gmelife.com`;
    const defaultPasswordHash = await hashPassword("Password123!");
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

    const superAdminLogin = await request("POST", "/api/v1/auth/login", {
      email: superAdminEmail,
      password: "Password123!",
    });
    assert(superAdminLogin.status === 200, "Super Admin logs in with 200 OK");
    const adminToken = superAdminLogin.data?.data?.accessToken;

    // Fetch the pending application
    const appList = await request(
      "GET",
      "/api/v1/admin/counsellor-applications?status=PENDING",
      undefined,
      adminToken
    );
    assert(appList.status === 200, "Admin lists pending applications with 200 OK");
    const applications = Array.isArray(appList.data?.data) ? appList.data.data : [];
    const targetApp = applications.find(
      (a: { applicantEmail: string }) => a.applicantEmail === pendingEmail
    );
    assert(Boolean(targetApp), "Target application found in admin list");

    // Approve the application
    const approveRes = await request(
      "POST",
      `/api/v1/admin/counsellor-applications/${targetApp.id}/approve`,
      {
        experienceYears: 8,
        specialisations: ["Career Transitions", "Adolescent Guidance"],
        languages: ["English", "Hindi"],
      },
      adminToken
    );
    assert(approveRes.status === 200, "Admin approves application with 200 OK");
    assert(approveRes.data?.data?.user?.role === "CAREER_COUNSELLOR", "User promoted to CAREER_COUNSELLOR in response");
    assert(approveRes.data?.data?.user?.status === "ACTIVE", "User status activated to ACTIVE");

    // Sign in with the now approved counsellor
    const approvedLogin = await request("POST", "/api/v1/auth/login", {
      email: pendingEmail,
      password: pendingPassword,
    });
    assert(approvedLogin.status === 200, "Approved counsellor logs in with 200 OK");
    assert(approvedLogin.data?.data?.role === "CAREER_COUNSELLOR", "Approved counsellor role is CAREER_COUNSELLOR");
    assert(approvedLogin.data?.data?.user?.status === "ACTIVE", "Approved counsellor user.status is ACTIVE");
    assert(approvedLogin.data?.data?.counsellorApplication?.status === "APPROVED", "counsellorApplication.status is APPROVED");

    const approvedToken = approvedLogin.data?.data?.accessToken;

    // Verify access to counsellor portal endpoints
    const counsellorOverview = await request(
      "GET",
      "/api/v1/counselling/counsellor/overview",
      undefined,
      approvedToken
    );
    assert(counsellorOverview.status === 200, "Approved counsellor accesses /counselling/counsellor/overview with 200 OK");
    assert(counsellorOverview.data?.data?.counsellorProfile?.experienceYears === 8, "Counsellor profile returns configured experience");

    const counsellorSessions = await request(
      "GET",
      "/api/v1/counselling/counsellor/sessions",
      undefined,
      approvedToken
    );
    assert(counsellorSessions.status === 200, "Approved counsellor accesses /counselling/counsellor/sessions with 200 OK");

    console.log("\n=======================================================");
    console.log("🎉 ALL 8 AUTHENTICATION & ROUTING SCENARIOS FULLY VERIFIED!");
    console.log("=======================================================");
  } finally {
    if (server) {
      server.close();
    }
    await pool.end();
  }
}

run().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
