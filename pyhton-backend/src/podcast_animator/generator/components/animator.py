import cv2
import os
import sys
from pathlib import Path
from uuid import uuid4
from .image_generator import generate_image
import itertools
import time

FRAMES = 24



# def _generate_state_sequence(img_path: Path, state: str) -> list[Path]:
#     """load the path to 24 images that make up a one second 
#        animation or default state for selected avatar
#     @author: anonnoone

#     Args:
#         img_path (Path): pathlib.Path object to selected avatar directory

#     Returns:
#         list[Path]: sorted list of animation or default sequence paths

#     >>>>: generate_speech_seqeunce(path/to/avatar_01, state="speech")
#     >>>>: [path/to/avatar_o1/state_01, ..., path/to/avatar_o1/state_24]
#     "em": [1, 2, 3, 4, 5, 6, 7] -> 100 msecs 
#     "em": 500msecs -> [01,02, 3, 3, 4, 4, 5, 5 , 06, 07]
#     """
#     if state == "speech":
#         dir_files = [str(file.path) for file in os.scandir(img_path / "animation")]
#         return sorted(dir_files, key= lambda x: x.split('_')[1])
#     elif state == "silence":
#         return [img_path / "default.png" for _ in range(FRAMES)]
    


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
    for speaker in data:
        avatar_path = avatar_dict[speaker]
        anm_seq = [avatar_path / f"mouths/{state}" for state in data[speaker][:600]]
        img_paths.append(anm_seq)

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
            state_images = [img_1, img_2]
            avatar_images = [path for path in avatar_dict.values()]
            images.append(
                generate_image(state_images, avatar_images, bg_path)
            )
            count += 1
    elif num_speakers ==3:
        count = 1
        for img_1, img_2, img_3 in zip(*img_paths):
            state_images = [img_1, img_2, img_3]
            avatar_images = [path for path in avatar_dict.values()]
            images.append(
                generate_image(state_images, avatar_images, bg_path)
            )
            count += 1
    elif num_speakers ==4:
        count = 1
        for img_1, img_2, img_3, img_4 in zip(*img_paths):
            state_images = [img_1, img_2, img_3, img_4]
            avatar_images = [path for path in avatar_dict.values()]
            images.append(
                generate_image(state_images, avatar_images, bg_path)
            )
            count += 1

            
    print(f"IMage Build: [{time.time()-start_path}]")
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

    