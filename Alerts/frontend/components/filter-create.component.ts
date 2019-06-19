import { Component, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Filter } from '../shared/filter';
import { Observable } from 'rxjs';
import { FiltersService } from '../services/filters.service';
import { SavedFilter } from '../shared/saved-filter';
import { FilterConfigService } from '../services/filter-config.service';

@Component({
    selector: 'filter-create',
    templateUrl: './filter-create.component.html',
    styleUrls: ['./filter-create.component.scss']
})
export class FilterCreateComponent implements OnInit, OnDestroy {
    constructor(
        private filterService: FiltersService,
        private filterConfigService: FilterConfigService
    ) {
    }

    filterConfig: object;
    filterRules: Filter[] = [];
    saving: boolean = false;
    private filterClearEventListener: any;
    private filterLoadEventListener: any;
    newFilterName: string;
    error: boolean = false;
    saved: boolean;
    removedRules: Filter[] = [];

    ngOnInit() {
        this.filterConfigService.loadFilterConfig().subscribe(
            filters => this.filterConfig = filters
        );
        this.addRule();
        this.filterClearEventListener = this.clearFilter.subscribe(() => this.clearRules());
        this.filterLoadEventListener = this.filterLoaded.subscribe(filters => {
            this.filterRules = filters.filter;
            this.newFilterName = filters.name;
        });
        this.error = false;
        this.saved = false;
    }


    ngOnDestroy() {
        this.filterClearEventListener.unsubscribe();
    }

    @Input() showDialog: boolean = false;
    @Input() clearFilter: Observable<void>;
    @Input() filterLoaded: Observable<SavedFilter>;

    @Output() dialogClosed = new EventEmitter<boolean>();
    @Output() filterRulesChanged = new EventEmitter<Filter[]>();
    @Output() filterSaved = new EventEmitter<string>();


    hideDialog() {
        this.dialogClosed.emit(true);
    }

    addRule() {
        let f: Filter = {
            field: '',
            predicate: '',
            value: ''
        };
        this.filterRules.push(f);
        this.saved = false;
    }

    setFilterRule(rule: Filter, idx: number) {
        this.filterRules[idx] = rule;

    }

    addInitializedRule(f: Filter) {
        this.filterRules.push(f);
    }

    finishRuleEditing() {
        this.removedRules = [];
        this.filterRulesChanged.emit(this.filterRules);
        this.hideDialog();
    }

    removeRule(idx: number) {
        this.removedRules.push(this.filterRules[idx]);
        this.filterRules.splice(idx, 1);
        this.saved = false;
    }

    clearRules() {
        this.filterRules = [];
        this.newFilterName = "";
        this.filterRulesChanged.emit(this.filterRules);
    }

    cancelChanges() {
        this.filterRules = this.filterRules.concat(this.removedRules);
        this.hideDialog();
        this.removedRules = [];
    }

    saveFilter() {
        this.removedRules = [];
        this.saving = true;
        this.filterService.saveFilter(this.filterRules, this.newFilterName)
            .subscribe(result => {
                    this.saving = false;
                    if (result && result['success'] == true) {
                        this.saved = true;
                        this.filterSaved.emit(this.newFilterName);
                    } else {
                        this.error = true;
                    }
                },
                error => {
                    this.saving = false;
                    this.error = true
                },
                () => {
                    this.saving = false;});
    }

    saveAndUseFilter() {
        this.removedRules = [];
        this.saving = true;
        this.filterService.saveFilter(this.filterRules, this.newFilterName)
            .subscribe(result => {
                    this.saving = false;
                    if (result && result['success'] == true) {
                        this.saved = true;
                        this.filterSaved.emit(this.newFilterName);
                        this.finishRuleEditing();
                    } else {
                        this.error = true;
                    }
                },
                error => {
                    this.saving = false;
                    this.error = true
                },
                () => {
                    this.saving = false;});
    }
}
