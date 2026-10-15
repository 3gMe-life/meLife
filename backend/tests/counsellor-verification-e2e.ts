import assert from "node:assert";
import { pool, closeDatabasePool } from "../src/config/database";
import { authTokenService } from "../src/modules/auth/auth.token.service";

const BASE_URL = "http://localhost:5001/api/v1";
const COUNSELLOR_EMAIL = "counsellor.test@3gmelife.com";
const COUNSELLOR_PASSWORD = process.env.COUNSELLOR_TEST_PASSWORD || "Counsellor@12345";

async function runCounsellorVerification() {
  console.log("=================================================");
  console.log("🧪 Comprehensive Counsellor HTTP & RBAC Verification");
  console.log("=================================================\n");

  // 1. Login as Counsellor
  console.log("1. Authenticating as test counsellor...");
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: COUNSELLOR_EMAIL, password: COUNSELLOR_PASSWORD }),
  });
  assert.strictEqual(loginRes.status, 200, `Login status should be 200, got ${loginRes.status}`);
  const loginData = (await loginRes.json()) as any;
  assert.strictEqual(loginData.data.role, "CAREER_COUNSELLOR", "Role must be CAREER_COUNSELLOR");
  assert.ok(loginData.data.accessToken, "Access token must be returned");
  const counsellorToken = loginData.data.accessToken;
  const counsellorId = loginData.data.user.id;
  console.log(`✅ Login successful. Role: ${loginData.data.role}, User ID: ${counsellorId}`);

  const counsellorHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${counsellorToken}`,
  };

  // 2. Test the 5 required Counsellor Portal APIs
  console.log("\n2. Testing Counsellor Portal endpoints with counsellor token...");

  const overviewRes = await fetch(`${BASE_URL}/counselling/counsellor/overview`, { headers: counsellorHeaders });
  assert.strictEqual(overviewRes.status, 200, `GET /counsellor/overview should be 200, got ${overviewRes.status}`);
  const overviewData = (await overviewRes.json()) as any;
  assert.ok(overviewData.data.stats, "Overview stats should be present");
  console.log(`✅ GET /counselling/counsellor/overview: 200 OK (Completed: ${overviewData.data.stats.completedSessionsCount})`);

  const sessionsRes = await fetch(`${BASE_URL}/counselling/counsellor/sessions`, { headers: counsellorHeaders });
  assert.strictEqual(sessionsRes.status, 200, `GET /counsellor/sessions should be 200, got ${sessionsRes.status}`);
  const sessionsData = (await sessionsRes.json()) as any;
  assert.ok(Array.isArray(sessionsData.data), "Sessions array should be returned");
  console.log(`✅ GET /counselling/counsellor/sessions: 200 OK (${sessionsData.data.length} sessions)`);

  const studentsRes = await fetch(`${BASE_URL}/counselling/counsellor/students`, { headers: counsellorHeaders });
  assert.strictEqual(studentsRes.status, 200, `GET /counsellor/students should be 200, got ${studentsRes.status}`);
  const studentsData = (await studentsRes.json()) as any;
  assert.ok(Array.isArray(studentsData.data), "Students array should be returned");
  console.log(`✅ GET /counselling/counsellor/students: 200 OK (${studentsData.data.length} students)`);

  const availRes = await fetch(`${BASE_URL}/counselling/counsellor/availability`, { headers: counsellorHeaders });
  assert.strictEqual(availRes.status, 200, `GET /counsellor/availability should be 200, got ${availRes.status}`);
  const availData = (await availRes.json()) as any;
  assert.ok(Array.isArray(availData.data), "Availability array should be returned");
  console.log(`✅ GET /counselling/counsellor/availability: 200 OK (${availData.data.length} slots)`);

  const reviewsRes = await fetch(`${BASE_URL}/counselling/counsellor/reviews`, { headers: counsellorHeaders });
  assert.strictEqual(reviewsRes.status, 200, `GET /counsellor/reviews should be 200, got ${reviewsRes.status}`);
  const reviewsData = (await reviewsRes.json()) as any;
  assert.ok(Array.isArray(reviewsData.data), "Reviews array should be returned");
  console.log(`✅ GET /counselling/counsellor/reviews: 200 OK (${reviewsData.data.length} reviews)`);

  // 3. Test Student Summary Access (Consent vs No Consent vs Unrelated)
  console.log("\n3. Testing Student Summary Access with Privacy Consent Firewall...");
  // Find test session students
  const sessionRows = await pool.query(
    `SELECT cs.id as session_id, cs.student_id, cs.status, scc.permission
     FROM counselling_sessions cs
     JOIN counsellors c ON cs.counsellor_id = c.id
     LEFT JOIN student_counsellor_consent scc ON scc.student_id = cs.student_id AND scc.counsellor_id = c.id
     WHERE c.user_id = $1
     ORDER BY cs.created_at ASC`,
    [counsellorId]
  );

  const consentedStudent = sessionRows.rows.find((r) => r.permission === "VIEW_ASSESSMENT_SUMMARY");
  const unconsentedStudent = sessionRows.rows.find((r) => !r.permission);

  if (consentedStudent) {
    const summaryRes = await fetch(
      `${BASE_URL}/counselling/counsellor/students/${consentedStudent.student_id}/summary`,
      { headers: counsellorHeaders }
    );
    assert.strictEqual(summaryRes.status, 200, `Consented student summary should return 200, got ${summaryRes.status}`);
    const summaryData = (await summaryRes.json()) as any;
    console.log(`✅ Connected student + valid consent -> ALLOWED (200 OK, Student: ${summaryData.data.studentName})`);
  }

  if (unconsentedStudent) {
    const noConsentRes = await fetch(
      `${BASE_URL}/counselling/counsellor/students/${unconsentedStudent.student_id}/summary`,
      { headers: counsellorHeaders }
    );
    assert.strictEqual(noConsentRes.status, 403, `Unconsented student summary should return 403, got ${noConsentRes.status}`);
    console.log(`✅ Connected student + revoked/no consent -> FORBIDDEN (403 OK)`);
  }

  const unrelatedStudentRes = await fetch(
    `${BASE_URL}/counselling/counsellor/students/00000000-0000-0000-0000-000000000999/summary`,
    { headers: counsellorHeaders }
  );
  assert.strictEqual(unrelatedStudentRes.status, 403, `Unrelated student summary should return 403, got ${unrelatedStudentRes.status}`);
  console.log(`✅ Unrelated student -> FORBIDDEN (403 OK)`);

  // 4. Test Counsellor cannot access Admin routes
  console.log("\n4. Testing Counsellor RBAC restrictions against admin-only routes...");
  const adminUsersRes = await fetch(`${BASE_URL}/admin/users`, { headers: counsellorHeaders });
  assert.strictEqual(adminUsersRes.status, 403, `Counsellor accessing /admin/users should get 403, got ${adminUsersRes.status}`);
  console.log(`✅ GET /admin/users -> 403 Forbidden`);

  const adminOverviewRes = await fetch(`${BASE_URL}/admin/overview`, { headers: counsellorHeaders });
  assert.strictEqual(adminOverviewRes.status, 403, `Counsellor accessing /admin/overview should get 403, got ${adminOverviewRes.status}`);
  console.log(`✅ GET /admin/overview -> 403 Forbidden`);

  // 5. Test Student/Participant cannot access Counsellor Portal APIs, create notes, or edit availability
  console.log("\n5. Testing Participant RBAC restrictions against counsellor operations...");
  // Find a participant user in DB and generate a token or login
  const participantRes = await pool.query(
    `SELECT u.id, u.email FROM users u
     JOIN user_roles ur ON u.id = ur.user_id
     JOIN roles r ON ur.role_id = r.id
     WHERE r.name = 'PARTICIPANT' AND u.status = 'ACTIVE'
     LIMIT 1`
  );

  if (participantRes.rows.length > 0) {
    const studentUser = participantRes.rows[0];
    // Generate valid authentic access token for student
    const studentToken = authTokenService.signAccessToken({
      userId: studentUser.id,
      sessionId: "00000000-0000-0000-0000-000000000001",
      role: "PARTICIPANT",
      permissions: [],
    });
    const studentHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${studentToken}`,
    };

    // A. Student accessing counsellor overview -> 403
    const studentOverviewRes = await fetch(`${BASE_URL}/counselling/counsellor/overview`, { headers: studentHeaders });
    assert.strictEqual(studentOverviewRes.status, 403, `Student accessing /counsellor/overview should get 403, got ${studentOverviewRes.status}`);
    console.log(`✅ Student accessing GET /counselling/counsellor/overview -> 403 Forbidden`);

    // B. Student saving session notes -> 403 (Security fix check!)
    const sampleSessionId = sessionRows.rows[0]?.session_id || "00000000-0000-0000-0000-000000000001";
    const studentNotesRes = await fetch(`${BASE_URL}/counselling/sessions/${sampleSessionId}/notes`, {
      method: "POST",
      headers: studentHeaders,
      body: JSON.stringify({ summary: "Malicious notes", recommendations: "Should fail" }),
    });
    assert.strictEqual(studentNotesRes.status, 403, `Student creating session notes should get 403, got ${studentNotesRes.status}`);
    console.log(`✅ Student calling POST /counselling/sessions/:id/notes -> 403 Forbidden (Security Guard Verified!)`);

    // Verify no orphan counsellor row was created in DB for student
    const orphanCheck = await pool.query(
      `SELECT COUNT(*)::int as count FROM counsellors WHERE user_id = $1`,
      [studentUser.id]
    );
    assert.strictEqual(orphanCheck.rows[0].count, 0, "No orphan counsellor profile must exist for student");
    console.log(`✅ Orphan profile prevention confirmed in DB: 0 counsellor rows for student user`);

    // C. Student editing counsellor availability -> 403
    const studentAvailRes = await fetch(`${BASE_URL}/counselling/counsellor/availability`, {
      method: "PUT",
      headers: studentHeaders,
      body: JSON.stringify({ slots: [] }),
    });
    assert.strictEqual(studentAvailRes.status, 403, `Student editing availability should get 403, got ${studentAvailRes.status}`);
    console.log(`✅ Student calling PUT /counselling/counsellor/availability -> 403 Forbidden`);
  }

  console.log("\n=================================================");
  console.log("🎉 All HTTP & RBAC Verification Tests PASSED!");
  console.log("=================================================\n");
}

runCounsellorVerification()
  .then(async () => {
    await closeDatabasePool();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("❌ Verification failed:", err);
    await closeDatabasePool();
    process.exit(1);
  });
