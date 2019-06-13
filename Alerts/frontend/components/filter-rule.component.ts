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
    inputValue: string;

    selectedPredicateValue: string;


    @Input() ruleIndex: number;
    @Input() ruleFilter: Filter;

    @Output() ruleFilterChanged = new EventEmitter<Filter>();
    @Output() removeRule = new EventEmitter<number>();

    ngOnInit() {
        this.filterConfig = filters;
        this.selectedRule = this.ruleFilter;
        this.filterToSelectedItem(this.ruleFilter);
        this.inputValue = this.ruleFilter.value.toString();
    }

    filterToSelectedItem(filter: Filter) {
        if(filter.field2 !== undefined) {
            this.selectedFilter = this.filterConfig.find(x => (x['field'] == filter.field && x['field2'] == filter.field2));
        }
        else {
            this.selectedFilter = this.filterConfig.find(x => (x['field'] == filter.field ));
        }

        this.selectedPredicateValue = filter.predicate;

    }

    changeActiveFilter() {
        this.selectedRule.field = this.selectedFilter['field'];
        this.selectedRule.field2 = this.selectedFilter['field2'];
        this.emitChanges();
    }

    changeSelectedPredicate(predicate: string) {
        this.selectedRule.predicate = predicate;
        this.emitChanges();
    }

    changeValue() {
       this.emitChanges();
    }

    private emitChanges() {
        this.convertInputValue();
        this.ruleFilterChanged.emit(this.selectedRule);
    }

    private convertInputValue() {
        if(this.selectedPredicateValue === "$in" || this.selectedPredicateValue === "$nin") {
            if(this.selectedFilter['type'] == 'number') {
                let tmp = [];
                for(let i of this.inputValue.split(',')) {
                    tmp.push(+i);
                }
                this.ruleFilter.value = tmp;
            }
            else {
                this.ruleFilter.value = this.inputValue.split(',');
            }

        }
        else if(this.selectedFilter['type'] == 'number') {
            this.ruleFilter.value = +this.inputValue; // + converts to number
        }
        else {
            this.selectedRule.value = this.inputValue;
        }
    }

    removeSelf() {
        this.removeRule.emit(this.ruleIndex);
    }

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
