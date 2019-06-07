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
alerts_db = dbConnector("alerts")
alerts_coll = alerts_db.db[config['alerts']['collection']]


@auth.required()
def get_number_of_all_records():
    number_of_records = alerts_coll.find().count()
    return json.dumps(number_of_records)


@auth.required()
def get_limited_number_of_records():
    page = int(request.args.get('page'))
    items = int(request.args.get('items'))
    first_item = items * (page - 1)

    ids = [x["_id"] for x in list(alerts_coll.find({}, {"_id": 1}).skip(first_item).limit(items))]
    alerts_coll.update_many({"_id": {"$in": ids}, "Status": 3}, {"$set": {"Status": 0}})
    alerts_coll.update_many({"_id": {"$in": ids}, "Status": {"$exists": False}}, {"$set": {"Status": 3}})

    query = {"_id": 0, "DetectTime": 1, "Category": 1, "Source": 1, "Target": 1, "FlowCount": 1, "Status": 1, "ID": 1}
    records = list(alerts_coll.find({}, query).skip(first_item).limit(items))

    for record in records:
        if "Source" in record.keys():
            record["Source"] = [x["IP4"] if "IP4" in x.keys() else x["IP6"] for x in record["Source"] if not x.keys().isdisjoint(("IP4", "IP6"))]
            if record["Source"]:
                record["Source"] = record["Source"][0][0]
        if "Target" in record.keys():
            record["Target"] = [x["IP4"] if "IP4" in x.keys() else x["IP6"] for x in record["Target"] if not x.keys().isdisjoint(("IP4", "IP6"))]
            if record["Target"]:
                record["Target"] = record["Target"][0]

    return json.dumps(records)


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
            alerts_coll.update_many({"ID": {"$in": ids}}, {"$set": {"Status": 1}})
        elif status == 2:
            alerts_coll.update_many({"ID": {"$in": ids}}, {"$set": {"Status": 2}})
        return json.dumps({"success": True, "errCode": 200})
    except Exception:
        return json.dumps({"success": False, "errCode": 500})


@auth.required()
def delete_alerts():
    data = request.json
    ids = data['ids']
    try:
        alerts_coll.delete_many({"ID": {"$in": ids}})
        return json.dumps({"success": True, "errCode": 200})
    except Exception:
        return json.dumps({"success": False, "errCode": 500})

