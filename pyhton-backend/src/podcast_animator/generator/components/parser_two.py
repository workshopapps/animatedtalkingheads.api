from itertools import chain
from .speech import Speech

from podcast_animator.analysis.assembly_analyser import diarize_audio




def generate_sequence(url: str):
    """_summary_

    Args:
        url (str): _description_

    Returns:
        dict[str, str]: _description_
    """
    dataneed = diarize_audio(url)

    transcription = dataneed["text"]
    diarization = dataneed["utterances"]
    audiolength = int(dataneed["audio_duration"]/1000)  
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
    """_summary_

    Args:
        audio_data (list[Speech]): _description_
        audiolength (int): _description_

    Returns:
        dict[str, list]: _description_
    """
    speaker_sequence = {}
    for data in audio_data:
        if data.speaker not in speaker_sequence:
            speaker_sequence[data.speaker]=[(data.index,data.duration, data.text)]
        else:
            speaker_sequence[data.speaker].append((data.index,data.duration,data.text))
    

    speaking_moments={}
    for each_speaker in speaker_sequence:
        print(each_speaker[0])
        phrase_map = [speaker_tuple[1] for speaker_tuple in each_speaker]
        flattened_list = list(chain.from_iterable(phrase_map))
        result = []
        for i in range(audiolength + 1, step=1):
            if i in flattened_list:
                result.append("speech")
            else:
                result.append("silence")
        speaking_moments[each_speaker] = result
        

    return speaking_moments
    