// ── Blockchain primitives ─────────────────────────────────────────────────────
export type HexAddress = `0x${string}`;
export type IPFSHash = string;
export type TokenId = bigint;
export type TransactionHash = `0x${string}`;

// ── AI Model ──────────────────────────────────────────────────────────────────
export type ModelCategory =
  | 'classification'
  | 'nlp'
  | 'vision'
  | 'generative'
  | 'health'
  | 'finance'
  | 'other';

export type ModelLicense = 'MIT' | 'Apache-2.0' | 'CC-BY-4.0' | 'proprietary';

export interface ModelMetadata {
  name: string;
  description: string;
  version: string;
  category: ModelCategory;
  license: ModelLicense;
  framework: string;
  inputShape?: string;
  outputShape?: string;
  accuracy?: number;
  tags: string[];
}

export interface AIModel {
  id: string;
  tokenId: TokenId;
  owner: HexAddress;
  contentHash: IPFSHash;
  metadata: ModelMetadata;
  priceInMon: bigint;
  contributorCount: number;
  purchaseCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ── Data Contribution ─────────────────────────────────────────────────────────
export type ContributionStatus = 'pending' | 'accepted' | 'rejected';

export interface DataContribution {
  id: string;
  modelId: string;
  contributor: HexAddress;
  dataHash: IPFSHash;
  deposit: bigint;
  status: ContributionStatus;
  reward?: bigint;
  submittedAt: Date;
}

// ── User / Wallet ─────────────────────────────────────────────────────────────
export interface WalletState {
  address: HexAddress | null;
  isConnected: boolean;
  chainId: number | null;
  balance: bigint | null;
}

// ── API Response wrappers ─────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
