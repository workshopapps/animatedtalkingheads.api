"""
    classes responsible for parsing input data
"""

from typing import Protocol


class Parser(Protocol):
    """data parsing interface class"""

    def __init__(self, file):
        ...

    def parse_name(self, name: str) -> str:
        ...


    def parse_timestamp(self, start: str, end: str) -> list[int]:
        ...

    


class AssemblyParser:
    """parse data returned from assembly ai speaker diarizer
    """

    def parse_name(self, name: str) -> str:
        """return speaker id with speaker prefix

        Args:
            name (str): speaker label assigned by ai file

        Returns:
            str
        """
        return f"speaker_{name}"

    def parse_timestamp(self, start: str, end: str) -> list[int]:
        """return iterable of seconds between start and stop time

        Args:
            start (str): timestamp in seconds for text speech start
            end (str): timestamp in seconds for text speech end

        Returns:
            list[int]
        """
        start_time, end_time = int(start), int(end)
        
        if start_time == end_time:
            limit = 2
            .0
        else:
            limit = 1
        return [i for i in range(start_time, end_time + limit, step=1)]

    