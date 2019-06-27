# Own classes to connect and work with database
from liberouterapi import db, auth, config
from liberouterapi.dbConnector import dbConnector

# Data manipulation
import json
from flask import request
import re
import dateutil.parser

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


# Received filter format
# [{'field': 'columnName', 'field2': 'submergedColumnName', 'predicate': '$...', 'value': ['...', ...]}, ...]
# 'predicate': $eq, $ne, $lt, $lte, $gt, $gte, $in, $nin, $exists


@auth.required()
def get_limited_number_of_records():
    page = int(request.args.get('page'))
    items = int(request.args.get('items'))
    return get_alerts(page, items, {})


@auth.required()
def get_filtered_alerts():
    data = request.json
    page = int(data['page'])
    items = int(data['items'])
    received_filter = data['filter']
    return get_alerts(page, items, parse_filter_to_query(received_filter))


def get_alerts(page, items, query):
    if page < 1:
        return json.dumps({"success": False, "errCode": 500})

    first_item = items * (page - 1)

    alerts_coll.update_many({"New": {"$exists": False}}, {"$set": {"New": True}})

    project = {'_id': 0, 'DetectTime': 1, 'Category': 1, 'FlowCount': 1, 'Status': 1, 'ID': 1, 'New': 1,
               'Source': {'$setUnion': ['$Source.IP4', '$Source.IP6']},
               'Target': {'$setUnion': ['$Target.IP4', '$Target.IP6']}}
    records = list(alerts_coll.aggregate([{'$match': query}, {'$project': project}, {'$sort': {'DetectTime': -1}},
                                          {'$skip': first_item}, {'$limit': items}], allowDiskUse=True))

    number_of_records = alerts_coll.find(query).count()

    for record in records:
        if record['DetectTime'] is not None:
            record['DetectTime'] = format_datetime(record['DetectTime'])
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

    return json.dumps({"count": number_of_records, "data": records})


def parse_filter_to_query(received_filter):
    query = {'$and': []}
    for x in received_filter:
        if x['predicate'] == '$exists':
            x['value'] = bool(x['value'])
        if x['predicate'] == '$wildcard':
            x['predicate'] = '$regex'
            x['value'] = parse_wildcard_to_regex(x['value'])
        expression = {x['field']: {}}
        if 'field2' in x:
            expression[x['field']] = {'$elemMatch': {x['field2']: {x['predicate']: x['value']}}}
        else:
            expression[x['field']] = {x['predicate']: x['value']}
        query['$and'].append(expression)
    return query


def parse_wildcard_to_regex(wild_card):
    wild_card = re.sub(r'\.', '\.', wild_card)
    wild_card = re.sub(r'\*', '(?:[0-9]{1,3})', wild_card)
    return '^' + wild_card + '$'


def format_datetime(datetime_string):
    datetime = dateutil.parser.parse(datetime_string)
    datetime.strftime("%Y-%m-%d %H:%M:%S")
    datetime = datetime.replace(tzinfo=None).replace(microsecond=0)
    return str(datetime)
