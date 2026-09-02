export type UserStatus =
  | "ACTIVE"
  | "PENDING_VERIFICATION"
  | "SUSPENDED"
  | "DISABLED";

export type UserRole =
  | "SUPER_ADMIN"
  | "COMPANY_ADMIN"
  | "PLATFORM_ADMIN"
  | "INSTITUTION_ADMIN"
  | "PARTICIPANT"
  | "PARENT_GUARDIAN"
  | "CAREER_COUNSELLOR";

export interface User {
  id: string;
  email: string;
  password_hash: string | null;
  first_name: string;
  last_name: string;
  status: UserStatus;
  email_verified_at: Date | null;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export interface UserWithRoles extends User {
  roles: UserRole[];
  permissions: string[];
}

export interface CreateUserData {
  email: string;
  passwordHash?: string | null;
  firstName: string;
  lastName: string;
  status?: UserStatus;
  emailVerifiedAt?: Date | null;
}
