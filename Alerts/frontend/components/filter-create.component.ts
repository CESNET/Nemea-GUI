import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import {filters} from '../filter-config';
import { Filter } from '../shared/filter';

@Component({
    selector: 'filter-create',
    templateUrl: './filter-create.component.html',
    styleUrls: ['./filter-create.component.scss']
})
export class FilterCreateComponent implements OnInit
{
    constructor() {}

    filterConfig: object;
    filterRules: Filter[] = [];
    saving: boolean = false;

    ngOnInit() {
        this.filterConfig = filters;
        this.addRule();
    }

    @Input() showDialog: boolean = false;

    @Output() dialogClosed = new EventEmitter<boolean>();
    @Output() filterRulesChanged = new EventEmitter<Filter[]>();


    hideDialog() {
        this.dialogClosed.emit(true);
    }

    addRule() {
        let f: Filter = {
            field: "",
            predicate: "",
            value: ""
        };
        this.filterRules.push(f);
    }

    setFilterRule(rule: Filter, idx: number) {
        this.filterRules[idx] = rule;
        console.log(this.filterRules);

    }

    addInitializedRule(f: Filter) {
        this.filterRules.push(f);
    }

    finishRuleEditing() {
        this.filterRulesChanged.emit(this.filterRules);
        this.hideDialog();
    }

    removeRule(idx: number) {
        this.filterRules.splice(idx, 1);
    }


}
