class Utterance:
    """
    utterance, speaker and timestamp
    """

    def __init__(self, speaker: str, start: int, stop: int, text: str) -> None:
        self.speaker = speaker
        self.duration = self.generate_duration(start, stop)
        self.text = text

    def generate_duration(self, start: int, stop: int) -> list[int]:
        """return timestamp list of seconds during which text was voiced

        Args:
            start (int): utterance start time in seconds
            stop (int): utterance end time in seconds

        Returns:
            list[int]: _description_
        """
        if start == stop:
            res = []
            res.append(start)
            return res
        return list(range(start,stop))

    def split(self, chunks):
        k, m = divmod(len(self.duration), chunks)
        return (self.duration[i*k+min(i, m):(i+1)*k+min(i+1, m)] for i in range(chunks))

    @property
    def sentence_to_timestamp(self):
        text = self.text.strip(' ').split('.')
        if len(text) > 1:
            durs = self.split(len(text))
            result = []
            for split_txt, dur in zip(text, durs):
                result.extend([(second, split_txt) for second in dur])
            return result
        else:
            return [(dur, text[0]) for dur in self.duration]
