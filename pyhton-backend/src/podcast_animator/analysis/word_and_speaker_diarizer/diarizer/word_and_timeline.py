import wave
import json

from vosk import Model, KaldiRecognizer, SetLogLevel
import Word as custom_Word
# from word import Word as custom_Word

model_path = "models/vosk-model-small-en-us-0.15"
# audio_filename = "audio/speech_recognition_systems.wav"
# audio_filename = "./Porsche.wav"
# audio_filename = ""

def word_derializer(audio_filename):
    model = Model(model_path)
    wf = wave.open(audio_filename, "rb")
    rec = KaldiRecognizer(model, wf.getframerate())
    rec.SetWords(True)

    # get the list of JSON dictionaries
    results = []
    # recognize speech using vosk model
    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            part_result = json.loads(rec.Result())
            results.append(part_result)
    part_result = json.loads(rec.FinalResult())
    results.append(part_result)

    # convert list of JSON dictionaries to list of 'Word' objects
    list_of_Words = []
    for sentence in results:
        if len(sentence) == 1:
            # sometimes there are bugs in recognition
            # and it returns an empty dictionary
            # {'text': ''}
            continue
        for obj in sentence['result']:
            w = custom_Word.Word(obj)  # create custom Word object
            list_of_Words.append(w)  # and add it to list

    wf.close()  # close audiofile

    # output to the screen
    for word in list_of_Words:
        print(word.to_string())
