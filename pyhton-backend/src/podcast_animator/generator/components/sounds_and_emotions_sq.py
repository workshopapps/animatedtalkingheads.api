# def modular(timestamp):
#     wholenum = timestamp/42
#     remainder = timestamp%42
#     if remainder >= 40:
#         wholenum = math.ceil(wholenum)
#     else:
#         wholenum = math.floor(wholenum)

#     return (wholenum)


def sound_pathfinder(soundlist, path):
    list_of_sounds = soundlist
    # list_of_timestamps = [x for x in dictionary.values()]
    sound_seq_list = []
    for sound in range(len(list_of_sounds)):
        # frames = modular(list_of_timestamps[sound])
        # for number in range(frames):
        #     seq_list.append(path/f"{list_of_sounds[sound]}")
        sound_seq_list.append(path/"mouth"/f"{list_of_sounds[sound]}")
    
def eyes_pathfinder(emotionlist, path):
    list_of_eyes = emotionlist
    emotion_seq_list = []
    for eyes in range(len(list_of_eyes)):
        emotion_seq_list.append(path/"eyes"/f"{list_of_eyes[eyes]}")
        return emotion_seq_list

        
    