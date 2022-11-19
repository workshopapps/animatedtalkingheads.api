""" Audio animator main script,
 This project serves as a schema for the hng9
 TEAM CLUTCH podcast animator projects
 this script contains the program workflow
 """


 ## DATA IMPORTS
from sys import argv
from pathlib import Path
from uuid import uuid4
import time
from components.animator import generate_animation
from ..data_loader.loader import Loader, JsonLoader
from ..data_parser import Parser, JsonParser
from moviepy.editor import VideoFileClip, AudioFileClip


ROOT_DIR = Path(__file__).parent.parent.resolve()
DATA_DIR = Path(ROOT_DIR) / "data"



def animate( metadata_path :str) -> None:
    """generates animation of audio file using
       input metadata

    Args:
        metadata_path (str): path to file containing meta data necessary for
        animation
    """

    ## output path of generated image
    output_path = f'data/Result/{str(uuid4())}.mp4'

    ## data loader
    loader_obj = JsonLoader(metadata_path)
    parser_obj = JsonLoader()
    data = loader_obj.load_data()