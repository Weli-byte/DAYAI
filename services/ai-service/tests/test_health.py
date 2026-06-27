"""Health endpoint tests."""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_returns_200() -> None:
    response = client.get("/health")
    assert response.status_code == 200


def test_health_response_schema() -> None:
    response = client.get("/health")
    data = response.json()
    assert "status" in data
    assert "service" in data
    assert data["service"] == "ai-service"
    assert "components" in data
    assert "uptime_seconds" in data


def test_health_status_is_healthy() -> None:
    response = client.get("/health")
    data = response.json()
    assert data["status"] in ("healthy", "degraded")


def test_root_endpoint() -> None:
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["service"] == "ai-service"
