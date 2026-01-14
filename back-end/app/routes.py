from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.schemas.api import AssistantResponse
from app.schemas.agent import PipelineState
from app.dependencies import get_pipeline
from app.utils import validate_and_extract_content

router = APIRouter(prefix="/api/v1")


@router.post("/assistant", response_model=AssistantResponse)
async def assistant(
    pipeline=Depends(get_pipeline),
    email_text: str | None = Form(default=None),
    file: UploadFile | None = File(default=None),
):
    """
    Process email and return classification, confidence score with suggested response.
    """
    content = await validate_and_extract_content(email_text, file)

    initial_state = PipelineState(email_text=content)
    result = pipeline.invoke(initial_state)

    return AssistantResponse(
        is_productive=result["is_productive"],
        confidence=result["confidence"],
        suggested_response=result["suggested_response"],
    )
