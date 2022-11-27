from itertools import chain
import json
from pathlib import Path
from .models.utterance import Utterance




class UtteranceAnalyzer:

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
            word_obj = Utterance(
            speaker=word_segment["speaker"],
            start = int(word_segment["start"]/1000),
            stop = int(word_segment["end"]/1000),
            text=word_segment["text"]
        )
            if word_obj.speaker not in self.audio_speakers:
                self.audio_speakers[word_obj.speaker] = [*word_obj.sentence_to_timestamp]
            else:
                self.audio_speakers[word_obj.speaker].extend(word_obj.sentence_to_timestamp)
        self.audio_speakers = {key: dict(value) for key, value in self.audio_speakers.items()}
   

    def _get_frames(self):
        speaker_frames = {}
        for each_speaker in self.audio_speakers:
            speaking_moments = self.audio_speakers[each_speaker]
            result = []
            
            for i in range(0, self.audio_length_sec + 1 , 1):
                if i in speaking_moments:
                    phrase = speaking_moments[i]
                    result.append(phrase)
                    
                else:
                    result.append("none")
            
            speaker_frames[each_speaker] = result
        return speaker_frames


    

    def write_metadata(self, path: Path) -> dict:
        self._segment_audio_speakers()
        speaker_frames = self._get_frames()
        try:
            with open(str(path), 'w') as write_file:
                json.dump(speaker_frames, write_file)
            return speaker_frames
        except TypeError:
            return "Unable to serialize the object"
