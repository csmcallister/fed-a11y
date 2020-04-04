import csv
from io import StringIO
import os

import ujson


def get_data(current_app):
    with open(os.path.join(current_app.static_folder, 'data.json'), 'r') as f:
        data = ujson.load(f)
    return data


def get_hist(current_app):
    with open(os.path.join(current_app.static_folder, 'hist.json'), 'r') as f:
        hist = ujson.load(f)
    return hist


def get_index_data(current_app):
    data = get_data(current_app)
    hist = get_hist(current_app)  
    
    n_domains_with_issues, n_domains_without_issues = count_issues(data)
    n_domains = n_domains_without_issues + n_domains_with_issues
    percent_inaccessible = round(
        (n_domains_with_issues / (n_domains)), 2) * 100
    n_domains = f'{n_domains:,}'
    data = dict(
        n_domains_with_issues=n_domains_with_issues, 
        n_domains_without_issues=n_domains_without_issues,
        percent_inaccessible=percent_inaccessible,
        n_domains=n_domains,
        hist=hist
    )

    return data


def count_issues(data):
    n_domains_with_issues = 0
    n_domains_without_issues = 0
    for domain in data:
        issues = ujson.loads(domain['issues']).get('issues')
        if issues:
            n_domains_with_issues += 1
        else:
            n_domains_without_issues += 1
    return n_domains_with_issues, n_domains_without_issues


def get_last_scan_date(current_app):
    with open(os.path.join(current_app.static_folder, 'hist.json'), 'r') as f:
        data = ujson.load(f)
    last_scan_date = list(data[-1].keys())[0]
    return last_scan_date


def subdomain_filter(data, agency, org, domain, subdomain):
    filtered_data = []
    for row in data:
        agency_match = row.get('agency').lower().strip() == agency
        org_match = row.get('organization').lower().strip() == org
        domain_match = domain in row.get('routeableUrl').lower().strip()
        subdomain_match = row.get('subdomain').lower().strip() == subdomain
        if all([agency_match, org_match, domain_match, subdomain_match]):
            filtered_data.append(row)
    
    return filtered_data


def domain_filter(data, agency, org, domain):
    filtered_data = []
    for row in data:
        agency_match = row.get('agency').lower().strip() == agency
        org_match = row.get('organization').lower().strip() == org
        domain_match = domain in row.get('routeableUrl').lower().strip()
        if all([agency_match, org_match, domain_match]):
            filtered_data.append(row)
    
    return filtered_data


def org_filter(data, agency, org):
    filtered_data = []
    for row in data:
        agency_match = row.get('agency').lower().strip() == agency
        org_match = row.get('organization').lower().strip() == org
        if all([agency_match, org_match]):
            filtered_data.append(row)
    
    return filtered_data


def agency_filter(data, agency):
    return [r for r in data if r.get('agency').lower().strip() == agency]


def data_filter(data, **kwargs):
    agency = kwargs.get('agency', '').lower().strip()
    org = kwargs.get('org', '').lower().strip()
    domain = kwargs.get('domain', '').lower().strip()
    subdomain = kwargs.get('subdomain', '').lower().strip()

    if not any([agency, org, domain, subdomain]):
        return data
    
    if subdomain:
        filtered_data = subdomain_filter(data, agency, org, domain, subdomain)
    elif domain:
        filtered_data = domain_filter(data, agency, org, domain)
    elif org:
        filtered_data = org_filter(data, agency, org)
    elif agency:
        filtered_data = agency_filter(data, agency)

    return filtered_data
    

def data_to_csv(data):
    parsed_items = []
    for item in data:
        parsed_item_rows = []
        parsed_item = dict(
            agency=item.get('agency', ''),
            organization=item.get('organization', ''),
            domain=item.get('domain', ''),
            subdomain=item.get('subdomain', ''),
            routeableUrl=item.get('routeableUrl', ''),
            scanDate=item.get('scanDate', '')
        )
            
        issues = ujson.loads(item.get('issues')).get('issues', [])
        for issue in issues:
            _parsed_item = parsed_item.copy()
            _parsed_item['context'] = issue.get('context', '')
            _parsed_item['code'] = issue.get('code', '')
            _parsed_item['message'] = issue.get('message', '')
            parsed_item_rows.append(_parsed_item)
        if not issues:
            parsed_item.update(dict(context='', code='', message=''))
            parsed_item_rows.append(parsed_item)
        parsed_items.extend(parsed_item_rows)
    
    headers = sorted(parsed_items[0].keys())
    csv_output = StringIO(newline='')
    dict_writer = csv.DictWriter(
        csv_output,
        headers,
        quoting=csv.QUOTE_NONNUMERIC
    )
    dict_writer.writeheader()
    dict_writer.writerows(parsed_items)
    csv_output.seek(0)
    
    return csv_output
