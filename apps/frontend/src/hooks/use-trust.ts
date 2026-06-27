'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trustService } from '@/services/trust.service';
import type {
  CreateReviewPayload,
  UpdateReviewPayload,
  CreateRatingPayload,
  CreateFavoritePayload,
} from '@/services/trust.service';

export const trustKeys = {
  all: ['trust'] as const,
  reviews: (modelId: string) => [...trustKeys.all, 'reviews', modelId] as const,
  ratingSummary: (modelId: string) => [...trustKeys.all, 'rating-summary', modelId] as const,
  userRating: (modelId: string, walletAddress: string) =>
    [...trustKeys.all, 'user-rating', modelId, walletAddress] as const,
  favorites: (walletAddress: string) => [...trustKeys.all, 'favorites', walletAddress] as const,
  favoriteStatus: (modelId: string, walletAddress: string) =>
    [...trustKeys.all, 'favorite-status', modelId, walletAddress] as const,
  profile: (userId: string) => [...trustKeys.all, 'profile', userId] as const,
  profileWallet: (walletAddress: string) =>
    [...trustKeys.all, 'profile-wallet', walletAddress] as const,
  analytics: () => [...trustKeys.all, 'analytics'] as const,
};

// ── Reviews Hooks ────────────────────────────────────────────────────────────
export function useReviews(modelId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: [...trustKeys.reviews(modelId), page, limit],
    queryFn: () => trustService.getReviewsByModel(modelId, page, limit),
    enabled: Boolean(modelId),
    staleTime: 10_000,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => trustService.createReview(payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: trustKeys.reviews(variables.modelId) });
    },
  });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReviewPayload }) =>
      trustService.updateReview(id, payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: trustKeys.reviews(data.modelId) });
    },
  });
}

export function useDeleteReview(modelId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, walletAddress }: { id: string; walletAddress: string }) =>
      trustService.deleteReview(id, walletAddress),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: trustKeys.reviews(modelId) });
    },
  });
}

// ── Ratings Hooks ────────────────────────────────────────────────────────────
export function useRatingSummary(modelId: string) {
  return useQuery({
    queryKey: trustKeys.ratingSummary(modelId),
    queryFn: () => trustService.getRatingSummary(modelId),
    enabled: Boolean(modelId),
    staleTime: 30_000,
  });
}

export function useRateModel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRatingPayload) => trustService.rateModel(payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: trustKeys.ratingSummary(variables.modelId) });
      qc.invalidateQueries({
        queryKey: trustKeys.userRating(variables.modelId, variables.walletAddress),
      });
    },
  });
}

export function useUserRating(modelId: string, walletAddress: string) {
  return useQuery({
    queryKey: trustKeys.userRating(modelId, walletAddress),
    queryFn: () => trustService.getUserRating(modelId, walletAddress),
    enabled: Boolean(modelId) && Boolean(walletAddress),
    staleTime: 30_000,
  });
}

// ── Favorites Hooks ──────────────────────────────────────────────────────────
export function useFavorites(walletAddress: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: [...trustKeys.favorites(walletAddress), page, limit],
    queryFn: () => trustService.getFavorites(walletAddress, page, limit),
    enabled: Boolean(walletAddress),
    staleTime: 30_000,
  });
}

export function useAddFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFavoritePayload) => trustService.addFavorite(payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: trustKeys.favorites(variables.walletAddress) });
      qc.invalidateQueries({
        queryKey: trustKeys.favoriteStatus(variables.modelId, variables.walletAddress),
      });
    },
  });
}

export function useRemoveFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ modelId, walletAddress }: { modelId: string; walletAddress: string }) =>
      trustService.removeFavorite(modelId, walletAddress),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: trustKeys.favorites(variables.walletAddress) });
      qc.invalidateQueries({
        queryKey: trustKeys.favoriteStatus(variables.modelId, variables.walletAddress),
      });
    },
  });
}

export function useIsFavorite(modelId: string, walletAddress: string) {
  return useQuery({
    queryKey: trustKeys.favoriteStatus(modelId, walletAddress),
    queryFn: () => trustService.isFavorite(modelId, walletAddress),
    enabled: Boolean(modelId) && Boolean(walletAddress),
    staleTime: 30_000,
  });
}

// ── Profiles Hooks ───────────────────────────────────────────────────────────
export function useProfile(userId: string) {
  return useQuery({
    queryKey: trustKeys.profile(userId),
    queryFn: () => trustService.getProfileByUser(userId),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
}

export function useProfileByWallet(walletAddress: string) {
  return useQuery({
    queryKey: trustKeys.profileWallet(walletAddress),
    queryFn: () => trustService.getProfileByWallet(walletAddress),
    enabled: Boolean(walletAddress),
    staleTime: 60_000,
  });
}

export function useUpdateProfile(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => trustService.updateProfile(userId, payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: trustKeys.profile(userId) });
      if (data?.profile?.walletAddress) {
        qc.invalidateQueries({ queryKey: trustKeys.profileWallet(data.profile.walletAddress) });
      }
    },
  });
}

// ── Analytics Hooks ──────────────────────────────────────────────────────────
export function useDashboardAnalytics() {
  return useQuery({
    queryKey: trustKeys.analytics(),
    queryFn: () => trustService.getDashboardAnalytics(),
    staleTime: 60_000,
  });
}
