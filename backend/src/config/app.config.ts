export const APP_CONFIG = {
  serviceName: "melife-api",
  apiVersion: "v1",
  apiPrefix: "/api/v1",
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
  },
} as const;
