import pytest

from feda11y import create_app
from config_test import TestConfig


@pytest.fixture
def app():
    app = create_app(config_class=TestConfig)
    yield app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def runner(app):
    return app.test_cli_runner()
