from __future__ import annotations

import time
from datetime import datetime
import torch
from app.core.logging import get_logger
from app.schemas.inference import InferenceRequest, InferenceResponse
from app.services.model_registry import registry

logger = get_logger(__name__)


class InferenceService:
    def __init__(self, model_registry=registry):
        self.registry = model_registry

    async def run_inference(self, request: InferenceRequest) -> InferenceResponse:
        logger.info("Starting inference execution", model_id=request.model_id)
        start_time = time.perf_counter()

        try:
            model, tokenizer = self.registry.get_model(request.model_id)
        except KeyError as e:
            logger.error("Model not registered", model_id=request.model_id)
            raise ValueError(f"Model '{request.model_id}' is not registered.") from e
        except Exception as e:
            logger.error("Failed to retrieve model", model_id=request.model_id, error=str(e))
            raise

        try:
            # Tokenize input prompt
            inputs = tokenizer(request.prompt, return_tensors="pt")
            input_ids = inputs["input_ids"]
            
            # Move inputs to correct device
            device = next(model.parameters()).device
            input_ids = input_ids.to(device)
            attention_mask = inputs.get("attention_mask")
            if attention_mask is not None:
                attention_mask = attention_mask.to(device)

            input_length = input_ids.shape[1]

            # Run inference
            with torch.no_grad():
                output_ids = model.generate(
                    input_ids,
                    attention_mask=attention_mask,
                    max_new_tokens=request.max_tokens,
                    temperature=request.temperature if request.temperature > 0 else None,
                    do_sample=request.temperature > 0,
                    pad_token_id=tokenizer.pad_token_id,
                )

            # Measure generation metrics
            end_time = time.perf_counter()
            inference_time_ms = (end_time - start_time) * 1000.0

            # Decode only new tokens
            new_tokens = output_ids[0][input_length:]
            output_text = tokenizer.decode(new_tokens, skip_special_tokens=True)
            tokens_used = len(new_tokens)

            logger.info(
                "Inference completed successfully",
                model_id=request.model_id,
                time_ms=inference_time_ms,
                tokens=tokens_used,
            )

            return InferenceResponse(
                output=output_text,
                model_id=request.model_id,
                tokens_used=tokens_used,
                inference_time_ms=inference_time_ms,
                timestamp=datetime.utcnow(),
            )
        except Exception as e:
            logger.exception("Error during model generation", model_id=request.model_id)
            raise RuntimeError(f"Error during model generation: {str(e)}") from e


inference_service = InferenceService()
