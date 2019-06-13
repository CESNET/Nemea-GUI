export let filters = [
    {
        "name": "Target IPv4",
        "field": "Target",
        "field2": "IP4",
        "type": "ip4",
        "predicates": ["$eq", "$ne", "$in", "$nin", "$exists", "$nexists"]
    },
    {
        "name": "Source IPv4",
        "field": "Source",
        "field2": "IP4",
        "type": "ip4",
        "predicates": ["$eq", "$ne", "$in", "$nin", "$exists", "$nexists"]
    },
    {
        "name": "Flows",
        "field": "FlowCount",
        "type": "number",
        "predicates": ["$eq", "$ne", "$lt", "$lte", "$gt", "$gte", "$in", "$nin", "$exists" ,"$nexists"]
    },
    {
        "name": "Category",
        "field": "Category",
        "type": "string",
        "predicates": ["$eq", "$ne", "$in", "$nin", "$exists", "$nexists"]
    },
    {
        "name": "Source port",
        "field": "Source",
        "field2": "Port",
        "type": "number",
        "predicates": ["$eq", "$ne", "$lt", "$lte", "$gt", "$gte", "$in", "$nin", "$exists" ,"$nexists"]
    },
    {
        "name": "Source protocol",
        "field": "Source",
        "field2": "Proto",
        "type": "string",
        "predicates": ["$eq", "$ne", "$in", "$nin", "$exists" ,"$nexists"]
    },
    {
        "name": "Target",
        "field": "Target",
        "type": "string",
        "predicates": ["$exists" ,"$nexists"]
    }
];
