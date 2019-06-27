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
    dateStartAt: any;
    dateEndAt: any;
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
                this.filterText += " AND \n";
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

    removeSavedFilter(name: string) {
        if(this.savedFilterNames.indexOf(name) !== -1) {
            this.savedFilterNames.splice(this.savedFilterNames.indexOf(name), 1);
        }
    }

    clearDates() {
        this.dateStartAt = undefined;
        this.dateEndAt = undefined;
        this.filterActive = false;
    }

    setLastHour() {
        this.filterActive = false;
        let d = new Date();
        this.dateEndAt = FilterComponent.toDateString(d);
        this.dateStartAt = FilterComponent.toDateString(
            new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() - 1, d.getMinutes())
        );
    }

    setToday() {
        this.filterActive = false;
        let d = new Date();
        this.dateEndAt = FilterComponent.toDateString(d);
        this.dateStartAt = FilterComponent.toDateString(
            new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1, d.getHours(), d.getMinutes())
        );
    }

    setLastWeek() {
        this.filterActive = false;
        let d = new Date();
        this.dateEndAt = FilterComponent.toDateString(d);
        this.dateStartAt = FilterComponent.toDateString(
            new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7,0, 0)
        );
    }

    private static toDateString(date: Date): string {
        return (date.getFullYear().toString() + '-'
            + ("0" + (date.getMonth() + 1)).slice(-2) + '-'
            + ("0" + (date.getDate())).slice(-2))
            + 'T' + date.toTimeString().slice(0,5);
    }

    private static todayToMidnight(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0)
    }

}
