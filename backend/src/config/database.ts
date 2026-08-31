import { Pool, PoolConfig } from "pg";
import { env } from "./env";
import { logger } from "../common/utils/logger";

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

/**
 * Tests database connectivity on startup
 */
export const connectDatabase = async (): Promise<void> => {
  const start = Date.now();
  try {
    const client = await pool.connect();
    try {
      const res = await client.query(
        "SELECT NOW() as current_time, current_database() as database_name, version() as version"
      );
      const duration = Date.now() - start;
      const dbName = res.rows[0]?.database_name || "unknown";
      logger.info(
        `🐘 PostgreSQL Database connected successfully [DB: ${dbName}] in ${duration}ms`
      );
    } finally {
      client.release();
    }
  } catch (error) {
    logger.fatal(
      { error },
      "❌ Failed to connect to PostgreSQL database. Check DATABASE_URL and network connectivity."
    );
    throw error;
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
