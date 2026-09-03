import { createApp } from "../src/app";
import { pool, connectDatabase, closeDatabasePool } from "../src/config/database";
import { authRepository } from "../src/modules/auth/auth.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import http from "http";

async function runTests() {
  console.log("🧪 Starting 3G MeLife Participant Onboarding & Profile Test Suite...\n");

  await connectDatabase();
  await authRepository.seedRolePermissions();
  await participantRepository.initSchema();

  const app = createApp();
  const server = http.createServer(app);

  const testPort = 5099;
  await new Promise<void>((resolve) => server.listen(testPort, () => resolve()));
  const baseUrl = `http://localhost:${testPort}/api/v1`;

  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      testsPassed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      testsFailed++;
    }
  }

  try {
    const timestamp = Date.now();

    // CASE 1: New email/password participant -> register -> verify requiresOnboarding: true
    const studentEmail = `student_${timestamp}@example.com`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Aarav",
        lastName: "Sharma",
        email: studentEmail,
        password: "Password123!",
        registrationPath: "STUDENT",
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.data?.requiresOnboarding === true, "CASE 1: New participant registration requires onboarding");

    const accessToken = regData.data.accessToken;
    const cookie = regRes.headers.get("set-cookie") || "";

    // CASE 10: Unauthenticated request to /participant/onboarding -> 401
    const unauthRes = await fetch(`${baseUrl}/participant/onboarding`, {
      method: "GET",
    });
    assert(unauthRes.status === 401, "CASE 10: Unauthenticated request to /participant/onboarding returns 401");

    // CASE 4: /auth/me for new participant returns onboarding.completed === false
    const meRes1 = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const meData1 = await meRes1.json();
    assert(meData1.data?.onboarding?.completed === false, "CASE 4: New participant /auth/me reflects onboarding.completed === false");

    // CASE 6: Invalid DOB (future date or out of bounds) -> validation error
    const invalidDobRes = await fetch(`${baseUrl}/participant/onboarding`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateOfBirth: "2050-01-01",
        educationStage: "SCHOOL",
        gradeLevel: "10",
      }),
    });
    assert(invalidDobRes.status === 400, "CASE 6: Invalid future DOB rejected by backend validation");

    // CASE 7: School Student (Minor) missing guardian info -> backend rejects completion
    const missingGuardianRes = await fetch(`${baseUrl}/participant/onboarding`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateOfBirth: "2010-05-15", // Age 16 (Minor)
        educationStage: "SCHOOL",
        gradeLevel: "10",
        // No guardian info provided
      }),
    });
    assert(missingGuardianRes.status === 400, "CASE 7: Minor school participant without guardian info rejected by backend");

    // Complete Onboarding for Aarav (with valid guardian details)
    const completeOnboardingRes = await fetch(`${baseUrl}/participant/onboarding`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateOfBirth: "2010-05-15",
        educationStage: "SCHOOL",
        gradeLevel: "10",
        schoolName: "Delhi Public School",
        curriculumOrBoard: "CBSE",
        guardianName: "Sunita Sharma",
        guardianPhone: "+91 98765 43210",
        guardianEmail: "sunita.sharma@example.com",
        guardianRelationship: "Mother",
      }),
    });
    const completeOnboardingData = await completeOnboardingRes.json();
    assert(
      completeOnboardingRes.status === 200 && completeOnboardingData.data?.profile?.isOnboarded === true,
      "CASE 1 (cont): Minor participant onboarding successfully saved to PostgreSQL"
    );

    // CASE 3: Onboarded participant /auth/me returns onboarding.completed === true
    const meRes2 = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const meData2 = await meRes2.json();
    assert(
      meData2.data?.onboarding?.completed === true && meData2.data?.onboarding?.gradeLevel === "10",
      "CASE 3: Onboarded participant /auth/me returns onboarding.completed === true with gradeLevel"
    );

    // CASE 5: Participant profile reloaded / preserved
    const profileRes = await fetch(`${baseUrl}/participant/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profileData = await profileRes.json();
    assert(
      profileData.data?.schoolName === "Delhi Public School" && profileData.data?.guardianName === "Sunita Sharma",
      "CASE 5: Participant profile correctly preserved and retrieved from PostgreSQL"
    );

    // CASE 8: Adult Participant (College/Professional, Age > 18) completes WITHOUT guardian details
    const adultEmail = `adult_${timestamp}@example.com`;
    const adultRegRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Vikram",
        lastName: "Verma",
        email: adultEmail,
        password: "Password123!",
        registrationPath: "STUDENT",
      }),
    });
    const adultRegData = await adultRegRes.json();
    const adultToken = adultRegData.data.accessToken;

    const adultOnboardingRes = await fetch(`${baseUrl}/participant/onboarding`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adultToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateOfBirth: "2002-08-20", // Age 24 (Adult)
        educationStage: "COLLEGE_UNIVERSITY",
        schoolName: "IIT Bombay",
        curriculumOrBoard: "B.Tech Computer Science",
        // No guardian details provided
      }),
    });
    const adultOnboardingData = await adultOnboardingRes.json();
    assert(
      adultOnboardingRes.status === 200 && adultOnboardingData.data?.profile?.isOnboarded === true,
      "CASE 8: Adult participant (age > 18) successfully completes onboarding without guardian info"
    );

    // CASE 9: Wrong role (Parent Guardian) attempts participant onboarding API -> 403 Forbidden
    const parentEmail = `parent_${timestamp}@example.com`;
    const parentRegRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Meera",
        lastName: "Patel",
        email: parentEmail,
        password: "Password123!",
        registrationPath: "PARENT",
      }),
    });
    const parentRegData = await parentRegRes.json();
    const parentToken = parentRegData.data.accessToken;

    const parentForbiddenRes = await fetch(`${baseUrl}/participant/onboarding`, {
      method: "GET",
      headers: { Authorization: `Bearer ${parentToken}` },
    });
    assert(parentForbiddenRes.status === 403, "CASE 9: Non-PARTICIPANT role denied access to /participant/onboarding (403 Forbidden)");

    console.log(`\n========================================`);
    console.log(`Test Results: ${testsPassed} Passed, ${testsFailed} Failed`);
    console.log(`========================================\n`);

  } finally {
    server.close();
    await closeDatabasePool();
  }

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
