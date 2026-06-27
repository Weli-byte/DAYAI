import { apiClient } from '@/lib/api-client';
import type {
  ReviewResponseDto,
  RatingSummaryDto,
  ProfileResponseDto,
  DashboardAnalyticsDto,
} from '@/types/trust';

export interface CreateReviewPayload {
  modelId: string;
  walletAddress: string;
  content: string;
}

export interface UpdateReviewPayload {
  walletAddress: string;
  content: string;
}

export interface CreateRatingPayload {
  modelId: string;
  walletAddress: string;
  value: number;
}

export interface CreateFavoritePayload {
  modelId: string;
  walletAddress: string;
}

export interface PaginatedReviews {
  items: ReviewResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedFavorites {
  items: any[]; // ModelDto or simple model representation
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const trustService = {
  // ── Reviews ────────────────────────────────────────────────────────────────
  createReview: (payload: CreateReviewPayload) =>
    apiClient.post<ReviewResponseDto>('/reviews', payload),

  updateReview: (id: string, payload: UpdateReviewPayload) =>
    apiClient.patch<ReviewResponseDto>(`/reviews/${id}`, payload),

  deleteReview: (id: string, walletAddress: string) => {
    const q = new URLSearchParams({ walletAddress }).toString();
    return apiClient.delete(`/reviews/${id}?${q}`);
  },

  getReviewsByModel: (modelId: string, page = 1, limit = 20) => {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    return apiClient.get<PaginatedReviews>(`/reviews/model/${modelId}?${q}`);
  },

  // ── Ratings ────────────────────────────────────────────────────────────────
  rateModel: (payload: CreateRatingPayload) => apiClient.post<any>('/ratings', payload),

  getRatingSummary: (modelId: string) =>
    apiClient.get<RatingSummaryDto>(`/ratings/model/${modelId}`),

  getUserRating: (modelId: string, walletAddress: string) =>
    apiClient.get<any>(`/ratings/model/${modelId}/user/${walletAddress}`),

  // ── Favorites ──────────────────────────────────────────────────────────────
  addFavorite: (payload: CreateFavoritePayload) => apiClient.post<any>('/favorites', payload),

  removeFavorite: (modelId: string, walletAddress: string) => {
    const q = new URLSearchParams({ walletAddress }).toString();
    return apiClient.delete(`/favorites/${modelId}?${q}`);
  },

  getFavorites: (walletAddress: string, page = 1, limit = 20) => {
    const q = new URLSearchParams({
      walletAddress,
      page: String(page),
      limit: String(limit),
    }).toString();
    return apiClient.get<PaginatedFavorites>(`/favorites?${q}`);
  },

  isFavorite: (modelId: string, walletAddress: string) => {
    const q = new URLSearchParams({ walletAddress }).toString();
    return apiClient.get<{ isFavorite: boolean }>(`/favorites/${modelId}/status?${q}`);
  },

  // ── Profiles ───────────────────────────────────────────────────────────────
  getProfileByUser: (userId: string) =>
    apiClient.get<ProfileResponseDto>(`/profiles/user/${userId}`),

  getProfileByWallet: (walletAddress: string) =>
    apiClient.get<ProfileResponseDto>(`/profiles/wallet/${walletAddress}`),

  updateProfile: (userId: string, payload: any) =>
    apiClient.patch<any>(`/profiles/${userId}`, payload),

  // ── Analytics ──────────────────────────────────────────────────────────────
  getDashboardAnalytics: () => apiClient.get<DashboardAnalyticsDto>('/analytics/dashboard'),
};
