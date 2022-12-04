import os
from pathlib import Path
from podcast_animator.config import Config
from podcast_animator.utils.dataschema import DataSchemer
from podcast_animator.utils.file_handlers import FileHandler


def load_animation_settings(metadata_path: str, json_handler: FileHandler) -> dict:
    """_summary_

    Args:
        metadata_path (str): _description_
        json_handler (FileHandler): _description_

    Returns:
        dict: _description_
    """
    metadata_path = Config.ROOT_DIR / metadata_path
    ## instantiate json file handler

    ## load metadata json provided
    metadata_obj = json_handler.load(metadata_path)

    avatar_map: dict = metadata_obj["avatar_map"]
    bg_id: str = metadata_obj["bg_path"]
    audio_animation_directory = Config.DATA_DIR / f'user_data/{metadata_obj["dir_id"]}'
    if not audio_animation_directory.exists():
        os.mkdir(audio_animation_directory)

    return {
        DataSchemer.AUDIO_DIR_PATH: audio_animation_directory,
        DataSchemer.AUDIO_URL: metadata_obj["audio_url"],
        DataSchemer.AUDIO_PATH: metadata_obj["audio_path"],
        DataSchemer.BG_PATH: get_path(Config.BG_DIR, bg_id, is_folder=False),
        DataSchemer.AVATAR_PATHS: {
            avatar: get_path(Config.AVATAR_DIR, value, is_folder=True)
            for avatar, value in avatar_map.items()
        },
        DataSchemer.SPEAKER_LABELS: avatar_map.keys(),
    }


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
