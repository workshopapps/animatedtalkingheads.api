import cv2
import numpy as np
from PIL import Image


def convert_to_cv2(frame_index: int, canvas: Image) -> np.ndarray:
    numpy_img = np.array(canvas)
    cv2_image = cv2.cvtColor(numpy_img, cv2.COLOR_RGB2BGR)
    cv2_image
    return cv2_image
