## merge sample
""" Audio animator main script,
 This project serves as a schema for the hng9
 TEAM CLUTCH podcast animator projects
 this script contains the program workflow
 """

## DATA IMPORTS
import os
from sys import argv
import json
from pathlib import Path
from uuid import uuid4
import time
from components.parser_two import generate_sequence
from components.animator import generate_animation
from moviepy.editor import VideoFileClip, AudioFileClip



## APPLICATION ROOT DIRECTOR
ROOT_DIR = Path(__file__).parent.parent.parent.parent.resolve()
DATA_DIR = Path(ROOT_DIR) / "pyhton-backend/data"
AVATAR_DIR = DATA_DIR / "Image/avatars"
BG_DIR = DATA_DIR / "Image/backgrounds"



def animate( metadata_path :str) -> None:
    """
    generate animated video from audio, using input metadata
    Args:
        metadata_path (str): path to json file containing all information
                             required for animation
    """
    output_path = DATA_DIR / f"/Result/{str(uuid4())}.mp4"  

    with open(metadata_path) as data_file:
        metadata_obj = json.load(data_file)


    audio_url = metadata_obj["audio_url"]
    audio_path = metadata_obj["audio_path"]
    avatar_map = metadata_obj["avatar_map"]
    bg_id = metadata_obj["bg_path"]
    
    num_speakers = len(avatar_map)
    animation_sequence = generate_sequence(audio_url)


    for file in os.scandir(BG_DIR):
        if file.is_file() and str(file.name).endswith(bg_id):
            bg_path = BG_DIR / f"{file.name}"
    
    avatar_paths = {}
    for avatar in avatar_map:
        for file in os.scandir(AVATAR_DIR):
            if file.is_dir() and str(file.name).endswith(avatar_map[avatar]):
                avatar_paths[avatar] = AVATAR_DIR / f"{file.name}"

    

    animation_path = generate_animation(
        animation_sequence, 
        bg_path, 
        num_speakers, avatar_paths)
    videoclip = VideoFileClip(str(animation_path))
    audioclip = AudioFileClip(str(audio_path))
    print("About to set audio clip")
    video = videoclip.set_audio(audioclip)
    print("Audio clip set")
    video.write_videofile(output_path)
    print(f'YOUR VIDEO HAS BEEN SAVED TO: [{output_path}]')
   

if __name__=='__main__':
    start = time.time()
    metadata_path = str(argv[1])
    animate(metadata_path)
    print(f'RUNTIME: [{time.time() - start}]')
