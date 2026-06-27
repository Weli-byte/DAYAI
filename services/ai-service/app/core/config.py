"""Application settings — loaded from environment / .env file."""
from __future__ import annotations

import json
from typing import Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ───────────────────────────────────────────────────────────
    app_env: Literal["development", "production", "test"] = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    app_workers: int = 1
    app_log_level: str = "debug"
    app_version: str = "0.1.0"

    # ── CORS ─────────────────────────────────────────────────────────────────
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:4000"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | list[str]) -> list[str]:
        if isinstance(v, str):
            return json.loads(v)
        return v

    # ── Service URLs ─────────────────────────────────────────────────────────
    backend_url: str = "http://localhost:4000"

    # ── ML ───────────────────────────────────────────────────────────────────
    model_cache_dir: str = "/tmp/model-cache"
    device: Literal["cpu", "cuda", "mps"] = "cpu"

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @property
    def is_development(self) -> bool:
        return self.app_env == "development"


settings = Settings()
