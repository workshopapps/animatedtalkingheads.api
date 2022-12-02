import json
import itertools
import numpy as np
import re

path = "test_data/meta.json"

def wordtoframe(path):
    #input : only json file path
    #output : [frametime,word]
    with open(path) as file:
        timeRange = []
        list3 = []
        timelist = []
        string1 = ""
        data = json.load(file)
        time = data["audio_duration"] #get audio len
        timeMs = int(time)*1000

        #get json data
        for speech in data['speech']:
            string1 = string1 + " " #fixing space issue in json
            for a in speech['sentences']:
                string1 = string1 + a
                value = speech['sentences'][a]
                timeRange.append(value)
        for t in timeRange:
            k = t.split(";")
            list3.append(k)
        
        alltime = sum(list3, [])
        words = string1.split()
        myset = list(zip(words, alltime))

        #getting frame range
        frametime = np.arange(0, timeMs, 41.66)
        for a in frametime:
            timelist.append(a)
        
        final = []
        #combine word to frame
        for word,result in myset:
            timenow = result.split("-")
            for t in timelist:
                num = float(t)
                if float(timenow[0]) < num < float(timenow[1]):
                    final.append(num,word)
                else:
                    final.append(num,"empty")

        return final #[(frametime,word)]

def wordtoframeandwordtime(path):
    #input : only json file path
    #output : [frametime,word,wordtimerange]
    with open(path) as file:
        timeRange = []
        list3 = []
        timelist = []
        string1 = ""
        data = json.load(file)
        time = data["audio_duration"] #get audio len
        timeMs = int(time)*1000

        #get json data
        for speech in data['speech']:
            string1 = string1 + " " #fixing space issue in json
            for a in speech['sentences']:
                string1 = string1 + a
                value = speech['sentences'][a]
                timeRange.append(value)
        for t in timeRange:
            k = t.split(";")
            list3.append(k)
        
        alltime = sum(list3, [])
        words = string1.split()
        myset = list(zip(words, alltime))

        #getting frame range
        frametime = np.arange(0, timeMs, 41.66)
        for a in frametime:
            timelist.append(a)
        
        final = []
        #combine word to frame
        for word,result in myset:
            timenow = result.split("-")
            #wordtimes = list(range(timenow[0],timenow[1]))
            for t in timelist:
                num = float(t)
                if float(timenow[0]) < num < float(timenow[1]):
                    final.append(num,word,timenow)
                else:
                    final.append(num,"empty")

        return final #[(frametime,word,wordtimerange)]
    

def wordtoframenumber():
    #input : only json file path
    #output : [frametime,word,wordtimerange]
    with open(path) as file:
        timeRange = []
        list3 = []
        timelist = []
        string1 = ""
        data = json.load(file)
        time = data["audio_duration"] #get audio len
        timeMs = int(time)*1000

        #get json data
        for speech in data['speech']:
            string1 = string1 + " " #fixing space issue in json
            for a in speech['sentences']:
                string1 = string1 + a
                value = speech['sentences'][a]
                timeRange.append(value)
        for t in timeRange:
            k = t.split(";")
            list3.append(k)
        
        alltime = sum(list3, [])
        words = string1.split()
        myset = list(zip(words, alltime))

        #getting frame range
        framenumber = []
        count = 1 #starting frame at 1
        frametime = np.arange(0, timeMs, 41.66)
        for a in frametime:
            timelist.append(a)
            framenumber.append(count)
            count += 1
        
        final = []
        #combine word to frame
        for word,result in myset:
            timenow = result.split("-")
            #wordtimes = list(range(timenow[0],timenow[1]))
            for t,s in zip(timelist,framenumber):
                num = float(t)
                if float(timenow[0]) < num < float(timenow[1]):
                    print(s,word)
                    # final.append(s,word)
                # else:
                    # final.append(s,"empty")
        # print(final[:10])
        # return final #[(framenumber,word,wordtimerange)]




                    
def sentencestoframes(path):
    #input: json file path
    #output: [frametime,sentence]
    with open(path) as file:
        list2 = []
        list3 = []
        timelist = []
        sentence = []
        str1 = ""
        data = json.load(file)
        time = data["audio_duration"]
        timems = int(time)*1000

        frametime = np.arange(0, timems, 41.66)
        for a in frametime:
            timelist.append(a)

        for speech in data['speech']:
            for a in speech['sentences']:
                sentence.append(a)
                value = speech['sentences'][a]
                #print(str(value))
                #valuesplit = re.split(r';-',value)
                valuesplit = value.split(";")
                timee = []
                for p in valuesplit:
                    valuesplit2 = p.split("-")
                    #condition for out of range
                    try:
                        timee.append(valuesplit2[0])
                        timee.append(valuesplit2[1])
                    except IndexError:
                        print("outrange")
                    #print(valuesplit2)
                startsen = timee[0]
                endsen = timee[-1]
                list2.append(timee)
                #print(startsen)
                #print(endsen)
        #print(timee)
        final = []
        for sen,list2 in zip(sentence,list2):
            #print(list2)
            startsen = list2[0]
            endsen = list2[-1]
            for t in timelist:
                num = float(t)
                if float(startsen) < num < float(endsen):
                    final.append(num,sen)
                else:
                    final.append(num,"empty")
    
    return final #[(frametime,sentence)]

            

if __name__ == "__main__":
    wordtoframenumber()