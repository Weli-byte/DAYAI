/**
 * Application-level enum definitions that mirror Prisma-generated enums.
 * Using these instead of directly importing from @prisma/client avoids
 * resolution issues in pnpm monorepos where the generated client may not
 * be accessible via the hoisted node_modules path.
 */

export const Framework = {
  PYTORCH: 'PYTORCH',
  TENSORFLOW: 'TENSORFLOW',
  SKLEARN: 'SKLEARN',
  ONNX: 'ONNX',
  JAX: 'JAX',
  OTHER: 'OTHER',
} as const;

export type Framework = (typeof Framework)[keyof typeof Framework];

export const ModelStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type ModelStatus = (typeof ModelStatus)[keyof typeof ModelStatus];
