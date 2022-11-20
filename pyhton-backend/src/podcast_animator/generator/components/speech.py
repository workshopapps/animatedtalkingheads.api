class Speech:
    """
    """

    def __init__(self, speaker: str, start: int, stop: int, text: str, index) -> None:
        self.speaker = speaker
        self.duration = self.generate_duration(start, stop)
        self.text = text
        self.index = index

    def generate_duration(self, start: int, stop: int) -> list[int]:
        """_summary_

        Args:
            start (int): _description_
            stop (int): _description_

        Returns:
            list[int]: _description_
        """
        if start == stop:
            res = []
            res.append(start)
            return res
        return list(range(start,stop))