import subprocess 
import random
from pathlib import Path
import cv2
import numpy as np
from PIL import Image , ImageDraw, ImageFont
import textwrap
from podcast_animator.analysis.animation_frame_constructor import AnimationFrame

# from .image_generator import generate_image
# import itertools
# import time




FRAMES = 24



class Animator:
    """generate animation from provided schema
    """

    def __init__(self, background: Path, avatar_map: dict[str, Path], frames=24, **kwargs) -> None:
        self.bg_path = background
        self.avatar_map = avatar_map
        self.images = []
        self.frames = frames
        self.font = ImageFont.truetype(f'data/Fonts/{kwargs.get("font") or "arial"}.ttf', 10)

    def build_images(self, schema: dict[str, dict[str, list[dict[str, Path | str] | None]]], animation_frame_length: int):
        """_summary_

        Args:
            schema (dict[str, dict[str, list[dict[str, Path  |  str]  |  None]]]): _description_
            animation_frame_length (int): _description_
        """
        animation_frame_length = animation_frame_length

        
        try:
            for i in range(1, 6000):
            # for i in range(1, animation_frame_length + 1):

                image = self._create_image(schema[str(i)])
                self.images.append(image)
        except KeyError:
             for i in range(1, 6000):
            # for i in range(1, animation_frame_length + 1):

                image = self._create_image(schema[i])
                self.images.append(image)



    def _create_image(self, frame_obj):
        background_image = Image.open(self.bg_path)
        background_image = background_image.convert(mode='RGBA')
        width, length = background_image.size
        canvas = Image.new(mode='RGBA', size=(width, length), color=(255, 255, 255))
        canvas.paste(im=background_image, box=(0,0))
        offset = ''
        for speaker in frame_obj:
            base_image_path = self.avatar_map[speaker] / 'base.png'
            base_image = Image.open(base_image_path)
            base_image = base_image.convert('RGBA')
            canvas = Image.alpha_composite(canvas, base_image)
            
            if len(frame_obj[speaker]) == 0:
                mouth_path = self.avatar_map[speaker] / "mouths/closed.png"
                eye_path = self.avatar_map[speaker] / "eyes/default.png"
                speaker_word = None

            else:
                if len(frame_obj[speaker]) == 1:
                    obj = frame_obj[speaker][0]

                elif len(frame_obj[speaker]):
                    obj = random.choice(frame_obj[speaker])
                
                mouth_path = obj["mouth"]
                # TODO 1. add eyes
                eye_path = self.avatar_map[speaker] / "eyes/default.png"
                speaker_word = obj["word"]

            mouth = Image.open(mouth_path)
            mouth = mouth.convert('RGBA')
            canvas = Image.alpha_composite(canvas, mouth)

            eye = Image.open(eye_path)
            eye = eye.convert('RGBA')
            canvas = Image.alpha_composite(canvas, eye)

            if speaker_word:
                self._draw_word(speaker_word, canvas, offset)


        numpy_img = np.array(canvas)
        cv2_image = cv2.cvtColor(numpy_img, cv2.COLOR_RGB2BGR)
        cv2_image
        return cv2_image


   
    

    def build_video(self, build_path: Path):




        frame_one = self.images[0]

        # return
        height, width, _ = frame_one.shape
        fourcc = cv2.VideoWriter_fourcc(*'mp4v') # Be sure to use lower case
        out = cv2.VideoWriter(str(build_path.absolute()), fourcc, 24.0, (width, height))

        # print("VIDEO WRITER START")
        # start_write = time.time()
        for image in self.images:
            # subprocess.run(
            # [f"ffmpeg -framerate 1 -i {image} -c:v libx264 -r 24 {str(output.absolute())}"],
            # shell=True)
            out.write(image) # Write out frame to video


            # cv2.imshow('video',frame)
            if (cv2.waitKey(1) & 0xFF) == ord('q'): # Hit `q` to exit
                break
            
        # print(f"END WRITING: [{time.time() - start_write}]")
        # Release everything if job is finished
        out.release()
        cv2.destroyAllWindows()
        # return output

        # frame_one = self.images[0]
        # height, width, _ = frame_one.shape
        # process = (
        #         ffmpeg
        #     .input('pipe:', format='rawvideo', pix_fmt='rgb24', s='{}x{}'.format(width, height))
        #     .output(str(build_path), pix_fmt='yuv420p', vcodec='libx264', r=self.frames, format='mp4')
        #     .overwrite_output()
        #     .run_async(pipe_stdin=True)
        #     )
        # for image in self.images:
        #     process.stdin.write(
        #         image
        #             .astype(np.uint8)
        #             .tobytes()
        #     )
        #     process.stdin.close()
        #     process.wait()
        # for i in self.images:
    
        #     subprocess.run(
        #         [f"ffmpeg -framerate 1 -i {i} -c:v libx264 -r {self.frames} {build_path}"],
        #         shell=True
        #     )
        

      
   




    
