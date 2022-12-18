from PIL import Image
import os
# from moviepy.editor import VideoFileClip, AudioFileClip
from podcast_animator.generator.processors import append_audio, convert_to_cv2

def test_append_audio():
    # create a test video file and a test audio file
    video_path = 'test_video.mp4'
    audio_path = 'test_audio.mp3'
    output_path = 'test_output.mp4'
    # write a test video file
    with open(video_path, 'w') as f:
        f.write('test video file')
    # write a test audio file
    with open(audio_path, 'w') as f:
        f.write('test audio file')
    # call the append_audio function
    append_audio(video_path, audio_path, output_path)
    # check if the output file was created
    assert os.path.exists(output_path)
    # delete the test files
    os.remove(video_path)
    os.remove(audio_path)
    os.remove(output_path)

def test_convert_to_cv2():
    # create a PIL.Image object
    pil_img = Image.new('RGB', (100, 100), color=(0, 255, 0))

    # call the convert_to_cv2 function with the PIL.Image object as an argument
    cv2_image = convert_to_cv2((0, pil_img))

    # assert that the returned cv2 image is a numpy array with the expected shape and dtype
    assert isinstance(cv2_image, np.ndarray)
    assert cv2_image.shape == (100, 100, 3)
    assert cv2_image.dtype == np.uint8











# def test_append_audio(video_path, audio_path, output_path):
#     # Test that the function runs without raising any exceptions
#     append_audio(video_path, audio_path, output_path)
    
#     # Test that the output video file has been created
#     assert os.path.exists(output_path)
    
#     # Test that the audio has been added to the video by checking the audio duration of the output video
#     output_video = VideoFileClip(output_path)
#     assert output_video.duration == videoclip.duration + audioclip.duration
    
#     # Clean up by deleting the output video file
#     os.remove(output_path)
    
# def test_convert_to_cv2(canvas_tuple):
#     # Test that the function runs without raising any exceptions
#     cv2_image = convert_to_cv2(canvas_tuple)
    
#     # Test that the output is a numpy array with 3 channels (BGR)
#     assert isinstance(cv2_image, np.ndarray)
#     assert cv2_image.shape[2] == 3
    
#     # Test that the image has been converted from RGB to BGR
#     assert np.array_equal(cv2_image[:,:,::-1], np.array(canvas))



# def test_append_audio(tmpdir):
#     # create a temporary video file and audio file
#     video_path = str(tmpdir.join("video.mp4"))
#     audio_path = str(tmpdir.join("audio.mp3"))
#     output_path = str(tmpdir.join("output.mp4"))

#     videoclip = VideoFileClip("test_data/test_video.mp4")
#     audioclip = AudioFileClip("test_data/test_audio.mp3")
#     videoclip.write_videofile(video_path)
#     audioclip.write_audiofile(audio_path)

#     # call the function under test
#     append_audio(video_path, audio_path, output_path)

#     # check that the output file exists
#     assert tmpdir.join("output.mp4").exists()


# def test_convert_to_cv2():
#     # create a sample PIL.Image object
#     image = Image.new("RGB", (10, 10), color=(255, 0, 0))

#     # call the function under test
#     result = convert_to_cv2((0, image))

#     # check the shape and dtype of the resulting numpy array
#     assert result.shape == (10, 10, 3)
#     assert result.dtype == np.uint8

