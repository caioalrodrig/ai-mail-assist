import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

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
