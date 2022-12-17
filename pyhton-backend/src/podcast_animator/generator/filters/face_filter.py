from pathlib import Path
from PIL.Image import Image as img_obj
from PIL import Image


class FaceFilter:
    """Interface class
    defines architecture to modify a feature for selected frame of animation

    author: @anonnoone


    """

    def __init__(self, avatar_map: dict):
        self.avatar_map = avatar_map

    def _compose_animation_schema(self):
        raise NotImplementedError

    def add_to_canvas(self, frame_data: tuple[int | img_obj]) -> img_obj:
        frame_index, canvas = frame_data

        for speaker in self.avatar_map:
            face_image_path = self.avatar_map[speaker] / "face.png"
            face_image = Image.open(face_image_path)
            face_image = face_image.convert("RGBA")
            canvas = Image.alpha_composite(canvas, face_image)
        return frame_index, canvas
