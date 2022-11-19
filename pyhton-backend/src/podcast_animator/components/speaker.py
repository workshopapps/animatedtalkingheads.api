#!/usr/bin/env python
"""
	Script that declares the Text class
"""

import itertools
import sys
import json

# If the argument is a file
with open(sys.argv[1], 'r') as file:
	if not file:
		exit()
	variable = json.load(file)
audio_texts, parsed_data = [], {}
flat_dict = {}
# variable = sys.argv[1]


class Text:

	id = 0

	def __init__(self, speaker: str, duration: list, trnascript: str):
		self.speaker = speaker
		Text.id += 1		
		self.index = Text.id
		self.duration = duration
		self.trnascript = trnascript

def create_text_object():
	# print(variable)
	utterances = variable['utterances']
	for name in utterances:
		words = name['words']
		for obj in words:
			person = Text(
				obj['speaker'],
				[obj['start'], obj['end']],
				obj['text']
			)
			audio_texts.append(person)
	return

def generate_parsed_data():
	for obj in audio_texts:
		if parsed_data.get(obj.speaker):
			parsed_data[obj.speaker].append(
				(obj.index, obj.duration, obj.trnascript)
			)
		else:
			parsed_data[obj.speaker] = [
				(obj.index, obj.duration, obj.trnascript)
			]

def extrate_seconds():
	for key, speaker in parsed_data.items():
		phrase_map = [speaker_tuple[1] for speaker_tuple in speaker]
		# flat_list = list(itertools.chain.from_iterable(phrase_map))
		flat_list = list()
		for i in phrase_map:
			mini_list = [i for i in range(i[0], i[1])]
			flat_list += mini_list
		fin = int(variable['audio_duration']) + 1
		seconds = ["speech" if i in flat_list else "silence" for i in range(fin)]
		# for i in range(int(variable['audio_duration']) + 1):
		# 	if i in flat_list:
		# 		seconds.append("speech")
		# 	else:
		# 		seconds.append("silence")
		flat_dict[key] = seconds

if __name__ == "__main__":
	# print(variable)
	create_text_object()
	print(f"\nAudio text:\n{audio_texts}\n\n")
	generate_parsed_data()
	print(f"\nParsed Data\n{parsed_data}\n\n")
	extrate_seconds()
	print(f"\nFlat Dict\n{flat_dict.get('B')[8625:8640]}\n\n")