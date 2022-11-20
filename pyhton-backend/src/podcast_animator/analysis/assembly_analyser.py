import os
from pathlib import Path
import requests
import time
from dotenv import load_dotenv
import numpy as np
from itertools import islice
import collections
from sys import argv


API_KEY = "abee7903c31046f1a8f50ccb320f65ed" 

def diarize_audio(audio):

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

    print(first)

    time.sleep(20) #waiting for response
    #second = "rx44sn32o3-25dd-4d21-a286-a04f58ba0f43
    endpoint_result = "https://api.assemblyai.com/v2/transcript/" + second


    #maps words to timestamp only
    endpointVTT = "https://api.assemblyai.com/v2/transcript/" + second + "/vtt"

    headers2 = {
        "authorization": API_KEY,
    }

    time.sleep(400) #wait for transcription 
    response2= requests.get(endpoint_result, headers=headers2)
    a = response2.json()
    listout = {
        "text":a["text"], 
        "utterances": a["utterances"],
        "audio_duration": int(a["audio_duration"])
        }

    ress = requests.get(endpointVTT, headers=headers2)
    b = ress.text #just time and speech
    return listout

#insta = diarize_audio("https://bit.ly/3rBnQ8i") #

audiotexts = []
def checking(audio1):
    dataneed = diarize_audio(audio1)
    transcription = dataneed["text"]
    diarization = dataneed["utterances"]
    audiolength = int(dataneed["audio_duration"]/1000)

    #time start and end in millieseconds -> convert to seconds
    speakersvale = []
    count = 0
    for a in diarization:
        data = a
        speaker = data["speaker"]
        starttime = int(data["start"]/1000) #convert to seconds
        endtime = int(data["end"]/1000) #convert to seconds
        speech = data["text"]
        duraction = list(range(starttime,endtime))
        
        text = {
            "speaker" : speaker,
            # "start" : starttime, 
            # "end" : endtime,
            "duration" : duraction,
            "speech" : speech,
            "index" : count,
        }
        count += 1
        audiotexts.append(text)
        speakersvale.append(speaker)
    return audiolength

def listdupes(seq):
    seen = set()
    seen_add = seen.add
    seen_twice = set(x for x in seq if x in seen or seen_add(x))
    return list(seen_twice)


def chunkgeneratory2(iterable, chunk_size):
    return [iterable[x:x + chunk_size] for x in range(0, len(iterable), chunk_size)]

def chunkgeneratory1(iterable, chunk_size):
    imagesList = iter(iterable)
    chunk = list(islice(imagesList, chunk_size)) #n is steps iterable is sliced
    while chunk:
        yield chunk
        chunk = list(islice(imagesList, chunk_size))

timetotal = list(range(0,checking()+1))



def whoistalking():
    it = chunkgeneratory2(timetotal, 5)
    for dict_item in audiotexts:
            newdur = dict_item["duration"]
            it2 = chunkgeneratory1(newdur, 5)
            
            # while True:
            for yawn in it:
                try:
                    dur = yawn
                    dur2 = next(it2)
                except StopIteration:
                    break
                if collections.Counter(dur) == collections.Counter(dur2):
                    valt = "speaking"
                else:
                    valt = "silence"
                
                yield dict_item["speaker"],valt




def convertdict(): #returns speaker sequence
    isIT ={}
    speechsequeen = []
    donemaybe = whoistalking()        
    while True:
        try:
            letter = next(donemaybe)
        except StopIteration:
            break
        speechsequeen.append(letter)
    for x,y in speechsequeen:
        isIT.setdefault(x,[]).append(y)
    return isIT
