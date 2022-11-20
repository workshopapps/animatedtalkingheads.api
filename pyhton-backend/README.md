
![Tests](https://github.com/nwizugbesamson/podcast_animator/actions/workflows/tests.yaml/badge.svg)
## Table of contents
- Introduction
- Installation
- Prerequisites
- Authors
## Introduction
The goal of this project is to create an effective video tool to implementing and enhancing your digital marketing strategy.
Here is a simple sample of the output you get from this project:-

https://user-images.githubusercontent.com/99333786/202913471-c8fea8f6-40f7-4852-b3d9-02054f1d91e9.mp4

## Installation
Clone and Navigate to repository
>`https://github.com/workshopapps/animatedtalkingheads.api.git`

Or Download Zipfile
   - Click on the green button `<>code`,at the bottom of the popup click Download ZIP 


>`cd podcast_animator`

To setup your virtual environment
>`python -m venv venv`

To activate your environment

***For Windows:-***
>`. venv\Scripts\activate`

***Linux / Posix/ Mac:-***
>`source venv/bin/activate`

In your virtual environment install pip
>`pip install -U pip`\
>`pip install -r requirements.txt`

To run your code

*with python*
>`python main.py meta.json`

*with python3*
>`python3 main.py meta.json`

**Install in development**
> `pip install -e .[dev]`

>**Note**
>*pre-commit hook(rejects commits if error found with format, commit is then formatted with black.) save directory and commit formatted changes*
>
>`pre-commit install`

## Prerequisites
25 seconds average runtime for a 10 seconds long video
## inputs:
- json file
   - containing : **time stamps for when speakers talk**
   - Format :
   ~~~
   {
    "audio_url": "",
    "audio_path": "",
    "avatar_map": {
        "A": "01",
        "B": "02"
    },
    "bg_path": "01"
    }
    ~~~

## output: 
- video file
   - containing : **Animated talking heads**
## Authors
***HNG Interns***
- Team clutch
