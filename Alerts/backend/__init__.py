from liberouterapi import config
from liberouterapi.dbConnector import dbConnector
from liberouterapi.modules.module import Module

# Load Alerts configuration file if Alerts section is not present in current config
if "alerts" not in config.config.sections():
    config.load(path = __path__[0] + '/config.ini')
    conf_path = config['alerts']

# We need collection for Alerts to be set up
alerts_conn = dbConnector("alerts", provider="mongodb", config={'database': config['alerts']['database']})
alerts_coll = alerts_conn.db[config['alerts']['collection']]

# Register a blueprint
alerts_bp = Module('alerts', __name__, url_prefix='/alerts', no_version=True)

from .fill_db import *
from .records_loader import *

# pomocne funkce pro docasne testovani
# fill_db_with_data()
# print(get_number_of_all_records())
# print(get_limited_number_of_records(2, 3))
# delete_data_from_db()

# Get number of all records in database
alerts_bp.add_url_rule('/alert-count', view_func=get_number_of_all_records, methods=['GET'])

# Get limited number of records for one page
alerts_bp.add_url_rule('/alert-page', view_func=get_limited_number_of_records, methods=['GET'])

# Set array of alerts status to confirmed
alerts_bp.add_url_rule('/set-confirmed', view_func=set_confirmed, methods=['POST'])

# Set array of alerts status to false positive
alerts_bp.add_url_rule('/set-false-positive', view_func=set_false_positive, methods=['POST'])

# Delete array of alerts
alerts_bp.add_url_rule('/delete-alerts', view_func=delete_alerts, methods=['POST'])

# Get detail of selected alert
alerts_bp.add_url_rule('/alert-detail', view_func=get_detail_of_alert, methods=['POST'])
