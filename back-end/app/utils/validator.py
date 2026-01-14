from fastapi import HTTPException, UploadFile

from app.utils.pdf import extract_text_from_pdf

ALLOWED_CONTENT_TYPES = ["application/pdf"]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


async def validate_and_extract_content(
    email_text: str | None,
    file: UploadFile | None,
) -> str:
    """
    Validate input and extract email content from text or PDF file.

    Args:
        email_text: Plain text email content
        file: PDF file containing the email

    Returns:
        Extracted text content

    Raises:
        HTTPException: If validation fails
    """
    # Validation: must provide exactly one input
    if not email_text and not file:
        raise HTTPException(
            status_code=422,
            detail="Either email_text or file must be provided",
        )

    if email_text and file:
        raise HTTPException(
            status_code=422,
            detail="Provide either email_text or file, not both",
        )

    # Process text input
    if email_text:
        content = email_text.strip()
        if not content:
            raise HTTPException(
                status_code=422,
                detail="email_text cannot be empty",
            )
        return content

    # Process file input
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_CONTENT_TYPES)}",
        )

    file_bytes = await file.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=422,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024 * 1024)}MB",
        )

    try:
        return extract_text_from_pdf(file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
