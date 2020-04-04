import os

from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))


class Config(object):
    LOG_TO_STDOUT = True  # else logs to logs/fed-a11y.log
    SENTRY_DSN = os.environ.get('SENTRY_DSN')
    FLASK_ENV = os.environ.get('FLASK_ENV')
