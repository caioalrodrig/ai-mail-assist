import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from langchain_google_genai.chat_models import ChatGoogleGenerativeAIError

from app.routes import router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Email Assistant API",
    version="1.0.0",
    description="API for email classification and automatic response generation",
)

# Parse ALLOWED_ORIGINS from environment variable (comma-separated)
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ChatGoogleGenerativeAIError)
async def gemini_error_handler(request: Request, exc: ChatGoogleGenerativeAIError):
    error_msg = str(exc)

    if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg or "quota" in error_msg.lower():
        return JSONResponse(
            status_code=429,
            content={
                "error": "API quota exceeded",
                "message": "You have exceeded your Google Gemini API quota. Please check your plan and billing details, or wait before retrying.",
            },
        )

    if "401" in error_msg or "403" in error_msg or "API key" in error_msg:
        return JSONResponse(
            status_code=503,
            content={
                "error": "API configuration error",
                "message": "Invalid or missing Google Gemini API key",
            },
        )

    return JSONResponse(
        status_code=503,
        content={
            "error": "AI service error",
            "message": f"Error calling AI service: {error_msg}",
        },
    )


@app.exception_handler(Exception)
async def general_error_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": f"An unexpected error occurred: {str(exc)}",
        },
    )


app.include_router(router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}
