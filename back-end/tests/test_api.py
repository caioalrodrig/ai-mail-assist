from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from langchain_google_genai.chat_models import ChatGoogleGenerativeAIError

from main import app
from app.dependencies import get_pipeline


class TestAssistantEndpoint:
    """Test suite for POST /api/v1/assistant endpoint."""

    def test_should_return_200_when_valid_email_provided(self, test_client):
        """
        GIVEN a valid email text
        WHEN POST /api/v1/assistant is called
        THEN it should return 200 with is_productive, confidence and suggested_response
        """
        payload = {"email_text": "Qual o status do meu pedido?"}

        response = test_client.post("/api/v1/assistant", json=payload)

        assert response.status_code == 200
        data = response.json()
        assert "is_productive" in data
        assert isinstance(data["is_productive"], bool)
        assert "confidence" in data
        assert "suggested_response" in data
        assert 0 <= data["confidence"] <= 1

    def test_should_return_422_when_email_text_missing(self, test_client):
        """
        GIVEN a request without email_text
        WHEN POST /api/v1/assistant is called
        THEN it should return 422 validation error
        """
        payload = {}

        response = test_client.post("/api/v1/assistant", json=payload)

        assert response.status_code == 422

    def test_should_return_422_when_email_text_empty(self, test_client):
        """
        GIVEN a request with empty email_text
        WHEN POST /api/v1/assistant is called
        THEN it should return 422 validation error
        """
        payload = {"email_text": ""}

        response = test_client.post("/api/v1/assistant", json=payload)

        assert response.status_code == 422


class TestHealthEndpoint:
    """Test suite for GET /health endpoint."""

    def test_should_return_200_with_status_ok(self, test_client):
        """
        GIVEN the API is running
        WHEN GET /health is called
        THEN it should return 200 with status ok
        """
        response = test_client.get("/health")

        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


class TestErrorHandling:
    """Test suite for API error handling."""

    def test_should_return_429_when_quota_exceeded(self):
        """
        GIVEN the Gemini API quota is exceeded
        WHEN POST /api/v1/assistant is called
        THEN it should return 429 with quota error message
        """
        mock_pipeline = MagicMock()
        mock_pipeline.invoke.side_effect = ChatGoogleGenerativeAIError(
            "429 RESOURCE_EXHAUSTED: quota exceeded"
        )

        app.dependency_overrides[get_pipeline] = lambda: mock_pipeline
        client = TestClient(app, raise_server_exceptions=False)

        response = client.post(
            "/api/v1/assistant",
            json={"email_text": "Test email"}
        )

        assert response.status_code == 429
        assert "quota" in response.json()["error"].lower()

        app.dependency_overrides.clear()

    def test_should_return_503_when_ai_service_fails(self):
        """
        GIVEN the Gemini API returns an error
        WHEN POST /api/v1/assistant is called
        THEN it should return 503 with service error message
        """
        mock_pipeline = MagicMock()
        mock_pipeline.invoke.side_effect = ChatGoogleGenerativeAIError(
            "Internal server error"
        )

        app.dependency_overrides[get_pipeline] = lambda: mock_pipeline
        client = TestClient(app, raise_server_exceptions=False)

        response = client.post(
            "/api/v1/assistant",
            json={"email_text": "Test email"}
        )

        assert response.status_code == 503
        assert "error" in response.json()

        app.dependency_overrides.clear()
