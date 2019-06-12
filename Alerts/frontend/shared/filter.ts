//[{'field': 'columnName', 'field2': 'submergedColumnName', 'predicate': '$...', 'value': ['...',...]}, ...]

export class Filter {
    field: string;
    field2?: string;
    predicate: string;
    value;
}
