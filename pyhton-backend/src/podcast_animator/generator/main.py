""" Audio animator main script,
 This project serves as a schema for the hng9
 TEAM CLUTCH podcast animator projects
 this script contains the program workflow
 """

## DATA IMPORTS
import os
import time
from sys import argv
from pathlib import Path
from uuid import uuid4
from g2p_en import G2p
from dotenv import load_dotenv
from moviepy.editor import VideoFileClip, AudioFileClip
from podcast_animator.generator.components.animator import Animator
from podcast_animator.analysis.diariazer import diarize_audio
from podcast_animator.utils.file_handlers import JsonHandler
from podcast_animator.analysis.animation_frame_constructor import AnimationFrame


## move all paths to config.py in package root directory
## APPLICATION ROOT DIRECTOR
ROOT_DIR = Path(__file__).parent.parent.parent.parent.resolve()
DATA_DIR = ROOT_DIR / "data"
AVATAR_DIR = DATA_DIR / "Image/avatars"
BG_DIR = DATA_DIR / "Image/backgrounds"
DOTENV_PATH = ROOT_DIR / "src/podcast_animator/env/.env"

## load environment variable


def get_path(directory: Path, _id: str, is_folder: bool = False):
    """generate posix path object from project data directory
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
            name, ext = str(file.name).split(".")
            if file.is_file() and str(name).endswith(_id):
                return directory / f"{name}.{ext}"


def animate(metadata_path: str) -> None:
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

    ## load metadata json provided
    metadata_obj = json_handler.load(metadata_path)
    user_dir_path = DATA_DIR / f'user_data/{metadata_obj["dir_id"]}'
    audio_url: str = metadata_obj["audio_url"]
    audio_path: str = metadata_obj["audio_path"]
    avatar_map: dict = metadata_obj["avatar_map"]
    bg_id: str = metadata_obj["bg_path"]
    # num_speakers = len(avatar_map)
    bg_path = get_path(BG_DIR, bg_id, is_folder=False)
    avatar_paths = {
        avatar: get_path(AVATAR_DIR, value, is_folder=True)
        for avatar, value in avatar_map.items()
    }
    speaker_labels = avatar_paths.keys()

    ## check if data has been processes
    if not user_dir_path.exists():
        os.mkdir(user_dir_path)

        ## diarize audio and save to audio_folder
        diarized_data = diarize_audio(audio_url)
        json_handler.write(user_dir_path / "diarization.json", diarized_data)

    else:
        diarized_data = json_handler.load(user_dir_path / "diarization.json")

    diarized_speeches = diarized_data["speech"]
    audio_length_secs = diarized_data["audio_duration_seconds"]

    ## check if schema path has previously been built
    schema_path = user_dir_path / "schema.json"
    # create animation schema object
    if schema_path.exists():
        animation_frames_schema = json_handler.load(schema_path)
        animation_frame_length = len(animation_frames_schema)
    else:
        animation_frame = AnimationFrame(
            diarized_speeches, speaker_labels, audio_length_secs
        )
        ## instantiate phoneme transcriber
        ## populate animation_schema
        g2p_obj = G2p()
        print(f"START POPULATING SCHEMA")
        start_scheme = time.time()
        animation_frame.populate_frames(g2p_obj, json_handler, schema_path, avatar_paths)
        print(f"FINISH POPULATING SCHEMA : {time.time()- start_scheme}")
        animation_frames_schema = animation_frame.animation_frames
        animation_frame_length = animation_frame.animation_frame_length

    ## instantiate animator
    animator = Animator(bg_path, avatar_paths)

    print("BUILDING IMAGES")
    animator.build_images(animation_frames_schema, animation_frame_length)
    print("END IMAGES BUILD")

    print("BUILDING VIDEO")
    soundless_video_path = user_dir_path / "no_sound.mp4"
    animator.build_video(soundless_video_path)
    print("END VIDEO BUILD")
    ## add audio

    output_path = user_dir_path / "animation.mp4"
    videoclip = VideoFileClip(str(soundless_video_path))
    audioclip = AudioFileClip(str(audio_path))
    print("About to set audio clip")
    video = videoclip.set_audio(audioclip)
    print("Audio clip set")
    video.write_videofile(str(output_path))

    print(f"YOUR VIDEO HAS BEEN SAVED TO: [{output_path}]")

    ## delete temporary animation
    # os.remove(animation_path)


if __name__ == "__main__":
    start = time.time()
    metadata_path = str(argv[1])
    animate(metadata_path)
    print(f"RUNTIME: [{time.time() - start}]")
