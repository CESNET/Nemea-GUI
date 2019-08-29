#!/usr/bin/python3

import pymongo
import unittest
from tests import *

import json
from dashboards import *
from alert_data import *

GENERATED_ALERT_COUNT = 1000  # How many alerts should be generated to test DB before running tests.

dbClient = pymongo.MongoClient("mongodb://localhost:27017/")
testDb = dbClient["testDb"]
testCol = testDb["tests"]
alertTestCol = testDb["testAlerts"]


class TestDashboardOperations(unittest.TestCase):
    """
        Tests for functions in dashboars.py
    """

    @staticmethod
    def tearDownClass():
        testCol.delete_many({})

    def test_empty_get(self):
        self.assertEqual(get_all_dashboards('test', testCol), json.dumps(['Default']))

    def test_insert_dashboard(self):
        self.assertEqual(add_dashboard('test', 'Test Dashboard', testCol), json.dumps({"success": True}))
        self.assertEqual(get_all_dashboards('test', testCol), json.dumps(['Default', 'Test Dashboard']))

    def test_get_data_empty(self):
        self.assertEqual(get_dashboard_data('test', 'Nonexistent', testCol), json.dumps([]))
        self.assertEqual(get_dashboard_data('test', 'Default', testCol), json.dumps([]))
        self.assertEqual(get_dashboard_data('test', 'Test Dashboard', testCol), json.dumps([]))

    def test_insert_data(self):
        self.assertEqual(modify_dashboard('test', 'Nonexistent', '[]', testCol), json.dumps({'success': False}))
        self.assertEqual(modify_dashboard('test', 'Test Dashboard',
                                          ["testData"],
                                          testCol), json.dumps({'success': True}))
        self.assertEqual(get_dashboard_data('test', 'Test Dashboard', testCol),
                         json.dumps(["testData"]))


class TestAlertOperations(unittest.TestCase):
    """
        Tests for functions in alert_data.py
    """

    @staticmethod
    def setUpClass():
        gen_n_alerts(GENERATED_ALERT_COUNT, alertTestCol)

    @staticmethod
    def tearDownClass():
        cleanup_db(alertTestCol)

    def test_get_categories(self):
        valid_test_categories = ["any", "Attempt.Login", "Anomaly.Connection", "Recon.Scanning", "Availibility.DDoS",
                                 "Intrusion.Botnet"]
        self.assertTrue(
            set(valid_test_categories + json.loads(get_available_alert_categories(alertTestCol)))
                .issubset(set(valid_test_categories)))

    def test_event_count(self):
        # Should find all alerts - 52595 hours == 6 years
        self.assertEqual(get_alert_count('any', 52595, alertTestCol), json.dumps(GENERATED_ALERT_COUNT))
        self.assertTrue(0 <= json.loads(get_alert_count('Attempt.Login', 52595, alertTestCol)) <= GENERATED_ALERT_COUNT)

    def test_top_flows(self):
        data = json.loads(get_top_flow_alerts(3, 52595, alertTestCol))
        self.assertEqual(len(data), 3)
        self.assertTrue(data[0]['FlowCount'] >= data[1]['FlowCount'] >= data[2]['FlowCount'])

    def test_pie_chart_data(self):
        data = json.loads(get_pie_chart_data('Category', 52595, alertTestCol))
        self.assertEqual(sum(data['series']), GENERATED_ALERT_COUNT)
        self.assertEqual(len(data['series']), len(data['labels']))

    def test_pie_chart_category_overflow(self):
        self.assertEqual(len(json.loads(get_pie_chart_data('FlowCount', 52595, alertTestCol))['labels']), 15)

    def test_bar_chart_data(self):
        data = json.loads(get_bar_chart_data('Category', 52595, 600000, alertTestCol))
        self.assertEqual(len(data['labels']), len(data['series']))
        total = 0
        series_len = 0
        labels_len = 0
        for x in data['series']:
            total += sum(x['data'])
            series_len += len(x)
        for x in data['labels']:
            labels_len += len(x)
        self.assertEqual(total, GENERATED_ALERT_COUNT)
        self.assertEqual(labels_len, series_len)

    def test_bar_chart_edge_case(self):
        self.assertEqual(get_bar_chart_data('Category', 0, 1, alertTestCol), json.dumps({'labels': [], 'series': []}))


if __name__ == "__main__":
    unittest.main()
