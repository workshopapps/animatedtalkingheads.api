from pathlib import Path
from PIL import Image #, ImageDraw, ImageFont
import cv2 as cv
import numpy as np


def generate_image(images: list, bg_path: Path) -> np.ndarray:
    """_summary_

    Args:
        images (list): _description_
        bg_path (Path): _description_

    Returns:
        _type_: _description_
    """
    background_image = Image.open(bg_path)
    background_image = background_image.convert(mode='RGBA')
    width, length = background_image.size
    canvas = Image.new(mode='RGBA', size=(width, length), color=(255, 255, 255))
    canvas.paste(im=background_image, box=(0,0))
    for img_path in images:
        speaker_state = Image.open(img_path)
        speaker_state = speaker_state.convert('RGBA')
        canvas = Image.alpha_composite(canvas, speaker_state)
    numpy_img = np.array(canvas)
    cv2_image = cv.cvtColor(numpy_img, cv.COLOR_RGB2BGR)
    cv2_image
    return cv2_image

