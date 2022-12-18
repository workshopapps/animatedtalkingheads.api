import pytest
from podcast_animator.generator.pipeline import VideoPipeLine


@pytest.fixture
def pipeline():
    pipeline = VideoPipeLine()
    return pipeline
