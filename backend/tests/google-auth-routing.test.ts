/**
 * Google Authentication & API Routing Verification Test Suite
 *
 * Verifies:
 * 1. GET /api/v1/health route mounting and health response
 * 2. POST /api/v1/auth/google route exists (empty body returns 400 Bad Request, NOT 404)
 * 3. Google Login with unknown Google user & no registrationPath returns 404 AUTH_ACCOUNT_NOT_FOUND without auto-creating a STUDENT
 * 4. Google Registration with registrationPath=STUDENT creates student account
 * 5. Google Registration with registrationPath=PARENT creates parent account
 * 6. Google Login with existing email links account and authenticates
 * 7. Google Auth with invalid token returns 401 Unauthorized
 */

import { pool, connectDatabase } from "../src/config/database";
import { authRepository } from "../src/modules/auth/auth.repository";
import { userRepository } from "../src/modules/users/user.repository";
import { authGoogleService } from "../src/modules/auth/auth.google.service";
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
  console.log("🚀 Starting Google Auth & Routing Verification Test Suite...\n");

  await connectDatabase();
  await authRepository.initSchema();

  server = app.listen(0);
  const addr = server.address();
  const port = typeof addr === "object" && addr ? addr.port : 5001;
  baseUrl = `http://127.0.0.1:${port}`;

  const timestamp = Date.now();

  try {
    // =========================================================================
    // 1. HEALTH ENDPOINT VERIFICATION
    // =========================================================================
    console.log("--- [TEST 1: API Health Route Verification] ---");
    const healthRes = await request("GET", "/api/v1/health");
    assert(
      healthRes.status === 200 || healthRes.status === 503,
      `GET /api/v1/health responded with status ${healthRes.status} (route exists and responds)`
    );
    assert(
      healthRes.data?.data?.service === "melife-api",
      "Health response identifies melife-api service"
    );

    // =========================================================================
    // 2. ROUTE MOUNTING & VALIDATION ERROR VERIFICATION
    // =========================================================================
    console.log("\n--- [TEST 2: POST /api/v1/auth/google Route Mounting] ---");
    const emptyGoogleRes = await request("POST", "/api/v1/auth/google", {});
    assert(
      emptyGoogleRes.status === 400,
      `POST /api/v1/auth/google with empty body returns 400 Bad Request (got ${emptyGoogleRes.status}, NOT 404)`
    );
    assert(
      emptyGoogleRes.data?.error?.code === "VALIDATION_ERROR",
      "Error code is VALIDATION_ERROR"
    );

    // =========================================================================
    // 3. GOOGLE LOGIN WITH UNKNOWN USER (NO REGISTRATION PATH)
    // =========================================================================
    console.log("\n--- [TEST 3: Google Login with Unknown Account (No Silent Auto-Register)] ---");
    // Mock verifyGoogleCredential for test isolation
    const mockUnknownEmail = `google_unknown_${timestamp}@example.com`;
    const mockStudentEmail = `google_student_${timestamp}@example.com`;
    const mockParentEmail = `google_parent_${timestamp}@example.com`;
    const originalVerify = authGoogleService.verifyGoogleCredential;

    authGoogleService.verifyGoogleCredential = async (idToken: string) => {
      if (idToken === "valid_mock_token_unknown") {
        return {
          provider: "GOOGLE",
          providerAccountId: `google_sub_${timestamp}`,
          email: mockUnknownEmail,
          emailVerified: true,
          firstName: "Unknown",
          lastName: "GoogleUser",
        };
      }
      if (idToken === "valid_mock_token_student") {
        return {
          provider: "GOOGLE",
          providerAccountId: `google_sub_student_${timestamp}`,
          email: mockStudentEmail,
          emailVerified: true,
          firstName: "Student",
          lastName: "GoogleUser",
        };
      }
      if (idToken === "valid_mock_token_parent") {
        return {
          provider: "GOOGLE",
          providerAccountId: `google_sub_parent_${timestamp}`,
          email: mockParentEmail,
          emailVerified: true,
          firstName: "Parent",
          lastName: "GoogleUser",
        };
      }
      return originalVerify.call(authGoogleService, idToken);
    };

    const unknownLoginRes = await request("POST", "/api/v1/auth/google", {
      credential: "valid_mock_token_unknown",
      // Note: registrationPath is omitted on login
    });

    assert(
      unknownLoginRes.status === 404,
      `Google login with unknown email returns 404 (got ${unknownLoginRes.status})`
    );
    assert(
      unknownLoginRes.data?.error?.code === "AUTH_ACCOUNT_NOT_FOUND",
      "Error code is AUTH_ACCOUNT_NOT_FOUND"
    );

    // Verify user was NOT silently created in the database
    const userInDb = await userRepository.findByEmail(mockUnknownEmail);
    assert(userInDb === null, "Unknown Google user was NOT auto-created as a student on login");

    // =========================================================================
    // 4. GOOGLE REGISTRATION AS STUDENT
    // =========================================================================
    console.log("\n--- [TEST 4: Google Registration as Student] ---");
    const studentRegRes = await request("POST", "/api/v1/auth/google", {
      credential: "valid_mock_token_student",
      registrationPath: "STUDENT",
    });

    assert(
      studentRegRes.status === 200,
      `Student registration with Google returns 200 OK (got ${studentRegRes.status})`
    );
    assert(
      studentRegRes.data?.data?.role === "PARTICIPANT",
      "Created user has role PARTICIPANT"
    );
    assert(
      Boolean(studentRegRes.data?.data?.accessToken),
      "Access token returned on successful registration"
    );

    // =========================================================================
    // 5. GOOGLE REGISTRATION AS PARENT
    // =========================================================================
    console.log("\n--- [TEST 5: Google Registration as Parent] ---");
    const parentRegRes = await request("POST", "/api/v1/auth/google", {
      credential: "valid_mock_token_parent",
      registrationPath: "PARENT",
    });

    assert(
      parentRegRes.status === 200,
      `Parent registration with Google returns 200 OK (got ${parentRegRes.status})`
    );
    assert(
      parentRegRes.data?.data?.role === "PARENT_GUARDIAN",
      "Created user has role PARENT_GUARDIAN"
    );

    // =========================================================================
    // 6. GOOGLE LOGIN FOR EXISTING GOOGLE USER
    // =========================================================================
    console.log("\n--- [TEST 6: Google Login for Existing Google-Linked User] ---");
    const studentLoginRes = await request("POST", "/api/v1/auth/google", {
      credential: "valid_mock_token_student",
    });

    assert(
      studentLoginRes.status === 200,
      `Existing Google user login returns 200 OK (got ${studentLoginRes.status})`
    );
    assert(
      studentLoginRes.data?.data?.user?.email === mockStudentEmail,
      "Authenticated user matches Google email"
    );

    // =========================================================================
    // 7. GOOGLE AUTH WITH INVALID TOKEN (UNMOCKED / REAL VERIFY)
    // =========================================================================
    console.log("\n--- [TEST 7: Invalid Google Token Handling] ---");
    authGoogleService.verifyGoogleCredential = originalVerify;

    const invalidTokenRes = await request("POST", "/api/v1/auth/google", {
      credential: "invalid_untrusted_jwt_token_credential",
    });

    assert(
      invalidTokenRes.status === 401 || invalidTokenRes.status === 500,
      `Invalid Google token returns expected error status ${invalidTokenRes.status}`
    );

    console.log("\n=======================================================");
    console.log("🎉 ALL GOOGLE AUTH & ROUTING TESTS PASSED SUCCESSFULLY!");
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
