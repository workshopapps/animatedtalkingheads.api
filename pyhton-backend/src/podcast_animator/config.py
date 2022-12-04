import os
from pathlib import Path
from typing import get_type_hints, Union
from dotenv import load_dotenv


class AppConfigError(Exception):
    pass


# def _parse_bool(val: Union[str, bool]) -> bool:  # pylint: disable=E1136
#     return val if type(val) == bool else val.lower() in ['true', 'yes', '1']

# AppConfig class with required fields, default values, type checking, and typecasting for int and bool values
class AppConfig:

    ROOT_DIR: Path = Path(__file__).parent.parent.parent.resolve()
    DOTENV_PATH: Path = ROOT_DIR / "src/podcast_animator/env/.env"
    DATA_DIR: Path = ROOT_DIR / "data"
    AVATAR_DIR: Path = DATA_DIR / "Image/avatars"
    BG_DIR: Path = DATA_DIR / "Image/backgrounds"
    CANVAS_SIZE: tuple = (640, 480)
    FRAME_RATE: int = 24
    ASSEMBLYAI: str = None

    """
    Instantiate application root paths and load env variables
    """

    def __init__(self):
        print(self.ROOT_DIR)
        if self.DOTENV_PATH.exists():
            load_dotenv(self.DOTENV_PATH)
            self.ASSEMBLYAI = os.getenv("ASSEMBLYAI", None)
            if not type(self.ASSEMBLYAI) == str:
                raise ValueError("Provide AssemblyAI key")

        else:
            raise IOError("Create .env file in env/ directory")

    def __repr__(self):
        return str(self.__dict__)


# Expose Config object for app to import
Config = AppConfig()
