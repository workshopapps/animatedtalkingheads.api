from pathlib import Path
from PIL.Image import Image as img_obj
from PIL import Image


class FaceFilter:
    def __init__(self, avatar_map: dict, animation_frame_length: int):
        self.avatar_map = avatar_map
        self.animation_frame_length = animation_frame_length
        self.animation_frames = None
        self._compose_animation_schema()

    def speaker_labels(self) -> list[str]:
        return list(self.avatar_map.keys())

    def _compose_animation_schema(self):
        self.animation_frames = {
            str(frame_number): {avatar_id: [] for avatar_id in self.speaker_labels}
            for frame_number in range(1, self.animation_frame_length + 1)
        }

    def add_to_canvas(self, frame_data: tuple[int | img_obj]) -> img_obj:
        frame_index, canvas = frame_data
        frame_obj = self.animation_frames[str(frame_index)]

        for speaker in frame_obj:
            face_image_path = self.avatar_map[speaker] / "face.png"
            face_image = Image.open(face_image_path)
            face_image = face_image.convert("RGBA")
            canvas = Image.alpha_composite(canvas, face_image)
        return frame_index, canvas
