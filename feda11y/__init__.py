import logging
from logging.handlers import RotatingFileHandler
import os

import boto3
from flask import Flask, render_template
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

from config import Config

if Config.FLASK_ENV == 'production':
    sentry_sdk.init(Config.SENTRY_DSN, integrations=[FlaskIntegration()])
    s3_client = boto3.client('s3')
    BUCKET = os.environ.get('BUCKET_NAME')
    s3_client.download_file(BUCKET, 'data.json', 'feda11y/static/data.json')
    s3_client.download_file(BUCKET, 'hist.json', 'feda11y/static/hist.json')
    

def page_not_found(e):  # pragma: no cover
    return render_template('errors/404.html'), 404


def internal_server_error(e):  # pragma: no cover
    return render_template('errors/500.html'), 500


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
        
    from feda11y.main import bp as main_bp
    app.register_blueprint(main_bp)

    app.register_error_handler(404, page_not_found)
    app.register_error_handler(500, internal_server_error)

    if not app.debug and not app.testing:  # pragma: no cover        
        if app.config['LOG_TO_STDOUT']:
            stream_handler = logging.StreamHandler()
            stream_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s '
                '[in %(pathname)s:%(lineno)d]'))
            stream_handler.setLevel(logging.INFO)
            app.logger.addHandler(stream_handler)
        
        else:
            if not os.path.exists('logs'):
                os.mkdir('logs')
            file_handler = RotatingFileHandler(
                'logs/fed-a11y.log',
                maxBytes=10240,
                backupCount=10
            )
            file_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s '
                '[in %(pathname)s:%(lineno)d]'))
            file_handler.setLevel(logging.INFO)
            app.logger.addHandler(file_handler)

        app.logger.setLevel(logging.INFO)
        app.logger.info('App startup')

    return app
