from pydantic import BaseModel, Field

class ClassificationOutput(BaseModel):
    """Output structure for email classification."""
    is_productive: bool = Field(description="Whether the email is productive (requires action) or unproductive (greetings, spam, etc.)")
    confidence: float = Field(description="Confidence score between 0 and 1")


class PipelineState(BaseModel):
    """State that flows through the pipeline."""
    email_text: str
    is_productive: bool = False
    confidence: float = 0.0
    suggested_response: str = ""