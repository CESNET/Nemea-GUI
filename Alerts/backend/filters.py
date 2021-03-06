# Own classes to connect and work with database
from liberouterapi import db, auth, config
from liberouterapi.dbConnector import dbConnector

# MongoDB data manipulation
import json
from flask import request

# Connect and select filters collection
filters_db = dbConnector('alerts')
filters_coll = filters_db.db[config['alerts']['collection2']]


@auth.required()
def save_filter():
    data = request.json
    name = data['name']
    received_filter = data['filter']

    session = auth.lookup(request.headers.get('lgui-Authorization', None))
    user = session['user'].username

    filter_doc = {"name": name, "user": user, "filter": received_filter}

    try:
        if not received_filter:
            filters_coll.delete_one({'name': name, 'user': user})
            return json.dumps({"success": True, "errCode": 200})

        filters_coll.update_one({'name': name}, {'$set': filter_doc}, upsert=True)
        return json.dumps({"success": True, "errCode": 200})
    except Exception:
        return json.dumps({"success": False, "errCode": 500})


@auth.required()
def load_filter():
    data = request.json
    name = data['name']
    session = auth.lookup(request.headers.get('lgui-Authorization', None))
    user = session['user'].username

    record = filters_coll.find_one({'name': name, 'user': user}, {'_id': 0, 'user': 0})
    print('load', record)

    return json.dumps(record)


@auth.required()
def get_filter_names():
    session = auth.lookup(request.headers.get('lgui-Authorization', None))
    user = session['user'].username

    records = list(filters_coll.aggregate([{'$group': {'_id': user, 'names': {'$push': '$name'}}},
                                           {'$project': {'_id': 0, 'names': 1}}]))
    return json.dumps(records)


@auth.required()
def delete_filter():
    data = request.json
    name = data['name']
    session = auth.lookup(request.headers.get('lgui-Authorization', None))
    user = session['user'].username

    try:
        filters_coll.delete_one({'name': name, 'user': user})
        return json.dumps({"success": True, "errCode": 200})
    except Exception:
        return json.dumps({"success": False, "errCode": 500})
