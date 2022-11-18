
![Tests](https://github.com/nwizugbesamson/podcast_animator/actions/workflows/tests.yaml/badge.svg)
### Development guide

- Clone and Navigate to repository
`git clone https://github.com/nwizugbesamson/podcast_animator`

`cd podcast_animator`

`python -m venv venv`

- windows:
`. venv\Scripts\activate`

- linux / posix/ mac
`source venv/bin/activate`

`pip install -U pip`

- Install in development
`pip install -e .[dev]`


- pre-commit hook(rejects commits if error found with format, commit is then formatted with black.) save directory and commit formatted changes
`pre-commit install`



