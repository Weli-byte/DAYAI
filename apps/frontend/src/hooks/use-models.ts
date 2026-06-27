'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  modelsService,
  categoriesService,
  tagsService,
  uploadService,
} from '@/services/models.service';
import type { ModelQueryParams, CreateModelPayload, UpdateModelPayload } from '@/types/model';

// ── Query keys ────────────────────────────────────────────────────────────────
export const modelKeys = {
  all: ['models'] as const,
  list: (params: ModelQueryParams) => [...modelKeys.all, 'list', params] as const,
  detail: (id: string) => [...modelKeys.all, 'detail', id] as const,
  categories: ['categories'] as const,
  tags: ['tags'] as const,
};

// ── List ──────────────────────────────────────────────────────────────────────
export function useModels(params: ModelQueryParams = {}) {
  return useQuery({
    queryKey: modelKeys.list(params),
    queryFn: () => modelsService.list(params),
    staleTime: 30_000,
  });
}

// ── Detail ────────────────────────────────────────────────────────────────────
export function useModel(id: string) {
  return useQuery({
    queryKey: modelKeys.detail(id),
    queryFn: () => modelsService.get(id),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────
export function useCreateModel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateModelPayload) => modelsService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: modelKeys.all });
    },
  });
}

export function useUpdateModel(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateModelPayload) => modelsService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: modelKeys.all });
    },
  });
}

export function useDeleteModel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => modelsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: modelKeys.all });
    },
  });
}

// ── Taxonomy ──────────────────────────────────────────────────────────────────
export function useCategories() {
  return useQuery({
    queryKey: modelKeys.categories,
    queryFn: () => categoriesService.list(),
    staleTime: 5 * 60_000,
  });
}

export function useTags() {
  return useQuery({
    queryKey: modelKeys.tags,
    queryFn: () => tagsService.list(),
    staleTime: 5 * 60_000,
  });
}

// ── Upload + Mint ─────────────────────────────────────────────────────────────
export function useUploadModel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => uploadService.uploadModel(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: modelKeys.all });
    },
  });
}

export function useUploadJobStatus(jobId: string | null) {
  return useQuery({
    queryKey: ['upload-job', jobId],
    queryFn: () => uploadService.getJobStatus(jobId!),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'COMPLETED' || status === 'FAILED') return false;
      return 2000;
    },
  });
}
