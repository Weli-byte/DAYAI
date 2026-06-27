'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inferenceService } from '@/services/inference.service';
import type { RunInferencePayload, InferenceHistoryParams } from '@/types/inference';

export const inferenceKeys = {
  all: ['inference'] as const,
  history: (params: InferenceHistoryParams) => [...inferenceKeys.all, 'history', params] as const,
  detail: (id: string) => [...inferenceKeys.all, 'detail', id] as const,
};

export function useRunInference() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RunInferencePayload) => inferenceService.run(payload),
    onSuccess: () => {
      // Invalidate history query when new inference is run
      qc.invalidateQueries({ queryKey: inferenceKeys.all });
    },
  });
}

export function useInferenceHistory(params: InferenceHistoryParams) {
  return useQuery({
    queryKey: inferenceKeys.history(params),
    queryFn: () => inferenceService.getHistory(params),
    enabled: Boolean(params.walletAddress),
    staleTime: 30_000,
  });
}

export function useInferenceDetail(id: string) {
  return useQuery({
    queryKey: inferenceKeys.detail(id),
    queryFn: () => inferenceService.getById(id),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}
