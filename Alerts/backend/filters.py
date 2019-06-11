# Own classes to connect and work with database
from liberouterapi import db, auth, config
from liberouterapi.dbConnector import dbConnector

# MongoDB data manipulation
import json
from flask import request

# Connect and select alerts collection
alerts_db = dbConnector("alerts")
alerts_coll = alerts_db.db[config['alerts']['collection']]

# Received filter format
# [{'field': 'collumName', 'field2': 'submergedCollumName', 'predicate': '$...', 'value': '...'}, ...]
# 'predicate': $eq, $ne, $lt, $lte, $gt, $gte


# @auth.required
def get_filtered_alerts():
    data = request.json
    received_filter = data['filter']

    # received_filter1 = [{'field': 'CreateTime', 'predicate': '$eq', 'value': '2016-03-23T16:50:47Z'}]
    # received_filter2 = [{'field': 'Target', 'field2': 'Port', 'predicate': '$gt', 'value': 5000}]
    # received_filter3 = [{'field': 'Target', 'field2': 'Port', 'predicate': '$gt', 'value': 5000},
    #                    {'field': 'Target', 'field2': 'Port', 'predicate': '$lt', 'value': 5100}]

    query = parse_filter_to_query(received_filter)
    print(query)
    for x in alerts_coll.find(query):
        print(x)


def parse_filter_to_query(received_filter):
    query = {'$and': []}
    for x in received_filter:
        expression = {x['field']: {}}
        if 'field2' in x:
            expression[x['field']] = {'$elemMatch': {x['field2']: {x['predicate']: x['value']}}}
        else:
            expression[x['field']] = {x['predicate']: x['value']}
        query['$and'].append(expression)
    return query

