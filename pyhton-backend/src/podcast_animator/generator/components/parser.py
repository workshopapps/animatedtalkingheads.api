import re
from itertools import chain
import pronouncing
from g2p_en import G2p
import numpy as np
from .speech import Speech, Utterance
from .data_schemer import  STATE_MAP
from .emotion_generator import read_sentence_emotions
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
    

    utterance_diarization = dataneed["utterances"]
    word_diarization = dataneed["words"]
    audiolength = int(dataneed["audio_duration"])  
    mouth_data = []
    eye_data = []
    for data in word_diarization:
        word = Speech(
            speaker=data["speaker"],
            start = data["start"],
            stop = data["end"],
            text=data["text"]
        )
        mouth_data.append(word)
   
    mouth_sequence = _speakers_sequence(mouth_data, audiolength)
    
    # for dt in utterance_diarization:
    #         eye = Utterance(
    #             speaker= dt["speaker"],
    #             start= dt["start"],
    #             stop = dt["end"],
    #             text= dt["text"]
    #         )
    #         eye_data.append(eye)
    # eye_sequence = _eye_sequence(eye_data, audiolength)
    return mouth_sequence, eye_sequence #, subtitle
    
def _eye_sequence(user_data, audiolength):
    speaker_data = {}
    subtitle_data = {}
    for eye_utt in user_data:
        emotion = read_sentence_emotions(eye_utt.text)[0]
        if eye_utt.speaker not in speaker_data:
            speaker_data[eye_utt.speaker] = [[(timestamp, emotion) for timestamp in eye_utt.duration]]
        else:
            speaker_data[eye_utt.speaker].append([(timestamp, emotion) for timestamp in eye_utt.duration])
    eye_seq = {}
    for speaker in speaker_data:
        flat = chain.from_iterable(speaker_data[speaker])
        result = []
        for i in range(0, audiolength + 1):
            stp_id = next((index for index, wrd in enumerate(flat) if wrd[0] == i), None)
            if stp_id is not None:
                result.append(flat[stp_id][1])
            else:
                result.append("neutral")
        eye_seq[speaker] = result
    return eye_seq

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
    # import time
    # start = time.time()
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
    # print(time.time() - start)
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
               
                # stamp_index = flattened_list.index(i)
                if flattened_list[stp_index][1] in STATE_MAP:
                    result.append(STATE_MAP[flattened_list[stp_index][1]])
                # for state in DATA_SCHEMA:
                #     if flattened_list[stamp_index][1] in DATA_SCHEMA[state]:
                #         result.append(state)
                #         break
            else:
                result.append("closed")
        print(len(result))
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