import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Filter } from '../shared/filter';
import { FilterConfigService } from '../services/filter-config.service';



@Component({
    selector: 'filter-rule',
    templateUrl: './filter-rule.component.html',
    styleUrls: ['./filter-rule.component.scss']
})
export class FilterRuleComponent implements OnInit
{
    constructor(
        private filterConfigService: FilterConfigService
    ) {}

    filterConfig: object[];
    selectedFilter: object;
    selectedRule: Filter;
    inputValue: string;

    selectedPredicateValue: string;
    helpText: string;


    @Input() ruleIndex: number;
    @Input() ruleFilter: Filter;

    @Output() ruleFilterChanged = new EventEmitter<Filter>();
    @Output() removeRule = new EventEmitter<number>();

    ngOnInit() {
        this.filterConfigService.loadFilterConfig().subscribe(config =>
            {
                this.filterConfig = config;
                this.filterToSelectedItem(this.ruleFilter);
                this.inputValue = this.ruleFilter.value.toString();
                this.createHelpText(this.selectedPredicateValue);
            });
        this.selectedRule = this.ruleFilter;
    }

    filterToSelectedItem(filter: Filter) {
        if(filter.field2 !== undefined) {
            this.selectedFilter = this.filterConfig.find(x => (x['field'] == filter.field && x['field2'] == filter.field2));
        }
        else {
            this.selectedFilter = this.filterConfig.find(x => (x['field'] == filter.field && x['field2'] == undefined));
        }

        if(filter.predicate === "$exists" && filter.value == 0) {
            this.selectedPredicateValue = "$nexists";
        }
        else {
            this.selectedPredicateValue = filter.predicate;
        }
    }

    changeActiveFilter() {
        this.selectedRule.field = this.selectedFilter['field'];
        this.selectedRule.field2 = this.selectedFilter['field2'];
        this.emitChanges();
    }

    changeSelectedPredicate(predicate: string) {
        this.selectedRule.predicate = predicate;
        this.createHelpText(predicate);
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
        if(this.selectedPredicateValue === "$exists") {
            this.ruleFilter.value = 1;
        }
        else if(this.selectedPredicateValue === "$nexists") {
            this.ruleFilter.value = 0;
            this.ruleFilter.predicate = "$exists";
        }
        else if(this.selectedPredicateValue === "$in" || this.selectedPredicateValue === "$nin") {
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

    predicateToName(predicate: string): string {
        return Filter.translatePredicate(predicate);
    }

    createHelpText(predicate: string) {
        switch(predicate) {
            case "$regex":
                this.helpText = "Use regular expressions in python format.";
                break;
            case "$wildcard":
                this.helpText = "Use format 127.0.*.* , replace any part of IP with star to ignore that part.";
                break;
            case "$in":
            case "$nin":
                this.helpText = "Enter list of possible values separated by a comma";
                break;
            default:
                this.helpText = "";
                break;
        }
    }



}
