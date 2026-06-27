import { apiClient } from '@/lib/api-client';
import { demoInference, demoInferenceHistory } from '@/lib/demo-data';
import type {
  RunInferencePayload,
  InferenceResultDto,
  PaginatedInferenceHistory,
  InferenceHistoryParams,
} from '@/types/inference';

const USE_DEMO_DATA =
  !process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_DEMO_DATA === 'true';

export const inferenceService = {
  run: (payload: RunInferencePayload) =>
    USE_DEMO_DATA
      ? Promise.resolve(demoInference(payload))
      : apiClient
          .post<InferenceResultDto>('/inference', payload)
          .catch(() => demoInference(payload)),
  getHistory: (params: InferenceHistoryParams) => {
    const q = new URLSearchParams();
    if (params.walletAddress) q.set('walletAddress', params.walletAddress);
    if (params.modelId) q.set('modelId', params.modelId);
    if (params.page) q.set('page', String(params.page));
    if (params.limit) q.set('limit', String(params.limit));
    const str = q.toString();
    if (USE_DEMO_DATA) return Promise.resolve(demoInferenceHistory());
    return apiClient
      .get<PaginatedInferenceHistory>(`/inference/history${str ? `?${str}` : ''}`)
      .catch(() => demoInferenceHistory());
  },
  getById: (id: string) => apiClient.get<InferenceResultDto>(`/inference/history/${id}`),
};
