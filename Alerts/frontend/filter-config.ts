export let filters = [
    {
        "name": "Target IPv4",
        "field": "Target",
        "field2": "IP4",
        "type": "ip4",
        "predicates": ["$eq", "$ne", "$in", "$nin"]
    },
    {
        "name": "Source IPv4",
        "field": "Source",
        "field2": "IP4",
        "type": "ip4",
        "predicates": ["$eq", "$ne", "$in", "$nin"]
    },
    {
        "name": "Flows",
        "field": "FlowCount",
        "type": "number",
        "predicates": ["$eq", "$ne", "$lt", "$lte", "$gt", "$gte", "$in", "$nin"]
    }
];
