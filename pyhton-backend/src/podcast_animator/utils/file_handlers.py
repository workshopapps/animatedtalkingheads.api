from typing import Protocol
from typing import Any
from pathlib import Path
import json


class FileHandler(Protocol):
    def load(self):
        ...

    def append(self):
        ...

    def write(self, file_path: Path, write_obj: Any):
        ...

    def pop(self):
        ...

    def delete(self):
        ...


class JsonHandler:
    def _check_serializable():
        ...

    @staticmethod
    def _check_exists(file_path: Path, read: bool = True) -> bool:
        root = (file_path, file_path.parent)[read]
        if not root.exists:
            raise IOError("directory does not exist")

    def load(self, file_path: Path) -> Any:
        self._check_exists(file_path)
        with open(file_path) as read_file:
            content = json.load(read_file)
        return content

    def append(self, file_path: Path, insert_obj: dict) -> Any:
        self._check_exists(file_path)
        with open(file_path, "r+") as file:
            read_obj = json.load(file)
            for key, value in read_obj.items():
                insert_obj[key] = value
            read_obj.update(insert_obj)
            file.seek(0)
            json.dump(insert_obj, file, indent=4)

    def write(self, file_path: Path, write_obj: Any):
        self._check_exists(file_path, read=False)
        with open(file_path, "w") as writer:
            json.dump(write_obj, writer)

    def pop(self):
        raise NotImplementedError

    def delete(self):
        raise NotImplementedError
