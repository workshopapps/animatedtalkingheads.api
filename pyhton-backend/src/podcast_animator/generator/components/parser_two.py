from itertools import chain
from .speech import Speech

from podcast_animator.analysis.assembly_analyser import diarize_audio




def generate_sequence(url: str):
    """ 
    using assembly ai we send an audio url and obtain json data for the audio file
    @author : cchimdindu

    Args:
        audio (string): url of video

    Returns:
        lis: json file is sorted out and returned in list format
    """
    dataneed = diarize_audio(url)

    transcription = dataneed["text"]
    diarization = dataneed["utterances"]
    audiolength = int(dataneed["audio_duration"])  
    audio_data = []
    for data in diarization:
        phrase = Speech(
            speaker=data["speaker"],
            start = int(data["start"]/1000),
            stop = int(data["end"]/1000),
            text=transcription,
            index = diarization.index(data)
        )
        audio_data.append(phrase)
   
    sequence = speakers_sequence(audio_data, audiolength)
    return sequence
    


