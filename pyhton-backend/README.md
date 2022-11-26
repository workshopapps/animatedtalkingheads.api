
![Tests](https://github.com/nwizugbesamson/podcast_animator/actions/workflows/tests.yaml/badge.svg)
## Table of contents
- Introduction
- Installation
- Prerequisites
- Authors
## Introduction
The goal of this project is to create an effective video tool to implementing and enhancing your digital marketing strategy.
Here is a simple sample of the output you get from this project:-

https://user-images.githubusercontent.com/64972836/203857396-359c67c6-bf3e-47a5-b077-d92bbd81057d.mp4

https://user-images.githubusercontent.com/99333786/202913471-c8fea8f6-40f7-4852-b3d9-02054f1d91e9.mp4


## Installation
Clone and Navigate to repository
>`https://github.com/workshopapps/animatedtalkingheads.api.git`

Or Download Zipfile
   - Click on the green button `<>code`,at the bottom of the popup click Download ZIP 

#### Windows
>`cd animatedtalkingheads.api\pyhton-backend`

To setup your virtual environment
>`python -m venv venv`

To activate your environment

>`. venv\Scripts\activate`

In your virtual environment install pip
>`pip install -U pip`\
>`pip install -r requirements.txt`

**Install in development**
> `pip install -e .[dev]`

**Install in production**
`pip install .`

#### Linux
>`cd animatedtalkingheads.api/pyhton-backend`

To setup your virtual environment
>`python3 -m venv venv`

To activate your environment
>`source venv/bin/activate`

In your virtual environment install pip
>`pip install -U pip`\
>`pip install -r requirements.txt`


**Install in development**
> `pip install -e .[dev]`

**Install in production**
`pip install .`


#### To run your code

*with python*
>`python .\src\podcast_animator\generator\main.py path\to\json_config`


*with python3*
>`python3 .\src\podcast_animator\generator\main.py path\to\json_config`

**Test Path**
>`python .\src\podcast_animator\generator\main.py test_data\meta.json`

>**Note**
>*pre-commit hook(rejects commits if error found with format, commit is then formatted with black.) save directory and commit formatted changes*
>
>`pre-commit install`

## Prerequisites
25 seconds average runtime for a 10 seconds long video
## inputs:
- json file
   - containing : **time stamps for when speakers talk**
   - Format : Dictionary
   ~~~
      {
       "audio_url": "https://files.realpython.com/podcasts/RPP_E133_03_Dan_Moore.72ea7b2eed77.mp3",
       "audio_path": "test_data\\sample.mp3",
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
