import { fetchApi } from "@/services/api/client";
import {
  CareerMatchDTO,
  CareerDetailDTO,
  CareerRecommendationsResponse,
} from "../types/career.types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const careerApi = {
  /**
   * Fetches personalized career pathway recommendations based on student's psychometric profile.
   */
  async getRecommendations(language = "en"): Promise<CareerRecommendationsResponse> {
    const query = language ? `?language=${encodeURIComponent(language)}` : "";
    const res = await fetchApi<ApiResponse<CareerRecommendationsResponse>>(
      `/careers/recommendations${query}`
    );
    return res.data;
  },

  /**
   * Fetches all available career pathways with optional filters.
   */
  async getAllCareers(
    language = "en",
    category?: string,
    search?: string
  ): Promise<CareerMatchDTO[]> {
    const params = new URLSearchParams();
    if (language) params.append("language", language);
    if (category && category !== "ALL") params.append("category", category);
    if (search) params.append("search", search);

    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetchApi<ApiResponse<CareerMatchDTO[]>>(`/careers${query}`);
    return res.data;
  },

  /**
   * Fetches full career details, roadmap, and alignment reasoning by ID or slug.
   */
  async getCareerDetail(idOrSlug: string, language = "en"): Promise<CareerDetailDTO> {
    const query = language ? `?language=${encodeURIComponent(language)}` : "";
    const res = await fetchApi<ApiResponse<CareerDetailDTO>>(`/careers/${idOrSlug}${query}`);
    return res.data;
  },
};
