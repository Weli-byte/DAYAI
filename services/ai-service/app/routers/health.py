"""Health check router."""
from __future__ import annotations

from fastapi import APIRouter

from app.schemas.health import HealthResponse
from app.services.health_service import get_health

router = APIRouter(prefix="/health", tags=["health"])


@router.get(
    "",
    response_model=HealthResponse,
    summary="Health check",
    description=(
        "Returns the operational status of the AI service and its components. "
        "Component `model_registry` will report active models once Sprint 5 inference is added."
    ),
    responses={
        200: {"description": "Service is healthy or degraded"},
        503: {"description": "Service is unhealthy"},
    },
)
async def health_check() -> HealthResponse:
    return await get_health()
