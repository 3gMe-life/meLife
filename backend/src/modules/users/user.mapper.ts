import { User, PublicUser } from "./user.types";

/**
 * Transforms a raw database User record into a secure, sanitized PublicUser DTO.
 * Strips password_hash, refreshTokenHash, and internal sensitive database properties.
 */
export const toPublicUser = (user: User): PublicUser => {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    status: user.status,
    emailVerifiedAt: user.email_verified_at,
    lastLoginAt: user.last_login_at,
    createdAt: user.created_at,
  };
};
