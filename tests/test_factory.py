from feda11y import create_app
from config_test import TestConfig


def test_config():
    assert not create_app().testing
    assert create_app(config_class=TestConfig).testing
