from typing import Protocol
from typing import Any


class StaticFilter(Protocol):

    

    def _create_animation_ranges(self) -> list[str]:
        """create list of ranges to apply auto animations
        
        Return:
        >>>> ['234;568'...'n-54;n'] where n is length of frames in animation
        """
        ...

    def _select_feature(self):
        """internal function to select feature randomly or by user designed order
        """
        ...

    def return_feature_sequence(self) -> zip:
        """zip object of selected animation ranges and selected features for each range"""
        ...

    


       

"""
1000msecs -> 24frames
\?         -> 1frame


1000 / 24 == 41.66
            
word
timestamp
sorry
162-324
162/41.66


speaker: a
sentences = [
    this is a sentence: 54-345;......1024;8654,
]


| frame_pipeline()  

frame 1
0 - 41.66

problems: searching throughout json file for 
          every instance of selected frame is not practical

dataset: [] = start time, end time
check all start times
return any object where start time / 41.66 == 1 
or end time / 41.66 == 1 





| word_pipeline()   
word is in frame 56 to 68  for speaker a  
but we do not know speaker b's action for these frames
(do we hold processing until speaker b's action has been filled)


frame 1
word, timestamp

speaker
pipe.add(word)
    inside pipe
    1. process word
        - get start frame, get end frame.....
            - get background state(optional filter)




how do we get each speakers action per frame simultaneously


PREVIOUS APPROACH
compute schema from diarizations(transformation happens during this) ->
    build image for each frame using schema specifications ->
        write images to audio



GOAL
frame id -> input: {A, B} -> map(transformation layer, {A, B})  -> create image -> write image to video

FINAL GOAL
process the image / frame individually and write to video


pass each frame through a series of transformation objects 
to map / assign video features()

frame<89> what are all speaker words during this frame, 
          add meta info / config for each speaker and the bckground



1.
input[word, speaker, timestamp] ->
        break into start to end frame
        for each frame : instantiate a pipeline process ->
                                        - process frame data from word or randomly for select features
                                        - add to queue.

simultaneously in queue:
            while queue not empty:
                if len(queue.speakers) != number of speakers:
                    pass
                else:
                    queue.pop -> 
                        create image -> write image to video


when iterable exhauseted

end queue loop
for queue_element in queue
    default speakers = speaker not inside queue for speaker in animation speakers
         -> transform default speakers with default state ->
                                        create image -> write image to video
         
pipeline = Pipeline()
## VISUALIZE LOGIC
Podcast, speaker_A, 162-654
start frame, end frame = 4, 16
for i in range(4, 16)
    pipe.add({"4": "A", "Podcast"})
    pipe.add({"...": "A", "Podcast"})
    pipe.add({"16": "A", "Podcast"})

Sainin, speaker_B, 162-654
start frame, end frame = 4, 16 
    pipe.add({"4": "B", "Sainin"})
    pipe.add({"...": "B", "Sainin"})
    pipe.add({"16": "B", "Sainin"})


create a video from images but not in sequential order


pipe.add_filter(eye_filter, bg_filter)

4-30: path/to/blink/animation

83-146: path/to/eye/upanimation


class Node:
    frame number: 
    speakers : {
        A, B
    }

    def insert(node_id)

class SchemaTree

__init__  -> 
 nodes = [] ## its a binary tree(selecting in sorted order is not a problem)




def update_frame(speaker, frame number and word):
    if frame number in self.node
        self.nodes.insert(frame_id, A, word)

    else:
        Node(frame)  
        schema.add(node) 

def pop() ->
    elemtnr to return = self.nodes(1)
    self.nodes numner 1 = current number 2
    delete elemtnr to return
    return elemtnr to return

nodes = [...]





"""
   