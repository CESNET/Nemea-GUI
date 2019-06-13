import { Component, Output, EventEmitter } from '@angular/core';
import { Filter } from '../shared/filter';


@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent {

    constructor()
    {}

    createFilterShown: boolean = false;
    dateStartAt: string;

    @Output() filterChanged = new EventEmitter<Filter[]>();

    showCreateFilterDialog() {
        this.createFilterShown = true;
    }

    hideCreateFilterDialog() {
        this.createFilterShown = false;
    }

    delegateFilterChange(filter: Filter[]) {
        this.filterChanged.emit(filter);
    }

    changeStartAtDate(){
        console.log(typeof(this.dateStartAt));
        console.log(this.dateStartAt);
    }

}
