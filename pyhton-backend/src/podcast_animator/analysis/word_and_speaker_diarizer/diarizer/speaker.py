# -*- coding: UTF-8 -*-
'''
transcribe file with diarization
'''


import argparse
import io
import sys

def speaker_diarization(file_path):
    '''Transcribe the given audio file synchronously with diarization.'''
    # [START speech_transcribe_diarization_beta]
    from google.cloud import speech_v1p1beta1 as speech
    from google.cloud.speech import enums
    # from google.cloud.speech_v1 import enums
    client = speech.SpeechClient()

    # speech_file = sys.argv[1]
    speech_file = file_path

    with open(speech_file, 'rb') as audio_file:
        content = audio_file.read()

    audio = speech.types.RecognitionAudio(content=content)

    config = speech.types.RecognitionConfig(
    encoding=enums.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED,
    sample_rate_hertz=48000,
    language_code='en-US',
    enable_speaker_diarization=True,
    enable_automatic_punctuation=True,
    diarization_speaker_count=4)

    print('Waiting for operation to complete…')
    response = client.recognize(config, audio)

    # The transcript within each result is separate and sequential per result.
    # However, the words list within an alternative includes all the words
    # from all the results thus far. Thus, to get all the words with speaker
    # tags, you only have to take the words list from the last result:
    result = response.results[-1]

    words_info = result.alternatives[0].words

    speaker1_transcript=''
    speaker2_transcript=''
    speaker3_transcript=''
    speaker4_transcript=''
    # Printing out the output:
    for word_info in words_info:
        if(word_info.speaker_tag==1): speaker1_transcript=speaker1_transcript+word_info.word+''
        if(word_info.speaker_tag==2): speaker2_transcript=speaker2_transcript+word_info.word+''
        if(word_info.speaker_tag==3): speaker3_transcript=speaker3_transcript+word_info.word+''
        if(word_info.speaker_tag==4): speaker4_transcript=speaker4_transcript+word_info.word+''
        print("speaker1: '{}'".format(speaker1_transcript))
        print("speaker2: '{}'".format(speaker2_transcript))
        print("speaker3: '{}'".format(speaker3_transcript))
        print("speaker4: '{}'".format(speaker4_transcript))
    # [END speech_transcribe_diarization_beta]

# speaker_diarization(sys.argv[1])