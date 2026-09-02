import { Response, CookieOptions } from "express";
import { env } from "../../config/env";

/**
 * Builds the secure CookieOptions object for the refresh token HttpOnly cookie.
 */
export const getRefreshCookieOptions = (maxAgeMs?: number): CookieOptions => {
  const options: CookieOptions = {
    httpOnly: true, // Never accessible to frontend JavaScript
    secure: env.COOKIE_SECURE || env.NODE_ENV === "production",
    sameSite: env.COOKIE_SAME_SITE,
    path: env.COOKIE_PATH,
  };

  if (maxAgeMs !== undefined) {
    options.maxAge = maxAgeMs;
  }

  // Only assign domain if non-empty
  if (env.COOKIE_DOMAIN && env.COOKIE_DOMAIN.trim().length > 0) {
    options.domain = env.COOKIE_DOMAIN.trim();
  }

  return options;
};

/**
 * Sets the rotating refresh token as a secure HttpOnly cookie on the response.
 */
export const setRefreshCookie = (
  res: Response,
  refreshToken: string,
  expiresInDays = env.REFRESH_TOKEN_EXPIRES_IN_DAYS
): void => {
  const maxAgeMs = expiresInDays * 24 * 60 * 60 * 1000;
  const options = getRefreshCookieOptions(maxAgeMs);
  res.cookie(env.REFRESH_COOKIE_NAME, refreshToken, options);
};

/**
 * Clears the refresh token HttpOnly cookie on logout.
 */
export const clearRefreshCookie = (res: Response): void => {
  const options = getRefreshCookieOptions();
  res.clearCookie(env.REFRESH_COOKIE_NAME, options);
};
