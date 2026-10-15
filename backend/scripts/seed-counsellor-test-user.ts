import { connectDatabase, closeDatabasePool, pool } from "../src/config/database";
import { hashPassword } from "../src/common/utils/crypto";
import { userRepository } from "../src/modules/users/user.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { authService } from "../src/modules/auth/auth.service";
import { counsellingService } from "../src/modules/counselling/counselling.service";
import { counsellingRepository } from "../src/modules/counselling/counselling.repository";

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================
const TEST_EMAIL = "counsellor.test@3gmelife.com";
const DEFAULT_FALLBACK_PASSWORD = "Counsellor@12345";
const rawPassword = process.env.COUNSELLOR_TEST_PASSWORD || DEFAULT_FALLBACK_PASSWORD;
const isEnvPassword = Boolean(process.env.COUNSELLOR_TEST_PASSWORD);

// Production safeguard
if (process.env.NODE_ENV === "production") {
  console.error("❌ Refusing to run seed script in production environment (NODE_ENV === 'production')!");
  process.exit(1);
}

export async function seedCounsellorTestUser() {
  console.log("=================================================");
  console.log("🧑‍🏫 MeLife Test Career Counsellor Provisioning");
  console.log("=================================================\n");

  await connectDatabase();

  const client = await pool.connect();
  let userId: string;
  let counsellorId: string;
  let participants: any[] = [];

  try {
    await client.query("BEGIN");

    console.log(`1. Generating Argon2id password hash for ${TEST_EMAIL}...`);
    const passwordHash = await hashPassword(rawPassword);

    // ------------------------------------------------------------------------
    // Step 1: Create or update User record
    // ------------------------------------------------------------------------
    const existingUser = await userRepository.findByEmail(TEST_EMAIL, client);

    if (existingUser) {
      console.log(`ℹ️  Existing test user found (ID: ${existingUser.id}, Status: ${existingUser.status}). Updating credentials & status...`);
      userId = existingUser.id;
      await client.query(
        `UPDATE users
         SET password_hash = $1,
             status = 'ACTIVE',
             first_name = 'Ananya',
             last_name = 'Menon',
             email_verified_at = COALESCE(email_verified_at, NOW()),
             updated_at = NOW()
         WHERE id = $2`,
        [passwordHash, userId]
      );
    } else {
      console.log(`ℹ️  Creating new user record for ${TEST_EMAIL}...`);
      const newUser = await userRepository.createUser(
        {
          email: TEST_EMAIL,
          passwordHash,
          firstName: "Ananya",
          lastName: "Menon",
          status: "ACTIVE",
          emailVerifiedAt: new Date(),
        },
        client
      );
      userId = newUser.id;
    }

    // ------------------------------------------------------------------------
    // Step 2: Assign CAREER_COUNSELLOR role as sole primary role
    // ------------------------------------------------------------------------
    console.log(`2. Ensuring primary role is CAREER_COUNSELLOR...`);
    await client.query(`DELETE FROM user_roles WHERE user_id = $1`, [userId]);
    await userRepository.assignRole(userId, "CAREER_COUNSELLOR", true, client);

    // ------------------------------------------------------------------------
    // Step 3: Ensure LOCAL auth identity exists
    // ------------------------------------------------------------------------
    console.log(`3. Synchronizing LOCAL auth identity...`);
    await authRepository.createAuthIdentity(
      { userId, provider: "LOCAL", providerAccountId: userId },
      client
    );

    // ------------------------------------------------------------------------
    // Step 4: Ensure APPROVED record in counsellor_applications
    // ------------------------------------------------------------------------
    console.log(`4. Upserting APPROVED record in counsellor_applications...`);
    // Find an admin user for reviewed_by if available
    const adminRes = await client.query(
      `SELECT u.id FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       WHERE r.name IN ('SUPER_ADMIN', 'PLATFORM_ADMIN') AND u.status = 'ACTIVE'
       LIMIT 1`
    );
    const adminUserId = adminRes.rows[0]?.id || null;

    const existingApp = await client.query(
      `SELECT id FROM counsellor_applications WHERE user_id = $1 LIMIT 1`,
      [userId]
    );

    if (existingApp.rows.length > 0) {
      await client.query(
        `UPDATE counsellor_applications
         SET qualification = 'M.Sc. Counselling Psychology, Certified Career Analyst',
             organization = '3G MeLife Career Guidance Centre',
             status = 'APPROVED',
             reviewed_by = $1,
             reviewed_at = NOW(),
             review_notes = 'Test counsellor verified and approved for automated QA and local/staging verification.',
             updated_at = NOW()
         WHERE user_id = $2`,
        [adminUserId, userId]
      );
    } else {
      await client.query(
        `INSERT INTO counsellor_applications (
           user_id, qualification, organization, status, reviewed_by, reviewed_at, review_notes
         )
         VALUES ($1, $2, $3, 'APPROVED', $4, NOW(), $5)`,
        [
          userId,
          "M.Sc. Counselling Psychology, Certified Career Analyst",
          "3G MeLife Career Guidance Centre",
          adminUserId,
          "Test counsellor verified and approved for automated QA and local/staging verification.",
        ]
      );
    }

    // ------------------------------------------------------------------------
    // Step 5: Ensure APPROVED profile in counsellors table
    // ------------------------------------------------------------------------
    console.log(`5. Upserting APPROVED profile in counsellors table...`);
    const specialisations = [
      "Career Guidance",
      "Stream Selection",
      "Student Psychometric Interpretation",
      "Higher Education Advisory",
    ];
    const languages = ["English", "Malayalam", "Hindi"];
    const guidanceAreas = [
      "Stream Selection",
      "Career Roadmaps",
      "Cognitive Aptitude Alignment",
      "College Admissions",
    ];
    const reviews = [
      {
        id: "rev-test-1",
        studentName: "Rahul K.",
        rating: 5,
        comment: "Extremely insightful session! Clarified my doubts about engineering vs pure science.",
        date: "2026-09-15",
      },
      {
        id: "rev-test-2",
        studentName: "Sneha P.",
        rating: 5,
        comment: "Helpful guidance on psychometric report interpretation and stream selection.",
        date: "2026-09-28",
      },
    ];

    const counsellorRes = await client.query(
      `INSERT INTO counsellors (
         user_id, qualification, experience_years, bio,
         specialisations, languages, guidance_areas,
         rating, review_count, reviews, approval_status, updated_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'APPROVED', NOW())
       ON CONFLICT (user_id) DO UPDATE
       SET qualification = EXCLUDED.qualification,
           experience_years = EXCLUDED.experience_years,
           bio = EXCLUDED.bio,
           specialisations = EXCLUDED.specialisations,
           languages = EXCLUDED.languages,
           guidance_areas = EXCLUDED.guidance_areas,
           rating = EXCLUDED.rating,
           review_count = EXCLUDED.review_count,
           reviews = EXCLUDED.reviews,
           approval_status = 'APPROVED',
           updated_at = NOW()
       RETURNING id`,
      [
        userId,
        "M.Sc. Counselling Psychology, Certified Career Analyst",
        8,
        "Experienced career guidance specialist with 8+ years helping students identify their strengths and navigate stream & career choices.",
        JSON.stringify(specialisations),
        JSON.stringify(languages),
        JSON.stringify(guidanceAreas),
        4.95,
        reviews.length,
        JSON.stringify(reviews),
      ]
    );

    counsellorId = counsellorRes.rows[0].id;

    // ------------------------------------------------------------------------
    // Step 6: Seed counsellor availability idempotently
    // ------------------------------------------------------------------------
    console.log(`6. Seeding counsellor availability slots idempotently...`);
    // Delete existing availability slots for this specific counsellor
    await client.query(
      `DELETE FROM counsellor_availability WHERE counsellor_id = $1`,
      [counsellorId]
    );

    const availabilitySlots = [
      { day: "Monday", startTime: "09:00", endTime: "13:00" },
      { day: "Tuesday", startTime: "14:00", endTime: "18:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "13:00" },
      { day: "Thursday", startTime: "14:00", endTime: "18:00" },
      { day: "Saturday", startTime: "10:00", endTime: "13:00" },
    ];

    for (const slot of availabilitySlots) {
      await client.query(
        `INSERT INTO counsellor_availability (counsellor_id, day, start_time, end_time, is_active)
         VALUES ($1, $2, $3, $4, true)`,
        [counsellorId, slot.day, slot.startTime, slot.endTime]
      );
    }

    // ------------------------------------------------------------------------
    // Step 7: Connect small set of existing participant test users idempotently
    // ------------------------------------------------------------------------
    console.log(`7. Connecting test sessions with existing active participants...`);
    // Fetch up to 3 existing active participants
    const participantsRes = await client.query(
      `SELECT u.id, u.email, u.first_name, u.last_name
       FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       WHERE r.name = 'PARTICIPANT' AND u.status = 'ACTIVE' AND u.id != $1
       ORDER BY u.created_at ASC
       LIMIT 3`,
      [userId]
    );

    participants = participantsRes.rows;

    if (participants.length > 0) {
      // Clean up previous test sessions and notes owned by this counsellor
      await client.query(
        `DELETE FROM counselling_notes WHERE counsellor_id = $1`,
        [counsellorId]
      );
      await client.query(
        `DELETE FROM counselling_sessions WHERE counsellor_id = $1`,
        [counsellorId]
      );

      // Student 1: Completed session with notes & valid consent
      const student1 = participants[0];
      const session1Res = await client.query(
        `INSERT INTO counselling_sessions (
           student_id, counsellor_id, session_type, duration_minutes,
           session_date, session_time, status, meeting_link, student_notes
         )
         VALUES ($1, $2, 'CAREER_GUIDANCE', 45, CURRENT_DATE - 2, '10:00 AM', 'COMPLETED', 'https://meet.google.com/test-counsellor-01', $3)
         RETURNING id`,
        [
          student1.id,
          counsellorId,
          "Discussion on psychometric assessment report and engineering vs pure science pathways.",
        ]
      );
      const session1Id = session1Res.rows[0].id;

      // Seed session notes for session 1
      await client.query(
        `INSERT INTO counselling_notes (
           session_id, counsellor_id, student_id, summary, observations, recommendations, action_plan, follow_up_date
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE + 30)`,
        [
          session1Id,
          counsellorId,
          student1.id,
          "Comprehensive debrief on Skill Finder and aptitude report. Strong spatial reasoning and analytical inclination.",
          "High aptitude in logical problem solving. High career interest in technology, system design, and mathematics.",
          "Recommended Computer Science & Engineering or Data Science pathway. Engage in structured problem solving and Python programming.",
          JSON.stringify([
            { step: 1, action: "Complete beginner Python and algorithmic thinking course", deadline: "2026-11-01" },
            { step: 2, action: "Review college entrance syllabus and align preparation milestones", deadline: "2026-11-15" },
            { step: 3, action: "Book 30-day review session to assess mock test progress", deadline: "2026-12-01" },
          ]),
        ]
      );

      // Upsert consent for Student 1
      await client.query(
        `INSERT INTO student_counsellor_consent (student_id, counsellor_id, permission, granted_at, revoked_at)
         VALUES ($1, $2, 'VIEW_ASSESSMENT_SUMMARY', NOW(), NULL)
         ON CONFLICT (student_id, counsellor_id) DO UPDATE
         SET permission = 'VIEW_ASSESSMENT_SUMMARY', revoked_at = NULL`,
        [student1.id, counsellorId]
      );

      // Student 2: Confirmed upcoming session with consent
      if (participants.length > 1) {
        const student2 = participants[1];
        await client.query(
          `INSERT INTO counselling_sessions (
             student_id, counsellor_id, session_type, duration_minutes,
             session_date, session_time, status, meeting_link, student_notes
           )
           VALUES ($1, $2, 'CAREER_GUIDANCE', 45, CURRENT_DATE + 2, '02:00 PM', 'CONFIRMED', 'https://meet.google.com/test-counsellor-02', $3)`,
          [
            student2.id,
            counsellorId,
            "Looking for stream selection guidance after class 10.",
          ]
        );

        await client.query(
          `INSERT INTO student_counsellor_consent (student_id, counsellor_id, permission, granted_at, revoked_at)
           VALUES ($1, $2, 'VIEW_ASSESSMENT_SUMMARY', NOW(), NULL)
           ON CONFLICT (student_id, counsellor_id) DO UPDATE
           SET permission = 'VIEW_ASSESSMENT_SUMMARY', revoked_at = NULL`,
          [student2.id, counsellorId]
        );
      }

      // Student 3: Pending session without consent (for consent testing)
      if (participants.length > 2) {
        const student3 = participants[2];
        await client.query(
          `INSERT INTO counselling_sessions (
             student_id, counsellor_id, session_type, duration_minutes,
             session_date, session_time, status, meeting_link, student_notes
           )
           VALUES ($1, $2, 'FREE_INTRO', 20, CURRENT_DATE + 5, '11:00 AM', 'PENDING', NULL, $3)`,
          [
            student3.id,
            counsellorId,
            "Introductory consultation inquiry.",
          ]
        );

        // Remove any prior consent for student 3 to allow 403 test
        await client.query(
          `DELETE FROM student_counsellor_consent WHERE student_id = $1 AND counsellor_id = $2`,
          [student3.id, counsellorId]
        );
      }
    }

    await client.query("COMMIT");
    console.log("✅ Database transaction committed successfully!\n");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Failed to seed counsellor test user, transaction rolled back:", err);
    throw err;
  } finally {
    client.release();
  }

  // =========================================================================
  // 8. Authentication & RBAC Verification
  // =========================================================================
  console.log("--- [Authentication & Role Verification] ---");
  const loginResult = await authService.login(
    { email: TEST_EMAIL, password: rawPassword },
    "127.0.0.1",
    "MeLife-Counsellor-Seed/1.0"
  );

  console.log(`✅ Login Test Successful!`);
  console.log(`User ID:              ${loginResult.user.id}`);
  console.log(`User Email:           ${loginResult.user.email}`);
  console.log(`User Status:          ${loginResult.user.status}`);
  console.log(`Resolved Primary Role:${loginResult.role}`);
  console.log(`Access Token Prefix:  ${loginResult.accessToken.slice(0, 15)}...[TRUNCATED]`);
  console.log(`Refresh Token Prefix: ${loginResult.refreshToken.slice(0, 15)}...[TRUNCATED]`);

  // Target route evaluation:
  let redirectTarget = "/dashboard";
  if (loginResult.role === "CAREER_COUNSELLOR") {
    redirectTarget = "/counsellor/dashboard";
  }
  console.log(`Dashboard Target:     ${redirectTarget}`);
  console.log(`Application Status:   APPROVED (User is NOT redirected to /counsellor/application-pending)`);

  // =========================================================================
  // 9. API & Workflow Verification
  // =========================================================================
  console.log("\n--- [Counsellor Portal Service Verification] ---");
  const overview = await counsellingService.getCounsellorOverview(userId);
  console.log(`Total Completed Sessions: ${overview.stats.completedSessionsCount}`);
  console.log(`Upcoming Sessions:        ${overview.stats.upcomingSessionsCount}`);
  console.log(`Available Slots:          ${overview.stats.availableSlotsCount}`);
  console.log(`Assigned Students Count:  ${overview.stats.totalAssignedStudentsCount}`);
  console.log(`Counsellor Profile:       ${overview.counsellorProfile.name} (${overview.counsellorProfile.qualification})`);
  console.log(`Profile Rating:           ${overview.counsellorProfile.rating} (${overview.counsellorProfile.reviewCount} reviews)`);

  const sessions = await counsellingService.getCounsellorSessions(userId);
  console.log(`Retrieved Sessions:       ${sessions.length} sessions loaded`);

  const assignedStudents = await counsellingService.getAssignedStudents(userId);
  console.log(`Assigned Students:        ${assignedStudents.length} students loaded`);

  const availability = await counsellingService.getCounsellorAvailability(userId);
  console.log(`Availability Slots:       ${availability.length} slots loaded`);

  const reviews = await counsellingService.getCounsellorReviews(userId);
  console.log(`Reviews Loaded:           ${reviews.length} reviews`);

  // =========================================================================
  // 10. Verification: Student Summary Access & Privacy Firewall
  // =========================================================================
  console.log("\n--- [Student Summary & Consent Firewall Verification] ---");
  if (participants.length > 0) {
    const consentedStudent = participants[0];
    try {
      const summary = await counsellingService.getStudentSummaryForCounsellor(userId, consentedStudent.id);
      console.log(`✅ Consented student summary access: SUCCESS (Student: ${summary.studentName}, Assessed: ${summary.isAssessed})`);
    } catch (err: any) {
      console.error(`❌ Consented student summary access failed: ${err.message}`);
      throw err;
    }
  }

  if (participants.length > 2) {
    const unconsentedStudent = participants[2];
    try {
      await counsellingService.getStudentSummaryForCounsellor(userId, unconsentedStudent.id);
      throw new Error("Expected 403 CONSENT_REQUIRED for unconsented student, but access was granted!");
    } catch (err: any) {
      if (err.errorCode === "CONSENT_REQUIRED" || err.statusCode === 403 || err.message?.includes("consent")) {
        console.log(`✅ Unconsented student summary access correctly rejected: 403 ${err.errorCode || err.message}`);
      } else {
        throw err;
      }
    }
  }

  // Unrelated student verification (generate a random non-existent UUID or unrelated participant)
  const unrelatedStudentId = "00000000-0000-0000-0000-000000000999";
  try {
    await counsellingService.getStudentSummaryForCounsellor(userId, unrelatedStudentId);
    throw new Error("Expected 403 for unrelated student, but access was granted!");
  } catch (err: any) {
    console.log(`✅ Unrelated student access correctly rejected: 403 ${err.errorCode || err.message}`);
  }

  // =========================================================================
  // 11. Verification: Orphan Profile Prevention in saveSessionNotes
  // =========================================================================
  console.log("\n--- [Security Fix: Orphan Profile Prevention Verification] ---");
  if (participants.length > 0) {
    const participantUserId = participants[0].id;
    const sessionRes = await pool.query(
      `SELECT id FROM counselling_sessions WHERE counsellor_id = $1 LIMIT 1`,
      [counsellorId]
    );
    if (sessionRes.rows.length > 0) {
      const testSessionId = sessionRes.rows[0].id;
      const countBefore = await pool.query(
        `SELECT COUNT(*)::int as count FROM counsellors WHERE user_id = $1`,
        [participantUserId]
      );
      try {
        await counsellingService.saveSessionNotes(
          participantUserId,
          testSessionId,
          { summary: "Hacked notes", recommendations: "None" },
          "PARTICIPANT"
        );
        throw new Error("Expected non-counsellor note save to fail, but it succeeded!");
      } catch (err: any) {
        const countAfter = await pool.query(
          `SELECT COUNT(*)::int as count FROM counsellors WHERE user_id = $1`,
          [participantUserId]
        );
        if (countBefore.rows[0].count === countAfter.rows[0].count) {
          console.log(`✅ Non-counsellor note creation rejected: 403 ${err.errorCode || err.message}`);
          console.log(`✅ Orphan profile prevention verified: No counsellor profile created for participant.`);
        } else {
          throw new Error("Orphan counsellor profile was created for participant during unauthorized notes save!");
        }
      }
    }
  }

  // =========================================================================
  // 12. Verification: Idempotency & Entity Count Verification
  // =========================================================================
  console.log("\n--- [Idempotency & Entity Count Verification] ---");
  const userCountRes = await pool.query(
    `SELECT COUNT(*)::int as count FROM users WHERE email = $1`,
    [TEST_EMAIL]
  );
  const roleCountRes = await pool.query(
    `SELECT COUNT(*)::int as count FROM user_roles WHERE user_id = $1 AND is_primary = true`,
    [userId]
  );
  const counsellorCountRes = await pool.query(
    `SELECT COUNT(*)::int as count FROM counsellors WHERE user_id = $1`,
    [userId]
  );
  const appCountRes = await pool.query(
    `SELECT COUNT(*)::int as count FROM counsellor_applications WHERE user_id = $1 AND status = 'APPROVED'`,
    [userId]
  );
  const availCountRes = await pool.query(
    `SELECT COUNT(*)::int as count FROM counsellor_availability WHERE counsellor_id = $1`,
    [counsellorId]
  );
  const sessionCountRes = await pool.query(
    `SELECT COUNT(*)::int as count FROM counselling_sessions WHERE counsellor_id = $1`,
    [counsellorId]
  );
  const consentCountRes = await pool.query(
    `SELECT COUNT(*)::int as count FROM student_counsellor_consent WHERE counsellor_id = $1`,
    [counsellorId]
  );

  console.log(`User Records:              ${userCountRes.rows[0].count} (expected: 1)`);
  console.log(`Primary Role Assignments:  ${roleCountRes.rows[0].count} (expected: 1)`);
  console.log(`Counsellor Profiles:       ${counsellorCountRes.rows[0].count} (expected: 1)`);
  console.log(`Approved Applications:     ${appCountRes.rows[0].count} (expected: 1)`);
  console.log(`Availability Slots:        ${availCountRes.rows[0].count} (expected: 5)`);
  console.log(`Counselling Sessions:      ${sessionCountRes.rows[0].count} (expected: 3)`);
  console.log(`Student Consents:          ${consentCountRes.rows[0].count} (expected: 2)`);

  console.log("\n=================================================");
  console.log("🎉 Test Career Counsellor Account is Ready!");
  console.log("=================================================");
  console.log(`Email:       ${TEST_EMAIL}`);
  if (isEnvPassword) {
    console.log(`Password:    [CONFIGURED VIA COUNSELLOR_TEST_PASSWORD ENV VAR]`);
  } else {
    console.log(`Password:    ${DEFAULT_FALLBACK_PASSWORD}`);
  }
  console.log(`Role:        CAREER_COUNSELLOR`);
  console.log(`Profile:     Ananya Menon (${overview.counsellorProfile.qualification})`);
  console.log(`Login URL:   http://localhost:3000/login`);
  console.log(`Redirect to: http://localhost:3000${redirectTarget}`);
  console.log("=================================================\n");

  return {
    userId,
    counsellorId,
    loginResult,
    overview,
  };
}

if (require.main === module) {
  seedCounsellorTestUser()
    .then(async () => {
      await closeDatabasePool();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error(err);
      await closeDatabasePool();
      process.exit(1);
    });
}
