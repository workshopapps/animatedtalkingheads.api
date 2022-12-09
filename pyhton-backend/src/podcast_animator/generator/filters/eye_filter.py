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
        self.blinking_sequences = self.blinking()  # sad
        self.lookleft_sequences = self.lookleft()  # look #proper to be impleneted
        self.lookright_sequences = self.lookright() #to be implemented
        self.lookup_sequences = self.lookup() #to be implemented
        self.lookdown_sequences = self.lookdown() #to be implemented
        self._compose_animation_schema()

    @property
    def speaker_labels(self):
        return list(self.avatar_map.keys())

    def blinking(self):
        """
        function to get filepath sequence for blinking
        """
        # files for blinking
        return {
            speaker: sorted(
                [
                    Path(file)
                    for file in os.scandir(self.avatar_map[speaker] / "eyes/sad") #"eyes/blinking"
                    if file.is_file()
                ],
                key=lambda x: str(x.name).split(".")[0].split("_")[1],
            )
            for speaker in self.speaker_labels
        }

    def lookleft(self):
        """
        function to get filepath sequence for looking left
        """
        # files for looking around
        return {
            speaker: sorted(
                [
                    Path(file)
                    for file in os.scandir(self.avatar_map[speaker] / "eyes/look") #"eyes/lookleft"
                    if file.is_file()
                ],
                key=lambda x: str(x.name).split(".")[0].split("_")[1],
            )
            for speaker in self.speaker_labels
        }

    def lookright(self):
        """
        function to get filepath sequence for looking right
        """
        # files for looking around
        return {
            speaker: sorted(
                [
                    Path(file)
                    for file in os.scandir(self.avatar_map[speaker] / "eyes/look") #"eyes/lookright"
                    if file.is_file()
                ],
                key=lambda x: str(x.name).split(".")[0].split("_")[1],
            )
            for speaker in self.speaker_labels
        }

    def lookup(self):
        """
        function to get filepath sequence for looking up
        """
        # files for looking around
        return {
            speaker: sorted(
                [
                    Path(file)
                    for file in os.scandir(self.avatar_map[speaker] / "eyes/look") #"eyes/lookup"
                    if file.is_file()
                ],
                key=lambda x: str(x.name).split(".")[0].split("_")[1],
            )
            for speaker in self.speaker_labels
        }

    def lookdown(self):
        """
        function to get filepath sequence for looking down
        """
        # files for looking around
        return {
            speaker: sorted(
                [
                    Path(file)
                    for file in os.scandir(self.avatar_map[speaker] / "eyes/look") #"eyes/lookdown"
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

        randomnumbers = [1, 2, 3, 4]
        randomblinks = [72, 120, 168, 240]
        left = self.lookleft_sequences 
        right = self.lookright_sequences
        up = self.lookup_sequences
        down = self.lookdown_sequences
        #randomeyemovemnt = [left, right, down, up] to be implented
        randomeyemovemnt = [left]
        for avatar_id in self.speaker_labels:
            counter = 1
            blinktime = random.choice(randomblinks)
            eyemovement = random.choice(randomeyemovemnt)
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

                    # eye movement
                    for index, look_image in enumerate(
                        eyemovement[avatar_id]
                    ):
                        loop_index = counter + index
                        if loop_index > self.animation_frame_length:
                            break
                        self.animation_frames[str(loop_index)][avatar_id] = look_image
                    counter += len(eyemovement[avatar_id])

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
