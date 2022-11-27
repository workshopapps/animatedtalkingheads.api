#!/usr/bin/env python
"""
    Script that generate the ryrs emotions of the avatar
"""
from emotion import read_sentence_emotion
import random
import itertools

emotions = {}

def generate_eyes_emotions(speaker_instance):
	"""
		Functions the genrate theh eye emotions for the video animations

		Arguments:
			Speaker_instance

		Return:
			Dictionary containing the emotions of a person speaking at the partucular miniseconds
			[sad, sad, sad, sad, sad, Neutral, sad, ]
	"""
	for new_speaker in speaker_instance:
		result = read_sentence_emotion(new_speaker.get("Sentence"))
		append_list = [result for _ in new_speaker.get('durations')]
		damn = {}
		speaker = new_speaker.get("Speaker")
		if speaker not in emotions.keys():
			emotions[speaker] = []
		emotions[speaker].append(new_speaker.get('durations'))

		emotional_list = {}
		for speaker in speaker_sequence:
			flat_list = list(itertools.chain.from_iterable(speaker_sequence[speaker]))
			for i in range(1, lenaudiosecs):
				if i in flat_list:
					if random.choices(random_list) == 1:
						emotional_list[speaker].append("Natural sequence")
					else:
						emotional_list[speaker].append(State)

"""
	Speacker_sequence
	{
		'A': [[1, 2, 3, 4], [4, 5, 6, 7]]
		'A': [[1, 2, 3, 4], [4, 5, 6, 7]]
		'A': [[1, 2, 3, 4], [4, 5, 6, 7]]
		'A': [[1, 2, 3, 4], [4, 5, 6, 7]]
	}
"""

# Faster way for flattening a tuple
# next((index for index, wrd in enumerate(flattened_list) if wrd[0] == 1), None)
