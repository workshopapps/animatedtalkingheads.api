from pathlib import Path

# from PIL import Image          run 'python -m pip install Pillow'to install and use PIL, then import Image, to test the function
import glob


"""This function searches for the directory of the
    background of the selected id, to return a list 
    of pictures of that background in the sequence 
    that will create a dynamic background. 

args: Selected background id

Returns:
    _type_: list
"""


path = Path.cwd().parents[3]  # Set your prefered directory

bg_path = path / "data" / "image" / "backgrounds"
bg_seq_list = []


def bg_animate(bg_id: int) -> list:
    bg_seq_path = bg_path / f"background_{bg_id}"
    for files in bg_seq_path.iterdir():
        bg_seq_list.append(files)

    """    
    This creates a gif animation of the file sequence
    and saves in a specified directory
    
    frames = []
    imgs = glob.glob(f'{bg_path}/background_{bg_id}/*')
    for i in imgs:
        new_frame = Image.open(i)
        frames.append(new_frame)
    frames[0].save('pic_to_gif.gif', format='GIF',
                   append_images = frames[1:],
                   save_all=True,
                   duration=100, Loop=0
                   )
    """

    return bg_seq_list  # Background sequence list is returned


# bg_animate(4)      Uncomment this and line 31-43 to test how the function works
