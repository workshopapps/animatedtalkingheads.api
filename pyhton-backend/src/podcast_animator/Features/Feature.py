class Feature(): #make protocol

  def __init__(self, animation_frame_length: int) -> None:
    
    ...

  def build_frames(self):
    ...

  def _get_frame_state(self, frame_id: int):
    ...

  def enqueue_frames(self):
    ...

  def build_on_image(self, canvas, frame_id):
    ...