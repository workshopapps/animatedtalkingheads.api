from PIL import Image , ImageDraw, ImageFont

class Canvas:

  width: int = 640
  length: int = 420

  def canvas(cls):
    return Image.new(mode="RGBA", size=(cls.width, cls.length), color=(255, 255, 255))