from PIL import Image
from podcast_animator.config import Config


class Canvas:

    width: int = Config.CANVAS_SIZE[0]
    length: int = Config.CANVAS_SIZE[1]

    @classmethod
    def canvas(cls):
        return Image.new(
            mode="RGBA", size=(cls.width, cls.length), color=(255, 255, 255)
        )
