from pathlib import Path
from PIL import Image , ImageDraw, ImageFont
import numpy as np
import cv2
import random
from queue import Queue

#still confused
class AvatarFeature:

    def __init__(self,  
        avatar_map: dict[str, Path], 
        speaker_labels: list[str], 
        audio_length_secs: int, 
        frames=24,
    ) -> None:

        self.avatar_map = avatar_map
        self.frames = frames
        self.speaker_labels = speaker_labels
        self.audio_length_secs = audio_length_secs
        self.animation_frames  = None
        self._build_frame()

    def msec_per_frame(self):
        return round((1000 /self.frames), 2)

    def animation_frame_length(self):
        return self.audio_length_secs * self.frames

    def get_frame_state(self):
        self.animation_frames = {
            frame_number: {
                avatar_id: [] for avatar_id in self.speaker_labels
                        }  for frame_number in range(1, self.animation_frame_length + 1)
        }

    def build_on_image(self, canvas: Image, frame_id,frame_obj):
        count = 0
        
        for speaker in frame_obj:
            q = Queue(maxsize = count) #queue is the size of frames
            base_image_path = self.avatar_map[speaker] / 'base.png'
            base_image = Image.open(base_image_path)
            base_image = base_image.convert('RGBA')
            #canvas = Image.alpha_composite(canvas, base_image)
            count+=1
            q.put(base_image) #when this class is called base image is ready to be written to the canvas

        return q

    
