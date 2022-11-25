"""
This file uses the whisper library's feature that transcribes audio files with the respetive
timestamps. To implement, follow installation instructions at https://github.com/openai/whisper/blob/main/README.md
"""
import whisper   #importing the library

class WhisperTranscriber():
    
    def __init__(self, audio):   #collects audio file as a string argument
        self.audio = audio

    def transcribe(self):                               #the transcribe method loads the base model to transcribe the audio file and returns a dictionary in the format {'timestamp':'transcription'} for every statementin the audio
        model = whisper.load_model("base")
        result = model.transcribe(self.audio, language="en", fp16=False)
        first_step = result["segments"]
        result = {}
        for i in first_step:
            start = i["start"]
            end = i["end"] 
            text = i["text"]
            result.update({f"{start} - {end}": f"{text}"})
        return result