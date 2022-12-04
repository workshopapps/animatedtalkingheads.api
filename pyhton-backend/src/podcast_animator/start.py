""" Audio animator main script,
 This project serves as a schema for the hng9
 TEAM CLUTCH podcast animator projects
 this script contains the program workflow
 """

## DATA IMPORTS
from sys import argv
import cv2
from podcast_animator.config import Config
from podcast_animator.utils.dataschema import DataSchemer
from podcast_animator.utils.file_handlers import JsonHandler
from podcast_animator.utils.exec_time import exec_time
from podcast_animator.utils.animation_settings import load_animation_settings
from podcast_animator.analysis.diariazer import load_audio_diarization
from podcast_animator.generator.processors import append_audio, convert_to_cv2
from podcast_animator.generator.canvas import Canvas
from podcast_animator.generator.pipeline import VideoPipeLine
from podcast_animator.generator.filters.background_filter import BackgroundFilter
from podcast_animator.generator.filters.face_filter import FaceFilter
from podcast_animator.generator.filters.eye_filter import EyeFilter
from podcast_animator.generator.filters.word_filter import WordFilter
from pathlib import Path


@exec_time
def main(metadata_path: str):
    """_summary_

    Args:
        metadata_path (str): _description_
    """
    json_handler = JsonHandler()
    runtime_settings = load_animation_settings(metadata_path, json_handler)

    #######  DIARIZE AUDIO FILE     #########

    assembly_diarizations = load_audio_diarization(
        runtime_settings[DataSchemer.AUDIO_URL],
        runtime_settings[DataSchemer.AUDIO_DIR_PATH],
        json_handler,
    )
    #######    END DIARIZATIONS     ########

    animation_frame_length = (
        assembly_diarizations[DataSchemer.AUDIO_DURATION_SECONDS] * Config.FRAME_RATE
    )

    #######     BUILD FILTERS      #######
    background_filter = BackgroundFilter(
        background_dir=runtime_settings[DataSchemer.BG_PATH],
        animation_frame_length=animation_frame_length,
    )

    face_filter = FaceFilter(avatar_map=runtime_settings[DataSchemer.AVATAR_PATHS])

    eye_filter = EyeFilter(avatar_map=runtime_settings[DataSchemer.AVATAR_PATHS])

    word_filter = WordFilter(
        diarization_speeches=assembly_diarizations["speech"],
        animation_frame_length=animation_frame_length,
        avatar_map=runtime_settings[DataSchemer.AVATAR_PATHS],
    )

    #######     END BUILD FILTERS     #######

    #######     COMPILE PIPELINE      #######

    pipeline = VideoPipeLine()

    pipeline.compile(
        convert_to_cv2,
        word_filter.add_to_canvas,
        eye_filter.add_to_canvas,
        face_filter.add_to_canvas,
        background_filter.add_to_canvas,
    )

    #######    END COMPILE PIPELINE    #######

    animated_video = str(runtime_settings[DataSchemer.AUDIO_DIR_PATH] / "animation.mp4")
    width, height = Config.CANVAS_SIZE
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(animated_video, fourcc, 24.0, (width, height))
    for i in range(1, animation_frame_length + 1):
        try:
            canvas = Canvas.canvas()
            image = pipeline.process(i, canvas)
            print(f"PROGRESS: {round((i * 100) / animation_frame_length, 2)}%")
            out.write(image)
        except KeyboardInterrupt:
            break

        # if (cv2.waitKey(1) & 0xFF) == ord("q"):  # Hit `q` to exit
        #     break

        # Release everything if job is finished
    out.release()
    cv2.destroyAllWindows()

    output_video = runtime_settings[DataSchemer.AUDIO_DIR_PATH] / "animation_sound.mp4"
    audio_path = runtime_settings[DataSchemer.AUDIO_PATH]
    append_audio(animated_video, audio_path, str(output_video))


if __name__ == "__main__":
    file_path = str(argv[1])
    main(file_path)
