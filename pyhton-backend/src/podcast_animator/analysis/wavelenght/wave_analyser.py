
from __future__ import print_function
import os
import librosa.display
import soundfile as sf
import numpy as np
from pathlib import Path

'''
ABS_PATH = os.path.abspath(__file__)
BASE_DIR = os.path.dirname(ABS_PATH)
DATA_DIR = os.path.join(BASE_DIR, "data")
SAMPLE_DIR = os.path.join(DATA_DIR, "samples")
SAMPLE_INPUTS = os.path.join(SAMPLE_DIR, "inputs")
SAMPLE_OUTPUTS = os.path.join(SAMPLE_DIR, 'outputs')


file_path = os.path.join(SAMPLE_INPUTS, 'vocals2.wav')
aug_input = os.path.join(SAMPLE_INPUTS, "aug-audio")
os.makedirs(aug_input, exist_ok=True)
os.makedirs(SAMPLE_OUTPUTS, exist_ok=True)
'''

file_path = os.path.join(SAMPLE_INPUTS, 'vocals2.wav')
y, sr = librosa.load(file_path)
S_full, phase = librosa.magphase(librosa.stft(y))

S_filter = librosa.decompose.nn_filter(S_full,
                                       aggregate=np.median,
                                       metric='cosine',
                                       width=int(librosa.time_to_frames(2, sr=sr)))
S_filter = np.minimum(S_full, S_filter)
#print(S_filter)

margin_i, margin_v = 2, 10
power = 2

mask_i = librosa.util.softmask(S_filter,
                               margin_i * (S_full - S_filter),
                               power=power)

mask_v = librosa.util.softmask(S_full - S_filter,
                               margin_v * S_filter,
                               power=power)


S_foreground = mask_v * S_full
S_background = mask_i * S_full

new_aud = librosa.istft(S_foreground*phase)

sf.write("new-audio.wav", new_aud, sr)


nfile_path = 'new-audio.wav'
x,sr = librosa.load(nfile_path)
print(x.shape, sr)


n_fft = 2048
S = librosa.stft(x, n_fft=n_fft, hop_length=n_fft//2)

# convert to db
D = librosa.amplitude_to_db(np.abs(S), ref=np.max)
np.max(abs(D))
print(np.max(abs(D)))

def displayTime(startFrame, endFrame):    
    print(' start time: ' + str(startFrame/sr) + ', end time: ' + str(endFrame/sr))

nonMuteSections = librosa.effects.split(x)  # split audio with any audio signal lesser than 20db as mute
##print(nonMuteSections)

for i in nonMuteSections:    
    displayTime(i[0],i[1])

