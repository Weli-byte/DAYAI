import type {
  InferenceResultDto,
  PaginatedInferenceHistory,
  RunInferencePayload,
} from '@/types/inference';
import type {
  CategoryDto,
  CreateModelPayload,
  Framework,
  ModelDto,
  ModelQueryParams,
  PaginatedModels,
  TagDto,
  UpdateModelPayload,
} from '@/types/model';
import type { DashboardAnalyticsDto, RatingSummaryDto, ReviewResponseDto } from '@/types/trust';

const now = '2026-06-27T12:00:00.000Z';

export const demoCategories: CategoryDto[] = [
  {
    id: 'cat-health',
    name: 'Health AI',
    slug: 'health-ai',
    description: 'Privacy-aware diagnosis, triage, and biomedical research models.',
  },
  {
    id: 'cat-language',
    name: 'Language',
    slug: 'language',
    description: 'Summarization, translation, classification, and agent models.',
  },
  {
    id: 'cat-edge',
    name: 'Edge AI',
    slug: 'edge-ai',
    description: 'Small models designed for mobile, IoT, and low-power devices.',
  },
  {
    id: 'cat-data',
    name: 'Data Markets',
    slug: 'data-markets',
    description: 'Community-owned datasets and contribution reward pools.',
  },
];

export const demoTags: TagDto[] = [
  { id: 'tag-monad', name: 'Monad', slug: 'monad' },
  { id: 'tag-ipfs', name: 'IPFS', slug: 'ipfs' },
  { id: 'tag-nft', name: 'Model NFT', slug: 'model-nft' },
  { id: 'tag-sum', name: 'SUM Incentives', slug: 'sum-incentives' },
  { id: 'tag-dao', name: 'DAO', slug: 'dao' },
  { id: 'tag-federated', name: 'Federated Learning', slug: 'federated-learning' },
  { id: 'tag-safety', name: 'Contract Safety', slug: 'contract-safety' },
];

const owner = {
  id: 'user-monad-labs',
  username: 'monad-labs-demo',
  avatar: null,
};

function category(id: string) {
  return demoCategories.find((item) => item.id === id) ?? null;
}

function tags(ids: string[]) {
  return demoTags.filter((item) => ids.includes(item.id));
}

function model(
  id: string,
  title: string,
  description: string,
  framework: Framework,
  categoryId: string,
  tagIds: string[],
  version: string,
  daysAgo: number,
): ModelDto {
  const updated = new Date(Date.parse(now) - daysAgo * 24 * 60 * 60 * 1000).toISOString();

  return {
    id,
    title,
    description,
    framework,
    status: 'PUBLISHED',
    license: 'MIT + On-chain commercial terms',
    owner,
    category: category(categoryId),
    tags: tags(tagIds),
    createdAt: updated,
    updatedAt: updated,
    latestVersion: {
      id: `${id}-v${version}`,
      version,
      changelog:
        'Latest IPFS artifact was registered on Monad Testnet with auditable model metadata.',
      isLatest: true,
      createdAt: updated,
      fileCid: `bafy${id.replaceAll('-', '').slice(0, 18)}modelweights`,
      metadataCid: `bafy${id.replaceAll('-', '').slice(0, 18)}metadata`,
      nftTokenId: String(1000 + daysAgo),
      txHash: `0x${id.replaceAll('-', '').padEnd(64, '0').slice(0, 64)}`,
      ownerAddress: '0x7A44dA2E9eF2B8bD2dF0143aA12A9b4A7d7c1014',
      fileSize: 24_800_000 + daysAgo * 1_000_000,
      sha256: `${id.replaceAll('-', '')}`.padEnd(64, 'a').slice(0, 64),
    },
  };
}

export const demoModels: ModelDto[] = [
  model(
    'health-triage-sum',
    'Health Triage SUM Model',
    'A compact medical triage classifier with deposit-backed data contributions and transparent version history.',
    'PYTORCH',
    'cat-health',
    ['tag-monad', 'tag-ipfs', 'tag-nft', 'tag-sum'],
    '1.4.2',
    1,
  ),
  model(
    'edge-vision-cifar',
    'EdgeVision CIFAR Verifier',
    'Mobile-friendly image classifier optimized for edge devices and federated update experiments.',
    'ONNX',
    'cat-edge',
    ['tag-federated', 'tag-ipfs', 'tag-nft'],
    '0.9.8',
    3,
  ),
  model(
    'contract-sentinel-evm',
    'Contract Sentinel EVMbench',
    'Smart contract vulnerability assistant inspired by EVM security evaluation workflows.',
    'OTHER',
    'cat-language',
    ['tag-safety', 'tag-monad', 'tag-dao'],
    '2.1.0',
    5,
  ),
  model(
    'open-data-quality-oracle',
    'Open Data Quality Oracle',
    'Scores contributed datasets before rewards are released from the marketplace incentive pool.',
    'SKLEARN',
    'cat-data',
    ['tag-sum', 'tag-dao', 'tag-monad'],
    '1.1.0',
    8,
  ),
  model(
    'research-summary-agent',
    'Research Summary Agent',
    'Summarizes papers, model cards, and DAO proposals for community review before upgrades.',
    'TENSORFLOW',
    'cat-language',
    ['tag-dao', 'tag-ipfs'],
    '0.7.5',
    12,
  ),
  model(
    'air-quality-tiny-forecast',
    'Air Quality Tiny Forecast',
    'Low-cost public benefit forecasting model for local air quality signals and sensor networks.',
    'JAX',
    'cat-edge',
    ['tag-federated', 'tag-monad'],
    '1.0.3',
    17,
  ),
];

const STORAGE_KEY = 'monad-ai-marketplace-demo-models';

function readStoredModels(): ModelDto[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ModelDto[]) : [];
  } catch {
    return [];
  }
}

function writeStoredModels(models: ModelDto[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
}

function allModels(): ModelDto[] {
  return [...readStoredModels(), ...demoModels];
}

export function listDemoModels(params: ModelQueryParams = {}): PaginatedModels {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const search = params.search?.trim().toLowerCase();

  let rows = allModels();

  if (params.status) rows = rows.filter((item) => item.status === params.status);
  if (params.framework) rows = rows.filter((item) => item.framework === params.framework);
  if (params.categoryId) rows = rows.filter((item) => item.category?.id === params.categoryId);
  if (params.tagId) rows = rows.filter((item) => item.tags.some((tag) => tag.id === params.tagId));
  if (search) {
    rows = rows.filter((item) =>
      [item.title, item.description, item.category?.name, ...item.tags.map((tag) => tag.name)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(search),
    );
  }

  const sortBy = params.sortBy ?? 'createdAt';
  const sortOrder = params.sortOrder ?? 'desc';
  rows.sort((a, b) => {
    const aValue = sortBy === 'title' ? a.title : a[sortBy];
    const bValue = sortBy === 'title' ? b.title : b[sortBy];
    return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  const start = (page - 1) * limit;
  const data = rows.slice(start, start + limit);

  return {
    data,
    total: rows.length,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(rows.length / limit)),
  };
}

export function getDemoModel(id: string): ModelDto | undefined {
  return allModels().find((item) => item.id === id);
}

export function createDemoModel(payload: CreateModelPayload): ModelDto {
  const createdAt = new Date().toISOString();
  const normalizedTitle = payload.title.trim() || 'Untitled AI Model';
  const id = `${normalizedTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}-${Date.now()}`;

  const created: ModelDto = {
    id,
    title: normalizedTitle,
    description:
      payload.description || 'Community-published model registered in the local demo marketplace.',
    framework: payload.framework ?? 'OTHER',
    status: payload.status ?? 'PUBLISHED',
    license: payload.license || 'MIT + On-chain commercial terms',
    owner: {
      id: payload.ownerId,
      username: 'local-creator',
      avatar: null,
    },
    category: payload.categoryId ? category(payload.categoryId) : null,
    tags: payload.tagIds ? tags(payload.tagIds) : [],
    createdAt,
    updatedAt: createdAt,
    latestVersion: {
      id: `${id}-v1`,
      version: '1.0.0',
      changelog: 'Initial marketplace registration in local demo mode.',
      isLatest: true,
      createdAt,
      fileCid: `bafy${id.replaceAll('-', '').slice(0, 18)}localweights`,
      metadataCid: `bafy${id.replaceAll('-', '').slice(0, 18)}localmetadata`,
      nftTokenId: String(Math.floor(Date.now() / 1000)),
      txHash: `0x${id.replaceAll('-', '').padEnd(64, '1').slice(0, 64)}`,
      ownerAddress: '0x7A44dA2E9eF2B8bD2dF0143aA12A9b4A7d7c1014',
      fileSize: 12_400_000,
      sha256: id.replaceAll('-', '').padEnd(64, 'b').slice(0, 64),
    },
  };

  writeStoredModels([created, ...readStoredModels()]);
  return created;
}

export function updateDemoModel(id: string, payload: UpdateModelPayload): ModelDto {
  const storedModels = readStoredModels();
  const storedIndex = storedModels.findIndex((item) => item.id === id);
  const existing = storedIndex >= 0 ? storedModels[storedIndex] : getDemoModel(id);
  if (!existing) throw new Error('This model does not exist in the demo catalog.');

  const updated: ModelDto = {
    ...existing,
    title: payload.title ?? existing.title,
    description: payload.description ?? existing.description,
    framework: payload.framework ?? existing.framework,
    status: payload.status ?? existing.status,
    license: payload.license ?? existing.license,
    category: payload.categoryId ? category(payload.categoryId) : existing.category,
    tags: payload.tagIds ? tags(payload.tagIds) : existing.tags,
    updatedAt: new Date().toISOString(),
  };

  if (storedIndex >= 0) {
    storedModels[storedIndex] = updated;
    writeStoredModels(storedModels);
  }

  return updated;
}

export function removeDemoModel(id: string) {
  writeStoredModels(readStoredModels().filter((item) => item.id !== id));
}

export const demoAnalytics: DashboardAnalyticsDto = {
  totalModels: demoModels.length,
  totalNftModels: demoModels.filter((item) => item.latestVersion?.nftTokenId).length,
  totalUsers: 128,
  activeCreators: 18,
  totalInferences: 2483,
  averageRating: 4.7,
  topCategories: demoCategories.map((item) => ({
    name: item.name,
    count: demoModels.filter((modelItem) => modelItem.category?.id === item.id).length,
  })),
  recentUploads: demoModels.slice(0, 4).map((item) => ({
    modelId: item.id,
    title: item.title,
    version: item.latestVersion?.version ?? '1.0.0',
    creator: item.owner?.username ?? 'community',
    createdAt: item.updatedAt,
  })),
};

export function demoRatingSummary(modelId: string): RatingSummaryDto {
  const offset = demoModels.findIndex((item) => item.id === modelId);
  return {
    average: 4.4 + Math.max(offset, 0) * 0.07,
    count: 18 + Math.max(offset, 0) * 6,
  };
}

export function demoReviews(modelId: string) {
  const modelTitle = getDemoModel(modelId)?.title ?? 'this model';
  const items: ReviewResponseDto[] = [
    {
      id: `${modelId}-review-1`,
      modelId,
      content: `${modelTitle} has a clear on-chain version trail and useful IPFS metadata for audits.`,
      user: {
        id: 'reviewer-1',
        username: 'dao-reviewer',
        avatar: null,
        walletAddress: '0x9bE3f0C1A10B5a14101010101010101010101010',
      },
      createdAt: now,
      updatedAt: now,
    },
  ];

  return {
    items,
    total: items.length,
    page: 1,
    limit: 20,
    totalPages: 1,
  };
}

export function demoInference(payload: RunInferencePayload): InferenceResultDto {
  const selectedModel = getDemoModel(payload.modelId);

  return {
    id: `demo-inference-${Date.now()}`,
    modelId: payload.modelId,
    modelTitle: selectedModel?.title ?? 'Demo Model',
    status: 'COMPLETED',
    tokensUsed: Math.min(payload.maxTokens ?? 200, 184),
    inferenceTimeMs: 742,
    createdAt: new Date().toISOString(),
    output: [
      `Demo response from ${selectedModel?.title ?? 'the marketplace model'}.`,
      `Prompt analyzed: "${payload.prompt.slice(0, 160)}${payload.prompt.length > 160 ? '...' : ''}"`,
      'Recommended next action: register the model artifact on IPFS, mint the model NFT on Monad Testnet, and route community data contributions through a deposit-backed review queue.',
    ].join('\n\n'),
  };
}

export function demoInferenceHistory(): PaginatedInferenceHistory {
  return {
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  };
}
