import { apiClient } from '@/lib/api-client';
import { demoAnalytics, demoRatingSummary, demoReviews, listDemoModels } from '@/lib/demo-data';
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

const USE_DEMO_DATA =
  !process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_DEMO_DATA === 'true';

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
    if (USE_DEMO_DATA) return Promise.resolve({ ...demoReviews(modelId), page, limit });
    const q = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    return apiClient
      .get<PaginatedReviews>(`/reviews/model/${modelId}?${q}`)
      .catch(() => ({ ...demoReviews(modelId), page, limit }));
  },

  // ── Ratings ────────────────────────────────────────────────────────────────
  rateModel: (payload: CreateRatingPayload) => apiClient.post<any>('/ratings', payload),

  getRatingSummary: (modelId: string) =>
    USE_DEMO_DATA
      ? Promise.resolve(demoRatingSummary(modelId))
      : apiClient
          .get<RatingSummaryDto>(`/ratings/model/${modelId}`)
          .catch(() => demoRatingSummary(modelId)),

  getUserRating: (modelId: string, walletAddress: string) =>
    apiClient.get<any>(`/ratings/model/${modelId}/user/${walletAddress}`),

  // ── Favorites ──────────────────────────────────────────────────────────────
  addFavorite: (payload: CreateFavoritePayload) => apiClient.post<any>('/favorites', payload),

  removeFavorite: (modelId: string, walletAddress: string) => {
    const q = new URLSearchParams({ walletAddress }).toString();
    return apiClient.delete(`/favorites/${modelId}?${q}`);
  },

  getFavorites: (walletAddress: string, page = 1, limit = 20) => {
    if (USE_DEMO_DATA) {
      const models = listDemoModels({ page, limit }).data;
      return Promise.resolve({
        items: models.slice(0, 2),
        total: 2,
        page,
        limit,
        totalPages: 1,
      });
    }
    const q = new URLSearchParams({
      walletAddress,
      page: String(page),
      limit: String(limit),
    }).toString();
    return apiClient.get<PaginatedFavorites>(`/favorites?${q}`).catch(() => {
      const models = listDemoModels({ page, limit }).data;
      return {
        items: models.slice(0, 2),
        total: 2,
        page,
        limit,
        totalPages: 1,
      };
    });
  },

  isFavorite: (modelId: string, walletAddress: string) => {
    if (USE_DEMO_DATA) return Promise.resolve({ isFavorite: false });
    const q = new URLSearchParams({ walletAddress }).toString();
    return apiClient
      .get<{ isFavorite: boolean }>(`/favorites/${modelId}/status?${q}`)
      .catch(() => ({ isFavorite: false }));
  },

  // ── Profiles ───────────────────────────────────────────────────────────────
  getProfileByUser: (userId: string) =>
    apiClient.get<ProfileResponseDto>(`/profiles/user/${userId}`),

  getProfileByWallet: (walletAddress: string) =>
    apiClient.get<ProfileResponseDto>(`/profiles/wallet/${walletAddress}`),

  updateProfile: (userId: string, payload: any) =>
    apiClient.patch<any>(`/profiles/${userId}`, payload),

  // ── Analytics ──────────────────────────────────────────────────────────────
  getDashboardAnalytics: () =>
    USE_DEMO_DATA
      ? Promise.resolve(demoAnalytics)
      : apiClient.get<DashboardAnalyticsDto>('/analytics/dashboard').catch(() => demoAnalytics),
};
