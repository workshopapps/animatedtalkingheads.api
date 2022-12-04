from typing import Protocol
from PIL import Image


class Filter(Protocol):
    def __init__(self):
        ...

    def _compose_animation_schema(self):
        ...

    def add_to_canvas(self, frame_index: int, canvas: Image):
        ...
