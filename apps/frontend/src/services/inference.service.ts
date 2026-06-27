import { apiClient } from '@/lib/api-client';
import type {
  RunInferencePayload,
  InferenceResultDto,
  PaginatedInferenceHistory,
  InferenceHistoryParams,
} from '@/types/inference';

export const inferenceService = {
  run: (payload: RunInferencePayload) => apiClient.post<InferenceResultDto>('/inference', payload),
  getHistory: (params: InferenceHistoryParams) => {
    const q = new URLSearchParams();
    if (params.walletAddress) q.set('walletAddress', params.walletAddress);
    if (params.modelId) q.set('modelId', params.modelId);
    if (params.page) q.set('page', String(params.page));
    if (params.limit) q.set('limit', String(params.limit));
    const str = q.toString();
    return apiClient.get<PaginatedInferenceHistory>(`/inference/history${str ? `?${str}` : ''}`);
  },
  getById: (id: string) => apiClient.get<InferenceResultDto>(`/inference/history/${id}`),
};
