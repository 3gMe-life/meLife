import { useQuery } from "@tanstack/react-query";
import { careerApi } from "../api/career.api";
import {
  CareerRecommendationsResponse,
  CareerDetailDTO,
  CareerMatchDTO,
} from "../types/career.types";

/**
 * Hook to fetch personalized career pathway recommendations.
 */
export function useCareerPathwaysQuery(language = "en") {
  return useQuery<CareerRecommendationsResponse, Error>({
    queryKey: ["careerRecommendations", language],
    queryFn: () => careerApi.getRecommendations(language),
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
export function useAllCareersQuery(language = "en", category?: string, search?: string) {
  return useQuery<CareerMatchDTO[], Error>({
    queryKey: ["allCareers", language, category, search],
    queryFn: () => careerApi.getAllCareers(language, category, search),
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });
}
