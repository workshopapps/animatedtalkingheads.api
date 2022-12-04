from PIL import Image
from functools import partial
from toolz.functoolz import compose, pipe
from podcast_animator.generator.filters.filter import Filter


class VideoPipeLine:
    def __init__(self) -> None:
        self.filters = []
        self.processor = None

    def add_filter(self, filter: Filter):
        self.filters.append(filter)

    def compile(self, *args):
        self.filters.extend(list(locals()["args"][1:]))
        self.processor = compose(*self.filters)

    def process(self, frame_index: int | str, canvas: Image):
        return self.processor((frame_index, canvas))
        # return map(partial(self.processor, frame_index=frame_index), canvas)
