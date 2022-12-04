"""Installation script for podcast_animator."""
from pathlib import Path
import setuptools

DESCRIPTION = (
    "Podcast Animation Script for the HNGi9 internship, pytest, flake8, "
    "tox configured"
)
APP_ROOT = Path(__file__).parent
README = (APP_ROOT / "README.md").read_text()
AUTHOR = "BACKEND CLUTCH"
PROJECT_URLS = {
    "Documentation": "",
    "Bug Tracker": "https://github.com/nwizugbesamson/podcast_animator/issues",
    "Source Code": "https://github.com/nwizugbesamson/podcast_animator",
}
INSTALL_REQUIRES = [
    "Pillow==9.1.1",
    "opencv-contrib-python==4.6.0.66",
    "requests==2.27.1",
    "g2p_en==2.1.0",
    "inflect==6.0.2",
    "python-dotenv==0.21.0",
    "moviepy==1.0.3",
    "text2emotion==0.0.5",
    "emoji==1.6.1",
    "toolz==0.12.0",
]
EXTRAS_REQUIRE = {
    "dev": [
        "black",
        "flake8",
        "pre-commit",
        "pydocstyle",
        "pytest",
        "pytest-black",
        "pytest-clarity",
        "pytest-dotenv",
        "pytest-flake8",
        "tox",
    ]
}

setuptools.setup(
    name="podcast_animator",
    description=DESCRIPTION,
    long_description=README,
    long_description_content_type="text/markdown",
    version="0.1",
    author=AUTHOR,
    maintainer=AUTHOR,
    license="MIT",
    url=PROJECT_URLS["Source Code"],
    project_urls=PROJECT_URLS,
    packages=setuptools.find_packages(where="src"),
    package_dir={"": "src"},
    python_requires=">=3.7",
    install_requires=INSTALL_REQUIRES,
    extras_require=EXTRAS_REQUIRE,
)
