import os
import subprocess
import sys

"""
This is a sample of the data being parsed in:

import cv2
import glob
import numpy as np

X_data = []
files = glob.glob ("/images/*.jpg")
for myFile in files:
    # print(myFile)
    image = cv2.imread (myFile)
    X_data.append (image)

Arthur: Stephen Nwankwo

Args: An array of images

"""


# print('X_data shape:', np.array(X_data).shape)

for i in X_data:
    print(
        subprocess.run(
        [f"ffmpeg -framerate 1 -i {i} -c:v libx264 -r 30 ./results/output.mp4"],
        shell=True))
