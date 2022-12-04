import cv2
import numpy as np
from PIL import Image
from moviepy.editor import VideoFileClip, AudioFileClip


def append_audio(video_path: str, audio_path: str, output_path: str):
    """_summary_

    Args:
        video_path (str): _description_
        audio_path (str): _description_
    """
    videoclip = VideoFileClip(video_path)
    audioclip = AudioFileClip(audio_path)
    video = videoclip.set_audio(audioclip)
    video.write_videofile(output_path)


def convert_to_cv2(canvas_tuple: tuple[int:Image]) -> np.ndarray:
    _, canvas = canvas_tuple
    numpy_img = np.array(canvas)
    cv2_image = cv2.cvtColor(numpy_img, cv2.COLOR_RGB2BGR)
    cv2_image
    return cv2_image
