# =============================================================================
# AI Service — Dockerfile
# Python 3.11 slim — CPU-only torch for testnet/dev.
# For GPU production: swap to pytorch/pytorch:2.5.1-cuda12.1-cudnn8-runtime
# =============================================================================

FROM python:3.11-slim AS base

# System dependencies for native extensions (numpy, onnxruntime, tokenizers)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ── Dependencies layer ────────────────────────────────────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ── Application layer ─────────────────────────────────────────────────────────
COPY . .

# ── Security: non-root user ───────────────────────────────────────────────────
RUN useradd --system --uid 1001 --no-create-home aiuser
USER aiuser

EXPOSE 8000
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
