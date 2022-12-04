<<<<<<< HEAD
from pathlib import Path
from PIL.Image import Image as img_obj
from PIL import Image


class BackgroundFilter:
    """ Interface class
        defines architecture to modify a feature for selected frame of animation
        This class adds to the canvas of every instance, the selected background 
        with dynamic features

        author: @Jimi
        
        argd: 
        
        background_dir(Path) = A path to the directory of the selected background
        animation_frame_length(int) = The total number of frames used to generate 
        the video (i.e 24fps)

    
    """
    def __init__(self, background_dir: Path, animation_frame_length: int):
        self.directory_path = background_dir
        self.animation_frame_length = animation_frame_length
        self.animation_frames = None
        self.bg_sq_files = None                                                   #Initially Setting self.animation frame to None 
        self.interval = 500                                                     #Setting the interval. At every <self.interval> frames the background animation sequnce will be loaded  
        self.bg_sq()                                                           #This calls a method that stores a list in self.bg_sq_files
        self._compose_animation_schema()                                      #This calls a method that stores a list in self.animationframes

    def bg_sq(self):                                                    #This method stores a list containing the dynamic sequence of the background animation, inside the class variable 'self.bq_sq_files' 
        self.bg_sq_files =[]
        self.directory_path = self.directory_path/"animation"
        for files in self.directory_path.iterdir():
            self.bg_sq_files.append(files)

    def _compose_animation_schema(self):                                #This method stores a dictionary of the format {frame_id: frame_image} in self.animation_frames 
        self.animation_frames = {}
        counter = 0 
        while counter < len(range(1, self.animation_frame_length+1)):       
            if counter%self.interval==0:                                        #Checks for the interval to load in the dynamic sequence
                for i in range(1, len(self.bg_sq_files)+1):     
                    self.animation_frames.update({str(i+counter): self.bg_sq_files[i]})
                counter+=len(self.bg_sq_files)
                
            else:                                                                                       #Uses the default background image when the interval has not been reached
                self.animation_frames.update({str(counter): self.directory_path / "default.png"})
                counter+=1
        
    def add_to_canvas(self, frame_data: tuple[int | img_obj]) -> img_obj:                   #This method adds it to the canvas and returns the canvas as a filtered object
        frame_index, canvas = frame_data
        background_path = self.animation_frames[str(frame_index)]
        bg_image = Image.open(background_path)
        bg_image = bg_image.convert(mode="RGBA")
        canvas.paste(im=bg_image, box=(0, 0))
        return canvas
=======
from pathlib import Path
from PIL.Image import Image as img_obj
from PIL import Image


class BackgroundFilter:
    """Interface class
    defines architecture to modify a feature for selected frame of animation

    author: @jimi


    """

    def __init__(self, background_dir: Path, animation_frame_length: int):
        self.directory_path = background_dir
        self.animation_frame_length = animation_frame_length
        self.animation_frames = None
        self._compose_animation_schema()

    def _compose_animation_schema(self):
        self.animation_frames = {
            str(index): self.directory_path / "default.png"
            for index in range(1, self.animation_frame_length + 1)
        }

    def add_to_canvas(self, frame_data: tuple[int | img_obj]) -> img_obj:
        frame_index, canvas = frame_data
        background_path = self.animation_frames[str(frame_index)]
        bg_image = Image.open(background_path)
        bg_image = bg_image.convert(mode="RGBA")
        canvas.paste(im=bg_image, box=(0, 0))
        return frame_index, canvas
>>>>>>> 4ff7d12d62c82c8df635f3a56e592b478f462797
