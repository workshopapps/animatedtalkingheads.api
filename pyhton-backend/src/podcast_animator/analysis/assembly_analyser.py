import os
from pathlib import Path
import requests
import time
from dotenv import load_dotenv


DOTENV_PATH = "abee7903c31046f1a8f50ccb320f65ed" #Path() / "env/.env"
# print(DOTENV_PATH.exists())
# if DOTENV_PATH.exists():
#     load_dotenv(DOTENV_PATH)


API_KEY = "abee7903c31046f1a8f50ccb320f65ed" #os.getenv("ASSEMBLY_AI_KEY")

def diarize_audio(audio: str) -> dict[str, list | int | str]:
    """return speaker diarization data from provided audio url

    Args:
        audio (str): downloadable url of audio file

    Returns:
        dict[str, list | int | str]: metadata from audio
    """

    endpoint1 = "https://api.assemblyai.com/v2/transcript"

    json1 = {
    "audio_url": audio,
    "speaker_labels": True,
    "disfluencies": True #transcribe filler words
    }
    headers1 = {
        "authorization": API_KEY,
        "content-type": "application/json",
    }
    response1 = requests.post(endpoint1, json=json1, headers=headers1)
    first = response1.json()
    second = first["id"]

    time.sleep(20) #waiting for response
    "rx44sn32o3-25dd-4d21-a286-a04f58ba0f43"
    endpoint_result = "https://api.assemblyai.com/v2/transcript/" + second


    #maps words to timestamp only
    #endpointVTT = "https://api.assemblyai.com/v2/transcript/" + second + "/vtt"

    headers2 = {
        "authorization": API_KEY,
    }

    #time.sleep(400) #wait for transcription 
    response2= requests.get(endpoint_result, headers=headers2)
    a = response2.json()
    listout = {
        "text":a["text"], 
        "utterances": a["utterances"],
        "audio_duration": int(a["audio_duration"])
        }

    # ress = requests.get(endpointVTT, headers=headers2)
    # b = ress.text #just time and speech
    return listout