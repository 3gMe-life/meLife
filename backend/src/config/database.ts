import { Pool, PoolConfig } from "pg";
import { env } from "./env";
import { logger } from "../common/utils/logger";

/**
 * Sanitizes database connection URL for safe logging without credentials
 */
export const getSanitizedDbInfo = (rawUrl: string) => {
  try {
    const parsed = new URL(rawUrl);
    const sslEnabled =
      rawUrl.includes("sslmode=require") ||
      rawUrl.includes("ssl=true") ||
      env.NODE_ENV === "production";

    return {
      host: parsed.hostname || "localhost",
      port: parsed.port || "5432",
      database: parsed.pathname.replace(/^\//, "") || "postgres",
      user: parsed.username || "postgres",
      ssl: sslEnabled,
      safeUrl: `${parsed.protocol}//${parsed.username ? parsed.username + ":***@" : ""}${parsed.host}${parsed.pathname}`,
    };
  } catch {
    return {
      host: "unknown",
      port: "unknown",
      database: "unknown",
      user: "unknown",
      ssl: false,
      safeUrl: "[INVALID_DATABASE_URL]",
    };
  }
};

export interface CategorizedDbError {
  category:
    | "RECOVERY_OR_STARTING"
    | "AUTH_FAILURE"
    | "DB_NOT_FOUND"
    | "NETWORK_OR_TIMEOUT"
    | "SERVER_SHUTDOWN_OR_BUSY"
    | "INVALID_URL"
    | "UNKNOWN";
  isTransient: boolean;
  diagnosticMessage: string;
  code?: string;
  originalMessage: string;
}

/**
 * Categorizes PostgreSQL connection errors into actionable transient vs non-transient buckets
 */
export const categorizeDbError = (err: unknown): CategorizedDbError => {
  if (!err) {
    return {
      category: "UNKNOWN",
      isTransient: false,
      diagnosticMessage: "Unknown database connection error.",
      originalMessage: "Unknown error",
    };
  }

  const errorObj = err as { code?: string; message?: string; stack?: string };
  const code = errorObj.code || "";
  const msg = errorObj.message || "";

  // 1. PostgreSQL starting up or in recovery mode (57P03)
  if (
    code === "57P03" ||
    msg.includes("recovery mode") ||
    msg.includes("starting up") ||
    msg.includes("not yet accepting connections")
  ) {
    return {
      category: "RECOVERY_OR_STARTING",
      isTransient: true,
      diagnosticMessage:
        "PostgreSQL is currently starting or recovering. Waiting for the database to become ready...",
      code,
      originalMessage: msg,
    };
  }

  // 2. Authentication failure (28P01, 28000) - Permanent
  if (
    code === "28P01" ||
    code === "28000" ||
    msg.includes("password authentication failed") ||
    (msg.includes("role") && msg.includes("does not exist"))
  ) {
    return {
      category: "AUTH_FAILURE",
      isTransient: false,
      diagnosticMessage: "PostgreSQL authentication failed. Verify DATABASE_URL credentials.",
      code,
      originalMessage: msg,
    };
  }

  // 3. Database does not exist (3D000) - Permanent
  if (code === "3D000" || (msg.includes("database") && msg.includes("does not exist"))) {
    return {
      category: "DB_NOT_FOUND",
      isTransient: false,
      diagnosticMessage:
        "PostgreSQL database does not exist. Check database name in DATABASE_URL.",
      code,
      originalMessage: msg,
    };
  }

  // 4. Network unreachable, socket refused, or connection timeout - Transient
  if (
    code === "ECONNREFUSED" ||
    code === "EHOSTUNREACH" ||
    code === "ENETUNREACH" ||
    code === "ETIMEDOUT" ||
    code === "ECONNRESET" ||
    code === "EAI_AGAIN" ||
    msg.includes("timeout") ||
    msg.includes("Connection terminated") ||
    msg.includes("connection timeout")
  ) {
    return {
      category: "NETWORK_OR_TIMEOUT",
      isTransient: true,
      diagnosticMessage:
        "PostgreSQL host is unreachable or connection timed out. Check database host, port, firewall, or network configuration.",
      code,
      originalMessage: msg,
    };
  }

  // 5. Server admin shutdown or max connections exceeded - Transient
  if (code === "57P01" || code === "57P02" || code === "53300") {
    return {
      category: "SERVER_SHUTDOWN_OR_BUSY",
      isTransient: true,
      diagnosticMessage:
        "PostgreSQL server is shutting down or max connections exceeded. Retrying...",
      code,
      originalMessage: msg,
    };
  }

  return {
    category: "UNKNOWN",
    isTransient: false,
    diagnosticMessage: `PostgreSQL connection failed: ${msg || "Unexpected database error"}`,
    code,
    originalMessage: msg,
  };
};

const poolConfig: PoolConfig = {
  connectionString: env.DATABASE_URL,
  max: 20, // Max concurrent connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl:
    env.DATABASE_URL.includes("sslmode=require") ||
    env.DATABASE_URL.includes("ssl=true") ||
    env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
};

export const pool = new Pool(poolConfig);

// Pool-level error listener
pool.on("error", (err) => {
  logger.error({ err }, "Unexpected error on idle PostgreSQL client");
});

// Standard backoff schedule (in ms): Attempt 1 -> 2s, Attempt 2 -> 4s, Attempt 3 -> 8s, Attempt 4 -> 16s, Attempt 5 -> 30s
const BACKOFF_SCHEDULE_MS = [2000, 4000, 8000, 16000, 30000];

/**
 * Tests database connectivity on startup with controlled backoff retry logic for transient recovery/startup states.
 */
export const connectDatabase = async (
  backoffSchedule: number[] = BACKOFF_SCHEDULE_MS
): Promise<void> => {
  const maxAttempts = backoffSchedule.length;
  const dbInfo = getSanitizedDbInfo(env.DATABASE_URL);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const start = Date.now();
    try {
      const client = await pool.connect();
      try {
        const res = await client.query(
          "SELECT NOW() as current_time, current_database() as database_name, version() as version"
        );
        const duration = Date.now() - start;
        const dbName = res.rows[0]?.database_name || dbInfo.database;
        logger.info(
          `🐘 PostgreSQL Database connected successfully [Host: ${dbInfo.host}:${dbInfo.port}, DB: ${dbName}] in ${duration}ms (attempt ${attempt}/${maxAttempts})`
        );
        return;
      } finally {
        client.release();
      }
    } catch (err: unknown) {
      const categorized = categorizeDbError(err);
      const delayMs = backoffSchedule[attempt - 1] ?? 30000;

      // If permanent error (e.g. Auth failure, DB not found), fail immediately without retrying
      if (!categorized.isTransient) {
        logger.fatal(
          {
            err,
            category: categorized.category,
            code: categorized.code,
            host: dbInfo.host,
            port: dbInfo.port,
            database: dbInfo.database,
          },
          `❌ ${categorized.diagnosticMessage}`
        );
        throw err;
      }

      // If transient error and attempts remain, log warning and wait with backoff
      if (attempt < maxAttempts) {
        logger.warn(
          {
            category: categorized.category,
            code: categorized.code,
            attempt,
            maxAttempts,
            nextRetryInSec: delayMs / 1000,
            host: dbInfo.host,
            port: dbInfo.port,
            database: dbInfo.database,
          },
          `⏳ ${categorized.diagnosticMessage} Retrying in ${delayMs / 1000}s (attempt ${attempt}/${maxAttempts})...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      // Exhausted all retries
      logger.fatal(
        {
          err,
          category: categorized.category,
          code: categorized.code,
          attempts: maxAttempts,
          host: dbInfo.host,
          port: dbInfo.port,
          database: dbInfo.database,
        },
        `❌ Failed to connect to PostgreSQL database after ${maxAttempts} attempts. ${categorized.diagnosticMessage}`
      );
      throw err;
    }
  }
};

/**
 * Checks database health and latency
 */
export const checkDatabaseHealth = async (): Promise<{
  connected: boolean;
  latencyMs: number;
  database?: string;
  error?: string;
}> => {
  const start = Date.now();
  try {
    const res = await pool.query("SELECT NOW() as current_time, current_database() as db");
    const latencyMs = Date.now() - start;
    return {
      connected: true,
      latencyMs,
      database: res.rows[0]?.db,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown database error";
    return {
      connected: false,
      latencyMs: Date.now() - start,
      error: errorMsg,
    };
  }
};

/**
 * Closes the database connection pool gracefully
 */
export const closeDatabasePool = async (): Promise<void> => {
  try {
    await pool.end();
    logger.info("🐘 PostgreSQL connection pool closed cleanly.");
  } catch (err) {
    logger.error({ err }, "Error closing PostgreSQL connection pool");
  }
};

