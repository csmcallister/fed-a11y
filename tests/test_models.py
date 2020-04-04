import csv
from datetime import datetime

import pytest

import fixtures
from feda11y import models


def test_get_data(app):
    data = models.get_data(app)
    assert isinstance(data, list)


def test_get_hist(app):
    hist = models.get_hist(app)
    assert isinstance(hist, list)


def test_get_index_data(app):
    data = models.get_index_data(app)
    assert isinstance(data, dict)


def test_count_issues(app):
    n_w_issues, n_wo_issues = models.count_issues(fixtures.data)
    assert n_w_issues == 1 and n_wo_issues == 1


def test_get_last_scan_date(app):
    last_scan_date = models.get_last_scan_date(app)
    _ = datetime.strptime(last_scan_date, "%Y-%m-%d")
    assert True


@pytest.mark.parametrize("kwargs, expected", [
    ({'agency': 'foo'}, [fixtures.data[0]]),
    ({'agency': 'foo', 'org': 'bar'}, [fixtures.data[0]]),
    ({'agency': 'foo', 'org': 'bar', 'domain': 'biz'}, [fixtures.data[0]]),
    ({'agency': 'foo', 'org': 'bar', 'domain': 'biz', 'subdomain': 'baz'}, [fixtures.data[0]]),  # noqa: E501
    ({'agency': 'baz'}, list()),
    ({'org': 'biz'}, list()),
    ({'domain': 'bar'}, list()),
    ({'subdomain': 'foo'}, list())
])
def test_data_filter(app, kwargs, expected):
    filtered_data = models.data_filter(fixtures.data, **kwargs)
    assert filtered_data == expected


def test_data_to_csv(app):
    csv_ouput = models.data_to_csv(fixtures.data)
    reader = csv.reader(csv_ouput)
    headers = next(reader)
    assert headers == fixtures.expected_csv_headers