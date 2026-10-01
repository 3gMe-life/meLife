import { connectDatabase, closeDatabasePool, pool } from "../src/config/database";
import { hashPassword } from "../src/common/utils/crypto";
import { userRepository } from "../src/modules/users/user.repository";
import { authRepository } from "../src/modules/auth/auth.repository";
import { authService } from "../src/modules/auth/auth.service";
import { institutionRepository } from "../src/modules/institution/institution.repository";
import { institutionService } from "../src/modules/institution/institution.service";

const TEST_EMAIL = "institution.test@3gmelife.com";
const TEST_PASSWORD = process.env.INSTITUTION_TEST_PASSWORD || "Institution@12345";
const INSTITUTION_NAME = "St. Xavier's International School";
const INSTITUTION_CODE = "STX-2026";
const INSTITUTION_TYPE = "School";

async function seedInstitutionTestUser() {
  console.log("=================================================");
  console.log("🏫 MeLife Institution Test Account Provisioning");
  console.log("=================================================\n");

  await connectDatabase();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log(`1. Generating Argon2id password hash for ${TEST_EMAIL}...`);
    const passwordHash = await hashPassword(TEST_PASSWORD);

    // 1. Check if user already exists
    const existingUser = await userRepository.findByEmail(TEST_EMAIL, client);
    let userId: string;

    if (existingUser) {
      console.log(`ℹ️  Existing test user found (ID: ${existingUser.id}, Status: ${existingUser.status}). Updating credentials & status...`);
      userId = existingUser.id;
      await client.query(
        `UPDATE users
         SET password_hash = $1,
             status = 'ACTIVE',
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
          firstName: "St. Xavier's",
          lastName: "Administrator",
          status: "ACTIVE",
          emailVerifiedAt: new Date(),
        },
        client
      );
      userId = newUser.id;
    }

    // 2. Ensure canonical INSTITUTION_ADMIN role is assigned as primary
    console.log(`2. Assigning primary canonical role: INSTITUTION_ADMIN...`);
    await client.query(`DELETE FROM user_roles WHERE user_id = $1`, [userId]);
    await userRepository.assignRole(userId, "INSTITUTION_ADMIN", true, client);

    // 3. Ensure LOCAL auth identity exists
    console.log(`3. Synchronizing LOCAL auth identity...`);
    await authRepository.createAuthIdentity(
      { userId, provider: "LOCAL", providerAccountId: userId },
      client
    );

    // 4. Upsert/Provision Institution Profile for this test user
    console.log(`4. Checking / provisioning Institution record: ${INSTITUTION_NAME}...`);
    let institutionId: string;
    const existingInst = await client.query(
      `SELECT id FROM institutions WHERE admin_user_id = $1 OR code = $2 LIMIT 1`,
      [userId, INSTITUTION_CODE]
    );

    if (existingInst.rows.length > 0) {
      institutionId = existingInst.rows[0].id;
      console.log(`ℹ️  Existing institution record found (ID: ${institutionId}). Updating profile...`);
      await client.query(
        `UPDATE institutions
         SET admin_user_id = $1,
             name = $2,
             code = $3,
             type = $4,
             contact_email = $5,
             phone = $6,
             address = $7,
             city = $8,
             state = $9,
             country = $10,
             student_capacity = $11,
             is_active = true,
             updated_at = NOW()
         WHERE id = $12`,
        [
          userId,
          INSTITUTION_NAME,
          INSTITUTION_CODE,
          INSTITUTION_TYPE,
          TEST_EMAIL,
          "+91 22 6123 4567",
          "5, Mahapalika Marg, Dhobi Talao",
          "Mumbai",
          "Maharashtra",
          "India",
          1500,
          institutionId,
        ]
      );
    } else {
      console.log(`ℹ️  Creating institution profile: ${INSTITUTION_NAME}...`);
      const newInstRes = await client.query(
        `INSERT INTO institutions (
           admin_user_id, name, code, type, contact_email, phone,
           address, city, state, country, student_capacity, is_active
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true)
         RETURNING id`,
        [
          userId,
          INSTITUTION_NAME,
          INSTITUTION_CODE,
          INSTITUTION_TYPE,
          TEST_EMAIL,
          "+91 22 6123 4567",
          "5, Mahapalika Marg, Dhobi Talao",
          "Mumbai",
          "Maharashtra",
          "India",
          1500,
        ]
      );
      institutionId = newInstRes.rows[0].id;
    }

    // 5. Ensure default cohorts/classes exist for this institution
    console.log(`5. Setting up classes / cohorts for ${INSTITUTION_NAME}...`);
    // Delete existing classes and assessments for clean idempotency
    await client.query(`DELETE FROM institution_assessments WHERE institution_id = $1`, [institutionId]);
    await client.query(`DELETE FROM institution_classes WHERE institution_id = $1`, [institutionId]);

    const cohorts = [
      { year: "2026-2027", grade: "Grade 9", div: "A", name: "Grade 9-A (Foundation Cohort)", coord: "Mr. Ronald Lewis" },
      { year: "2026-2027", grade: "Grade 10", div: "A", name: "Grade 10-A (Stream Selection Cohort)", coord: "Mrs. Jennifer Fernandes" },
      { year: "2026-2027", grade: "Grade 11", div: "Science", name: "Grade 11-Science (STEM & Engineering)", coord: "Dr. Alistair D'Souza" },
      { year: "2026-2027", grade: "Grade 12", div: "Commerce", name: "Grade 12-Commerce (Business & Finance)", coord: "Mrs. Meena Varma" },
    ];

    let targetClassId: string | null = null;
    for (const c of cohorts) {
      const clsRes = await client.query(
        `INSERT INTO institution_classes (
           institution_id, academic_year, grade_level, division, name, coordinator_name, is_active
         )
         VALUES ($1, $2, $3, $4, $5, $6, true)
         RETURNING id`,
        [institutionId, c.year, c.grade, c.div, c.name, c.coord]
      );
      if (c.grade === "Grade 10") {
        targetClassId = clsRes.rows[0].id;
      }
    }

    // 6. Connect sample enrolled participant students (if any exist in database)
    await client.query(
      `INSERT INTO institution_students (institution_id, class_id, student_id, roll_number, status, joined_at)
       SELECT $1, $2, u.id, 'STX-' || SUBSTRING(u.id::text, 1, 4), 'ENROLLED', NOW()
       FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id AND r.name = 'PARTICIPANT'
       WHERE NOT EXISTS (
         SELECT 1 FROM institution_students ist WHERE ist.institution_id = $1 AND ist.student_id = u.id
       )
       LIMIT 6
       ON CONFLICT (institution_id, student_id) DO NOTHING`,
      [institutionId, targetClassId]
    );

    // Sync student count on classes
    await client.query(
      `UPDATE institution_classes ic
       SET student_count = (
         SELECT COUNT(*)::int FROM institution_students is_stu
         WHERE is_stu.class_id = ic.id AND is_stu.status IN ('ENROLLED', 'ACTIVE')
       )
       WHERE ic.institution_id = $1`,
      [institutionId]
    );

    // 7. Ensure test assessment allocation exists for institution
    console.log(`6. Allocating ENTREPRENEUR_DEVELOPMENT_TEST to institution...`);
    await client.query(
      `INSERT INTO institution_assessments (
         institution_id, class_id, assessment_code, title, status, total_assigned, completed_count
       )
       VALUES ($1, $2, 'ENTREPRENEUR_DEVELOPMENT_TEST', 'Entrepreneur Development Test', 'ACTIVE', 6, 2)`,
      [institutionId, targetClassId]
    );

    await client.query("COMMIT");
    console.log("✅ Account and Institution provisioning committed to database successfully.\n");

    // =========================================================================
    // 8. Verification: Query complete RBAC chain
    // =========================================================================
    console.log("--- [RBAC Chain Verification] ---");
    const rbacQuery = `
      SELECT
        u.id as user_id,
        u.email,
        u.first_name,
        u.last_name,
        u.status,
        r.id as role_id,
        r.name as role_name,
        ur.is_primary,
        p.name as permission_name,
        p.category as permission_category
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE u.id = $1
    `;
    const rbacRes = await pool.query(rbacQuery, [userId]);
    const roleId = rbacRes.rows[0]?.role_id;
    const permissions = rbacRes.rows.map((r) => r.permission_name);

    console.log(`User ID:              ${userId}`);
    console.log(`Institution ID:       ${institutionId}`);
    console.log(`Role ID:              ${roleId}`);
    console.log(`Email:                ${rbacRes.rows[0]?.email}`);
    console.log(`Account Status:       ${rbacRes.rows[0]?.status}`);
    console.log(`Primary Role:         ${rbacRes.rows[0]?.role_name}`);
    console.log(`Inherited Permissions: (${permissions.length}) ${permissions.join(", ")}`);

    // =========================================================================
    // 9. Verification: Test authenticating through normal authService.login()
    // =========================================================================
    console.log("\n--- [Authentication & Session Verification] ---");
    const loginResult = await authService.login(
      { email: TEST_EMAIL, password: TEST_PASSWORD },
      "127.0.0.1",
      "MeLife-Seed-Script/1.0"
    );

    console.log(`✅ Login Test Successful!`);
    console.log(`Resolved Role:        ${loginResult.role}`);
    console.log(`Access Token:         ${loginResult.accessToken.slice(0, 30)}...`);
    console.log(`Refresh Token:        ${loginResult.refreshToken.slice(0, 20)}...`);
    console.log(`Dashboard Target:     /institution/dashboard`);

    // =========================================================================
    // 10. Verification: Test institution dashboard resolution & tenant data isolation
    // =========================================================================
    console.log("\n--- [Institution Dashboard & Tenant Isolation Verification] ---");
    const instProfile = await institutionService.getProfile(userId);
    const overview = await institutionService.getOverview(userId);
    const classes = await institutionService.getClasses(userId);

    console.log(`Institution Name:     ${instProfile.name}`);
    console.log(`Institution Code:     ${instProfile.code}`);
    console.log(`Institution Type:     ${instProfile.type}`);
    console.log(`Total Students:       ${overview.stats.totalStudents}`);
    console.log(`Active Students:      ${overview.stats.activeStudents}`);
    console.log(`Total Classes:        ${overview.stats.totalClasses}`);
    console.log(`Classes Loaded:       ${classes.map(c => c.name).join(", ")}`);

    // =========================================================================
    // 11. Verification: Assessment Access
    // =========================================================================
    console.log("\n--- [Assessment Access Verification] ---");
    const assessRes = await pool.query(
      `SELECT assessment_code, title, status, total_assigned, completed_count 
       FROM institution_assessments 
       WHERE institution_id = $1`,
      [instProfile.id]
    );
    console.log(`Allocated Assessments: ${assessRes.rows.map(a => `${a.assessment_code} (${a.title}) - Status: ${a.status}`).join("; ") || "None"}`);

    console.log("\n=================================================");
    console.log("🎉 Test Institution Account is Ready for Local/Staging!");
    console.log("=================================================");
    console.log(`Email:       ${TEST_EMAIL}`);
    console.log(`Password:    ${TEST_PASSWORD}`);
    console.log(`Role:        INSTITUTION_ADMIN`);
    console.log(`Institution: ${instProfile.name}`);
    console.log(`Login URL:   http://localhost:3000/login`);
    console.log(`Redirect to: http://localhost:3000/institution/dashboard`);
    console.log("=================================================\n");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Failed to seed institution user:", error);
    process.exit(1);
  } finally {
    client.release();
    await closeDatabasePool();
  }
}

seedInstitutionTestUser();
