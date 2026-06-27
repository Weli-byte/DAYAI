from __future__ import annotations

from typing import Any, Callable, Dict, List, Tuple
from app.core.logging import get_logger
from app.core.config import settings
from app.schemas.inference import ModelInfo

logger = get_logger(__name__)


class ModelRegistry:
    _instance: ModelRegistry | None = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        # Prevent re-initialization if singleton already initialized
        if hasattr(self, "_initialized") and self._initialized:
            return

        self._models: Dict[str, Tuple[Any, Any]] = {}  # model_id -> (model, tokenizer)
        self._registry: Dict[str, Dict[str, Any]] = {}  # model_id -> metadata & loader
        self._initialized = True

        # Register default demo model
        self.register_model(
            model_id="distilgpt2",
            name="DistilGPT2",
            description="Lightweight text generation model by Hugging Face (approx. 82MB)",
            loader_fn=self._load_distilgpt2,
        )

    def register_model(
        self,
        model_id: str,
        name: str,
        description: str,
        loader_fn: Callable[[str, str], Tuple[Any, Any]],
    ) -> None:
        """Register a model with metadata and a loader function (lazy-loaded)."""
        self._registry[model_id] = {
            "name": name,
            "description": description,
            "loader_fn": loader_fn,
            "status": "available",
        }
        logger.info("Registered model", model_id=model_id, name=name)

    def get_model(self, model_id: str) -> Tuple[Any, Any]:
        """Get or lazy-load model and tokenizer by model_id."""
        if model_id not in self._registry:
            raise KeyError(f"Model '{model_id}' is not registered.")

        if model_id not in self._models:
            reg_entry = self._registry[model_id]
            logger.info("Lazy-loading model", model_id=model_id)
            reg_entry["status"] = "loading"
            try:
                loader = reg_entry["loader_fn"]
                model, tokenizer = loader(settings.model_cache_dir, settings.device)
                self._models[model_id] = (model, tokenizer)
                reg_entry["status"] = "loaded"
                logger.info("Model loaded successfully", model_id=model_id)
            except Exception as e:
                reg_entry["status"] = "error"
                logger.error("Failed to load model", model_id=model_id, error=str(e))
                raise RuntimeError(f"Failed to load model {model_id}: {str(e)}") from e

        return self._models[model_id]

    def list_models(self) -> List[ModelInfo]:
        """List all registered models and their statuses."""
        return [
            ModelInfo(
                model_id=m_id,
                name=info["name"],
                description=info["description"],
                status=info["status"],
            )
            for m_id, info in self._registry.items()
        ]

    def is_loaded(self, model_id: str) -> bool:
        """Check if a model is loaded in memory."""
        return model_id in self._models

    def _load_distilgpt2(self, cache_dir: str, device: str) -> Tuple[Any, Any]:
        """Loader function for distilgpt2 causal language model."""
        from transformers import AutoModelForCausalLM, AutoTokenizer
        import torch

        logger.info("Loading distilgpt2 from transformers", cache_dir=cache_dir, device=device)
        tokenizer = AutoTokenizer.from_pretrained("distilgpt2", cache_dir=cache_dir)
        
        # Configure padding token if not set
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token

        model = AutoModelForCausalLM.from_pretrained("distilgpt2", cache_dir=cache_dir)
        model.to(device)
        model.eval()

        return model, tokenizer


# Export a global registry instance
registry = ModelRegistry()
