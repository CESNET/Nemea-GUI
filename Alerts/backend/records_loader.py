# Own classes to connect and work with database
from liberouterapi import db, auth, config
from liberouterapi.dbConnector import dbConnector

# MongoDB data manipulation
import json
from flask import request

# Status enum
# Undecided = 0
# Confirmed = 1
# FalsePositive = 2
# New = 3

# Connect and select alerts collection
alerts_db = dbConnector('alerts')
alerts_coll = alerts_db.db[config['alerts']['collection']]


@auth.required()
def get_limited_number_of_records():
    page = int(request.args.get('page'))
    items = int(request.args.get('items'))
    first_item = items * (page - 1)

    ids = [x["_id"] for x in list(alerts_coll.find({}, {"_id": 1}).skip(first_item).limit(items).sort("DetectTime", -1))]
    alerts_coll.update_many({"_id": {"$in": ids}, "Status": 3}, {"$set": {"Status": 0}})
    alerts_coll.update_many({"_id": {"$in": ids}, "Status": {"$exists": False}}, {"$set": {"Status": 3}})

    project = {'_id': 0, 'DetectTime': 1, 'Category': 1, 'FlowCount': 1, 'Status': 1, 'ID': 1,
               'Source': {'$setUnion': ['$Source.IP4', '$Source.IP6']},
               'Target': {'$setUnion': ['$Target.IP4', '$Target.IP6']}}
    records = list(alerts_coll.aggregate([{'$project': project}, {'$sort': {'DetectTime': -1}},
                                          {'$skip': first_item}, {'$limit': items}]))

    numbers_of_records = alerts_coll.find().count()

    for record in records:
        if record['Source'] is not None:
            record['Source'] = sum(record['Source'], [])
            record['Source'] = list(set(record['Source']))
        else:
            record['Source'] = []
        if record['Target'] is not None:
            record['Target'] = sum(record['Target'], [])
            record['Target'] = list(set(record['Target']))
        else:
            record['Target'] = []
        print(record)

    return json.dumps({"count": numbers_of_records, "data": records})


@auth.required()
def set_confirmed():
    data = request.json
    ids = data['ids']
    return set_status(ids, 1)


@auth.required()
def set_false_positive():
    data = request.json
    ids = data['ids']
    return set_status(ids, 2)


def set_status(ids, status):
    try:
        if status == 1:
            alerts_coll.update_many({'ID': {'$in': ids}}, {'$set': {'Status': 1}})
        elif status == 2:
            alerts_coll.update_many({'ID': {'$in': ids}}, {'$set': {'Status': 2}})
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
