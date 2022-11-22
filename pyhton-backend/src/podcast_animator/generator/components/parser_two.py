from itertools import chain
from .speech import Speech

from podcast_animator.analysis.assembly_analyser import diarize_audio




def generate_sequence(url: str):
    """generates mapped dictionary of speaker's state
    @author: JustAkiniyi
    Args:
        url (str): http url to dowloadable audio file

    Returns:
        dict[str, str]: 
        dictionary containing action/state of all speakers per sec
        speakers are labeled alphabetically, A - Z
        e.g
        >>>> diarize_audio('http://bit.ly/1e4')
        >>>> {
            "A": ['speech', 'speech', 'silence'...],
            "B": ['speech', 'silence', 'silence'...],
            ...
        }
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
   
    sequence = _speakers_sequence(audio_data, audiolength)
    return sequence
    


def _speakers_sequence(
    audio_data: list[Speech], audiolength: int
) -> dict[str, list]:
    """ Parse list speech objects from audio diarization into
        dictionary mapping speakers to action/state by seconds

    @author: JustAkiniyi

    Args:
        audio_data (list[Speech]): list comprised of Speech objects from speaker diarization
        [Speech(), Speech() ...]
        audiolength (int): length of diarized audio(secs)

    Returns:
        dict[str, list]: 


        >>>> _speaker_sequence(audio_data, audiolength)
        >>>> {
            "A": ['speech', 'speech', 'silence'...],
            "B": ['speech', 'silence', 'silence'...],
            ...
        }
    """
    ## split speech list into individual speakers using a dictionary
    speaker_sequence = {}
    for data in audio_data:
        if data.speaker not in speaker_sequence:
            speaker_sequence[data.speaker]=[data.duration]
        else:
            speaker_sequence[data.speaker].append(data.duration)
    
    ## loop through every second in audio lenght
    ## assign 'silence' as value if second not in speaker state list
    ## else assign 'speech' as value
    speaking_moments={}
    for each_speaker in speaker_sequence:
        flattened_list = list(chain.from_iterable(speaker_sequence[each_speaker]))
        result = []
        for i in range(0, audiolength + 1):
            if i in flattened_list:
                result.append("speech")
            else:
                result.append("silence")
        speaking_moments[each_speaker] = result
    return speaking_moments
    