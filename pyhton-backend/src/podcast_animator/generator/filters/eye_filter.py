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
        self.blinking_sequences = self.get_eyes_blinking()  # sad
        self.looking_sequences = self.get_eyes_looking()  # look
        self._compose_animation_schema()

    @property
    def speaker_labels(self):
        return list(self.avatar_map.keys())

    def get_eyes_blinking(self):
        """
        function to get filepath sequence for blinking
        """
        # files for blinking
        return {
            speaker: sorted(
                [
                    Path(file)
                    for file in os.scandir(self.avatar_map[speaker] / "eyes/sad")
                    if file.is_file()
                ],
                key=lambda x: str(x.name).split(".")[0].split("_")[1],
            )
            for speaker in self.speaker_labels
        }

    def get_eyes_looking(self):
        """
        function to get filepath sequence for looking around
        """
        # files for looking around
        return {
            speaker: sorted(
                [
                    Path(file)
                    for file in os.scandir(self.avatar_map[speaker] / "eyes/look")
                    if file.is_file()
                ],
                key=lambda x: str(x.name).split(".")[0].split("_")[1],
            )
            for speaker in self.speaker_labels
        }

    def _compose_animation_schema(self):
        """
        get images required in a frame
        animation_frames =
        {
            1: {'a':eye path, 'b':eye path},
            2: {'a':eye path, 'b':eye path},
        }
        """
        self.animation_frames = {
            str(frame_number): {avatar_id: None for avatar_id in self.speaker_labels}
            for frame_number in range(1, self.animation_frame_length + 1)
        }

        randomnumbers = [1, 65, 78, 2, 3, 5565, 35, 12, 500, 637, 7, 23]
        randomblinks = [72, 120, 168, 240]
        for avatar_id in self.speaker_labels:
            counter = 1
            blinktime = random.choice(randomblinks)
            while counter < self.animation_frame_length + 1:

                if random.choice(randomnumbers) == 1 and counter % blinktime == 0:
                    # blinking
                    for index, blink_image in enumerate(
                        self.blinking_sequences[avatar_id]
                    ):
                        loop_index = counter + index
                        if loop_index > self.animation_frame_length:
                            break
                        self.animation_frames[str(loop_index)][avatar_id] = blink_image
                    counter += len(self.blinking_sequences[avatar_id])

                    # look around
                    for index, look_image in enumerate(
                        self.looking_sequences[avatar_id]
                    ):
                        loop_index = counter + index
                        if loop_index > self.animation_frame_length:
                            break
                        self.animation_frames[str(loop_index)][avatar_id] = look_image
                    counter += len(self.looking_sequences[avatar_id])

                elif counter % blinktime == 0:
                    # just blinking
                    for index, blink_image in enumerate(
                        self.blinking_sequences[avatar_id]
                    ):
                        loop_index = counter + index
                        if loop_index > self.animation_frame_length:
                            break
                        self.animation_frames[str(loop_index)][avatar_id] = blink_image

                    counter += len(self.blinking_sequences[avatar_id])

                else:
                    # default eyes
                    self.animation_frames[str(counter)][avatar_id] = (
                        self.avatar_map[avatar_id] / f"eyes/happy.png"
                    )
                    counter += 1

    def add_to_canvas(self, frame_data: tuple[int | img_obj]) -> img_obj:
        """
        adds images to the canvas and returns the canvas as a filtered object
        """
        frame_index, canvas = frame_data
        frame_obj = self.animation_frames[str(frame_index)]
        for speaker in frame_obj:
            eyes_path = frame_obj[speaker]
            eyes = Image.open(eyes_path)
            eyes = eyes.convert("RGBA")
            canvas = Image.alpha_composite(canvas, eyes)
        return frame_index, canvas
