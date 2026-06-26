# Contributing to Decentralized AI Marketplace

Thank you for your interest in contributing! This document explains how to get involved, what
standards we follow, and how pull requests are reviewed.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Branch Strategy](#branch-strategy)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Smart Contract Contributions](#smart-contract-contributions)
- [Reporting Bugs](#reporting-bugs)

---

## Prerequisites

| Tool    | Minimum Version | Purpose                         |
| ------- | --------------- | ------------------------------- |
| Node.js | 20.x            | Runtime for JS/TS packages      |
| pnpm    | 9.x             | Package manager & workspaces    |
| Git     | 2.40+           | Version control                 |
| Python  | 3.12+           | AI service development          |
| Docker  | 24+             | Local infrastructure (optional) |

---

## Development Setup

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/decentralized-ai-marketplace.git
cd decentralized-ai-marketplace

# 2. Install dependencies
pnpm install

# 3. Set up git hooks (Husky)
pnpm prepare

# 4. Copy environment file
cp .env.example .env
# Edit .env with your local values

# 5. Verify everything works
pnpm typecheck && pnpm lint && pnpm test
```

---

## Branch Strategy

We follow **trunk-based development** with short-lived feature branches:

| Branch Pattern          | Purpose                                      |
| ----------------------- | -------------------------------------------- |
| `main`                  | Production-ready code — protected            |
| `feat/<short-desc>`     | New feature                                  |
| `fix/<short-desc>`      | Bug fix                                      |
| `chore/<short-desc>`    | Tooling, dependencies, config changes        |
| `docs/<short-desc>`     | Documentation only                           |
| `refactor/<short-desc>` | Code restructure without behavioral change   |
| `contract/<short-desc>` | Solidity smart contract changes              |

Rules:

- Branch from `main` for every change.
- Keep branches focused — one concern per PR.
- Delete your branch after it is merged.

---

## Commit Convention

All commits **must** follow [Conventional Commits](https://www.conventionalcommits.org/). Husky +
Commitlint will reject commits that don't conform.

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### Allowed Types

| Type       | When to Use                                  |
| ---------- | -------------------------------------------- |
| `feat`     | A new feature                                |
| `fix`      | A bug fix                                    |
| `docs`     | Documentation changes only                   |
| `style`    | Formatting, missing semicolons — no logic    |
| `refactor` | Code change that neither fixes nor adds feat |
| `perf`     | Performance improvement                      |
| `test`     | Adding or correcting tests                   |
| `build`    | Build system or dependency changes           |
| `ci`       | CI configuration files and scripts           |
| `chore`    | Maintenance tasks that don't change src      |
| `revert`   | Reverts a previous commit                    |

### Examples

```
feat(contracts): add DataContribution deposit mechanism
fix(api): handle IPFS timeout in model upload endpoint
docs(readme): update Monad testnet RPC instructions
chore(deps): upgrade turbo to 2.1.0
```

---

## Pull Request Process

1. **Open a draft PR early** — signals intent and allows early feedback.
2. **Fill in the PR template** completely. Empty sections will be rejected.
3. **Pass all CI checks** — lint, typecheck, tests, and build must be green.
4. **Request review** from at least one maintainer.
5. **Address all review comments** before requesting re-review.
6. PRs are merged using **Squash and Merge** to keep `main` history linear.

---

## Code Standards

- **TypeScript:** Strict mode enabled. Avoid `any` — use `unknown` + type guards.
- **No unused code:** Unused imports, variables, and functions are CI errors.
- **No `console.log`** in production code — use the shared logger utility.
- **Tests required** for all new features and bug fixes.
- **Prettier + ESLint** must pass: `pnpm lint && pnpm format:check`.

---

## Smart Contract Contributions

Smart contract changes carry additional requirements:

1. **Security review** by a second contributor with Solidity experience.
2. **Natspec documentation** on all public/external functions.
3. **Events** emitted for every state change.
4. **Test coverage ≥ 95%** for contract logic.
5. **No upgradeable proxy** patterns without explicit architectural approval.
6. All contracts must compile with `solc ^0.8.24` with optimizer enabled.

---

## Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md). Include reproduction steps,
environment details, and any relevant logs.

For security vulnerabilities, see [SECURITY.md](.github/SECURITY.md) — **do not** open a public
issue.
