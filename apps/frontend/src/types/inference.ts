export interface RunInferencePayload {
  modelId: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  walletAddress: string;
}

export interface InferenceResultDto {
  id: string;
  output: string;
  modelId: string;
  modelTitle: string;
  tokensUsed: number;
  inferenceTimeMs: number;
  status: InferenceStatus;
  createdAt: string;
}

export type InferenceStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface InferenceHistoryItemDto {
  id: string;
  modelId: string;
  modelTitle: string;
  prompt: string;
  output: string | null;
  status: InferenceStatus;
  tokensUsed: number | null;
  inferenceTimeMs: number | null;
  createdAt: string;
}

export interface PaginatedInferenceHistory {
  items: InferenceHistoryItemDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InferenceHistoryParams {
  walletAddress: string;
  modelId?: string;
  page?: number;
  limit?: number;
}
