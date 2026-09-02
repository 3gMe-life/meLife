import crypto from "crypto";
import argon2 from "argon2";
import { env } from "../../config/env";
import { logger } from "./logger";

/**
 * Hashes a plaintext password using Argon2id with env-configured cost parameters.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: env.ARGON2_MEMORY_COST,
    timeCost: env.ARGON2_TIME_COST,
    parallelism: env.ARGON2_PARALLELISM,
  });
};

/**
 * Verifies a plaintext password against an Argon2id hash.
 */
export const verifyPassword = async (
  hash: string,
  plain: string
): Promise<boolean> => {
  try {
    return await argon2.verify(hash, plain);
  } catch (error) {
    logger.error({ error }, "Error during password verification");
    return false;
  }
};

/**
 * Generates a cryptographically secure opaque random token in base64url format.
 */
export const generateRandomToken = (bytes = env.REFRESH_TOKEN_BYTES): string => {
  return crypto.randomBytes(bytes).toString("base64url");
};

/**
 * Hashes an opaque token using SHA-256 for secure database storage and lookup.
 */
export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
