[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![CircleCI](https://circleci.com/gh/csmcallister/fed-a11y.svg?style=svg)](https://circleci.com/gh/csmcallister/fed-a11y)
[![Maintainability](https://api.codeclimate.com/v1/badges/9040ccde83fd2a52af20/maintainability)](https://codeclimate.com/github/csmcallister/fed-a11y/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9040ccde83fd2a52af20/test_coverage)](https://codeclimate.com/github/csmcallister/fed-a11y/test_coverage)

# Fed A11y

Automated accessibility testing of *most* U.S. Federal Government websites.

## Getting Started

If you're wanting to develop against this project, follow these steps to get started.

### Install Python

This project uses Python 3.7.3, although other versions >= 3.5 should be fine. You can install Python from [here](https://www.python.org/downloads/), although using a system utility (e.g. homebrew for OSX) is fine as well.

Next, activate your python virtual environment:

```bash
python -m venv env
source env/bin/activate
pip install -r requirements.txt
```

Next, install this repo as a package:

```bash
pip install -e .
```

>This tells `pip` to find `setup.py` in the current directory and install it in editable or development mode. Editable mode means that as you make changes to your local code, you’ll only need to re-install if you change the metadata about the project, such as its dependencies.

### Get the Data

[Download a snapshot of the data](https://www.feda11y.com/data) as JSON and place it at `feda11y/static/data.json`:

```bash
wget -O feda11y/static/data.json https://www.feda11y.com/data
```

Now make a dummy file for the historical data called `feda11y/static/hist.json` and put something minimal like this in it:

```json
[{"2020-03-09": 0.2}, {"2020-03-16": 0.3}, {"2020-03-23": 0.4}, {"2020-03-30": 0.5}]
```

These files are normally pulled from cloud storage with each deploy, so it's imperative you recreate them locally before continuing.

### Run the Tests

This will verify that everything is working as expected:

```bash
coverage run -m pytest
```

It will also let you see the test coverage with:

```bash
coverage report
```

## Start the App

To start the app in development mode, set the following environment variables or create a `.env` file with the following contents:

```bash
FLASK_APP=main.py
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY="somethingsupersecret"
```

Now you can start the app with:

```bash
flask run
```

which should emit something like:

```bash
 * Serving Flask app "main.py" (lazy loading)
 * Environment: development
 * Debug mode: on
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 123-456-789
```

Go to `http://127.0.0.1:5000/` and check it out.

## Deploy

We use Heroku, which makes it as simple as:

```bash
git push -f https://heroku:$HEROKU_API_KEY@git.heroku.com/$HEROKU_APP_NAME.git master
```

where you've made a Heroku account and set the `HEROKU_API_KEY` and `HEROKU_APP_NAME` environment variables beforehand.

You can test things out locally with:

```bash
heroku local web
```

## Accessibility

Just like the [backend to this site](https://github.com/csmcallister/fed-a11y-scan/), we use [pa11y](https://github.com/pa11y/pa11y) to smoke test our site's accessibility. You can run these tests yourself downloading the `pa11y` or `pa11y-ci` tools and then starting the app with `flask run` to give yourself a live endpoint to test. Our configuration file for the a11y tests is located at [.pa11yci](https://github.com/csmcallister/fed-a11y/blob/master/.pa11yci).

If you notice any issues that aren't caught by these automated tests, please let us know by [opening an issue](https://github.com/csmcallister/fed-a11y/issues).

## Contributing

If you'd like to contribute, hop on over to our [contributing docs]((https://github.com/csmcallister/fed-a11y/blob/master/.github/CONTRIBUTING.md)).

If you've got questions, [open an issue](https://github.com/csmcallister/fed-a11y/issues).

## LICENSE

GNU General Public License. See it [here](https://github.com/csmcallister/fed-a11y/blob/master/.github/LICENSE).
