from pathlib import Path
from PIL import Image , ImageDraw, ImageFont
import numpy as np
import cv2
import random
from queue import Queue
from podcast_animator.utils.file_handlers import FileHandler

class AvatarFeature:

    def __init__(self,  
        avatar_map: dict[str, Path], 
        speaker_labels: list[str], 
        audio_length_secs: int, 
        frames=24,
    ) -> None:
        """
        intialise avatarfeature
        """
        self.avatar_map = avatar_map
        self.frames = frames
        self.speaker_labels = speaker_labels
        self.audio_length_secs = audio_length_secs
        self.animation_frames  = None
        self._build_frame()

    def msec_per_frame(self):
        """
        get millieseconds of frames
        """
        return round((1000 /self.frames), 2)

    def animation_frame_length(self):
        """
        get amount of frames
        """
        return self.audio_length_secs * self.frames

    def get_frame_state(self):
        """
        get condition of the each frame
        """
        self.animation_frames = {
            frame_number: {
                avatar_id: [] for avatar_id in self.speaker_labels
                        }  for frame_number in range(1, self.animation_frame_length + 1)
        }

    def populate_frames(self, frame_obj,file_handler: FileHandler, write_path: Path, avatar_map: dict[str | Path]) -> None:
        """
        type of images to be written on the frame
        """
        
        for speech_object in self.diarized_speeches:
            speaker = speech_object["speaker"]
            for frame in frame_obj:
                    self.animation_frames[frame][speaker].append(
                    {
                        "eye": str(avatar_map[speaker] / "eyes/happy.png")
                        }
                    )
        file_handler.write(write_path, self.animation_frames)

    def build_on_image(self, canvas: Image, frame_id,frame_obj):
        """
        drawing on the main canvas
        all frames have they eyes written on it based on speaker
        using queue
        """
        count = 0
        frame_obj = self.get_frame_state(frame_id)
        for speaker in frame_obj:
            q = Queue(maxsize = count)

            if len(frame_obj[speaker]) == 0:
                eye_path = self.avatar_map[speaker] 
            else:
                if len(frame_obj[speaker]) == 1:
                    obj = frame_obj[speaker][0]

                elif len(frame_obj[speaker]):
                    obj = random.choice(frame_obj[speaker])
                
                eye_path = self.avatar_map[speaker]

            eye = Image.open(eye_path)
            eye = eye.convert('RGBA')
            #canvas = Image.alpha_composite(canvas, eye)
            count+=1
            q.put(eye) #image ready to be written on canvas

        return q