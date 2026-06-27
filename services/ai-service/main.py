"""
AI Service entrypoint.

Start (dev):   uvicorn main:app --reload --host 0.0.0.0 --port 8000
Start (prod):  uvicorn main:app --workers 2 --host 0.0.0.0 --port 8000
"""
from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import ORJSONResponse

from app.core.config import settings
from app.core.logging import configure_logging, get_logger
from app.routers.health import router as health_router
from app.routers.inference import router as inference_router

configure_logging(settings.app_log_level)
logger = get_logger(__name__)



@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # ── Startup ──────────────────────────────────────────────────────────────
    logger.info(
        "AI Service starting up",
        version=settings.app_version,
        env=settings.app_env,
        device=settings.device,
    )

    # Sprint 5+ will load ML models here:
    # - Sentence-transformer for model embedding
    # - ONNX Runtime sessions for inference
    # - Model registry initialization

    yield

    # ── Shutdown ─────────────────────────────────────────────────────────────
    logger.info("AI Service shutting down")
    # Sprint 5+ will release model resources here


app = FastAPI(
    title="AI Service",
    description=(
        "**Decentralized AI Model Marketplace — AI Inference Service**\n\n"
        "Provides model embedding, inference, and metadata enrichment.\n\n"
        "Sprint 5 will add:\n"
        "- `POST /v1/embed` — sentence embedding for model search\n"
        "- `POST /v1/infer` — model inference\n"
        "- `POST /v1/evaluate` — model quality evaluation\n"
    ),
    version=settings.app_version,
    default_response_class=ORJSONResponse,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# ── Middleware ────────────────────────────────────────────────────────────────
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization", "X-Request-Id"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(health_router)
app.include_router(inference_router)


@app.get("/", include_in_schema=False)
async def root() -> dict[str, str]:
    return {"service": "ai-service", "version": settings.app_version, "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=settings.is_development,
        workers=settings.app_workers if not settings.is_development else 1,
        log_level=settings.app_log_level,
    )
