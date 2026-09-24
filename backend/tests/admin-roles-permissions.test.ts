import { connectDatabase, closeDatabasePool, pool } from "../src/config/database";
import { authRepository } from "../src/modules/auth/auth.repository";
import { createApp } from "../src/app";
import { hashPassword } from "../src/common/utils/crypto";
import http from "http";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code?: string;
    message?: string;
  };
}

async function runAdminRolesPermissionsTestSuite() {
  console.log("🧪 Starting Admin Roles & Permissions RBAC Test Suite...\n");

  await connectDatabase();
  await authRepository.initSchema();
  await authRepository.seedRolePermissions();

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
    // SETUP: Seed Admin and Participant
    // =========================================================================
    console.log("--- [SETUP: Creating Test Users] ---");
    const superAdminEmail = `test_roles_superadmin_${timestamp}@3gmelife.com`;
    const superAdminRes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Role', 'Inspector', 'ACTIVE', NOW())
       RETURNING id`,
      [superAdminEmail, defaultPasswordHash]
    );
    const superAdminId = superAdminRes.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'SUPER_ADMIN'`,
      [superAdminId]
    );

    const participantEmail = `test_roles_participant_${timestamp}@3gmelife.com`;
    const participantRes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, status, email_verified_at)
       VALUES ($1, $2, 'Test', 'Student', 'ACTIVE', NOW())
       RETURNING id`,
      [participantEmail, defaultPasswordHash]
    );
    const participantId = participantRes.rows[0].id;
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id, is_primary)
       SELECT $1, id, true FROM roles WHERE name = 'PARTICIPANT'`,
      [participantId]
    );

    // Login Super Admin
    const superAdminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: superAdminEmail, password: "Password123!" }),
    });
    const superAdminLoginData = (await superAdminLoginRes.json()) as ApiResponse<{ accessToken: string }>;
    const superAdminToken = superAdminLoginData.data?.accessToken;

    // Login Participant
    const participantLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: participantEmail, password: "Password123!" }),
    });
    const participantLoginData = (await participantLoginRes.json()) as ApiResponse<{ accessToken: string }>;
    const participantToken = participantLoginData.data?.accessToken;

    assert(Boolean(superAdminToken), "Super Admin login generates valid accessToken");
    assert(Boolean(participantToken), "Participant login generates valid accessToken");

    // =========================================================================
    // TEST 1: Security & RBAC Guard on /admin/roles and /admin/permissions
    // =========================================================================
    console.log("\n--- [TEST 1: Security & Authorization Access Controls] ---");

    // 1.1 Unauthenticated Request -> 401
    const unauthRolesRes = await fetch(`${baseUrl}/admin/roles`);
    assert(unauthRolesRes.status === 401, "Unauthenticated request to /admin/roles returns 401 Unauthorized");

    const unauthPermsRes = await fetch(`${baseUrl}/admin/permissions`);
    assert(unauthPermsRes.status === 401, "Unauthenticated request to /admin/permissions returns 401 Unauthorized");

    // 1.2 Non-Admin (Participant) -> 403
    const participantRolesRes = await fetch(`${baseUrl}/admin/roles`, {
      headers: { Authorization: `Bearer ${participantToken}` },
    });
    assert(participantRolesRes.status === 403, "Non-admin (PARTICIPANT) access to /admin/roles returns 403 Forbidden");

    const participantPermsRes = await fetch(`${baseUrl}/admin/permissions`, {
      headers: { Authorization: `Bearer ${participantToken}` },
    });
    assert(participantPermsRes.status === 403, "Non-admin (PARTICIPANT) access to /admin/permissions returns 403 Forbidden");

    // =========================================================================
    // TEST 2: GET /api/v1/admin/roles (Canonical Database Roles Listing)
    // =========================================================================
    console.log("\n--- [TEST 2: Roles Catalog Retrieval] ---");

    const rolesRes = await fetch(`${baseUrl}/admin/roles`, {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    const rolesData = (await rolesRes.json()) as ApiResponse<{
      roles: Array<{
        id: string;
        name: string;
        description: string | null;
        userCount: number;
        permissionCount: number;
        isProtected: boolean;
        createdAt: string;
      }>;
      totalRoles: number;
      totalPermissions: number;
      totalAssignedUsers: number;
    }>;

    assert(rolesRes.status === 200 && rolesData.success, "Super Admin can retrieve /admin/roles with 200 OK");
    const roles = rolesData.data?.roles || [];
    assert(roles.length >= 7, `Retrieved ${roles.length} roles from the database (expected at least 7)`);

    // Verify all canonical roles exist in the database
    const expectedRoles = [
      "SUPER_ADMIN",
      "PLATFORM_ADMIN",
      "COMPANY_ADMIN",
      "INSTITUTION_ADMIN",
      "CAREER_COUNSELLOR",
      "PARENT_GUARDIAN",
      "PARTICIPANT",
    ];
    for (const expectedRole of expectedRoles) {
      const found = roles.find((r) => r.name === expectedRole);
      assert(
        Boolean(found),
        `Database contains canonical role: ${expectedRole} (Users: ${found?.userCount}, Perms: ${found?.permissionCount})`
      );
    }

    // Verify fields for each role
    const allHaveRequiredFields = roles.every(
      (r) => r.id && r.name && r.userCount !== undefined && r.permissionCount !== undefined && r.createdAt
    );
    assert(allHaveRequiredFields, "All roles contain id, name, description, userCount, permissionCount, and createdAt");

    // =========================================================================
    // TEST 3: GET /api/v1/admin/permissions (Permissions Master Catalog)
    // =========================================================================
    console.log("\n--- [TEST 3: Permissions Catalog Master List] ---");

    const permsRes = await fetch(`${baseUrl}/admin/permissions`, {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    const permsData = (await permsRes.json()) as ApiResponse<
      Array<{
        id: string;
        name: string;
        description: string | null;
        category: string | null;
        rolesCount: number;
        createdAt: string;
      }>
    >;

    assert(permsRes.status === 200 && permsData.success, "Super Admin can retrieve /admin/permissions with 200 OK");
    const permissions = permsData.data || [];
    assert(permissions.length >= 6, `Retrieved ${permissions.length} master permissions from database`);

    const expectedPermissions = [
      "admin.all",
      "assessment.take",
      "institution.manage",
      "result.read_own",
      "student.manage",
      "student.read",
    ];
    for (const expectedPerm of expectedPermissions) {
      const found = permissions.find((p) => p.name === expectedPerm);
      assert(Boolean(found), `Database contains master permission: ${expectedPerm} (Domain: ${found?.category})`);
    }

    // =========================================================================
    // TEST 4: GET /api/v1/admin/roles/:id (Role Details: Info, Perms, Users)
    // =========================================================================
    console.log("\n--- [TEST 4: Role Detail Inspection (Info, Perms, Users)] ---");

    // 4.1 Inspect CAREER_COUNSELLOR role
    const counsellorDetailRes = await fetch(`${baseUrl}/admin/roles/CAREER_COUNSELLOR`, {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    const counsellorDetailData = (await counsellorDetailRes.json()) as ApiResponse<{
      id: string;
      name: string;
      description: string;
      userCount: number;
      permissionCount: number;
      isProtected: boolean;
      permissions: Array<{ id: string; name: string; category: string }>;
      users: Array<{ id: string; email: string; fullName: string; status: string; isPrimary: boolean }>;
    }>;

    assert(
      counsellorDetailRes.status === 200 && counsellorDetailData.data?.name === "CAREER_COUNSELLOR",
      "GET /admin/roles/CAREER_COUNSELLOR returns role details"
    );
    assert(
      Array.isArray(counsellorDetailData.data?.permissions),
      "Role details include assigned permissions list"
    );
    assert(
      Array.isArray(counsellorDetailData.data?.users),
      "Role details include assigned users list"
    );

    // 4.2 Security check: Ensure password_hash or secret tokens are NEVER in assigned users
    const exposedSecretsInRoleUsers = (counsellorDetailData.data?.users || []).some(
      (u: any) => u.password_hash !== undefined || u.password !== undefined || u.refresh_token !== undefined
    );
    assert(!exposedSecretsInRoleUsers, "Security Check: No password hashes or secrets in role assigned users");

    // 4.3 Inspect SUPER_ADMIN role
    const superAdminDetailRes = await fetch(`${baseUrl}/admin/roles/SUPER_ADMIN`, {
      headers: { Authorization: `Bearer ${superAdminToken}` },
    });
    const superAdminDetailData = (await superAdminDetailRes.json()) as ApiResponse<{
      id: string;
      name: string;
      isProtected: boolean;
      permissions: Array<{ name: string }>;
    }>;

    assert(
      superAdminDetailData.data?.isProtected === true,
      "SUPER_ADMIN role is flagged as system protected (isProtected = true)"
    );
    assert(
      superAdminDetailData.data?.permissions.some((p) => p.name === "admin.all"),
      "SUPER_ADMIN role has 'admin.all' root capability"
    );

    // =========================================================================
    // TEST 5: SUPER_ADMIN Immutability Safeguard
    // =========================================================================
    console.log("\n--- [TEST 5: Read-Only & SUPER_ADMIN Immutability Safeguards] ---");

    const superAdminRoleObj = roles.find((r) => r.name === "SUPER_ADMIN");
    if (superAdminRoleObj) {
      const mutateSuperAdminRes = await fetch(`${baseUrl}/admin/roles/${superAdminRoleObj.id}/permissions`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ permissionIds: [] }),
      });
      assert(
        mutateSuperAdminRes.status === 400,
        "Safeguard: Backend rejects modifying SUPER_ADMIN permissions (400 CANNOT_MODIFY_SUPER_ADMIN_PERMISSIONS)"
      );
    }

    console.log(`\n========================================`);
    console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Test suite encountered unhandled exception:", error);
    process.exit(1);
  } finally {
    server.close();
    await closeDatabasePool();
  }
}

runAdminRolesPermissionsTestSuite();
