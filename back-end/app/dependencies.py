from app.pipeline import pipeline


def get_pipeline():
    """Dependency injection for the email assistant pipeline."""
    return pipeline
