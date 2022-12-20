import pytest

# from unittest import mock
from pathlib import Path


ANIMATION_FRAME_LENGTH_LIST = [3, 5, 10, 15, 2, 7]

AVATAR_MAP_LIST = [
    {"A": Path("random/test/path")},
    {"A": Path("random/test/path"), "B": Path("random/test/path/two")},
    {
        "A": Path("random/test/path"),
        "B": Path("random/test/path/two"),
        "C": Path("random/test/path/three"),
    },
]


@pytest.fixture(params=ANIMATION_FRAME_LENGTH_LIST)
def animation_frame_lenght(request):
    yield request.param


@pytest.fixture(params=AVATAR_MAP_LIST)
def avatar_map_sample(request):
    yield request.param
