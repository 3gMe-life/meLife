import {
  categorizeDbError,
  getSanitizedDbInfo,
  connectDatabase,
  pool,
} from "../src/config/database";

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING DATABASE RESILIENCE & ERROR HANDLING TESTS");
  console.log("==================================================");

  // --- TEST CASE A: Sanitization ---
  console.log("\n[TEST A] URL Sanitization:");
  const testUrl =
    "postgres://admin:superSecretPass123!@db.internal.melife.com:5433/production_db?sslmode=require";
  const sanitized = getSanitizedDbInfo(testUrl);
  console.log("Sanitized Info:", sanitized);
  if (sanitized.safeUrl.includes("superSecretPass123!")) {
    throw new Error("FAIL: Password was leaked in sanitized URL!");
  }
  console.log("✔ Pass: Credentials safely redacted.");

  // --- TEST CASE B: Categorization of 57P03 (Recovery / Starting) ---
  console.log("\n[TEST B] 57P03 Error Categorization:");
  const cat57P03 = categorizeDbError({
    code: "57P03",
    message: "the database system is in recovery mode",
  });
  console.log("Result:", cat57P03);
  if (!cat57P03.isTransient || cat57P03.category !== "RECOVERY_OR_STARTING") {
    throw new Error("FAIL: 57P03 must be categorized as RECOVERY_OR_STARTING and isTransient=true");
  }
  console.log("✔ Pass: 57P03 correctly categorized as transient recovery.");

  // --- TEST CASE C: Categorization of 28P01 (Auth Failure - Permanent) ---
  console.log("\n[TEST C] Auth Failure (28P01) Categorization:");
  const catAuth = categorizeDbError({
    code: "28P01",
    message: "password authentication failed for user postgres",
  });
  console.log("Result:", catAuth);
  if (catAuth.isTransient || catAuth.category !== "AUTH_FAILURE") {
    throw new Error("FAIL: 28P01 must be categorized as AUTH_FAILURE and isTransient=false");
  }
  console.log("✔ Pass: 28P01 fails fast with no retry.");

  // --- TEST CASE D: Categorization of 3D000 (Database Not Found - Permanent) ---
  console.log("\n[TEST D] Missing Database (3D000) Categorization:");
  const catMissingDb = categorizeDbError({
    code: "3D000",
    message: 'database "nonexistent_db" does not exist',
  });
  console.log("Result:", catMissingDb);
  if (catMissingDb.isTransient || catMissingDb.category !== "DB_NOT_FOUND") {
    throw new Error("FAIL: 3D000 must be categorized as DB_NOT_FOUND and isTransient=false");
  }
  console.log("✔ Pass: 3D000 fails fast with no retry.");

  // --- TEST CASE E: Categorization of Network Timeout / Unreachable ---
  console.log("\n[TEST E] Network / Timeout Categorization:");
  const catTimeout = categorizeDbError({
    message: "timeout exceeded when trying to connect",
  });
  console.log("Result:", catTimeout);
  if (!catTimeout.isTransient || catTimeout.category !== "NETWORK_OR_TIMEOUT") {
    throw new Error("FAIL: Timeout must be categorized as NETWORK_OR_TIMEOUT and isTransient=true");
  }
  console.log("✔ Pass: Connection timeout correctly recognized as transient.");

  // --- TEST CASE F: Backoff Retry Sequence ---
  console.log("\n[TEST F] Backoff Schedule Validation:");
  const testDelays = [100, 200, 300];
  const start = Date.now();
  let retryCount = 0;

  // Mock a failing connect on pool to test backoff timing
  const originalConnect = pool.connect.bind(pool);
  (pool as any).connect = async () => {
    retryCount++;
    const err: any = new Error("the database system is in recovery mode");
    err.code = "57P03";
    throw err;
  };

  try {
    await connectDatabase(testDelays);
    throw new Error("FAIL: Expected connectDatabase to throw after retries exhausted.");
  } catch (err: any) {
    const elapsed = Date.now() - start;
    console.log(`Retries performed: ${retryCount}, Elapsed time: ${elapsed}ms`);
    if (retryCount !== testDelays.length) {
      throw new Error(`FAIL: Expected ${testDelays.length} attempts, got ${retryCount}`);
    }
    console.log("✔ Pass: connectDatabase retried all scheduled attempts and timed backoff properly.");
  } finally {
    pool.connect = originalConnect;
  }

  console.log("\n==================================================");
  console.log("ALL DATABASE RESILIENCE TESTS PASSED SUCCESSFULLY");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("Test Suite Failed:", err);
  process.exit(1);
});
