from parser import Text
from itertools import chain, iter

def imageParse():
    audio_data = [Text]
    speaker_sequence = {}
    for data in audio_data:
        if data.speaker not in speaker_sequence:
            speaker_sequence[data.speaker].append(data.index,data.duration,data.text)

        else:
            speaker_sequence[data.speaker]=[(data.index,data.duration, data.text)]

    speaking_moments={}
    for each_speaker in speaker_sequence:
        for speech_details in each_speaker:
            speech_duration = speech_details[1]
            speaking_list = list(chain.from_iterable(speech_duration))

    result_sequence = []
    for timing in range(iter(speech_duration)):
        if timing in speaking_list:
            result_sequence.append("speech")
        else:
            result_sequence.append("silence")
    speaking_moments[timing] = result_sequence

    return(speaking_moments)
    