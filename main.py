from feda11y import create_app
from feda11y import models

app = create_app()


@app.shell_context_processor
def make_shell_context():
    '''Make the data objects available in flask shell'''
    data = models.get_data(app)
    hist = models.get_hist(app)
    index_data = models.get_index_data(app)
    last_scan_date = models.get_last_scan_date(app)
    objects = dict(
        data=data,
        hist=hist,
        index_data=index_data,
        last_scan_date=last_scan_date)
    
    return objects
