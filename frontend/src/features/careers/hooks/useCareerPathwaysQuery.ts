import { useQuery } from "@tanstack/react-query";
import { careerApi, GetRecommendationsParams, GetAllCareersParams } from "../api/career.api";
import {
  CareerRecommendationsResponse,
  CareerDetailDTO,
  CareerMatchDTO,
} from "../types/career.types";

/**
 * Hook to fetch personalized career pathway recommendations.
 */
export function useCareerPathwaysQuery(params?: GetRecommendationsParams | string) {
  const normalizedParams = typeof params === "string" ? { language: params } : (params || {});
  return useQuery<CareerRecommendationsResponse, Error>({
    queryKey: ["careerRecommendations", normalizedParams],
    queryFn: () => careerApi.getRecommendations(normalizedParams),
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch full career pathway details and roadmap.
 */
export function useCareerDetailQuery(idOrSlug?: string, language = "en") {
  return useQuery<CareerDetailDTO, Error>({
    queryKey: ["careerDetail", idOrSlug, language],
    queryFn: () => careerApi.getCareerDetail(idOrSlug!, language),
    enabled: Boolean(idOrSlug),
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch all available careers with optional filters.
 */
export function useAllCareersQuery(params?: GetAllCareersParams | string, category?: string, search?: string) {
  const normalizedParams: GetAllCareersParams =
    typeof params === "string"
      ? { language: params, category, search }
      : (params || {});

  return useQuery<CareerMatchDTO[], Error>({
    queryKey: ["allCareers", normalizedParams],
    queryFn: () => careerApi.getAllCareers(normalizedParams),
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });
}

