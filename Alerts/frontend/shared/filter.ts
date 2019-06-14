//[{'field': 'columnName', 'field2': 'submergedColumnName', 'predicate': '$...', 'value': ['...',...]}, ...]

export class Filter {
    field: string;
    field2?: string;
    predicate: string;
    value: string | number | string[] | number[] | boolean;

    /**
     * Convert from filter to human readable
     */
    static translatePredicate(predicate: string): string {
        switch(predicate) {
            case "$eq":
                return "=";
            case "$ne":
                return "!=";
            case "$lt":
                return "<";
            case "$lte":
                return "<=";
            case "$gt":
                return ">";
            case "$gte":
                return ">=";
            case "$in":
                return "is one of";
            case "$nin":
                return "is not one of";
            case "$exists":
                return "is set";
            case "$nexists":
                return "is not set";
            default:
                return predicate;
        }
    }

    /**
     * Convert from human readable to filter
     */
    static compilePredicate(predicate: string): string {
        switch(predicate) {
            case "=":
                return "$eq";
            case "!=":
                return "$ne";
            case "<":
                return "$lt";
            case "<=":
                return "$lte";
            case ">":
                return "$gt";
            case ">=":
                return "$gte";
            default:
                return predicate;
        }

    }
}

