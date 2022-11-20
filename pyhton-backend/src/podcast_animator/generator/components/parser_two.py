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
    
def speakers_sequence(
    audio_data: list[Speech], audiolength: int
) -> dict[str, list]:
    """taking data from audio transcript and turns into dictionary
    puts all utterances into a list for easy adapataion
    @author: justin
    Args:
        list: diarized data
        audiolegth: length of audio

    Returns:
        List: dict of speaking moments
    """
    speaker_sequence = {}
    for data in audio_data:
        if data.speaker not in speaker_sequence:
            speaker_sequence[data.speaker]=[data.duration]
        else:
            speaker_sequence[data.speaker].append(data.duration)
    

    speaking_moments={}
    for each_speaker in speaker_sequence:
        # phrase_map = [speaker_tuple[1] for speaker_tuple in each_speaker]
        flattened_list = list(chain.from_iterable(speaker_sequence[each_speaker]))
        result = []
        for i in range(0, audiolength + 1):
            if i in flattened_list:
                result.append("speech")
            else:
                result.append("silence")
        speaking_moments[each_speaker] = result
    return speaking_moments
    