import requests
import time
import itertools
import re


def extract_wordtimestamps(sentence_dict):
    sentence = sentence_dict["text"]
    split_sentence = list(filter(None, re.split(r'[.,?]', sentence)))
    sentence_lengths = [len(split.strip().split(' ')) for split in split_sentence]
    word_obj = sentence_dict["words"]

    def word_timestamps( start, stop):
        return ";".join([f"{word['start']}-{word['end']}" for word in word_obj[start: stop]])

    if len(split_sentence) <= 1:
        return {split_sentence[0]: word_timestamps(0, len(word_obj) )}

    current_stop = sentence_lengths[0]
    current_start = 0
    result = {}

    for i, sentence in enumerate(split_sentence):
        result[sentence] = word_timestamps(current_start, current_stop)
        current_start = current_stop
        try:
            current_stop += sentence_lengths[i+1]
        except IndexError:
            print(sentence_lengths, result.values())
            break
        
    return result



# def extract_timestamps(sentence_dict: dict[str, str | dict[str, str | int]]):
#     sentence = sentence_dict["text"]
#     split_sentence = list(filter(None, re.split(r'[.,?]', sentence)))
#     split_words = [phrase.split(' ') for phrase in split_sentence ]
#     for phrase_list in split_words:
#         phrase_list[0], phrase_list[-1] = "##start##", "##end##"
#     all_words = itertools.chain.from_iterable(split_words)
#     word_obj = sentence_dict["words"]
#     word_list = [
#        ( f'{word["start"]}-{word["end"]}', word["text"]) for word in word_obj
#     ]
    
#     counter = 0
#     for word, time_stamp in zip(all_words, word_list):
#         if split_words[counter][0] != "##start##" and split_words[counter][-1] != "##end##":
#             counter += 1
#         if word == "##start##":
#             split_words[counter][0] = time_stamp[0].split('-')[0]
#         elif word == "##end##":
#             split_words[counter][-1] = time_stamp[0].split('-')[1]
#     result = {}
#     for index, sentence in enumerate(split_sentence):
#         result[f"{split_words[index][0]}-{split_words[index][-1]}"] = sentence

#     return result

    





def diarize_audio(audio, api):
    """ 
    using assembly ai we send an audio url and obtain json data for the audio file
    @author : cchimdindu
    Args:
        audio (string): url of video
    Returns:
        lis: json file is sorted out and returned in list format
    """

    url = "https://api.assemblyai.com/v2/transcript"

    # post_body = {
    # "audio_url": audio,
    # "speaker_labels": True, #include speaker labels
    # # "disfluencies": True #transcribe filler words
    # }
    headers = {
        "authorization": api,
        "content-type": "application/json",
    }
    # transcription_response = requests.post(url, json=post_body, headers=headers)
    # transcription_id = transcription_response.json()["id"]
    
    

    ## remove content-type from request headers
    del headers["content-type"]
    
        
    transcription_status = False
    while not transcription_status:
        ## id of transcribed audio used for testing
        # "rxym41rlo2-2606-4354-ae8f-095ccdf58181"
        response= requests.get(f'{url}/rxym41rlo2-2606-4354-ae8f-095ccdf58181', headers=headers)
        # response= requests.get(f'{url}/{transcription_id}', headers=headers)
        request_data = response.json()
        status = request_data["status"]
        if status != "completed":
            print(f"Processing Audio, Status: [{status}]")
            time.sleep(20) 
        else:
            transcription_status = True           

    remove_list = ["confidence"]
    # utterances = [ 
    #         { key: value for key, value in utterance.items() if key not in remove_list}
    #     for utterance in request_data["utterances"]
    #         ]
  
    def utterance_schema(utterance: dict) -> dict:
        result = {}
        for key, value in utterance.items():
            if key == "words":
                result["sentences"] = extract_wordtimestamps(utterance)
            elif key not in remove_list:
                result[key] = value
        return result

    transcription = {
        "transcription_id": 'rxym41rlo2-2606-4354-ae8f-095ccdf58181',
        "audio_duration_seconds": request_data["audio_duration"],
        "text":request_data["text"], 
        "speech":[utterance_schema(utterance) for utterance in request_data["utterances"]]
        # "words": [ 
        #     { key: value for key, value in word.items() if key not in remove_list}
        # for word in request_data["words"]
        #     ]
        }
    return transcription


