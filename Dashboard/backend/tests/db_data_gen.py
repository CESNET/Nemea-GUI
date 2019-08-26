import random
from random import getrandbits
from ipaddress import IPv4Address
from datetime import datetime, timedelta
import uuid
import sys


def cleanup_db(db_coll):
    db_coll.delete_many({})


def gen_n_alerts(n, db_coll):
    gen = alert_data_generator()
    print("Generating alerts")
    if n > 100:
        i = 0
        for y in range(100):
            alert_list = []
            for x in range(int(n / 100)):
                alert_list.append(next(gen))
            db_coll.insert_many(alert_list)
            i += 1
            print("%", end=' ')
            sys.stdout.write('\r')
            j = int(i / 5)
            sys.stdout.write("[%-20s] %d%%" % ('=' * j, i))
            sys.stdout.flush()
    else:
        alert_list = []
        for x in range(n):
            alert_list.append(next(gen))
        db_coll.insert_many(alert_list)
    print("")
    print(n, " alerts inserted")


def alert_data_generator():
    categories = ["Attempt.Login", "Anomaly.Connection", "Recon.Scanning", "Availibility.DDoS", "Intrusion.Botnet"]
    while True:
        bits = getrandbits(32)  # generates an integer with 32 random bits
        bits2 = getrandbits(32)
        addr = IPv4Address(bits)  # instances an IPv4Address object from those bits
        addr2 = IPv4Address(bits2)
        dt = gen_datetime()
        yield {"Category": [random.choice(categories)], "CeaseTime": "2017-01-05T16:11:11Z",
               "FlowCount": random.randint(1, 100000), "CreateTime": dt,
               "Description": "Scan of SIP user accounts", "DetectTime": dt,
               "EventTime": "2017-01-05T16:06:32Z", "Format": "IDEA0", "ID": str(uuid.uuid4()),
               "Node": [{"Name": "sipbf", "SW": ["Nemea", "brute_force_detector"], "Type": ["Flow", "Statistical"]}],
               "Source": [{"IP4": [str(addr)], "Port": [random.randint(1, 65500)], "Proto": ["udp", "sip"]}],
               "Target": [{"IP4": [str(addr2)], "Port": [random.randint(1, 65500)], "Proto": ["udp", "sip"]}]}


def gen_datetime(min_year=datetime.now().year - 5, max_year=datetime.now().year):
    # generate a datetime in format yyyy-mm-dd hh:mm:ss.000000
    start = datetime(min_year, 1, 1, 00, 00, 00)
    years = max_year - min_year + 1
    end = datetime.now()
    return str(start + (end - start) * random.random())
