# Own classes to connect and work with database
from liberouterapi import db, auth, config
from liberouterapi.dbConnector import dbConnector

# MongoDB data manipulation
import json
from flask import request

# Connect and select alerts collection
alerts_db = dbConnector('alerts')
alerts_coll = alerts_db.db[config['alerts']['collection']]


@auth.required()
def set_confirmed():
    data = request.json
    ids = data['ids']
    return set_status(ids, 0)


@auth.required()
def set_false_positive():
    data = request.json
    ids = data['ids']
    return set_status(ids, 1)


def set_status(ids, status):
    try:
        alerts_coll.update_many({'ID': {'$in': ids}}, {'$set': {'Status': status, "New": False}})
        return json.dumps({"success": True, "errCode": 200})
    except Exception:
        return json.dumps({"success": False, "errCode": 500})


@auth.required()
def delete_alerts():
    data = request.json
    ids = data['ids']
    try:
        alerts_coll.delete_many({'ID': {'$in': ids}})
        return json.dumps({"success": True, "errCode": 200})
    except Exception:
        return json.dumps({"success": False, "errCode": 500})


@auth.required()
def get_detail_of_alert():
    record_id = request.args.get('id')
    alerts_coll.update_one({'ID': record_id}, {"$set": {"New": False}})
    record = alerts_coll.find_one({'ID': record_id}, {'_id': 0})
    return json.dumps(record)


def set_status_comment(record_id):
    data = request.json
    status_comment = data['StatusComment']
    try:
        alerts_coll.update_many({'ID': record_id}, {'$set': {'StatusComment': status_comment}})
        return json.dumps({"success": True, "errCode": 200})
    except Exception:
        return json.dumps({"success": False, "errCode": 500})
