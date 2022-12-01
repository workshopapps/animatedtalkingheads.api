import os
import requests
import time
from itertools import islice
import collections




#API_KEY =  #str(os.getenv("ASSEMBLYAI"))
# print(API_KEY)

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

    post_body = {
    "audio_url": audio,
    "speaker_labels": True, #include speaker labels
    # "disfluencies": True #transcribe filler words
    }
    headers = {
        "authorization": api,
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
        # response= requests.get(f'{url}/rxym41rlo2-2606-4354-ae8f-095ccdf58181', headers=headers)
        response= requests.get(f'{url}/{transcription_id}', headers=headers)
        request_data = response.json()
        status = request_data["status"]
        if status != "completed":
            print(f"Processing Audio, Status: [{status}]")
            time.sleep(20) 
        else:
            transcription_status = True           

    remove_list = ["confidence", "words"]
    transcription = {
        "transcription_id": 'rxym41rlo2-2606-4354-ae8f-095ccdf58181',
        "audio_duration": int(request_data["audio_duration"]),
        "text":request_data["text"], 
        "utterances":[ 
            { key: value for key, value in utterance.items() if key not in remove_list}
        for utterance in request_data["utterances"]
            ],
        "words": [ 
            { key: value for key, value in word.items() if key not in remove_list}
        for word in request_data["words"]
            ]
        }
    return transcription



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
    print(dataneed)
    transcription = dataneed["text"]
    diarization = dataneed["words"]
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
