from flask import Blueprint, redirect, request

bp = Blueprint('main', __name__)


@bp.before_app_request
def before_request():
    scheme = request.headers.get('X-Forwarded-Proto')
    if scheme and scheme == 'http' and request.url.startswith('http://'):
        url = request.url.replace('http://', 'https://', 1)
        return redirect(url, code=301)


from feda11y.main import routes  # noqa: F401