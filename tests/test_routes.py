import pytest

import fixtures
from feda11y.main.routes import extension_handler


def test_index(client):
    response = client.get('/')
    assert b"Fed A11y" in response.data


def test_about(client):
    response = client.get('/about')
    assert b"About Fed A11y" in response.data


def test_faq(client):
    response = client.get('/faq')
    assert b"faq" in response.data


@pytest.mark.parametrize("route, expected", [
    ('/analytics', b'Analytics'),
    ('/analytics?agency=AMTRAK', b'AMTRAK'),
    ('/analytics?org=White%20House', b'White House'),
    ('/analytics?domain=whitehouse', b'whitehouse'),
    ('/analytics?subdomain=events', b'events')
])
def test_analytics(client, route, expected):
    response = client.get(route)
    assert expected in response.data


@pytest.mark.parametrize("ext, expected", [
    ('csv', 'text/csv; charset=utf-8'),
    ('json', 'application/json'),
])
def test_extension_handler(ext, expected):
    result = extension_handler(fixtures.data, ext)
    assert result.headers.get('Content-Type') == expected


def test_404(client):
    response = client.get('/thiswill404')
    assert b"404 Not Found" in response.data
