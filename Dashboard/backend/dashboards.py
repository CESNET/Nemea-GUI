import json
import pymongo

def get_all_dashboards(user, dashboards_coll):
    dbq = dashboards_coll.find({'user': user}, {'dashboard': 1})
    cnt = dashboards_coll.count({'user': user})
    result = []
    if dbq is None or cnt == 0:
        dashboards_coll.insert_one({'user': user, 'dashboard': "Default"})
        result = ["Default"]
    else:
        for x in dbq:
            result.append(x['dashboard'])

    return json.dumps(result)


def add_dashboard(user, dashboard_name, dashboards_coll):
    # ToDo: Check if dashboard name is unique for the user
    try:
        dashboards_coll.insert_one({'user': user, 'dashboard': dashboard_name, 'data': []})
        success = True
    except pymongo.errors.PyMongoError as e:
        success = False
    return json.dumps({"success": success})


def get_dashboard_data(user, dashboard_name, dashboards_coll):
    result = dashboards_coll.find_one({'user': user, 'dashboard': dashboard_name}, {'data': 1})
    if result is None or 'data' not in result:
        return json.dumps([])
    else:
        return json.dumps(result['data'])


def modify_dashboard(user, dashboard_name, data, dashboards_coll):
    try:
        x = dashboards_coll.update_one({'user': user, 'dashboard': dashboard_name}, {'$set': {'data': data}})
        success = x.matched_count > 0
    except pymongo.errors.PyMongoError:
        success = False
    return json.dumps({"success": success})
