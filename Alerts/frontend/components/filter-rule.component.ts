import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { filters } from '../filter-config';
import { Filter } from '../shared/filter';

@Component({
    selector: 'filter-rule',
    templateUrl: './filter-rule.component.html',
    styleUrls: ['./filter-rule.component.scss']
})
export class FilterRuleComponent implements OnInit
{
    constructor() {}

    filterConfig: object[];
    selectedFilter: object;
    selectedRule: Filter;

    @Input() ruleIndex: number;
    @Input() ruleFilter: Filter;

    @Output() ruleFilterChanged = new EventEmitter<Filter>();

    ngOnInit() {
        this.filterConfig = filters;
        this.selectedRule = this.ruleFilter;
    }

    changeActiveFilter() {
        this.selectedRule.field = this.selectedFilter['field'];
        this.selectedRule.field2 = this.selectedFilter['field2'];
        this.ruleFilterChanged.emit(this.selectedRule);
    }

    //  $eq, $ne, $lt, $lte, $gt, $gte, $in, $nin
    // TODO: in range
    predicateToName(predicate: string): string {
        switch(predicate) {
            /*case "$eq":
                return "is equal to";
            case "$ne":
                return "is not equal to";
            case "$lt":
                return "is less than";
            case "$lte":
                return "is less or equal to";
            case "$gt":
                return "is greater than";
            case "$gte":
                return "is greater or equal to";*/
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
            default:
                return predicate;
        }
    }



}
