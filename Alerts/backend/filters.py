# Own classes to connect and work with database
from liberouterapi import db, auth, config
from liberouterapi.dbConnector import dbConnector

# MongoDB data manipulation
import json
from flask import request

# Connect and select alerts collection
alerts_db = dbConnector("alerts")
alerts_coll = alerts_db.db[config['alerts']['collection']]


# request query blueprint
# field_name: TargetIP4, TargetIP6, TargetPort, TargetProto,
#        SourceIP4, TargetIP6, SourcePort, TargetProto,
#        Category, ...
# predicate: gt, lt, eq, ne, range
# field_value: [single number], [first number, second number]

# @auth.required
def get_filtered_alerts(titlef, scopef, valuef):
    # data = request.json
    # title = data['title']
    # scope = data['scope']
    # value = data['value']
    request_filter = [{'field_name': 'CreateTime', 'predicate': 'ne', 'field_value': '2016-03-23T16:50:47Z'}]

    query = filter_parser(request_filter)
    print(alerts_coll.find_one(query))


def filter_parser(request_filter):
    query = '{"$and": [{'
    for x in request_filter:
        query = query + x['field_name'] + ': { "$' + x['predicate'] + '":' + x['field_value'] + '}'
    query = query + '}]}'
    return query

# db["mydb"].find( { "$and": [{"field": var1},{"field": {"$ne": var2}}] } )
