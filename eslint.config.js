// ESLint flat config (ESLint v9+)
// Root configuration for the entire monorepo.
// Each workspace package can extend or override these rules in its own eslint.config.js.
// https://eslint.org/docs/latest/use/configure/configuration-files-new

import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // ── Global ignores ────────────────────────────────────────────────────────
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/artifacts/**',
      '**/typechain-types/**',
      '**/*.min.js',
      '**/*.d.ts',
    ],
  },

  // ── TypeScript files ──────────────────────────────────────────────────────
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // TypeScript recommended rules
      ...tseslint.configs.recommended.rules,

      // Enforce explicit return types on exported functions for better DX
      '@typescript-eslint/explicit-module-boundary-types': 'warn',

      // Disallow 'any' — forces intentional type-casting with 'unknown'
      '@typescript-eslint/no-explicit-any': 'warn',

      // Unused vars should be errors to prevent dead code accumulation
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Consistent type imports reduce bundle size with tree-shaking
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // No non-null assertions — use optional chaining or proper guards
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },

  // ── JavaScript files ──────────────────────────────────────────────────────
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'prefer-const': 'error',
    },
  },

  // ── Disable style rules that conflict with Prettier ───────────────────────
  eslintConfigPrettier,
];
