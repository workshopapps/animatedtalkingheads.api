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
from dotenv import load_dotenv
import time
from components.parser_two import generate_sequence
from components.animator import generate_animation
from moviepy.editor import VideoFileClip, AudioFileClip


## move all paths to config.py in package root directory
## APPLICATION ROOT DIRECTOR
ROOT_DIR = Path(__file__).parent.parent.parent.parent.resolve()
DATA_DIR = ROOT_DIR / "data"
AVATAR_DIR = DATA_DIR / "Image/avatars"
BG_DIR = DATA_DIR / "Image/backgrounds"
DOTENV_PATH = ROOT_DIR / "src/podcast_animator/env/.env" 

## load environment variable

# print(DOTENV_PATH)
if DOTENV_PATH.exists():
    load_dotenv(DOTENV_PATH)
    


def get_path(directory: Path, _id: str, is_folder: bool=False):
    """ generate posix path object from project data directory
      of images and backgrounds
    @author: anonnoone

    Args:
        directory (Path): pathlib.Path object of directory to locate file 
        or directory within
        e.g: data/Image/avatars -> path 
        _id (str): id of chosen avatar
        is_folder (bool, optional): locate dir path or file path. Defaults to False.

    Returns:
        _type_: dir or file path
    """
    for file in os.scandir(directory): 
        if is_folder:
            if file.is_dir() and str(file.name).endswith(_id):
                return directory / f"{file.name}"
        else:
            name, ext = str(file.name).split('.')
            if file.is_file() and str(name).endswith(_id):
                return directory / f"{name}.{ext}"


def animate( metadata_path :str) -> None:
    """
    generate animated video from audio, using input metadata
    @author: anonnoone
    Args:
        metadata_path (str): path to json file containing all information
                             required for animation
    
    Returns:
        str: path to generated animation

    """
    ## create unique output name
    output_path = DATA_DIR / f"Result/{str(uuid4())}.mp4" 

    ## load metadata json provided
    with open(metadata_path) as data_file:
        metadata_obj = json.load(data_file)
    audio_url: str = metadata_obj["audio_url"]
    audio_path: str = metadata_obj["audio_path"]
    avatar_map: dict = metadata_obj["avatar_map"]
    bg_id: str = metadata_obj["bg_path"]

    num_speakers = len(avatar_map)
    bg_path = get_path(BG_DIR, bg_id, is_folder=False)
    avatar_paths = {avatar: get_path(AVATAR_DIR, value, is_folder=True
        ) for avatar, value in avatar_map.items()}
    
 
    ## generate animation sequence
    animation_sequence = generate_sequence(audio_url, os.getenv("ASSEMBLYAI"))
    # print(animation_sequence)

    ## animate to return path to animation
    animation_path = generate_animation(
        animation_sequence, 
        bg_path, 
        num_speakers, avatar_paths, DATA_DIR)

    # return
    ## add audio to generated animation
    videoclip = VideoFileClip(str(animation_path))
    audioclip = AudioFileClip(str(audio_path))
    print("About to set audio clip")
    video = videoclip.set_audio(audioclip)
    print("Audio clip set")
    video.write_videofile(str(output_path))


    print(f'YOUR VIDEO HAS BEEN SAVED TO: [{output_path}]')

    ## delete temporary animation
    os.remove(animation_path)
   

if __name__=='__main__':
    start = time.time()
    metadata_path = str(argv[1])
    animate(metadata_path)
    print(f'RUNTIME: [{time.time() - start}]')
