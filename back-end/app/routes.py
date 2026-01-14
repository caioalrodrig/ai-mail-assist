from fastapi import APIRouter, Depends

from app.schemas.api import AssistantRequest, AssistantResponse
from app.schemas.agent import PipelineState
from app.dependencies import get_pipeline

router = APIRouter(prefix="/api/v1")


@router.post("/assistant", response_model=AssistantResponse)
async def assistant(request: AssistantRequest, pipeline=Depends(get_pipeline)):
    """Process email and return classification, confidence score with suggested response."""
    initial_state = PipelineState(email_text=request.email_text)
    result = pipeline.invoke(initial_state)

    return AssistantResponse(
        is_productive=result["is_productive"],
        confidence=result["confidence"],
        suggested_response=result["suggested_response"],
    )
