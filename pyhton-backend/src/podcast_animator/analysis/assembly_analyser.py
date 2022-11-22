import os
import requests
import time
from itertools import islice
import collections




API_KEY = str(os.getenv("ASSEMBLYAI"))
print(API_KEY)

def diarize_audio(audio):
    """ 
    using assembly ai we send an audio url and obtain json data for the audio file
    @author : cchimdindu

    Args:
        audio (string): url of video

    Returns:
        lis: json file is sorted out and returned in list format
    """

    endpoint1 = "https://api.assemblyai.com/v2/transcript"

    # json1 = {
    # "audio_url": audio,
    # "speaker_labels": True,
    # "disfluencies": True #transcribe filler words
    # }
    # headers1 = {
    #     "authorization": API_KEY,
    #     "content-type": "application/json",
    # }
    # response1 = requests.post(endpoint1, json=json1, headers=headers1)
    # first = response1.json()
    # print(first["id"])
    # second = first["id"]
    # rxym41rlo2-2606-4354-ae8f-095ccdf58181


    # endpoint_result = "https://api.assemblyai.com/v2/transcript/" +  second
    endpoint_result = "https://api.assemblyai.com/v2/transcript/" +  "rxym41rlo2-2606-4354-ae8f-095ccdf58181"
    headers2 = {
        "authorization": API_KEY,
    }
    # print(first)
   
    # response2= requests.get(endpoint_result, headers=headers2)
    # a = response2.json()
  
             
    process_done = False
    while not process_done:
        response2= requests.get(endpoint_result, headers=headers2)
        a = response2.json()
        status = a["status"]
        if status != "completed":
            print(f"Processing Audio, Status: [{status}]")
            time.sleep(20) 
        else:
            process_done = True           
    
    


    #maps words to timestamp only
    # endpointVTT = "https://api.assemblyai.com/v2/transcript/" + second + "/vtt"

    
    listout = {
        "text":a["text"], 
        "utterances": a["utterances"],
        "audio_duration": int(a["audio_duration"])
        }

    # ress = requests.get(endpointVTT, headers=headers2)
    # b = ress.text #just time and speech
    return listout



def checking(audio1):
    """taking data from audio transcript and turns into dictionary
    puts all utterances into a list for easy adapataion
    @author: cchimdindu
    Args:
        audio1 (string): url used to call diariza_audio function

    Returns:
        List, int: list of utterances formatted each time person speaks, length of video
    """
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
            "duration" : duraction,
            "speech" : speech,
            "index" : count,
        }
        print(speaker, duraction)
        count += 1
        audiotexts.append(text)
        speakersvale.append(speaker)
    return audiotexts, audiolength


def chunkgeneratory2(iterable, chunk_size):
    """takes an iterable and makes it a nested list of size needed
    @author: cchimdindu
    Args:
        iterable (list,dict,tuple,set): anything that can be looped
        chunk_size (int): size you want iterable split into

    Returns:
        nested list: [[..],...,[..]]
    """
    return [iterable[x:x + chunk_size] for x in range(0, len(iterable), chunk_size)]


def chunkgeneratory1(iterable, chunk_size):
    """takes an iterable and makes it a nested list of size needed
    @author: cchimdindu
    Args:
        iterable (list,tuple,sets,dict): anything that can be looped
        chunk_size (int): size you want iterable split into

    Yields:
        list: [..] multiple yields for each time yeild is called
    """
    imagesList = iter(iterable)
    chunk = list(islice(imagesList, chunk_size)) #n is steps iterable is sliced
    while chunk:
        yield chunk
        chunk = list(islice(imagesList, chunk_size))


def whoistalking(audiotexts, timetotal):
    """checks who is speaking when
    @author: cchimdindu
    Args:
        audiotexts (list): contains each instance a person talks, in turns
        timetotal (int): length of audio

    Yields:
        string,string: person speaking name, true or false for person speaking
    """
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
    """converts tuple to dict
    @author: cchimdindu
    Args:
        audiotexts (list): list of each persons turn in speaking
        audiolength (int): length of audio file

    Returns:
        dict: [
            {'A':'speech','silent'},
            {'B':'silent','speech'}
        ]
    """
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
    print(isIT) #for cchimdindu testing
    return isIT