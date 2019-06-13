# Own classes to connect and work with database
from liberouterapi import db, auth, config
from liberouterapi.dbConnector import dbConnector

# MongoDB data manipulation
import json
from flask import request

# Connect and select alerts collection
alerts_db = dbConnector('alerts')
alerts_coll = alerts_db.db[config['alerts']['collection']]

# Received filter format
# [{'field': 'columnName', 'field2': 'submergedColumnName', 'predicate': '$...', 'value': ['...', ...]}, ...]
# 'predicate': $eq, $ne, $lt, $lte, $gt, $gte, $in, $nin, $exists


@auth.required()
def get_filtered_alerts():
    data = request.json
    received_filter = data['filter']
    page = int(data['page'])
    items = int(data['items'])
    first_item = items * (page - 1)

    alerts_coll.update_many({"New": {"$exists": False}}, {"$set": {"New": True}})

    query = parse_filter_to_query(received_filter)
    print(query)
    project = {'_id': 0, 'DetectTime': 1, 'Category': 1, 'FlowCount': 1, 'Status': 1, 'ID': 1, 'New': 1,
               'Source': {'$setUnion': ['$Source.IP4', '$Source.IP6']},
               'Target': {'$setUnion': ['$Target.IP4', '$Target.IP6']}}
    records = list(alerts_coll.aggregate([{'$match': query}, {'$project': project}, {'$sort': {'DetectTime': -1}},
                                          {'$skip': first_item}, {'$limit': items}]))

    numbers_of_records = alerts_coll.find(query).count()

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

    return json.dumps({"count": numbers_of_records, "data": records})


def parse_filter_to_query(received_filter):
    query = {'$and': []}
    for x in received_filter:
        if x['predicate'] is '$exists':
            x['value'] = bool(x['value'])
        expression = {x['field']: {}}
        if 'field2' in x:
            expression[x['field']] = {'$elemMatch': {x['field2']: {x['predicate']: x['value']}}}
        else:
            expression[x['field']] = {x['predicate']: x['value']}
        query['$and'].append(expression)
    return query
