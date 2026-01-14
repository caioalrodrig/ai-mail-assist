from pydantic import BaseModel, Field


class AssistantRequest(BaseModel):
    email_text: str = Field(..., min_length=1)


class AssistantResponse(BaseModel):
    confidence: float = Field(..., ge=0.0, le=1.0)
    suggested_response: str
