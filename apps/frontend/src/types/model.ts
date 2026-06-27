// API type definitions for the AI Model Registry
// These mirror the backend DTO shapes exactly.

export type Framework = 'PYTORCH' | 'TENSORFLOW' | 'SKLEARN' | 'ONNX' | 'JAX' | 'OTHER';
export type ModelStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface TagDto {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface OwnerDto {
  id: string;
  username: string;
  avatar?: string | null;
}

export interface ModelVersionDto {
  id: string;
  version: string;
  changelog?: string | null;
  isLatest: boolean;
  createdAt: string;
  // Blockchain & IPFS fields (added in Sprint 2 Milestone 2)
  fileCid?: string | null;
  metadataCid?: string | null;
  nftTokenId?: string | null;
  txHash?: string | null;
  ownerAddress?: string | null;
  fileSize?: number | null;
  sha256?: string | null;
}

export interface ModelDto {
  id: string;
  title: string;
  description?: string | null;
  framework: Framework;
  status: ModelStatus;
  license?: string | null;
  owner?: OwnerDto;
  category?: CategoryDto | null;
  tags: TagDto[];
  latestVersion?: ModelVersionDto | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedModels {
  data: ModelDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateModelPayload {
  title: string;
  description?: string;
  framework?: Framework;
  status?: ModelStatus;
  license?: string;
  ownerId: string;
  categoryId?: string;
  tagIds?: string[];
}

export interface UpdateModelPayload {
  title?: string;
  description?: string;
  framework?: Framework;
  status?: ModelStatus;
  license?: string;
  categoryId?: string;
  tagIds?: string[];
}

// ── Upload types ─────────────────────────────────────────────────────────────

export type UploadJobStatus =
  | 'PENDING'
  | 'UPLOADING_FILE'
  | 'UPLOADING_METADATA'
  | 'MINTING'
  | 'COMPLETED'
  | 'FAILED';

export interface UploadJobDto {
  jobId: string;
  status: UploadJobStatus;
  stage?: string | null;
  fileCid?: string | null;
  metadataCid?: string | null;
  nftTokenId?: string | null;
  txHash?: string | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MintResultDto {
  jobId: string;
  modelId: string;
  versionId: string;
  fileCid: string;
  metadataCid: string;
  metadataUri: string;
  nftTokenId: string;
  txHash: string;
  sha256: string;
  fileSize: number;
}

export interface ModelQueryParams {
  search?: string;
  framework?: Framework;
  status?: ModelStatus;
  categoryId?: string;
  tagId?: string;
  sortBy?: 'title' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
