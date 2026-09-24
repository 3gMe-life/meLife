"use client";

import React from "react";
import { useFeatureAccess } from "../hooks/useFeatureAccess";
import type { FeatureKey } from "../types/access-control.types";

export interface FeatureGuardProps {
  /** Feature identifier to check */
  featureKey: FeatureKey;
  /** Optional custom permission override */
  permission?: string;
  /** Custom fallback to render when access is denied (defaults to null) */
  fallback?: React.ReactNode;
  /** Children to render when access is granted */
  children: React.ReactNode;
}

/**
 * FeatureGuard Component
 * Declaratively controls component rendering based on feature access and RBAC permissions.
 *
 * @example
 * <FeatureGuard featureKey="admin.roles">
 *   <RoleMatrixEditor />
 * </FeatureGuard>
 */
export function FeatureGuard({
  featureKey,
  permission,
  fallback = null,
  children,
}: FeatureGuardProps) {
  const { canAccess, hasPermission, isLoading } = useFeatureAccess();

  if (isLoading) {
    return null;
  }

  // Check specific permission if provided
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Check feature access
  if (!canAccess(featureKey)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
