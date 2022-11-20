from setuptools import setup

setup(
    name='diarizer',
    version='0.1.0',
    py_modules=['diarizer'],
    install_requires=[
        'Click',
    ],
    entry_points={
        'console_scripts': [
            'show-speaker = diarizer:show_speaker',
            'show-words = diarizer:show_words',
        ],
    },
)
