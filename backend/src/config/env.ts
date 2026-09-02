import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .default("5001")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0 && val <= 65535, {
      message: "PORT must be a valid port number between 1 and 65535",
    }),
  APP_NAME: z.string().default("3G_ME_LIFE_API"),
  API_VERSION: z.string().default("v1"),

  FRONTEND_URL: z
    .string()
    .min(1, "FRONTEND_URL is required")
    .default("http://localhost:3000"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required"),

  // JWT Access Token Configuration
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT_ACCESS_SECRET must be at least 32 characters long"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_ISSUER: z.string().default("3g-me-life"),
  JWT_AUDIENCE: z.string().default("3g-me-life-users"),

  // Refresh Token Configuration
  REFRESH_TOKEN_EXPIRES_IN_DAYS: z
    .string()
    .default("7")
    .transform((val) => parseInt(val, 10)),
  REFRESH_TOKEN_BYTES: z
    .string()
    .default("64")
    .transform((val) => parseInt(val, 10)),

  // Cookie Settings
  REFRESH_COOKIE_NAME: z.string().default("melife_refresh_token"),
  COOKIE_SECURE: z
    .string()
    .default("false")
    .transform((val) => val.toLowerCase() === "true"),
  COOKIE_HTTP_ONLY: z
    .string()
    .default("true")
    .transform((val) => val.toLowerCase() !== "false"),
  COOKIE_SAME_SITE: z
    .enum(["lax", "strict", "none"])
    .default("lax"),
  COOKIE_PATH: z.string().default("/api/v1/auth"),
  COOKIE_DOMAIN: z.string().optional().default(""),

  // Argon2 Configuration
  ARGON2_MEMORY_COST: z
    .string()
    .default("19456")
    .transform((val) => parseInt(val, 10)),
  ARGON2_TIME_COST: z
    .string()
    .default("2")
    .transform((val) => parseInt(val, 10)),
  ARGON2_PARALLELISM: z
    .string()
    .default("1")
    .transform((val) => parseInt(val, 10)),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional().default(""),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .default("900000")
    .transform((val) => parseInt(val, 10)),
  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .default("100")
    .transform((val) => parseInt(val, 10)),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables configuration:");
    result.error.issues.forEach((issue) => {
      console.error(` - [${issue.path.join(".")}]: ${issue.message}`);
    });
    process.exit(1);
  }

  return result.data;
};

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;
