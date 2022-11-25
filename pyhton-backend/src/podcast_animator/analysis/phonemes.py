from itertools import islice
    

def totaltimeofsound(phonemesword,timeforword,wordlist):
    """total time it takes for a sound to be made
    @author: cchimdindu
    Args:
        phonemesword (list): the word broken into sounds
        timeforword (list): total time taken for word to be said
        wordlist (list): word broken into a list

    Returns:
        list: [665,8679,465,665] -->time for each sound
    """    
    phonemelength = len(phonemesword) - len(wordlist)*2.0 #get rid of / /
    isthis = timeforword/phonemelength #each letter in phonem gets time
    timelist = []
    for t in wordlist:
        value = isthis * len(t)-2 #each letter in phonem determines time given to sound the -2 is the / /
        timelist.append(int(value))
    return timelist

def weightofsound(wordlist):
    """how much each sounds stress is
    @author: cchimdindu
    Args:
        wordlist (list): list of sound in a word

    Returns:
        list: [2,1,2,4] -- shows which word has more stress on it
    """    
    #each sound has a weight the weight determines the length in 42 millieseconds which matches length
    weightlist = []
    for t in wordlist:
        weight = len(t)-2 #do -3 to start weight at 0
        weightlist.append(weight)
    return weightlist

def timeinterval(time,split):
    """time range in 42 steps for each sound
    @author: cchimdindu
    Args:
        time (int): millieseconds in a range for a word
        split (list): stress on each word

    Returns:
        linkedlist: each sounds time interval [[234,233,2235],[2424,231,134]]
    """    
    framestime = []
    sum = 0
    timelenth = len(time)
    for s in split:
        sum = s + sum
    lettertime = int(timelenth/sum)
    input = iter(time)
    output = [list(islice(input,lettertime*sizeelem)) for sizeelem in split]
    for a in output:
        first = a[0]
        last = a[-1]
        take = list(range(first,last,42))
        framestime.append(take)
    return framestime


def replacingletters(word,durationtimeorstart):
    """takes a word and turns it into sounds
    @author: cchimdindu
    Args:
        word (string): the word
        durationtime (list): range of time word was said

    Returns:
        set: (the sound , the interval of time)
    """    
    inputword = uniquecombos(word)
    correctword = isInDict(inputword)
    if type(durationtimeorstart) is list:
        maxtime = durationtimeorstart[len(durationtimeorstart)-1]
        starttime = durationtimeorstart[0]
        time = maxtime - starttime
    # else:
    #     starttime = durationtimeorstart
    #     maxtime = end
    #     durationtime = list(range(starttime,maxtime+1))

    wordlist = []
    for a in correctword:
        if(a in phoneme):
            sound = a.replace(a, phoneme[a])
            wordlist.append(sound)
    
    combineword = ''.join(wordlist)
    val = totaltimeofsound(combineword,time,wordlist) # --> get value for each sound
    weigh = weightofsound(wordlist) # --> stress of each sound
    interval = timeinterval(durationtimeorstart,weigh) #--> interval in frames of each sound
    print(list(zip(wordlist, val)))
    print(list(zip(wordlist,weigh)))
    print(list(zip(wordlist,interval)))
    return list(zip(wordlist, interval))


def isInDict(listofsounds):
    """checks if a letter or group of letters has a sound
    @author: cchimdindu
    Args:
        listofsounds (dict): all 44 phonemes

    Returns:
        list: the word converted to the  sound
    """    
    truth = []
    lies = []

    for a in listofsounds:
        if a in phoneme:
            truth.append(a)

    lies = truth.copy()

    for j in truth:
        for o in lies:
            if set(o).issubset(set(j)) and o != j:
                truth.remove(o)

    #print(truth)
    return truth


def subsetremove(l1,l2):
    """_removes l2 out of l1
    @author: cchimdindu
    Args:
        l1 (list): all sounds
        l2 (list): sounds not wanted

    Returns:
        list: l2 without l1 in it
    """    
    for m in l1:
        for n in l2:
            if set(m).issubset(set(n)) and m != n:
                l2.remove(m)
                break

    return l2

def uniquecombos(word):
    """_get all unquie combinations of a word

    Args:
        word (string): a word
    @author: cchimdindu
    Returns:
        list: unique combinations of a word_
    """    
    arr = list(word)
    dump = []
    dumpnice = []
    i = 0
    j = 1
    while i<len(arr):
        j= i+1
        for k in arr:
            k = arr[i:j]
            dump.append(k)
            out = listToString(k)
            dumpnice.append(out)
            j += 1
        i += 1
    combos = removeduplicates(dumpnice)
    return combos
    
def listToString(s):
    """turns list to  a string
    @author: cchimdindu
    Args:
        s (list): list of letters

    Returns:
        string: word
    """    
    str1 = ""
    for ele in s:
        str1 += ele

    return str1

def removeduplicates(x):
    """checks there are no duplicates in a string
    @author: cchimdindu
    Args:
        x (list): a list

    Returns:
        list: list without any repeats
    """    
    return list(dict.fromkeys(x))
    

# if __name__ == "__main__":

#     replacingletters("worth",list(range(2820,4300+1)))

phoneme = {
    """all phonemes in the english language
    @author: cchimdindu
    """    

    #grapheme[letter or group of letters] : #phoneme[speech sound]
    #consonant sounds
    "b" : "/b/", "bb" : "/b/", "d" : "/d/",
    "dd" : "/d/", "ed" : "/d/",
    "f" : "/f/", "ph" : "/f/",
    "g" : "/g/", "gg" : "/g/",
    "h" : "/h/",
    "j" : "/j/", "g" : "/j/", "ge" : "/j/", "dge" : "/j/",
    "c" : "/k/", "k" : "/k/", "ck" : "/k/", "ch" : "/k/", "cc" : "/k/", "que" : "/k/",
    "l" : "/l/", "ll" : "/l/",
    "m" : "/m/", "mm" : "/m/", "mb" : "/m/",
    "n" : "/n/", "nn" : "/n/", "kn" : "/n/", "gn" : "/n/",
    "p" : "/p/", "pp" : "/p/",
    "r" : "/r/", "rr" : "/r/", "wr" : "/r/",
    "s" : "/s/", "se" : "/s/" , "ss" : "/s/" , "c" : "/s/" , "ce" : "/s/" , "sc" : "/s/",
    "t" : "/t/", "tt" : "/t/" , "ed" : "/t/",
    "v" : "/v/" , "ve" : "/v/",
    "w" : "/w/",
    "y" : "/y/", "i" : "/y",
    "z" : "/z/", "zz" : "/z/" , "ze" : "/z/", "s" : "/z/", "se" : "/z/", "x" : "/z/",

    #consonant digraphs
    "th" : "/th/",
    "ng" : "/ng/", #"n" : "/ng"
    #/sh/ : sh, ss, ch, ti, ci
    "sh" : "/sh/",
    #/ch/ ch, tch
    #/zh/ ge, s
    "wh" : "/wh/",


    #short vowel sounds
    "a" : "/a/", "au" : "/a/",
    "e" : "/e/", "ea" : "/e/", 
    "i" : "/i/", 
    "o" : "/o/", "a" : "/o/", "au" : "/o/", "aw" : "/o/", "ough" : "/o/",
    "u" : "/u/", "o" : "/u/",

    #long voewl sounds
    "a_e" : "/ā/" , "ay" : "/ā/" , "ai" : "/ā/" , "ey": "/ā/"  , "ei" : "/ā/",
    "e_e" : "/ē/" , "ea" : "/ē/" , "ee" : "/ē/", "ey" : "/ē/", "ie" : "/ē/", "y" : "/ē/",
    "i_e" : "/ī/" , "igh" : "/ī/" , "y" : "/ī/" , "ie" : "/ī/",
    "o_e" : "/ō/" , "oa" : "/ō/" , "ou" : "/ō/" , "ow" : "/ō/",
    "u_e" : "/ū/ ", "ew" : "/ū/",

    #other vowel sounds
    "oo" : "/oo/", "u" : "/oo/", "oul" : "/oo/",

    #vowel diphthongs
    "ow" : "/ow/", "ou" : "/ow/", "ou_e" : "/ow/", 
    "oi" : "/oy/", "oy" : "/oy/",

    #vowel sounds influenced by r
    "ar" : "/ar/" ,
    "air" : "/ā(r)/" , "ear" : "/ā(r)/" , "are" : "/ā(r)/",
    "irr" : "/i(r)/" , "ere" : "/i(r)/" , "eer" : "/i(r)/",
    "or" : "/o(r)/" , "ore" : "/o(r)/" , "oor" : "/o(r)/",
    "ur" : "/u(r)/" , "ir" : "/u(r)/" , "er" : "/u(r)/" , "ear" : "/u(r)/" , "or" : "/u(r)/" , "ar" : "/u(r)/",

}

#s c z sh ch ah i ee uh em m b p f v oh oo u w r l th BAC-43
