## merge sample
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
from components.parser import load_data
from components.animator import generate_animation
from moviepy.editor import VideoFileClip, AudioFileClip
## APPLICATION ROOT DIRECTOR
ROOT_DIR = Path(__file__).parent.resolve()
DATA_DIR = Path(ROOT_DIR) / "data"
def animate( metadata_path :str) -> None:
    """
    Args:
        metadata_json (str): _description_
        audio_path (str): _description_
        output_path (str): _description_
    """
    output_path = f'data/Result/{str(uuid4())}.mp4'
    audio_obj, video_obj, animation_data = load_data(metadata_path, data_dir=DATA_DIR)
    animation_path = generate_animation(animation_data, video_obj.bg_path, audio_obj.num_speakers)
    videoclip = VideoFileClip(str(animation_path))
    audioclip = AudioFileClip(str(audio_obj.path))
    print("About to set audio clip")
    video = videoclip.set_audio(audioclip)
    print("Audio clip set")
    video.write_videofile(output_path)
    print(f'YOUR VIDEO HAS BEEN SAVED TO: [{output_path}]')
   
 # registering the commands
if __name__=='__main__':
    # cli.add_command(animate)
    # cli()
    start = time.time()
    metadata_path = str(argv[1])
    animate(metadata_path)
    # animate("data/Audio/Recording.m4a", 'timestamp.json')
    print(f'RUNTIME: [{time.time() - start}]')