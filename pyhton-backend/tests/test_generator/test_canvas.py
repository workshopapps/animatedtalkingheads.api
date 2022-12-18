from podcast_animator.generator.canvas import Canvas
def test_canvas():
    # Ensure the canvas method creates an image with the correct size
    canvas = Canvas.canvas()
    assert canvas.size == (Canvas.width, Canvas.length)

    # Ensure the canvas method creates an image with the correct mode
    assert canvas.mode == "RGBA"
    
    # Ensure the canvas method creates an image with the correct color
    pixels = canvas.getdata()
    for pixel in pixels:
        assert pixel == (255, 255, 255, 255)
