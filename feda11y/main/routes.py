import os

from flask import (
    current_app, 
    jsonify, 
    render_template, 
    Response, 
    request,
)
import ujson

from feda11y.main import bp
from feda11y import models


@bp.route('/', methods=['GET'])
def index():
    data = models.get_index_data(current_app)
    return render_template('index.html', **data)


@bp.route('/about', methods=['GET'])
def about():
    last_scan_date = models.get_last_scan_date(current_app)
    return render_template('about.html', last_scan_date=last_scan_date)


@bp.route('/data', methods=['GET'])
def data():
    ext = request.args.get('ext')
    data = models.get_data(current_app)
    data = models.data_filter(data, **request.args)
    if ext:
        # this is a request to download the data
        return extension_handler(data, ext)
    else:
        # this is a request to create a view
        return jsonify(data)


@bp.route('/analytics', methods=['GET'])
def analytics():
    last_scan_date = models.get_last_scan_date(current_app)
    kwargs = request.args.to_dict()
    try:
        group = list(kwargs.values())[0]
    except IndexError:
        group = False
    kwargs.update(dict(group=group, last_scan_date=last_scan_date))
    
    return render_template('analytics.html', **kwargs)


@bp.route('/faq', methods=['GET'])
def faq():
    last_scan_date = models.get_last_scan_date(current_app)
    return render_template('faq.html', last_scan_date=last_scan_date)


@bp.route('/sitemap.xml')
def site_map():
    pages = [p.replace(".html", "") for p in os.listdir('feda11y/templates')]
    excludes = {'errors', 'includes', 'base', 'sitemap.xml', 'index'}
    base_url = "https://feda11y.com"
    pages = [f'{base_url}/{p}' for p in pages if p not in excludes]
    return render_template('sitemap.xml', pages=pages, base_url=base_url)


def extension_handler(data, ext):
    if ext == "csv":
        csv_output = models.data_to_csv(data)
        response = Response(
            csv_output,
            mimetype="text/csv",
            headers={
                "Content-disposition": "attachment; filename=data.csv",
                "Content-Type": 'text/csv'}
        )
    else:
        response = Response(
            ujson.dumps(data),
            mimetype="application/json",
            headers={
                "Content-disposition": "attachment; filename=data.json",
                "Content-Type": 'application/json'}
        ) 
    
    return response
