import re
import inflect



class Word:
    """
    speaker, formated word and timestamp
    """

    def __init__(self, speaker: str, start: int, stop: int, text: str) -> None:
        self.speaker = speaker
        self.duration = self.generate_duration(start, stop)
        self._text = text
        self.p = inflect.engine()

    @property
    def text(self):
        result: str = self._text.strip('.?,')
        # result = result
        
        if re.search(r'\d+', result):
            digits = re.findall(r'\d+', result)[0]
            transcription: str = self.p.number_to_words(int(digits))
            transcription = transcription.replace('-', ' ')
            result = result.replace(digits, f'{transcription}')
        return result




    def generate_duration(self, start: int, stop: int) -> list[int]:
        """create a list of integers ranging from 
        the closest multiple of 42 from start  to the closest multiple of 42
        from end
        Args:
            start (int): start time of word in audio file(msecs)
            stop (int): end time of word in audio file(msecs)
        Returns:
            list[int] 
        >>>> generate_duration(start= 45, stop= 450)
        >>>> [42, 84, 126, 168, 210, 252, 294, 336, 378, 420]
        """
        if start == stop:
            duration = [self.round_to_multiple(start, 42)]
            return duration
        return list(map(self.round_to_multiple,  list(range(start,stop, 42))))

    # Developing a function to round to a multiple
    @staticmethod
    def round_to_multiple(number, multiple=42):
        return multiple * round(number / multiple)
