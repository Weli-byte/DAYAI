"""Health service — gathers component status for the health endpoint."""
from __future__ import annotations

import time
from typing import Literal

from app.core.config import settings
from app.core.logging import get_logger
from app.schemas.health import ComponentStatus, HealthResponse

logger = get_logger(__name__)

_start_time = time.monotonic()


def get_uptime() -> float:
    return time.monotonic() - _start_time


async def check_model_registry() -> ComponentStatus:
    """
    Checks whether the model registry is ready.
    Sprint 5 will check if model files are loaded in memory.
    Currently returns 'up' with an informational message.
    """
    return ComponentStatus(
        status="up",
        message="No models loaded yet — Sprint 5 will add inference models",
    )


async def get_health() -> HealthResponse:
    model_status = await check_model_registry()

    components = {
        "api": ComponentStatus(status="up", message="FastAPI operational"),
        "model_registry": model_status,
    }

    all_up = all(c.status == "up" for c in components.values())
    any_down = any(c.status == "down" for c in components.values())

    overall: Literal["healthy", "degraded", "unhealthy"]
    if all_up:
        overall = "healthy"
    elif any_down:
        overall = "degraded"
    else:
        overall = "unhealthy"

    logger.debug("Health check completed", status=overall)

    return HealthResponse(
        status=overall,
        environment=settings.app_env,
        uptime_seconds=round(get_uptime(), 2),
        components=components,
    )
