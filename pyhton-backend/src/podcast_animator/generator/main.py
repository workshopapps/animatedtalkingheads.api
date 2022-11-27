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
from components.animator import generate_animation
from moviepy.editor import VideoFileClip, AudioFileClip
from podcast_animator.analysis.diariazer import diarize_audio
from podcast_animator.analysis.word_analyzer import WordAnalyzer
from podcast_animator.analysis.utterance_analyzer import UtteranceAnalyzer
from podcast_animator.analysis.models.analyzer import Analyzer
from podcast_animator.utils.json_handler import JsonHandler


## move all paths to config.py in package root directory
## APPLICATION ROOT DIRECTOR
ROOT_DIR = Path(__file__).parent.parent.parent.parent.resolve()
DATA_DIR = ROOT_DIR / "data"
AVATAR_DIR = DATA_DIR / "Image/avatars"
BG_DIR = DATA_DIR / "Image/backgrounds"
DOTENV_PATH = ROOT_DIR / "src/podcast_animator/env/.env" 

## load environment variable



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

    # print(DOTENV_PATH)
    if DOTENV_PATH.exists():
        load_dotenv(DOTENV_PATH)
    
    
    metadata_path = ROOT_DIR / metadata_path
    ## instantiate json file handler
    json_handler = JsonHandler()


    
    ## create unique output name
    output_path = DATA_DIR / f"Result/{str(uuid4())}.mp4" 

    ## load metadata json provided
    metadata_obj = json_handler.load(metadata_path)
    audio_url: str = metadata_obj["audio_url"]
    audio_path: str = metadata_obj["audio_path"]
    avatar_map: dict = metadata_obj["avatar_map"]
    bg_id: str = metadata_obj["bg_path"]

    num_speakers = len(avatar_map)
    bg_path = get_path(BG_DIR, bg_id, is_folder=False)
    avatar_paths = {avatar: get_path(AVATAR_DIR, value, is_folder=True
        ) for avatar, value in avatar_map.items()}
    
 

    diarized_data = diarize_audio(audio_url, os.getenv("ASSEMBLYAI"))
    json_handler.append(metadata_path, diarized_data)
    words = diarized_data["words"]
    # utterances = diarized_data["utterances"]
    audio_length = diarized_data["audio_duration"]

    

    
    # word_analyzer = WordAnalyzer(audio_length, words)
    # animation_mouth_frames = word_analyzer.write_metadata(DATA_DIR/ f"audio_metadatas/{uuid4()}.json")
    with open(DATA_DIR / f"audio_metadatas/aa841f48-2515-45b8-84e2-0c56a4ab50f0.json") as ff:
        animation_mouth_frames = json.load(ff)
    utterance_analyzer = UtteranceAnalyzer(audio_length, diarized_data["utterances"])
    subtitle_seq = utterance_analyzer.write_metadata(DATA_DIR/ f"audio_metadatas/{uuid4()}.json")

    ## animate to return path to animation
    animation_path = generate_animation(
        animation_mouth_frames, 
        subtitle_seq,
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
    # os.remove(animation_path)
   

if __name__=='__main__':
    start = time.time()
    metadata_path = str(argv[1])
    animate(metadata_path)
    print(f'RUNTIME: [{time.time() - start}]')