export * from './routes';

// ── Monad Network ────────────────────────────────────────────────────────────
export const MONAD_CHAIN_ID = 10143;
export const MONAD_RPC_URL = 'https://10143.rpc.thirdweb.com';
export const MONAD_BLOCK_EXPLORER = 'https://monad-testnet.socialscan.io';
export const MONAD_BLOCK_TIME_MS = 1000; // ~1 second

// ── IPFS ─────────────────────────────────────────────────────────────────────
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs';

// ── Pagination ────────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 12;

// ── Supported model file types ────────────────────────────────────────────────
export const SUPPORTED_MODEL_EXTENSIONS = ['.pkl', '.pt', '.pth', '.onnx', '.h5', '.pb'] as const;
export const MAX_MODEL_FILE_SIZE_MB = 500;
