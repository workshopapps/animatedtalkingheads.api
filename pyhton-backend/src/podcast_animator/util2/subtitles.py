from typing import Protocol
from typing import Any
import json
from pathlib import Path
from PIL import Image , ImageDraw, ImageFont
import numpy as np
import cv2
import random
import textwrap

class Subtitles:

    def __init__(self, background: Path, avatar_map: dict[str, Path], frames=24, **kwargs) -> None:
        self.bg_path = background
        self.avatar_map = avatar_map
        self.images = []
        self.frames = frames
        self.font = ImageFont.truetype(f'data/Fonts/{kwargs.get("font") or "arial"}.ttf', 10)



    def _draw_word(self, speaker_word: str, image: Image, offset: int) -> None:
    
        W,H = image.size
        wrapper = textwrap.TextWrapper(width=W*0.07) 
        word_list = wrapper.wrap(text=speaker_word) 
        caption_new = ''
        for ii in word_list[:-1]:
            caption_new = caption_new + ii + '\n'
        caption_new += word_list[-1]

        draw = ImageDraw.Draw(image)

        w,h = draw.textsize(caption_new, font=self.font)

        x,y = 0.5*(W-w),0.90*H-h
        draw.text((x, y), caption_new, font=self.font)

    def build_images(self, schema: dict[str, dict[str, list[dict[str, Path | str] | None]]], animation_frame_length: int):
        """_summary_

        Args:
            schema (dict[str, dict[str, list[dict[str, Path  |  str]  |  None]]]): _description_
            animation_frame_length (int): _description_
        """
        animation_frame_length = animation_frame_length

        
        for i in range(1, 6000):
        # for i in range(1, animation_frame_length + 1):
            print(i)
            image = self._create_image(schema[str(i)])
            self.images.append(image)



    def _create_image(self, frame_obj):
        background_image = Image.open(self.bg_path)
        background_image = background_image.convert(mode='RGBA')
        width, length = background_image.size
        canvas = Image.new(mode='RGBA', size=(width, length), color=(255, 255, 255))
        offset = ''
        for speaker in frame_obj:
            
            if len(frame_obj[speaker]) == 0:
                speaker_word = None

            else:
                if len(frame_obj[speaker]) == 1:
                    obj = frame_obj[speaker][0]

                elif len(frame_obj[speaker]):
                    obj = random.choice(frame_obj[speaker])
                
                speaker_word = obj["word"]

            if speaker_word:
                self._draw_word(speaker_word, canvas, offset)


        numpy_img = np.array(canvas)
        cv2_image = cv2.cvtColor(numpy_img, cv2.COLOR_RGB2BGR)
        cv2_image
        return cv2_image

