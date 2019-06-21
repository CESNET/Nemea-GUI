# Nemea GUI
This is a collection of [Liberouter GUI](https://github.com/CESNET/liberouter-gui) modules for the Nemea Framework.

# Installation
1. Install Liberouter GUI ([Quick start](https://github.com/CESNET/liberouter-gui#quick-start))
2. Copy modules you want to use from this repo to `modules` folder in Liberouter GUI


# Modules
## Nemea
 Allows you to configure new NEMEA Supervisor sysrepo edition that uses sysrepo as it's configuration datastore.
 
 **Currently under development and not working**
 
## Alerts
Previously called Nemea Events.

 Module for displaying Nemea security alerts from database.
 Allows you to filter Alerts based on any information contained in alert.
 
 Module uses frontend caching to display data from backend faster. 
 This means, that module is useable even with slower load times.
 Module have been tested to work on up to 5 million alerts in local DB.
 Please make sure, that your database can send alerts quickly enough as to not trigger HTTP timeout.
 While testing, we started seeing problems around 10 million alerts on local DB with 4 GB RAM and Intel i7-6500U processor.
 
 ### Testing your database system
 We recommend testing your database system before using this module in real environment.
 Included in `backend` folder is file `fill-db.py`, that can generate random alerts.
 
 **If your database is not empty, make sure to create backup before testing!**
 
 You can fill your database with random alerts using function `fill_db_with_n(number_of_alerts)`.
 Simply open file `backend/__init.py__` and add `fill_db_with_n(1000000)` to the end of file. Then restart liberouter gui backend.
 
 You can then remove all alerts from database by calling `delete_data_from_db()` in the same file.
 **This function will remove all alerts from database, including those not generated by testing files!**
 
 We recommend testing this modules with 1,000,000 and then 10,000,000 alerts, as alert count
 may reach this number in real environment given enough time. If he module runs smoothly with 10 million alerts in DB,
 your database system is ready for use. 
 If not, we recommend limiting the nubmer of alerts in DB to reasonable number.
 Around 1 million should be working for any mid-range servers. You can do this
 by removing old alerts.
 
 If your database is still too slow, you can remove sorting by date before displaying data.
 This limits usability of this module as you have to manually search for new alerts,
 but significantly improves performance. If you make sure when creating alerts that
 database stays sorted, you don't need sotring while displaying.
 You can remove sorting by editing file `backend/alerts.py`
 In function `get_alerts()` replace
 ```python
records = list(alerts_coll.aggregate([{'$match': query}, {'$project': project}, {'$sort': {'DetectTime': -1}},
                                          {'$skip': first_item}, {'$limit': items}], allowDiskUse=True)) 
```
with 
```python 
records = list(alerts_coll.aggregate([{'$match': query}, {'$project': project}, 
                                          {'$skip': first_item}, {'$limit': items}], allowDiskUse=True))
```
 
 
 ### Filter config
  Filter generator reads configuration file to see, which fields 
  is user allowed to use to filter alerts.
  The configuration file is located in `Alerts/assets/filters.json` and should be changed
  based on your needs.
  
 Example filter can be set like this:
 ```json 
{
    "name": "Target IPv4",
    "field": "Target",
    "field2": "IP4",
    "type": "ip4",
    "predicates": ["$eq", "$ne", "$in", "$nin", "$exists", "$nexists", "$wildcard", "$regex"]
} 
```
Where: 
- `name` is displayed in GUI in dropdown menu when user selects filters
- `field` is alert property
- `field2` can be missing and is used for filtering by nested properties
- `type` can be `string`, `number`, `ip4` or `ip6` and is used to determine data type.
Any other value in `type` will be represented as string
- `predicates` specifies allowed actions for filter. See [predicates](#predicates)

Note: `"type": "ip4"` and `"type": "ip6"` is 
currently represented as a string with no added features and can be safely replaced with `"type": "string"`.

The above filter will look for this field in alert:
```json 
{ 
    "Target": 
    {
        "IP4": "0.0.0.0"
    } 
}
```

#### Predicates
Predicates are displayed in the second dropdown menu in filter creation window.
Predicates specify,  which operations can be performed on given field in filter.

**Valid predicates are:**
- `"$eq"` - field is equal to given value
- `"$ne"` - field is not equal to given value
- `"$lt"` - field is smaller than given value
- `"$lte"` - field is smaller or equal to given value
- `"$gt"` - field is greater than given value
- `"$gte"` - field is greater or equal to given value
- `"$in"` - field is equal to one of given comma separated values
- `"$nin` - field is not equal to any of given comma separated values
- `"$exists"` - field is in alert
- `"$nexists"` - field is not in alert
- `"$wildcard"` - Field is equal to address with stars replacing certain parts of address.
 E.g. `127.0.*.*` will match any address starting with 127.0. Mainly used for IPv4 addresses, but can be used on any field.
 Stars are replaced with regular expression matching number in range 0-999.
- `"$regex"` - field matches given regular expression

If you use invalid predicate, it will be displayed in GUI, but most likely will not return any results.

