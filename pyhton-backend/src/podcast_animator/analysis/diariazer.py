import os
import re
import time
import requests
from pathlib import Path
from podcast_animator.config import Config
from podcast_animator.utils.file_handlers import FileHandler
from podcast_animator.utils.dataschema import DataSchemer


def extract_wordtimestamps(sentence_dict):
    split_sentence = sentence_dict["text"].split(" ")
    words_obj = sentence_dict["words"]
    timestamp_list = [f"{wrd['start']}-{wrd['end']}" for wrd in words_obj]

    result = {}
    start = 0
    for index, wrd in enumerate(split_sentence):
        if re.search(r"\.$|\?$|\,$", wrd):
            sentence = " ".join(split_sentence[start : index + 1])
            timestamps = ";".join(timestamp_list[start : index + 1])
            result[sentence] = timestamps
            start = index + 1
    return result


def utterance_schema(utterance: dict, exclude_list) -> dict:
    result = {}
    for key, value in utterance.items():
        if key == "words":
            result["sentences"] = extract_wordtimestamps(utterance)
        elif key not in exclude_list:
            result[key] = value
    return result


def diarize_audio(audio):
    """
    using assembly ai we send an audio url and obtain json data for the audio file
    @author : cchimdindu
    Args:
        audio (string): url of video
    Returns:
        lis: json file is sorted out and returned in list format
    """

    url = "https://api.assemblyai.com/v2/transcript"

    post_body = {
        "audio_url": audio,
        "speaker_labels": True,  # include speaker labels
        # "disfluencies": True #transcribe filler words
    }
    headers = {
        "authorization": Config.ASSEMBLYAI,
        "content-type": "application/json",
    }
    transcription_response = requests.post(url, json=post_body, headers=headers)
    transcription_id = transcription_response.json()["id"]

    ## remove content-type from request headers
    del headers["content-type"]

    transcription_status = False
    while not transcription_status:
        ## id of transcribed audio used for testing
        # "rxym41rlo2-2606-4354-ae8f-095ccdf58181"
        #         response= requests.get(f'{url}/rxym41rlo2-2606-4354-ae8f-095ccdf58181', headers=headers)
        response = requests.get(f"{url}/{transcription_id}", headers=headers)
        request_data = response.json()
        status = request_data["status"]
        if status != "completed":
            print(f"Processing Audio, Status: [{status}]")
            time.sleep(20)
        else:
            transcription_status = True

    exclude_list = ["confidence"]
    transcription = {
        "transcription_id": "rxym41rlo2-2606-4354-ae8f-095ccdf58181",
        DataSchemer.AUDIO_DURATION_SECONDS: request_data["audio_duration"],
        # "text": request_data["text"],
        "speech": [
            utterance_schema(utterance, exclude_list)
            for utterance in request_data["utterances"]
        ]
        # "words": [
        #     { key: value for key, value in word.items() if key not in remove_list}
        # for word in request_data["words"]
        #     ]
    }
    return transcription


def load_audio_diarization(
    audio_url: str, audio_data_path: Path, file_handler: FileHandler
) -> dict:
    """returns saved diarization data from audio directory if exists
       else request and save diarization in audio directory

       author: @anonnoone

    Args:
        audio_url (str): downloadable url of audio file
        audio_data_path (Path): unique directory for audio related files
        file_handler (FileHandler): file management object, writes requested diarization to disk

    Returns:
        dict: dictionary containing diarization_id, speaker diarization of audio file and audio length in seconds

        >>>> {
            "transaction_id" : "rx.....",
            "audio_length_secs" : 2340,
            "speech" : [
                ...
            ]
        }
    """
    saved_diariztion = audio_data_path / "diarization.json"
    if saved_diariztion.exists():
        diarizations = file_handler.load(saved_diariztion)
    else:
        diarizations = diarize_audio(audio_url)
        file_handler.write(saved_diariztion, diarizations)
    return diarizations
