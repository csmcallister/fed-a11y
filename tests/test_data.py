import csv
from io import StringIO

import pytest
import ujson

import fixtures


def test_data(client):
    response = client.get('/data')
    data = ujson.loads(response.data)
    assert isinstance(data, list)


@pytest.mark.parametrize("ext, expected", [
    ('csv', fixtures.expected_csv_headers),
    ('json', None),  # not actually expected
    ('foo', None)]  # not actually expected
)
def test_data_download(client, ext, expected):
    response = client.get(f'/data?ext={ext}')
    data = response.data
    if ext == 'csv':
        with StringIO(data.decode()) as f:
            reader = csv.reader(f)
            headers = next(reader)
        assert headers == expected
    else:
        data = ujson.loads(data)
        assert isinstance(data, list)
