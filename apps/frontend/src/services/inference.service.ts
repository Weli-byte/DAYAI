import { apiClient } from '@/lib/api-client';
import type {
  RunInferencePayload,
  InferenceResultDto,
  PaginatedInferenceHistory,
  InferenceHistoryParams,
} from '@/types/inference';

export const inferenceService = {
  run: (payload: RunInferencePayload) => apiClient.post<InferenceResultDto>('/inference', payload),
  getHistory: (params: InferenceHistoryParams) =>
    apiClient.get<PaginatedInferenceHistory>('/inference/history', { params }),
  getById: (id: string) => apiClient.get<InferenceResultDto>(`/inference/history/${id}`),
};
