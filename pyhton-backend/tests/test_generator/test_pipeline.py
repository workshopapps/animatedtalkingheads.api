import pytest
from PIL import Image
from mock import MagicMock

from podcast_animator.generator.filters.filter import Filter
# from models.filter import Filter

@pytest.mark.usefixture("pipeline")
def test_add_filter(pipeline):
    mock_filter = MagicMock(spec=Filter)
    pipeline.add_filter(mock_filter)
    assert pipeline.filters == [mock_filter]

@pytest.mark.usefixture("pipeline")
def test_compile(pipeline):
    mock_filter1 = MagicMock(spec=Filter)
    mock_filter2 = MagicMock(spec=Filter)
    pipeline.filters = [mock_filter1, mock_filter2]
    pipeline.compile()
    assert pipeline.processor == mock_filter2.return_value.__or__.return_value.__or__.return_value

@pytest.mark.usefixture("pipeline")
def test_process(pipeline):
    mock_canvas = MagicMock(spec=Image)
    mock_processor = MagicMock()
    pipeline.processor = mock_processor
    pipeline.process(0, mock_canvas)
    mock_processor.assert_called_with((0, mock_canvas))
