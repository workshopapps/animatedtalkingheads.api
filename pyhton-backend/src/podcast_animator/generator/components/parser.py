from SpeakerDiarization import *
import numpy as np
from itertools import islice
import collections
from sys import argv

dataneed = SpeakerDiarization(audio="") #this is where speaker diarization is called

transcription = dataneed["text"]
diarization = dataneed["utterances"]
audiolength = int(dataneed["audio_duration"]/1000)

#time start and end in millieseconds -> convert to seconds
audiotexts = []
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

timetotal = list(range(0,audiolength+1))


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


    

# if __name__ == "__main__":
#     start = time.time()
#     metadata_path = str(argv[1])
#     print(convertdict())