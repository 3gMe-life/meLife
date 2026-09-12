import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { createApp } from "../src/app";
import { pool, connectDatabase, closeDatabasePool } from "../src/config/database";
import { authRepository } from "../src/modules/auth/auth.repository";
import { participantRepository } from "../src/modules/participants/participant.repository";
import { assessmentRepository } from "../src/modules/assessments/assessment.repository";
import http from "http";

async function runAssessmentTests() {
  console.log("🧪 Starting 3G MeLife Assessment Eligibility Engine & Catalog Test Suite...\n");

  await connectDatabase();
  await authRepository.seedRolePermissions();
  await participantRepository.initSchema();
  await assessmentRepository.initSchema();
  await assessmentRepository.seedCatalog();

  const app = createApp();
  const server = http.createServer(app);

  const testPort = 5098;
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

    // 1. Verify 7 Official Assessments Catalog in Database
    const catalog = await assessmentRepository.findActiveAssessments();
    const catalogCodes = catalog.map((c) => c.code);
    assert(catalog.length === 7, "Catalog: Exactly 7 active assessment products exist in database");
    assert(
      catalogCodes.includes("SKILL_FINDER") &&
      catalogCodes.includes("STREAM_FINDER") &&
      catalogCodes.includes("ENGINEERING_BRANCH_FINDER") &&
      catalogCodes.includes("COMMERCE_CAREER_FINDER") &&
      catalogCodes.includes("HUMANITIES_CAREER_FINDER") &&
      catalogCodes.includes("RIGHT_CAREER_FINDER") &&
      catalogCodes.includes("AI_JOB_RISK_FINDER"),
      "Catalog: All 7 official machine-readable codes are present"
    );

    // Helper to register participant and get auth token
    async function createParticipant(email: string, firstName: string) {
      const regRes = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName: "Tester",
          email,
          password: "Password123!",
          registrationPath: "STUDENT",
        }),
      });
      const data: any = await regRes.json();
      return { token: data.data.accessToken, userId: data.data.user.id };
    }

    // CASE 1: Unauthenticated request -> 401
    const unauthRes = await fetch(`${baseUrl}/participant/assessments`);
    assert(unauthRes.status === 401, "Security: Unauthenticated request to /participant/assessments returns 401");

    // CASE 2: Non-Participant Role (Parent) -> 403
    const parentRegRes = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Parent",
        lastName: "User",
        email: `parent_${timestamp}@example.com`,
        password: "Password123!",
        registrationPath: "PARENT",
      }),
    });
    const parentData: any = await parentRegRes.json();
    const parentForbiddenRes = await fetch(`${baseUrl}/participant/assessments`, {
      headers: { Authorization: `Bearer ${parentData.data.accessToken}` },
    });
    assert(parentForbiddenRes.status === 403, "Security: Non-PARTICIPANT role access denied (403 Forbidden)");

    // CASE 3: Incomplete Profile Participant (not onboarded yet) -> state: PROFILE_INCOMPLETE
    const p1 = await createParticipant(`uncalibrated_${timestamp}@example.com`, "Rohan");
    const incompleteRes = await fetch(`${baseUrl}/participant/assessments`, {
      headers: { Authorization: `Bearer ${p1.token}` },
    });
    const incompleteData: any = await incompleteRes.json();
    assert(
      incompleteData.data?.state === "PROFILE_INCOMPLETE" && incompleteData.data?.assessments.length === 0,
      "Eligibility: Un-onboarded participant returns state: PROFILE_INCOMPLETE"
    );

    // CASE 4: Middle School Student (Class 7, Age 12) -> Primary: SKILL_FINDER, All 7 available
    const p2 = await createParticipant(`middle_school_${timestamp}@example.com`, "Ananya");
    await fetch(`${baseUrl}/participant/onboarding`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${p2.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateOfBirth: "2014-06-15", // Age 12
        educationStage: "SCHOOL",
        gradeLevel: "7",
        guardianName: "Mother Name",
        guardianPhone: "+91 98765 43210",
      }),
    });
    const msRes = await fetch(`${baseUrl}/participant/assessments`, {
      headers: { Authorization: `Bearer ${p2.token}` },
    });
    const msData: any = await msRes.json();
    const msCodes = msData.data?.assessments.map((a: any) => a.code);
    const msSkill = msData.data?.assessments.find((a: any) => a.code === "SKILL_FINDER");
    assert(
      msData.data?.state === "ELIGIBLE" &&
      msData.data?.primaryAssessmentCode === "SKILL_FINDER" &&
      msSkill?.isRecommended === true &&
      msCodes.length === 7,
      "Eligibility: Middle School (Class 7, Age 12) recommends SKILL_FINDER and provides open access to all 7 modules"
    );

    // CASE 5: Secondary School Student (Class 10, Age 15) -> Primary: STREAM_FINDER, All 7 available
    const p3 = await createParticipant(`sec_school_${timestamp}@example.com`, "Kabir");
    await fetch(`${baseUrl}/participant/onboarding`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${p3.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateOfBirth: "2011-04-10", // Age 15
        educationStage: "SCHOOL",
        gradeLevel: "10",
        guardianName: "Father Name",
        guardianPhone: "+91 98765 43210",
      }),
    });
    const secRes = await fetch(`${baseUrl}/participant/assessments`, {
      headers: { Authorization: `Bearer ${p3.token}` },
    });
    const secData: any = await secRes.json();
    const secCodes = secData.data?.assessments.map((a: any) => a.code);
    const secStream = secData.data?.assessments.find((a: any) => a.code === "STREAM_FINDER");
    assert(
      secData.data?.state === "ELIGIBLE" &&
      secData.data?.primaryAssessmentCode === "STREAM_FINDER" &&
      secStream?.isRecommended === true &&
      secCodes.length === 7,
      "Eligibility: Secondary School (Class 10, Age 15) recommends STREAM_FINDER with all 7 modules unlocked"
    );

    // CASE 6: Higher Secondary Student (Class 12, Age 17) -> All 7 available with specializations accessible
    const p4 = await createParticipant(`higher_sec_${timestamp}@example.com`, "Diya");
    await fetch(`${baseUrl}/participant/onboarding`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${p4.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateOfBirth: "2009-02-14", // Age 17
        educationStage: "SCHOOL",
        gradeLevel: "12",
        guardianName: "Sunita Verma",
        guardianPhone: "+91 98765 43210",
      }),
    });
    const hsRes = await fetch(`${baseUrl}/participant/assessments`, {
      headers: { Authorization: `Bearer ${p4.token}` },
    });
    const hsData: any = await hsRes.json();
    const hsCodes = hsData.data?.assessments.map((a: any) => a.code);
    assert(
      hsData.data?.state === "ELIGIBLE" &&
      hsCodes.includes("ENGINEERING_BRANCH_FINDER") &&
      hsCodes.includes("COMMERCE_CAREER_FINDER") &&
      hsCodes.includes("HUMANITIES_CAREER_FINDER") &&
      hsCodes.length === 7,
      "Eligibility: Higher Secondary (Class 12, Age 17) provides open access to all 7 modules"
    );

    // CASE 7: College / Adult Participant (Age 21) -> Primary: RIGHT_CAREER_FINDER, All 7 available
    const p5 = await createParticipant(`college_adult_${timestamp}@example.com`, "Aditya");
    await fetch(`${baseUrl}/participant/onboarding`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${p5.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateOfBirth: "2005-01-20", // Age 21
        educationStage: "COLLEGE_UNIVERSITY",
        schoolName: "Delhi University",
      }),
    });
    const adultRes = await fetch(`${baseUrl}/participant/assessments`, {
      headers: { Authorization: `Bearer ${p5.token}` },
    });
    const adultData: any = await adultRes.json();
    const adultCodes = adultData.data?.assessments.map((a: any) => a.code);
    const adultRight = adultData.data?.assessments.find((a: any) => a.code === "RIGHT_CAREER_FINDER");
    assert(
      adultData.data?.state === "ELIGIBLE" &&
      adultData.data?.primaryAssessmentCode === "RIGHT_CAREER_FINDER" &&
      adultRight?.isRecommended === true &&
      adultCodes.length === 7,
      "Eligibility: College / Adult participant recommends RIGHT_CAREER_FINDER with open access to all 7 modules"
    );

    // CASE 8: Security Check: No scoring formulas, keys, or private configs leaked
    const sampleItem = adultData.data?.assessments[0];
    assert(
      sampleItem &&
      sampleItem.id &&
      sampleItem.code &&
      sampleItem.name &&
      sampleItem.status &&
      sampleItem.eligibilityReason &&
      (sampleItem as any).scoringKeys === undefined &&
      (sampleItem as any).weights === undefined &&
      (sampleItem as any).correctAnswers === undefined,
      "Security: DTO returns only safe public metadata; scoring keys & formulas are never leaked"
    );

    // CASE 9: Inactive assessment filtering check
    await pool.query(`UPDATE assessments SET status = 'INACTIVE' WHERE code = 'AI_JOB_RISK_FINDER'`);
    const inactiveFilterRes = await fetch(`${baseUrl}/participant/assessments`, {
      headers: { Authorization: `Bearer ${p5.token}` },
    });
    const inactiveFilterData: any = await inactiveFilterRes.json();
    const filteredCodes = inactiveFilterData.data?.assessments.map((a: any) => a.code);
    assert(
      !filteredCodes.includes("AI_JOB_RISK_FINDER"),
      "Eligibility: Inactive assessments are excluded from participant eligible list"
    );
    // Restore back to ACTIVE
    await pool.query(`UPDATE assessments SET status = 'ACTIVE' WHERE code = 'AI_JOB_RISK_FINDER'`);

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

runAssessmentTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
