from __future__ import annotations

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class InferenceRequest(BaseModel):
    model_id: str = Field(default="distilgpt2", description="Model identifier")
    prompt: str = Field(..., min_length=1, max_length=5000, description="Input prompt")
    max_tokens: int = Field(default=200, ge=1, le=1024, description="Maximum tokens to generate")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0, description="Sampling temperature")


class InferenceResponse(BaseModel):
    output: str
    model_id: str
    tokens_used: int
    inference_time_ms: float
    timestamp: datetime


class ModelInfo(BaseModel):
    model_id: str
    name: str
    description: str
    status: str  # 'loaded' | 'available' | 'error'
    parameters: Optional[str] = None


class ModelsListResponse(BaseModel):
    models: list[ModelInfo]
    total: int
