from typing import Protocol


class Handler(Protocol):

    def load(self):
        ...

    def append(self):
        ...

    def write(self):
        ...

    def pop(self):
        ...

    def delete(self):
        ...