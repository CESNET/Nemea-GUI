import { Component } from '@angular/core';


@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent {

    constructor()
    {}

    createFilterShown: boolean = false;

    showCreateFilterDialog() {
        this.createFilterShown = true;
    }

    hideCreateFilterDialog() {
        this.createFilterShown = false;
    }

}
