# def modular(timestamp):
#     wholenum = timestamp/42
#     remainder = timestamp%42
#     if remainder >= 40:
#         wholenum = math.ceil(wholenum)
#     else:
#         wholenum = math.floor(wholenum)

#     return (wholenum)


def sound_pathfinder(soundlist, path):    #This function takes in the list of sounds and path to the avatar folder 
    list_of_sounds = soundlist
    # list_of_timestamps = [x for x in dictionary.values()]
    sound_seq_list = []
    for sound in range(len(list_of_sounds)):    #This loops through the list of sounds and creates a corresponding list of path to the image files of those sounds 
        # frames = modular(list_of_timestamps[sound])
        # for number in range(frames):
        #     seq_list.append(path/f"{list_of_sounds[sound]}")
        sound_seq_list.append(path/"mouth"/f"{list_of_sounds[sound]}")
        return sound_seq_list                   #Returning the new list of path to image files
    
    
    
def eyes_pathfinder(emotionlist, path):         #This function takes in the list of emotions and path to the avatar folder
    list_of_eyes = emotionlist
    emotion_seq_list = []
    for eyes in range(len(list_of_eyes)):        #This loops through the list of emotions and creates a corresponding list of path to the image files of those specific emotions 
        emotion_seq_list.append(path/"eyes"/f"{list_of_eyes[eyes]}")        
        return emotion_seq_list                 #Returning the new list of path to image files

        
    