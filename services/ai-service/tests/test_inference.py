from __future__ import annotations

from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


@patch("app.services.model_registry.registry.get_model")
def test_inference_success(mock_get_model) -> None:
    # Set up mocks
    mock_model = MagicMock()
    mock_tokenizer = MagicMock()
    
    # Setup tokenization output
    mock_tokenizer.return_value = {
        "input_ids": MagicMock(shape=(1, 5)),
        "attention_mask": MagicMock()
    }
    mock_tokenizer.pad_token_id = 50256
    
    # Mock generation (output includes prompt ids + generated ids)
    mock_model.generate.return_value = MagicMock()
    mock_model.generate.return_value.__getitem__.return_value = [0] * 10
    
    # Mock tokenizer decode to return output
    mock_tokenizer.decode.return_value = "This is a generated test output."
    
    mock_get_model.return_value = (mock_model, mock_tokenizer)

    # Call POST /v1/inference
    response = client.post(
        "/v1/inference",
        json={"model_id": "distilgpt2", "prompt": "Hello world", "max_tokens": 50, "temperature": 0.7},
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["model_id"] == "distilgpt2"
    assert data["output"] == "This is a generated test output."
    assert "tokens_used" in data
    assert "inference_time_ms" in data


def test_inference_invalid_model() -> None:
    # Call with a model that is not registered
    response = client.post(
        "/v1/inference",
        json={"model_id": "invalid-model", "prompt": "Hello", "max_tokens": 10},
    )
    assert response.status_code == 404
    assert "detail" in response.json()


def test_inference_validation_error() -> None:
    # Empty prompt (prompt requires min_length=1)
    response = client.post(
        "/v1/inference",
        json={"model_id": "distilgpt2", "prompt": "", "max_tokens": 10},
    )
    assert response.status_code == 422


def test_list_models() -> None:
    response = client.get("/v1/models")
    assert response.status_code == 200
    data = response.json()
    assert "models" in data
    assert "total" in data
    assert data["total"] > 0
    assert any(m["model_id"] == "distilgpt2" for m in data["models"])
