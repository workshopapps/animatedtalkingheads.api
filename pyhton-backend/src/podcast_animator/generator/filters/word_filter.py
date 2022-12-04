import re
import random

# from g2p_en import G2p
import textwrap
from PIL import Image, ImageDraw, ImageFont

# from podcast_animator.utils.mouth_shapes import SHAPES
from podcast_animator.config import Config


class WordFilter:
    """Filter class that manages speaker mouth state and subtitle on animation frames

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
        self.font = ImageFont.load_default()
        self.animation_frames = None
        self._compose_animation_schema()

    @property
    def speaker_labels(self) -> list[str]:
        """unique labels given to speakers in audio

        author: @anonnoone

        Returns:
            list[str]
        """
        return list(self.avatar_map.keys())

    @property
    def msec_per_frame(self) -> float:
        """_summary_

        Returns:
            _type_: _description_
        """
        return round(1000 / Config.FRAME_RATE, 2)

    def _compose_animation_schema(self):
        """ """
        self.animation_frames = {
            str(frame_number): {avatar_id: [] for avatar_id in self.speaker_labels}
            for frame_number in range(1, self.animation_frame_length + 1)
        }

        # g2p_obj = G2p()

        for speech_object in self.diarized_speeches:
            speaker = speech_object["speaker"]
            for sentence in speech_object["sentences"]:

                ## map word to timestamp
                timestamp_tuple = tuple(
                    zip(
                        sentence.split(" "),
                        speech_object["sentences"][sentence].split(";"),
                    )
                )
                for word, time_stamp in timestamp_tuple:
                    word = re.sub(r"\.$|\?$|\,$", "", word)
                    start_time, end_time = list(map(int, time_stamp.split("-")))
                    first_frame = round((start_time / self.msec_per_frame)) - 2
                    last_frame = round((end_time / self.msec_per_frame)) - 2

                    for frame_id in range(first_frame, last_frame + 1):
                        self.animation_frames[str(frame_id)][speaker].append(
                            {
                                "word": word,
                                "mouth": self.avatar_map[speaker] / f"mouths/ah.png",
                            }
                        )

    def add_to_canvas(self, frame_data: tuple[int:Image]):
        """_summary_

        Args:
            frame_index (int): _description_
            canvas (Image): _description_
        """

        frame_index, canvas = frame_data
        frame_obj = self.animation_frames[str(frame_index)]
        subtitle_offset = 0.1
        for speaker in frame_obj:
            if len(frame_obj[speaker]) < 1:
                mouth_path = self.avatar_map[speaker] / "mouths/closed.png"
                speaker_word = None
            else:
                if len(frame_obj[speaker]) == 1:
                    obj = frame_obj[speaker][0]

                elif len(frame_obj[speaker]) > 1:
                    obj = random.choice(frame_obj[speaker])

                mouth_path = obj["mouth"]
                speaker_word = obj["word"]

            mouth = Image.open(mouth_path)
            mouth = mouth.convert("RGBA")
            canvas = Image.alpha_composite(canvas, mouth)

            if speaker_word:
                self._draw_word(speaker_word, canvas, subtitle_offset)

        return frame_index, canvas

    def _draw_word(self, speaker_word: str, image: Image, offset: int) -> None:
        """draws spoken words from analysed audio on frame
        as subtitles under the appropriate speaker
        created by @jimi

        Args:
        speaker_word (str): subtitle to be drawn
        image (Image): image to draw subtitle
        offset (int): position to draw_subtitle
        """
        width, height = image.size
        wrapper = textwrap.TextWrapper(width=width * 0.07)
        word_list = wrapper.wrap(text=speaker_word)
        caption_new = ""
        for word in word_list[:-1]:
            caption_new = caption_new + word + "\n"
        caption_new += word_list[-1]

        draw = ImageDraw.Draw(image)

        w, h = draw.textsize(caption_new, font=self.font)

        x, y = 0.5 * (width - w), offset * height - h
        draw.text((x, y), caption_new, font=self.font)
