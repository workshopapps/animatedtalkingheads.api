import cv2
import os
import sys
from pathlib import Path
from uuid import uuid4
from .image_generator import generate_image
import itertools
import time
from podcast_animator.generator.components.sounds_and_emotions_sq import sound_pathfinder, eyes_pathfinder

FRAMES = 24



def _generate_state_sequence(img_path: Path, state: str) -> list[Path]:
    """load the path to 24 images that make up a one second 
       animation or default state for selected avatar
    @author: anonnoone

    Args:
        img_path (Path): pathlib.Path object to selected avatar directory

    Returns:
        list[Path]: sorted list of animation or default sequence paths

    >>>>: generate_speech_seqeunce(path/to/avatar_01, state="speech")
    >>>>: [path/to/avatar_o1/state_01, ..., path/to/avatar_o1/state_24]
    "em": [1, 2, 3, 4, 5, 6, 7] -> 100 msecs 
    "em": 500msecs -> [01,02, 3, 3, 4, 4, 5, 5 , 06, 07]
    """
    if state == "speech":
        dir_files = [str(file.path) for file in os.scandir(img_path / "animation")]
        return sorted(dir_files, key= lambda x: x.split('_')[1])
    elif state == "silence":
        return [img_path / "default.png" for _ in range(FRAMES)]
    
    
# def _generate_state_sequence(img_path: Path, state: str, sound_list: list, eyes_list: list) -> list[Path]:
    """load the path to images that make up the mouth posture for each sound 
    @author: jimi

    Args:
        img_path (Path): pathlib.Path object to selected avatar directory
        state (str): pathlib.Path object to selected avatar directory
        sound_list (list): pathlib.Path object to selected avatar directory
        eyes_list (list): pathlib.Path object to selected avatar directory

    Returns:
        lists[Path]: sorted list of animation or default sequence paths
        
    """
    # if state == "speech":
    #     sound_dir_files = sound_pathfinder(sound_list, Path)
    #     eye_dir_files = eyes_pathfinder(eyes_list, Path)
    #     return [sound_dir_files, eye_dir_files]
    # elif state == "silence":
    #     return [img_path / "default.png" for _ in range(FRAMES)]
    


def generate_animation(
    data: dict[str, list[str]], 
    bg_path: Path, num_speakers: int, 
    avatar_dict: dict[str, str],
    data_dir: Path) -> Path:
    """
    create animation using provided avatars and background
    using sequence generated from audio file

    @author: anonnoone

    Args:
        data (dict[str, list[str]]): speakers in audio and 
        their action/state per second list

        bg_path (Path): pathlib.Path object path to animation background
        num_speakers (int): number of speakers in audio file
        avatar_dict (dict[str, str]): speaker to selected avatar map
        data_dir (Path): pathlib.Path object Path to application data

    Returns:
        Path: path to generated animation
    >>>>: generate_animation(
        {"A": ["speech", "sequence"...], "B": ["speech", "sequence"...]},
        path/to/background_08
        2, 
        {"A": path/to/avatar_01, "B":[path/to/avatar_05]}
    )
    >>>>: DATA_DIR/temp/73hr- df44-ctr4-ct4t.mp4
    """
    images = []
    img_paths = []
    output = data_dir / f'temp/{str(uuid4())}.mp4'


    ##
    speaker_states = {}
    for speaker in data:
        avatar_path = avatar_dict[speaker]
        speaker_states[speaker] = {
            "speech": _generate_state_sequence(avatar_path, "speech"),
            "silence": _generate_state_sequence(avatar_path, "silence"), }
        anm_seq = [speaker_states[speaker][state] for state in data[speaker][:600]]
        img_paths.append(list(itertools.chain.from_iterable(anm_seq)))
    

    # ##
    
    # for speaker in data:
    #     avatar_path = avatar_dict[speaker]
    #     anm_seq = [_generate_state_sequence(avatar_path, state=state) for state in data[speaker][:600]]
    #     img_paths.append(list(itertools.chain.from_iterable(anm_seq)))
    
        
    print("Start Image Build") 
    start_path = time.time()
    if num_speakers == 2:
        count = 1
        for img_1, img_2 in zip(*img_paths):
            temp_images = [img_1, img_2]
            images.append(
                generate_image(temp_images, bg_path)
            )
            count += 1
    elif num_speakers ==3:
        count = 1
        for img_1, img_2, img_3 in zip(*img_paths):
            temp_images = [img_1, img_2, img_3]
            images.append(
                generate_image(temp_images, bg_path)
            )
            count += 1
    elif num_speakers ==4:
        count = 1
        for img_1, img_2, img_3, img_4 in zip(*img_paths):
            temp_images = [img_1, img_2, img_3, img_4]
            images.append(
                generate_image(temp_images, bg_path)
            )
            count += 1

            
    print(f"IMage Build: [{time.time()-start_path}]")
    print(sys.getsizeof(images), sys.getsizeof(images[0]))
    frame_one = images[0]

    # return
    print(len(images))
    height, width, _ = frame_one.shape
    fourcc = cv2.VideoWriter_fourcc(*'mp4v') # Be sure to use lower case
    out = cv2.VideoWriter(str(output.absolute()), fourcc, 24.0, (width, height))

    print("VIDEO WRITER START")
    start_write = time.time()
    for image in images:
        out.write(image) # Write out frame to video
        

        # cv2.imshow('video',frame)
        if (cv2.waitKey(1) & 0xFF) == ord('q'): # Hit `q` to exit
            break
        
    print(f"END WRITING: [{time.time() - start_write}]")
    # Release everything if job is finished
    out.release()
    cv2.destroyAllWindows()
    return output