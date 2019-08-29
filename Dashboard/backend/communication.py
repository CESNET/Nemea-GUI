from liberouterapi import db, auth, config
from liberouterapi.dbConnector import dbConnector
import json
from flask import request
from .dashboards import *
from .alert_data import *

dashboard_db = dbConnector('dashboard', provider='mongodb', config={'database': config['dashboard']['database']})
dashboards_coll = dashboard_db.db[config['dashboard']['collectionDashboards']]
data_coll = dashboard_db.db[config['dashboard']['collectionData']]


@auth.required()
def load_users_dashboard_list():
    return get_all_dashboards(get_username_from_session(), dashboards_coll)


@auth.required()
def add_users_dashboard():
    data = request.json
    name = data['dashboard']
    return add_dashboard(get_username_from_session(), name, dashboards_coll)


@auth.required()
def get_grid(grid_name):
    return get_dashboard_data(get_username_from_session(), grid_name, dashboards_coll)


@auth.required()
def edit_grid(grid_name):
    data = request.json
    new_grid = data['data']
    print(new_grid)
    return modify_dashboard(get_username_from_session(), grid_name, new_grid, dashboards_coll)


@auth.required()
def get_available_categories():
    return get_available_alert_categories(data_coll)


@auth.required()
def get_alert_cnt():
    return get_alert_count(request.args.get('category'), int(request.args.get('time_window')), data_coll)


@auth.required()
def get_top_alerts():
    return get_top_flow_alerts(int(request.args.get('count')), int(request.args.get('time_window')), data_coll)


@auth.required()
def get_pie_graph():
    return get_pie_chart_data(request.args.get('category'), int(request.args.get('time_window')), data_coll)


@auth.required()
def get_bar_graph():
    return get_bar_chart_data(request.args.get('category'), int(request.args.get('time_window')),
                              int(request.args.get('aggregation')), data_coll, request.args.get('flowCount') == 'true')


@auth.required()
def get_username_from_session():
    session = auth.lookup(request.headers.get('lgui-Authorization', None))
    return session['user'].username
