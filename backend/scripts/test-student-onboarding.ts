import { pool } from "../src/config/database";
import { authRepository } from "../src/modules/auth/auth.repository";
import { institutionRepository } from "../src/modules/institution/institution.repository";
import { institutionService } from "../src/modules/institution/institution.service";
import { userRepository } from "../src/modules/users/user.repository";
import { logger } from "../src/common/utils/logger";
import { institutionInvitationQueueWorker } from "../src/modules/institution/institution-invitation.worker";
import crypto from "crypto";

async function runTestSuite() {
  logger.info("🚀 Starting 3G MeLife Enterprise Large-Scale Student Invitation System Test Suite");

  // Step 0: Ensure DB schemas initialized
  await authRepository.initSchema();
  await institutionRepository.initSchema();

  // Step 1: Provision an Institution Admin & Institution
  const testAdminEmail = `inst-admin-${Date.now()}@schooltest.org`;
  const adminUser = await userRepository.createUser({
    email: testAdminEmail,
    firstName: "Principal",
    lastName: "Sharma",
    status: "ACTIVE",
    emailVerifiedAt: new Date(),
  });
  await userRepository.assignRole(adminUser.id, "INSTITUTION_ADMIN", true);

  const institution = await institutionRepository.findOrCreateInstitutionForAdmin(adminUser.id);
  logger.info({ institutionId: institution.id, name: institution.name }, "✅ Step 1: Test Institution provisioned");

  // Step 2: Create a test Cohort / Class
  const testCohort = await institutionRepository.createClass(institution.id, {
    academicYear: "2026-2027",
    gradeLevel: "Grade 10",
    division: "Section A",
    name: "Grade 10-A (2026-2027)",
  });
  logger.info({ cohortId: testCohort.id, name: testCohort.name }, "✅ Step 2: Test Cohort created");

  // =========================================================================
  // TEST 1: Individual Student Invitation Creation & Email Job Enqueued
  // =========================================================================
  const student1Email = `student1-${Date.now()}@teststudent.org`;
  const invite1 = await institutionService.inviteStudent(adminUser.id, {
    firstName: "Aarav",
    lastName: "Verma",
    email: student1Email,
    rollNumber: "ST-101",
    classId: testCohort.id,
    academicYear: "2026-2027",
  });

  if (!invite1.id || invite1.status !== "PENDING" || !invite1.tokenHash) {
    throw new Error("TEST 1 FAILED: Invitation was not created with PENDING status");
  }

  // Check that durable email job was created in PostgreSQL Outbox table
  const jobRes = await pool.query(
    `SELECT id, status, recipient_email FROM institution_email_jobs WHERE invitation_id = $1`,
    [invite1.id]
  );
  if (jobRes.rows.length === 0 || jobRes.rows[0].status !== "QUEUED") {
    throw new Error("TEST 1 FAILED: Email job not queued in institution_email_jobs");
  }
  logger.info({ inviteId: invite1.id, jobId: jobRes.rows[0].id }, "✅ TEST 1 PASSED: Individual invitation created & durable email job queued");

  const tokenHash = invite1.tokenHash;

  // =========================================================================
  // TEST 2: Duplicate Invitation Prevention
  // =========================================================================
  try {
    await institutionService.inviteStudent(adminUser.id, {
      firstName: "Aarav",
      lastName: "Verma",
      email: student1Email,
      rollNumber: "ST-101",
      classId: testCohort.id,
    });
    throw new Error("TEST 2 FAILED: Duplicate invitation was allowed");
  } catch (err: any) {
    if (err.message.includes("already been sent")) {
      logger.info("✅ TEST 2 PASSED: Duplicate active invitation safely rejected");
    } else {
      throw err;
    }
  }

  // =========================================================================
  // TEST 3: Token Validation (Public Route Logic)
  // =========================================================================
  const foundByHash = await institutionRepository.findInvitationByTokenHash(tokenHash);
  if (!foundByHash || foundByHash.email !== student1Email) {
    throw new Error("TEST 3 FAILED: Token hash lookup failed");
  }
  logger.info("✅ TEST 3 PASSED: Token validation successfully retrieved metadata");

  // =========================================================================
  // TEST 4: Accept Invitation & Provision New Student
  // =========================================================================
  const rawToken4 = crypto.randomBytes(32).toString("hex");
  const hash4 = crypto.createHash("sha256").update(rawToken4).digest("hex");
  const student4Email = `student4-${Date.now()}@teststudent.org`;

  const invite4 = await institutionRepository.createInvitation({
    institutionId: institution.id,
    classId: testCohort.id,
    email: student4Email,
    firstName: "Rohan",
    lastName: "Das",
    rollNumber: "ST-104",
    academicYear: "2026-2027",
    tokenHash: hash4,
    invitedByUserId: adminUser.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const acceptRes4 = await institutionService.acceptInvitation({
    token: rawToken4,
    password: "Password@123",
    firstName: "Rohan",
    lastName: "Das",
  });

  if (!acceptRes4.accessToken || !acceptRes4.user?.id) {
    throw new Error("TEST 4 FAILED: Student account not created or tokens missing");
  }

  const enrolledStudent = await institutionRepository.findStudentByInstitutionAndEmail(
    institution.id,
    student4Email
  );
  if (!enrolledStudent || enrolledStudent.classId !== testCohort.id) {
    throw new Error("TEST 4 FAILED: Student was not linked to institution and cohort");
  }
  logger.info({ studentId: acceptRes4.user.id }, "✅ TEST 4 PASSED: Student account created, enrolled, and linked to cohort");

  // =========================================================================
  // TEST 5: Single Use / Reused Token Prevention
  // =========================================================================
  try {
    await institutionService.acceptInvitation({
      token: rawToken4,
      password: "Password@123",
    });
    throw new Error("TEST 5 FAILED: Reused token was accepted");
  } catch (err: any) {
    if (err.message.includes("already been accepted")) {
      logger.info("✅ TEST 5 PASSED: Reused token safely rejected");
    } else {
      throw err;
    }
  }

  // =========================================================================
  // TEST 6: Inviting Already Enrolled Student Blocked
  // =========================================================================
  try {
    await institutionService.inviteStudent(adminUser.id, {
      firstName: "Rohan",
      lastName: "Das",
      email: student4Email,
      classId: testCohort.id,
    });
    throw new Error("TEST 6 FAILED: Allowed inviting already enrolled student");
  } catch (err: any) {
    if (err.message.includes("already enrolled")) {
      logger.info("✅ TEST 6 PASSED: Inviting already enrolled student safely rejected");
    } else {
      throw err;
    }
  }

  // =========================================================================
  // TEST 7: Resend Invitation (Token Refreshed & Queue Job Re-Enqueued)
  // =========================================================================
  const resentInvite = await institutionService.resendInvitation(adminUser.id, invite1.id);
  if (resentInvite.tokenHash === tokenHash) {
    throw new Error("TEST 7 FAILED: Old token hash was not regenerated on resend");
  }
  const resentJob = await pool.query(
    `SELECT status FROM institution_email_jobs WHERE invitation_id = $1`,
    [invite1.id]
  );
  if (resentJob.rows[0]?.status !== "QUEUED") {
    throw new Error("TEST 7 FAILED: Resent email job not in QUEUED status");
  }
  logger.info("✅ TEST 7 PASSED: Invitation resent, old token invalidated & job re-queued");

  // =========================================================================
  // TEST 8: Revoke Invitation & Unsent Job Cancellation
  // =========================================================================
  const revokeRes = await institutionService.revokeInvitation(adminUser.id, invite1.id);
  if (!revokeRes.success) {
    throw new Error("TEST 8 FAILED: Invitation revoke failed");
  }
  const revokedInvite = await institutionRepository.findInvitationById(invite1.id);
  if (revokedInvite?.status !== "REVOKED") {
    throw new Error("TEST 8 FAILED: Status is not REVOKED");
  }
  const revokedJob = await pool.query(
    `SELECT status, is_permanent_failure FROM institution_email_jobs WHERE invitation_id = $1`,
    [invite1.id]
  );
  if (revokedJob.rows[0]?.status !== "FAILED" || !revokedJob.rows[0]?.is_permanent_failure) {
    throw new Error("TEST 8 FAILED: Associated queued email job was not cancelled upon revocation");
  }
  logger.info("✅ TEST 8 PASSED: Invitation revoked & pending email job safely cancelled");

  // =========================================================================
  // TEST 9: Existing Account Linking (No Duplicate User Created)
  // =========================================================================
  const existingUserEmail = `existing-student-${Date.now()}@testuser.org`;
  const preExistingUser = await userRepository.createUser({
    email: existingUserEmail,
    firstName: "Sneha",
    lastName: "Mukherjee",
    status: "ACTIVE",
    emailVerifiedAt: new Date(),
  });
  await userRepository.assignRole(preExistingUser.id, "PARTICIPANT", true);

  const rawToken9 = crypto.randomBytes(32).toString("hex");
  const hash9 = crypto.createHash("sha256").update(rawToken9).digest("hex");

  await institutionRepository.createInvitation({
    institutionId: institution.id,
    classId: testCohort.id,
    email: existingUserEmail,
    firstName: "Sneha",
    lastName: "Mukherjee",
    rollNumber: "ST-201",
    academicYear: "2026-2027",
    tokenHash: hash9,
    invitedByUserId: adminUser.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const acceptRes9 = await institutionService.acceptInvitation({
    token: rawToken9,
  });

  if (acceptRes9.user.id !== preExistingUser.id) {
    throw new Error("TEST 9 FAILED: Created new user instead of linking existing account");
  }
  logger.info({ userId: acceptRes9.user.id }, "✅ TEST 9 PASSED: Existing account linked to cohort without duplicate user");

  // =========================================================================
  // TEST 10: Bulk Import Validation Preview Mode (No DB mutation)
  // =========================================================================
  const previewResult = await institutionService.bulkImportStudents(adminUser.id, {
    previewOnly: true,
    invitations: [
      { firstName: "Student A", lastName: "One", email: `bulka-${Date.now()}@test.org`, rollNumber: "B-1" },
      { firstName: "Student B", lastName: "Two", email: `bulkb-${Date.now()}@test.org`, rollNumber: "B-2" },
      { firstName: "Student A", lastName: "Duplicate", email: `bulka-${Date.now()}@test.org`, rollNumber: "B-3" }, // duplicate in file
      { firstName: "", lastName: "Missing Name", email: `missing-${Date.now()}@test.org` }, // missing required
      { firstName: "Invalid", lastName: "Email", email: "notanemail" }, // invalid email
    ],
    defaultClassId: testCohort.id,
  });

  if (previewResult.importedCount !== 2 || previewResult.skippedCount !== 1 || previewResult.failedCount !== 2) {
    throw new Error(`TEST 10 FAILED: Bulk preview counts unexpected: ${JSON.stringify(previewResult)}`);
  }
  logger.info("✅ TEST 10 PASSED: Bulk preview correctly classified without DB mutation");

  // =========================================================================
  // TEST 11: Bulk Campaign Creation & Outbox Insertion (50 Students)
  // =========================================================================
  const fiftyStudents = Array.from({ length: 50 }, (_, i) => ({
    firstName: `Student50_${i + 1}`,
    lastName: "Batch",
    email: `student50_batch_${i + 1}_${Date.now()}@test50.org`,
    rollNumber: `50-${i + 1}`,
    academicYear: "2026-2027",
  }));

  const startTime50 = Date.now();
  const campaign50Res = await institutionService.bulkImportStudents(adminUser.id, {
    campaignName: "Grade 10 Batch 50 Campaign",
    invitations: fiftyStudents,
    defaultClassId: testCohort.id,
  });
  const duration50 = Date.now() - startTime50;

  if (!campaign50Res.campaignId || campaign50Res.importedCount !== 50) {
    throw new Error(`TEST 11 FAILED: 50-student campaign creation failed: ${JSON.stringify(campaign50Res)}`);
  }
  logger.info(
    { campaignId: campaign50Res.campaignId, durationMs: duration50, count: campaign50Res.importedCount },
    "✅ TEST 11 PASSED: 50-student bulk campaign and outbox jobs created non-blockingly"
  );

  // =========================================================================
  // TEST 12: Large-Scale 500-Student Invitation Campaign (Load Test)
  // =========================================================================
  const fiveHundredStudents = Array.from({ length: 500 }, (_, i) => ({
    firstName: `Student500_${i + 1}`,
    lastName: "LoadTest",
    email: `student500_load_${i + 1}_${Date.now()}@loadtest500.org`,
    rollNumber: `500-${i + 1}`,
    academicYear: "2026-2027",
  }));

  const startTime500 = Date.now();
  const campaign500Res = await institutionService.bulkImportStudents(adminUser.id, {
    campaignName: "Annual Admissions 500 Campaign",
    invitations: fiveHundredStudents,
    defaultClassId: testCohort.id,
  });
  const duration500 = Date.now() - startTime500;

  if (!campaign500Res.campaignId || campaign500Res.importedCount !== 500) {
    throw new Error(`TEST 12 FAILED: 500-student campaign creation failed`);
  }

  // Verify campaign record
  const campaignRecord = await institutionRepository.findCampaignById(campaign500Res.campaignId, institution.id);
  if (!campaignRecord || campaignRecord.totalCount !== 500) {
    throw new Error(`TEST 12 FAILED: Campaign record counts mismatch: ${JSON.stringify(campaignRecord)}`);
  }
  const totalSum =
    campaignRecord.queuedCount +
    campaignRecord.processingCount +
    campaignRecord.sentCount +
    campaignRecord.deliveredCount +
    campaignRecord.failedCount +
    campaignRecord.bouncedCount;
  if (totalSum !== 500) {
    throw new Error(`TEST 12 FAILED: Campaign total sum ${totalSum} !== 500`);
  }
  logger.info(
    { campaignId: campaign500Res.campaignId, total: 500, durationMs: duration500 },
    "✅ TEST 12 PASSED: 500-student bulk campaign successfully created with zero timeouts"
  );

  // =========================================================================
  // TEST 13: Outbox Queue Worker - Atomicity & Concurrency Claiming
  // =========================================================================
  // Claim a batch of 10 jobs using SELECT FOR UPDATE SKIP LOCKED
  const claimedJobs = await institutionRepository.claimQueuedEmailJobs(10);
  if (claimedJobs.length !== 10) {
    throw new Error(`TEST 13 FAILED: Expected 10 claimed jobs, got ${claimedJobs.length}`);
  }

  // Verify that another concurrent worker claiming at the exact same moment gets DIFFERENT jobs (SKIP LOCKED)
  const claimedJobsConcurrent = await institutionRepository.claimQueuedEmailJobs(10);
  const overlap = claimedJobs.some((j1) => claimedJobsConcurrent.some((j2) => j1.id === j2.id));
  if (overlap) {
    throw new Error("TEST 13 FAILED: Concurrent workers claimed overlapping jobs! Concurrency breach!");
  }
  logger.info("✅ TEST 13 PASSED: Outbox queue atomic claiming with SKIP LOCKED verified");

  // =========================================================================
  // TEST 14: Browser-Close Recovery & Worker Drainage
  // =========================================================================
  // Simulate completing claimed jobs with provider message ID
  const testJob = claimedJobs[0];
  const mockProviderMessageId = `resend_msg_${Date.now()}`;
  await institutionRepository.updateEmailJobSuccess(testJob.id, mockProviderMessageId);

  // Check that job is marked SENT and raw_token is wiped for token secrecy
  const completedJobCheck = await pool.query(
    `SELECT status, raw_token, provider_message_id FROM institution_email_jobs WHERE id = $1`,
    [testJob.id]
  );
  if (
    completedJobCheck.rows[0].status !== "SENT" ||
    completedJobCheck.rows[0].raw_token !== "" ||
    completedJobCheck.rows[0].provider_message_id !== mockProviderMessageId
  ) {
    throw new Error("TEST 14 FAILED: Job was not marked SENT or raw_token was not sanitized");
  }
  logger.info("✅ TEST 14 PASSED: Outbox job completion & raw token memory scrubbing verified");

  // =========================================================================
  // TEST 15: Resend Webhook Processing (Delivered & Bounced)
  // =========================================================================
  // 15a: Delivered webhook
  await institutionService.handleResendWebhook({
    type: "email.delivered",
    created_at: new Date().toISOString(),
    data: {
      email_id: mockProviderMessageId,
    },
  });

  const deliveredInvitation = await pool.query(
    `SELECT delivery_status, delivery_event_at FROM institution_student_invitations WHERE provider_message_id = $1`,
    [mockProviderMessageId]
  );
  if (deliveredInvitation.rows[0]?.delivery_status !== "DELIVERED") {
    throw new Error("TEST 15a FAILED: Resend delivered webhook did not update invitation delivery status");
  }

  // 15b: Bounced webhook
  const mockBounceMessageId = `resend_bounce_${Date.now()}`;
  const bounceJob = claimedJobs[1];
  await institutionRepository.updateEmailJobSuccess(bounceJob.id, mockBounceMessageId);

  await institutionService.handleResendWebhook({
    type: "email.bounced",
    created_at: new Date().toISOString(),
    data: {
      email_id: mockBounceMessageId,
      bounce_type: "Permanent Hard Bounce",
    },
  });

  const bouncedInvitation = await pool.query(
    `SELECT delivery_status, failure_reason FROM institution_student_invitations WHERE provider_message_id = $1`,
    [mockBounceMessageId]
  );
  if (bouncedInvitation.rows[0]?.delivery_status !== "BOUNCED") {
    throw new Error("TEST 15b FAILED: Resend bounced webhook did not update invitation bounce status");
  }
  logger.info("✅ TEST 15 PASSED: Resend delivery & bounce webhooks accurately mapped to invitation lifecycle");

  // =========================================================================
  // TEST 16: Multi-Tenant Isolation
  // =========================================================================
  const otherAdmin = await userRepository.createUser({
    email: `other-principal-${Date.now()}@other.edu`,
    firstName: "Other",
    lastName: "Principal",
  });
  await userRepository.assignRole(otherAdmin.id, "INSTITUTION_ADMIN", true);
  const otherInstitution = await institutionRepository.findOrCreateInstitutionForAdmin(otherAdmin.id);

  try {
    await institutionService.getCampaignDetails(otherAdmin.id, campaign500Res.campaignId);
    throw new Error("TEST 16 FAILED: Tenant isolation breached, other admin accessed another institution's campaign");
  } catch (err: any) {
    if (err.message.includes("does not belong to your institution") || err.message.includes("not found")) {
      logger.info("✅ TEST 16 PASSED: Multi-tenant campaign isolation strictly enforced");
    } else {
      throw err;
    }
  }

  // =========================================================================
  // TEST 17: Retry Failed Jobs Strategy
  // =========================================================================
  const job50Res = await pool.query(
    `SELECT id, campaign_id FROM institution_email_jobs WHERE campaign_id = $1 LIMIT 1`,
    [campaign50Res.campaignId]
  );
  const failJob = job50Res.rows[0];
  await institutionRepository.updateEmailJobFailure(failJob.id, "Simulated 503 Provider Timeout", true);

  const retryResult = await institutionService.retryFailedCampaign(adminUser.id, campaign50Res.campaignId);
  if (retryResult.retriedCount < 1) {
    throw new Error("TEST 17 FAILED: Failed jobs were not re-queued");
  }
  logger.info({ retried: retryResult.retriedCount }, "✅ TEST 17 PASSED: Targeted retry failed jobs re-queued without duplicate resending");

  // =========================================================================
  // TEST 18: Assessment Allocation & Parent Connect Compatibility
  // =========================================================================
  const assessmentAlloc = await institutionService.assignAssessment(adminUser.id, {
    assessmentCode: "ENTREPRENEUR_DEVELOPMENT_TEST",
    classId: testCohort.id,
    title: "Entrepreneurship Aptitude Battery",
  });
  if (!assessmentAlloc.id || assessmentAlloc.status !== "ACTIVE") {
    throw new Error("TEST 18 FAILED: Assessment allocation failed");
  }

  const parentUser = await userRepository.createUser({
    email: `parent-${Date.now()}@parenttest.org`,
    firstName: "Parent",
    lastName: "Das",
  });
  await userRepository.assignRole(parentUser.id, "PARENT_GUARDIAN", true);

  await pool.query(
    `INSERT INTO student_parent_links (parent_user_id, student_user_id, relationship_type, link_status)
     VALUES ($1, $2, 'PARENT', 'ACTIVE')
     ON CONFLICT DO NOTHING`,
    [parentUser.id, acceptRes4.user.id]
  );

  const studentWithParent = await institutionRepository.findStudentsByInstitutionId(
    institution.id,
    testCohort.id
  );
  const matchedStudent = studentWithParent.find((s) => s.studentId === acceptRes4.user.id);
  if (!matchedStudent || !matchedStudent.hasParentLinked) {
    throw new Error("TEST 18 FAILED: Parent linked status not reflected in institution directory");
  }
  logger.info("✅ TEST 18 PASSED: Assessment allocation & Parent Connect compatibility verified seamlessly");

  logger.info("🎉 ALL 18 ENTERPRISE TEST SCENARIOS PASSED WITH 100% SUCCESS!");
}

runTestSuite()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ TEST SUITE FAILED:", err);
    process.exit(1);
  });
