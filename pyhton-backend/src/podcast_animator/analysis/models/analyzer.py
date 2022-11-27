from typing import Protocol

class Analyzer(Protocol):

    def _segment_audio_speakers(self):
        ...

    def _get_frames(self):
        ...