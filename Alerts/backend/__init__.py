from liberouterapi import config
from liberouterapi.dbConnector import dbConnector
from liberouterapi.modules.module import Module

# Load Alerts configuration file if Alerts section is not present in current config
if 'alerts' not in config.config.sections():
    config.load(path=__path__[0] + '/config.ini')
    conf_path = config['alerts']

# Alerts and filters collection set up
alerts_conn = dbConnector('alerts', provider='mongodb', config={'database': config['alerts']['database']})
alerts_coll = alerts_conn.db[config['alerts']['collection']]
filters_coll = alerts_conn.db[config['alerts']['collection2']]

# Register a blueprint
alerts_bp = Module('alerts', __name__, url_prefix='/alerts', no_version=True)

from .fill_db import *
from .alerts import *
from .filters import *

# Some testing functions to fill database with random alerts and delete all records in database
# fill_db_with_n(1000000)
# delete_data_from_db()

# Get limited number of records for one page
alerts_bp.add_url_rule('/alert-page', view_func=get_limited_number_of_records, methods=['GET'])

# Set array of alerts status to confirmed
alerts_bp.add_url_rule('/set-confirmed', view_func=set_confirmed, methods=['POST'])

# Set array of alerts status to false positive
alerts_bp.add_url_rule('/set-false-positive', view_func=set_false_positive, methods=['POST'])

# Delete array of alerts
alerts_bp.add_url_rule('/delete-alerts', view_func=delete_alerts, methods=['POST'])

# Get detail of selected alert
alerts_bp.add_url_rule('/alert-detail', view_func=get_detail_of_alert, methods=['GET'])

# Set description of selected alert
alerts_bp.add_url_rule('/set-status-comment/<record_id>', view_func=set_status_comment, methods=['POST'])

# Get all alerts that fits to filter
alerts_bp.add_url_rule('/alert-filtered', view_func=get_filtered_alerts, methods=['POST'])

# Save received filter to database
alerts_bp.add_url_rule('/save-filter', view_func=save_filter, methods=['POST'])

# Load filter from database
alerts_bp.add_url_rule('/load-filter', view_func=load_filter, methods=['POST'])

# Get all filter names from db, that they seem to user
alerts_bp.add_url_rule('/filter-names', view_func=get_filter_names, methods=['GET'])
