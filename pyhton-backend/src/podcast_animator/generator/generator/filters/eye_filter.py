from pathlib import Path
import os
from PIL.Image import Image as img_obj
from PIL import Image
from podcast_animator.config import Config
import random


class EyeFilter:
    """Interface class
    defines architecture to modify a feature for selected frame of animation

    author: @Chimdi

    """

    def __init__(
        self,
        animation_frame_length: int,
        avatar_map: dict,
    ) -> None:

        self.animation_frame_length = animation_frame_length
        self.avatar_map = avatar_map
        self.animation_frames = None
        self.blinking_sequences = self.get_eyes()
        self._compose_animation_schema()

    @property
    def speaker_labels(self):
        return list(self.avatar_map.keys())

    def get_eyes(self):
        return {
            speaker: sorted([Path(file) for file in os.scandir(self.avatar_map[speaker] / "eyes/look") if file.is_file()],
                key=lambda x: str(x.name).split(".")[0].split("_")[1]
            )
            for speaker in self.speaker_labels
        }

    def _compose_animation_schema(self):
        self.animation_frames = {
            str(frame_number): {avatar_id: None for avatar_id in self.speaker_labels}
            for frame_number in range(1, self.animation_frame_length + 1)
        }
        
  
        for avatar_id in self.speaker_labels:
            counter = 1
            while counter <  self.animation_frame_length + 1:
                if counter % 168 == 0:
                    for index, blink_image in enumerate(
                        self.blinking_sequences[avatar_id]
                    ):
                        loop_index = counter + index
                        if loop_index > self.animation_frame_length:
                            break
                        self.animation_frames[str(loop_index)][
                            avatar_id
                        ] = blink_image
                  
                    counter += len(self.blinking_sequences[avatar_id])
                else:
                    self.animation_frames[str(counter)][avatar_id] = (
                        self.avatar_map[avatar_id] / f"eyes/happy.png"
                    )

                    counter += 1

    def add_to_canvas(self, frame_data: tuple[int | img_obj]) -> img_obj:
        frame_index, canvas = frame_data
        frame_obj = self.animation_frames[str(frame_index)]
        for speaker in frame_obj:
            eyes_path = frame_obj[speaker]
            eyes = Image.open(eyes_path)
            eyes = eyes.convert("RGBA")
            canvas = Image.alpha_composite(canvas, eyes)
        return frame_index, canvas