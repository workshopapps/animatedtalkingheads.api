import re
import random

from g2p_en import G2p
import textwrap
from PIL import Image, ImageDraw, ImageFont

from podcast_animator.utils.mouth_shapes import SHAPES
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
        self.animation_offset = 3
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
        """amount of miliseconds within each frame

        author: @anonnoone

        Returns:
            float:
        """
        return round(1000 / Config.FRAME_RATE, 2)

    def _compose_animation_schema(self) -> None:
        """assign words and mouth shapes to frames
        using the duration of the words in miliseconds
        """
        self.animation_frames = {
            str(frame_number): {avatar_id: [] for avatar_id in self.speaker_labels}
            for frame_number in range(1, self.animation_frame_length + 1)
        }

        g2p_obj = G2p()

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
                    #### PROCESS WORD  ####
                    ## strip word of punctuations
                    word = re.sub(r"\.$|\?$|\,$", "", word)

                    ## calculate length in miliseconds of word
                    start_time, end_time = map(int, time_stamp.split("-"))
                    word_duration = end_time - start_time

                    # calculate limit/ boundaries of the word
                    # first_word_frame = round((start_time / self.msec_per_frame))
                    last_word_frame = (
                        round(end_time / self.msec_per_frame) - self.animation_offset
                    )

                    ## extract mouth shapes for each phoneme
                    mouth_shapes = list(
                        map(
                            lambda x: SHAPES[x] if x in SHAPES else x,
                            map(
                                lambda x: re.sub(r"\d+", "", x),
                                filter(lambda phoneme: phoneme != " ", g2p_obj(word)),
                            ),
                        )
                    )

                    ## calculate length of single phoneme in word
                    single_phoneme_duration = word_duration / len(mouth_shapes)

                    start_sound = start_time
                    for mouth_shape in mouth_shapes:
                        # print(mouth_shape, start_sound)
                        end_sound = start_sound + single_phoneme_duration

                        ## calculate every frame where phoneme is present
                        first_shape_frame, last_shape_frame = map(
                            lambda x: min(x, last_word_frame),
                            map(
                                lambda x: round(
                                    (x / self.msec_per_frame) - self.animation_offset
                                ),
                                [start_sound, end_sound],
                            ),
                        )

                        ## add shapes to frames
                        for frame_index in range(first_shape_frame, last_shape_frame):
                            self.animation_frames[str(frame_index)][speaker].append(
                                {
                                    "word": word,
                                    "mouth": self.avatar_map[speaker]
                                    / f"mouths/{mouth_shape}.png",
                                }
                            )

                        start_sound = end_sound

                    self.animation_frames[str(last_shape_frame)][speaker].append(
                        {
                            "word": word,
                            "mouth": str(self.avatar_map[speaker] / "mouths/closed.png"),
                        }
                    )

    def add_to_canvas(self, frame_data: tuple[int:Image]):
        """add mouth shape and word subtitle to audio file

        Args:
            frame_index (int): _description_
            canvas (Image): _description_
        """

        frame_index, canvas = frame_data
        frame_obj = self.animation_frames[str(frame_index)]

        subtitle_offset = 0.9  ## moves subtitle up a fraction for each speaker
        for speaker in frame_obj:
            if len(frame_obj[speaker]) < 1:
                mouth_path = self.avatar_map[speaker] / "mouths/closed.png"
                speaker_word = None
            else:
                if len(frame_obj[speaker]) == 1:
                    obj = frame_obj[speaker][0]

                elif len(frame_obj[speaker]) > 1:
                    obj = frame_obj[speaker][-1]

                mouth_path = obj["mouth"]
                speaker_word = obj["word"]

            mouth = Image.open(mouth_path)
            mouth = mouth.convert("RGBA")
            canvas = Image.alpha_composite(canvas, mouth)

            if speaker_word:

                self._draw_word(speaker_word, canvas, subtitle_offset, speaker)
            subtitle_offset -= 0.1
        return frame_index, canvas

    def _draw_word(
        self, speaker_word: str, image: Image, offset: int, speaker: str
    ) -> None:
        """draws spoken words from analysed audio on frame
        as subtitles under the appropriate speaker
        created by @jimi

        Args:
        speaker_word (str): subtitle to be drawn
        image (Image): image to draw subtitle
        offset (int): position to draw_subtitle
        speaker (int): current frame of speaker
        """

        width, height = image.size  # Collecting dimensions of the image
        wrapper = textwrap.TextWrapper(
            width=width * 0.07
        )  # Using width to calculating the appropriate dimension of each word displayed
        word_list = wrapper.wrap(text=speaker_word)
        caption_new = ""
        for word in word_list[
            :-1
        ]:  # The loops adds the appropriate word for that frame from a list of words
            caption_new = caption_new + word + "\n"
        caption_new += word_list[-1]

        draw = ImageDraw.Draw(image)  # Drawing the image dimension on the frame

        w, h = draw.textsize(
            caption_new, font=self.font
        )  # Getting the vales of the text size

        x, y = (
            0.5 * (width - w),
            offset * height - h,
        )  # Using text size and offset values to calculate position on the image
        draw.text(
            (x, y), f"Speaker_{speaker}: {caption_new}", font=self.font
        )  ##Drawing the words to the image
