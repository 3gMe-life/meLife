"use client";

import { useFeatureAccess } from "./useFeatureAccess";
import type { FeatureKey } from "../types/access-control.types";

/**
 * Convenient single-feature access check hook.
 *
 * @example
 * const canViewReports = useCanAccess("counsellor.reports");
 * if (!canViewReports) return null;
 */
export function useCanAccess(featureKey: FeatureKey): boolean {
  const { canAccess } = useFeatureAccess();
  return canAccess(featureKey);
}
