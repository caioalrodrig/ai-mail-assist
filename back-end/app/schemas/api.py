from pydantic import BaseModel, Field


class AssistantRequest(BaseModel):
    email_text: str = Field(..., min_length=1)


class AssistantResponse(BaseModel):
    is_productive: bool = Field(..., description="Whether the email is productive or unproductive")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score of the classification (0.0 to 1.0)")
    suggested_response: str = Field(..., description="AI-generated suggested response to the email")
