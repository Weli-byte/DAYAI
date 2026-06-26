# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.x     | :white_check_mark: |

## Scope

This security policy covers:

- **Smart contracts** (`contracts/`) — highest severity; vulnerabilities can result in loss of user
  funds or locked assets on Monad blockchain.
- **Backend API** (`services/api`) — authentication bypass, data exposure, injection attacks.
- **AI Service** (`services/ai`) — model poisoning vectors, unauthorized model access.
- **Frontend** (`apps/web`) — XSS, wallet connection hijacking, phishing vectors.

Out of scope:

- Issues in third-party dependencies that are already publicly disclosed and tracked upstream.
- Theoretical attacks requiring physical access to infrastructure.
- Social engineering attacks against contributors or users.

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

### How to Report

1. **Email:** Send details to **security@decentralized-ai-marketplace.dev** (placeholder — update
   before going live).
2. **Encryption:** PGP key available at [placeholder — add link to keyserver].
3. **Response Time:** We will acknowledge receipt within **48 hours** and provide an initial
   assessment within **7 days**.

### What to Include

- Affected component(s) and version(s)
- Description of the vulnerability and its impact
- Step-by-step reproduction instructions
- Proof of concept (exploit code, screenshots, or video) if available
- Suggested fix or mitigation, if you have one

### Smart Contract Vulnerabilities

For smart contract issues, please also include:

- The function(s) affected
- Whether the vulnerability requires on-chain state or specific conditions
- Estimated financial impact (e.g., "attacker can drain the entire staking pool")

## Disclosure Policy

We follow **Coordinated Vulnerability Disclosure (CVD)**:

1. Reporter submits vulnerability privately.
2. We confirm, assess severity, and begin remediation.
3. Fix is deployed to production and all affected contracts are patched/re-deployed.
4. We notify affected users if necessary.
5. Public disclosure occurs **90 days** after the report (or sooner if both parties agree).

## Bug Bounty

We intend to launch a formal bug bounty program upon mainnet launch. High-severity smart contract
vulnerabilities will be eligible for significant rewards. Details to be announced.

## Security Best Practices for Contributors

- Never commit private keys, API secrets, or mnemonic phrases — even to private branches.
- Use `.env` files (never committed) for all secrets.
- Smart contract functions that handle funds must have reentrancy guards (`ReentrancyGuard`).
- All user inputs validated before on-chain operations.
- Use OpenZeppelin audited libraries — do not roll your own crypto.
