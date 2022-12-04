from pathlib import Path
from PIL.Image import Image as img_obj
from PIL import Image


class BackgroundFilter:
    """Interface class
    defines architecture to modify a feature for selected frame of animation

    author: @jimi


    """

    def __init__(self, background_dir: Path, animation_frame_length: int):
        self.directory_path = background_dir
        self.animation_frame_length = animation_frame_length
        self.animation_frames = None
        self._compose_animation_schema()

    def _compose_animation_schema(self):
        self.animation_frames = {
            str(index): self.directory_path / "default.png"
            for index in range(1, self.animation_frame_length + 1)
        }

    def add_to_canvas(self, frame_data: tuple[int | img_obj]) -> img_obj:
        frame_index, canvas = frame_data
        background_path = self.animation_frames[str(frame_index)]
        bg_image = Image.open(background_path)
        bg_image = bg_image.convert(mode="RGBA")
        canvas.paste(im=bg_image, box=(0, 0))
        return frame_index, canvas
