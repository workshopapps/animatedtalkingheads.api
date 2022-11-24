import re
from itertools import chain
import pronouncing
from g2p_en import G2p
import numpy as np
from .speech import Speech
from .data_schemer import DATA_SCHEMA, STATE_MAP
from podcast_animator.analysis.assembly_analyser import diarize_audio

def split(duration, chunks):
    k, m = divmod(len(duration), chunks)
    return (duration[i*k+min(i, m):(i+1)*k+min(i+1, m)] for i in range(chunks))
g2p = G2p()

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
    

    # transcription = dataneed["text"]
    diarization = dataneed["words"]
    audiolength = int(dataneed["audio_duration"])  
    audio_data = []
    for data in diarization:
        phrase = Speech(
            speaker=data["speaker"],
            start = data["start"],
            stop = data["end"],
            text=data["text"],
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
    import time
    start = time.time()
    speaker_sequence = {}
    for data in audio_data:
        if data.speaker not in speaker_sequence:
            if len(data.text.split(' ')) >1:
                wrds = data.text.split(' ')
                durs = split(data.duration, len(wrds))
                res = []
                for wrd, dur in zip(wrds, durs):
                    res.extend(extract_phoneme(wrd, dur))
                speaker_sequence[data.speaker] = res
            else:
                speaker_sequence[data.speaker]=[extract_phoneme(data.text, data.duration)]
        else:
            if len(data.text.split(' ')) >1:
                wrds = data.text.split(' ')
                durs = split(data.duration, len(wrds))
                # print(wrds, list(durs))
                res = []
                for wrd, dur in zip(wrds, durs):
                    res.extend(extract_phoneme(wrd.strip(), dur))
                speaker_sequence[data.speaker].append(res)
            else:
                speaker_sequence[data.speaker].append(list(extract_phoneme(data.text, data.duration)))
    print(time.time() - start)
    speaking_moments = {}
    for each_speaker in speaker_sequence:
        # print(speaker_sequence[each_speaker])
        flattened_list = list(chain.from_iterable(speaker_sequence[each_speaker]))
        # print(flattened_list[:50])    
        result = []
        for i in range(0, (audiolength + 1) * 1000 , 42):
            # print(i)
            stp_index = next((index for index, wrd in enumerate(flattened_list) if wrd[0] == i), None)
            # print(stp_index)
           
            if stp_index is not None:
                stamp_index = next((index for index, wrd in enumerate(flattened_list) if wrd[0] == i), None)
                # stamp_index = flattened_list.index(i)
                if flattened_list[stamp_index][1] in STATE_MAP:
                    result.append(STATE_MAP[flattened_list[stamp_index][1]])
                # for state in DATA_SCHEMA:
                #     if flattened_list[stamp_index][1] in DATA_SCHEMA[state]:
                #         result.append(state)
                #         break
            else:
                result.append("closed")
        print(result[:50])
        speaking_moments[each_speaker] = result
    return speaking_moments
    
    

def extract_phoneme(word: str, duration: list[int], g2p: G2p = g2p) -> list[str]:
    """ generate a timestamp mapped list of phone present in a word

    Args:
        word (str): word from the English language
        timestamp (list[int]): ordered timestamps in multiples of 42 
                               representing length of time assigned to word
        e.g [0, 42, 84 ...]
        [1(24anim), 1(24default)]
        []
        24 frmez -> 1000 msecs
        1 frmze -> 41.67 msecs
    Returns:
        list[str]: mouth shape for each frame in video
        

        [hhw2, fo41, fmwo0, ]
        {
            hhw: 2,
            fo4, 1,
            fmwo: 0,
        }


    """
   
    
    # phonemes = pronouncing.phones_for_word(word)
    try:
        phonemes = pronouncing.phones_for_word(word)[0].split(' ')
    except IndexError:
        phonemes = g2p(word)
        phonemes = [phnm for phnm in phonemes if phnm != ' ']
    # print(phonemes)
    phoneme_dict = {}
    for ph in phonemes:
        # phoneme_dict[re.sub(r'\d+', '', ph)] = int(re.findall(r'\d+', ph)[0]) + 1 if  re.match(r'\d+', ph) else 0
        if re.search(r'\d+', ph):
            phoneme_dict[re.sub(r'\d+', '', ph)] = int(re.findall(r'\d+', ph)[0]) + 1
        else: 
            phoneme_dict[re.sub(r'\d+', '', ph)] = 0
    
    ## sort weighted dictionary on value 
    sorted_phoneme_dict = dict(sorted(phoneme_dict.items(), key=lambda item: item[1], reverse=True)) 
    result_list = [re.sub(r'\d+', '', phn) for phn in phonemes]
    while len(result_list) < len(duration):
        for phn in sorted_phoneme_dict:
            if len(result_list)  == len(duration):
                break
            else:
                phn_index = result_list.index(phn)
                result_list.insert(phn_index, phn)
                # print(phn_index, phn, result_list)
    # print(sorted_phoneme_dict)
    # print(word, phonemes, sorted_phoneme_dict, result_list, dict(zip(duration, result_list)))
    return tuple(zip(duration, result_list))
        
    




        

