/**
 * 3G MeLife Admin Portal Types & DTOs
 */

export interface AdminNavItem {
  id: string;
  title: string;
  href: string;
  iconName: string;
  badge?: string | number;
  badgeVariant?: "default" | "teal" | "amber" | "rose" | "indigo";
  isComingSoon?: boolean;
}

export interface AdminNavSection {
  title?: string;
  items: AdminNavItem[];
}

export interface PlatformMetricsDTO {
  totalUsers: number;
  activeStudents: number;
  approvedCounsellors: number;
  pendingCounsellorApplications: number;
  completedAssessments: number;
  institutionApplications: number;
}

export interface RecentUserDTO {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface RecentApplicationDTO {
  id: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  qualification: string | null;
  organization: string | null;
  status: string;
  createdAt: string;
}

export interface RecentActivityItemDTO {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
}

export interface PlatformOverviewResponseDTO {
  metrics: PlatformMetricsDTO;
  recentUsers: RecentUserDTO[];
  recentApplications: RecentApplicationDTO[];
  recentActivities?: RecentActivityItemDTO[];
}

export interface CounsellorApplicationItemDTO {
  id: string;
  userId: string;
  applicantName: string;
  applicantEmail: string;
  qualification: string | null;
  organization: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  reviewedBy?: string | null;
  reviewerName?: string | null;
  reviewedAt?: string | null;
  reviewNotes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface ApproveApplicationRequestDTO {
  qualification?: string;
  bio?: string;
  experienceYears?: number;
  specialisations?: string[];
  languages?: string[];
  guidanceAreas?: string[];
  reviewNotes?: string;
}

export interface RejectApplicationRequestDTO {
  reason?: string;
  reviewNotes?: string;
}

export interface ApplicationDecisionResultDTO {
  success: boolean;
  message: string;
  application: CounsellorApplicationItemDTO;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: string;
    role: string;
  };
  counsellor?: {
    id: string;
    userId: string;
    qualification: string;
    approvalStatus: string;
  } | null;
}

export interface AdminUserListItemDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  status: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "DISABLED" | string;
  role: string;
  roles: string[];
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface AdminUserFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC" | string;
}

export interface AdminUserPaginationDTO {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminUserListResponseDTO {
  users: AdminUserListItemDTO[];
  pagination: AdminUserPaginationDTO;
}

export interface AdminUserDetailDTO extends AdminUserListItemDTO {
  permissions: string[];
  counsellorProfile?: {
    id: string;
    qualification: string;
    experienceYears: number;
    approvalStatus: string;
    rating: number;
  } | null;
  studentProfile?: {
    isOnboarded: boolean;
    educationStage?: string | null;
    gradeLevel?: string | null;
  } | null;
}

export interface UpdateUserStatusRequestDTO {
  status: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "DISABLED" | string;
}

export interface UpdateUserRoleRequestDTO {
  role: string;
  isPrimary?: boolean;
}

export interface AdminRoleListItemDTO {
  id: string;
  name: string;
  description: string | null;
  userCount: number;
  permissionCount: number;
  isSystemRole: boolean;
  isProtected: boolean;
  createdAt: string;
}

export interface AdminRolePermissionDTO {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  createdAt: string;
}

export interface AdminRoleAssignedUserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  status: string;
  isPrimary: boolean;
  assignedAt: string;
}

export interface AdminRoleDetailDTO {
  id: string;
  name: string;
  description: string | null;
  userCount: number;
  permissionCount: number;
  isSystemRole: boolean;
  isProtected: boolean;
  createdAt: string;
  permissions: AdminRolePermissionDTO[];
  users: AdminRoleAssignedUserDTO[];
}

export interface AdminRoleListResponseDTO {
  roles: AdminRoleListItemDTO[];
  totalRoles: number;
  totalPermissions: number;
  totalAssignedUsers: number;
}

export interface AdminPermissionListItemDTO {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  rolesCount: number;
  createdAt: string;
}

export interface RolePermissionMatrixItemDTO {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  isAssigned: boolean;
  createdAt: string;
}

export interface RolePermissionMatrixResponseDTO {
  role: {
    id: string;
    name: string;
    description: string | null;
    isSystemRole: boolean;
    isProtected: boolean;
  };
  permissions: RolePermissionMatrixItemDTO[];
  categories: string[];
  totalAvailablePermissions: number;
  assignedPermissionsCount: number;
}

export interface UpdateRolePermissionsRequestDTO {
  permissionIds?: string[];
  permissionNames?: string[];
}

export interface UpdateRolePermissionsResponseDTO {
  success: boolean;
  message: string;
  role: {
    id: string;
    name: string;
    description: string | null;
    isSystemRole: boolean;
    isProtected: boolean;
  };
  permissions: RolePermissionMatrixItemDTO[];
  assignedPermissionsCount: number;
}

export interface DashboardFeatureItemDTO {
  id: string;
  key: string;
  name: string;
  description: string | null;
  category: string;
  icon: string | null;
  route: string | null;
  requiredPermission: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface RoleDashboardFeatureItemDTO extends DashboardFeatureItemDTO {
  isEnabled: boolean;
  isPermissionGranted: boolean;
}

export interface RoleDashboardFeaturesResponseDTO {
  role: {
    id: string;
    name: string;
    description: string | null;
    isSystemRole: boolean;
    isProtected: boolean;
  };
  features: RoleDashboardFeatureItemDTO[];
  categories: string[];
  totalFeaturesCount: number;
  enabledFeaturesCount: number;
}

export interface UpdateRoleDashboardFeaturesRequestDTO {
  features: Record<string, boolean>;
}

export interface UpdateRoleDashboardFeaturesResponseDTO {
  success: boolean;
  message: string;
  role: {
    id: string;
    name: string;
  };
  features: RoleDashboardFeatureItemDTO[];
  enabledFeaturesCount: number;
}

export interface AdminCounsellorAccessDTO {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    status: string;
    role: string;
    avatarUrl?: string | null;
  };
  counsellor?: {
    id: string;
    qualification: string;
    experienceYears: number;
    bio: string;
    specialisations: string[];
    languages: string[];
    guidanceAreas: string[];
    approvalStatus: string;
  } | null;
  application?: {
    id: string;
    status: string;
    qualification: string | null;
    organization: string | null;
    reviewedAt: string | null;
  } | null;
  role: {
    id: string;
    name: string;
    description: string | null;
  };
  features: RoleDashboardFeatureItemDTO[];
  permissions: RolePermissionMatrixItemDTO[];
  effectiveSummary: {
    totalFeatures: number;
    enabledFeaturesCount: number;
    totalPermissions: number;
    activePermissionsCount: number;
    missingRequiredPermissionsCount: number;
  };
}

export interface UpdateCounsellorProfileRequestDTO {
  firstName?: string;
  lastName?: string;
  qualification?: string;
  organization?: string;
  bio?: string;
  experienceYears?: number;
  specialisations?: string[];
  languages?: string[];
  guidanceAreas?: string[];
}

export interface DeleteCounsellorResultDTO {
  success: boolean;
  message: string;
  actionTaken: "HARD_DELETED" | "SOFT_DEACTIVATED";
  details?: {
    sessionsCount?: number;
    notesCount?: number;
    consentsCount?: number;
  };
}

export interface UpdateUserProfileRequestDTO {
  firstName?: string;
  lastName?: string;
}

export interface DeleteUserResultDTO {
  success: boolean;
  message: string;
  actionTaken: "HARD_DELETED" | "SOFT_DEACTIVATED";
}

export interface BulkDeleteUserItemResult {
  userId: string;
  email?: string;
  fullName?: string;
  success: boolean;
  actionTaken?: "HARD_DELETED" | "SOFT_DEACTIVATED" | "SKIPPED_PROTECTED" | "FAILED";
  reason?: string;
}

export interface BulkDeleteUsersResultDTO {
  totalRequested: number;
  deletedCount: number;
  deactivatedCount: number;
  skippedCount: number;
  failedCount: number;
  results: BulkDeleteUserItemResult[];
  message: string;
}

export interface BulkUserStatusResultDTO {
  totalRequested: number;
  updatedCount: number;
  skippedCount: number;
  results: Array<{
    userId: string;
    email?: string;
    fullName?: string;
    success: boolean;
    status?: string;
    reason?: string;
  }>;
  message: string;
}




