import re
import inflect
import logging

logging.basicConfig(filename=__file__)


class Speech:
    """
    """

    def __init__(self, speaker: str, start: int, stop: int, text: str, index) -> None:
        self.speaker = speaker
        self.duration = self.generate_duration(start, stop)
        self._text = text
        self.index = index
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
        """_summary_

        Args:
            start (int): _description_
            stop (int): _description_

        Returns:
            list[int]: _description_
            [1, 2, 3....2000]secs
            ["speech", "speech", "silence"]
            [42, 84, 126, ..... 20000]msecs
            ["mbf", "mbf", "mbf",..... "fv" ]
        """
        if start == stop:
            res = []
            res.append(self.round_to_multiple(start, 42))
            return res
        return list(map(self.round_to_multiple,  list(range(start,stop, 42))))

    # Developing a function to round to a multiple
    @staticmethod
    def round_to_multiple(number, multiple=42):
        return multiple * round(number / multiple)
