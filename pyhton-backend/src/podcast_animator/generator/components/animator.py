import cv2
import os
from pathlib import Path
from uuid import uuid4
from .image_generator import generate_image
import itertools


FRAMES = 24



def generate_speech_sequence(img_path: Path) -> list[Path]:
    dir_files = [str(file.path) for file in os.scandir(img_path / "animation")]
    return sorted(dir_files, key= lambda x: x.split('_')[1])
    

def load_default_state(img_path: Path) -> list[Path]:
    return [img_path / "default.png" for _ in range(FRAMES)]


animation_functions = {
    "speech": generate_speech_sequence,
    "silence": load_default_state
}

def generate_animation(
    data: dict[str, list[str]], 
    bg_path: Path, num_speakers: int, 
    avatar_dict: dict[str, str]) -> Path:
    images = []
    img_paths = []
    output = f'data/compiled_videos/{str(uuid4())}.mp4'

    for speaker in data:
        avatar_path = avatar_dict[speaker]
        anm_seq = [animation_functions[state](avatar_path) for state in data[speaker]]
        img_paths.append(list(itertools.chain.from_iterable(anm_seq)))
        
        
    
    if num_speakers == 2:
        for img_1, img_2 in zip(*img_paths):
            temp_images = [img_1, img_2]
            images.append(
                generate_image(temp_images, bg_path)
            )
    elif num_speakers ==3:
        for img_1, img_2, img_3 in zip(*img_paths):
            temp_images = [img_1, img_2, img_3]
            images.append(
                generate_image(temp_images, bg_path)
            )
    elif num_speakers ==4:
        for img_1, img_2, img_3, img_4 in zip(*img_paths):
            temp_images = [img_1, img_2, img_3, img_4]
            images.append(
                generate_image(temp_images, bg_path)
            )
   
    frame_one = images[0]
    height, width, _ = frame_one.shape
    fourcc = cv2.VideoWriter_fourcc(*'mp4v') # Be sure to use lower case
    out = cv2.VideoWriter(output, fourcc, 24.0, (width, height))

    for image in images:
        out.write(image) # Write out frame to video
        

        # cv2.imshow('video',frame)
        if (cv2.waitKey(1) & 0xFF) == ord('q'): # Hit `q` to exit
            break

    # Release everything if job is finished
    out.release()
    cv2.destroyAllWindows()
    return output