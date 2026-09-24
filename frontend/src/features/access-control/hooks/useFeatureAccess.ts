"use client";

import { useMemo, useCallback } from "react";
import { useCurrentUserQuery } from "@/features/auth/hooks/useCurrentUserQuery";
import type { UserRole } from "@/features/auth/types/auth.types";
import {
  FEATURE_REGISTRY,
  getAllFeatures,
} from "../config/feature-registry.config";
import type {
  FeatureKey,
  FeatureCategory,
  FeatureDefinition,
  FeatureAccessResult,
} from "../types/access-control.types";

/**
 * Evaluates whether a user with given roles and permissions is authorized
 * to access a feature definition.
 */
export function evaluateFeatureAccess(
  feature: FeatureDefinition,
  userRole?: UserRole,
  permissions: string[] = []
): FeatureAccessResult {
  // 1. Root / Super Admin Override:
  // If user has "admin.all" permission or SUPER_ADMIN role, all features are granted.
  if (userRole === "SUPER_ADMIN" || permissions.includes("admin.all")) {
    return {
      isGranted: true,
      reason: "SUPER_ADMIN",
      feature,
    };
  }

  // 2. Specific Database Permission Check:
  if (feature.requiredPermission && permissions.includes(feature.requiredPermission)) {
    return {
      isGranted: true,
      reason: "PERMISSION_GRANTED",
      feature,
    };
  }

  // 3. Multi-Permission Any Check:
  if (
    feature.requiredAnyPermissions &&
    feature.requiredAnyPermissions.some((p) => permissions.includes(p))
  ) {
    return {
      isGranted: true,
      reason: "PERMISSION_GRANTED",
      feature,
    };
  }

  // 4. Role Fallback:
  // For features whose fine-grained permissions do not exist in the database,
  // evaluate active role match.
  if (userRole && feature.allowedRoles && feature.allowedRoles.includes(userRole)) {
    return {
      isGranted: true,
      reason: "ROLE_FALLBACK",
      feature,
    };
  }

  // 5. Access Denied
  return {
    isGranted: false,
    reason: "DENIED",
    feature,
  };
}

/**
 * Main Dynamic Feature Access Hook
 * Provides dynamic feature capability checks and accessible navigation item lists.
 */
export function useFeatureAccess() {
  const { data: authData, isLoading, isError } = useCurrentUserQuery();

  const user = authData?.data?.user;
  const userRole: UserRole | undefined = authData?.data?.role || user?.role;
  const userPermissions: string[] = useMemo(() => {
    return authData?.data?.permissions || [];
  }, [authData?.data?.permissions]);

  const isSuperAdmin = userRole === "SUPER_ADMIN" || userPermissions.includes("admin.all");
  const isAdmin =
    isSuperAdmin ||
    userRole === "PLATFORM_ADMIN" ||
    userRole === "COMPANY_ADMIN";

  /**
   * Check access for a single feature by key
   */
  const checkFeature = useCallback(
    (featureKey: FeatureKey): FeatureAccessResult => {
      const feature = FEATURE_REGISTRY[featureKey];
      if (!feature) {
        return {
          isGranted: false,
          reason: "DENIED",
        };
      }
      return evaluateFeatureAccess(feature, userRole, userPermissions);
    },
    [userRole, userPermissions]
  );

  /**
   * Boolean check for quick conditional rendering
   */
  const canAccess = useCallback(
    (featureKey: FeatureKey): boolean => {
      return checkFeature(featureKey).isGranted;
    },
    [checkFeature]
  );

  /**
   * Direct database permission check
   */
  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (isSuperAdmin) return true;
      return userPermissions.includes(permission);
    },
    [isSuperAdmin, userPermissions]
  );

  /**
   * Check if user has ANY of the specified database permissions
   */
  const hasAnyPermission = useCallback(
    (permissionsList: string[]): boolean => {
      if (isSuperAdmin) return true;
      return permissionsList.some((p) => userPermissions.includes(p));
    },
    [isSuperAdmin, userPermissions]
  );

  /**
   * Filter all platform features accessible to the current user
   */
  const accessibleFeatures = useMemo(() => {
    const all = getAllFeatures();
    return all.filter((feat) => evaluateFeatureAccess(feat, userRole, userPermissions).isGranted);
  }, [userRole, userPermissions]);

  /**
   * Get accessible navigation items for a specific portal category
   */
  const getAccessibleNavItems = useCallback(
    (category?: FeatureCategory): FeatureDefinition[] => {
      return accessibleFeatures.filter((feat) => {
        const matchesCategory = !category || feat.category === category;
        return matchesCategory && feat.navigationVisibility;
      });
    },
    [accessibleFeatures]
  );

  /**
   * Get accessible dashboard cards/widgets for a specific portal category
   */
  const getAccessibleDashboardFeatures = useCallback(
    (category?: FeatureCategory): FeatureDefinition[] => {
      return accessibleFeatures.filter((feat) => {
        const matchesCategory = !category || feat.category === category;
        return matchesCategory && feat.dashboardVisibility;
      });
    },
    [accessibleFeatures]
  );

  return {
    user,
    userRole,
    userPermissions,
    isSuperAdmin,
    isAdmin,
    isLoading,
    isError,
    canAccess,
    checkFeature,
    hasPermission,
    hasAnyPermission,
    accessibleFeatures,
    getAccessibleNavItems,
    getAccessibleDashboardFeatures,
  };
}
