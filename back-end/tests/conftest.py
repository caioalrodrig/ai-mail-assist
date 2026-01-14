import pytest
from unittest.mock import MagicMock
from fastapi.testclient import TestClient

from main import app
from app.dependencies import get_pipeline


@pytest.fixture
def mock_pipeline():
    """Fixture for mocked pipeline."""
    mock = MagicMock()
    mock.invoke.return_value = {
        "is_productive": True,
        "confidence": 0.92,
        "suggested_response": "Sua solicitação está em análise.",
    }
    return mock


@pytest.fixture
def test_client(mock_pipeline):
    """Fixture for FastAPI test client with mocked pipeline."""
    app.dependency_overrides[get_pipeline] = lambda: mock_pipeline
    yield TestClient(app)
    app.dependency_overrides.clear()

