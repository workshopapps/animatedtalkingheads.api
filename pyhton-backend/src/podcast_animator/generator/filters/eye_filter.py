from pathlib import Path
from PIL.Image import Image as img_obj
from PIL import Image
from podcast_animator.config import Config
import random


class EyeFilter:
    """Interface class
    defines architecture to modify a feature for selected frame of animation

    author: @anonnoone


    """
    def __init__(
        self, diarization_speeches: list, animation_frame_length: int, avatar_map: dict
    ) -> None:
        """
        author: @anonnoone
        Args:
            diarization_speeches (dict): speaker diarization for audio
            animation_frame_length (int): number of frames for entire animation duration
            avatar_map (int): audio speaker labels mapped to chosen avatar directory path
        """
        self.diarized_speeches = diarization_speeches
        self.animation_frame_length = animation_frame_length
        self.avatar_map = avatar_map
        self.animation_frames = None
        self._compose_animation_schema()

    def speaker_labels(self) -> list[str]:
        return list(self.avatar_map.keys())

    def msec_per_frame(self) -> float:
        return round(1000 / Config.FRAME_RATE, 2)

    def _compose_animation_schema(self):
        self.animation_frames = {
            str(frame_number): {avatar_id: [] for avatar_id in self.speaker_labels}
            for frame_number in range(1, self.animation_frame_length + 1)
        }

        for speech_object in self.diarized_speeches:
            speaker = speech_object["speaker"]
            for sentence in speech_object["sentences"]:

                timestamp_tuple = speech_object["sentences"][sentence].split(";")

                for time_stamp in timestamp_tuple:
                    start_time, end_time = list(map(int, time_stamp.split("-")))
                    first_frame = round((start_time / self.msec_per_frame)) - 2
                    last_frame = round((end_time / self.msec_per_frame)) - 2

                    for frame_id in range(first_frame, last_frame + 1):
                        #if frame_id in 7 second range then attach blinking, looking files + increase frame id
                        self.animation_frames[str(frame_id)][speaker].append(
                            {
                                "eyes": self.avatar_map[speaker] / f"eyes/default.png"
                            }
                        )


    def add_to_canvas(self, frame_data: tuple[int | img_obj]) -> img_obj:
        frame_index, canvas = frame_data
        frame_obj = self.animation_frames[str(frame_index)]

        for speaker in frame_obj:
            eyes_path = self.avatar_map[speaker] / "eyes/happy.png"

            eyes = Image.open(eyes_path)
            eyes = eyes.convert("RGBA")
            canvas = Image.alpha_composite(canvas, eyes)

        return frame_index, canvas
