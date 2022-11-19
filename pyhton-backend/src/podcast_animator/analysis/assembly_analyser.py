import os
from pathlib import Path
import requests
import time
from dotenv import load_dotenv


DOTENV_PATH = Path() / "env/.env"
if DOTENV_PATH.exists():
    load_dotenv(DOTENV_PATH)


API_KEY = os.getenv("ASSEMBLY_AI_KEY")

def SpeakerDiarization(audio):

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
    time.sleep(20) #waiting for response
    first = response1.json()
    second = first["id"]

    
    #rxzsl5nggw-cb58-4a69-be7a-7826f6b662a6
    #entire data analysis
    endpoint2 = "https://api.assemblyai.com/v2/transcript/" + second
    #maps words to timestamp only
    endpointVTT = "https://api.assemblyai.com/v2/transcript/" + second + "/vtt"

    headers2 = {
        "authorization": API_KEY,
    }

    time.sleep(400) #wait for transcription 
    response2= requests.get(endpoint2, headers=headers2)
    a = response2.json()
    listout = {"text":a["text"], "utterances": a["utterances"],"audio_duration": a["audio_duration"]}

    ress = requests.get(endpointVTT, headers=headers2)
    b = ress.text #just time and speech
    return listout