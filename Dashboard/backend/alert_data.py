import json
import datetime
import dateutil.parser
from sys import getsizeof


def get_available_alert_categories(db_coll):
    categories = db_coll.find({}).distinct("Category")
    categories = ['any'] + list(categories)
    return json.dumps(categories)


def get_alert_count(category, time_window, db_coll):
    time = time_window_to_datetime(time_window)
    now = format_datetime(str(datetime.datetime.now()))
    if category == 'any':
        events = db_coll.find({'DetectTime': {"$gt": format_datetime(str(time)), '$lt': now}}).count()
    else:
        events = db_coll.find({'Category': category, 'DetectTime': {"$gt": format_datetime(str(time))}}).count()
    return json.dumps(events)


def get_top_flow_alerts(count, time_window, db_coll):
    time = time_window_to_datetime(time_window)
    now = format_datetime(str(datetime.datetime.now()))
    result = list(db_coll.find({'DetectTime': {'$gt': format_datetime(str(time)), '$lt': now}},
                               {'_id': 0, 'DetectTime': 1, 'Category': 1, 'FlowCount': 1})
                  .sort('FlowCount', -1)
                  .limit(count))
    for i in range(len(result)):
        result[i]['DetectTime'] = format_datetime(result[i]['DetectTime'])
    return json.dumps(result)


def get_pie_chart_data(category, time_window, db_coll):
    series = []
    if category == 'undefined' or category == 'any':
        category = 'Category'
    time_filter = format_datetime(str(time_window_to_datetime(time_window)))
    now = format_datetime(str(datetime.datetime.now()))
    labels = list(db_coll.find({'DetectTime': {'$gt': time_filter, '$lt': now}}).distinct(category))
    labels = labels[:15]  # trim to max 15 results to prevent frontend lags
    for l in labels:
        series.append(int(db_coll.find({category: l, 'DetectTime': {'$gt': time_filter}}).count()))
    return json.dumps({'labels': labels, 'series': series})


def get_bar_chart_data(category, time_window, aggregation_period, db_coll, flow_count=False):
    segments = int(time_window * 60 / (aggregation_period if aggregation_period > 0 else 1))
    if segments == 0:
        segments = 1
    if category == 'undefined' or category == 'any':
        category = 'Category'
    labels = []
    series = []
    window_delta = datetime.timedelta(hours=time_window) / segments
    time_filter = format_datetime(str(time_window_to_datetime(time_window)))
    now = format_datetime(str(datetime.datetime.now()))
    items = list(db_coll.find({}).distinct(category))
    item_count = len(items)
    if item_count > 15:
        item_count = 15
    elif item_count < 1:
        labels = [[]]
    for c in range(item_count):
        data = list(
            db_coll.find({'DetectTime': {'$gt': time_filter}, category: items[c]}))  # Fixme: only select required info
        current_labels = []
        current_series = []
        prev_end = datetime.datetime.now() - (window_delta * segments)
        for j in range(segments):
            cnt = 0
            begin = prev_end
            end = datetime.datetime.now() - (window_delta * (segments - (j + 1)))

            for x in data:
                try:
                    if begin < datetime.datetime.strptime(x['DetectTime'], "%Y-%m-%d %H:%M:%S.%f") <= end:
                        if not flow_count:
                            cnt += 1
                        else:
                            cnt += x['FlowCount']
                except ValueError:
                    try:
                        # There is a rare case when generated alerts will not contain microseconds
                        # This happens when microseconds are set to 0 by random number generator
                        # Usually only happens with huge data sets (around 1 000 000 alerts)
                        if begin < datetime.datetime.strptime(x['DetectTime'], "%Y-%m-%d %H:%M:%S") <= end:
                            if not flow_count:
                                cnt += 1
                            else:
                                cnt += x['FlowCount']
                    except ValueError:
                        pass
            current_series.append(cnt)
            current_labels.append(begin.strftime("%Y-%m-%d %H:%M:%S"))
            prev_end = end
        series.append({'data': current_series, 'label': items[c]})
        labels.append(current_labels)
    if len(series) == 0:
        series.append({'data': []})
    return json.dumps({'labels': labels[0], 'series': series})


def time_window_to_datetime(time_window):
    return datetime.datetime.now() - datetime.timedelta(hours=time_window)


def format_datetime(datetime_string):
    time = dateutil.parser.parse(datetime_string)
    time.strftime("%Y-%m-%d %H:%M:%S")
    time = time.replace(tzinfo=None).replace(microsecond=0)
    return str(time)
