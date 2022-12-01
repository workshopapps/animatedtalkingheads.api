import re
from pathlib import Path
from g2p_en import G2p
from podcast_animator.utils.file_handlers import FileHandler
from .mouth_shapes import SHAPES

class AnimationFrame:

    """construct all frames required for animation duration"""
    def __init__(self, 
        diarized_speeches: dict, 
        speaker_labels: list[str], 
        audio_length_secs: int, 
        frame_rate: int=24,
    ) -> None:
        """

        Args:
            diarized_speeches (dict): diarization information from preliminary 
            audio analysis
            speaker_labels (list[str]): identifier labels matching labels 
            in diarized_speeches for all sepeakers in audio
            audio_length_secs (int): length of audio_file in seconds
            frame_rate (int, optional): Number of frames for animated video. Defaults to 24.
        """
        self.diarized_speeches = diarized_speeches
        self.speaker_labels = speaker_labels
        self.frame_rate = frame_rate
        self.audio_length_secs = audio_length_secs
        self.animation_frames  = None
        self._build_frame()

    @property
    def animation_frame_length(self):
        """return audio length in miliseconds
        """
        return self.audio_length_secs * self.frame_rate

    @property
    def msec_per_frame(self):
        """milliseconds contained in each frame
        """
        return round((1000 /self.frame_rate), 2)

    def _build_frame(self) -> dict[int, dict[str, list[list[str | Path]]]]:
        """build empty frame schema object for animation.
        """
        self.animation_frames = {
            frame_number: {
                avatar_id: [] for avatar_id in self.speaker_labels
                        }  for frame_number in range(1, self.animation_frame_length + 1)
        }

    
    def populate_frames(self, g2p_obj: G2p, file_handler: FileHandler, write_path: Path, avatar_map: dict[str | Path]) -> None:
        """populate animation frame with corresponding 
            word, mouth_shape, emotion and sentence
        """
        for speech_object in self.diarized_speeches:
            speaker = speech_object["speaker"]
            for sentence in speech_object["sentences"]:
              # emotion = get_emotion(sentence)

              ## map word to timestamp
              timestamp_tuple = tuple(zip(sentence.split(' '), speech_object["sentences"][sentence].split(';')))
              for tuple_object in timestamp_tuple:
                word = re.sub(r'\.$|\?$|\,$', '', tuple_object[0])
                time_stamp = tuple_object[1]
                
                ## start time and end time of word
                sound_stamps = list(map(int, time_stamp.split('-')))

                ## extract phoneme
                phonemes = list(filter(lambda phoneme: phoneme != ' ', g2p_obj(word)))
                ## extract phoneme weights
                word_fractions = [int(re.findall(r'\d', sound)[0]) + 1 if re.search(r'\d', sound) else 1 for sound in phonemes ]

                ## extract phonemes without weight
                sound_no_weights =  [re.sub(r'\d+', '', sound) for sound in phonemes]
                
                
                ## calculate length of single phoneme in word
                phonemes_sum = sum(word_fractions)
                time_len = sound_stamps[1] - sound_stamps[0]
                len_one = int(time_len/phonemes_sum)


                ## add each phoneme, sound and word to calculated frame number
                start_phonemes = sound_stamps[0]
                for wrd_index, wt in enumerate(word_fractions):
                  end_phonemes = start_phonemes + (wt * len_one)
                  first_phoneme_frame = round((start_phonemes / self.msec_per_frame)) - 2
                  last_phoneme_frame = round((end_phonemes / self.msec_per_frame)) - 2
                  for phoneme_frame_index in range(first_phoneme_frame, last_phoneme_frame +1):
                    sound = sound_no_weights[wrd_index]
                    
                    if sound not in SHAPES:
                        mouth_shape = 'closed'
                    else:
                        mouth_shape = SHAPES[sound]
                    self.animation_frames[phoneme_frame_index][speaker].append(
                    {
                       
                        "word": word, 
                        "mouth": str(avatar_map[speaker] / f'mouths/{mouth_shape}.png'),
                        "eye": str(avatar_map[speaker] / "eyes/happy.png")
                        }
                    )
                    start_phonemes = end_phonemes + 1
        
        file_handler.write(write_path, self.animation_frames)
    