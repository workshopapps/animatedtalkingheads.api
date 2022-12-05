from PIL import Image
from toolz.functoolz import compose
from podcast_animator.generator.filters.filter import Filter


class VideoPipeLine:

    """transform plain canvas through various filter methods"""

    def __init__(self) -> None:
        self.filters = []
        self.processor = None

    def add_filter(self, filter: Filter):
        """add filter into pipeline

        Args:
            filter (Filter): method that performs transformation on canvas
        """
        self.filters.append(filter)

    def compile(self, *args):
        """create pipeline method from all filters passed in
        methods are applied in reverse order
        last to first
        """
        self.filters.extend(list(locals()["args"]))
        self.processor = compose(*self.filters)

    def process(self, frame_index: int | str, canvas: Image):
        """process canvas through compiled filter methods

        Args:
            frame_index (int | str): frame number of canvas
            canvas (Image): plain canvas to be processed
        """
        return self.processor((frame_index, canvas))
