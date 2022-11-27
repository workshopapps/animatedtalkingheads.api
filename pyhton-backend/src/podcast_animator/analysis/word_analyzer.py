import re
from itertools import chain
from pathlib import Path
from g2p_en import G2p
from .models.word import Word
from .utils.mouth_shapes import SHAPES
import json
# from .models.analyzer import Analyzer




class WordAnalyzer:

    def __init__(self, audio_length_sec: int, diarization_data: list[dict[str, str | int]]) -> None:
        self.audio_speakers = {} 
        self.diarization_data  = diarization_data
        self.audio_length_sec  = audio_length_sec
    

    def _segment_audio_speakers(self):
        """
            separate data of all unique speakers 
            identified into key, value data structure
        """
        for word_segment in self.diarization_data:
            word_obj = Word(
            speaker=word_segment["speaker"],
            start = word_segment["start"],
            stop = word_segment["end"],
            text=word_segment["text"]
        )
            if word_obj.speaker not in self.audio_speakers:
                self.audio_speakers[word_obj.speaker] = [word_obj]
            else:
                self.audio_speakers[word_obj.speaker].append(word_obj)

    def _get_phoneme_timestamp(self) -> dict[str, list[tuple[str | int]]]:
        """generate a list of phonemes ordered by a calculated position / frame number
        Returns:
            dict[str, list[tuple[str | int]]]
        """
        g2p = G2p()

        ## convert each speakers word object into a list of tuples
        ## format = tuple[0] = in msec, tuple[1] the mouth shape as a string
        phonemes_per_word = {
            speaker: list(
                chain.from_iterable(
                    [self._extract_phoneme(word_obj.text, word_obj.duration, g2p) for word_obj in value]
                    )
                ) for speaker, value in self.audio_speakers.items()
        }
        return phonemes_per_word

    def _get_frames(self, speaker_sounds: dict[str, list[tuple[str | int]]]):
        speaker_frames = {}
        for each_speaker in speaker_sounds:
            result = []
            for i in range(0, (self.audio_length_sec + 1) * 1000 , 42):
                speaking_moments = speaker_sounds[each_speaker]
                stp_index = next((index for index, wrd in enumerate(speaking_moments) if wrd[0] == i), None)
                if stp_index is not None:
                    sound = speaking_moments[stp_index][1]
                    if sound in SHAPES:
                        result.append(SHAPES[sound])
                else:
                    result.append("closed")
            speaker_frames[each_speaker] = result
        return speaker_frames


    def _extract_phoneme(self, word: str, duration: list[int], g2p: G2p) -> list[str]:
        """ generate a timestamp mapped list of phonemes present in a word
        Args:
            word (str): word from the English language
            timestamp (list[int]): ordered timestamps in multiples of 42 
                                   representing length of time assigned to word
        Returns:
            list[str]: sounds made and frequency for each duration

            
        """ 
        # remove whitespace from phoneme transcription
        phonemes = list(filter(lambda phoneme: phoneme != ' ', g2p(word)))
    
        phoneme_weights = {
            re.sub(r'\d+', '', phoneme): int(
                re.findall(r'\d+', phoneme)[0]
                ) + 1 if re.search(
                    r'\d+', phoneme
                    ) else 0 for phoneme in phonemes 
        }
        ## sort weighted dictionary on value 
        sorted_weights = dict(sorted(phoneme_weights.items(), key=lambda item: item[1], reverse=True)) 

        ## calculate sounds and asigned frames
        # def remove_phoneme_stress(sound: str):
        #     return re.sub(r'\d+', '', sound)

        result_list = [re.sub(r'\d+', '', sound) for sound in phonemes]
    

        while len(result_list) < len(duration):
            for phn in sorted_weights:
                if len(result_list)  == len(duration):
                    break
                else:
                    phn_index = result_list.index(phn)
                    result_list.insert(phn_index, phn)
        return tuple(zip(duration, result_list))

    def write_metadata(self, path: Path) -> dict:
        self._segment_audio_speakers()
        phoneme_timestamp = self._get_phoneme_timestamp()
        speaker_frames = self._get_frames(phoneme_timestamp)
        try:
            with open(str(path), 'w') as write_file:
                json.dump(speaker_frames, write_file)
            
            return speaker_frames
        except TypeError:
            return "Unable to serialize the object"
