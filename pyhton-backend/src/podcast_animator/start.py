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
from podcast_animator.utils.animation_settings import load_animation_settings
from podcast_animator.analysis.diariazer import load_audio_diarization
from podcast_animator.generator.processors import append_audio, convert_to_cv2
from podcast_animator.generator.canvas import Canvas
from podcast_animator.generator.pipeline import VideoPipeLine
from podcast_animator.generator.filters.filter import Filter
from podcast_animator.generator.filters.word_filter import WordFilter


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
    word_filter = WordFilter(
        diarization_speeches=assembly_diarizations["speech"],
        animation_frame_length=animation_frame_length,
        avatar_map=runtime_settings[DataSchemer.AVATAR_PATHS],
    )

    #######     END BUILD FILTERS     #######

    #######     COMPILE PIPELINE      #######

    pipeline = VideoPipeLine()

    pipeline.compile(word_filter.add_to_canvas, convert_to_cv2)

    #######    END COMPILE PIPELINE    #######

    animated_video = str(runtime_settings[DataSchemer.AUDIO_DIR_PATH] / "animation.mp4")
    width, height = Config.CANVAS_SIZE
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(animated_video, fourcc, 24.0, (width, height))
    for i in range(1, animation_frame_length + 1):
        canvas = Canvas.canvas()
        image = pipeline.process(i, canvas)
        print(type(image))
        out.write(image)

        if (cv2.waitKey(1) & 0xFF) == ord("q"):  # Hit `q` to exit
            break

        # print(f"END WRITING: [{time.time() - start_write}]")
        # Release everything if job is finished
    out.release()
    cv2.destroyAllWindows()

    output_video = runtime_settings[DataSchemer.AUDIO_DIR_PATH] / "animation_sound.mp4"
    audio_path = runtime_settings[DataSchemer.AUDIO_PATH]
    append_audio(animated_video, audio_path, output_video)


if __name__ == "__main__":
    file_path = str(argv[1])
    main(file_path)
