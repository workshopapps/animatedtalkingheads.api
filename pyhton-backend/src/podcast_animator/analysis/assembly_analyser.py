# import os
# from pathlib import Path
import requests
import time
# from dotenv import load_dotenv
# import numpy as np
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


    endpoint_result = "https://api.assemblyai.com/v2/transcript/" +  second
    headers2 = {
        "authorization": API_KEY,
    }
    # print(first)
    process_done = False
    while not process_done:
        response2= requests.get(endpoint_result, headers=headers2)
        a = response2.json()
        status = a["status"]
        if status != "completed":
            time.sleep(20) 
        else:
            process_done = True           
    # time.sleep(20) #waiting for response
    #second = "rx44sn32o3-25dd-4d21-a286-a04f58ba0f43"
    


    #maps words to timestamp only
    # endpointVTT = "https://api.assemblyai.com/v2/transcript/" + second + "/vtt"

    

    # time.sleep(400) #wait for transcription 
    
    listout = {
        "text":a["text"], 
        "utterances": a["utterances"],
        "audio_duration": int(a["audio_duration"])
        }

    # ress = requests.get(endpointVTT, headers=headers2)
    # b = ress.text #just time and speech
    return listout

#insta = diarize_audio("https://bit.ly/3rBnQ8i") #


def checking(audio1):
    audiotexts = []
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
        if starttime == endtime:
            duraction = [starttime]
        else:
            duraction = list(range(starttime,endtime+1))
        
        text = {
            "speaker" : speaker,
            # "start" : starttime, 
            # "end" : endtime,
            "duration" : duraction,
            "speech" : speech,
            "index" : count,
        }
        print(speaker, duraction)
        count += 1
        audiotexts.append(text)
        speakersvale.append(speaker)
    return audiotexts, audiolength

# def listdupes(seq):
#     seen = set()
#     seen_add = seen.add
#     seen_twice = set(x for x in seq if x in seen or seen_add(x))
#     return list(seen_twice)


def chunkgeneratory2(iterable, chunk_size):
    return [iterable[x:x + chunk_size] for x in range(0, len(iterable), chunk_size)]

def chunkgeneratory1(iterable, chunk_size):
    imagesList = iter(iterable)
    chunk = list(islice(imagesList, chunk_size)) #n is steps iterable is sliced
    while chunk:
        yield chunk
        chunk = list(islice(imagesList, chunk_size))





def whoistalking(audiotexts, timetotal):
    # it = chunkgeneratory1(timetotal, 1)
    for dict_item in audiotexts:
            newdur = dict_item["duration"]
            it = chunkgeneratory1(timetotal, 1)
            it2 = chunkgeneratory1(newdur, 1)
            # for yawn, noyawn in zip(it, it2):
            while it:
                try:
                    dur = next(it)
                    dur2 = next(it2)
                except StopIteration:
                    break
                if collections.Counter(dur2) == collections.Counter(dur):
                    valt = "speech"
                else:
                    valt = "silence"
                
                yield dict_item["speaker"],valt




def convertdict(audiotexts, audiolength): #returns speaker sequence
    isIT ={}
    speechsequeen = []
    timetotal = list(range(0,audiolength+1))
    donemaybe = whoistalking(audiotexts, timetotal)        
    while True:
        try:
            letter = next(donemaybe)
        except StopIteration:
            break
        speechsequeen.append(letter)
    for x,y in speechsequeen:
        isIT.setdefault(x,[]).append(y)
    print(isIT)
    return isIT