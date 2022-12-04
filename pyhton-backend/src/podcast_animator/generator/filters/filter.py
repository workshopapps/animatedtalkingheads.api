from typing import Protocol
from PIL.Image import Image


class Filter(Protocol):
    """Interface class
    defines architecture to modify a feature for selected frame of animation

    author: @anonnoone


    """

    def __init__(self):
        ...

    def _compose_animation_schema(self):
        ...

    def add_to_canvas(self, frame_data: tuple[int | Image]) -> Image:
        ...
