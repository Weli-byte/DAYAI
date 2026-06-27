/**
 * Frontend service layer for the AI Model Registry API.
 * Thin wrapper around apiClient — keeps components free of HTTP concerns.
 */
import { apiClient } from '@/lib/api-client';
import type {
  ModelDto,
  PaginatedModels,
  CreateModelPayload,
  UpdateModelPayload,
  ModelQueryParams,
  CategoryDto,
  TagDto,
  MintResultDto,
  UploadJobDto,
} from '@/types/model';

function buildQuery(params: ModelQueryParams): string {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.framework) qs.set('framework', params.framework);
  if (params.status) qs.set('status', params.status);
  if (params.categoryId) qs.set('categoryId', params.categoryId);
  if (params.tagId) qs.set('tagId', params.tagId);
  if (params.sortBy) qs.set('sortBy', params.sortBy);
  if (params.sortOrder) qs.set('sortOrder', params.sortOrder);
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const modelsService = {
  list: (params: ModelQueryParams = {}) =>
    apiClient.get<PaginatedModels>(`/models${buildQuery(params)}`),

  get: (id: string) => apiClient.get<ModelDto>(`/models/${id}`),

  create: (payload: CreateModelPayload) => apiClient.post<ModelDto>('/models', payload),

  update: (id: string, payload: UpdateModelPayload) =>
    apiClient.patch<ModelDto>(`/models/${id}`, payload),

  remove: (id: string) => apiClient.delete(`/models/${id}`),
};

export const categoriesService = {
  list: () => apiClient.get<CategoryDto[]>('/categories'),
};

export const tagsService = {
  list: () => apiClient.get<TagDto[]>('/tags'),
};

export const uploadService = {
  uploadModel: (formData: FormData) => {
    const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/api/v1`;
    // Use raw fetch for multipart — apiClient uses JSON headers
    return fetch(`${BASE_URL}/upload/model`, { method: 'POST', body: formData }).then(
      async (res) => {
        if (!res.ok) {
          const err = (await res.json().catch(() => ({ message: res.statusText }))) as {
            message?: string;
          };
          throw new Error(err.message ?? 'Upload failed');
        }
        const json = (await res.json()) as { success: boolean; data: MintResultDto };
        return json.data;
      },
    );
  },

  getJobStatus: (jobId: string) => apiClient.get<UploadJobDto>(`/upload/jobs/${jobId}`),
};
