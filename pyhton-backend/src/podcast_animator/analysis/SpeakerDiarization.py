import requests
import time

def SpeakerDiarization(audio):

    endpoint1 = "https://api.assemblyai.com/v2/transcript"

    json1 = {
    "audio_url": audio,
    "speaker_labels": True,
    "disfluencies": True #transcribe filler words
    }
    headers1 = {
        "authorization": "39a26cbde21d4b88a3d8a392cac14f4c",
        "content-type": "application/json",
    }
    response1 = requests.post(endpoint1, json=json1, headers=headers1)
    time.sleep(100) #waiting for response
    first = response1.json()
    second = first["id"]

    
    #rxzsl5nggw-cb58-4a69-be7a-7826f6b662a6
    #entire data analysis
    endpoint2 = "https://api.assemblyai.com/v2/transcript/" + second
    #maps words to timestamp only
    endpointVTT = "https://api.assemblyai.com/v2/transcript/" + second + "/vtt"

    headers2 = {
        "authorization": "39a26cbde21d4b88a3d8a392cac14f4c",
    }

    time.sleep(400) #wait for transcription 
    response2= requests.get(endpoint2, headers=headers2)
    a = response2.json()
    listout = {"text":a["text"], "utterances": a["utterances"],"audio_duration": a["audio_duration"]}

    ress = requests.get(endpointVTT, headers=headers2)
    b = ress.text #just time and speech
    return listout

