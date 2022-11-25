from pathlib import Path
from PIL import Image #, ImageDraw, ImageFont
import cv2 as cv
import numpy as np


def generate_image(state_images: list, avatar_images:list,  bg_path: Path) -> np.ndarray:
    """uses images in a list and background provided to generate a video sequence with help of pillow
    @author : samson6398
    Args:
        images (list): avatar images
        bg_path (Path): background image

    Returns:
        array: sequence of images in an array
    """
    background_image = Image.open(bg_path)
    background_image = background_image.convert(mode='RGBA')
    width, length = background_image.size
    canvas = Image.new(mode='RGBA', size=(width, length), color=(255, 255, 255))
    canvas.paste(im=background_image, box=(0,0))
    for state_path, avatar_path  in zip(state_images, avatar_images):
        speaker_avatar = Image.open(avatar_path)
        speaker_avatar = speaker_avatar.convert('RGBA')
        canvas = Image.alpha_composite(canvas, speaker_avatar)
        speaker_state = Image.open(state_path)
        speaker_state = speaker_state.convert('RGBA')
        canvas = Image.alpha_composite(canvas, speaker_state)
    numpy_img = np.array(canvas)
    cv2_image = cv.cvtColor(numpy_img, cv.COLOR_RGB2BGR)
    cv2_image
    return cv2_image

