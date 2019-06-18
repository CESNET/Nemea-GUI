import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Filter } from '../shared/filter';

import { Subject } from 'rxjs';
import { FiltersService } from '../services/filters.service';
import { SavedFilter } from '../shared/saved-filter';

@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

    constructor(private filterService: FiltersService)
    {}

    createFilterShown: boolean = false;
    dateStartAt: string;
    dateEndAt: string;
    dateFilter: Filter[] = [];
    ruleSet: Filter[] = [];
    filterText: string = "";
    filterSet: boolean = false;
    filterActive: boolean = false;
    clearFilterSubject: Subject<void> = new Subject<void>();
    selectedFilterValue;

    savedFilterNames: string[] = [];
    savedFiltersLoading: boolean = false;
    loadedFilter: SavedFilter;
    initFilter: Subject<SavedFilter> = new Subject<SavedFilter>();

    @Output() filterChanged = new EventEmitter<Filter[]>();

    ngOnInit() {
        this.loadFilterNames();
    }

    loadFilterNames() {
        this.savedFiltersLoading = true;
        this.filterService.loadSavedFilterNames().subscribe(
            names => {
                if(names.length !== 0) {
                    this.savedFilterNames = names[0]['names'];
                }
                this.savedFiltersLoading = false;
            });
    }

    loadFilter(name: string) {
        this.filterService.loadSavedFilter(name)
            .subscribe(filter => {
                this.loadedFilter = filter;
                this.setFilter(filter.filter);
                this.initFilter.next(filter);
            });
    }

    showCreateFilterDialog() {
        this.createFilterShown = true;
    }

    hideCreateFilterDialog() {
        this.createFilterShown = false;
    }

    setFilter(filter: Filter[]) {
        this.filterSet = true;
        this.ruleSet = filter;
        this.filterText = "";
        this.ruleSetChanged();
        let i = 0;
        for(let f of filter) {
            if(i != 0) {
                this.filterText += " AND ";
            }
            this.filterText += f.field + " ";
            if(f.field2) {
                this.filterText += f.field2 + " ";
            }
            if(f.predicate == "$exists") {
                this.filterText += f.value == 1 ? "is set" : "is not set";
            }
            else {
                this.filterText += Filter.translatePredicate(f.predicate) + " " + f.value.toString();
            }

            i++;
        }
    }

    delegateFilterChange() {
        this.generateDateFilters();
        this.filterActive = true;
        this.filterChanged.emit(this.ruleSet.concat(this.dateFilter));
    }

    generateDateFilters() {
        this.dateFilter = [];
        if(this.dateStartAt) {
            let f: Filter = {
                field: "DetectTime",
                field2: undefined,
                predicate: "$gte",
                value: this.dateStartAt
            };
            this.dateFilter.push(f);
        }
        if(this.dateEndAt) {
            let f: Filter = {
                field: "DetectTime",
                field2: undefined,
                predicate: "$lte",
                value: this.dateEndAt
            };
            this.dateFilter.push(f);
        }
    }

    ruleSetChanged() {
        this.filterActive = false;
        this.selectedFilterValue = null;
    }

    clearFilter() {
        this.dateStartAt = undefined;
        this.dateEndAt = undefined;
        this.dateFilter = [];
        this.ruleSet = [];
        this.filterSet = false;
        this.clearFilterSubject.next();
        this.filterChanged.emit(this.ruleSet);
    }

    addSavedFilter(name: string) {
        if(this.savedFilterNames.indexOf(name) === -1) {
            this.savedFilterNames.push(name);
        }

    }

}
