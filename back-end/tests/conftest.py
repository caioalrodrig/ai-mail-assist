import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture
def test_client():
    """Fixture for FastAPI test client."""
    return TestClient(app)
