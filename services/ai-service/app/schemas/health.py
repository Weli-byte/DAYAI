"""Health check response schemas."""
from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ComponentStatus(BaseModel):
    status: Literal["up", "down"]
    message: str | None = None


class HealthResponse(BaseModel):
    status: Literal["healthy", "degraded", "unhealthy"]
    service: str = Field(default="ai-service")
    version: str = Field(default="0.1.0")
    environment: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    uptime_seconds: float
    components: dict[str, ComponentStatus]

    model_config = {"json_schema_extra": {
        "example": {
            "status": "healthy",
            "service": "ai-service",
            "version": "0.1.0",
            "environment": "development",
            "timestamp": "2026-06-27T12:00:00Z",
            "uptime_seconds": 42.7,
            "components": {
                "api": {"status": "up", "message": "FastAPI operational"},
                "model_registry": {"status": "up", "message": "No models loaded (Sprint 5)"},
            },
        }
    }}
