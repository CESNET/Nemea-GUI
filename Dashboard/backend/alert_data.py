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
    if category == 'any':
        events = db_coll.find({'DetectTime': {"$gt": format_datetime(str(time))}}).count()
    else:
        events = db_coll.find({'Category': category, 'DetectTime': {"$gt": format_datetime(str(time))}}).count()
    return json.dumps(events)


def get_top_flow_alerts(count, time_window, db_coll):
    time = time_window_to_datetime(time_window)
    result = list(db_coll.find({'DetectTime': {'$gt': format_datetime(str(time))}},
                               {'_id': 0, 'DetectTime': 1, 'Category': 1, 'FlowCount': 1})
                  .sort('FlowCount', -1)
                  .limit(count))
    return json.dumps(result)


def get_pie_chart_data(category, time_window, db_coll):
    series = []
    time_filter = format_datetime(str(time_window_to_datetime(time_window)))
    labels = list(db_coll.find({'DetectTime': {'$gt': time_filter}}).distinct(category))
    labels = labels[:15]  # trim to max 15 results to prevent frontend lags
    for l in labels:
        series.append(int(db_coll.find({category: l, 'DetectTime': {'$gt': time_filter}}).count()))
    return json.dumps({'labels': labels, 'series': series})


def get_bar_chart_data(category, time_window, aggregation_period, db_coll, flow_count=False):
    segments = int(time_window * 60 / aggregation_period)
    labels = []
    series = []
    window_delta = datetime.timedelta(hours=time_window) / segments
    time_filter = format_datetime(str(time_window_to_datetime(time_window)))
    items = list(db_coll.find({'DetectTime': {'$gt': time_filter}}).distinct(category))
    item_count = len(items)
    if item_count > 15:
        item_count = 15
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
            if cnt != 0:
                current_labels.append(items[c])
            else:
                current_labels.append("")
            prev_end = end
        series.append(current_series)
        labels.append(current_labels)
    return json.dumps({'labels': labels, 'series': series})


def time_window_to_datetime(time_window):
    return datetime.datetime.now() - datetime.timedelta(hours=time_window)


def format_datetime(datetime_string):
    time = dateutil.parser.parse(datetime_string)
    time.strftime("%Y-%m-%d %H:%M:%S")
    time = time.replace(tzinfo=None).replace(microsecond=0)
    return str(time)
