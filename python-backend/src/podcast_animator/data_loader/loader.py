"""Data Loader Module
reads and returns content of metadata file
decoupling implemented using Protocol class
    """
from typing import Protocol, Any
from pathlib import Path
import json



class Loader(Protocol):

    def __init__(self, path: str):
        ...

    def load_data(self) -> Any:
        ...

    

class JsonLoader:

    def __init__(self, path: str):
        self.path = Path() / path

    def load_data(self):
        with open(self.path) as file:
            data = json.loads(file)
            return data