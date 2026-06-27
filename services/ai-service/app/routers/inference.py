from __future__ import annotations

from fastapi import APIRouter, HTTPException, status
from app.core.logging import get_logger
from app.schemas.inference import InferenceRequest, InferenceResponse, ModelsListResponse
from app.services.inference_service import inference_service
from app.services.model_registry import registry

logger = get_logger(__name__)
router = APIRouter(prefix="/v1", tags=["inference"])


@router.post(
    "/inference",
    response_model=InferenceResponse,
    status_code=status.HTTP_200_OK,
    summary="Run AI model inference",
)
async def run_inference(request: InferenceRequest) -> InferenceResponse:
    logger.info("Received inference request", model_id=request.model_id)
    try:
        response = await inference_service.run_inference(request)
        return response
    except ValueError as e:
        logger.warning("Inference request validation failed", model_id=request.model_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        ) from e
    except Exception as e:
        logger.exception("Internal error during inference", model_id=request.model_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference execution failed: {str(e)}"
        ) from e


@router.get(
    "/models",
    response_model=ModelsListResponse,
    status_code=status.HTTP_200_OK,
    summary="List available AI models",
)
async def list_models() -> ModelsListResponse:
    logger.info("Listing registered models")
    models = registry.list_models()
    return ModelsListResponse(models=models, total=len(models))
