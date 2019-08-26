from liberouterapi import config, modules
from liberouterapi.dbConnector import dbConnector



if 'dashboard' not in config.config.sections():
    config.load(path=__path__[0] + '/config.ini')
    conf_path = config['dashboard']

# Alerts and filters collection set up
dashboard_conn = dbConnector('dashboard', provider='mongodb', config={'database': config['dashboard']['database']})
data_coll = dashboard_conn.db[config['dashboard']['collectionData']]
dashboards_coll = dashboard_conn.db[config['dashboard']['collectionDashboards']]

# dashboards_coll.delete_many({})

# Register a blueprint
dashboard_bp = modules.module.Module('dashboard', __name__, url_prefix='/dashboard', no_version=True)


from .communication import *

dashboard_bp.add_url_rule('/list', view_func=load_users_dashboard_list, methods=['GET'])
dashboard_bp.add_url_rule('/add', view_func=add_users_dashboard, methods=['POST'])

dashboard_bp.add_url_rule('/grid/<grid_name>', view_func=get_grid, methods=['GET'])
dashboard_bp.add_url_rule('/grid/<grid_name>', view_func=edit_grid, methods=['POST'])

dashboard_bp.add_url_rule('/alert-categories', view_func=get_available_categories, methods=['GET'])
dashboard_bp.add_url_rule('/alert-count', view_func=get_alert_cnt, methods=['GET'])
dashboard_bp.add_url_rule('/top-alerts', view_func=get_top_alerts, methods=['GET'])
dashboard_bp.add_url_rule('/pie-chart', view_func=get_pie_graph, methods=['GET'])
dashboard_bp.add_url_rule('/bar-chart', view_func=get_bar_graph, methods=['GET'])
