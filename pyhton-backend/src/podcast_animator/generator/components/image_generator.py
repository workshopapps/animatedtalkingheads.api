from pathlib import Path
from PIL import Image , ImageDraw, ImageFont
import cv2 as cv
import numpy as np
import textwrap


FONT = ImageFont.truetype('data/Fonts/arial.ttf', 10)



def draw_subtitle(subtitle, image):

    W,H = image.size
    wrapper = textwrap.TextWrapper(width=W*0.07) 
    print(f"SUBTITLE: {subtitle}")
    word_list = wrapper.wrap(text=subtitle) 
    caption_new = ''
    for ii in word_list[:-1]:
        caption_new = caption_new + ii + '\n'
    caption_new += word_list[-1]
    
    draw = ImageDraw.Draw(image)

    # Download the Font and Replace the font with the font file. 
    
    w,h = draw.textsize(caption_new, font=FONT)
    
    x,y = 0.5*(W-w),0.90*H-h
    draw.text((x, y), caption_new, font=FONT)

    




def generate_image(state_images: list[tuple[Path]], avatar_images:list,  bg_path: Path) -> np.ndarray:
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
    for features, base  in zip(state_images, avatar_images):
        print(f' STATE 1: <{features[0]}> \nSTATE: 2 <{features[1]}>')
        base_image = Image.open(base)
        base_image = base_image.convert('RGBA')
        canvas = Image.alpha_composite(canvas, base_image)
        mouth = Image.open(features[0])
        mouth = mouth.convert('RGBA')
        canvas = Image.alpha_composite(canvas, mouth)
        eye = Image.open(features[1])
        eye = eye.convert('RGBA')
        canvas = Image.alpha_composite(canvas, eye)
    subtitle = state_images[2]
    if subtitle != "none":
        draw_subtitle(subtitle, canvas)
    numpy_img = np.array(canvas)
    cv2_image = cv.cvtColor(numpy_img, cv.COLOR_RGB2BGR)
    cv2_image
    return cv2_image