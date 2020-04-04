data = [{
    'agency': 'foo', 
    'organization': 'bar',
    'domain': 'biz',
    'subdomain': 'baz',
    'numberOfErrors': '1',
    'routeableUrl': 'https://baz.biz.gov/',
    'issues': '{"documentTitle":"hello world","pageUrl":"https://baz.biz.gov/","issues":[{"code":"Section508.O.NoSuchID","type":"error","typeCode":1,"message":"descriptive message","context":"<a href=\\"#main-content\\" class=\\"visually-hidden focusable skip-link\\">\\n    Skip to main content\\n</a>","selector":"html > body > a","runner":"htmlcs","runnerExtras":{}}]}',
    'scanDate': '2020-03-29'
    },
    {
    'agency': 'abc', 
    'organization': 'def',
    'domain': 'ghi',
    'subdomain': 'jkl',
    'numberOfErrors': '1',
    'routeableUrl': 'https://jkl.ghi.gov/',
    'issues': '{"documentTitle":"hello world","pageUrl":"https://jki.ghi.gov/","issues":[]}',
    'scanDate': '2020-03-29'
    }
]

expected_csv_headers = [
    'agency', 'code', 'context', 'domain', 'message', 'organization', 
    'routeableUrl', 'scanDate', 'subdomain'
]