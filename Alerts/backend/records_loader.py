# Own classes to connect and work with database
from liberouterapi import db, auth, config
from liberouterapi.dbConnector import dbConnector

# MongoDB data manipulation
import json
from flask import request

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
    alerts_coll.update_many({"_id": {"$in": ids}, "status": {"$exists": False}}, {"$set": {"Status": 3}})
    alerts_coll.update_many({"_id": {"$in": ids}, "status": 3}, {"$set": {"Status": 0}})

    query = {"_id": 0, "DetectTime": 1, "Category": 1, "Source": 1, "Target": 1, "FlowCount": 1, "Status": 1, "ID": 1}
    records = list(alerts_coll.find({}, query).skip(first_item).limit(items))

    return json.dumps(records)
