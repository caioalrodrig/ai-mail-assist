import fitz  # PyMuPDF


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extract text content from a PDF file.

    Args:
        pdf_bytes: PDF file content as bytes

    Returns:
        Extracted text from all pages

    Raises:
        ValueError: If PDF is empty or cannot be read
    """
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    except Exception as e:
        raise ValueError(f"Failed to open PDF: {e}")

    if doc.page_count == 0:
        raise ValueError("PDF has no pages")

    text_parts = []
    for page in doc:
        text = page.get_text()
        if text.strip():
            text_parts.append(text)

    doc.close()

    if not text_parts:
        raise ValueError("PDF contains no extractable text")

    return "\n".join(text_parts)
