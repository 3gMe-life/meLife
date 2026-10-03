import pino from "pino";
import { pinoHttp } from "pino-http";
import { env } from "../../config/env";

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "token",
      "refreshToken",
      "secret",
      "*.password",
      "*.token",
    ],
    remove: true,
  },
  transport:
    env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => req.id || "unknown",
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      originalUrl: (req as any).originalUrl,
      forwardedHost: (req as any).headers?.["x-forwarded-host"],
      forwardedProto: (req as any).headers?.["x-forwarded-proto"],
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});
