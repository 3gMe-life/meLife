import { fetchApi } from "@/services/api/client";
import {
  CareerMatchDTO,
  CareerDetailDTO,
  CareerRecommendationsResponse,
  CareerTier,
} from "../types/career.types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
}

export interface GetRecommendationsParams {
  language?: string;
  tier?: CareerTier | "ALL";
  domain?: string;
  family?: string;
  cluster?: string;
  search?: string;
  page?: number;
  limit?: number;
  viewAll?: boolean;
}

export interface GetAllCareersParams {
  language?: string;
  domain?: string;
  family?: string;
  cluster?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  isEmerging?: boolean;
}

export const careerApi = {
  /**
   * Fetches personalized career pathway recommendations based on student's psychometric profile.
   */
  async getRecommendations(params?: GetRecommendationsParams | string): Promise<CareerRecommendationsResponse> {
    const opts: GetRecommendationsParams =
      typeof params === "string" ? { language: params } : (params || {});

    const searchParams = new URLSearchParams();
    if (opts.language) searchParams.append("language", opts.language);
    if (opts.tier && opts.tier !== "ALL") searchParams.append("tier", opts.tier);
    if (opts.domain) searchParams.append("domain", opts.domain);
    if (opts.family) searchParams.append("family", opts.family);
    if (opts.cluster) searchParams.append("cluster", opts.cluster);
    if (opts.search) searchParams.append("search", opts.search);
    if (opts.page) searchParams.append("page", String(opts.page));
    if (opts.limit) searchParams.append("limit", String(opts.limit));
    if (opts.viewAll) searchParams.append("viewAll", "true");

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const res = await fetchApi<ApiResponse<CareerRecommendationsResponse>>(
      `/careers/recommendations${query}`
    );
    return res.data;
  },

  /**
   * Fetches all available career pathways with optional filters.
   */
  async getAllCareers(params?: GetAllCareersParams | string): Promise<CareerMatchDTO[]> {
    const opts: GetAllCareersParams =
      typeof params === "string" ? { language: params } : (params || {});

    const searchParams = new URLSearchParams();
    if (opts.language) searchParams.append("language", opts.language);
    if (opts.domain) searchParams.append("domain", opts.domain);
    if (opts.family) searchParams.append("family", opts.family);
    if (opts.cluster) searchParams.append("cluster", opts.cluster);
    if (opts.category && opts.category !== "ALL") searchParams.append("category", opts.category);
    if (opts.search) searchParams.append("search", opts.search);
    if (opts.page) searchParams.append("page", String(opts.page));
    if (opts.limit) searchParams.append("limit", String(opts.limit));
    if (opts.isEmerging !== undefined) searchParams.append("isEmerging", String(opts.isEmerging));

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
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
