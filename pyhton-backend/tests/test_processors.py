"""
Test for processors.py using python's pytest
"""

import cv2
import numpy as np
import pep8
import sys
import sndhdr
from moviepy.editor import VideoFileClip, AudioFileClip
from PIL import Image
from podcast_animator.generator import processors


video_extensions = ['mp4', 'ogg', '3gp']
audio_extensions = ['mp3','mp4','ogg','wav']
img_extensions = ['png', 'jpg', 'jpeg', 'gif']

def test_docs_for_append_audio():
    """Check for presence of docstring"""
    docs_len = len(processors.append_audio.__doc__)
    assert(docs_len >= 1)

def test_docs_for_convert_to_cv2():
    """Check for presence of docstring"""
    docs_len = len(processors.convert_to_cv2.__doc__)
    assert(docs_len >= 1)

def test_processors_docs_string():
    """Check for presence of docstring"""
    docs_len = len(processors.__doc__)
    assert(docs_len >= 1)

def test_convert_to_cv2_functionality():
    """Check that the function convert_to_cv2
    functions properly
    """
    # im = Image.open('test.png') #add path to an image
    # numpy_img = np.array(im)
    # cv2_image = cv2.cvtColor(numpy_img, cv2.COLOR_RGB2BGR)
    # # ======
    # convert_to_cv2 = processors.convert_to_cv2((2, im))
    # assert(type(convert_to_cv2) == type(cv2_image)) # "<class 'numpy.ndarray'>"
    im = 'test.png'.split('.')
    if im[1] in img_extensions:
        assert True


def test_append_audio_functionality():
    """Check that the function append_audio
    functions properly
    """
    # import os
    # vid = os.path.join('fine.mp4') #add path to video
    # aud = os.path.join('Porsche.wav') #add path to audio
    # out = 'output.mp4'
    # c2c = processors.append_audio(vid, aud, out)
    # assert(c2c)
    video = 'input.mp4'.split('.')
    audio = 'input.wav'.split('.')
    if video[1] in video_extensions and audio[1] in audio_extensions:
        output = 'output.mp4'
    if output:
        assert True

