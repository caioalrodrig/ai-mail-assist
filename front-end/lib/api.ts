const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface AssistantResponse {
  is_productive: boolean;
  confidence: number;
  suggested_response: string;
}

export interface ApiError {
  error: string;
  message: string;
  detail?: string;
}

/**
 * Classify email from text content
 */
export async function classifyEmail(
  emailText: string
): Promise<AssistantResponse> {
  const formData = new FormData();
  formData.append("email_text", emailText);

  const response = await fetch(`${API_URL}/api/v1/assistant`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(
      error.message || error.error || error.detail || "Failed to classify email"
    );
  }

  return response.json();
}

/**
 * Classify email from PDF file
 */
export async function classifyEmailFromPDF(
  file: File
): Promise<AssistantResponse> {
  // Validate file type
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are supported");
  }

  // Validate file size (10MB max)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/v1/assistant`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(
      error.message || error.error || error.detail || "Failed to classify email from PDF"
    );
  }

  return response.json();
}

export async function healthCheck(): Promise<{ status: string }> {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new Error("API is not available");
  }

  return response.json();
}
